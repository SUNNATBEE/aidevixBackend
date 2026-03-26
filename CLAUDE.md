# CLAUDE.md — Aidevix Backend

Aidevix — online coding course platform (Uzbek developers). Telegram+Instagram subscription required before video access. Videos = **Bunny.net signed embed URLs** (NOT Telegram links).

→ Batafsil arxitektura: **CLAUDE-details.md**

## Structure
- `backend/` — Node.js + Express (CommonJS, port 5000)
- `frontend/` — React + Vite SPA (ESM, port 3000)

## Deployment
- **Backend**: Railway — `https://aidevix-backend-production.up.railway.app`
- **Frontend**: Vercel — auto-deploys from `main` branch
- **NEVER** use `aidevixbackend.onrender.com` (dead, replaced by Railway)

## Commands
```bash
cd backend && npm run dev      # nodemon
cd backend && npm run seed     # seed courses
cd frontend && npm run dev     # Vite (proxies /api → :5000)
cd frontend && npm run lint    # ESLint max-warnings 0
```

## Video Access — Critical (Bunny.net)
`GET /api/videos/:id`: `authenticate` → `checkSubscriptions` (Telegram getChatMember, 403 + missingSubscriptions[]) → returns:
```json
{ "video": {...}, "player": { "embedUrl": "https://iframe.mediadelivery.net/embed/...", "expiresAt": "..." } }
```
Returns 503 if `bunnyStatus !== 'ready'`. OLD: `/link/:linkId/use` — DEPRECATED.

## Key Patterns
- **API response**: `{ data: { data: ... } }` — thunks always `return data.data`
- **Errors**: backend sends Uzbek strings → `state.error` → react-hot-toast
- **Feature ownership**: preserve `// SUHROB`, `// NUMTON`, `// ABDUVORIS` comments
- **Routes**: use `ROUTES.COURSE(id)` from constants, never hardcode
- **Classes**: use `clsx` for conditionals

## Swagger
Default creds: `Aidevix` / `sunnatbee` (env: SWAGGER_USERNAME/SWAGGER_PASSWORD)
Docs split: swagger JSDoc in `backend/docs/swagger/*.js` → included via `apis` config
