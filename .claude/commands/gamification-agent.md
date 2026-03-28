# Gamification System Agent

> **Kontekst**: Ishni boshlashdan oldin `Read` tool bilan quyidagi faylni o'qi:
> `C:\Users\User\.claude\projects\C--Users-User-OneDrive--------------AidevixBackend\memory\agent-gamification.md`

Sen Aidevix backend uchun XP, badge, streak va leaderboard tizimlarini to'liq va professional darajaga ko'taruvchi ixtisoslashgan agentsan.

## Maqsad
Mavjud gamification tizimini (XP, badges, streak) kengaytir, optimizatsiya qil va yangi imkoniyatlar qo'sh.

## Qilishi kerak bo'lgan ishlar

### 1. Badge Tizimini Kengaytirish
`backend/utils/badgeService.js` ni o'qing va quyidagi badge categorylarini qo'shing:

**Mavjud badgelarni tekshiring, quyidagilar yo'q bo'lsa qo'shing:**
- `first_video` — birinchi videoni ko'rganlik
- `streak_7` — 7 kunlik streak
- `streak_30` — 30 kunlik streak
- `xp_500`, `xp_1000`, `xp_5000` — XP milestones
- `course_complete` — birinchi kursni tugatish
- `quiz_master` — 10 ta quizni 90%+ natija bilan yechish
- `early_bird` — ro'yxatdan o'tgan dastlabki 100 o'quvchidan biri
- `top_10` — haftalik leaderboardda top-10 ga kirish
- `perfect_score` — quizda 100% natija

### 2. Level System Yangilash
`backend/models/UserStats.js` ni o'qing:
- Level nomi tizimi qo'shing: `getLevelTitle()` metodi
  - Level 1-5: "Yangi Boshlovchi"
  - Level 6-15: "O'rganuvchi"
  - Level 16-30: "Dasturchi"
  - Level 31-50: "Senior Dasturchi"
  - Level 51+: "Ustoz"
- `GET /api/xp/stats` javobiga `levelTitle` qo'shing

### 3. Haftalik Reset Mexanizmi
Haftalik XP (weeklyXp) ni har dushanba kuni 00:00 da reset qilish uchun:
- `backend/utils/weeklyReset.js` — yangi fayl, cron-style logic (setInterval bilan, cron package ishlatmang)
- `backend/index.js` da server start bo'lganda weeklyReset ni ishga tushiring
- Reset bo'lishidan oldin haftalik leaderboard snapshot saqlansin

### 4. XP Transaction Log
Har bir XP o'zgarishini log qiling:
- `backend/models/XPTransaction.js` — yangi model: userId, amount, reason, createdAt
- Hamma XP beradigan joylarda (`addVideoWatchXP`, `submitQuiz`, `updateChallengeProgress`) log yozish
- `GET /api/xp/history` — foydalanuvchi XP tarixi (so'nggi 50 ta)

### 5. Leaderboard Kengaytirish
`backend/controllers/rankingController.js` ni o'qing:
- Agar yo'q bo'lsa `GET /api/ranking/weekly` — haftalik leaderboard (weeklyXp bo'yicha)
- `GET /api/ranking/all-time` — umumiy leaderboard (xp bo'yicha)
- Har ikkisida foydalanuvchining o'z pozitsiyasi ham kelsin (agar top-10 da bo'lmasa ham)

### 6. Streak Streak Notification
- `checkAndUpdateStreak()` utility funksiyasi — streak tugash xavfida bo'lganda (1 soat qolganda)
- Email orqali ogohlantirish (`emailService.js` orqali)
- `GET /api/xp/streak-status` — streak holati, qancha vaqt qolganligini ko'rsatsin

## Muhim qoidalar
- CommonJS ishlating
- `npm install` kerak bo'lsa bajaring, lekin cron package ishlatmang (setInterval yetarli)
- Mavjud modellarni buzmasdan extend qiling (yangi maydonlar qo'shing)
- Hamma javoblar Uzbek tilida

## Fayllar (barchasi o'qilishi kerak)
- `backend/models/UserStats.js`
- `backend/utils/badgeService.js`
- `backend/controllers/xpController.js`
- `backend/controllers/rankingController.js`
- `backend/routes/xpRoutes.js`
- `backend/routes/rankingRoutes.js`
- `backend/index.js`
