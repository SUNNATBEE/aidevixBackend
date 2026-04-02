# 🏠 ABDUVOHID — Home Page

## 📋 Vazifa Qisqacha
Sen **bosh sahifani** yasaysan — bu platforma uchun eng muhim sahifa. Shuningdek **Navbar** va **Footer** komponentlarini ham tartibga solasan.

---

## 🌿 Branch
```
feature/abduvohid-home
```
> ⚠️ **DIQQAT:** Faqat `feature/abduvohid-home` branchida ishlash!

```bash
git checkout -b feature/abduvohid-home
git push origin feature/abduvohid-home
```

---

## 📁 Sening Fayllaring

```
frontend/src/
├── pages/
│   └── HomePage.jsx                  ← Sen yozasan
│
├── components/
│   └── layout/
│       ├── Navbar.jsx                 ← Sen yaxshilasan
│       └── Footer.jsx                 ← Sen yaxshilasan
│
└── animations/
    ├── three/
    │   └── HeroScene.js               ← Allaqachon bor (Qudrat yaxshilaydi)
    └── gsap/
        ├── heroAnimations.js          ← Allaqachon bor, ishlatasan
        └── cardAnimations.js          ← Allaqachon bor, ishlatasan
```

---

## 🎨 Dizayn (Figma)

### HomePage (`/`)

**Navbar:**
- Logo: "Aidevix" (chap tomonda)
- Links: Kurslar | Yo'nalishlar | Hamjamiyat | Blog
- O'ngda: "Kirish" (ghost) + "Ro'yxatdan o'tish" (primary) yoki Avatar (login bo'lsa)

**Hero Section:**
- Dark space background
- Chap: Katta sarlavha
  - "Kelajak kasbini"
  - "O'zbek tilida o'rganing" (accent rangda)
  - Kichik tavsif matni
  - "🎓 Kurslarni ko'rish" + "⚡ Bepul dars" tugmalar
- O'ng: Three.js 3D animatsiya (Qudrat yasaydi, sen joy qoldirasiz)
- Pastda statistika: **15k+ O'quvchilar** | **120+ Video darslar** | **50+ Mentorlar** | **4.9 Reyting**

**Featured Courses Section:**
- "Tavsiya etilgan Kurslar" sarlavha
- Swiper carousel (4 ta kurs kartasi)

**Stats/CTA Section:**
- "Nima uchun Aidevix?" blok
- 3 ta xususiyat kartasi (3D Vizualizatsiya, Sun'iy Intellekt, ...)

**Footer:**
- Logo + qisqacha tavsif
- Links: Kurslar, Mentorlar, Blog, Hamjamiyat
- Social ikonkalar (Telegram, Instagram, YouTube)
- Copyright

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/courses/top` | GET | ❌ Yo'q | Tavsiya etilgan kurslar |
| `/api/courses?limit=8` | GET | ❌ Yo'q | Yangi kurslar |
| `/health` | GET | ❌ Yo'q | Server holati |

### Misol:
```javascript
import { useCourses } from '@hooks/useCourses'

const HomePage = () => {
  const { courses, loading } = useCourses()

  useEffect(() => {
    // Top kurslar olish
    fetchCourses({ limit: 8 })
  }, [])
  ...
}
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
gsap               # Hero animatsiyalar
three              # 3D sahna (Qudrat boshqaradi)
swiper             # Kurs carousel
framer-motion      # Seksiyalar kirish animatsiyasi
react-icons        # Ikonkalar
```

### GSAP Animatsiyalar:
```javascript
import { heroAnimations } from '@animations/gsap/heroAnimations'
import { useEffect } from 'react'

useEffect(() => {
  heroAnimations.init() // Hero sarlavha animatsiyasi
}, [])
```

---

## 🎨 Tailwind + DaisyUI

```jsx
{/* Hero Section */}
<section className="min-h-screen flex items-center relative overflow-hidden">
  {/* Background particles (Qudrat/Three.js) */}
  <div className="absolute inset-0 z-0" id="hero-canvas" />

  <div className="container mx-auto px-6 relative z-10">
    <div className="max-w-2xl">
      <h1 className="text-6xl font-black leading-tight">
        Kelajak kasbini
        <br />
        <span className="text-primary">O'zbek tilida o'rganing</span>
      </h1>
      <p className="text-base-content/70 mt-4 text-lg">
        Dasturlashni o'rganishning eng oddiy yo'li...
      </p>
      <div className="flex gap-4 mt-8">
        <button className="btn btn-primary btn-lg gap-2">
          🎓 Kurslarni ko'rish
        </button>
        <button className="btn btn-ghost btn-lg gap-2">
          ⚡ Bepul dars
        </button>
      </div>
    </div>
  </div>
</section>

{/* Stats */}
<div className="stats stats-horizontal shadow bg-base-200 w-full">
  <div className="stat">
    <div className="stat-value text-primary">15k+</div>
    <div className="stat-title">O'quvchilar</div>
  </div>
  <div className="stat">
    <div className="stat-value">120+</div>
    <div className="stat-title">Video darslar</div>
  </div>
</div>

{/* Navbar */}
<div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-40">
  <div className="navbar-start">
    <a className="text-xl font-black text-primary">Aidevix</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal gap-2">
      <li><a>Kurslar</a></li>
      <li><a>Yo'nalishlar</a></li>
    </ul>
  </div>
  <div className="navbar-end gap-2">
    <Link to="/login" className="btn btn-ghost btn-sm">Kirish</Link>
    <Link to="/register" className="btn btn-primary btn-sm">Ro'yxatdan o'tish</Link>
  </div>
</div>
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] Hero section to'g'ri ko'rsatiladi
- [ ] Navbar responsive (mobil va desktop)
- [ ] Login holati: Avatar ko'rsatiladi (logout tugmasi dropdown'da)
- [ ] Kurslar carousel yuklanadi
- [ ] Statistika raqamlari ko'rsatiladi
- [ ] Footer barcha linklar bilan
- [ ] Sahifa yuklanganda GSAP animatsiya ishlaydi
- [ ] Dizayn Figma bilan mos keladi

