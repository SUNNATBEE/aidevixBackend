const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const { makeStore, getRedisClient } = require('../config/redis');

// Distributed rate limiting:
//  - REDIS_URL set  → counters live in Redis (Upstash); shared across all instances.
//  - REDIS_URL unset → MemoryStore per instance. OK for dev / single-process; in prod
//    on Railway with N replicas the effective limit is N × configured value.
if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
  console.warn('⚠️  REDIS_URL not set in production — rate limits are per-instance only.');
}

const jsonMessage = (msg) => ({ success: false, message: msg });

// IPv6-safe IP key (express-rate-limit 8.x requirement)
const ipKey = (req, res) => ipKeyGenerator(req, res);

const baseOpts = (prefix) => ({
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore(prefix),
});

// Umumiy API limit
const apiLimiter = rateLimit({
  ...baseOpts('api'),
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: jsonMessage('Juda ko\'p so\'rov. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  keyGenerator: ipKey,
});

// Umumiy auth namespace limit — pragmatik
const authLimiter = rateLimit({
  ...baseOpts('auth'),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: jsonMessage('Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  keyGenerator: ipKey,
});

// Login uchun qattiq limit: per IP + per email kombinatsiyasi
const loginLimiter = rateLimit({
  ...baseOpts('login'),
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: jsonMessage('Juda ko\'p login urinishi. Iltimos 15 daqiqadan so\'ng urinib ko\'ring.'),
  keyGenerator: (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    return `${ipKey(req, res)}|${email}`;
  },
  skipSuccessfulRequests: true,
});

// Register uchun IP asosida
const registerLimiter = rateLimit({
  ...baseOpts('register'),
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: jsonMessage('Juda ko\'p ro\'yxatdan o\'tish urinishi. 1 soatdan so\'ng urinib ko\'ring.'),
  keyGenerator: ipKey,
});

// Refresh token uchun yumshoqroq limit (har 15 daqiqada chaqiriladi)
const refreshLimiter = rateLimit({
  ...baseOpts('refresh'),
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: jsonMessage('Juda ko\'p token yangilash. Bir oz kutib turing.'),
  keyGenerator: ipKey,
});

const paymentLimiter = rateLimit({
  ...baseOpts('payment'),
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: jsonMessage('To\'lov uchun juda ko\'p so\'rov.'),
  keyGenerator: ipKey,
});

const uploadLimiter = rateLimit({
  ...baseOpts('upload'),
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: jsonMessage('Upload uchun juda ko\'p so\'rov.'),
  keyGenerator: ipKey,
});

// OTP (forgot password / verify code) — IP + email
const otpLimiter = rateLimit({
  ...baseOpts('otp'),
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: jsonMessage('Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  keyGenerator: (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    return `${ipKey(req, res)}|${email || 'anon'}`;
  },
});

// Daily reward limiter
const dailyRewardLimiter = rateLimit({
  ...baseOpts('daily'),
  windowMs: 60 * 1000,
  max: 5,
  message: jsonMessage('Juda ko\'p so\'rov. 1 daqiqadan so\'ng qayta urinib ko\'ring.'),
  keyGenerator: (req, res) => (req.user?._id ? String(req.user._id) : ipKey(req, res)),
});

// Email verify kod tekshirish / qayta yuborish — user asosida
const verifyEmailLimiter = rateLimit({
  ...baseOpts('verify'),
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: jsonMessage('Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  keyGenerator: (req, res) => (req.user?._id ? String(req.user._id) : ipKey(req, res)),
});

// Google OAuth — per-IP, qisman yumshoq (Google o'zi bot himoyasini bajaradi)
const googleLimiter = rateLimit({
  ...baseOpts('google'),
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: jsonMessage('Juda ko\'p Google login urinishi. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  keyGenerator: ipKey,
});

// 2FA verify — IP-based brute-force guard (TOTP 6-digit = 10^6 codes, 30s window)
// Per-IP, not per-challenge: each login issues a fresh challengeId so per-challenge keying
// would defeat the limit entirely.
const totpLimiter = rateLimit({
  ...baseOpts('totp'),
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: jsonMessage('Juda ko\'p 2FA urinishi. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  keyGenerator: ipKey,
});

// Bug / sayt xatoligi xabarlari — spam oldini olish
const bugReportLimiter = rateLimit({
  ...baseOpts('bug'),
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: jsonMessage('Soatiga 5 tadan ortiq bug xabari yuborib bo\'lmaydi.'),
  keyGenerator: (req) => (req.user?._id ? String(req.user._id) : ipKey(req)),
});

module.exports = {
  apiLimiter,
  authLimiter,
  loginLimiter,
  registerLimiter,
  refreshLimiter,
  paymentLimiter,
  uploadLimiter,
  otpLimiter,
  dailyRewardLimiter,
  verifyEmailLimiter,
  googleLimiter,
  totpLimiter,
  bugReportLimiter,
  _redisClient: getRedisClient,
};
