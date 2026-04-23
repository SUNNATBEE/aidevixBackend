/**
 * @swagger
 * tags:
 *   - name: XP & Gamification
 *     description: |
 *       🎮 XP tizimi, streak, badge, level, quiz, profil / Система XP, серии, значки, уровни
 *
 *       **XP jadval:**
 *       | Harakat | XP |
 *       |---------|-----|
 *       | Video ko'rish | +50 |
 *       | Quiz to'g'ri javob | +10 (har biri) |
 *       | Quiz o'tish (bonus) | +100 |
 *       | Daily challenge | +80–250 |
 *       | Prompt yaratish | +30 |
 *       | Project yakunlash | +200 |
 *       | Daily login | +100 |
 *
 *       **Rank tizimi:**
 *       AMATEUR(0) → CANDIDATE(500) → JUNIOR(2000) → MIDDLE(5000) → SENIOR(10000) → MASTER(20000) → LEGEND(50000)
 *
 *       **Level:** XP / 1000 (max 100)
 *
 * /api/xp/stats:
 *   get:
 *     summary: Foydalanuvchi statistikasi (XP, level, streak, badges)
 *     description: |
 *       🇺🇿 Foydalanuvchining to'liq gamification statistikasini qaytaradi.
 *       🇷🇺 Полная статистика геймификации пользователя.
 *
 *       **📱 React Native:** Profile ekranida va HomeScreen dagi stats card uchun.
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserStats'
 *       401:
 *         description: Auth kerak
 *
 * /api/xp/video-watched/{videoId}:
 *   post:
 *     summary: Video ko'rish XP (+50)
 *     description: |
 *       🇺🇿 Video ko'rilganda +50 XP beradi. Streak yangilanadi. Badge tekshiriladi.
 *       🇷🇺 Начисляет +50 XP за просмотр видео. Обновляет серию. Проверяет значки.
 *
 *       **📱 React Native:** VideoPlayerScreen da video tugaganda chaqiring.
 *       Bir xil video uchun qayta XP berilmaydi (backend tekshiradi).
 *
 *       **Streak logikasi:**
 *       - Kecha faol → streak +1
 *       - 1 kun o'tkazib yuborgan → streak freeze ishlatiladi (agar bor bo'lsa)
 *       - 2+ kun → streak = 1 (qaytadan)
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: XP berildi
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
 *                   example: "+50 XP qo'shildi!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     xp:
 *                       type: number
 *                       example: 4300
 *                     level:
 *                       type: number
 *                       example: 4
 *                     streak:
 *                       type: number
 *                       example: 8
 *                     videosWatched:
 *                       type: number
 *                       example: 46
 *       401:
 *         description: Auth kerak
 *
 * /api/xp/quiz/{quizId}:
 *   post:
 *     summary: Quiz javoblarini yuborish (XP olish)
 *     description: |
 *       🇺🇿 Quiz javoblarini yuboradi. To'g'ri javob = +10 XP. Quiz o'tsa = +100 bonus.
 *       🇷🇺 Отправка ответов на квиз. Правильный ответ = +10 XP. Прохождение = +100 бонус.
 *
 *       **📱 React Native:** QuizModal component ichida ishlatiladi.
 *       Bir quiz faqat 1 marta yechiladi (qayta yuborishga ruxsat yo'q).
 *
 *       **Passing score:** 70% (default, quiz ga qarab farq qilishi mumkin)
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: array
 *                 description: Har bir savol uchun tanlangan javob indeksi (0-3)
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionIndex:
 *                       type: number
 *                       example: 0
 *                     selectedOption:
 *                       type: number
 *                       example: 2
 *                       description: "Javob indeksi (0-3)"
 *                 example:
 *                   - questionIndex: 0
 *                     selectedOption: 2
 *                   - questionIndex: 1
 *                     selectedOption: 0
 *                   - questionIndex: 2
 *                     selectedOption: 3
 *     responses:
 *       200:
 *         description: Quiz natijalari
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
 *                     score:
 *                       type: number
 *                       example: 80
 *                       description: "Foizda (0-100)"
 *                     correctCount:
 *                       type: number
 *                       example: 4
 *                     totalQuestions:
 *                       type: number
 *                       example: 5
 *                     passed:
 *                       type: boolean
 *                       example: true
 *                     xpEarned:
 *                       type: number
 *                       example: 140
 *                       description: "4*10 (to'g'ri) + 100 (bonus) = 140"
 *                     newXP:
 *                       type: number
 *                       example: 4440
 *                     newLevel:
 *                       type: number
 *                       example: 4
 *       400:
 *         description: Bu quizni allaqachon yechgansiz
 *       401:
 *         description: Auth kerak
 *
 * /api/xp/quiz/video/{videoId}:
 *   get:
 *     summary: Video uchun quizni olish
 *     description: |
 *       🇺🇿 Berilgan video uchun quiz qaytaradi (agar mavjud bo'lsa).
 *       correctAnswer ko'rsatilmaydi — faqat savollar va variantlar.
 *       🇷🇺 Возвращает квиз для видео (если есть). Правильные ответы скрыты.
 *
 *       **📱 React Native:** Video tugagandan keyin "Quiz yechish" tugmasini ko'rsating.
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     responses:
 *       200:
 *         description: Quiz ma'lumotlari
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
 *                   nullable: true
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7a8b9c0d9"
 *                     title:
 *                       type: string
 *                       example: "React Hooks Quiz"
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question:
 *                             type: string
 *                             example: "useState hook nima uchun ishlatiladi?"
 *                           options:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["State boshqarish", "API chaqirish", "Routing", "Styling"]
 *                     alreadySolved:
 *                       type: boolean
 *                       example: false
 *                       description: "true bo'lsa — qayta yechishga ruxsat yo'q"
 *       401:
 *         description: Auth kerak
 *
 * /api/xp/profile:
 *   put:
 *     summary: Profilni yangilash (bio, skills, aiStack)
 *     description: |
 *       🇺🇿 Foydalanuvchi profilini yangilaydi. Barcha fieldlar ixtiyoriy.
 *       🇷🇺 Обновление профиля пользователя. Все поля необязательны.
 *
 *       **📱 React Native:** EditProfileScreen va AI Stack tab uchun.
 *
 *       **AI Stack** — foydalanuvchi qaysi AI toollardan foydalanishini ko'rsatadi.
 *       Leaderboard va prompt author'da ko'rinadi.
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 maxLength: 300
 *                 example: "Frontend developer | React & Next.js"
 *                 description: "Qisqa bio (max 300 belgi)"
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["javascript", "react", "typescript", "tailwind"]
 *               avatar:
 *                 type: string
 *                 example: "https://res.cloudinary.com/aidevix/image/upload/v1/avatars/user.jpg"
 *               ism:
 *                 type: string
 *                 example: "Jasurbek"
 *                 description: "firstName field"
 *               familiya:
 *                 type: string
 *                 example: "Karimov"
 *                 description: "lastName field"
 *               kasb:
 *                 type: string
 *                 example: "Full Stack Developer"
 *                 description: "jobTitle field"
 *               aiStack:
 *                 type: array
 *                 description: "Foydalanuvchi ishlataydigan AI toollar"
 *                 items:
 *                   type: string
 *                   enum: [Claude Code, Cursor, GitHub Copilot, ChatGPT, Gemini, Windsurf, Devin, Replit AI, Codeium, Other]
 *                 example: ["Claude Code", "Cursor", "GitHub Copilot"]
 *     responses:
 *       200:
 *         description: Profil yangilandi
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
 *                   example: "Profil yangilandi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     bio:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     aiStack:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Claude Code", "Cursor", "GitHub Copilot"]
 *       401:
 *         description: Auth kerak
 *
 * /api/xp/streak-status:
 *   get:
 *     summary: Streak holati (atRisk, hoursRemaining)
 *     description: |
 *       🇺🇿 Joriy streak, risk holati va qolgan vaqtni qaytaradi.
 *       🇷🇺 Текущая серия, статус риска и оставшееся время.
 *
 *       **📱 React Native:** Push notification uchun — agar `atRisk: true` bo'lsa, kechqurun eslatma yuboring.
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Streak ma'lumotlari
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
 *                     streak:
 *                       type: number
 *                       example: 7
 *                     lastActivity:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-04-20T15:30:00.000Z"
 *                     atRisk:
 *                       type: boolean
 *                       example: true
 *                       description: "true = 20+ soat o'tgan, streak yo'qolishi mumkin"
 *                     hoursRemaining:
 *                       type: number
 *                       example: 3.5
 *                       description: "Streak yo'qolishigacha qolgan soatlar"
 *
 * /api/xp/streak-freeze:
 *   post:
 *     summary: Streak freeze ishlatish
 *     description: |
 *       🇺🇿 Streak freeze itemni ishlatadi (1 ta kamayadi). Max 5 ta bo'ladi.
 *       🇷🇺 Использовать заморозку серии (уменьшается на 1). Максимум 5.
 *
 *       **📱 React Native:** Streak yo'qolayotganda "Freeze ishlatish" tugmasi.
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Freeze ishlatildi
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
 *                   example: "Streak freeze ishlatildi!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     remainingFreezes:
 *                       type: number
 *                       example: 2
 *       400:
 *         description: Streak freeze qolmagan
 *
 * /api/xp/streak-freeze/add:
 *   post:
 *     summary: Streak freeze qo'shish
 *     description: |
 *       🇺🇿 O'ziga yoki boshqa userga streak freeze qo'shadi. Max 5 ta.
 *       🇷🇺 Добавить заморозку себе или другому пользователю. Максимум 5.
 *     tags: [XP & Gamification]
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
 *                 description: "Boshqa user ID (ixtiyoriy, default: o'zi)"
 *     responses:
 *       200:
 *         description: Freeze qo'shildi
 *       400:
 *         description: Max 5 ta freeze
 *
 * /api/xp/weekly-leaderboard:
 *   get:
 *     summary: Haftalik leaderboard (weeklyXp bo'yicha)
 *     description: |
 *       🇺🇿 Shu haftadagi eng faol foydalanuvchilar (weeklyXp bo'yicha tartiblangan).
 *       🇷🇺 Самые активные пользователи за эту неделю.
 *
 *       **📱 React Native:** LeaderboardScreen da "Haftalik" tab uchun.
 *     tags: [XP & Gamification]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Nechta user qaytarish
 *     responses:
 *       200:
 *         description: Haftalik top userlar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: number
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: "jasurbek_dev"
 *                       weeklyXp:
 *                         type: number
 *                         example: 850
 *                       level:
 *                         type: number
 *                         example: 12
 *                       streak:
 *                         type: number
 *                         example: 7
 *
 * /api/xp/history:
 *   get:
 *     summary: XP olish tarixi
 *     description: |
 *       🇺🇿 XP olish tarixi (hozircha bo'sh array qaytaradi).
 *       🇷🇺 История получения XP (сейчас возвращает пустой массив).
 *     tags: [XP & Gamification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: XP tarixi
 */
