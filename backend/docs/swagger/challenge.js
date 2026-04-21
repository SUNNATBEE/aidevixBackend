/**
 * @swagger
 * tags:
 *   - name: Challenges
 *     description: |
 *       🎯 Kunlik vazifalar / Ежедневные задания
 *
 *       Har kuni 00:00 (Toshkent vaqti) avtomatik yangi challenge yaratiladi.
 *       Challenge turlari hafta kuni bo'yicha almashadi (7 xil).
 *
 *       | Kun | Challenge | XP |
 *       |-----|----------|----|
 *       | Dush | 🎬 Video Marathon (3 video) | +150 |
 *       | Sesh | 🧠 Quiz Champion (2 quiz) | +120 |
 *       | Chor | 🔥 Streak Warrior | +80 |
 *       | Pay | ⚡ Vibe Coder (1 prompt) | +200 |
 *       | Jum | 📚 AI Tools Explorer (5 video) | +250 |
 *       | Shan | 💡 Prompt Master (2 prompt) | +180 |
 *       | Yak | 🚀 Knowledge Sprint (3 quiz) | +160 |
 *
 * /api/challenges/today:
 *   get:
 *     summary: Bugungi challenge + foydalanuvchi progressi
 *     description: |
 *       🇺🇿 Bugungi faol challenge va foydalanuvchining progressini qaytaradi.
 *       Agar bugun challenge yaratilmagan bo'lsa, `challenge: null` qaytadi.
 *
 *       🇷🇺 Возвращает сегодняшнее задание и прогресс пользователя.
 *
 *       **📱 React Native:** HomeScreen da "Bugungi vazifa" card uchun ishlatiladi.
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bugungi challenge
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
 *                       $ref: '#/components/schemas/DailyChallenge'
 *                     progress:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         currentCount:
 *                           type: number
 *                           example: 2
 *                           description: Hozirgi bajarilgan soni
 *                         isCompleted:
 *                           type: boolean
 *                           example: false
 *                         completedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         xpEarned:
 *                           type: number
 *                           example: 0
 *             examples:
 *               active:
 *                 summary: Faol challenge
 *                 value:
 *                   success: true
 *                   data:
 *                     challenge:
 *                       _id: "65f1a2b3c4d5e6f7a8b9c0e0"
 *                       title: "🎬 Video Marathon"
 *                       description: "Bugun kamida 3 ta video ko'ring va +150 XP yutib oling!"
 *                       type: "watch_video"
 *                       targetCount: 3
 *                       xpReward: 150
 *                       date: "2026-04-21"
 *                       isActive: true
 *                     progress:
 *                       currentCount: 1
 *                       isCompleted: false
 *                       xpEarned: 0
 *               no_challenge:
 *                 summary: Bugun challenge yo'q
 *                 value:
 *                   success: true
 *                   data:
 *                     challenge: null
 *                     progress: null
 *       401:
 *         description: Auth kerak
 *
 * /api/challenges/progress:
 *   post:
 *     summary: Challenge progressini yangilash
 *     description: |
 *       🇺🇿 Bugungi challenge progressini +1 oshiradi.
 *       Agar targetCount ga yetsa — avtomatik complete bo'ladi va XP beriladi.
 *
 *       🇷🇺 Увеличивает прогресс на 1. При достижении цели — автоматически завершается и начисляется XP.
 *
 *       **📱 React Native:** Video ko'rganda, quiz yechganda yoki prompt yaratganda avtomatik chaqiring.
 *
 *       **⚠️ Muhim:** Backend challenge type ga qarab progressni tekshiradi.
 *       Masalan, `watch_video` type da — video ko'rganda chaqiring.
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress yangilandi
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
 *                   example: "Challenge bajarildi! +150 XP"
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentCount:
 *                       type: number
 *                       example: 3
 *                     targetCount:
 *                       type: number
 *                       example: 3
 *                     isCompleted:
 *                       type: boolean
 *                       example: true
 *                     xpEarned:
 *                       type: number
 *                       example: 150
 *             examples:
 *               in_progress:
 *                 summary: Hali tugallanmagan
 *                 value:
 *                   success: true
 *                   message: "Progress yangilandi"
 *                   data:
 *                     currentCount: 2
 *                     targetCount: 3
 *                     isCompleted: false
 *                     xpEarned: 0
 *               completed:
 *                 summary: Challenge tugallandi!
 *                 value:
 *                   success: true
 *                   message: "Challenge bajarildi! +150 XP"
 *                   data:
 *                     currentCount: 3
 *                     targetCount: 3
 *                     isCompleted: true
 *                     xpEarned: 150
 *       401:
 *         description: Auth kerak
 *
 * /api/challenges/admin:
 *   post:
 *     summary: "Yangi challenge yaratish (Admin)"
 *     description: |
 *       🇺🇿 Admin qo'lda yangi challenge yaratishi mumkin. Scheduler avtomatik ham yaratadi.
 *       🇷🇺 Администратор может создать задание вручную. Планировщик также создаёт автоматически.
 *     tags: [Admin Panel - Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, type, date]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "🧠 Maxsus Quiz Challenge"
 *               description:
 *                 type: string
 *                 example: "Bugun 5 ta quiz yeching va +300 XP oling!"
 *               type:
 *                 type: string
 *                 enum: [watch_video, complete_quiz, streak, enroll_course, rate_course, use_ai_tool, share_prompt]
 *                 example: complete_quiz
 *               targetCount:
 *                 type: number
 *                 default: 1
 *                 example: 5
 *               xpReward:
 *                 type: number
 *                 default: 50
 *                 example: 300
 *               date:
 *                 type: string
 *                 example: "2026-04-25"
 *                 description: "YYYY-MM-DD formatda, unique bo'lishi kerak"
 *     responses:
 *       201:
 *         description: Challenge yaratildi
 *       400:
 *         description: Bu sana uchun challenge allaqachon mavjud
 *       403:
 *         description: Faqat admin
 */
