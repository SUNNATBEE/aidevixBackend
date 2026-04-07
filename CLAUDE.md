# CLAUDE.md

Current repo summary for agents and contributors.

## Stack
- `backend/`: Express 5 + MongoDB/Mongoose + JWT + Swagger
- `frontend/`: Next.js 14 + React 18 + Redux Toolkit + Tailwind

## Important realities
- Frontend uses Next.js App Router with some legacy `src/pages` files still present.
- Auth now uses secure cookies for session flow; do not reintroduce `localStorage` token storage.
- Subscription gating is business-critical.
- `backend/seeders/seedCourses.js` is destructive and only runs when `ALLOW_DESTRUCTIVE_SEED=true`.
- Worktree may already contain unrelated user changes; never revert them blindly.

## High-signal files
- `backend/index.js`
- `backend/controllers/authController.js`
- `backend/controllers/paymentController.js`
- `backend/middleware/auth.js`
- `backend/middleware/subscriptionCheck.js`
- `backend/utils/socialVerification.js`
- `frontend/src/api/axiosInstance.ts`
- `frontend/src/store/slices/authSlice.ts`
- `frontend/src/store/slices/subscriptionSlice.ts`
- `frontend/src/components/subscription/`

## Verification shortcuts
- `node --check backend/index.js`
- `node ./node_modules/typescript/bin/tsc --noEmit`
- `node ./node_modules/eslint/bin/eslint.js src --ext .ts,.tsx`
