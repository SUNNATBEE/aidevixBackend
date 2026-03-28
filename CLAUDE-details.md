# CLAUDE-details.md — Aidevix Batafsil Arxitektura

## Backend Route Map
```
/api/auth          → authRoutes.js         (authLimiter)
/api/subscriptions → subscriptionRoutes.js
/api/courses       → courseRoutes.js
/api/videos        → videoRoutes.js
/api/ranking       → rankingRoutes.js
/api/xp            → xpRoutes.js
/api/projects      → projectRoutes.js
/api/enrollments   → enrollmentRoutes.js
/api/wishlist      → wishlistRoutes.js
/api/certificates  → certificateRoutes.js
/api/sections      → sectionRoutes.js
/api/follow        → followRoutes.js
/api/challenges    → challengeRoutes.js
/api/payments      → paymentRoutes.js
/api/admin         → adminRoutes.js        (requireAdmin)
/api/upload        → uploadRoutes.js       (Multer+Cloudinary)
/health            → inline (no auth)
/api-docs          → Swagger (HTTP Basic: SWAGGER_USERNAME/SWAGGER_PASSWORD)
/admin-docs        → Admin Swagger
```

## Auth Details
- JWT: access (15m) + refresh (7d) → localStorage via `utils/tokenStorage.js`
- `middleware/auth.js`: `authenticate` + `requireAdmin`
- `authLimiter` on auth routes; `apiLimiter` on all `/api/`
- Login + register responses include `role` field
- Admin: `yusupovsunnatbek32@gmail.com` / `Admin1234`, role=admin

## Bunny.net Video Upload Flow (Admin)
1. `POST /api/videos` → creates Video doc → returns `videoId`
2. `GET /api/videos/:id/upload-credentials` → Tus upload URL
3. Upload via Tus OR link existing GUID: `PATCH /api/videos/:id/link-bunny { bunnyVideoId }`
4. Bunny processes → `bunnyStatus: 'ready'` → students can access

## Key Models
- User (username/email/bcrypt pw/refreshToken/socialSubscriptions/role)
- Course (category: html|css|js|react|ts|nodejs|general)
- Video (bunnyVideoId/bunnyStatus/materials/viewCount)
- VideoLink (DEPRECATED: telegramLink/isUsed/expiresAt)
- UserStats (xp/level/streak/badges)
- Quiz/QuizResult, Project, Enrollment, Section, Certificate
- DailyChallenge, CourseRating, Wishlist, Follow, Payment, VideoQuestion

## Utilities
- `utils/socialVerification.js` — Telegram: getChatMember Bot API; Instagram: placeholder (returns DB value)
- `utils/badgeService.js` — XP/activity badge awards
- `utils/emailService.js` — Nodemailer
- `middleware/uploadMiddleware.js` — Multer + Cloudinary

## Backend Env Vars
```
MONGODB_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_USERNAME, TELEGRAM_PRIVATE_CHANNEL_USERNAME
FRONTEND_URL
SWAGGER_USERNAME / SWAGGER_PASSWORD        # default: Aidevix / sunnatbee
BUNNY_STREAM_API_KEY, BUNNY_LIBRARY_ID, BUNNY_TOKEN_KEY
```

## Frontend Stack
React 18 + Vite, Redux Toolkit (6 slices), DaisyUI `"aidevix"` + Tailwind, Three.js + GSAP, React Router v6

## Redux Slices
- `auth` — isLoggedIn, user (localStorage, no network)
- `courses` — list, filters, pagination, detail
- `videos` — list per course, current video
- `subscription` — instagram/telegram booleans
- `ranking` — topCourses, topUsers
- `userStats` — xp, level (1000 XP=1 level), streak, badges; justLeveledUp/newLevel flags

## Admin Panel
- Route: `/admin/*` → `AdminLayout.jsx` (self-contained login, no student deps)
- Pages: Dashboard, Courses CRUD, Videos+Upload, Users
- VideoUploadPage: "Yangi fayl" (Tus) | "Mavjud Bunny ID" (link GUID)
- API: `src/api/adminApi.js`

## Key Frontend Files
- `src/api/axiosInstance.js` — baseURL from VITE_API_BASE_URL, queues 401s, auto-refresh
- `src/api/adminApi.js` — all admin calls
- `src/utils/constants.js` — CATEGORIES, ROUTES, STORAGE_KEYS, SOCIAL_LINKS
- `src/router/AppRouter.jsx` — lazy pages, ProtectedRoute, GSAP transitions
- `src/components/subscription/SubscriptionGate.jsx` — blocks video if not subscribed
- `vercel.json` — SPA rewrite rule

## Frontend Env Vars
```
VITE_API_BASE_URL=https://aidevix-backend-production.up.railway.app/api
VITE_ENABLE_3D_HERO, VITE_ENABLE_GSAP
VITE_TELEGRAM_CHANNEL, VITE_INSTAGRAM_URL, VITE_TELEGRAM_BOT
```

## Path Aliases
`@` = `src/`, also `@components` `@pages` `@store` `@hooks` `@api` `@utils` `@animations` `@assets` `@styles`

## Build Chunks
`vendor` (react/router), `redux`, `three`, `gsap`, `ui` (swiper/framer-motion)

## Notes
- No test framework — `npm test` exits 1
- `render.yaml` — legacy Render config, unused
- Student docs in `docs/students/`: ABDUVORIS, AZIZ, BOISXON, DONIYOR, FIRDAVS, NUMTON, QUDRAT, SUHROB, ABDUVOHID
- ABDUVORIS owns VideoPage (currently stub returning null)
