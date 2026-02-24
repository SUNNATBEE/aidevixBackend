const express = require('express');
const router = express.Router();
const { getCourseVideos, getVideo, useVideoLink, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { checkSubscriptions } = require('../middleware/subscriptionCheck');

/**
 * @swagger
 * /api/videos/course/{courseId}:
 *   get:
 *     summary: Kurs videolarini olish (Ochiq)
 *     description: |
 *       Bu endpoint bitta kursning barcha videolarini qaytaradi. Token kerak emas.
 *       
 *       **Qanday ishlatiladi:**
 *       1. URL'da kurs ID yuboriladi
 *       2. Kursning barcha faol videolari qaytariladi
 *       
 *       **Qaytarilgan ma'lumotlar:**
 *       - Videolar ro'yxati (title, description, duration, order)
 *       - Videolar soni
 *       
 *       **Muhim:**
 *       - Faqat videolar ro'yxati qaytariladi
 *       - Video ko'rish uchun alohida endpoint kerak (obuna talab qilinadi)
 *       
 *       **Status kodlar:**
 *       - 200: Videolar muvaffaqiyatli olingan
 *       - 500: Server xatosi
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Videos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     videos:
 *                       type: array
 *                     count:
 *                       type: number
 *       500:
 *         description: Server error
 */
router.get('/course/:courseId', getCourseVideos);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Videoni olish (Obuna talab qilinadi - Real-time tekshiruv)
 *     description: |
 *       Bu endpoint videoni va bir martalik video linkni qaytaradi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da accessToken yuboriladi
 *       2. URL'da video ID yuboriladi
 *       3. Real-time obuna tekshiruvi qilinadi (Instagram va Telegram)
 *       4. Agar obuna bo'lsa, video ma'lumotlari va bir martalik link qaytariladi
 *       5. Agar obuna bo'lmasa, 403 xatosi qaytadi
 *       
 *       **Muhim:**
 *       - Instagram va Telegram'ga obuna bo'lish majburiy
 *       - Real-time tekshiruv: har safar obuna holati tekshiriladi
 *       - Agar obuna bekor qilsangiz, video ko'ra olmaysiz
 *       - Bir martalik link: har bir video uchun alohida link
 *       - Link bir marta ishlatiladi
 *       
 *       **Qaytarilgan ma'lumotlar:**
 *       - Video ma'lumotlari (title, description, duration)
 *       - Video link (telegramLink, isUsed, expiresAt)
 *       
 *       **Status kodlar:**
 *       - 200: Video muvaffaqiyatli olingan
 *       - 403: Obuna bekor qilingan yoki obuna bo'lmagan
 *       - 404: Video topilmadi
 *       - 401: Token noto'g'ri
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Video retrieved successfully with one-time link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     video:
 *                       type: object
 *                     videoLink:
 *                       type: object
 *       403:
 *         description: Subscription required or user unsubscribed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Siz obuna bekor qildingiz. Video ko'ra olmaysiz.
 *                 subscriptions:
 *                   type: object
 *                 missingSubscriptions:
 *                   type: array
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, checkSubscriptions, getVideo);

