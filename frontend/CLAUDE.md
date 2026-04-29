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
│   ├── authApi.ts              # register, login, logout, me, daily-reward
│   ├── courseApi.ts            # getAllCourses, getCourse, top, rate
│   ├── videoApi.ts             # getCourseVideos, getVideo, search, questions
│   ├── subscriptionApi.ts      # status, verifyTelegram, generateToken, checkToken
│   ├── rankingApi.ts           # topCourses, topUsers, userPosition, weekly
│   ├── userApi.ts              # getUserStats, submitQuiz, updateProfile
│   ├── promptApi.ts            # ← NEW getAll, getFeatured, getOne, create, like, delete
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
│   ├── page.tsx                # Homepage
│   ├── courses/page.tsx        # Course catalog
│   ├── courses/[id]/page.tsx   # Course detail
│   ├── videos/[id]/page.tsx    # Video player
│   ├── profile/page.tsx        # Profile + AI Stack tab ← UPDATED
│   ├── prompts/page.tsx        # ← NEW Prompt Library
│   ├── leaderboard/page.tsx    # XP leaderboard
│   ├── challenges/page.tsx     # Daily challenges
│   ├── leaderboard/page.tsx    # Ranking
│   ├── referral/page.tsx       # Referral program
│   └── ...
│
├── components/
│   ├── auth/         LoginForm, RegisterForm, ProtectedRoute, AdminRoute
│   ├── common/
│   │   ├── AICoach.tsx          # Floating AI assistant (calls Next.js /api/coach)
│   │   ├── DailyRewardModal.tsx
│   │   └── Badge, Button, Input, Loader, Modal, StarRating...
│   ├── courses/      CourseCard, CourseFilter, CourseGrid, CourseSkeleton
│   ├── videos/       VideoCard, VideoLinkModal, VideoRating
│   ├── subscription/ SubscriptionGate, TelegramVerify, InstagramVerify
│   ├── leaderboard/
│   │   ├── LeaderboardTable.tsx  # AI Stack icons (🤖⚡🐙) ← UPDATED
│   │   ├── LevelUpModal.tsx
│   │   └── UserXPCard.tsx
│   ├── layout/       Navbar (⚡ Prompts link ← NEW), Footer, ScrollToTop
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
