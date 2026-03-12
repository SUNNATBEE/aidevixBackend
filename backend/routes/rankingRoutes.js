const express = require('express');
const router = express.Router();
const { getTopCourses, getTopUsers, getUserPosition } = require('../controllers/rankingController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Ranking
 *   description: 🏆 Reyting endpointlari — Top kurslar va top foydalanuvchilar
 */

/**
 * @swagger
 * /api/ranking/courses:
 *   get:
 *     summary: 🏆 Eng ko'p ko'rilgan kurslar reytingi (Numton uchun)
 *     description: |
 *       ## O'ZBEKCHA
 *       Eng ko'p ko'rilgan kurslarni viewCount bo'yicha tartiblangan holda qaytaradi.
 *       **Frontend'da ishlatish:** TopCoursesPage.jsx komponentida chaqiring.
 *
 *       ### Misol:
 *       ```javascript
 *       import { rankingApi } from '@api/rankingApi'
 *       const { data } = await rankingApi.getTopCourses({ limit: 10, category: 'javascript' })
 *       ```
 *     tags: [Ranking]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nechta kurs qaytarish
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [html, css, javascript, react, typescript, nodejs, general]
 *         description: Kategoriya bo'yicha filter
 *     responses:
 *       200:
 *         description: Top kurslar ro'yxati
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 courses: []
 *                 total: 0
 */
router.get('/courses', getTopCourses);

/**
 * @swagger
 * /api/ranking/users:
 *   get:
 *     summary: 🥇 Eng ko'p XP to'plagan foydalanuvchilar (Suhrob uchun)
 *     description: |
 *       ## O'ZBEKCHA
 *       XP bo'yicha tartiblangan foydalanuvchilar reytingini qaytaradi.
 *       **Frontend'da ishlatish:** LeaderboardPage.jsx komponentida chaqiring.
 *
 *       ### Misol:
 *       ```javascript
 *       import { rankingApi } from '@api/rankingApi'
 *       const { data } = await rankingApi.getTopUsers({ page: 1, limit: 20 })
 *       ```
 *     tags: [Ranking]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Top foydalanuvchilar ro'yxati
 */
router.get('/users', getTopUsers);

/**
 * @swagger
 * /api/ranking/users/{userId}/position:
 *   get:
 *     summary: 📍 Foydalanuvchining reyting pozitsiyasi
 *     description: Bitta foydalanuvchining global reytingdagi o'rnini qaytaradi.
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Foydalanuvchi pozitsiyasi
 */
router.get('/users/:userId/position', protect, getUserPosition);

module.exports = router;
