# Frontend Agent Memory — Aidevix

## Muhim Fayllar
```
frontend/src/api/axiosInstance.js   — baseURL, 401 auto-refresh, /login redirect
frontend/src/api/adminApi.js        — barcha admin API calls
frontend/src/router/AppRouter.jsx   — lazy loading, ProtectedRoute, GSAP transitions
frontend/src/utils/constants.js     — CATEGORIES, ROUTES, STORAGE_KEYS
```

## Redux Slices
```
store/authSlice.js         — isLoggedIn, user (localStorage, no network call)
store/coursesSlice.js      — list, filters, pagination, detail
store/videosSlice.js       — list per course, currentVideo
store/subscriptionSlice.js — instagram/telegram booleans
store/rankingSlice.js      — topCourses, topUsers
store/userStatsSlice.js    — xp, level(1000XP=1), streak, justLeveledUp
```

## Kritik Pattern
```javascript
// Thunk da HER DOIM:
return data.data;  // NOT data — ikki darajali nesting

// Error:
state.error → toast.error(state.error)

// Route:
navigate(ROUTES.COURSE(id))  // HECH QACHON hardcode
```

## ABDUVORIS — VideoPage
- `frontend/src/pages/VideoPage.jsx` — hozir stub, null qaytaradi
- Bunny iframe: `<iframe src={player.embedUrl} allowfullscreen />`
- `SubscriptionGate.jsx` → subscription bo'lmasa bloklanadi

## Admin Panel
- `/admin/*` → `AdminLayout.jsx` — embedded login form (role='admin' kerak)
- VideoUploadPage — 2 tab: Tus upload | GUID bog'lash

## Build Chunks (vite.config.js)
vendor (react/router), redux, three, gsap, ui (swiper/framer-motion)

## Taniqli Muammolar
- Lint: `cd frontend && npm run lint` — max-warnings 0 (strict)
- Three.js: toggle VITE_ENABLE_3D_HERO env var bilan
- vercel.json — SPA rewrite kerak (mavjud)
