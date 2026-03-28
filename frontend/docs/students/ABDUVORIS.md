# 🎬 ABDUVORIS — Video Lesson Pages (2 ta sahifa)

## 📋 Vazifa Qisqacha
Sen **2 ta Video Lesson sahifasini** yasaysan:
1. **VideoPage** — Bunny.net video player + Q&A + Materiallar
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

## ⚠️ MUHIM: Video tizimi o'zgardi!

**Eski tizim (Telegram link)** — ISHLAMAYDI, ishlatma:
```js
// ❌ ESKIRGAN — bunday yozma!
videoLink.telegramLink   // bu field yo'q
window.open(telegramUrl) // yo'q
<ReactPlayer url={telegramUrl} />  // yo'q
```

**Yangi tizim (Bunny.net embed URL)** — HOZIRGI:
```js
// ✅ TO'G'RI — shunday qil
const { video, player } = response.data.data
// player.embedUrl — Bunny.net signed URL (2 soat muddatli)
// player.expiresAt — eskirish vaqti

<iframe src={player.embedUrl} allowFullScreen ... />
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
│       └── VideoRating.jsx          ← Allaqachon bor, ishlatasan
│
├── hooks/
│   └── useVideos.js                 ← Allaqachon yozilgan, ishlatasan
│
└── api/
    ├── videoApi.js                  ← Allaqachon yozilgan
    └── userApi.js                   ← addVideoWatchXP() ishlatasan
```

> ⚠️ `VideoLinkModal.jsx` — eski Telegram tizimi uchun edi. **Ishlatma**, iframe yoz.

---

## 🎨 Dizayn

