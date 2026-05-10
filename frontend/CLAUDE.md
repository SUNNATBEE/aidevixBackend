# CLAUDE.md (frontend)

Swagger docs: `/api-docs` (login: Aidevix / sunnatbee)

See root `CLAUDE.md` for full architecture. This file covers frontend-specific quick reference.

## Commands

```bash
npm run dev      # Next.js dev server on port 3000
npm run build    # Production build
npm run lint     # ESLint (max-warnings 0 — CI da xato beradi)
```

## File Map

```
src/
├── api/
│   ├── axiosInstance.ts        # Axios + cookie auth (interceptors)
│   ├── authApi.ts              # register, login, logout, me, daily-reward, **telegramMiniAppAuth**
│   ├── courseApi.ts            # getAllCourses, getCourse, top, rate, **getForUser** (aiStack tavsiya)
│   ├── videoApi.ts             # getCourseVideos, getVideo, search, questions
│   ├── subscriptionApi.ts      # status, verifyTelegram, generateToken, checkToken
│   ├── rankingApi.ts           # topCourses, topUsers, userPosition, weekly
│   ├── userApi.ts              # getUserStats, submitQuiz, updateProfile, getContinueLearning
│   ├── promptApi.ts            # getAll, getFeatured, getOne, create, like, delete
│   ├── playgroundApi.ts        # ← 2026-05-11 AI Code Playground review (Groq)
│   └── uploadApi.ts            # uploadFile, uploadAvatar
│
├── store/slices/
│   ├── authSlice.ts            # user, isAuthenticated — checkAuthStatus on mount
│   ├── courseSlice.ts          # courses, selectedCourse, filters
│   ├── videoSlice.ts           # videos, selectedVideo, searchResults
│   ├── subscriptionSlice.ts    # telegram, instagram, allVerified
│   ├── rankingSlice.ts         # topCourses, topUsers, userPosition
│   └── userStatsSlice.ts       # xp, level, streak, badges, bio, skills, avatar
│
├── hooks/
│   ├── useAuth.ts              # user, isLoggedIn, login, logout, register
│   ├── useCourses.ts           # courses, loading, filters
│   ├── useVideos.ts            # videos, selectedVideo
│   ├── useSubscription.ts      # telegram, instagram, verify, status
│   ├── useRanking.ts           # topUsers, topCourses, position
│   └── useUserStats.ts         # xp, level, streak, stats
│
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage (+ ContinueWatching + RecommendedForYou widgets)
│   ├── courses/page.tsx        # Course catalog
│   ├── courses/[id]/page.tsx   # Course detail
│   ├── videos/[id]/page.tsx    # Video player
│   ├── profile/page.tsx        # Profile + AI Stack tab
│   ├── prompts/page.tsx        # Prompt Library
│   ├── leaderboard/page.tsx    # XP leaderboard
│   ├── challenges/page.tsx     # Daily challenges
│   ├── playground/page.tsx     # ← 2026-05-11 AI Code Playground (Monaco + AI review)
│   ├── u/[username]/page.tsx   # Public profile (SSR + SEO + sertifikat/prompt/follow stats)
│   ├── offline/page.tsx        # PWA offline fallback sahifasi
│   ├── referral/page.tsx       # Referral program
│   └── ...
│
├── components/
│   ├── auth/         LoginForm, RegisterForm, ProtectedRoute, AdminRoute
│   ├── common/
│   │   ├── AICoach.tsx                # Floating AI assistant (calls Next.js /api/coach)
│   │   ├── DailyRewardModal.tsx
│   │   ├── PwaInstallPrompt.tsx        # PWA install banner + SW update notification
│   │   ├── TelegramMiniAppBridge.tsx   # ← 2026-05-11 TMA SDK loader + auto-login
│   │   └── Badge, Button, Input, Loader, Modal, StarRating...
│   ├── courses/      CourseCard, CourseFilter, CourseGrid, CourseSkeleton, RecommendedCarousel
│   ├── home/         HomeClient, ContinueWatching, RecommendedForYou (← 2026-05-11)
│   ├── videos/       VideoCard, VideoLinkModal, VideoRating
│   ├── subscription/ SubscriptionGate, TelegramVerify, InstagramVerify
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx  # AI Stack icons (🤖⚡🐙)
│   │   ├── LevelUpModal.tsx
│   │   └── UserXPCard.tsx
│   ├── layout/       Navbar (⚡ Prompts link), Footer, ScrollToTop, ClientLayoutWrapper
│   └── ranking/      CourseRankCard
│
└── utils/
    ├── constants.ts   # ROUTES (includes PROMPTS: '/prompts') ← UPDATED
    ├── i18n.ts
    └── xpLevel.ts
```

