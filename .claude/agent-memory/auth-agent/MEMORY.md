# Auth Agent Memory — Aidevix

## Auth Flow
```
POST /api/auth/login
  → bcrypt.compare(password, user.password)
  → generateTokens(userId) → { accessToken(15m), refreshToken(7d) }
  → User.refreshToken = refreshToken (DB ga saqlash)
  → return { user, accessToken, refreshToken, role }  ← role MAJBURIY

POST /api/auth/refresh
  → jwt.verify(refreshToken, REFRESH_SECRET)
  → DB dan user topish (refreshToken match)
  → yangi accessToken generate
```

## Subscription Check
```javascript
// middleware/subscriptionCheck.js
getChatMember(BOT_TOKEN, CHANNEL_USERNAME, user.telegramId)
// → 'member' | 'creator' | 'administrator' = kirish mumkin
// → 'left' | 'kicked' | 400 error = 403 qaytarish
req.missingSubscriptions = ['telegram']  // controller uchun
```

## JWT Konfiguratsiya
```
ACCESS_TOKEN_SECRET  → 15 daqiqa
REFRESH_TOKEN_SECRET → 7 kun
localStorage da saqlanadi (backend/utils/tokenStorage.js)
```

## Instagram
- Real tekshiruv YO'Q — faqat DB dagi qiymat qaytariladi
- `utils/socialVerification.js` — Instagram stub

## Taniqli Muammolar
- `getChatMember` → 400 qaytarsa (user bot da yo'q) = 'not member' deb hisoblash
- `refreshToken` logout da DB dan o'chirish shart
- `role` field login/register response da bo'lmasa — admin panel ishlamaydi
- Admin credentials: `yusupovsunnatbek32@gmail.com` / `Admin1234`
