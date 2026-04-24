const express = require('express');
const router = express.Router();
const {
  register,
  login,
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
  resendVerification,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  otpLimiter,
  loginLimiter,
  registerLimiter,
  refreshLimiter,
  dailyRewardLimiter,
  verifyEmailLimiter,
  googleLimiter,
} = require('../middleware/rateLimiter');

// Public — limiters tight, CSRF exempt
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/google', googleLimiter, googleAuth);
router.post('/refresh-token', refreshLimiter, refreshToken);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/verify-code', otpLimiter, verifyCode);
router.post('/reset-password', otpLimiter, resetPassword);

// Private
router.post('/logout', authenticate, logout);
router.put('/change-password', authenticate, changePassword);
router.post('/daily-reward', authenticate, dailyRewardLimiter, claimDailyReward);
router.get('/me', authenticate, getMe);
router.get('/referrals', authenticate, getReferralStats);
router.post('/verify-email', authenticate, verifyEmailLimiter, verifyEmail);
router.post('/resend-verification', authenticate, verifyEmailLimiter, resendVerification);

module.exports = router;
