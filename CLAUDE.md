# CLAUDE.md

Repo summary for agents and contributors. Read this before any work.

## Model Selection (Prompt Murakkabligiga Qarab)

| Daraja | Model | Qachon ishlatish |
|--------|-------|-----------------|
| Tez/Oddiy | `claude-haiku-4-5` | Savolga javob, typo fix, kichik o'zgarish, tushuntirish |
| O'rta (default) | `claude-sonnet-4-6` | Feature qo'shish, bug fix, ko'p fayl tahrirlash |
| Murakkab | `claude-opus-4-7` | Arxitektura dizayn, katta refactor, security review, multi-agent task |

> Agent yoki `/model` bilan model almashtiring. Shubha bo'lsa — Sonnet 4.6 default.

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
├── index.js                          # Express app entry, all routes registered
├── controllers/                      # 17 controllers
│   ├── authController.js             # register, login, daily-reward, forgot/reset password
│   ├── courseController.js           # CRUD, categories, recommend, rate
│   ├── videoController.js            # CRUD, Bunny.net, questions
│   ├── xpController.js               # XP, quiz submit, profile update (aiStack), leaderboard
│   ├── rankingController.js          # Top users (with aiStack), top courses, weekly
│   ├── challengeController.js        # Daily challenges CRUD + progress
│   ├── promptController.js           # Prompt Library CRUD, like, featured
│   ├── subscriptionController.js     # Telegram/Instagram verify, token linking
│   ├── paymentController.js          # Payme/Click payment processing
│   ├── enrollmentController.js       # Course enrollment + progress
│   ├── certificateController.js      # Certificate generate, verify, download
│   ├── projectController.js          # Practical projects per course
│   ├── adminController.js            # Admin stats, manage users/courses/payments
│   ├── followController.js           # User follow/unfollow
│   ├── wishlistController.js         # Course wishlist
│   ├── sectionController.js          # Course sections
│   └── uploadController.js           # File/avatar upload (Cloudinary)
├── middleware/
│   ├── auth.js                       # JWT authenticate + requireAdmin
│   ├── subscriptionCheck.js          # Real-time Telegram+Instagram gate (403 if not subscribed)
│   ├── rateLimiter.js                # API + auth rate limiting
│   ├── errorMiddleware.js            # Global error handler
│   └── swaggerAuth.js                # Basic auth for Swagger UI
├── models/                           # 20+ Mongoose schemas
│   ├── User.js                       # aiStack[], socialSubscriptions, gamification, referral
│   ├── Prompt.js                     # Prompt Library
│   ├── Course.js / Video.js / Section.js / VideoLink.js
│   ├── DailyChallenge.js / UserChallengeProgress.js
│   ├── Quiz.js / QuizResult.js
│   ├── UserStats.js                  # XP, level, streak, badges, skills
│   ├── Enrollment.js / Certificate.js / Project.js
│   ├── Payment.js / Wishlist.js / Follow.js
│   ├── CourseRating.js / VideoQuestion.js
│   └── BotChannel.js / VerifyToken.js
├── routes/                           # 17 route files (1-to-1 with controllers)
│   └── promptRoutes.js               # /api/prompts
├── config/
│   ├── database.js                   # Mongoose connect
│   ├── swagger.js                    # Public Swagger spec
│   └── swaggerAdmin.js               # Admin Swagger spec
└── utils/
    ├── newsScheduler.js              # Kunlik AI news (10:00, 16:00, 20:00 Toshkent)
    ├── challengeScheduler.js         # Kunlik DailyChallenge + bot announce (00:00)
    ├── telegramBot.js                # Bot + /postnews admin command
    ├── socialVerification.js         # Telegram getChatMember API
    ├── checkSubscriptions.js         # performSubscriptionCheck()
    ├── subscriptionCache.js          # Subscription result caching
    ├── schedulerState.js             # Scheduler run state tracking
    ├── bunny.js                      # Bunny.net signed URL generator
    ├── jwt.js                        # Token sign/verify
    ├── emailService.js               # Nodemailer
    ├── badgeService.js               # Auto badge award
    ├── authSecurity.js               # Auth security helpers
    ├── errorResponse.js              # Standardized error response helper
    └── logger.js                     # Structured HTTP request logger

