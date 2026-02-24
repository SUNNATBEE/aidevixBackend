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
 *     summary: Yangi kurs yaratish (Faqat Admin)
 *     description: |
 *       Bu endpoint yangi kurs yaratadi. Faqat admin foydalanishi mumkin.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da admin accessToken yuboriladi
 *       2. Request body'da kurs ma'lumotlari yuboriladi (title, description, price, thumbnail, category)
 *       3. Yangi kurs yaratiladi
 *       
 *       **Majburiy maydonlar:**
 *       - title: Kurs nomi
 *       - description: Kurs tavsifi
 *       - price: Kurs narxi
 *       
 *       **Ixtiyoriy maydonlar:**
 *       - thumbnail: Kurs rasmi URL
 *       - category: Kurs kategoriyasi
 *       
 *       **Status kodlar:**
 *       - 201: Kurs muvaffaqiyatli yaratildi
 *       - 400: Validation xatosi
 *       - 401: Token noto'g'ri
 *       - 403: Admin huquqi kerak
 *     tags: [Courses]
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
 *     summary: Kursni yangilash (Faqat Admin)
 *     description: |
 *       Bu endpoint mavjud kursni yangilaydi. Faqat admin foydalanishi mumkin.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da admin accessToken yuboriladi
 *       2. URL'da kurs ID yuboriladi
 *       3. Request body'da yangilanish kerak bo'lgan maydonlar yuboriladi
 *       4. Kurs yangilanadi
 *       
 *       **Status kodlar:**
 *       - 200: Kurs muvaffaqiyatli yangilandi
 *       - 400: Validation xatosi
 *       - 401: Token noto'g'ri
 *       - 403: Admin huquqi kerak
 *       - 404: Kurs topilmadi
 *     tags: [Courses]
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
 *     summary: Kursni o'chirish (Faqat Admin)
 *     description: |
 *       Bu endpoint kursni o'chiradi. Faqat admin foydalanishi mumkin.
 *       
 *       **Qanday ishlatiladi:**
 *       1. Authorization header'da admin accessToken yuboriladi
 *       2. URL'da kurs ID yuboriladi
 *       3. Kurs o'chiriladi
 *       
 *       **Muhim:**
 *       - Kurs o'chirilgandan keyin qayta tiklash mumkin emas
 *       - Kurs videolari ham o'chiriladi
 *       
 *       **Status kodlar:**
 *       - 200: Kurs muvaffaqiyatli o'chirildi
 *       - 401: Token noto'g'ri
 *       - 403: Admin huquqi kerak
 *       - 404: Kurs topilmadi
 *     tags: [Courses]
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
