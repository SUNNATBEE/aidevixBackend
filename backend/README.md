# Aidevix Backend

Express 5 + MongoDB backend. Online kurs platformasi uchun API server.

**Production:** `https://aidevix-backend-production.up.railway.app`
**Swagger:** `/api-docs` (login: Aidevix / sunnatbee)

---

## Ishga Tushirish

```bash
npm install
cp .env.example .env   # env o'zgaruvchilarni to'ldiring
npm run dev            # nodemon bilan (port 5000)
npm start              # production
```

---

## Env O'zgaruvchilar

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=kuchli-secret-32+belgi
FRONTEND_URL=http://localhost:3000

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_USERNAME=aidevix
TELEGRAM_PRIVATE_CHANNEL_USERNAME=
TELEGRAM_ADMIN_CHAT_ID=697727022

# AI / News
GROQ_API_KEY=
NEWS_ENABLED=true
CHALLENGE_SCHEDULER_ENABLED=true

# Bunny.net Stream (video — backend/utils/bunny.js)
BUNNY_STREAM_API_KEY=   # Stream → Library → API → API Key
BUNNY_LIBRARY_ID=       # Stream → Library → API → Video Library ID
BUNNY_TOKEN_KEY=        # Stream → Library → Security → Token Authentication
# Eslatma: Stream o‘zi vz-xxxx.b-cdn.net kabi CDN beradi; alohida env shart emas.

# Payment
PAYME_MERCHANT_ID=
PAYME_SECRET_KEY=
CLICK_SERVICE_ID=
CLICK_MERCHANT_ID=
CLICK_SECRET_KEY=

# Email
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```

---

## API Endpointlar

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/daily-reward
POST /api/auth/forgot-password
POST /api/auth/verify-code
POST /api/auth/reset-password
GET  /api/auth/referrals
```

### Courses & Videos
```
GET    /api/courses                  # List (filter, search, sort)
GET    /api/courses/:id
POST   /api/courses                  # Admin
GET    /api/videos/course/:courseId
GET    /api/videos/:id
POST   /api/xp/video-watched/:id     # +50 XP
```

### XP & Gamification
```
GET  /api/xp/stats                   # Level, XP, streak, badges
PUT  /api/xp/profile                 # bio, skills, aiStack (← yangi)
POST /api/xp/quiz/:quizId            # Quiz yuborish
GET  /api/xp/weekly-leaderboard
GET  /api/xp/history
GET  /api/xp/streak-status
```

### Prompt Library (yangi)
```
GET    /api/prompts                  # List (category, tool, sort, search)
GET    /api/prompts/featured         # Featured prompts
GET    /api/prompts/:id              # Single + views++
POST   /api/prompts                  # Yaratish (auth, +30 XP)
POST   /api/prompts/:id/like         # Toggle like (auth)
DELETE /api/prompts/:id              # O'chirish (owner yoki admin)
PATCH  /api/prompts/:id/feature      # Featured (admin)
```

### Challenges
```
GET  /api/challenges/today           # Bugungi challenge + progress
POST /api/challenges/progress        # Progress yangilash
POST /api/challenges/admin           # Admin: yaratish
```

### Ranking / Leaderboard
```
GET /api/ranking/users               # Top users (aiStack bilan)
GET /api/ranking/courses             # Top courses
GET /api/ranking/weekly              # Haftalik XP
GET /api/ranking/users/:id/position  # Mening pozitsiyam
```

### Subscription
```
POST /api/subscriptions/verify-telegram
POST /api/subscriptions/verify-instagram
GET  /api/subscriptions/status
POST /api/subscriptions/generate-token
GET  /api/subscriptions/check-token/:token
```

### Payments
```
POST /api/payments/initiate
POST /api/payments/payme/callback
POST /api/payments/click/callback
GET  /api/payments/history
```

---

## Fayllar Tuzilmasi

```
backend/
├── index.js                    # Express app, barcha routes
├── controllers/
│   ├── authController.js       # Autentifikatsiya
│   ├── courseController.js     # Kurslar
│   ├── videoController.js      # Videolar + Bunny.net
│   ├── xpController.js         # XP, quiz, profile (aiStack)
│   ├── rankingController.js    # Leaderboard (aiStack qaytaradi)
│   ├── challengeController.js  # Daily challenges
│   ├── promptController.js     # Prompt Library ← yangi
│   ├── subscriptionController.js
│   ├── paymentController.js
│   ├── enrollmentController.js
│   ├── certificateController.js
│   ├── projectController.js
│   ├── adminController.js
│   ├── followController.js
│   ├── wishlistController.js
│   ├── sectionController.js
│   └── uploadController.js
├── middleware/
│   ├── auth.js                 # JWT authenticate + requireAdmin
│   ├── subscriptionCheck.js    # Real-time Telegram gate
│   └── rateLimiter.js
├── models/
│   ├── User.js                 # aiStack field ← yangi
│   ├── Prompt.js               # Prompt Library ← yangi
│   ├── UserStats.js            # XP, level, streak, badges
│   ├── Course.js / Video.js / Section.js
│   ├── Quiz.js / QuizResult.js
│   ├── DailyChallenge.js / UserChallengeProgress.js
│   ├── Enrollment.js / Certificate.js
│   ├── Payment.js / Project.js
│   ├── Follow.js / Wishlist.js
│   ├── VideoQuestion.js / VideoLink.js
│   └── VerifyToken.js
├── routes/
│   ├── promptRoutes.js         # ← yangi
│   └── ... (16 ta routes fayl)
├── utils/
│   ├── telegramBot.js          # Bot + /postnews command
│   ├── newsScheduler.js        # Kunlik AI news (Claude/Codex/Cursor)
│   ├── challengeScheduler.js   # Kunlik challenge yaratish ← yangi
│   ├── socialVerification.js   # getChatMember Telegram API
│   ├── checkSubscriptions.js   # performSubscriptionCheck()
│   ├── bunny.js                # Bunny.net signed URL
│   ├── badgeService.js
│   ├── jwt.js
│   ├── emailService.js
│   └── logger.js
├── config/
│   ├── database.js
│   ├── swagger.js
│   └── swaggerAdmin.js
└── seeders/
    └── seedCourses.js          # DESTRUCTIVE — ALLOW_DESTRUCTIVE_SEED=true kerak
```

---

## Syntax Tekshirish

```bash
node --check backend/index.js
```

## Deploy (Railway)

```bash
git push origin main   # Railway avtomatik deploy qiladi
```

Railway dashboard da env o'zgaruvchilarni sozlang.
