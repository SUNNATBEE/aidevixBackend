const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verify2FALogin,
  googleAuth,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  getReferralStats,
  claimDailyReward,
  forgotPassword,
  verifyCode,
  resetPassword,
  changePassword,
  verifyEmail,
  verifyEmailPublic,
  resendVerification,
  resendVerificationPublic,
  reauth,
  deleteMyAccount,
} = require('../controllers/authController');
const {
  setup2FA,
  enable2FA,
  disable2FA,
  regenerateBackupCodes,
} = require('../controllers/twoFactorController');
const { authenticate } = require('../middleware/auth');
const captchaCheck = require('../middleware/captchaCheck');
const { requireRecentReauth } = require('../middleware/stepUp');
const {
  otpLimiter,
  loginLimiter,
  registerLimiter,
  refreshLimiter,
  dailyRewardLimiter,
  verifyEmailLimiter,
  googleLimiter,
  totpLimiter,
  reauthLimiter,
} = require('../middleware/rateLimiter');

// Public — limiters tight, CSRF exempt; CAPTCHA on register/login/forgot.
router.post('/register', registerLimiter, captchaCheck, register);
router.post('/login', loginLimiter, captchaCheck, login);
router.post('/2fa/verify-login', totpLimiter, verify2FALogin);
router.post('/google', googleLimiter, googleAuth);
router.post('/refresh-token', refreshLimiter, refreshToken);
router.post('/forgot-password', otpLimiter, captchaCheck, forgotPassword);
router.post('/verify-code', otpLimiter, verifyCode);
router.post('/reset-password', otpLimiter, resetPassword);
router.post('/resend-verification-public', otpLimiter, resendVerificationPublic);
router.post('/verify-email-public', otpLimiter, verifyEmailPublic);

// Private
router.post('/logout', authenticate, logout);
// FIX [LOW]: Barcha qurilmalardan chiqish — tokenVersion++ qiladi, barcha sessionlarni o'chiradi.
router.post('/logout-all', authenticate, logoutAll);
router.put('/change-password', authenticate, reauthLimiter, changePassword);
router.post('/daily-reward', authenticate, dailyRewardLimiter, claimDailyReward);
router.get('/me', authenticate, getMe);
router.get('/referrals', authenticate, getReferralStats);
router.post('/verify-email', authenticate, verifyEmailLimiter, verifyEmail);
router.post('/resend-verification', authenticate, verifyEmailLimiter, resendVerification);

// Step-up reauth + GDPR right-to-erasure
router.post('/reauth', authenticate, reauthLimiter, reauth);
router.delete('/me', authenticate, requireRecentReauth, deleteMyAccount);

// 2FA management (authenticated)
router.post('/2fa/setup', authenticate, setup2FA);
router.post('/2fa/enable', authenticate, enable2FA);
router.post('/2fa/disable', authenticate, reauthLimiter, disable2FA);
router.post('/2fa/backup-codes', authenticate, totpLimiter, regenerateBackupCodes);

module.exports = router;
