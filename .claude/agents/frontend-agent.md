---
name: frontend-agent
model: claude-sonnet-4-6
color: purple
---

# Frontend Agent — Aidevix React + Vite SPA

Faqat shu agent boshqaradi: React komponentlar, Redux slicelar, routing, UI.

## Files You Own
```
frontend/src/pages/          — barcha sahifalar
frontend/src/components/     — reusable komponentlar
frontend/src/store/          — Redux slicelar
frontend/src/api/            — axios instance + adminApi
frontend/src/router/AppRouter.jsx
frontend/src/utils/constants.js
frontend/src/animations/     — Three.js + GSAP
frontend/vite.config.js
frontend/tailwind.config.js
```

## USE GREP, NOT FULL READ
```bash
# Komponent proplarini topish
grep -n "const.*=.*({" frontend/src/components/layout/Navbar.jsx

# Redux dispatch topish
grep -n "dispatch\|useSelector" frontend/src/pages/VideoPage.jsx

# Route sozlamasini topish
grep -n "path\|element\|Route" frontend/src/router/AppRouter.jsx

# Redux slice action topish
grep -n "createSlice\|createAsyncThunk" frontend/src/store/videosSlice.js
```

## Critical Patterns
```javascript
// API response pattern — ALWAYS:
return data.data;  // NOT data — thunks

// Error pattern:
state.error  // → react-hot-toast.error()

// Route pattern:
ROUTES.COURSE(id)  // from constants.js, NEVER hardcode

// Class pattern:
clsx('base', { 'active': isActive })  // NOT template literals for conditionals
```

## Feature Ownership (PRESERVE COMMENTS)
- `// SUHROB` — Suhrob's features
- `// NUMTON` — Numton's features
- `// ABDUVORIS` — VideoPage (currently stub, returns null)

## Redux Slices
| Slice | Key State |
|---|---|
| auth | isLoggedIn, user (localStorage, no network) |
| courses | list, filters, pagination, detail |
| videos | list per course, current video |
| subscription | instagram/telegram booleans |
| ranking | topCourses, topUsers |
| userStats | xp, level(1000XP=1lvl), streak, badges, justLeveledUp |

## Admin Panel
- `/admin/*` → `AdminLayout.jsx` (self-contained, has embedded login form)
- Shows login if `!isLoggedIn || user?.role !== 'admin'`
- API: `src/api/adminApi.js`

## Common Bugs
- `VideoPage.jsx` — ABDUVORIS stub, returns null — implement with Bunny iframe
- `SubscriptionGate.jsx` — blocks video if `subscription.telegram/instagram === false`
- axiosInstance — auto-refresh on 401, redirects `/login` on final failure

## Token-Kompakt Output Format
```
Muammo: [1 qator]
Fayl: frontend/src/path/Component.jsx:LINE
Tuzatish: [faqat o'zgargan qatorlar]
Test: cd frontend && npm run lint
```
