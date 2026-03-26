// Auto-extracted swagger docs from xpRoutes.js

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

/**
 * @swagger
 * /api/xp/weekly-leaderboard:
 *   get:
 *     summary: 🏆 Haftalik liderlar jadvali (weeklyXp bo'yicha)
 *     tags: [XP]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Haftalik TOP foydalanuvchilar
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 leaderboard:
 *                   - rank: 1
 *                     weeklyXp: 850
 *                     level: 12
 *                     streak: 7
 *                     user:
 *                       username: "top_coder"
 */

/**
 * @swagger
 * /api/xp/streak-freeze:
 *   post:
 *     summary: 🧊 Streak freeze ishlatish
 *     description: Bir kunlik streak freeze sarflaydi (bugungi streakni saqlaydi). Maksimal 5 ta bo'ladi.
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak freeze ishlatildi
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Streak freeze ishlatildi"
 *               data:
 *                 streakFreezes: 2
 *                 streak: 15
 *       400:
 *         description: Streak freeze qolmadi
 */

/**
 * @swagger
 * /api/xp/streak-freeze/add:
 *   post:
 *     summary: ➕ Streak freeze qo'shish (Admin)
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: "Admin boshqa foydalanuvchiga qo'shmoqchi bo'lsa. Bo'sh qoldirilsa o'ziga."
 *     responses:
 *       200:
 *         description: Streak freeze qo'shildi
 */

/**
 * @swagger
 * /api/xp/history:
 *   get:
 *     summary: 📜 XP tarixi (so'nggi 50 ta)
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: XP tranzaksiyalar tarixi
 */

/**
 * @swagger
 * /api/xp/streak-status:
 *   get:
 *     summary: 🔥 Streak holati
 *     tags: [XP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak va qolgan vaqt
 */