### 1-Sahifa: VideoPage (`/videos/:id`)
- **Tepada:** "← Orqaga" tugmasi + kurs nomi
- **Video player** (Bunny.net iframe): 16:9 aspect ratio, `allowFullScreen`
- **Pastda:** Video nomi, tavsif, davomiylik, ko'rishlar soni
- **Materiallar** (bo'lsa): har biri "Yuklab olish ↓" link
- **VideoRating** komponenti
- **Q&A bo'limi:** savollar ro'yxati + yangi savol yuborish formi
- **"💻 Playground'da o'rganish →"** link

### 2-Sahifa: VideoPlaygroundPage (`/videos/:id/playground`)
- **Tabs:** `VIDEO` | `PLAYGROUND`
- **VIDEO tab:** Bunny iframe (kichikroq) + Q&A
- **PLAYGROUND tab:**
  - **Code Editor** (Monaco): dark theme, JS syntax
  - **Terminal output**
  - **"▶ RUN CODE"** tugmasi (neon green)

---

## 🔌 API Endpointlar

### Swagger UI
```
URL:      http://localhost:5000/api-docs
          yoki Production: https://aidevix-backend-production.up.railway.app/api-docs
Username: Aidevix
Password: sunnatbee
```

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/videos/course/:courseId` | GET | ❌ Yo'q | Kurs videolari ro'yxati |
| `/api/videos/:id` | GET | ✅ Bearer + Obuna | Video + Bunny embed URL |
| `/api/videos/:id/questions` | GET | ❌ Yo'q | Q&A ro'yxati |
| `/api/videos/:id/questions` | POST | ✅ Bearer | Savol yuborish |
| `/api/xp/video-watched/:videoId` | POST | ✅ Bearer | Video ko'rganlik = +50 XP |
| `/api/xp/quiz/video/:videoId` | GET | ✅ Bearer | Video quizini olish |
| `/api/xp/quiz/:quizId` | POST | ✅ Bearer | Quiz yechish (+XP) |

---

## 📡 API Response Misollari

### GET `/api/videos/:id` — Video + Bunny player URL

```json
// ✅ Muvaffaqiyatli javob (200):
{
  "success": true,
  "data": {
    "video": {
      "_id": "65f200000000000000000001",
      "title": "1-dars: React nima?",
      "description": "React asoslari haqida kirish darsi",
      "duration": 3137,
      "order": 1,
      "thumbnail": "https://vz-cdn.net/thumb.jpg",
      "materials": [
        { "name": "1-dars-materiallar.pdf", "url": "https://..." }
      ],
      "course": { "_id": "...", "title": "React.js kursi" },
      "viewCount": 142
    },
    "player": {
      "embedUrl": "https://iframe.mediadelivery.net/embed/123456/abc-def?token=xyz&expires=1774120000",
      "expiresAt": "2026-03-22T20:00:00.000Z"
    }
  }
}

// ❌ Obuna yo'q (403):
{
  "success": false,
  "message": "Telegram va Instagram kanallariga obuna bo'ling",
  "missingSubscriptions": ["telegram"]
}

// ❌ Video hali tayyor emas (503):
{
  "success": false,
  "message": "Video hali tayyorlanmoqda. Iltimos, bir oz kuting.",
  "bunnyStatus": "processing"
}
```

### POST `/api/xp/video-watched/:videoId` — +50 XP

```json
{
  "success": true,
  "data": {
    "xpEarned": 50,
    "totalXp": 1290,
    "level": 2,
    "streak": 13,
    "leveledUp": false
  }
}
// ⚠️ leveledUp: true bo'lsa — Level UP sahifasi/modal ko'rsat!
```

### GET `/api/videos/:id/questions` — Q&A

```json
{
  "success": true,
  "data": {
    "total": 3, "page": 1, "pages": 1,
    "questions": [
      {
        "_id": "q1",
        "question": "useState bilan useReducer farqi?",
        "answer": "useState oddiy, useReducer murakkab holatlar uchun.",
        "isAnswered": true,
        "userId": { "username": "ahmadjon" },
        "createdAt": "2026-03-10T09:00:00.000Z"
      }
    ]
  }
}
```

---

## 💻 Kod Misollari

### VideoPage asosi:

```jsx
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '@api/axiosInstance'
import VideoRating from '@components/videos/VideoRating'
import SubscriptionGate from '@components/subscription/SubscriptionGate'

export default function VideoPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axiosInstance.get(`/videos/${id}`)
      .then(res => setData(res.data.data))
      .catch(err => setError(err.response?.data?.message || 'Xato'))
      .finally(() => setLoading(false))
  }, [id])

  const handleVideoEnd = async () => {
    try {
      const res = await axiosInstance.post(`/xp/video-watched/${id}`)
      if (res.data.data?.leveledUp) {
        // Level UP! Modal ko'rsat yoki /level-up ga yo'naltir
      }
    } catch {}
  }

  if (loading) return <span className="loading loading-spinner loading-lg" />
  if (error) return <div className="alert alert-error">{error}</div>

  const { video, player } = data

  return (
    <SubscriptionGate>
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* Orqaga */}
        <Link to={-1} className="btn btn-ghost btn-sm">← Orqaga</Link>

        {/* Bunny.net Video Player — 16:9 */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black"
          style={{ paddingTop: '56.25%' }}>
          <iframe
            src={player.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video ma'lumotlari */}
        <div>
          <h1 className="text-2xl font-bold">{video.title}</h1>
          <p className="text-base-content/60 mt-2">{video.description}</p>
          <div className="flex gap-4 mt-2 text-sm text-base-content/50">
            <span>⏱ {Math.floor(video.duration / 60)} daqiqa</span>
            <span>👁 {video.viewCount} marta ko'rilgan</span>
          </div>
        </div>

        {/* Video tugash + XP */}
        <button onClick={handleVideoEnd} className="btn btn-success btn-sm">
          ✅ Darsni tugatdim (+50 XP)
        </button>

        {/* Materiallar */}
        {video.materials?.length > 0 && (
          <div className="card bg-base-200 card-body">
            <h3 className="font-semibold">📎 Materiallar</h3>
            {video.materials.map((m, i) => (
              <a key={i} href={m.url} target="_blank" rel="noreferrer"
                className="link link-primary text-sm">
                {m.name} ↓
              </a>
            ))}
          </div>
        )}

        {/* Rating */}
        <VideoRating videoId={id} />

        {/* Playground */}
        <Link to={`/videos/${id}/playground`} className="btn btn-outline w-full">
          💻 Playground'da o'rganish →
        </Link>
      </div>
    </SubscriptionGate>
  )
}
```

### Monaco Code Editor o'rnatish:

```bash
cd frontend
npm install @monaco-editor/react
```

```jsx
import Editor from '@monaco-editor/react'

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
{/* Video container — 16:9 aspect ratio */}
<div className="relative w-full rounded-2xl overflow-hidden bg-black"
  style={{ paddingTop: '56.25%' }}>
  <iframe
    src={player.embedUrl}
    className="absolute inset-0 w-full h-full"
    allowFullScreen
  />
</div>

