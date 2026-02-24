const express = require('express');
const router = express.Router();
const { verifyInstagram, verifyTelegram, getSubscriptionStatus } = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/subscriptions/verify-instagram:
 *   post:
 *     summary: Verify Instagram subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: instagram_username
 *     responses:
 *       200:
 *         description: Subscription verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscription:
 *                       type: object
 *       400:
 *         description: Instagram username is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/verify-instagram', authenticate, verifyInstagram);

/**
 * @swagger
 * /api/subscriptions/verify-telegram:
 *   post:
 *     summary: Verify Telegram subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - telegramUserId
 *             properties:
 *               username:
 *                 type: string
 *                 example: telegram_username
 *               telegramUserId:
 *                 type: string
 *                 description: Telegram User ID for real-time verification
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: Subscription verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscription:
 *                       type: object
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/verify-telegram', authenticate, verifyTelegram);

/**
 * @swagger
 * /api/subscriptions/status:
 *   get:
 *     summary: Get subscription status
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscriptions:
 *                       type: object
 *                       properties:
 *                         instagram:
 *                           type: object
 *                         telegram:
 *                           type: object
 *                     hasAllSubscriptions:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/status', authenticate, getSubscriptionStatus);

module.exports = router;
