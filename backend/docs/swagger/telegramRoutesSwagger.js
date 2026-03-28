/**
 * @swagger
 * tags:
 *   name: Telegram
 *   description: |
 *     🤖 **Telegram bot webhook**
 *
 *     Telegram bot foydalanuvchi hisobini Aidevix ga ulash uchun ishlatiladi.
 *
 *     ### Qanday ishlaydi:
 *     1. Foydalanuvchi Telegram bot'ga `/start <mongoUserId>` yuboradi
 *     2. Bot webhook bu endpoint'ni chaqiradi
 *     3. `telegramUserId` va `telegramChatId` User modelga saqlanadi
 *     4. Foydalanuvchiga tasdiqlash xabari yuboriladi
 *
 *     ### Webhook register qilish:
 *     ```
 *     GET https://api.telegram.org/bot{TOKEN}/setWebhook?url={BACKEND_URL}/api/telegram/webhook
 *     ```
 *
 *     ### Muhim:
 *     - Bu endpoint faqat Telegram serverlari tomonidan chaqiriladi
 *     - Frontend bu endpoint'ni to'g'ridan-to'g'ri chaqirmaydi
 *     - Har doim 200 status qaytaradi (Telegram talabi)
 */

/**
 * @swagger
 * /api/telegram/webhook:
 *   post:
 *     summary: 🤖 Telegram webhook qabul qilish
 *     description: |
 *       Telegram Update ob'ektini qabul qiladi.
 *       Faqat `/start <mongoUserId>` komandasi ishlov beriladi.
 *
 *       **Muhim**: Telegram har doim 200 status kutadi.
 *       Xatolik bo'lsa ham 200 qaytariladi.
 *     tags: [Telegram]
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: object
 *                 properties:
 *                   chat:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 123456789
 *                   from:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 987654321
 *                   text:
 *                     type: string
 *                     example: "/start 65f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Webhook qabul qilindi (har doim 200)
 */
