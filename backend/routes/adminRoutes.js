const express = require('express');
const router  = express.Router();
const {
  getDashboardStats, getTopStudents, getCoursesStats,
  getRecentPayments, getUsers, updateUser, deleteUser,
} = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 👑 Admin panel — faqat adminlar uchun
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: 📊 Dashboard statistikasi
 *     description: Jami foydalanuvchilar, kurslar, videolar, yozilishlar va daromad.
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
 *                   currency: UZS
 *       401:
 *         description: Token kerak
 *       403:
 *         description: Admin huquqi kerak
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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 students:
 *                   - _id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                     username: "ahmadjon"
 *                     email: "ahmadjon@gmail.com"
 *                     xp: 8500
 *                     level: 9
 */
router.get('/top-students', authenticate, requireAdmin, getTopStudents);

/**
 * @swagger
 * /api/admin/courses/stats:
 *   get:
 *     summary: 📚 Kurslar statistikasi
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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 payments:
 *                   - _id: "65f1a2b3c4d5e6f7a8b9c0d5"
 *                     user:
 *                       username: "ahmadjon"
 *                       email: "ahmadjon@gmail.com"
 *                     course:
 *                       title: "React.js Frontend"
 *                       price: 349000
 *                     amount: 349000
 *                     status: completed
 *                 pagination:
 *                   total: 100
 *                   page: 1
 *                   limit: 20
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
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: Rol bo'yicha filter
 *     responses:
 *       200:
 *         description: Foydalanuvchilar ro'yxati
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 users:
 *                   - _id: "65f1a2b3c4d5e6f7a8b9c0d1"
 *                     username: "ahmadjon"
 *                     email: "ahmadjon@gmail.com"
 *                     role: user
 *                     isActive: true
 *                 pagination:
 *                   total: 1500
 *                   page: 1
 *                   limit: 20
 */
router.get('/users', authenticate, requireAdmin, getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: ✏️ Foydalanuvchini tahrirlash (rol, status)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               isActive:
 *                 type: boolean
 *           example:
 *             role: admin
 *     responses:
 *       200:
 *         description: Foydalanuvchi yangilandi
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.put('/users/:id', authenticate, requireAdmin, updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: 🗑️ Foydalanuvchini o'chirish
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi MongoDB ID
 *     responses:
 *       200:
 *         description: Foydalanuvchi o'chirildi
 *       400:
 *         description: O'zingizni o'chira olmaysiz
 *       404:
 *         description: Foydalanuvchi topilmadi
 */
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

module.exports = router;
