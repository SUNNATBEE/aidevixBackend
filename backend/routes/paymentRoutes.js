const express = require('express');
const router  = express.Router();
const { initiatePayment, paymentCallback, getMyPayments, getPaymentStatus, handlePayme, clickPrepare, clickComplete } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { verifyPaymeAuth, verifyClickSign } = require('../middleware/paymentVerification');

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

/**
 * @swagger
 * /api/payments/payme:
 *   post:
 *     summary: 🏦 Payme JSON-RPC webhook
 *     description: Payme to'lov tizimidan kelgan webhook. CheckPerformTransaction, CreateTransaction, PerformTransaction, CancelTransaction metodlarini qo'llab-quvvatlaydi.
 *     tags: [Payments]
 *     security: []
 *     responses:
 *       200:
 *         description: JSON-RPC javob
 */
router.post('/payme', paymentLimiter, verifyPaymeAuth, handlePayme);

/**
 * @swagger
 * /api/payments/click/prepare:
 *   post:
 *     summary: 💳 Click prepare
 *     tags: [Payments]
 *     security: []
 *     responses:
 *       200:
 *         description: Prepare javob
 */
router.post('/click/prepare', paymentLimiter, verifyClickSign, clickPrepare);

/**
 * @swagger
 * /api/payments/click/complete:
 *   post:
 *     summary: ✅ Click complete
 *     tags: [Payments]
 *     security: []
 *     responses:
 *       200:
 *         description: Complete javob
 */
router.post('/click/complete', paymentLimiter, verifyClickSign, clickComplete);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   get:
 *     summary: 📊 To'lov holati
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: To'lov holati (pending, completed, expired, cancelled)
 */
router.get('/:id/status', authenticate, getPaymentStatus);

module.exports = router;