---

## 🌐 BACKEND API — TO'LIQ QO'LLANMA

**Backend:** Node.js + Express.js | **Port:** 5000 | **Database:** MongoDB Atlas
**Jami endpointlar: ~75 ta**

### 🔗 Server URL'lari

| Muhit | URL |
|-------|-----|
| Local (Development) | `http://localhost:5000` |
| Production (Railway) | `https://aidevix-backend-production.up.railway.app` |

---

### 📖 Swagger UI — Interaktiv Hujjat

Swagger — barcha endpointlarni ko'rish va brauzerdan **sinab ko'rish** imkonini beradi.

```
URL:      http://localhost:5000/api-docs
Username: Aidevix
Password: sunnatbee
```

**Swagger'da token kiritish:**
1. `http://localhost:5000/api-docs` ni oching
2. Yuqori o'ngda **"Authorize 🔓"** tugmasini bosing
3. `Bearer eyJhbGciOiJ...` formatida token kiriting
4. **"Authorize"** bosing — endi `🔒` belgili endpointlar ishlaydi

---

### 🔐 Frontend'da Token bilan Ishlash

```javascript
// ✅ TO'G'RI YO'L: axiosInstance (token avtomatik qo'shiladi)
import axiosInstance from '@api/axiosInstance'
const { data } = await axiosInstance.get('/api/courses/top')

// Oddiy fetch bilan:
const token = localStorage.getItem('accessToken')
const res = await fetch('http://localhost:5000/api/courses', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

---

## 📋 BARCHA ENDPOINTLAR (~75 ta)

### 1️⃣ AUTHENTICATION — `/api/auth` (5 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| POST | `/api/auth/register` | ❌ | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | ❌ | Tizimga kirish |
| POST | `/api/auth/refresh-token` | ❌ | AccessToken yangilash |
| POST | `/api/auth/logout` | ✅ | Tizimdan chiqish |
| GET | `/api/auth/me` | ✅ | Mening profilim |

**POST `/api/auth/login`** — Response:
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "username": "ahmadjon", "role": "user",
      "subscriptions": { "instagram": { "subscribed": false }, "telegram": { "subscribed": false } }
    },
    "accessToken": "eyJ...", "refreshToken": "eyJ..."
  }
}
```

---

### 2️⃣ SUBSCRIPTIONS — `/api/subscriptions` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/subscriptions/status` | ✅ | Obuna holati |
| POST | `/api/subscriptions/verify-instagram` | ✅ | Instagram tekshirish |
| POST | `/api/subscriptions/verify-telegram` | ✅ | Telegram tekshirish |

