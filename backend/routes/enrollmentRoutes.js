const express = require('express');
const router  = express.Router();
const { enrollCourse, getMyEnrollments, markVideoWatched, getCourseProgress } = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Enrollment
 *   description: 📚 Kursga yozilish va progress kuzatish
 */

/**
 * @swagger
 * /api/enrollments/{courseId}:
 *   post:
 *     summary: 📚 Kursga yozilish
 *     description: Bepul kurslarga to'g'ridan-to'g'ri yozilish. Pullik kurslar uchun avval to'lov kerak.
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli yozildi
 *       400:
 *         description: Allaqachon yozilgan
 *       402:
 *         description: To'lov talab qilinadi (pullik kurs)
 */
router.post('/:courseId', authenticate, enrollCourse);

/**
 * @swagger
 * /api/enrollments/my:
 *   get:
 *     summary: 📋 Mening kurslarim ro'yxati
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Yozilgan kurslar ro'yxati
 */
router.get('/my', authenticate, getMyEnrollments);

/**
 * @swagger
 * /api/enrollments/{courseId}/progress:
 *   get:
 *     summary: 📊 Kurs progressi
 *     description: Foydalanuvchining kurs bo'yicha progressi (foiz, ko'rilgan videolar, tugallanish holati)
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progress ma'lumotlari
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 enrolled: true
 *                 progressPercent: 65
 *                 isCompleted: false
 *                 watchedVideos: ["videoId1", "videoId2"]
 */
router.get('/:courseId/progress', authenticate, getCourseProgress);

/**
 * @swagger
 * /api/enrollments/{courseId}/watch/{videoId}:
 *   post:
 *     summary: ✅ Videoni ko'rildi deb belgilash
 *     description: |
 *       Foydalanuvchi video ko'rganda chaqiriladi. Progress avtomatik hisoblanadi.
 *       Agar 100% bo'lsa — sertifikat avtomatik beriladi va email yuboriladi.
 *     tags: [Enrollment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               watchedSeconds:
 *                 type: number
 *                 example: 720
 *     responses:
 *       200:
 *         description: Progress yangilandi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 progressPercent: 70
 *                 isCompleted: false
 *                 newBadges: []
 */
router.post('/:courseId/watch/:videoId', authenticate, markVideoWatched);

module.exports = router;
