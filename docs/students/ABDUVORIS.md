# 🎬 ABDUVORIS — Video Lesson Pages (2 ta sahifa)

## 📋 Vazifa Qisqacha
Sen **2 ta Video Lesson sahifasini** yasaysan:
1. **VideoPage** — Video player + Telegram link modal
2. **VideoPlaygroundPage** — Video + Code Editor + Quiz

---

## 🌿 Branch
```
feature/abduvoris-lessons
```
> ⚠️ **DIQQAT:** Faqat o'z branchingda ishlash. `main`ga hech narsa yozma!

```bash
git checkout -b feature/abduvoris-lessons
git push origin feature/abduvoris-lessons
```

---

## 📁 Sening Fayllaring

```
frontend/src/
├── pages/
│   ├── VideoPage.jsx               ← Sen yozasan (1-sahifa)
│   └── VideoPlaygroundPage.jsx     ← Sen yozasan (2-sahifa)
│
├── components/
│   └── videos/
│       ├── VideoCard.jsx            ← Allaqachon bor, o'qib tush
│       ├── VideoLinkModal.jsx       ← Allaqachon bor, ishlatasan
│       └── VideoRating.jsx          ← Allaqachon bor, ishlatasan
│
├── hooks/
│   └── useVideos.js                 ← Allaqachon yozilgan, ishlatasan
│
└── api/
    ├── videoApi.js                  ← Allaqachon yozilgan
    └── userApi.js                   ← addVideoWatchXP() ishlatasan
```

---

## 🎨 Dizayn (Figma)

### 1-Sahifa: VideoPage (`/videos/:id`)
- **Tepada:** Aidevix logo + KURSLAR navigatsiyasi
- **Video player** (asosiy qism):
  - Ko'k gradient background
  - Play/Pause controls
  - Progress bar
  - Dars nomi pastda
  - Rating yulduzchalar
- **Chap panel:** Telegram Havola modal:
  - Telegram ikonkasi + URL matn
  - "Ko'chirish" tugmasi (clipboard)
  - "Telegramda ochish" tugmasi (primary)
- **O'ng panel:** Materiallar ro'yxati
  - Darsga tegishli PDF, ZIP fayllar
- **Pastda:** Dars nomi + tavsif

### 2-Sahifa: VideoPlaygroundPage (`/videos/:id/playground`)
- **Tepada:** Navigatsiya tabs: `KURSLAR` | `PLAYGROUND`
- **KURSLAR tab:**
  - Video player (kichikroq)
  - Savol va Javoblar bo'limi (Q&A)
  - Materiallar
- **PLAYGROUND tab:**
  - `bash.js` kabi fayl nomi ko'rsatiladi
  - **Code Editor** (solda):
    - Dark theme (monaco-editor)
    - Syntax highlighting
    - Line numbers
  - **Terminal** (o'ngda yoki pastda):
    - Output natija
    - Green cursor blink
  - **"RUN CODE" tugmasi** (neon green)
- **O'ng panel:**
  - Reytinglar ro'yxati (O'quvchilar)
  - Shartli topshiriqlar

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/videos/:id` | GET | ✅ Bearer | Video ma'lumotlari |
| `/api/videos/course/:courseId` | GET | ❌ Yo'q | Kurs videolari ro'yxati |
| `/api/videos/link/:linkId/use` | POST | ✅ Bearer | Telegram linkni bir martalik ishlatish |
| `/api/xp/video-watched/:videoId` | POST | ✅ Bearer | Video ko'rganlik uchun +50 XP |
| `/api/xp/quiz/video/:videoId` | GET | ✅ Bearer | Video quizini olish |

### Misol — Video ma'lumotlari olish:
```javascript
import { useVideos } from '@hooks/useVideos'

const { video, loading } = useVideos()
// yoki to'g'ridan-to'g'ri:
import { videoApi } from '@api/videoApi'
const { data } = await videoApi.getVideo(videoId)
```

### Misol — Telegram link ishlatish:
```javascript
import { videoApi } from '@api/videoApi'

