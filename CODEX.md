# CODEX.md

Minimal repo context for fast audits and edits.

## Current stack
- Root: monorepo-style wrapper with `backend/` and `frontend/`
- Backend: Node.js, Express 5, MongoDB/Mongoose, JWT, Swagger
- Frontend: Next.js 14, React 18, Redux Toolkit, Tailwind, Framer Motion, Three.js

## High-signal paths
- `backend/index.js`: app bootstrap, CORS, Swagger, middleware order
- `backend/controllers/`: business logic
- `backend/routes/`: API surface
- `backend/models/`: Mongoose schemas
- `backend/utils/`: JWT, email, social verification, Bunny integration
- `frontend/src/app/`: App Router pages
- `frontend/src/components/`: UI and flows
- `frontend/src/api/axiosInstance.ts`: auth header + refresh flow
- `frontend/src/store/`: Redux slices and state
- `frontend/src/utils/constants.ts`: runtime URLs and storage keys

## Repo realities
- Worktree is currently dirty; do not revert unrelated user changes.
- Backend has no real automated tests.
- Frontend build config currently suppresses TS and ESLint build failures.
- Auth tokens are stored in `localStorage`, not httpOnly cookies.
- Subscription gating is business-critical and currently weak on Instagram verification.

## Recommended audit order
1. `package.json`, `backend/package.json`, `frontend/package.json`
2. `backend/index.js`, `backend/middleware/*`, `backend/controllers/authController.js`
3. `backend/utils/socialVerification.js`, `backend/controllers/paymentController.js`
4. `frontend/next.config.mjs`, `frontend/src/api/axiosInstance.ts`, `frontend/src/utils/tokenStorage.ts`
5. Subscription UI in `frontend/src/components/subscription/*`

## Commands that were useful
- `rg --files`
- `rg -n "<pattern>" backend frontend`
- `node --check backend/index.js`
- `npm.cmd run build` inside `frontend/`

## Important caution
- `backend/seeders/seedCourses.js` is destructive: it deletes course/video/project data before reseeding.
