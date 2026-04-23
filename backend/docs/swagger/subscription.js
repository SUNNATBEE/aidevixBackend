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
 * 
 * /api/subscriptions/realtime-status:
 *   get:
 *     summary: Real-time obuna holati / Статус в реальном времени
 *     description: |
 *       🇺🇿 To'g'ridan-to'g'ri Telegram/Instagram API orqali tekshirish.
 *       🇷🇺 Проверка напрямую через API соцсетей.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/subscriptions/set-telegram-id:
 *   post:
 *     summary: Telegram ID ni qo'lda bog'lash / Привязать Telegram ID вручную
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
 *               telegramUserId:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/subscriptions/generate-token:
 *   get:
 *     summary: Telegram bot uchun bog'lash tokenini yaratish / Генерация токена для привязки бота
 *     description: |
 *       🇺🇿 Botga deep-link orqali o'tish uchun token qaytaradi.
 *       🇷🇺 Возвращает токен для перехода в бот через deep-link.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/subscriptions/check-token:
 *   get:
 *     summary: Token bog'langanini tekshirish (Polling) / Проверка привязки токена
 *     description: |
 *       🇺🇿 Botda /start bosilgandan keyin bog'lanish muvaffaqiyatli bo'lganini tekshirish.
 *       🇷🇺 Проверка успешной привязки после нажатия /start в боте.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