---

### 3️⃣ COURSES — `/api/courses` (9 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/courses`** | ❌ | **Barcha kurslar** |
| **GET** | **`/api/courses/top`** | ❌ | **Top kurslar (viewCount)** |
| GET | `/api/courses/categories` | ❌ | Kategoriyalar |
| GET | `/api/courses/:id` | ❌ | Bitta kurs tafsiloti |
| GET | `/api/courses/:id/recommended` | ❌ | Tavsiya etilgan |
| POST | `/api/courses/:id/rate` | ✅ | Baholash (1-5 ⭐) |
| POST | `/api/courses` | ✅ Admin | Yaratish |
| PUT | `/api/courses/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/courses/:id` | ✅ Admin | O'chirish |

**GET `/api/courses/top?limit=8`** — HomePage uchun:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "65f1...", "title": "React.js Frontend Development",
        "price": 349000, "category": "react", "rating": 4.8,
        "viewCount": 3840, "thumbnail": "https://...react-icon.svg",
        "instructor": { "username": "aidevix_admin" }
      }
    ],
    "total": 6
  }
}
```

**GET `/api/courses`** — Query params: `?category=react&page=1&limit=8`
```json
{
  "success": true,
  "data": {
    "count": 6,
    "courses": [
      {
        "_id": "65f1...", "title": "React.js Frontend Development",
        "price": 349000, "category": "react", "rating": 4.8,
        "instructor": { "username": "aidevix_admin" }
      }
    ]
  }
}
```

---

### 4️⃣ VIDEOS — `/api/videos` (9 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/videos/course/:courseId` | ❌ | Kurs videolari |
| GET | `/api/videos/:id` | ✅ + Obuna | Video + Bunny embed URL |
| POST | `/api/videos/link/:linkId/use` | ✅ | Linkni ishlatilgan belgilash |
| GET | `/api/videos/:id/questions` | ❌ | Q&A |
| POST | `/api/videos/:id/questions` | ✅ | Savol berish |
| POST | `/api/videos/:id/questions/:qId/answer` | ✅ Admin | Javob berish |
| POST | `/api/videos` | ✅ Admin | Yaratish |
| PUT | `/api/videos/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/videos/:id` | ✅ Admin | O'chirish |

---

### 5️⃣ XP TIZIMI — `/api/xp` (8 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/xp/stats` | ✅ | XP, level, streak |
| POST | `/api/xp/video-watched/:videoId` | ✅ | +50 XP |
| GET | `/api/xp/quiz/video/:videoId` | ✅ | Video quizi |
| POST | `/api/xp/quiz/:quizId` | ✅ | Quiz yechish |
| PUT | `/api/xp/profile` | ✅ | Bio, skills yangilash |
| GET | `/api/xp/weekly-leaderboard` | ❌ | Haftalik TOP |
| POST | `/api/xp/streak-freeze` | ✅ | Freeze ishlatish |
| POST | `/api/xp/streak-freeze/add` | ✅ | Freeze qo'shish |

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

### 9️⃣ WISHLIST — `/api/wishlist` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/wishlist` | ✅ | Saqlangan kurslar |
| POST | `/api/wishlist/:courseId` | ✅ | Kurs saqlash |
| DELETE | `/api/wishlist/:courseId` | ✅ | O'chirish |

---

### 🔟 SERTIFIKATLAR — `/api/certificates` (2 ta)
| GET | `/api/certificates` | ✅ | Mening sertifikatlarim |
| GET | `/api/certificates/:id` | ✅ | Bitta sertifikat |

> Sertifikat kursni **100% tugatganda** avtomatik beriladi va email yuboriladi!

---

### 1️⃣1️⃣ SEKSIYALAR — `/api/sections` (5 ta) | FOLLOW — `/api/follow` (4 ta)
### 1️⃣2️⃣ CHALLENGELAR — `/api/challenges` (3 ta) | TO'LOV — `/api/payments` (3 ta)
### 1️⃣3️⃣ ADMIN — `/api/admin` (5 ta) | YUKLASH — `/api/upload` (2 ta)

---

### 🏥 HEALTH CHECK

```
GET http://localhost:5000/health
→ { "success": true, "message": "Server is running", "timestamp": "..." }
```

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
