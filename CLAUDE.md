# CLAUDE.md

Aidevix — online coding course platform (Uzbek developers). Telegram+Instagram subscription required before video access. Videos = **Bunny.net signed embed URLs** (NOT Telegram links).

## Structure
- `backend/` — Node.js + Express (CommonJS, port 5000)
- `frontend/` — React + Vite SPA (ESM, port 3000)
- `docs/students/` — Per-student API guides (9 students)

## Deployment
- **Backend**: Railway — `https://aidevix-backend-production.up.railway.app`
- **Frontend**: Vercel — auto-deploys from `main` branch
- **Branch**: `sunnatbek` is the main working branch (Railway watches this)
- **Old platform**: Render.com — REPLACED by Railway, do not use `aidevixbackend.onrender.com`

## Commands
```bash
# Backend
cd backend && npm run dev      # nodemon
cd backend && npm run seed     # seed sample courses

# Frontend
cd frontend && npm run dev     # Vite (proxies /api → :5000)
cd frontend && npm run lint    # ESLint max-warnings 0

# Env setup
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Backend

### Route Map
```
/api/auth          → authRoutes.js         (authLimiter)
/api/subscriptions → subscriptionRoutes.js
/api/courses       → courseRoutes.js
/api/videos        → videoRoutes.js
/api/ranking       → rankingRoutes.js      (top courses + users by XP)
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

### Auth
- JWT: access (15m) + refresh (7d) tokens stored in localStorage via `utils/tokenStorage.js`
- `middleware/auth.js`: `authenticate` + `requireAdmin`
- `authLimiter` on auth routes; `apiLimiter` on all `/api/`
- Login + register responses include `role` field (added for admin panel)
- Admin credentials: `yusupovsunnatbek32@gmail.com` / `Admin1234`, role=admin in MongoDB

### Video Access (Critical) — Bunny.net System
`GET /api/videos/:id`: `authenticate` → `checkSubscriptions` (real-time `getChatMember` Telegram Bot API, returns 403 + `missingSubscriptions[]`) → `getVideo` → returns `player.embedUrl` (Bunny.net signed iframe URL, 2-hour expiry).

Response structure:
```json
{
  "video": { "title": "...", "description": "...", "bunnyVideoId": "...", ... },
  "player": {
    "embedUrl": "https://iframe.mediadelivery.net/embed/...",
    "expiresAt": "2025-01-01T12:00:00.000Z"
  }
}
```
Returns 503 if `bunnyStatus !== 'ready'` (video still processing on Bunny.net).

**OLD system (DEPRECATED)**: `POST /api/videos/link/:linkId/use` — one-time Telegram links. Still in code but no longer the primary flow.

### Bunny.net Video Upload Flow (Admin)
1. Admin creates video doc via `POST /api/videos` → gets `videoId`
2. Admin gets Tus upload credentials via `GET /api/videos/:id/upload-credentials`
3. Admin uploads file to Bunny.net via Tus protocol (or links existing Bunny GUID via `PATCH /api/videos/:id/link-bunny`)
4. Bunny processes video → `bunnyStatus` changes to `ready`
5. Students can now access via `GET /api/videos/:id`

### Key Models
User (username/email/bcrypt pw/refreshToken/socialSubscriptions/role), Course (category: html|css|js|react|ts|nodejs|general), Video (bunnyVideoId/bunnyStatus/materials/viewCount), VideoLink (DEPRECATED: telegramLink/isUsed/expiresAt), UserStats (xp/level/streak/badges), Quiz/QuizResult, Project, Enrollment, Section, Certificate, DailyChallenge, CourseRating, Wishlist, Follow, Payment, VideoQuestion

### Utilities
- `utils/socialVerification.js` — Telegram: `getChatMember` Bot API; Instagram: placeholder (always returns DB value)
- `utils/badgeService.js` — XP/activity badge awards
- `utils/emailService.js` — Nodemailer
- `middleware/uploadMiddleware.js` — Multer + Cloudinary

### Backend Env Vars
```
MONGODB_URI
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
TELEGRAM_BOT_TOKEN
TELEGRAM_CHANNEL_USERNAME
TELEGRAM_PRIVATE_CHANNEL_USERNAME
FRONTEND_URL
SWAGGER_USERNAME / SWAGGER_PASSWORD
BUNNY_STREAM_API_KEY      # Bunny.net Stream API key
BUNNY_LIBRARY_ID          # Bunny.net library ID
BUNNY_TOKEN_KEY           # Bunny.net token authentication key (for signed URLs)
```