## Domain Pattern

```
src/api/<domain>Api.ts  →  src/store/slices/<domain>Slice.ts  →  src/hooks/use<Domain>.ts  →  component
```

## Yangi Feature'lar (2026-04)

### Prompt Library (`/prompts`)
- `src/api/promptApi.ts` — `getAll`, `getFeatured`, `getOne`, `create`, `like`, `delete`
- `src/app/prompts/page.tsx` — full page: filter, sort, create modal, like, copy
- Create qilganda +30 XP beriladi (backend)
- Kategoriyalar: vibe_coding, claude, cursor, copilot, coding, debugging, architecture...
- Tools filter: Claude Code, Cursor, GitHub Copilot, ChatGPT, Gemini, Windsurf

### AI Stack (Profile)
- `src/app/profile/page.tsx` → 4-chi tab "AI Stack"
- Foydalanuvchi qaysi AI toollardan foydalanishini tanlaydi
- `updateProfileThunk({ aiStack: string[] })` orqali saqlanadi
- Tools: Claude Code, Cursor, Copilot, ChatGPT, Gemini, Windsurf, Devin, Replit AI, Codeium
- Leaderboard da ko'rinadi (LeaderboardTable.tsx)

### Navbar
- `⚡ Prompts` link qo'shildi (`ROUTES.PROMPTS = '/prompts'`)

## Yangi Feature'lar (2026-05-11)

### Public Profile (`/u/[username]`)
- SSR + SEO metadata (`generateMetadata` → OpenGraph image, description)
- Yangi blok'lar: sertifikatlar (top 3), top promptlar, follow counts, completed courses
- Backend: `GET /api/users/:username/public` — `achievements` va `social` qaytaradi

### Home — personalized widgets
- `components/home/ContinueWatching.tsx` — keyingi video + progress bar (only logged-in)
- `components/home/RecommendedForYou.tsx` — aiStack + tugatilgan kategoriyalar bo'yicha aqlli tavsiya
- Backend: `GET /api/courses/recommended` (auth) — `meta.basedOn` qaytaradi
- Anonim user'larga ko'rsatilmaydi (graceful null)

### Telegram Mini App (TMA)
- `components/common/TelegramMiniAppBridge.tsx` — `ClientLayoutWrapper`'da mount
- Telegram WebApp SDK lazy load (faqat Telegram useragent yoki `tgWebAppData` query da)
- `window.Telegram.WebApp.initData` → `POST /api/auth/telegram-init` → backend HMAC validate → cookie auth
- Tema'ni Telegram'dan oladi: `--tg-bg-color`, `--tg-text-color` CSS variables
- Allaqachon login bo'lgan user'ga qayta urinmaydi (Redux `selectIsLoggedIn`)

### AI Code Playground (`/playground`)
- `src/api/playgroundApi.ts` — `review({ code, language, prompt? })`
- `src/app/playground/PlaygroundClient.tsx` — Monaco editor (vs-dark/light tema sync)
- 7 ta starter template, 18 ta til (JS/TS/Python/Go/Rust/Java/C++/SQL...)
- AI review panel: score (0-100), severity-coded issues (critical→low), improvements, rewrite + "Qo'llash" tugmasi
- Auth shart, 15/15min user rate limit
- Hidden Navbar/Footer — `ClientLayoutWrapper`'da `/playground` allaqachon `hideLayout` ro'yxatida

### PWA upgrade
- `public/manifest.json` v2 — 4 ta shortcut (Kurslar/Promptlar/Leaderboard/Profil), `display_override`, maskable icons, `categories: ['education','productivity']`
- `public/sw.js` v3 — 3 ta cache (static/pages/runtime), network-first navigation + offline fallback, stale-while-revalidate static, API & Bunny bypass, `navigationPreload`
- `public/register-sw.js` — 60-daqiqalik auto-update check, `aidevix:sw-update` event
- `PwaInstallPrompt` — 7-kunlik dismiss TTL, SW update banner ("Yangi versiya tayyor"), aria-label

## API Usage

- Backend URL (production): `https://aidevix-backend-production.up.railway.app`
- Local dev: Vite/Next.js proxy orqali `/api` → `localhost:5000`
- Auth: cookie-based (axiosInstance `withCredentials: true`)
- **API larni O'ZGARTIRISH MUMKIN EMAS — faqat ishlatish mumkin**

## Critical Notes

- `App.tsx` / layout da `checkAuthStatus()` mount da chaqiriladi
- All pages lazy-loaded
- `// SUHROB`, `// NUMTON`, `// ABDUVORIS` ownership comments — preserve when editing
- GSAP plugins registered in root layout before animation modules load
