const express = require('express');
const router  = express.Router();
const { getDashboardStats, getTopStudents, getCoursesStats, getRecentPayments, getUsers } = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 👑 Admin panel statistikasi
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: 📊 Dashboard statistikasi
 *     description: Jami foydalanuvchilar, kurslar, yozilishlar, daromad.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard ma'lumotlari
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 users:
 *                   total: 1500
 *                   newThisMonth: 120
 *                 courses:
 *                   total: 12
 *                 videos:
 *                   total: 180
 *                 enrollments:
 *                   total: 4800
 *                   completed: 1200
 *                 revenue:
 *                   total: 145000000
 *                   currency: "UZS"
 */
router.get('/stats', authenticate, requireAdmin, getDashboardStats);

/**
 * @swagger
 * /api/admin/top-students:
 *   get:
 *     summary: 🏆 Top 10 o'quvchilar (XP bo'yicha)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top o'quvchilar
 */
router.get('/top-students', authenticate, requireAdmin, getTopStudents);

/**
 * @swagger
 * /api/admin/courses/stats:
 *   get:
 *     summary: 📚 Kurslar statistikasi
 *     description: Har bir kursning ko'rishlar soni, reytingi, o'quvchilar soni.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kurslar statistikasi
 */
router.get('/courses/stats', authenticate, requireAdmin, getCoursesStats);

/**
 * @swagger
 * /api/admin/payments:
 *   get:
 *     summary: 💳 So'nggi to'lovlar
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: To'lovlar ro'yxati
 */
router.get('/payments', authenticate, requireAdmin, getRecentPayments);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 👥 Barcha foydalanuvchilar
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Username yoki email bo'yicha qidiruv
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 */
router.get('/users', authenticate, requireAdmin, getUsers);

module.exports = router;
