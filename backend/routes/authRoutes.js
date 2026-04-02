const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getMe, forgotPassword, verifyCode, resetPassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { otpLimiter } = require('../middleware/rateLimiter');

// ════════════════════════════════════════════════════════════════
// POST /api/auth/register
// ════════════════════════════════════════════════════════════════
router.post('/register', register);

// ════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ════════════════════════════════════════════════════════════════
router.post('/login', login);

// ════════════════════════════════════════════════════════════════
// POST /api/auth/refresh-token
// ════════════════════════════════════════════════════════════════
router.post('/refresh-token', refreshToken);

// ════════════════════════════════════════════════════════════════
// FORGOT PASSWORD FLOW
// ════════════════════════════════════════════════════════════════
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/verify-code', otpLimiter, verifyCode);
router.post('/reset-password', resetPassword);

// ════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// ════════════════════════════════════════════════════════════════
router.post('/logout', authenticate, logout);

// ════════════════════════════════════════════════════════════════
// GET /api/auth/me
// ════════════════════════════════════════════════════════════════
router.get('/me', authenticate, getMe);

module.exports = router;
