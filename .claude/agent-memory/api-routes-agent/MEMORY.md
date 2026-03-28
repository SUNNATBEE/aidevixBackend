# API Routes Agent Memory — Aidevix

## Route Fayllari (Swagger Ajratilgandan Keyin)
| Fayl | Qator | Endpoints |
|---|---|---|
| videoRoutes.js | 62 | 13 |
| courseRoutes.js | 43 | ~8 |
| authRoutes.js | 32 | ~6 |
| subscriptionRoutes.js | 25 | ~4 |
| xpRoutes.js | 39 | ~11 |
| adminRoutes.js | 29 | ~8 |

## Swagger Docs Joyi
`backend/docs/swagger/*.js` — route fayllardan ajratilgan
Swagger config: `apis: ['./routes/*.js', './docs/swagger/*.js', './index.js']`

## Middleware Zanjirlari (kritik)
```javascript
// Video ko'rish
authenticate → checkSubscriptions → getVideo

// Admin operatsiyalar
authenticate → requireAdmin → controller

// Ochiq endpoint (token shart emas)
getCourseVideos, getVideoQuestions
```

## Express 5 Xususiyatlari
- Async route handler da try/catch yoki next(err) shart
- `router.param()` deprecated — `/:id` pattern ishlatiladi
- `app.use()` da path regex — Express 5 da o'zgargan

## Controller Fayllari (Katta bo'lganlar)
- `videoController.js` — 591 qator → GREP ishlatish kerak
- `xpController.js` — 429 qator → GREP
- `courseController.js` — 411 qator → GREP

## Taniqli Xatolar
- `checkSubscriptions` middleware req.missingSubscriptions[] ni set qiladi
- adminRoutes da `requireAdmin` undan avval `authenticate` kelishi shart
- paymentRoutes — yangi fayl, GET/POST/PUT endpointlar bor
