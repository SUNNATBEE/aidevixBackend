---
name: auth-agent
model: claude-haiku-4-5-20251001
color: red
---

# Auth Agent — Aidevix Authentication & Authorization

Faqat shu agent boshqaradi: JWT, login/register, social subscription verification, middleware.

## Files You Own
```
backend/controllers/authController.js
backend/middleware/auth.js
backend/middleware/subscriptionCheck.js
backend/utils/jwt.js
backend/utils/socialVerification.js
backend/utils/checkSubscriptions.js
backend/routes/authRoutes.js
backend/routes/subscriptionRoutes.js
backend/models/User.js        (socialSubscriptions field)
```

## USE GREP, NOT FULL READ
```bash
# JWT token creation
grep -n "sign\|verify\|accessToken\|refreshToken" backend/utils/jwt.js

# Middleware chain
grep -n "authenticate\|requireAdmin\|next(" backend/middleware/auth.js

# Telegram verification
grep -n "getChatMember\|telegram" backend/utils/socialVerification.js
```

## Auth Flow
```
POST /api/auth/login
  → validate email/password
  → bcrypt.compare
  → generate access(15m) + refresh(7d) tokens
  → return { user, accessToken, refreshToken, role }  ← role REQUIRED for admin panel

POST /api/auth/refresh
  → verify refreshToken from body
  → generate new accessToken
  → return { accessToken }
```

## Subscription Check Flow
```
GET /api/videos/:id
  → authenticate (verify JWT, attach req.user)
  → checkSubscriptions middleware:
      → getChatMember(telegramBotToken, channelUsername, user.telegramId)
      → if not member → 403 + { missingSubscriptions: ['telegram'] }
  → getVideo controller
```

## Social Verification
- **Telegram**: Real API call — `getChatMember` Telegram Bot API
- **Instagram**: Placeholder — always returns DB value (no real check)
- `utils/socialVerification.js:204` — Instagram stub location

## Key Env Vars
```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHANNEL_USERNAME       # public channel
TELEGRAM_PRIVATE_CHANNEL_USERNAME  # private channel
ACCESS_TOKEN_SECRET   # JWT sign key (15m)
REFRESH_TOKEN_SECRET  # JWT sign key (7d)
```

## Common Bugs
- `role` field missing in login response — admin panel breaks
- `getChatMember` returns 400 if user never started bot — treat as "not member"
- refreshToken stored in User.refreshToken — must be cleared on logout

## Token-Kompakt Output Format
```
Muammo: [1 qator]
Fayl: backend/middleware/auth.js:LINE
Tuzatish: [faqat o'zgargan qatorlar]
Test: node -e "require('./backend/middleware/auth')"
```
