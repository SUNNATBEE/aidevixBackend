/**
 * @swagger
 * tags:
 *   - name: Subscriptions
 *     description: 📡 Instagram va Telegram obuna tekshiruvi / Проверка подписок
 * 
 * /api/subscriptions/status:
 *   get:
 *     summary: Foydalanuvchining joriy obuna holatini olish / Текущий статус подписок
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Muaffaqiyatli / Успешно
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionStatus'
 * 
 * /api/subscriptions/verify-telegram:
 *   post:
 *     summary: Telegram obunani tekshirish / Проверить Telegram
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Obuna tasdiqlandi / Подписка подтверждена
 * 
 * /api/subscriptions/verify-instagram:
 *   post:
 *     summary: Instagram obunani tekshirish / Проверить Instagram
 *     description: |
 *       Hozirda mock backend (avto-tasdiqlash) tasdiqlaydi.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: ahmadjon_dev
 *     responses:
 *       200:
 *         description: Obuna tasdiqlandi / Подтверждено
 */
