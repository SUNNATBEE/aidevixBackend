/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Ro'yxatdan o'tish / Регистрация
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 * 
 * /api/auth/login:
 *   post:
 *     summary: Tizimga kirish / Вход в систему
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 * 
 * /api/auth/refresh-token:
 *   post:
 *     summary: Tokenni yangilash / Обновить токен
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/auth/forgot-password:
 *   post:
 *     summary: Parolni tiklashni boshlash (email orqali kodingizni yuborish)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 * 
 * /api/auth/verify-code:
 *   post:
 *     summary: Parolni tiklash kodini tasdiqlash
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Code verified
 * 
 * /api/auth/reset-password:
 *   post:
 *     summary: Yangi parolni o'rnatish
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 * 
 * /api/auth/logout:
 *   post:
 *     summary: Tizimdan chiqish / Выход
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 * 
 * /api/auth/me:
 *   get:
 *     summary: Foydalanuvchi ma'lumotlarini olish / Получить данные пользователя
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * 
 * /api/auth/daily-reward:
 *   post:
 *     summary: Kunlik mukofot olish (+50 XP) / Получить ежедневную награду
 *     description: |
 *       🇺🇿 Har 24 soatda bir marta +50 XP olish imkonini beradi.
 *       🇷🇺 Позволяет получать +50 XP один раз в 24 часа.
 *
 *       **📱 React Native:** HomeScreen dagi "Claim" tugmasi uchun.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Allaqachon olingan / Уже получено
 * 
 * /api/auth/referrals:
 *   get:
 *     summary: Referral statistikasi / Статистика рефералов
 *     description: |
 *       🇺🇿 Taklif qilingan do'stlar ro'yxati va umumiy mukofotlar.
 *       🇷🇺 Список приглашенных друзей и общие награды.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 * 
 * /api/auth/verify-email:
 *   post:
 *     summary: Emailni tasdiqlash (OTP bilan) / Верификация Email (с OTP)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified
 * 
 * /api/auth/resend-verification:
 *   post:
 *     summary: Tasdiqlash kodini qayta yuborish / Переотправить код верификации
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Code resent
 */