const handleOpenTelegram = async (linkId) => {
  const { data } = await videoApi.useVideoLink(linkId)
  // data.data.telegramUrl — bu URL faqat bir marta ishlaydi!
  window.open(data.data.telegramUrl, '_blank')
}
```

### Misol — Video tugaganida XP olish:
```javascript
import { userApi } from '@api/userApi'

const handleVideoEnd = async () => {
  await userApi.addVideoWatchXP(videoId)
  // +50 XP beriladi
}
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
react-player       # Video player komponenti
react-icons        # Ikonkalar
framer-motion      # Animatsiyalar
react-hot-toast    # Xabarlar
```

### Code Editor uchun (qo'shish kerak):
```bash
cd frontend
npm install @monaco-editor/react
```

### Ishlatish:
```javascript
import { useRef } from 'react'
import ReactPlayer from 'react-player'
import Editor from '@monaco-editor/react'

// Video Player:
<ReactPlayer
  url={telegramUrl}
  controls
  width="100%"
  onEnded={handleVideoEnd}
  className="rounded-xl overflow-hidden"
/>

// Code Editor:
<Editor
  height="400px"
  defaultLanguage="javascript"
  theme="vs-dark"
  value={code}
  onChange={setCode}
/>
```

---

## 🎨 Tailwind + DaisyUI

```jsx
{/* Video container */}
<div className="relative aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl overflow-hidden">
  <ReactPlayer ... />
</div>

{/* Telegram link modal */}
<div className="bg-base-200 rounded-xl p-4 border border-primary/30">
  <div className="flex items-center gap-3">
    <FaTelegram className="text-blue-400 text-2xl" />
    <code className="text-sm text-primary truncate">{telegramUrl}</code>
  </div>
</div>

{/* Run Code tugmasi */}
<button className="btn bg-green-500 hover:bg-green-400 text-black font-bold gap-2">
  ▶ RUN CODE
</button>
```

---

## 📊 Redux State

```javascript
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '@store/slices/authSlice'
import { useUserStats } from '@hooks/useUserStats'

const isLoggedIn = useSelector(selectIsLoggedIn)
const { xp, level } = useUserStats()
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] VideoPage'da video ma'lumotlari yuklanadi
- [ ] Telegram link modal ochiladi va URL ko'rsatiladi
- [ ] Link faqat bir marta ishlatilishi tekshiriladi
- [ ] Video tugaganida +50 XP beriladi
- [ ] VideoPlaygroundPage'da kod muharriri ishlaydi
- [ ] KURSLAR / PLAYGROUND tabs ishlaydi
- [ ] Q&A bo'limi ko'rsatiladi
- [ ] Dizayn Figma bilan mos keladi

---

## 🌐 BACKEND API — TO'LIQ QO'LLANMA

**Backend:** Node.js + Express.js | **Port:** 5000 | **Database:** MongoDB Atlas
**Jami endpointlar: ~75 ta**

### 🔗 Server URL'lari

| Muhit | URL |
|-------|-----|
| Local (Development) | `http://localhost:5000` |
| Production (Render) | `https://aidevixbackend.onrender.com` |

---

### 📖 Swagger UI — Interaktiv Hujjat

```
URL:      http://localhost:5000/api-docs
Username: admin
Password: admin123
```

**Swagger'da token kiritish:**
1. `http://localhost:5000/api-docs` ni oching
2. Yuqori o'ngda **"Authorize 🔓"** tugmasini bosing
3. `Bearer eyJhbGciOiJ...` formatida token kiriting
4. **"Authorize"** bosing — endi `🔒` belgili endpointlar ishlaydi

---

## 📋 BARCHA ENDPOINTLAR (~75 ta)

### 1️⃣ AUTHENTICATION — `/api/auth` (5 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| POST | `/api/auth/register` | ❌ | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | ❌ | Tizimga kirish |
| POST | `/api/auth/refresh-token` | ❌ | Token yangilash |
| POST | `/api/auth/logout` | ✅ | Chiqish |
| GET | `/api/auth/me` | ✅ | Mening profilim |

---

### 2️⃣ SUBSCRIPTIONS — `/api/subscriptions` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/subscriptions/status` | ✅ | Obuna holati |
| POST | `/api/subscriptions/verify-instagram` | ✅ | Instagram tekshirish |
| POST | `/api/subscriptions/verify-telegram` | ✅ | Telegram tekshirish |

