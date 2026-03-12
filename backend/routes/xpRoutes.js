const express = require('express');
const router = express.Router();
const {
  getUserStats,
  addVideoWatchXP,
  submitQuiz,
  getQuizByVideo,
  updateProfile,
} = require('../controllers/xpController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: XP
 *   description: 🎮 XP va Level tizimi — Suhrob tomonidan ishlatiladigan endpointlar
 */

/**
 * @swagger
 * /api/xp/stats:
 *   get:
 *     summary: 📊 Foydalanuvchi statistikasi (XP, level, streak)
 *     description: |
 *       Foydalanuvchining XP, level, streak va boshqa statistikalarini qaytaradi.
 *       **Suhrob** — LeaderboardPage va LevelUpPage uchun ishlatadi.
 *       **Firdavs** — ProfilePage'da ham ko'rsatish mumkin.
 *
 *       ```javascript
 *       // Ishlatish:
 *       import axiosInstance from '@api/axiosInstance'
 *       const { data } = await axiosInstance.get('/api/xp/stats')
 *       ```
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Foydalanuvchi statistikasi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 xp: 1240
 *                 level: 2
 *                 levelProgress: 24
 *                 xpToNextLevel: 760
 *                 streak: 12
 *                 badges: []
 *                 videosWatched: 42
 *                 quizzesCompleted: 15
 */
router.get('/stats', protect, getUserStats);

/**
 * @swagger
 * /api/xp/video-watched/{videoId}:
 *   post:
 *     summary: 🎬 Video ko'rishdan XP olish (+50 XP)
 *     description: |
 *       Video tugaganida chaqiriladi. Foydalanuvchiga +50 XP beradi.
 *       **Abduvoris** — VideoPage tugaganda chaqiradi.
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: XP berildi
 */
router.post('/video-watched/:videoId', protect, addVideoWatchXP);

/**
 * @swagger
 * /api/xp/quiz/{quizId}:
 *   post:
 *     summary: 📝 Quiz yechish va XP olish
 *     description: |
 *       Quiz javoblarini yuboradi va natija + XP qaytaradi.
 *       **Suhrob** — VideoPlaygroundPage'da quiz qismida ishlatadi.
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
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
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionIndex:
 *                       type: integer
 *                     selectedOption:
 *                       type: integer
 *           example:
 *             answers:
 *               - questionIndex: 0
 *                 selectedOption: 2
 *               - questionIndex: 1
 *                 selectedOption: 0
 *     responses:
 *       200:
 *         description: Quiz natijasi va XP
 */
router.post('/quiz/:quizId', protect, submitQuiz);

/**
 * @swagger
 * /api/xp/quiz/video/{videoId}:
 *   get:
 *     summary: ❓ Video uchun quizni olish
 *     description: Berilgan videoId ga tegishli quizni qaytaradi.
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz ma'lumotlari
 */
router.get('/quiz/video/:videoId', protect, getQuizByVideo);

/**
 * @swagger
 * /api/xp/profile:
 *   put:
 *     summary: ✏️ Profil ma'lumotlarini yangilash (bio, skills, avatar)
 *     description: |
 *       Foydalanuvchining bio, ko'nikmalar va avatar URL'ini yangilaydi.
 *       **Firdavs** — ProfilePage edit modal'da ishlatadi.
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             bio: "Python dasturchi. Backend va AI ishlab chiqaman."
 *             skills: ["Python", "Django", "React"]
 *             avatar: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Profil yangilandi
 */
router.put('/profile', protect, updateProfile);

module.exports = router;
