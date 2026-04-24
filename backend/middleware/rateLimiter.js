const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

const jsonMessage = (msg) => ({ success: false, message: msg });

// IPv6-safe IP key (express-rate-limit 8.x requirement)
const ipKey = (req, res) => ipKeyGenerator(req, res);

// Umumiy API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: jsonMessage('Juda ko\'p so\'rov. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKey,
});

// Umumiy auth namespace limit — pragmatik
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: jsonMessage('Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKey,
});

// Login uchun qattiq limit: per IP + per email kombinatsiyasi
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: jsonMessage('Juda ko\'p login urinishi. Iltimos 15 daqiqadan so\'ng urinib ko\'ring.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    return `${ipKey(req, res)}|${email}`;
  },
  skipSuccessfulRequests: true,
});

// Register uchun IP asosida
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: jsonMessage('Juda ko\'p ro\'yxatdan o\'tish urinishi. 1 soatdan so\'ng urinib ko\'ring.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKey,
});

// Refresh token uchun yumshoqroq limit (har 15 daqiqada chaqiriladi)
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: jsonMessage('Juda ko\'p token yangilash. Bir oz kutib turing.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKey,
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: jsonMessage('To\'lov uchun juda ko\'p so\'rov.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKey,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: jsonMessage('Upload uchun juda ko\'p so\'rov.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKey,
});

// OTP (forgot password / verify code) — IP + email
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: jsonMessage('Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    return `${ipKey(req, res)}|${email || 'anon'}`;
  },
});

// Daily reward limiter
const dailyRewardLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: jsonMessage('Juda ko\'p so\'rov. 1 daqiqadan so\'ng qayta urinib ko\'ring.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => (req.user?._id ? String(req.user._id) : ipKey(req, res)),
});

// Email verify kod tekshirish / qayta yuborish — user asosida
const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: jsonMessage('Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => (req.user?._id ? String(req.user._id) : ipKey(req, res)),
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
};