frontend/
├── src/api/
│   ├── axiosInstance.ts              # Axios + cookie auth (withCredentials: true)
│   ├── authApi.ts                    # register, login, logout, me, daily-reward
│   ├── courseApi.ts                  # getAllCourses, getCourse, top, rate
│   ├── videoApi.ts                   # getCourseVideos, getVideo, search, questions
│   ├── subscriptionApi.ts            # status, verifyTelegram, generateToken, checkToken
│   ├── rankingApi.ts                 # topCourses, topUsers, userPosition, weekly
│   ├── userApi.ts                    # getUserStats, submitQuiz, updateProfile
│   ├── promptApi.ts                  # getAll, getFeatured, getOne, create, like, delete
│   ├── adminApi.ts                   # getDashboardStats, getUsers, getRecentPayments, CRUD
│   ├── forgotPasswordApi.ts
│   └── uploadApi.ts                  # uploadFile, uploadAvatar
├── src/store/slices/
│   ├── authSlice.ts / courseSlice.ts / videoSlice.ts
│   ├── subscriptionSlice.ts / rankingSlice.ts
│   └── userStatsSlice.ts
├── src/hooks/
│   ├── useAuth.ts / useCourses.ts / useVideos.ts
│   ├── useSubscription.ts / useRanking.ts / useUserStats.ts
├── src/config/
│   └── adminNav.tsx                  # ADMIN_NAV sections/items — sidebar config
├── src/components/
│   ├── auth/         LoginForm, RegisterForm, ProtectedRoute, AdminRoute
│   ├── common/
│   │   ├── AICoach.tsx               # Floating AI assistant (calls Next.js /api/coach)
│   │   └── DailyRewardModal, Badge, Button, Input, Loader, Modal, StarRating...
│   ├── courses/      CourseCard, CourseFilter, CourseGrid, CourseSkeleton
│   ├── videos/       VideoCard, VideoLinkModal, VideoRating
│   ├── subscription/ SubscriptionGate, TelegramVerify, InstagramVerify
│   ├── leaderboard/  LeaderboardTable (AI Stack icons), LevelUpModal, UserXPCard
│   ├── layout/       Navbar (⚡ Prompts link), Footer, ScrollToTop
│   └── ranking/      CourseRankCard
├── src/app/                          # Next.js App Router
│   ├── page.tsx                      # Homepage
│   ├── courses/[id]/page.tsx         # Course detail
│   ├── videos/[id]/page.tsx          # Video player
│   ├── profile/page.tsx              # Profile + AI Stack tab (4th tab)
│   ├── prompts/page.tsx              # Prompt Library
│   ├── leaderboard/page.tsx          # XP leaderboard
│   ├── challenges/page.tsx           # Daily challenges
│   ├── referral/page.tsx             # Referral program
│   ├── pricing/page.tsx
│   ├── blog/page.tsx / about/page.tsx / careers/page.tsx / contact/page.tsx
│   ├── help/page.tsx / verify-code/page.tsx / level-up/page.tsx
│   └── admin/                        # Admin panel (AdminRoute protected)
│       ├── layout.tsx                # Sidebar nav (ADMIN_NAV), mobile drawer
│       ├── page.tsx                  # Dashboard: stats cards, top students, top courses
│       ├── courses/page.tsx          # Course CRUD list + create form
│       ├── courses/[id]/page.tsx     # Course detail editor (videos, sections)
│       ├── users/page.tsx            # User list: search, role toggle, block/unblock, delete
│       ├── payments/page.tsx         # Payment history (paginated)
│       ├── tools/page.tsx            # Admin: create daily challenge
│       └── settings/page.tsx         # Swagger links + Bunny.net info
└── src/utils/
    ├── constants.ts   # BACKEND_ORIGIN, API_BASE_URL, ROUTES, CATEGORIES, SOCIAL_LINKS
    ├── i18n.ts
    └── xpLevel.ts
```

## Admin Panel (`/admin`)

Faqat `role: 'admin'` foydalanuvchilar kiradi (`AdminRoute` component).

| Sahifa | URL | Funksiya |
|--------|-----|----------|
| Dashboard | `/admin` | Stats, top students, top courses |
| Kurslar | `/admin/courses` | List, create, delete |
| Kurs tahriri | `/admin/courses/[id]` | Full course editor: videos, sections |
| Foydalanuvchilar | `/admin/users` | Search, role toggle, block, delete |
| To'lovlar | `/admin/payments` | Payment history (paginated) |
| Vazifalar | `/admin/tools` | Kunlik challenge yaratish |
| Sozlamalar | `/admin/settings` | Swagger links, Bunny.net info |

## Subscription Flow (business-critical)

```
User opens course → subscriptionCheck middleware → checkTelegramSubscription()
                                                   ├── Public channel only (@aidevix)
                                                   ├── Uses Telegram Bot API getChatMember
                                                   ├── checked=true  → result is reliable
                                                   └── checked=false → network error, DB fallback

Frontend (TelegramVerify.tsx):
  Step 1: User subscribes to @aidevix channel
  Step 2: User clicks "BOT ORQALI BOG'LASH" → bot links Telegram ID
  Polling: checkVerifyToken every 3s until linked+subscribed
