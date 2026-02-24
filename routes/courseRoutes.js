const express = require('express');
const router = express.Router();
const { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Barcha kurslarni olish (Ochiq)
 *     description: |
 *       Bu endpoint barcha mavjud kurslarni qaytaradi. Token kerak emas, hamma ko'ra oladi.
 *       
 *       **Qanday ishlatiladi:**
 *       1. GET so'rov yuboriladi
 *       2. Barcha faol kurslar qaytariladi
 *       
 *       **Qaytarilgan ma'lumotlar:**
 *       - Kurslar ro'yxati (title, description, price, thumbnail, instructor)
 *       - Kurslar soni
 *       
 *       **Status kodlar:**
 *       - 200: Kurslar muvaffaqiyatli olingan
 *       - 500: Server xatosi
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
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
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                     count:
 *                       type: number
 *       500:
 *         description: Server error
 *   post:
 *     summary: 🎓 Yangi kurs yaratish (Admin Panel)
 *     description: |
 *       **ADMIN PANEL ENDPOINT** - Bu endpoint yangi kurs yaratish uchun ishlatiladi.
 *       
 *       **📋 Vazifasi:**
 *       - Platformaga yangi kurs qo'shish
 *       - Kurs ma'lumotlarini saqlash
 *       - Instructor'ni avtomatik tayinlash (hozirgi admin)
 *       
 *       **🔐 Kimlar foydalanishi mumkin:**
 *       - Faqat admin role'ga ega foydalanuvchilar
 *       - Admin accessToken talab qilinadi
 *       
 *       **📝 Qadam-baqadam ko'rsatma:**
 *       1. Admin sifatida tizimga kiring va accessToken oling
 *       2. Authorization header'ga token qo'shing: `Authorization: Bearer YOUR_TOKEN`
 *       3. Request body'da kurs ma'lumotlarini yuboring
 *       4. Server kursni yaratadi va qaytaradi
 *       
 *       **📤 Request Body (Majburiy maydonlar):**
 *       - `title` (string): Kurs nomi, masalan: "JavaScript Fundamentals"
 *       - `description` (string): Kurs tavsifi, masalan: "JavaScript asoslarini o'rganing"
 *       - `price` (number): Kurs narxi, masalan: 99.99
 *       
 *       **📤 Request Body (Ixtiyoriy maydonlar):**
 *       - `thumbnail` (string): Kurs rasmi URL, masalan: "https://example.com/image.jpg"
 *       - `category` (string): Kurs kategoriyasi, masalan: "programming", "design", "marketing"
 *       
 *       **📥 Response (201 - Muvaffaqiyatli):**
 *       ```json
 *       {
 *         "success": true,
 *         "message": "Course created successfully.",
 *         "data": {
 *           "course": {
 *             "_id": "...",
 *             "title": "JavaScript Fundamentals",
 *             "description": "...",
 *             "price": 99.99,
 *             "instructor": "...",
 *             "createdAt": "..."
 *           }
 *         }
 *       }
 *       ```
 *       
 *       **❌ Xato holatlar:**
 *       - 400: Majburiy maydonlar berilmagan yoki noto'g'ri format
 *       - 401: Token berilmagan yoki noto'g'ri
 *       - 403: Foydalanuvchi admin emas
 *       - 500: Server xatosi
 *       
 *       **💡 Maslahatlar:**
 *       - Kurs nomi va tavsifi aniq va tushunarli bo'lishi kerak
 *       - Narxni to'g'ri belgilang
 *       - Thumbnail uchun yaxshi sifatli rasm ishlating
 *       - Category'ni to'g'ri tanlang (keyinroq filtrlash uchun)
 *     tags: [Admin Panel - Courses]
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
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: JavaScript Fundamentals
 *               description:
 *                 type: string
 *                 example: Learn JavaScript from scratch
 *               price:
 *                 type: number
 *                 example: 99.99
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/thumbnail.jpg
 *               category:
 *                 type: string
 *                 example: programming
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get('/', getAllCourses);
router.post('/', authenticate, requireAdmin, createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Bitta kursni ID bo'yicha olish (Ochiq)
 *     description: |
 *       Bu endpoint bitta kursning to'liq ma'lumotlarini qaytaradi. Token kerak emas.
 *       
 *       **Qanday ishlatiladi:**
 *       1. URL'da kurs ID yuboriladi
 *       2. Kurs ma'lumotlari qaytariladi
 *       
 *       **Qaytarilgan ma'lumotlar:**
 *       - Kurs to'liq ma'lumotlari
 *       - Kurs videolari ro'yxati
 *       - Instructor ma'lumotlari
 *       
 *       **Status kodlar:**
 *       - 200: Kurs muvaffaqiyatli olingan
 *       - 404: Kurs topilmadi
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: ✏️ Kursni yangilash (Admin Panel)
 *     description: |
 *       **ADMIN PANEL ENDPOINT** - Bu endpoint mavjud kursni yangilash uchun ishlatiladi.
 *       
 *       **📋 Vazifasi:**
 *       - Kurs ma'lumotlarini o'zgartirish
 *       - Kurs narxini yangilash
 *       - Kurs holatini o'zgartirish (faol/yashirin)
 *       
 *       **🔐 Kimlar foydalanishi mumkin:**
 *       - Faqat admin role'ga ega foydalanuvchilar
 *       
 *       **📝 Qadam-baqadam ko'rsatma:**
 *       1. Admin token bilan so'rov yuboring
 *       2. URL'da kurs ID'ni belgilang: `/api/courses/COURSE_ID`
 *       3. Request body'da faqat o'zgartirish kerak bo'lgan maydonlarni yuboring
 *       4. Server kursni yangilaydi
 *       
 *       **📤 Request Body (Ixtiyoriy - faqat o'zgartirish kerak bo'lganlar):**
 *       - `title` (string): Yangi kurs nomi
 *       - `description` (string): Yangi kurs tavsifi
 *       - `price` (number): Yangi kurs narxi
 *       - `thumbnail` (string): Yangi kurs rasmi URL
 *       - `category` (string): Yangi kategoriya
 *       - `isActive` (boolean): Kurs holati (true = faol, false = yashirin)
 *       
 *       **📥 Response (200 - Muvaffaqiyatli):**
 *       ```json
 *       {
 *         "success": true,
 *         "message": "Course updated successfully.",
 *         "data": {
 *           "course": { ... }
 *         }
 *       }
 *       ```
 *       
 *       **❌ Xato holatlar:**
 *       - 401: Token noto'g'ri
 *       - 403: Admin huquqi yo'q
 *       - 404: Kurs topilmadi
 *     tags: [Admin Panel - Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
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
 *   delete:
 *     summary: 🗑️ Kursni o'chirish (Admin Panel)
 *     description: |
 *       **ADMIN PANEL ENDPOINT** - Bu endpoint kursni butunlay o'chirish uchun ishlatiladi.
 *       
 *       **📋 Vazifasi:**
 *       - Kursni ma'lumotlar bazasidan o'chirish
 *       - Kurs bilan bog'liq barcha ma'lumotlarni o'chirish
 *       
 *       **⚠️ MUHIM OGOHLANTIRISH:**
 *       - Kurs o'chirilgandan keyin qayta tiklash mumkin emas!
 *       - Kurs videolari ham o'chiriladi!
 *       - Foydalanuvchilar kursni ko'ra olmaydi!
 *       
 *       **🔐 Kimlar foydalanishi mumkin:**
 *       - Faqat admin role'ga ega foydalanuvchilar
 *       
 *       **📝 Qadam-baqadam ko'rsatma:**
 *       1. Admin token bilan DELETE so'rov yuboring
 *       2. URL'da kurs ID'ni belgilang: `/api/courses/COURSE_ID`
 *       3. Server kursni o'chiradi
 *       
 *       **💡 Maslahat:**
 *       - O'chirish o'rniga `isActive: false` qilib yashirin qilish yaxshiroq
 *       - Keyinroq kerak bo'lsa, kursni qayta faollashtirish mumkin
 *       
 *       **📥 Response (200 - Muvaffaqiyatli):**
 *       ```json
 *       {
 *         "success": true,
 *         "message": "Course deleted successfully."
 *       }
 *       ```
 *       
 *       **❌ Xato holatlar:**
 *       - 401: Token noto'g'ri
 *       - 403: Admin huquqi yo'q
 *       - 404: Kurs topilmadi
 *     tags: [Admin Panel - Courses]
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
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getCourse);
router.put('/:id', authenticate, requireAdmin, updateCourse);
router.delete('/:id', authenticate, requireAdmin, deleteCourse);

module.exports = router;