## Frontend

### Stack
React 18 + Vite, Redux Toolkit (6 slices), DaisyUI theme `"aidevix"` + Tailwind, Three.js + GSAP, React Router v6, Axios with JWT auto-refresh interceptor

### Redux Slices
- `auth` — `isLoggedIn`, `user` (checkAuthStatus reads localStorage, no network)
- `courses` — list, filters, pagination, detail
- `videos` — list per course, current video
- `subscription` — `instagram`/`telegram` booleans
- `ranking` — `topCourses`, `topUsers`
- `userStats` — xp, level (1000 XP = 1 level), streak, badges, bio, skills; `justLeveledUp`/`newLevel` flags

### Admin Panel
- Route: `/admin/*` → `AdminLayout.jsx` (self-contained, no dependency on student stubs)
- `AdminLayout.jsx` has embedded login form — shows if `!isLoggedIn || user?.role !== 'admin'`
- Sub-routes: `/admin` (Dashboard), `/admin/courses`, `/admin/videos`, `/admin/users`
- Key pages: `DashboardPage`, `CoursesPage`, `CourseEditPage`, `VideosPage`, `VideoUploadPage`, `UsersPage`
- `VideoUploadPage` has two modes: "Yangi fayl yuklash" (Tus upload) | "Mavjud Bunny ID bog'lash" (link existing GUID)
- API calls go through `src/api/adminApi.js`

### Key Files
- `src/api/axiosInstance.js` — sets baseURL from `VITE_API_BASE_URL`, queues 401s, calls `/auth/refresh`, redirects `/login` on failure
- `src/api/adminApi.js` — all admin API calls (stats, users CRUD, courses CRUD, videos CRUD, upload)
- `src/utils/constants.js` — `CATEGORIES`, `ROUTES`, `STORAGE_KEYS`, `SOCIAL_LINKS`, `SORT_OPTIONS`
- `src/router/AppRouter.jsx` — lazy pages, `<ProtectedRoute>`, GSAP transitions on `#page-wrapper`
- `src/animations/three/HeroScene.js` — Three.js hero (toggle: `VITE_ENABLE_3D_HERO`)
- `src/components/subscription/SubscriptionGate.jsx` — blocks video if not subscribed
- `vercel.json` — SPA rewrites: `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`

### Path Aliases
`@` = `src/`, also `@components` `@pages` `@store` `@hooks` `@api` `@utils` `@animations` `@assets` `@styles`

### Frontend Env Vars
```
VITE_API_BASE_URL=https://aidevix-backend-production.up.railway.app/api
VITE_ENABLE_3D_HERO
VITE_ENABLE_GSAP
VITE_TELEGRAM_CHANNEL=https://t.me/aidevix
VITE_INSTAGRAM_URL=https://instagram.com/aidevix
VITE_TELEGRAM_BOT=https://t.me/aidevix_bot
```

## Key Patterns
- **API response**: `{ data: { data: ... } }` — thunks always `return data.data`
- **Errors**: backend sends Uzbek strings → `state.error` → `react-hot-toast`
- **Feature ownership**: `// SUHROB`, `// NUMTON`, `// ABDUVORIS` comments — preserve when editing
- **Routes**: use `ROUTES.COURSE(id)` from constants, never hardcode paths
- **Classes**: use `clsx` for conditionals
- **Build chunks**: `vendor` (react/router), `redux`, `three`, `gsap`, `ui` (swiper/framer-motion)

## Notes
- No test framework — `npm test` exits with error 1
- Swagger default creds: `Aidevix`/`sunnatbee` (override via env in prod)
- `render.yaml` at root — legacy Render config, no longer used
- `railway.json` or `Dockerfile` used for Railway deployment
- Student docs in `docs/students/`: ABDUVORIS, AZIZ, BOISXON, DONIYOR, FIRDAVS, NUMTON, QUDRAT, SUHROB, ABDUVOHID
- ABDUVORIS is responsible for VideoPage implementation (currently a stub returning null)
