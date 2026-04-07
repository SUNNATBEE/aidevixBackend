const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  refreshToken, 
  logout, 
  getMe, 
  getReferralStats,
  claimDailyReward,
  forgotPassword, 
  verifyCode, 
  resetPassword 
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { otpLimiter, authLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/verify-code', otpLimiter, verifyCode);
router.post('/reset-password', otpLimiter, resetPassword);

// Private
router.post('/logout', authenticate, logout);
router.post('/daily-reward', authenticate, claimDailyReward);
router.get('/me', authenticate, getMe);
router.get('/referrals', authenticate, getReferralStats);

module.exports = router;
