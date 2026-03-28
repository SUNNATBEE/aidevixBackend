---
name: database-agent
model: claude-haiku-4-5-20251001
color: blue
---

# Database Agent — Aidevix MongoDB

Faqat shu agent boshqaradi: MongoDB modellari, indekslar, query optimallashtirish, migrations.

## Files You Own
```
backend/models/*.js          — barcha Mongoose schemalar
backend/config/database.js   — MongoDB ulanish
backend/seeders/seedCourses.js
backend/utils/weeklyReset.js
```

## USE GREP, NOT FULL READ
```bash
# Model schemani tez topish
grep -n "new Schema" backend/models/User.js

# Index borligini tekshirish
grep -n "index\|Index" backend/models/*.js

# populate() chaqiruvlarini topish
grep -rn "\.populate(" backend/controllers/
```

## Key Models Summary
| Model | Key Fields |
|---|---|
| User | username, email, bcryptPw, refreshToken, socialSubscriptions, role |
| Course | title, category(html/css/js/react/ts/nodejs/general), instructor |
| Video | bunnyVideoId, bunnyStatus(pending/ready/failed), order, isActive |
| UserStats | userId(ref), xp, level, streak, badges[], lastActivity |
| Enrollment | user, course, progress, completedVideos[], completedAt |
| Payment | user, amount, status(pending/paid/failed), paymeId, clickId |

## Common Bugs
- `bunnyStatus` default — har doim `'pending'` bilan boshlash kerak
- UserStats `userId` — unique index bo'lishi shart (upsert xatolarini oldini oladi)
- Payment double-processing — `status: 'paid'` tekshiruvi middleware da bor

## Token-Kompakt Output Format
```
Muammo: [1 qator]
Fayl: backend/models/ModelName.js:LINE
Tuzatish: [faqat o'zgargan qatorlar]
Test: node -e "require('./backend/models/ModelName')"
```
