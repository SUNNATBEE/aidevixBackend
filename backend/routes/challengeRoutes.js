const express = require('express');
const router  = express.Router();
const { getTodayChallenge, updateChallengeProgress, createChallenge } = require('../controllers/challengeController');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Challenges
 *   description: 🎯 Kunlik vazifalar (Daily Challenges)
 */

/**
 * @swagger
 * /api/challenges/today:
 *   get:
 *     summary: 🎯 Bugungi kunlik vazifa
 *     description: Bugungi vazifa va foydalanuvchining progress holati.
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bugungi vazifa
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 challenge:
 *                   title: "3 ta video ko'r"
 *                   type: "watch_video"
 *                   targetCount: 3
 *                   xpReward: 100
 *                 progress:
 *                   currentCount: 1
 *                   isCompleted: false
 */
router.get('/today', authenticate, getTodayChallenge);

/**
 * @swagger
 * /api/challenges/progress:
 *   post:
 *     summary: ⬆️ Vazifa progressini yangilash
 *     description: Foydalanuvchi vazifa shartini bajarganda chaqiriladi. Bajarilganda XP avtomatik beriladi.
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress yangilandi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Vazifa bajarildi! +100 XP"
 *               data:
 *                 progress:
 *                   currentCount: 3
 *                   isCompleted: true
 *                   xpEarned: 100
 */
router.post('/progress', authenticate, updateChallengeProgress);

/**
 * @swagger
 * /api/challenges/admin:
 *   post:
 *     summary: 🛠️ Kunlik vazifa yaratish (Admin)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type, date]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "3 ta video ko'r"
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [watch_video, complete_quiz, streak, enroll_course, rate_course]
 *               targetCount:
 *                 type: number
 *                 example: 3
 *               xpReward:
 *                 type: number
 *                 example: 100
 *               date:
 *                 type: string
 *                 example: "2026-03-18"
 *     responses:
 *       201:
 *         description: Vazifa yaratildi
 */
router.post('/admin', authenticate, requireAdmin, createChallenge);

module.exports = router;
