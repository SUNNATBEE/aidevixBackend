# CLAUDE.md

Repo summary for agents and contributors. Read this first before any work.

## Stack

| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Backend  | Express 5, MongoDB/Mongoose, JWT (cookie-based), Swagger |
| Frontend | Next.js 14 (App Router), React 18, Redux Toolkit, Tailwind |
| Hosting  | Backend: Railway / Frontend: Vercel (`aidevix.uz`) |
| Video    | Bunny.net Stream (token-authenticated)            |
| Bot      | Telegram Bot API (long polling, no webhook)       |
| AI       | Groq API (llama-3.3-70b) — news generation, AI coach |

## Architecture

```
backend/
├── index.js                          # Express app entry
├── controllers/                      # 17 controllers
│   ├── authController.js             # register, login, daily-reward, forgot/reset password
│   ├── courseController.js           # CRUD, categories, recommend, rate
│   ├── videoController.js            # CRUD, Bunny.net, questions
│   ├── xpController.js               # XP, quiz submit, profile update, leaderboard
│   ├── rankingController.js          # Top users (with aiStack), top courses, weekly
│   ├── challengeController.js        # Daily challenges CRUD + progress
│   ├── promptController.js           # ← NEW Prompt Library CRUD, like, featured
│   ├── subscriptionController.js     # Telegram/Instagram verify, token linking
│   ├── paymentController.js          # Payme/Click payment processing
│   ├── enrollmentController.js       # Course enrollment + progress
│   ├── certificateController.js      # Certificate generate, verify, download
│   ├── projectController.js          # Practical projects per course
│   ├── adminController.js            # Admin stats, manage users/courses/payments
│   ├── followController.js           # User follow/unfollow
│   ├── wishlistController.js         # Course wishlist
│   ├── sectionController.js          # Course sections
│   └── uploadController.js           # File/avatar upload
├── middleware/
│   ├── auth.js                       # JWT authenticate + requireAdmin
│   ├── subscriptionCheck.js          # Real-time Telegram+Instagram gate (403 if not subscribed)
│   └── rateLimiter.js
├── models/                           # 19 Mongoose schemas
│   ├── User.js                       # aiStack field ← NEW (AI tools user uses)
│   ├── Prompt.js                     # ← NEW Prompt Library
│   ├── DailyChallenge.js             # + UserChallengeProgress
│   ├── Quiz.js / QuizResult.js
│   ├── UserStats.js                  # XP, level, streak, badges, skills
│   └── ...
├── routes/
│   ├── promptRoutes.js               # ← NEW /api/prompts
│   └── ...
└── utils/
    ├── newsScheduler.js              # Kunlik Claude/Codex/Cursor AI news (10:00, 16:00, 20:00)
    ├── challengeScheduler.js         # ← NEW Kunlik AI challenge + kanal e'lon (00:00)
    ├── telegramBot.js                # Bot + /postnews admin command
    ├── socialVerification.js         # Telegram getChatMember API
    ├── checkSubscriptions.js         # performSubscriptionCheck()
    ├── bunny.js                      # Bunny.net signed URL
    ├── jwt.js                        # Token sign/verify
    ├── emailService.js               # Nodemailer
    └── badgeService.js               # Auto badge award

frontend/
├── src/api/
│   ├── promptApi.ts                  # ← NEW Prompt Library API client
│   ├── axiosInstance.ts              # Axios + cookie auth
│   ├── authApi.ts / courseApi.ts / videoApi.ts
│   ├── subscriptionApi.ts / rankingApi.ts / userApi.ts
│   └── uploadApi.ts
├── src/store/slices/                 # Redux Toolkit slices
│   ├── authSlice.ts / courseSlice.ts / videoSlice.ts
│   ├── subscriptionSlice.ts / rankingSlice.ts
│   └── userStatsSlice.ts
├── src/components/
│   ├── common/AICoach.tsx            # Floating AI assistant (calls /api/coach)
│   ├── leaderboard/LeaderboardTable.tsx  # Shows AI Stack icons (🤖⚡🐙)
│   └── ...
├── src/app/
│   ├── prompts/page.tsx              # ← NEW Prompt Library page
│   ├── profile/page.tsx              # + AI Stack tab ← NEW
│   └── ...
└── src/utils/constants.ts            # ROUTES.PROMPTS ← NEW
```

## Subscription Flow (business-critical)

```
User opens course → subscriptionCheck middleware → checkTelegramSubscription()
                                                   ├── Public channel only (@aidevix via TELEGRAM_CHANNEL_USERNAME)
                                                   ├── Uses Telegram Bot API getChatMember
                                                   ├── checked=true  → result is reliable
                                                   └── checked=false → network error, DB fallback used

Frontend verification modal (TelegramVerify.tsx):
  Step 1: User subscribes to @aidevix channel
  Step 2: User clicks "BOT ORQALI BOG'LASH" → bot links Telegram ID to site account
  Polling: checkVerifyToken endpoint polls every 3s until linked+subscribed
```

## News Scheduler (newsScheduler.js)

- **Vaqt:** 10:00, 16:00, 20:00 Toshkent
- **Fokus:** Claude, Codex, Cursor, Antigravity, Copilot, Windsurf — professional AI tools
- **FOCUS_KEYWORDS** filtri — faqat relevant yangiliklar o'tadi
- **RSS Manbalar:** Anthropic, OpenAI, GitHub, HackerNews (AI filter), TechCrunch, The Verge, Wired
- **AI Post:** Groq llama-3.3-70b → o'zbekcha tahlil + amaliy skill tip
- **Env:** `NEWS_ENABLED=true` yoki `SEND_NEWS=true`

