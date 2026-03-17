# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server on port 3000, proxies /api → localhost:5000
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint with max-warnings 0 (fails CI on any warning)
```

## Architecture

### Entry Point & Initialization
`src/main.jsx` → `App.jsx` → `AppRouter.jsx`. On mount, `App.jsx` dispatches `checkAuthStatus()` to rehydrate auth from localStorage, then registers GSAP plugins globally (`ScrollTrigger`, `ScrollToPlugin`).

### Redux Store Pattern
Each domain follows the same pattern: `src/api/<domain>Api.js` → `src/store/slices/<domain>Slice.js` → `src/hooks/use<Domain>.js` → page/component.

- **authSlice** — `isLoggedIn`, `user`. `checkAuthStatus` reads tokens from localStorage (no network call).
- **courseSlice** — course list, filters, pagination, single course detail.
- **videoSlice** — video list per course, current video.
- **subscriptionSlice** — `instagram` and `telegram` subscription status booleans.
- **rankingSlice** — `topCourses` (used in `TopCoursesPage`) and `topUsers` (used in `LeaderboardPage`).
- **userStatsSlice** — XP, level (1000 XP = 1 level), streak, badges, bio, skills. Contains `justLeveledUp`/`newLevel` flags to trigger the level-up modal.

All selectors are exported from the slice file (e.g., `selectIsLoggedIn` from `authSlice.js`).

### Token Management
`src/utils/tokenStorage.js` wraps localStorage using keys from `STORAGE_KEYS` in `constants.js`. The axios instance (`src/api/axiosInstance.js`) auto-attaches `Bearer` tokens on every request and handles 401s by:
1. Queueing concurrent requests while refresh is in-flight (`refreshQueue`)
2. Calling `POST /api/auth/refresh` with the stored refresh token
3. Redirecting to `/login` if refresh fails

### Routing & Protected Routes
All pages are lazy-loaded. `<ProtectedRoute />` wraps routes that require login — it checks `selectIsLoggedIn` from the auth slice. Page transitions are triggered in `AppRouter.jsx` via GSAP `fromTo` on the `#page-wrapper` element whenever `location.pathname` changes.

### Subscription Gate
`SubscriptionGate.jsx` blocks video content if the user hasn't verified both channels. The check is done server-side on `GET /api/videos/:id` — the API returns 403 with `missingSubscriptions` array if not subscribed. The frontend uses this to redirect to `/subscription`.

### Animation Modules
- `src/animations/three/HeroScene.js` — Three.js 3D scene on `HomePage`. Toggled by `VITE_ENABLE_3D_HERO` env var.
- `src/animations/gsap/` — `heroAnimations.js`, `cardAnimations.js`, `pageTransitions.js`. Toggled by `VITE_ENABLE_GSAP`. GSAP plugins must be registered in `App.jsx` before any animation module uses them.

### UI Layer
DaisyUI (`theme: "aidevix"`) on top of Tailwind CSS. Common primitives are in `src/components/common/`. Use `clsx` for conditional class names. Toast notifications via `react-hot-toast`.

### Path Aliases
All aliases resolve to `src/<dir>`: `@` = `src/`, `@components`, `@pages`, `@store`, `@hooks`, `@api`, `@utils`, `@animations`, `@assets`, `@styles`.

### Environment Variables
| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | API base URL (default: `http://localhost:5000/api`) |
| `VITE_ENABLE_3D_HERO` | Toggle Three.js hero scene |
| `VITE_ENABLE_GSAP` | Toggle GSAP animations |
| `VITE_TELEGRAM_CHANNEL` | Telegram channel URL for subscription links |
| `VITE_INSTAGRAM_URL` | Instagram URL |
| `VITE_TELEGRAM_BOT` | Telegram bot URL |

### Build Chunking
`vite.config.js` splits output into manual chunks: `vendor` (react/router), `redux`, `three` (Three.js + R3F), `gsap`, `ui` (swiper/framer-motion). Keep heavy libraries in these chunks to avoid merging them into the main bundle.

## Key Patterns

- **API response shape**: all backend responses wrap data as `{ data: { data: ... } }` — slice thunks always destructure `const { data } = await api.call(); return data.data`.
- **Error messages**: backend sends Uzbek error strings; slices store them in `state.error` and display via `react-hot-toast`.
- **Feature ownership**: comments like `// SUHROB`, `// NUMTON`, `// ABDUVORIS` in slice and router files indicate which team member owns each feature. Preserve these when editing.
- **`ROUTES` constant**: use `ROUTES.COURSE(id)` etc. from `constants.js` rather than hardcoding paths.
