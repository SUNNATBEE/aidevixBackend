const express = require('express');
const router = express.Router();
const { verifyInstagram, verifyTelegram, getSubscriptionStatus } = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/subscriptions/verify-instagram:
 *   post:
 *     summary: Instagram obunasini tekshirish
 *     description: |
 *       Bu endpoint foydalanuvchining Instagram kanaliga obuna bo'lganligini tekshiradi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da accessToken yuboriladi
 *       2. Request body'da Instagram username yuboriladi
 *       3. Instagram API orqali obuna tekshiriladi
 *       4. Natija ma'lumotlar bazasiga saqlanadi
 *       
 *       **Muhim:**
 *       - Video ko'rish uchun Instagram obuna bo'lish kerak
 *       - Obuna holati real-time tekshiriladi
 *       - Agar obuna bekor qilsangiz, video ko'ra olmaysiz
 *       
 *       **Status kodlar:**
 *       - 200: Obuna tekshirildi (obuna bo'lgan yoki bo'lmagan)
 *       - 400: Username berilmagan
 *       - 401: Token noto'g'ri
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
 *     summary: Telegram obunasini tekshirish
 *     description: |
 *       Bu endpoint foydalanuvchining Telegram kanaliga obuna bo'lganligini tekshiradi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da accessToken yuboriladi
 *       2. Request body'da Telegram username va telegramUserId yuboriladi
 *       3. Telegram Bot API orqali obuna tekshiriladi
 *       4. Natija ma'lumotlar bazasiga saqlanadi
 *       
 *       **Muhim:**
 *       - telegramUserId majburiy (real-time verification uchun)
 *       - Video ko'rish uchun Telegram obuna bo'lish kerak
 *       - Obuna holati real-time tekshiriladi
 *       - Agar obuna bekor qilsangiz, video ko'ra olmaysiz
 *       
 *       **Status kodlar:**
 *       - 200: Obuna tekshirildi
 *       - 400: Username yoki telegramUserId berilmagan
 *       - 401: Token noto'g'ri
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
 *     summary: Obuna holatini olish
 *     description: |
 *       Bu endpoint foydalanuvchining Instagram va Telegram obuna holatini qaytaradi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da accessToken yuboriladi
 *       2. Foydalanuvchi obuna holati qaytariladi
 *       
 *       **Qaytarilgan ma'lumotlar:**
 *       - Instagram obuna holati (subscribed, username, verifiedAt)
 *       - Telegram obuna holati (subscribed, username, telegramUserId, verifiedAt)
 *       - hasAllSubscriptions (ikkala obuna ham bor-yo'qligi)
 *       
 *       **Muhim:**
 *       - Video ko'rish uchun ikkala obuna ham bo'lishi kerak
 *       - hasAllSubscriptions: true bo'lsa, video ko'rish mumkin
 *       
 *       **Status kodlar:**
 *       - 200: Obuna holati muvaffaqiyatli olingan
 *       - 401: Token noto'g'ri
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