## Challenge Scheduler (challengeScheduler.js) ← NEW

- **Vaqt:** Har kuni 00:00 Toshkent — avtomatik DailyChallenge yaratadi
- **Kanal e'loni:** Yaratilgach Telegram kanalga announce yuboradi
- **Challenge turlari:** watch_video, complete_quiz, streak, share_prompt
- **Pool:** Hafta kuni bo'yicha 7 xil challenge navbat bilan
- **Env:** `CHALLENGE_SCHEDULER_ENABLED=false` — o'chirish uchun

## Prompt Library (NEW)

```
GET    /api/prompts             # List (filter: category, tool, sort, search)
GET    /api/prompts/featured    # Featured prompts
GET    /api/prompts/:id         # Single + views++
POST   /api/prompts             # Create (auth) — +30 XP
POST   /api/prompts/:id/like    # Toggle like (auth)
DELETE /api/prompts/:id         # Delete (owner or admin)
PATCH  /api/prompts/:id/feature # Feature/unfeature (admin)
```

Categories: coding, debugging, vibe_coding, claude, cursor, copilot, architecture, refactoring, testing, documentation, other
Tools: Claude Code, Cursor, GitHub Copilot, ChatGPT, Gemini, Windsurf, Any

## AI Stack (User Model) ← NEW

User.aiStack: ['Claude Code', 'Cursor', 'GitHub Copilot', ...]

- Profile → "AI Stack" tab da foydalanuvchi toollarini tanlaydi
- Leaderboard da AI tool ikonlari ko'rinadi (🤖⚡🐙)
- `PUT /api/xp/profile` body ga `aiStack: string[]` qo'shish mumkin
- Ranking `/api/ranking/users` da `aiStack` field qaytariladi

## XP & Gamification

| Harakat | XP |
|---------|-----|
| Video ko'rish | +50 |
| Quiz to'g'ri javob | +10 (per question) |
| Quiz o'tish (bonus) | +100 |
| Daily challenge | +80–250 (challenge tipiga qarab) |
| Prompt yaratish | +30 ← NEW |
| Project yakunlash | +200 |

Rank: AMATEUR → CANDIDATE → JUNIOR → MIDDLE → SENIOR → MASTER → LEGEND

## Important Rules

- Auth uses **secure cookies** — never reintroduce localStorage token storage
- Subscription gating is **business-critical** — don't bypass or weaken
- `socialVerification.js` checks **only public channel** for subscription gate
- Private channel (`TELEGRAM_PRIVATE_CHANNEL_USERNAME`) needs numeric chat_id format
- Instagram uses soft-check (always true if username provided)
- `backend/seeders/seedCourses.js` is destructive — only runs with `ALLOW_DESTRUCTIVE_SEED=true`

## Key Env Vars

```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHANNEL_USERNAME=aidevix        # Public channel (subscription gate)
TELEGRAM_ADMIN_CHAT_ID=697727022         # Admin Telegram ID
GROQ_API_KEY                             # Groq AI (news + coach)
NEWS_ENABLED=true                        # AI news scheduler
CHALLENGE_SCHEDULER_ENABLED=true         # Daily challenge scheduler (default: true)
BUNNY_STREAM_API_KEY / BUNNY_LIBRARY_ID  # Video hosting
FRONTEND_URL                             # CORS allowed origins
```

## High-signal Files

**Backend core:**
- `backend/index.js` — app entry, all routes registered here
- `backend/controllers/xpController.js` — XP, quiz, profile (aiStack) update
- `backend/controllers/promptController.js` — Prompt Library
- `backend/controllers/rankingController.js` — Leaderboard (aiStack included)
- `backend/controllers/challengeController.js` — Daily challenges
- `backend/middleware/subscriptionCheck.js` — real-time subscription gate
- `backend/utils/newsScheduler.js` — AI news (Claude/Codex/Cursor focused)
- `backend/utils/challengeScheduler.js` — Auto daily challenge + bot announce
- `backend/utils/telegramBot.js` — Bot + /postnews command
- `backend/models/User.js` — aiStack field, socialSubscriptions, gamification
- `backend/models/Prompt.js` — Prompt Library model

**Frontend core:**
- `frontend/src/api/axiosInstance.ts` — Axios config with cookie auth
- `frontend/src/api/promptApi.ts` — Prompt Library API
- `frontend/src/app/prompts/page.tsx` — Prompt Library page
- `frontend/src/app/profile/page.tsx` — Profile + AI Stack tab
- `frontend/src/components/common/AICoach.tsx` — Floating AI assistant
- `frontend/src/components/leaderboard/LeaderboardTable.tsx` — AI Stack icons
- `frontend/src/utils/constants.ts` — ROUTES (includes PROMPTS)

## Verification Commands

```bash
node --check backend/index.js                              # Backend syntax
node ./node_modules/typescript/bin/tsc --noEmit             # Frontend types
node ./node_modules/eslint/bin/eslint.js src --ext .ts,.tsx  # Frontend lint
```

## Deploy

```bash
git push origin main                    # Backend auto-deploys on Railway
npx vercel --prod                       # Frontend deploy to aidevix.uz
```