```

## News Scheduler (newsScheduler.js)

- **Vaqt:** 10:00, 16:00, 20:00 Toshkent
- **Fokus:** Claude, Codex, Cursor, Copilot, Windsurf — professional AI tools
- **RSS:** Anthropic, OpenAI, GitHub, HackerNews (AI filter), TechCrunch, Wired
- **AI Post:** Groq llama-3.3-70b → o'zbekcha tahlil + amaliy skill tip
- **Env:** `NEWS_ENABLED=true` yoki `SEND_NEWS=true`

## Challenge Scheduler (challengeScheduler.js)

- **Vaqt:** Har kuni 00:00 Toshkent
- **Challenge turlari:** watch_video, complete_quiz, streak, share_prompt
- **Pool:** Hafta kuni bo'yicha navbat bilan
- **Env:** `CHALLENGE_SCHEDULER_ENABLED=false` — o'chirish

## Prompt Library

```
GET    /api/prompts             # List (filter: category, tool, sort, search)
GET    /api/prompts/featured    # Featured prompts
GET    /api/prompts/:id         # Single + views++
POST   /api/prompts             # Create (auth) — +30 XP
POST   /api/prompts/:id/like    # Toggle like (auth)
DELETE /api/prompts/:id         # Delete (owner or admin)
PATCH  /api/prompts/:id/feature # Feature/unfeature (admin)
```

Categories: `coding, debugging, vibe_coding, claude, cursor, copilot, architecture, refactoring, testing, documentation, other`
Tools: `Claude Code, Cursor, GitHub Copilot, ChatGPT, Gemini, Windsurf, Any`

## AI Stack (User Model)

`User.aiStack: ['Claude Code', 'Cursor', 'GitHub Copilot', ...]`

- Profile → "AI Stack" tab (4th tab)
- `PUT /api/xp/profile` body: `{ aiStack: string[] }`
- Leaderboard da AI tool ikonlari (🤖⚡🐙)
- Enum: `Claude Code, Cursor, GitHub Copilot, ChatGPT, Gemini, Windsurf, Devin, Replit AI, Codeium, Other`

## XP & Gamification

| Harakat | XP |
|---------|-----|
| Video ko'rish | +50 |
| Quiz to'g'ri javob | +10 (per question) |
| Quiz o'tish (bonus) | +100 |
| Daily challenge | +80–250 |
| Prompt yaratish | +30 |
| Project yakunlash | +200 |

Rank: `AMATEUR → CANDIDATE → JUNIOR → MIDDLE → SENIOR → MASTER → LEGEND`

## Important Rules

- Auth: **secure cookies only** — localStorage token storage FORBIDDEN
- Subscription gate: **business-critical** — never bypass or weaken
- `socialVerification.js` checks **only public channel** (@aidevix)
- Instagram: soft-check (always true if username provided)
- `backend/seeders/seedCourses.js`: destructive — requires `ALLOW_DESTRUCTIVE_SEED=true`
- `frontend/CLAUDE.md`: backend fayllarini o'zgartirish TAQIQLANGAN

## Key Env Vars

```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHANNEL_USERNAME=aidevix        # Public channel (subscription gate)
TELEGRAM_ADMIN_CHAT_ID=697727022         # Admin Telegram ID
GROQ_API_KEY                             # Groq AI (news + coach)
NEWS_ENABLED=true                        # AI news scheduler
CHALLENGE_SCHEDULER_ENABLED=true         # Daily challenge scheduler
BUNNY_STREAM_API_KEY, BUNNY_LIBRARY_ID, BUNNY_TOKEN_KEY
FRONTEND_URL                             # CORS allowed origins (comma-separated)
BACKEND_URL                              # Self URL (Railway)
```

## High-signal Files

**Backend:**
- `backend/index.js` — entry, routes, middleware order (CORS first!)
- `backend/controllers/adminController.js` — admin stats, users, payments
- `backend/controllers/xpController.js` — XP, quiz, profile (aiStack)
- `backend/controllers/promptController.js` — Prompt Library
- `backend/middleware/subscriptionCheck.js` — subscription gate
- `backend/utils/newsScheduler.js` — AI news
- `backend/utils/challengeScheduler.js` — daily challenge + bot
- `backend/models/User.js` — aiStack, socialSubscriptions, gamification

**Frontend:**
- `frontend/src/api/adminApi.ts` — admin API calls + `unwrapAdmin<T>` helper
- `frontend/src/config/adminNav.tsx` — ADMIN_NAV sidebar config
- `frontend/src/app/admin/layout.tsx` — AdminRoute wrapper, sidebar
- `frontend/src/api/axiosInstance.ts` — Axios + cookie auth
- `frontend/src/utils/constants.ts` — ROUTES, BACKEND_ORIGIN, API_BASE_URL

## Verification Commands

```bash
node --check backend/index.js                              # Backend syntax check
cd frontend && npx tsc --noEmit                            # TypeScript check
cd frontend && npx eslint src --ext .ts,.tsx               # ESLint
```

## Deploy

```bash
git push origin main          # Backend auto-deploys on Railway
cd frontend && npx vercel --prod   # Frontend → aidevix.uz (Vercel)
```
