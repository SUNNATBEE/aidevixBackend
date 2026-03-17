# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aidevix is an online coding course platform for Uzbek-speaking developers. Users must subscribe to Telegram and Instagram channels before accessing video content. Videos are served as one-time-use links from a private Telegram channel.

## Repository Structure

```
AidevixBackend/
├── backend/          # Node.js + Express API (CommonJS, port 5000)
└── frontend/         # React + Vite SPA (ESM, port 3000)
```

## Commands

### Backend
```bash
cd backend
npm install
npm run dev        # nodemon (auto-restart on save)
npm start          # production
npm run seed       # seed the database with sample courses
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # Vite dev server (proxies /api → localhost:5000)
npm run build      # production build to dist/
npm run lint       # ESLint (max-warnings 0, will fail CI)
npm run preview    # preview production build
```

### Environment Setup
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Fill in MONGODB_URI, JWT secrets, TELEGRAM_BOT_TOKEN
```

## Architecture

### Authentication Flow
- Access token (15m) + refresh token (7d), both JWT
- Frontend: `axiosInstance.js` intercepts 401s, calls `/auth/refresh`, queues concurrent requests, redirects to `/login` on refresh failure
- Backend: `middleware/auth.js` exports `authenticate` (JWT verify) and `requireAdmin` (role check)
- Tokens stored in `localStorage` via `utils/tokenStorage.js` using keys from `STORAGE_KEYS`

### Video Access Control (Critical)
Three middleware layers on `GET /api/videos/:id`:
1. `authenticate` — verify JWT
2. `checkSubscriptions` — **real-time** Telegram Bot API check of both Instagram and Telegram channel membership; updates DB if status changed; returns 403 with `missingSubscriptions` array if not subscribed
3. `getVideo` — fetch video, generate one-time VideoLink doc with a Telegram private channel URL

The `POST /api/videos/link/:linkId/use` endpoint marks a VideoLink as `isUsed: true` after the user opens the video. Frontend calls this in `VideoLinkModal.jsx` after opening the link.

### Redux Store (6 slices)
- `auth` — user, tokens, auth status
- `courses` — course list, filters, single course
- `videos` — video list per course, current video
- `subscription` — Instagram/Telegram verification status
- `ranking` — top courses by viewCount, top users by XP (used in `TopCoursesPage`, `LeaderboardPage`)
- `userStats` — XP, level (1000 XP = 1 level), streak, badges, bio, skills

### Frontend API Layer
All API calls go through `src/api/axiosInstance.js` which sets `baseURL` from `VITE_API_BASE_URL`. Each domain has its own API module (`authApi`, `courseApi`, `videoApi`, `subscriptionApi`, `rankingApi`, `userApi`). Custom hooks in `src/hooks/` wrap Redux dispatch for components.

### Routing (AppRouter.jsx)
All pages lazy-loaded. Protected routes wrapped in `<ProtectedRoute />` (checks `auth` slice). Page transitions use GSAP `fromTo` on `#page-wrapper` on location change. GSAP plugins (`ScrollTrigger`, `ScrollToPlugin`) are registered globally in `App.jsx`.

### Backend Route Map
```
/api/auth         → authRoutes.js
/api/subscriptions → subscriptionRoutes.js
/api/courses       → courseRoutes.js
/api/videos        → videoRoutes.js
/api/ranking       → rankingRoutes.js  (top courses + top users by XP)
/api/xp            → xpRoutes.js       (XP award/query)
/api/projects      → projectRoutes.js  (student projects)
/health            → inline (no auth)
/api-docs          → Swagger UI (HTTP Basic auth: SWAGGER_USERNAME/SWAGGER_PASSWORD)
/admin-docs        → Admin Swagger UI  (same auth)
```

### Key Models
- `User` — username, email, password (bcrypt, select:false), refreshToken, `socialSubscriptions.{instagram,telegram}.{subscribed,username,telegramUserId}`, role (`user`|`admin`)
- `Course` — title, description, category (html|css|javascript|react|typescript|nodejs|general), viewCount, rating
- `Video` — title, description, course (ref), order, duration (seconds), isActive, thumbnail
- `VideoLink` — video (ref), user (ref), telegramLink, isUsed, usedAt, expiresAt
- `UserStats` — userId (unique ref), xp, level, streak, videosWatched, quizzesCompleted, badges[], bio, skills[], avatar
- `Quiz` / `QuizResult` — quiz questions and student answers

### Vite Path Aliases
`@` → `src/`, `@components`, `@pages`, `@store`, `@hooks`, `@api`, `@utils`, `@animations`, `@assets`, `@styles`

### Frontend Constants (`src/utils/constants.js`)
Defines `CATEGORIES`, `SORT_OPTIONS`, `SOCIAL_LINKS`, `REQUIRED_SUBSCRIPTIONS`, `PAGE_SIZE`, `STORAGE_KEYS`, `ROUTES`. Change category values here to add/modify course categories.

## Environment Variables

### Backend (`backend/.env`)
| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` | JWT signing secrets |
| `TELEGRAM_BOT_TOKEN` | Bot used for subscription checks and video link generation |
| `TELEGRAM_CHANNEL_USERNAME` | Public channel for subscription verification |
| `TELEGRAM_PRIVATE_CHANNEL_USERNAME` | Private channel where videos are stored |
| `FRONTEND_URL` | CORS allowed origin |
| `SWAGGER_USERNAME` / `SWAGGER_PASSWORD` | Protects `/api-docs` and `/admin-docs` |

### Frontend (`frontend/.env`)
| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | API base URL (default: `http://localhost:5000/api`) |
| `VITE_ENABLE_3D_HERO` | Toggle Three.js hero scene |
| `VITE_ENABLE_GSAP` | Toggle GSAP animations |

## Important Implementation Notes

- **`socialVerification.js`** — The `checkInstagramSubscriptionRealTime` and `checkTelegramSubscriptionRealTime` functions in `backend/utils/socialVerification.js` contain placeholder logic. Telegram uses `getChatMember` Bot API; Instagram requires Graph API integration.
- **Swagger auth** — Default credentials in `.env.example` are `Aidevix`/`sunnatbee`. Override via env vars in production.
- **Course seeding** — Run `npm run seed` from `backend/` to populate MongoDB with sample courses. Uses `backend/seeders/seedCourses.js`.
- **Build chunking** — Vite splits vendor, redux, three, gsap, and ui into separate chunks to optimize loading.
- **No test framework** — There are no automated tests. `npm test` in backend exits with error 1.