/**
 * @swagger
 * /api/videos/link/{linkId}/use:
 *   post:
 *     summary: Video linkni ishlatish (Real-time obuna tekshiruvi)
 *     description: |
 *       Bu endpoint video linkni "ishlatilgan" deb belgilaydi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da accessToken yuboriladi
 *       2. URL'da video link ID yuboriladi
 *       3. Real-time obuna tekshiruvi qilinadi
 *       4. Agar obuna bo'lsa, link "ishlatilgan" deb belgilanadi
 *       5. Agar obuna bo'lmasa, 403 xatosi qaytadi
 *       
 *       **Muhim:**
 *       - Real-time tekshiruv: har safar obuna holati tekshiriladi
 *       - Agar obuna bekor qilsangiz, link ishlamaydi
 *       - Link bir martalik: ishlatilgandan keyin qayta ishlatib bo'lmaydi
 *       - Link muddati o'tgan bo'lsa, ishlamaydi
 *       
 *       **Status kodlar:**
 *       - 200: Link muvaffaqiyatli ishlatildi
 *       - 400: Link allaqachon ishlatilgan yoki muddati o'tgan
 *       - 403: Obuna bekor qilingan
 *       - 404: Link topilmadi
 *       - 401: Token noto'g'ri
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: linkId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video Link ID
 *     responses:
 *       200:
 *         description: Video link used successfully
 *       400:
 *         description: Link already used or expired
 *       403:
 *         description: Subscription required or user unsubscribed
 *       404:
 *         description: Video link not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/link/:linkId/use', authenticate, useVideoLink);

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: 🎥 Yangi video yaratish (Admin Panel)
 *     description: |
 *       **ADMIN PANEL ENDPOINT** - Bu endpoint yangi video yaratish uchun ishlatiladi.
 *       
 *       **📋 Vazifasi:**
 *       - Kursga yangi video qo'shish
 *       - Video ma'lumotlarini saqlash
 *       - Videoni kursga bog'lash
 *       
 *       **🔐 Kimlar foydalanishi mumkin:**
 *       - Faqat admin role'ga ega foydalanuvchilar
 *       
 *       **📝 Qadam-baqadam ko'rsatma:**
 *       1. Admin token bilan POST so'rov yuboring
 *       2. Request body'da video ma'lumotlarini yuboring
 *       3. Server video yaratadi va kursga qo'shadi
 *       
 *       **📤 Request Body (Majburiy maydonlar):**
 *       - `title` (string): Video nomi, masalan: "JavaScript Kirish"
 *       - `courseId` (string): Kurs ID (qaysi kursga qo'shilishi)
 *       
 *       **📤 Request Body (Ixtiyoriy maydonlar):**
 *       - `description` (string): Video tavsifi
 *       - `order` (number): Video tartibi (0, 1, 2, ...)
 *       - `duration` (number): Video davomiyligi (soniyalarda), masalan: 1200 (20 daqiqa)
 *       - `thumbnail` (string): Video rasmi URL
 *       
 *       **📥 Response (201 - Muvaffaqiyatli):**
 *       ```json
 *       {
 *         "success": true,
 *         "message": "Video created successfully.",
 *         "data": {
 *           "video": {
 *             "_id": "...",
 *             "title": "JavaScript Kirish",
 *             "course": "...",
 *             "order": 0
 *           }
 *         }
 *       }
 *       ```
 *       
 *       **❌ Xato holatlar:**
 *       - 400: Title yoki courseId berilmagan
 *       - 401: Token noto'g'ri
 *       - 403: Admin huquqi yo'q
 *       - 404: Kurs topilmadi
 *       
 *       **💡 Maslahatlar:**
 *       - Video tartibini (order) to'g'ri belgilang
 *       - Duration'ni soniyalarda kiriting (1 daqiqa = 60 soniya)
 *       - Thumbnail uchun yaxshi sifatli rasm ishlating
 *     tags: [Admin Panel - Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               courseId:
 *                 type: string
 *               order:
 *                 type: number
 *               duration:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, requireAdmin, createVideo);

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: ✏️ Videoni yangilash (Admin Panel)
 *     description: |
 *       **ADMIN PANEL ENDPOINT** - Bu endpoint mavjud videoni yangilash uchun ishlatiladi.
 *       
 *       **📋 Vazifasi:**
 *       - Video ma'lumotlarini o'zgartirish
 *       - Video tartibini yangilash
 *       - Video holatini o'zgartirish (faol/yashirin)
 *       
 *       **🔐 Kimlar foydalanishi mumkin:**
 *       - Faqat admin role'ga ega foydalanuvchilar
 *       
 *       **📝 Qadam-baqadam ko'rsatma:**
 *       1. Admin token bilan PUT so'rov yuboring
 *       2. URL'da video ID'ni belgilang: `/api/videos/VIDEO_ID`
 *       3. Request body'da faqat o'zgartirish kerak bo'lgan maydonlarni yuboring
 *       4. Server videoni yangilaydi
 *       
 *       **📤 Request Body (Ixtiyoriy - faqat o'zgartirish kerak bo'lganlar):**
 *       - `title` (string): Yangi video nomi
 *       - `description` (string): Yangi video tavsifi
 *       - `order` (number): Yangi video tartibi
 *       - `duration` (number): Yangi video davomiyligi (soniyalarda)
 *       - `thumbnail` (string): Yangi video rasmi URL
 *       - `isActive` (boolean): Video holati (true = faol, false = yashirin)
 *       
 *       **📥 Response (200 - Muvaffaqiyatli):**
 *       ```json
 *       {
 *         "success": true,
 *         "message": "Video updated successfully.",
 *         "data": {
 *           "video": { ... }
 *         }
 *       }
 *       ```
 *       
 *       **❌ Xato holatlar:**
 *       - 401: Token noto'g'ri
 *       - 403: Admin huquqi yo'q
 *       - 404: Video topilmadi
 *     tags: [Admin Panel - Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *               duration:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Video updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: 🗑️ Videoni o'chirish (Admin Panel)
 *     description: |
 *       **ADMIN PANEL ENDPOINT** - Bu endpoint videoni butunlay o'chirish uchun ishlatiladi.
 *       
 *       **📋 Vazifasi:**
 *       - Videoni ma'lumotlar bazasidan o'chirish
 *       - Video linklarini o'chirish
 *       - Videoni kursdan olib tashlash
 *       
 *       **⚠️ MUHIM OGOHLANTIRISH:**
 *       - Video o'chirilgandan keyin qayta tiklash mumkin emas!
 *       - Video linklar ham o'chiriladi!
 *       - Foydalanuvchilar videoni ko'ra olmaydi!
 *       
 *       **🔐 Kimlar foydalanishi mumkin:**
 *       - Faqat admin role'ga ega foydalanuvchilar
 *       
 *       **📝 Qadam-baqadam ko'rsatma:**
 *       1. Admin token bilan DELETE so'rov yuboring
 *       2. URL'da video ID'ni belgilang: `/api/videos/VIDEO_ID`
 *       3. Server videoni o'chiradi
 *       
 *       **💡 Maslahat:**
 *       - O'chirish o'rniga `isActive: false` qilib yashirin qilish yaxshiroq
 *       - Keyinroq kerak bo'lsa, videoni qayta faollashtirish mumkin
 *       
 *       **📥 Response (200 - Muvaffaqiyatli):**
 *       ```json
 *       {
 *         "success": true,
 *         "message": "Video deleted successfully."
 *       }
 *       ```
 *       
 *       **❌ Xato holatlar:**
 *       - 401: Token noto'g'ri
 *       - 403: Admin huquqi yo'q
 *       - 404: Video topilmadi
 *     tags: [Admin Panel - Videos]
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
 *         description: Video deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Video not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticate, requireAdmin, updateVideo);
router.delete('/:id', authenticate, requireAdmin, deleteVideo);

module.exports = router;
