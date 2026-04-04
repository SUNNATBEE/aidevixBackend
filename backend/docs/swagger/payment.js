/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: 💳 To'lov tizimi — Payme va Click / Система оплаты
 * 
 * /api/payments/create:
 *   post:
 *     summary: To'lov yaratish / Создать платеж
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               provider:
 *                 type: string
 *                 enum: [payme, click]
 *     responses:
 *       200:
 *         description: Payment URL returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 * 
 * /api/payments/verify/{id}:
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
