# CLAUDE.md

Repo summary for agents and contributors. Read this first before any work.

## Stack

| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Backend  | Express 5, MongoDB/Mongoose, JWT (cookie-based), Swagger |
| Frontend | Next.js 14 (App Router), React 18, Redux Toolkit, Tailwind |
| Hosting  | Backend: Railway / Frontend: Vercel (`aidevix.uz`) |
| Video    | Bunny.net Stream (token-authenticated)            |
| Bot      | Telegram Bot API (long polling, no webhook)       |

## Architecture

```
backend/
├── index.js                          # Express app entry
├── controllers/                      # 16 controllers (auth, course, video, subscription, payment, ...)
├── middleware/
│   ├── auth.js                       # JWT authenticate
│   ├── subscriptionCheck.js          # Real-time Telegram+Instagram gate (403 if not subscribed)
│   ├── rateLimiter.js
│   └── ...
├── models/                           # Mongoose schemas (User, Course, Video, Payment, VerifyToken, ...)
├── routes/                           # Express routers
├── utils/
│   ├── socialVerification.js         # Telegram/Instagram verification (getChatMember API)
│   ├── checkSubscriptions.js         # performSubscriptionCheck() — used by middleware
│   ├── telegramBot.js                # Bot instance + admin notifications
│   ├── bunny.js                      # Bunny.net signed URL generation
│   ├── jwt.js                        # Token sign/verify helpers
│   └── emailService.js              # Nodemailer (welcome, reset, certificate)
└── seeders/                          # DESTRUCTIVE — only with ALLOW_DESTRUCTIVE_SEED=true

frontend/
├── src/api/                          # Axios API modules (authApi, subscriptionApi, ...)
├── src/store/slices/                 # Redux Toolkit slices
├── src/components/subscription/      # SubscriptionGate, TelegramVerify, InstagramVerify
├── src/hooks/                        # useAuth, useSubscription, ...
└── src/pages/                        # Next.js App Router pages
```

## Subscription Flow (business-critical)

```
User opens course → subscriptionCheck middleware → checkTelegramSubscription()
                                                   ├── Public channel only (@aidevix via TELEGRAM_CHANNEL_USERNAME)
                                                   ├── Uses Telegram Bot API getChatMember
                                                   ├── checked=true  → result is reliable
                                                   └── checked=false → network error, DB fallback used

Frontend verification modal (TelegramVerify.tsx):
  Step 1: User subscribes to @aidevix channel
  Step 2: User clicks "BOT ORQALI BOG'LASH" → bot links Telegram ID to site account
  Polling: checkVerifyToken endpoint polls every 3s until linked+subscribed
```

**Key env vars:**
- `TELEGRAM_BOT_TOKEN` — bot token for getChatMember API
- `TELEGRAM_CHANNEL_USERNAME=aidevix` — public channel (subscription gate checks THIS only)
- `TELEGRAM_PRIVATE_CHANNEL_USERNAME` — private channel (NOT used in subscription gate)

## Important Rules

- Auth uses **secure cookies** — never reintroduce localStorage token storage
- Subscription gating is **business-critical** — don't bypass or weaken
- `socialVerification.js` checks **only public channel** for subscription gate
- Private channel (`TELEGRAM_PRIVATE_CHANNEL_USERNAME`) needs numeric chat_id format for API calls
- Instagram uses soft-check (always true if username provided) due to API restrictions
- `backend/seeders/seedCourses.js` is destructive — only runs with `ALLOW_DESTRUCTIVE_SEED=true`
- Worktree may contain unrelated user changes — never revert blindly

## High-signal Files

**Backend core:**
- `backend/index.js` — app entry, middleware chain
- `backend/controllers/authController.js` — register, login, daily-reward, forgot/reset password
- `backend/controllers/subscriptionController.js` — verify/check Telegram+Instagram, token linking
- `backend/controllers/paymentController.js` — Payme/Click payment processing
- `backend/middleware/auth.js` — JWT cookie authentication
- `backend/middleware/subscriptionCheck.js` — real-time subscription gate middleware
- `backend/utils/socialVerification.js` — Telegram API integration (getChatMemberStatus helper)
- `backend/utils/checkSubscriptions.js` — performSubscriptionCheck (used by middleware)
- `backend/utils/telegramBot.js` — bot instance, /start handler, admin notifications
- `backend/models/User.js` — socialSubscriptions schema, hasAllSubscriptions()
- `backend/models/VerifyToken.js` — token-based Telegram linking

**Frontend core:**
- `frontend/src/api/axiosInstance.ts` — Axios config with cookie auth
- `frontend/src/api/subscriptionApi.ts` — generateToken, checkToken, verify endpoints
- `frontend/src/store/slices/authSlice.ts` — auth state management
- `frontend/src/store/slices/subscriptionSlice.ts` — subscription state
- `frontend/src/components/subscription/TelegramVerify.tsx` — 2-step verification modal
- `frontend/src/components/subscription/SubscriptionGate.tsx` — course access gate

## Verification Commands

```bash
node --check backend/index.js                              # Backend syntax
node ./node_modules/typescript/bin/tsc --noEmit             # Frontend types
node ./node_modules/eslint/bin/eslint.js src --ext .ts,.tsx  # Frontend lint
```

## Deploy

```bash
git push origin main                    # Backend auto-deploys on Railway
npx vercel --prod                       # Frontend deploy to aidevix.uz
```
