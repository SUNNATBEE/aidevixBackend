const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

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
// POST /api/auth/logout
// ════════════════════════════════════════════════════════════════
router.post('/logout', authenticate, logout);

// ════════════════════════════════════════════════════════════════
// GET /api/auth/me
// ════════════════════════════════════════════════════════════════
router.get('/me', authenticate, getMe);

module.exports = router;
