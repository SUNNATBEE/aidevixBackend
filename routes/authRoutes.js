const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yangi foydalanuvchi ro'yxatdan o'tkazish
 *     description: |
 *       Bu endpoint yangi foydalanuvchini ro'yxatdan o'tkazadi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Request body'da username, email va password yuboriladi
 *       2. Email to'g'ri formatda bo'lishi kerak
 *       3. Parol kamida 6 belgi bo'lishi kerak
 *       4. Agar foydalanuvchi mavjud bo'lsa, xato qaytadi
 *       5. Muvaffaqiyatli bo'lsa, accessToken va refreshToken qaytadi
 *       
 *       **Qaytarilgan ma'lumotlar:**
 *       - User ma'lumotlari (id, username, email, subscriptions)
 *       - accessToken (15 daqiqa muddatli)
 *       - refreshToken (7 kun muddatli)
 *       
 *       **Muhim:** Token'larni saqlang, keyingi so'rovlarda ishlatishingiz kerak!
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
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Foydalanuvchi tizimga kirishi
 *     description: |
 *       Bu endpoint foydalanuvchini tizimga kirishi uchun ishlatiladi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Request body'da email va password yuboriladi
 *       2. Email va parol tekshiriladi
 *       3. Agar to'g'ri bo'lsa, accessToken va refreshToken qaytadi
 *       4. Agar noto'g'ri bo'lsa, 401 xatosi qaytadi
 *       
 *       **Qaytarilgan ma'lumotlar:**
 *       - User ma'lumotlari
 *       - accessToken (15 daqiqa muddatli)
 *       - refreshToken (7 kun muddatli)
 *       
 *       **Status kodlar:**
 *       - 200: Muvaffaqiyatli kirish
 *       - 400: Email yoki parol berilmagan
 *       - 401: Noto'g'ri email yoki parol
 *       - 403: Hisob deaktivatsiya qilingan
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
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account deactivated
 *       500:
 *         description: Server error
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Access token'ni yangilash
 *     description: |
 *       Bu endpoint access token muddati o'tganda yangi token olish uchun ishlatiladi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Request body'da refreshToken yuboriladi
 *       2. Refresh token tekshiriladi
 *       3. Agar to'g'ri bo'lsa, yangi accessToken qaytadi
 *       
 *       **Muhim:**
 *       - Refresh token 7 kun muddatli
 *       - Access token 15 daqiqa muddatli
 *       - Access token muddati o'tganda, refresh token bilan yangilash mumkin
 *       
 *       **Status kodlar:**
 *       - 200: Token muvaffaqiyatli yangilandi
 *       - 400: Refresh token berilmagan
 *       - 401: Refresh token noto'g'ri yoki muddati o'tgan
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
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *       400:
 *         description: Refresh token is required
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Server error
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Foydalanuvchi tizimdan chiqishi
 *     description: |
 *       Bu endpoint foydalanuvchini tizimdan chiqaradi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da accessToken yuboriladi
 *       2. Foydalanuvchi refreshToken o'chiriladi
 *       3. Keyingi so'rovlarda token ishlamaydi
 *       
 *       **Muhim:**
 *       - Token kerak (Authorization: Bearer YOUR_TOKEN)
 *       - Logout qilgandan keyin token'lar ishlamaydi
 *       - Qayta kirish uchun login qilish kerak
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/logout', authenticate, logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Joriy foydalanuvchi ma'lumotlarini olish
 *     description: |
 *       Bu endpoint hozirgi tizimga kirgan foydalanuvchi ma'lumotlarini qaytaradi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da accessToken yuboriladi
 *       2. Token tekshiriladi va foydalanuvchi aniqlanadi
 *       3. Foydalanuvchi ma'lumotlari qaytariladi
 *       
 *       **Qaytarilgan ma'lumotlar:**
 *       - User ID
 *       - Username
 *       - Email
 *       - Subscriptions (Instagram va Telegram obuna holati)
 *       - Role (user yoki admin)
 *       
 *       **Status kodlar:**
 *       - 200: Ma'lumotlar muvaffaqiyatli olingan
 *       - 401: Token noto'g'ri yoki muddati o'tgan
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         subscriptions:
 *                           type: object
 *                         role:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/me', authenticate, getMe);

module.exports = router;
