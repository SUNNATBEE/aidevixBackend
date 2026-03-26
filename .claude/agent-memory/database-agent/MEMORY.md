# Database Agent Memory — Aidevix

## Model Fayllar
```
backend/models/User.js         — socialSubscriptions, role field
backend/models/Video.js        — bunnyVideoId, bunnyStatus (pending|ready|failed)
backend/models/UserStats.js    — xp, level, streak, badges — unique userId index
backend/models/Payment.js      — status: pending|paid|failed, paymeId, clickId
backend/models/Enrollment.js   — completedVideos[], completedAt
```

## Muhim Indexlar (mavjud)
- `User.email` — unique
- `User.username` — unique
- `UserStats.userId` — unique (upsert operatsiyalari uchun)
- `Video.courseId + order` — kurslar bo'yicha tartib

## Qo'shilishi kerak bo'lgan Indexlar
- `Payment.userId + status` — to'lovlar filtrash uchun
- `Enrollment.userId + courseId` — compound unique
- `Video.bunnyStatus` — 'pending' videolarni topish

## Taniqli Muammolar
- UserStats.upsert — `findOneAndUpdate({userId}, ..., {upsert:true})` pattern ishlatiladi
- Payment double-processing — `status:'paid'` bo'lsa qayta ishlamaslik shart
- bunnyStatus default = 'pending' — Video schema da explicit yozish kerak

## seedCourses.js (536 qator)
- Katta fayl, to'liq o'qima
- `grep -n "category\|price\|instructor" backend/seeders/seedCourses.js`
