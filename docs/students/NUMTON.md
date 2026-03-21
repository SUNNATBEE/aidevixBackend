# 🏆 NUMTON — Top Courses Ranking Page

## 📋 Vazifa Qisqacha
Sen **eng ko'p ko'rilgan kurslar reytingini** ko'rsatuvchi sahifani yasaysan.

---

## 🌿 Branch
```
feature/numton-ranking
```
> ⚠️ **DIQQAT:** Faqat `feature/numton-ranking` branchida ishlash!

```bash
git checkout -b feature/numton-ranking
git push origin feature/numton-ranking
```

---

## 📁 Sening Fayllaring

```
frontend/src/
├── pages/
│   └── TopCoursesPage.jsx              ← Sen yozasan
│
├── components/
│   └── ranking/
│       └── CourseRankCard.jsx           ← Sen yozasan
│
├── hooks/
│   └── useRanking.js                    ← Allaqachon yozilgan → useTopCourses() ishlatasan
│
├── store/slices/
│   └── rankingSlice.js                  ← Allaqachon yozilgan, faqat o'qib tush
│
└── api/
    └── rankingApi.js                    ← Allaqachon yozilgan → getTopCourses() ishlatasan
```

---

## 🎨 Dizayn (Figma)

### TopCoursesPage (`/top`)

**Hero qismi (tepada):**
- Background: To'q binafsha gradient + trophy ikonkasi
- Sarlavha: "Eng yaxshi kurslar reytingi"
- Tavsif: "Minglab o'quvchilar tanlov va muvaffaqiyat ko'rsatkichlari asosida sanalgan eng ta'lim dasturlari"

**Podium (Top 3 kurslar):**
- 2-o'rin (chapda): kichikroq, kumush
- 1-o'rin (o'rtada): eng katta, oltin crown 👑
- 3-o'rin (o'ngda): kichikroq, bronza
- Har kursda: thumbnail, reyting badge, "Kursni ko'rish" tugmasi

**Jadval ("Top 10 ro'yxat"):**
| O'rin | Kurs nomi | Kategoriya | Reyting | O'quvchilar | Harakat |
|-------|-----------|------------|---------|-------------|---------|
| #1 | React Native Pro | Mobile Dev | ★4.9 | 3,840 | Ko'rish |
| #2 | Node.js Backend | Backend | ★4.5 | 7,10 | Ko'rish |
| ... | ... | ... | ... | ... | ... |

- Filter tabs: `Hafta` | `Oy` | `Yil`
- "Ko'proq ko'rish →" tugmasi pastda

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/ranking/courses` | GET | ❌ Yo'q | Top kurslar (viewCount bo'yicha) |
| `/api/ranking/courses?category=javascript` | GET | ❌ Yo'q | Kategoriya bo'yicha filter |
| `/api/ranking/courses?limit=10` | GET | ❌ Yo'q | Cheklangan soni |

### Misol — Top kurslar:
```javascript
import { useTopCourses } from '@hooks/useRanking'

const TopCoursesPage = () => {
  const [category, setCategory] = useState(null)
  const { courses, loading } = useTopCourses({ limit: 10, category })

  return (
    <div>
      {/* Filter tabs */}
      {['javascript', 'react', 'nodejs', 'python'].map(cat => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-ghost'}`}
        >
          {cat}
        </button>
      ))}

      {/* Top 3 Podium */}
      <div className="flex justify-center gap-4">
        {courses[1] && <PodiumCard rank={2} course={courses[1]} />}
        {courses[0] && <PodiumCard rank={1} course={courses[0]} />}
        {courses[2] && <PodiumCard rank={3} course={courses[2]} />}
      </div>

      {/* Jadval */}
      {courses.map((course, i) => (
        <CourseRankCard key={course._id} rank={i + 1} course={course} />
      ))}
    </div>
  )
}
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
framer-motion      # Podium animatsiyasi (Yuk bo'lib tushish)
react-icons        # FaTrophy, FaMedal, FaStar, FaFire
react-hot-toast    # Xabarlar
```

### Animatsiya g'oyasi:
```javascript
import { motion } from 'framer-motion'

// Podium kartalar pastdan yuqoriga kelsin:
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>
  <CourseRankCard rank={rank} course={course} />
