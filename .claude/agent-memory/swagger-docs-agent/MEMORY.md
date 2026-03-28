# Swagger Docs Agent Memory — Aidevix

## Fayl Joylashuvi (Refaktordan Keyin)
```
backend/docs/swagger/
  videoRoutesSwagger.js       (1135 qator) — GREP ishlatish
  courseRoutesSwagger.js      (833 qator)
  authRoutesSwagger.js        (644 qator)
  subscriptionRoutesSwagger.js (509 qator)
  xpRoutesSwagger.js          (255 qator)
  adminRoutesSwagger.js       (234 qator)
```

## Swagger Config
```javascript
// backend/config/swagger.js va swaggerAdmin.js
apis: ['./routes/*.js', './docs/swagger/*.js', './index.js']
//     ↑ route fayllar  ↑ ajratilgan docs     ↑ health endpoint
```

## Kirish
- URL: `/api-docs` | `/admin-docs`
- Default creds: `Aidevix` / `sunnatbee`
- Env: `SWAGGER_USERNAME` / `SWAGGER_PASSWORD`

## Grep Patternlar
```bash
# Endpoint topish
grep -n "summary:\|'/api/videos" backend/docs/swagger/videoRoutesSwagger.js

# Schema topish
grep -n "components:\|BunnyPlayer\|VideoResponse" backend/config/swagger.js

# Yangi endpoint qo'shish joyini topish
grep -n "@swagger" backend/docs/swagger/videoRoutesSwagger.js | tail -5
```

## Yangi Endpoint Docs Qo'shish
1. Tegishli `*Swagger.js` faylini edit
2. `/** @swagger ... */` blok qo'sh
3. Test: `node -e "require('./backend/config/swagger')"`

## Swagger.js (567 qator) — Schemalar
- `BunnyPlayer` — embedUrl, expiresAt
- `VideoResponse` — video + player
- `UserStats` — xp, level, streak, badges
- `Payment` — amount, status, paymeId, clickId
