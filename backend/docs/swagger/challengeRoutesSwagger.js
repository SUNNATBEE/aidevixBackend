/**
 * @swagger
 * tags:
 *   - name: Challenges
 *     description: |
 *       🎯 **Kunlik vazifalar (Daily Challenges)**
 *
 *       Har kuni bitta vazifa beriladi. O'quvchilar vazifani bajarib XP olishadi.
 *
 *       ### Vazifa turlari:
 *       | Turi | Tavsif |
 *       |------|--------|
 *       | `watch_video` | N ta video ko'rish |
 *       | `complete_quiz` | N ta quiz yechish |
 *       | `streak` | Streak davom ettirish |
 *       | `enroll_course` | Kursga yozilish |
 *       | `rate_course` | Kursni baholash |
 *
 *       ### Frontend misol:
 *       ```javascript
 *       // Bugungi vazifa
 *       const { data } = await axiosInstance.get('/api/challenges/today')
 *       const { challenge, progress } = data.data
 *
 *       // Progress yangilash
 *       await axiosInstance.post('/api/challenges/progress')
 *       ```
 *   - name: Admin Panel - Challenges
 *     description: 👑 Admin kunlik vazifa yaratish
 */

/**
 * @swagger
 * /api/challenges/today:
 *   get:
 *     summary: 🎯 Bugungi kunlik vazifa
 *     description: |
 *       Bugungi sana uchun faol vazifa va foydalanuvchining progress holati.
 *       Agar bugun uchun vazifa yo'q bo'lsa `challenge: null` qaytaradi.
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bugungi vazifa
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
 *                     challenge:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/DailyChallenge'
 *                         - type: "null"
 *                       description: Bugungi vazifa (null agar yo'q)
 *                     progress:
 *                       type: object
 *                       properties:
 *                         currentCount:
 *                           type: number
 *                           example: 1
 *                         isCompleted:
 *                           type: boolean
 *                           example: false
 *                     message:
 *                       type: string
 *                       example: "Bugun uchun vazifa yo'q"
 *                       description: Faqat vazifa yo'q bo'lganda
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/challenges/progress:
 *   post:
 *     summary: ⬆️ Vazifa progressini yangilash
 *     description: |
 *       Foydalanuvchi vazifa shartini bajarganda chaqiriladi.
 *       `currentCount` har chaqirilganda +1 oshadi.
 *       `targetCount` ga yetganda vazifa bajariladi va XP avtomatik beriladi.
 *
 *       ### Muhim:
 *       - Allaqachon bajarilgan vazifani qayta bajarib bo'lmaydi
 *       - XP `UserStats.xp` va `weeklyXp` ga qo'shiladi
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress yangilandi yoki vazifa bajarildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vazifa bajarildi! +100 XP"
 *                 data:
 *                   type: object
 *                   properties:
 *                     progress:
 *                       type: object
 *                       properties:
 *                         currentCount:
 *                           type: number
 *                           example: 3
 *                         isCompleted:
 *                           type: boolean
 *                           example: true
 *                         xpEarned:
 *                           type: number
 *                           example: 100
 *                         completedAt:
 *                           type: string
 *                           format: date-time
 *       404:
 *         description: Bugun uchun vazifa yo'q
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Bugun uchun vazifa yo'q"
 *       401:
 *         description: Token yo'q yoki eskirgan
 */

/**
 * @swagger
 * /api/challenges/admin:
 *   post:
 *     summary: 🛠️ Kunlik vazifa yaratish (Admin)
 *     description: |
 *       Yangi kunlik vazifa yaratish. Har bir sana uchun faqat bitta vazifa bo'lishi mumkin.
 *       Agar bu sana uchun vazifa allaqachon mavjud bo'lsa — 400 xato qaytaradi.
 *     tags: [Admin Panel - Challenges]
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
 *                 example: "Bugun kamida 3 ta dars videosini ko'ring"
 *               type:
 *                 type: string
 *                 enum: [watch_video, complete_quiz, streak, enroll_course, rate_course]
 *                 example: "watch_video"
 *               targetCount:
 *                 type: number
 *                 example: 3
 *                 default: 1
 *               xpReward:
 *                 type: number
 *                 example: 100
 *                 default: 50
 *               date:
 *                 type: string
 *                 example: "2026-03-26"
 *                 description: YYYY-MM-DD formatda (unikal)
 *     responses:
 *       201:
 *         description: Vazifa yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vazifa yaratildi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     challenge:
 *                       $ref: '#/components/schemas/DailyChallenge'
 *       400:
 *         description: Validatsiya xatosi yoki sana allaqachon band
 *         content:
 *           application/json:
 *             examples:
 *               validation:
 *                 value: { success: false, message: "title, type va date majburiy" }
 *               duplicate:
 *                 value: { success: false, message: "Bu sana uchun vazifa allaqachon mavjud" }
 *       401:
 *         description: Token yo'q yoki admin emas
 */