</motion.div>
```

---

## 🎨 Tailwind + DaisyUI

```jsx
{/* Podium — 1-o'rin */}
<div className="card bg-gradient-to-b from-yellow-900/50 to-yellow-800/30 border border-yellow-500/50 shadow-lg shadow-yellow-500/20">
  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
    <span className="text-3xl">👑</span>
  </div>
  <figure className="pt-8">
    <img src={course.thumbnail} className="w-24 h-24 object-cover rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <span className="badge badge-warning">Mutloq yetakchi</span>
    <h3 className="font-bold">{course.title}</h3>
    <span className="text-warning">★ {course.rating}</span>
    <button className="btn btn-warning btn-sm w-full">Kursni ko'rish</button>
  </div>
</div>

{/* Jadval qatori */}
<div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl hover:bg-base-300 transition">
  <span className="text-2xl font-bold text-base-content/30 w-8">#{rank}</span>
  <img src={course.thumbnail} className="w-12 h-12 rounded-lg object-cover" />
  <div className="flex-1">
    <p className="font-semibold">{course.title}</p>
    <span className="badge badge-outline badge-sm">{course.category}</span>
  </div>
  <div className="text-right">
    <p className="text-warning font-bold">★ {course.rating}</p>
    <p className="text-xs text-base-content/60">{course.studentsCount?.toLocaleString()} ta</p>
  </div>
  <button className="btn btn-primary btn-sm">Ko'rish</button>
</div>
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] Top kurslar API dan yuklanadi
- [ ] Podium (Top 3) ko'rsatiladi
- [ ] Jadval (Top 10) ko'rsatiladi
- [ ] Kategoriya filter ishlaydi
- [ ] Loading skeleton ko'rsatiladi
- [ ] Animatsiyalar ishlaydi
- [ ] "Ko'rish" tugmasi to'g'ri kurs sahifasiga yo'naltiradi
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

> **Token qanday olish?** Authentication → POST `/api/auth/login` → Execute → Response'dan `accessToken` ni ko'chiring

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
| POST | `/api/subscriptions/verify-instagram` | ✅ | Instagram tasdiqlash |
| POST | `/api/subscriptions/verify-telegram` | ✅ | Telegram tasdiqlash |

---

### 3️⃣ COURSES — `/api/courses` (9 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/courses` | ❌ | Barcha kurslar |
| GET | `/api/courses/top` | ❌ | Top kurslar |
| GET | `/api/courses/categories` | ❌ | Kategoriyalar |
| GET | `/api/courses/:id` | ❌ | Bitta kurs |
| GET | `/api/courses/:id/recommended` | ❌ | Tavsiya etilgan |
| POST | `/api/courses/:id/rate` | ✅ | Baholash |
| POST | `/api/courses` | ✅ Admin | Yaratish |
| PUT | `/api/courses/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/courses/:id` | ✅ Admin | O'chirish |

---

### 4️⃣ VIDEOS — `/api/videos` (9 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/videos/course/:courseId` | ❌ | Kurs videolari |
| GET | `/api/videos/:id` | ✅ + Obuna | Video + Bunny embed URL |
| POST | `/api/videos/link/:linkId/use` | ✅ | Linkni belgilash |
| GET | `/api/videos/:id/questions` | ❌ | Q&A |
| POST | `/api/videos/:id/questions` | ✅ | Savol berish |
| POST | `/api/videos/:id/questions/:qId/answer` | ✅ Admin | Javob |
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
| PUT | `/api/xp/profile` | ✅ | Profil yangilash |
| GET | `/api/xp/weekly-leaderboard` | ❌ | Haftalik TOP |
| POST | `/api/xp/streak-freeze` | ✅ | Freeze ishlatish |
| POST | `/api/xp/streak-freeze/add` | ✅ | Freeze qo'shish |

---

### 6️⃣ RANKING — `/api/ranking` (3 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/ranking/courses`** | ❌ | **Top kurslar (viewCount bo'yicha)** |
| GET | `/api/ranking/users` | ❌ | Top foydalanuvchilar |
| GET | `/api/ranking/users/:userId/position` | ✅ | O'z pozitsiyasi |

