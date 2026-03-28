const express = require('express');
const router = express.Router();
const { verifyInstagram, verifyTelegram, getSubscriptionStatus, setTelegramId, getRealtimeStatus, requestInstagramVerification } = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');

// ════════════════════════════════════════════════════════════════
// POST /api/subscriptions/verify-instagram
// ════════════════════════════════════════════════════════════════
router.post('/verify-instagram', authenticate, verifyInstagram);

// ════════════════════════════════════════════════════════════════
// POST /api/subscriptions/verify-telegram
// ════════════════════════════════════════════════════════════════
router.post('/verify-telegram', authenticate, verifyTelegram);

// ════════════════════════════════════════════════════════════════
// GET /api/subscriptions/status
// ════════════════════════════════════════════════════════════════
router.get('/status', authenticate, getSubscriptionStatus);
router.get('/realtime-status', authenticate, getRealtimeStatus);
router.post('/set-telegram-id', authenticate, setTelegramId);
router.post('/request-instagram-verification', authenticate, requestInstagramVerification);

module.exports = router;
