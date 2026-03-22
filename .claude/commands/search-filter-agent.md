# Advanced Search & Filter Agent

> **Kontekst**: Ishni boshlashdan oldin `Read` tool bilan quyidagi faylni o'qi:
> `C:\Users\User\.claude\projects\C--Users-User-OneDrive--------------AidevixBackend\memory\agent-search.md`

Sen Aidevix backend uchun kurs qidiruv, filter va tavsiya tizimlarini kengaytirib mukammal qiluvchi ixtisoslashgan agentsan.

## Maqsad
Kurslar va videolar uchun full-text search, advanced filtering va AI-free recommendation tizimini implement qil.

## Qilishi kerak bo'lgan ishlar

### 1. Full-Text Search Yaxshilash
`backend/controllers/courseController.js` ni o'qing:

Hozirgi `$regex` search ni yaxshilash:
- MongoDB text index qo'shilgan bo'lsa (`Course.js` da `title: 'text', description: 'text'`) — `$text: { $search: search }` ishlatish
- Text index yo'q bo'lsa — `$regex` ni qoldiring lekin case-insensitive optimizatsiya qiling
- Search natijalarda relevance bo'yicha sort: `{ score: { $meta: "textScore" } }`

### 2. Advanced Course Filtering
`GET /api/courses` ga yangi query paramlar qo'shing:

```
?minPrice=0&maxPrice=500000   — narx oralig'i
?duration=short|medium|long  — davomiylik (video soniga qarab)
?hasQuiz=true                — quizli kurslar
?isFree=true                 — bepul kurslar
?instructor=userId           — ma'lum instruktor kurslari
?completedBy=me              — men tugatgan kurslar (auth kerak)
?enrolledBy=me               — men yozilgan kurslar (auth kerak)
```

### 3. Video Search
`GET /api/videos/search` — yangi endpoint:
- `?q=` — video title bo'yicha qidirish
- `?courseId=` — ma'lum kurs ichida qidirish
- `?page=&limit=` — pagination
- Auth kerak (`authenticate` middleware)

### 4. Recommendation Engine (Collaborative Filtering asossiz)
`backend/utils/recommendationService.js` — yangi fayl:

```javascript
// getRecommendedCourses(userId, limit = 6)
// Strategiya:
// 1. Foydalanuvchi yozilgan kurslarning kategoriyalarini aniqlash
// 2. Shu kategoriyalardagi eng yuqori rated kurslarni qaytarish
// 3. Allaqachon yozilgan kurslarni chiqarib tashlash
// 4. Agar enrollment yo'q bo'lsa — eng popular kurslarni qaytarish
```

`GET /api/courses/recommended` — yangi endpoint (Private):
- `authenticate` middleware
- `recommendationService.getRecommendedCourses` chaqirish

### 5. Search History (Optional, simple)
`backend/models/SearchHistory.js` — yangi model (optional, user privacy uchun):
- userId, query, resultCount, createdAt
- `GET /api/courses/search-history` — oxirgi 10 ta qidiruvni ko'rish

### 6. Autocomplete
`GET /api/courses/autocomplete?q=` — kurs nomlari uchun autocomplete:
- Faqat `title` fieldini qaytarish (optimizatsiya uchun)
- Maksimum 5 ta natija
- `{ _id, title, category }` format

### 7. Filter Counts
`GET /api/courses/filter-counts` — frontend uchun filter badge counters:
```json
{
  "categories": { "react": 5, "js": 8, ... },
  "levels": { "beginner": 10, "intermediate": 3, ... },
  "free": 4,
  "paid": 9
}
```

## Muhim qoidalar
- CommonJS ishlating
- Yangi endpointlarni `courseRoutes.js` va `videoRoutes.js` ga qo'shing
- Swagger docs ham yozing (qisqacha)
- Performance: `.lean()` ishlatish, `.select()` bilan kerakli maydonlar

## Fayllar (barchasi o'qilishi kerak)
- `backend/controllers/courseController.js`
- `backend/controllers/videoController.js`
- `backend/routes/courseRoutes.js`
- `backend/routes/videoRoutes.js`
- `backend/models/Course.js`
- `backend/models/Video.js`
- `backend/models/Enrollment.js`
