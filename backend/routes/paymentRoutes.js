const express = require('express');
const router  = express.Router();
const { initiatePayment, paymentCallback, getMyPayments } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: 💳 To'lov tizimi (Payme / Click)
 */

/**
 * @swagger
 * /api/payments/initiate:
 *   post:
 *     summary: 💳 To'lovni boshlash
 *     description: |
 *       Pullik kursga to'lov linkini olish. Provider: payme yoki click.
 *       Qaytarilgan `paymentUrl` ga foydalanuvchini yo'naltiring.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId:
 *                 type: string
 *               provider:
 *                 type: string
 *                 enum: [payme, click]
 *                 default: payme
 *     responses:
 *       201:
 *         description: To'lov boshlandi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 payment:
 *                   _id: "paymentId"
 *                   amount: 349000
 *                   provider: "payme"
 *                   status: "pending"
 *                 paymentUrl: "https://checkout.paycom.uz/..."
 */
router.post('/initiate', authenticate, paymentLimiter, initiatePayment);

/**
 * @swagger
 * /api/payments/callback:
 *   post:
 *     summary: 🔔 To'lov callback (Payme/Click webhook)
 *     description: Payme yoki Click dan avtomatik chaqiriladi. To'lov muvaffaqiyatli bo'lsa enrollment yaratiladi.
 *     tags: [Payments]
 *     security: []
 *     responses:
 *       200:
 *         description: Callback qabul qilindi
 */
router.post('/callback', paymentCallback);

/**
 * @swagger
 * /api/payments/my:
 *   get:
 *     summary: 📋 Mening to'lovlarim tarixi
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: To'lovlar tarixi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 payments:
 *                   - amount: 349000
 *                     provider: "payme"
 *                     status: "completed"
 *                     paidAt: "2026-03-17T10:00:00.000Z"
 *                     courseId:
 *                       title: "React.js Frontend Development"
 */
router.get('/my', authenticate, getMyPayments);

module.exports = router;
