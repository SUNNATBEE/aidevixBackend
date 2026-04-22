/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: 💳 To'lov tizimi — Payme va Click / Система оплаты
 * 
 * /api/payments/initiate:
 *   post:
 *     summary: To'lovni boshlash (URL olish) / Инициация платежа (получить URL)
 *     description: |
 *       🇺🇿 Payme yoki Click orqali to'lov uchun URL/Checkout ma'lumotlarini qaytaradi.
 *       🇷🇺 Возвращает URL/данные чекаута для оплаты через Payme или Click.
 *
 *       **📱 React Native:** Webview orqali to'lov sahifasini ochish uchun.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, provider]
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f7a8b9c0d2"
 *               provider:
 *                 type: string
 *                 enum: [payme, click]
 *                 example: "payme"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 paymentUrl:
 *                   type: string
 * 
 * /api/payments/my:
 *   get:
 *     summary: Mening to'lovlarim tarixi / Моя история платежей
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/payments/{id}/status:
 *   get:
 *     summary: To'lov holatini tekshirish / Проверить статус платежа
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
 *         description: Success
 */