{/* Video hali tayyorlanmoqda */}
{error?.includes('tayyorlanmoqda') && (
  <div className="alert alert-warning">
    <span>⏳ Video hali tayyor emas. Bir oz kuting...</span>
  </div>
)}

{/* Run Code tugmasi */}
<button className="btn bg-green-500 hover:bg-green-400 text-black font-bold gap-2">
  ▶ RUN CODE
</button>

{/* Q&A savol formasi */}
<form className="flex gap-2 mt-4">
  <input className="input input-bordered flex-1"
    placeholder="Savolingizni kiriting..." />
  <button type="submit" className="btn btn-primary">Yuborish</button>
</form>
```

---

## ✅ Tekshiruv Ro'yxati (Pull Request oldidan)

- [ ] VideoPage da Bunny.net iframe ishlaydi (telegramLink ishlatilmagan!)
- [ ] SubscriptionGate ishlaydi (obuna yo'q bo'lsa `/subscription` ga yo'naltiradi)
- [ ] Video ma'lumotlari (nomi, tavsif, davomiylik) ko'rsatiladi
- [ ] "Darsni tugatdim" bosilganda +50 XP beriladi
- [ ] leveledUp: true bo'lsa Level UP modal/sahifa ko'rsatiladi
- [ ] Materiallar ro'yxati ko'rsatiladi
- [ ] VideoRating komponenti ishlaydi
- [ ] Q&A ro'yxati yuklanadi va savol yuboriladi
- [ ] VideoPlaygroundPage da Monaco Editor ishlaydi
- [ ] VIDEO / PLAYGROUND tabs ishlaydi
- [ ] `main` branchga kod yozilmagan!

---

## 🔄 Video Ko'rish To'liq Oqimi (YANGILANGAN)

```
1. GET /api/videos/course/:courseId → Videolar ro'yxati (tokenSiz)
2. Foydalanuvchi videoni bosadi → /videos/:id sahifasi ochiladi
3. GET /api/videos/:id → Token + Obuna tekshiriladi
   → player.embedUrl qaytadi (2 soatlik signed URL)
4. <iframe src={player.embedUrl} /> — Bunny player ko'rsatiladi
5. Foydalanuvchi "Darsni tugatdim" bosadi
   → POST /api/xp/video-watched/:id → +50 XP
6. leveledUp: true → Level UP modal 🎉
```

---

## 🌐 BACKEND — Server URL'lari

| Muhit | URL |
|-------|-----|
| Local (Development) | `http://localhost:5000` |
| Production (Railway) | `https://aidevix-backend-production.up.railway.app` |

---

## 📋 BARCHA ENDPOINTLAR

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
| POST | `/api/subscriptions/verify-instagram` | ✅ | Instagram tasdiqlash |
| POST | `/api/subscriptions/verify-telegram` | ✅ | Telegram tasdiqlash |

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

### 4️⃣ VIDEOS — `/api/videos` ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/videos/course/:courseId`** | ❌ | **Kurs videolari ro'yxati** |
| **GET** | **`/api/videos/:id`** | ✅ + Obuna | **Video + Bunny embed URL (2 soat)** |
| **GET** | **`/api/videos/:id/questions`** | ❌ | **Q&A ro'yxati** |
| **POST** | **`/api/videos/:id/questions`** | ✅ | **Savol berish** |
| POST | `/api/videos/:id/questions/:qId/answer` | ✅ Admin | Javob berish |

---

### 5️⃣ XP TIZIMI — `/api/xp` ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **POST** | **`/api/xp/video-watched/:videoId`** | ✅ | **Video tugadi = +50 XP** |
| **GET** | **`/api/xp/quiz/video/:videoId`** | ✅ | **Video quizini olish** |
| **POST** | **`/api/xp/quiz/:quizId`** | ✅ | **Quiz yechish (+XP)** |
| GET | `/api/xp/stats` | ✅ | XP, level, streak |

---

### ❌ HTTP Status Kodlar

| Kod | Ma'no | Sabab |
|-----|-------|-------|
| `200` | OK | Muvaffaqiyat |
| `201` | Created | Yaratildi |
| `400` | Bad Request | Noto'g'ri ma'lumot |
| `401` | Unauthorized | Token yo'q/eskirgan |
| `403` | Forbidden | Ruxsat yo'q (obuna kerak) |
| `404` | Not Found | Topilmadi |
| `503` | Service Unavailable | Video hali tayyorlanmoqda |
| `429` | Too Many Requests | Rate limit (200 req/15min) |
| `500` | Server Error | Server xatosi |
