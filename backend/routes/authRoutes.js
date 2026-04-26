const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verify2FALogin,
  googleAuth,
  refreshToken,
  logout,
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
} = require('../controllers/authController');
const {
  setup2FA,
  enable2FA,
  disable2FA,
  regenerateBackupCodes,
} = require('../controllers/twoFactorController');
const { authenticate } = require('../middleware/auth');
const {
  otpLimiter,
  loginLimiter,
  registerLimiter,
  refreshLimiter,
  dailyRewardLimiter,
  verifyEmailLimiter,
  googleLimiter,
  totpLimiter,
} = require('../middleware/rateLimiter');

// Public — limiters tight, CSRF exempt
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/2fa/verify-login', totpLimiter, verify2FALogin);
router.post('/google', googleLimiter, googleAuth);
router.post('/refresh-token', refreshLimiter, refreshToken);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/verify-code', otpLimiter, verifyCode);
router.post('/reset-password', otpLimiter, resetPassword);
router.post('/resend-verification-public', otpLimiter, resendVerificationPublic);
router.post('/verify-email-public', otpLimiter, verifyEmailPublic);

// Private
router.post('/logout', authenticate, logout);
router.put('/change-password', authenticate, changePassword);
router.post('/daily-reward', authenticate, dailyRewardLimiter, claimDailyReward);
router.get('/me', authenticate, getMe);
router.get('/referrals', authenticate, getReferralStats);
router.post('/verify-email', authenticate, verifyEmailLimiter, verifyEmail);
router.post('/resend-verification', authenticate, verifyEmailLimiter, resendVerification);

// 2FA management (authenticated)
router.post('/2fa/setup', authenticate, setup2FA);
router.post('/2fa/enable', authenticate, enable2FA);
router.post('/2fa/disable', authenticate, disable2FA);
router.post('/2fa/backup-codes', authenticate, regenerateBackupCodes);

module.exports = router;