---

### 3️⃣ COURSES — `/api/courses` (9 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/courses` | ❌ | Barcha kurslar |
| GET | `/api/courses/top` | ❌ | Top kurslar |
| GET | `/api/courses/categories` | ❌ | Kategoriyalar |
| GET | `/api/courses/:id` | ❌ | Bitta kurs tafsiloti |
| GET | `/api/courses/:id/recommended` | ❌ | Tavsiya etilgan |
| POST | `/api/courses/:id/rate` | ✅ | Baholash (1-5 ⭐) |
| POST | `/api/courses` | ✅ Admin | Yaratish |
| PUT | `/api/courses/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/courses/:id` | ✅ Admin | O'chirish |

---

### 4️⃣ VIDEOS — `/api/videos` (9 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/videos/course/:courseId`** | ❌ | **Kurs videolari ro'yxati** |
| **GET** | **`/api/videos/:id`** | ✅ + Obuna | **Video + Bir martalik Telegram link** |
| **POST** | **`/api/videos/link/:linkId/use`** | ✅ | **Linkni ishlatilgan belgilash** |
| **GET** | **`/api/videos/:id/questions`** | ❌ | **Q&A ro'yxati** |
| **POST** | **`/api/videos/:id/questions`** | ✅ | **Savol berish** |
| POST | `/api/videos/:id/questions/:qId/answer` | ✅ Admin | Javob berish (Admin) |
| POST | `/api/videos` | ✅ Admin | Yaratish |
| PUT | `/api/videos/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/videos/:id` | ✅ Admin | O'chirish |

**GET `/api/videos/course/:courseId`** — Token shart emas
```json
{
  "success": true,
  "data": {
    "count": 5,
    "videos": [
      { "_id": "65f2...", "title": "1-dars: React nima?", "order": 0, "duration": 900 },
      { "_id": "65f2...", "title": "2-dars: JSX sintaksisi", "order": 1, "duration": 1200 }
    ]
  }
}
// ⚠️ Telegram link YO'Q — faqat ro'yxat
```

**GET `/api/videos/:id`** — Token + Obuna kerak (3 qatlam himoya!)
```json
// Javob (200):
{
  "success": true,
  "data": {
    "video": { "_id": "65f2...", "title": "1-dars: React nima?", "duration": 900 },
    "videoLink": {
      "_id": "65f3...",
      "telegramLink": "https://t.me/c/1234567890/42",
      "isUsed": false,
      "expiresAt": "2026-03-18T10:00:00.000Z"
    }
  }
}

// Javob (403) — Obuna yo'q:
{ "success": false, "message": "Obunani tasdiqlang", "missingSubscriptions": ["telegram"] }
```

**POST `/api/videos/link/:linkId/use`** — Linkni bir marta ishlatish
```json
// So'rov: POST /api/videos/link/65f3.../use  (Body shart emas)
// Javob: { "success": true, "message": "Video link marked as used." }
// ⚠️ Link bir marta ishlatilgach qayta ishlatib bo'lmaydi!
```

**GET `/api/videos/:id/questions`** — Q&A (sahifalangan)
```json
// Query: ?page=1&limit=20
// Javob (200):
{
  "success": true,
  "data": {
    "total": 3, "page": 1, "pages": 1,
    "questions": [
      {
        "_id": "q1", "question": "useState bilan useReducer farqi?",
        "answer": "useState oddiy, useReducer murakkab holatlar uchun.",
        "isAnswered": true,
        "userId": { "username": "ahmadjon" },
        "answeredBy": { "username": "admin" },
        "createdAt": "2026-03-10T09:00:00.000Z"
      }
    ]
  }
}
```

---

