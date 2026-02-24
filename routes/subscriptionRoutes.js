const express = require('express');
const router = express.Router();
const { verifyInstagram, verifyTelegram, getSubscriptionStatus } = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');

router.post('/verify-instagram', authenticate, verifyInstagram);
router.post('/verify-telegram', authenticate, verifyTelegram);
router.get('/status', authenticate, getSubscriptionStatus);

module.exports = router;
