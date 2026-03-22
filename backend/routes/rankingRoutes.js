const express = require('express');
const router = express.Router();
const { getTopCourses, getTopUsers, getUserPosition, getWeeklyLeaderboard } = require('../controllers/rankingController');
const { authenticate } = require('../middleware/auth');

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
 *       Har bir foydalanuvchida **rankTitle** (GRANDMASTER, VICE-ADMIRAL...) ham qaytariladi.
 *       **Frontend'da ishlatish:** `LeaderboardPage.jsx` komponentida chaqiring.
 *
 *       ### Rank unvonlari (level asosida):
 *       | Level | Unvon |
 *       |-------|-------|
 *       | 90+   | GRANDMASTER |
 *       | 75-89 | VICE-ADMIRAL |
 *       | 60-74 | COMMANDER |
 *       | 45-59 | CAPTAIN |
 *       | 30-44 | LIEUTENANT |
 *       | 15-29 | SERGEANT |
 *       | 5-14  | CORPORAL |
 *       | 1-4   | RECRUIT |
 *
 *       ### Category filter (Figma tabs: JAVASCRIPT, REACT, PYTHON, UI/UX):
 *       ```javascript
 *       // JavaScript tab bosilganda:
 *       const { data } = await rankingApi.getTopUsers({ category: 'javascript' })
 *       // Skills array ichida "javascript" bo'lgan foydalanuvchilar filtrlandi
 *       ```
 *     tags: [Ranking]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nechta foydalanuvchi qaytarish
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [javascript, react, python, typescript, nodejs, html, css]
 *         description: Skills bo'yicha filter (Figma leaderboard tabs uchun)
 *     responses:
 *       200:
 *         description: Top foydalanuvchilar ro'yxati
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 users:
 *                   - rank: 1
 *                     rankTitle: "GRANDMASTER"
 *                     user:
 *                       username: "jamshid_k"
 *                       email: "jamshid@example.com"
 *                     xp: 145200
 *                     level: 99
 *                     streak: 84
 *                     quizzesCompleted: 450
 *                     skills: ["javascript", "react"]
 *                   - rank: 2
 *                     rankTitle: "VICE-ADMIRAL"
 *                     user:
 *                       username: "malika_r"
 *                     xp: 92450
 *                     level: 89
 *                 pagination:
 *                   total: 150
 *                   page: 1
 *                   limit: 20
 *                   pages: 8
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
router.get('/users/:userId/position', authenticate, getUserPosition);

/**
 * @swagger
 * /api/ranking/weekly:
 *   get:
 *     summary: 📅 Haftalik leaderboard (weeklyXp bo'yicha)
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Haftalik TOP foydalanuvchilar va shaxsiy pozitsiya
 */
router.get('/weekly', authenticate, getWeeklyLeaderboard);

module.exports = router;