### 5️⃣ XP TIZIMI — `/api/xp` (8 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **POST** | **`/api/xp/video-watched/:videoId`** | ✅ | **Video tugadi = +50 XP** |
| **GET** | **`/api/xp/quiz/video/:videoId`** | ✅ | **Video quizini olish** |
| GET | `/api/xp/stats` | ✅ | XP, level, streak |
| POST | `/api/xp/quiz/:quizId` | ✅ | Quiz yechish |
| PUT | `/api/xp/profile` | ✅ | Profil yangilash |
| GET | `/api/xp/weekly-leaderboard` | ❌ | Haftalik TOP |
| POST | `/api/xp/streak-freeze` | ✅ | Freeze ishlatish |
| POST | `/api/xp/streak-freeze/add` | ✅ | Freeze qo'shish |

**POST `/api/xp/video-watched/:videoId`** — Video tugaganida chaqir!
```json
// So'rov: POST /api/xp/video-watched/65f200000000000000000001
// Javob:
{
  "success": true,
  "data": { "xpEarned": 50, "totalXp": 1290, "level": 2, "streak": 13, "levelProgress": 29 }
}
```

**GET `/api/xp/quiz/video/:videoId`** — Video quizini olish
```json
// Javob (200):
{
  "success": true,
  "data": {
    "quiz": {
      "_id": "quiz123",
      "questions": [
        { "questionIndex": 0, "text": "React nima?",
          "options": ["Library", "Framework", "Language", "Database"] }
      ],
      "passingScore": 60
    },
    "alreadySolved": false,
    "previousScore": null
  }
}
// ⚠️ correctAnswer qaytarilmaydi! Faqat options beriladi.
```

---

### 6️⃣ RANKING — `/api/ranking` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/ranking/courses` | ❌ | Top kurslar |
| GET | `/api/ranking/users` | ❌ | Top foydalanuvchilar |
| GET | `/api/ranking/users/:userId/position` | ✅ | O'z pozitsiyasi |

---

### 7️⃣ LOYIHALAR — `/api/projects` (6 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/projects/course/:courseId` | ❌ | Kurs loyihalari |
| GET | `/api/projects/:id` | ❌ | Bitta loyiha |
| POST | `/api/projects/:id/complete` | ✅ | Bajarish (+XP) |
| POST | `/api/projects` | ✅ Admin | Yaratish |
| PUT | `/api/projects/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/projects/:id` | ✅ Admin | O'chirish |

---

### 8️⃣ KURSGA YOZILISH — `/api/enrollments` (4 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| POST | `/api/enrollments/:courseId` | ✅ | Kursga yozilish |
| GET | `/api/enrollments/my` | ✅ | Mening kurslarim |
| GET | `/api/enrollments/:courseId/progress` | ✅ | Progress (%) |
| POST | `/api/enrollments/:courseId/watch/:videoId` | ✅ | Video ko'rildi |

---

### 9️⃣ WISHLIST (3 ta) | 🔟 SERTIFIKATLAR (2 ta) | 1️⃣1️⃣ SEKSIYALAR (5 ta)
### 1️⃣2️⃣ FOLLOW (4 ta) | 1️⃣3️⃣ CHALLENGELAR (3 ta) | 1️⃣4️⃣ TO'LOV (3 ta)
### 1️⃣5️⃣ ADMIN (5 ta) | 1️⃣6️⃣ YUKLASH (2 ta) | 🏥 HEALTH (1 ta)

---

### ❌ HTTP Status Kodlar

| Kod | Ma'no | Sabab |
|-----|-------|-------|
| `200` | OK | Muvaffaqiyat |
| `201` | Created | Yaratildi |
| `400` | Bad Request | Noto'g'ri ma'lumot |
| `401` | Unauthorized | Token yo'q/eskirgan |
| `403` | Forbidden | Ruxsat yo'q (obuna/admin kerak) |
| `404` | Not Found | Topilmadi |
| `429` | Too Many Requests | Rate limit (200 req/15min) |
| `500` | Server Error | Server xatosi |

### 🔄 Video Ko'rish To'liq Oqimi

```
1. GET /api/videos/course/:courseId → Videolar ro'yxati (tokenSiz)
2. GET /api/videos/:id             → Token + Obuna kerak → videoLink._id + telegramLink
3. window.open(telegramLink)        → Foydalanuvchi Telegram'da videoni ko'radi
4. POST /api/videos/link/:id/use   → Link "ishlatildi" deb belgilanadi
5. POST /api/xp/video-watched/:id  → +50 XP beriladi
```
