# CLAUDE.md (frontend)

## 🚫 MUHIM QOIDA — BACKEND GA TEGMA!

**HECH QACHON `backend/` papkadagi fayllarni o'zgartirma, o'chirma, yaratma!**
**HECH QACHON root darajadagi fayllarni o'zgartirma (package.json, railway.toml, .gitignore, architecture.md)!**

Backend O'QITUVCHI tomonidan boshqariladi. Siz faqat `frontend/` papkada ishlaysiz.
Agar backend API haqida savol bo'lsa — Swagger docs dan (`/api-docs`) foydalaning.

⚠️ Bu qoidani buzgan har qanday o'zgartirish GitHub CI tomonidan **avtomatik rad etiladi**.

---

See root `CLAUDE.md` for full architecture. This file covers frontend-specific quick reference.

## Commands
```bash
npm run dev      # Vite on port 3000, proxies /api → :5000
npm run build    # → dist/
npm run preview  # Preview production build
npm run lint     # ESLint max-warnings 0 (fails CI on any warning)
```

## File Map
```
src/
├── api/          authApi, courseApi, videoApi, subscriptionApi, rankingApi, userApi, axiosInstance
├── store/slices/ authSlice, courseSlice, videoSlice, subscriptionSlice, rankingSlice, userStatsSlice
├── hooks/        useAuth, useCourses, useVideos, useSubscription, useRanking, useUserStats
├── pages/        HomePage, CoursesPage, CourseDetailPage, VideoPage, VideoPlaygroundPage,
│                 LoginPage, RegisterPage, ProfilePage, SubscriptionPage,
│                 LeaderboardPage, TopCoursesPage, LevelUpPage, NotFoundPage
├── components/
│   ├── auth/     LoginForm, RegisterForm, ProtectedRoute
│   ├── common/   Badge, Button, Input, Loader, Modal, StarRating
│   ├── courses/  CourseCard, CourseFilter, CourseGrid, CourseSkeleton
│   ├── layout/   Navbar, Footer, ScrollToTop
│   ├── videos/   VideoCard, VideoLinkModal, VideoRating
│   ├── subscription/ SubscriptionGate, TelegramVerify, InstagramVerify
│   ├── leaderboard/ LeaderboardTable, LevelUpModal, UserXPCard
│   └── ranking/  CourseRankCard
├── animations/
│   ├── gsap/     heroAnimations, cardAnimations, pageTransitions (toggle: VITE_ENABLE_GSAP)
│   └── three/    HeroScene (toggle: VITE_ENABLE_3D_HERO)
├── router/       AppRouter.jsx
├── utils/        constants.js, tokenStorage.js, formatDate.js, formatDuration.js
└── styles/       globals.css, animations.css
```

## Domain Pattern
`src/api/<domain>Api.js` → `src/store/slices/<domain>Slice.js` → `src/hooks/use<Domain>.js` → component

## API ishlatish
- Backend URL: `https://aidevix-backend-production.up.railway.app` (production)
- Lokal: `http://localhost:5000` (Vite proxy orqali `/api` → `:5000`)
- **API larni O'ZGARTIRISH MUMKIN EMAS — faqat ishlatish mumkin**
- Swagger docs: `/api-docs` (login: Aidevix / sunnatbee)

## Critical Notes
- GSAP plugins registered in `App.jsx` before any animation module loads
- `App.jsx` dispatches `checkAuthStatus()` on mount (reads localStorage, no API call)
- All pages lazy-loaded in `AppRouter.jsx`
- `// SUHROB`, `// NUMTON`, `// ABDUVORIS` ownership comments — preserve when editing
