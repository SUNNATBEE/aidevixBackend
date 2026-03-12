const express = require('express');
const router = express.Router();
const {
  getProjectsByCourse,
  getProject,
  completeProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Ixtiyoriy autentifikatsiya (login bo'lsa isCompleted ko'rsatiladi)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: 🏗️ Kurs loyihalari — amaliy mashqlar
 */

/**
 * @swagger
 * /api/projects/course/{courseId}:
 *   get:
 *     summary: 📋 Kurs loyihalari ro'yxati
 *     description: |
 *       Berilgan kurs uchun barcha amaliy loyihalarni qaytaradi.
 *       **Abduvoris** — VideoPage'da "Loyihalar" tab uchun ishlatadi.
 *       **Doniyor** — CourseDetailPage'da loyihalar ko'rsatish uchun.
 *
 *       ```javascript
 *       import axiosInstance from '@api/axiosInstance'
 *       const { data } = await axiosInstance.get(`/api/projects/course/${courseId}`)
 *       // data.data.projects — loyihalar massivi
 *       ```
 *     tags: [Projects]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loyihalar ro'yxati
 */
router.get('/course/:courseId', optionalAuth, getProjectsByCourse);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: 📖 Bitta loyiha tafsiloti
 *     tags: [Projects]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Loyiha ma'lumotlari
 */
router.get('/:id', optionalAuth, getProject);

/**
 * @swagger
 * /api/projects/{id}/complete:
 *   post:
 *     summary: ✅ Loyihani bajarildi deb belgilash (+XP)
 *     description: |
 *       Foydalanuvchi loyihani bajarganda chaqiriladi.
 *       XP beriladi va statistika yangilanadi.
 *
 *       **Suhrob** — LevelUp triggeri sifatida ham ishlatadi.
 *     tags: [Projects]
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
 *           example:
 *             githubUrl: "https://github.com/username/project"
 *     responses:
 *       200:
 *         description: XP berildi
 */
router.post('/:id/complete', authenticate, completeProject);

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: 👑 Yangi loyiha yaratish (Admin)
 *     tags: [Admin Panel - Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             courseId: "65f100000000000000000001"
 *             title: "Portfolio Sahifasi"
 *             description: "HTML va CSS bilan shaxsiy portfolio yarating"
 *             level: "beginner"
 *             order: 0
 *             technologies: ["HTML5", "CSS3"]
 *             requirements: ["HTML asoslari darslarini ko'ring"]
 *             estimatedTime: 120
 *             xpReward: 300
 *             tasks:
 *               - order: 0
 *                 title: "index.html yarating"
 *                 description: "Asosiy HTML strukturasi"
 *                 hint: "<!DOCTYPE html> bilan boshlang"
 *                 xpReward: 60
 *     responses:
 *       201:
 *         description: Loyiha yaratildi
 */
router.post('/', authenticate, requireAdmin, createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: ✏️ Loyihani yangilash (Admin)
 *     tags: [Admin Panel - Projects]
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
 *           example:
 *             title: "Yangilangan loyiha nomi"
 *             xpReward: 400
 *     responses:
 *       200:
 *         description: Loyiha yangilandi
 *   delete:
 *     summary: 🗑️ Loyihani o'chirish (Admin)
 *     tags: [Admin Panel - Projects]
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
 *         description: Loyiha o'chirildi
 */
router.put('/:id', authenticate, requireAdmin, updateProject);
router.delete('/:id', authenticate, requireAdmin, deleteProject);

module.exports = router;