**GET `/api/ranking/courses`** — Query parametrlar:
```
?limit=10        → Nechta kurs (default: 10)
?category=react  → Kategoriya filteri (html|css|javascript|react|typescript|nodejs|general)
```

**GET `/api/ranking/courses`** — To'liq Response:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "title": "React.js — Sifatli Kurs",
        "description": "React asoslaridan murakkab loyihalargacha",
        "category": "react",
        "thumbnail": "https://res.cloudinary.com/aidevix/image/upload/v1/thumbnails/react.jpg",
        "rating": 4.9,
        "viewCount": 3840,
        "studentsCount": 3840,
        "instructor": "Sunnat Bekchanov",
        "duration": "12 soat",
        "videosCount": 45,
        "rank": 1
      },
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "title": "Node.js Backend Pro",
        "description": "Express.js va MongoDB bilan backend quramiz",
        "category": "nodejs",
        "thumbnail": "https://res.cloudinary.com/aidevix/image/upload/v1/thumbnails/nodejs.jpg",
        "rating": 4.5,
        "viewCount": 2710,
        "studentsCount": 2710,
        "rank": 2
      }
    ],
    "total": 10
  }
}
```

**GET `/api/ranking/courses?category=javascript`** — Kategoriya filteri:
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "...",
        "title": "JavaScript — Zamonaviy ES6+",
        "category": "javascript",
        "viewCount": 5200,
        "rating": 4.8,
        "rank": 1
      }
    ],
    "total": 3
  }
}
```

**useTopCourses hook qanday ishlaydi:**
```javascript
import { useTopCourses } from '@hooks/useRanking'

const TopCoursesPage = () => {
  const [category, setCategory] = useState(null)
  const { courses, loading, error } = useTopCourses({ limit: 10, category })

  // courses — massiv, har biri: { _id, title, category, thumbnail, rating, viewCount, rank }
  // loading — true bo'lsa skeleton ko'rsat
  // error   — xato bo'lsa xabar ko'rsat
}
```

---

### 7️⃣–1️⃣6️⃣ QOLGAN ENDPOINTLAR

| Guruh | Endpoint | Soni |
|-------|----------|------|
| Projects | `/api/projects` | 6 ta |
| Enrollments | `/api/enrollments` | 4 ta |
| Wishlist | `/api/wishlist` | 3 ta |
| Certificates | `/api/certificates` | 2 ta |
| Sections | `/api/sections` | 5 ta |
| Follow | `/api/follow` | 4 ta |
| Challenges | `/api/challenges` | 3 ta |
| Payments | `/api/payments` | 3 ta |
| Admin | `/api/admin` | 5 ta |
| Upload | `/api/upload` | 2 ta |
| Health | `/health` | 1 ta |

---

### ❌ HTTP Status Kodlar

| Kod | Ma'no | Sabab |
|-----|-------|-------|
| `200` | OK | Muvaffaqiyat |
| `201` | Created | Yaratildi |
| `400` | Bad Request | Noto'g'ri ma'lumot |
| `401` | Unauthorized | Token yo'q/eskirgan |
| `403` | Forbidden | Ruxsat yo'q |
| `404` | Not Found | Topilmadi |
| `429` | Too Many Requests | Rate limit (200 req/15min) |
| `500` | Server Error | Server xatosi |

### 🏆 Top Kurslar Sahifasi To'liq Oqimi

```
1. Sahifa ochiladi → GET /api/ranking/courses?limit=10
2. courses[0] — 1-o'rin (Oltin 👑)
3. courses[1] — 2-o'rin (Kumush)
4. courses[2] — 3-o'rin (Bronza)
5. courses[3-9] — Jadval (4-10 o'rinlar)

6. Kategoriya filter bosiladi:
   → GET /api/ranking/courses?category=react
   → Ro'yxat yangilanadi

7. "Ko'rish" tugmasi → navigate('/courses/:id')
```

### 🎯 Kurs Kategoriyalari

```javascript
const CATEGORIES = ['html', 'css', 'javascript', 'react', 'typescript', 'nodejs', 'general']

// Filter uchun:
const [category, setCategory] = useState(null) // null = barchasi
// null → /api/ranking/courses (barcha kategoriyalar)
// 'react' → /api/ranking/courses?category=react
```
