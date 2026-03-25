# CLAUDE.md

Aidevix — online coding course platform (Uzbek developers). Telegram+Instagram subscription required before video access. Videos = one-time Telegram private channel links.

## Structure
- `backend/` — Node.js + Express (CommonJS, port 5000)
- `frontend/` — React + Vite SPA (ESM, port 3000)
- `docs/students/` — Per-student API guides

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

### Video Access (Critical)
`GET /api/videos/:id`: `authenticate` → `checkSubscriptions` (real-time `getChatMember` Bot API, returns 403 + `missingSubscriptions[]`) → `getVideo` (creates one-time VideoLink doc).
`POST /api/videos/link/:linkId/use` — marks link `isUsed: true`.

### Key Models
User (username/email/bcrypt pw/refreshToken/socialSubscriptions/role), Course (category: html|css|js|react|ts|nodejs|general), Video, VideoLink (telegramLink/isUsed/expiresAt), UserStats (xp/level/streak/badges), Quiz/QuizResult, Project, Enrollment, Section, Certificate, DailyChallenge, CourseRating, Wishlist, Follow, Payment, VideoQuestion

### Utilities
- `utils/socialVerification.js` — Telegram: `getChatMember` Bot API; Instagram: placeholder
- `utils/badgeService.js` — XP/activity badge awards
- `utils/emailService.js` — Nodemailer
- `middleware/uploadMiddleware.js` — Multer + Cloudinary

### Backend Env Vars
`MONGODB_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_USERNAME`, `TELEGRAM_PRIVATE_CHANNEL_USERNAME`, `FRONTEND_URL`, `SWAGGER_USERNAME`/`SWAGGER_PASSWORD`

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

### Key Files
- `src/api/axiosInstance.js` — sets baseURL from `VITE_API_BASE_URL`, queues 401s, calls `/auth/refresh`, redirects `/login` on failure
- `src/utils/constants.js` — `CATEGORIES`, `ROUTES`, `STORAGE_KEYS`, `SOCIAL_LINKS`, `SORT_OPTIONS`
- `src/router/AppRouter.jsx` — lazy pages, `<ProtectedRoute>`, GSAP transitions on `#page-wrapper`
- `src/animations/three/HeroScene.js` — Three.js hero (toggle: `VITE_ENABLE_3D_HERO`)
- `src/components/videos/VideoLinkModal.jsx` — calls `/use` endpoint after opening link
- `src/components/subscription/SubscriptionGate.jsx` — blocks video if not subscribed

### Path Aliases
`@` = `src/`, also `@components` `@pages` `@store` `@hooks` `@api` `@utils` `@animations` `@assets` `@styles`

### Frontend Env Vars
`VITE_API_BASE_URL` (default: `http://localhost:5000/api`), `VITE_ENABLE_3D_HERO`, `VITE_ENABLE_GSAP`, `VITE_TELEGRAM_CHANNEL`, `VITE_INSTAGRAM_URL`, `VITE_TELEGRAM_BOT`

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
- `render.yaml` at root configures Render.com backend deployment
