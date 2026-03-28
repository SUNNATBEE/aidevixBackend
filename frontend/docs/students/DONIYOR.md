# 📚 DONIYOR — All Courses Page & Course Detail Page

## 📋 Vazifa Qisqacha
Sen **barcha kurslar sahifasi** va **kurs tafsilotlari sahifasini** yasaysan.

---

## 🌿 Branch
```
feature/doniyor-courses
```
> ⚠️ **DIQQAT:** Faqat `feature/doniyor-courses` branchida ishlash!

```bash
git checkout -b feature/doniyor-courses
git push origin feature/doniyor-courses
```

---

## 📁 Sening Fayllaring

```
frontend/src/
├── pages/
│   ├── CoursesPage.jsx             ← Sen yozasan
│   └── CourseDetailPage.jsx        ← Sen yozasan
│
├── components/
│   └── courses/
│       ├── CourseCard.jsx           ← Allaqachon bor, o'zgartirsa bo'ladi
│       ├── CourseFilter.jsx         ← Allaqachon bor, ishlatasan
│       ├── CourseGrid.jsx           ← Allaqachon bor, ishlatasan
│       └── CourseSkeleton.jsx       ← Allaqachon bor, ishlatasan
│
├── hooks/
│   └── useCourses.js                ← Allaqachon yozilgan, ishlatasan
│
└── api/
    └── courseApi.js                 ← Allaqachon yozilgan
```

---

## 🎨 Dizayn (Figma)

### 1-Sahifa: CoursesPage (`/courses`)
- **Sarlavha:** "Barcha Kurslar" + tavsif
- **Chapda:** Filter panel
  - Qidiruv input
  - Yo'nalishlar (Yo'nalish, Mobil, Data Science, ...)
  - Daraja filter (Boshlang'ich, O'rta, Yuqori)
  - Reyting filter
- **O'ngda:** Kurslar grid (3 ustun)
  - Har bir kurs kartasi:
    - Thumbnail rasm
    - "NEW" yoki "PRO" badge
    - Dars soni + davomiyligi
    - Kurs nomi
    - Instruktr ismi + rating
    - "Bepul" yoki narx
- **Pagination:** sahifa raqamlari pastda

### 2-Sahifa: CourseDetailPage (`/courses/:id`)
- **Breadcrumb:** Bosh sahifa → Barcha kurslar → [Kurs nomi]
- **Kurs sarlavhasi** + tavsif
- **Instruktr** ismi + "Senior Python Developer" unvoni
- **Meta:** Rating, o'quvchilar soni, oxirgi yangilangan, til, daraja
- **Narx:** 450,000 so'm (katta)
- **"Kursni sotib olish"** tugmasi (primary)
- **"Saqlash +"** tugmasi
- **Kurs Dasturi** (accordion):
  - Bo'limlar ro'yxati (expand/collapse)
  - Har bo'limda darslar soni + davomiyligi
- **"Tavsiya etilgan kurslar"** carousel

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/courses` | GET | ❌ Yo'q | Barcha kurslar (filter, pagination) |
| `/api/courses/:id` | GET | ❌ Yo'q | Bitta kurs tafsiloti |
| `/api/courses/top` | GET | ❌ Yo'q | Top/tavsiya etilgan kurslar |

### Misol — Kurslar olish:
```javascript
import { useCourses } from '@hooks/useCourses'

const CoursesPage = () => {
  const { courses, loading, fetchCourses } = useCourses()

  useEffect(() => {
    fetchCourses({ category: 'javascript', page: 1, limit: 12 })
  }, [])

  return (
    <div>
      {loading ? <CourseSkeleton count={6} /> : <CourseGrid courses={courses} />}
    </div>
  )
}
```

### Misol — Filter qo'llash:
```javascript
// Query parametrlar:
GET /api/courses?category=javascript&page=1&limit=12&search=react
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
swiper             # Tavsiya etilgan kurslar carousel uchun
framer-motion      # Animatsiyalar
react-icons        # Ikonkalar (FiStar, FiUsers, FiClock, ...)
react-hot-toast    # Xabarlar
```

### Swiper ishlatish:
```javascript
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'

<Swiper modules={[Navigation, Pagination]} slidesPerView={3} spaceBetween={20}>
  {recommendedCourses.map(course => (
    <SwiperSlide key={course._id}>
      <CourseCard course={course} />
    </SwiperSlide>
  ))}
</Swiper>
```

---

## 🎨 Tailwind + DaisyUI

```jsx
{/* Kurs kartasi */}
<div className="card bg-base-200 hover:bg-base-300 transition cursor-pointer">
  <figure><img src={course.thumbnail} className="w-full h-48 object-cover" /></figure>
  <div className="card-body">
    <div className="flex justify-between">
      <span className="badge badge-primary text-xs">NEW</span>
      <span className="text-xs text-base-content/60">12 dars • 3 soat</span>
    </div>
    <h3 className="card-title text-sm">{course.title}</h3>
    <div className="flex items-center gap-2">
      <span className="text-warning">★★★★☆</span>
      <span className="text-sm text-base-content/60">4.8 (240)</span>
    </div>
    <div className="flex justify-between items-center mt-2">
      <span className="font-bold text-primary">450,000 so'm</span>
    </div>
  </div>
</div>

{/* Filter button */}
<button className="btn btn-sm btn-outline btn-primary">JavaScript</button>

{/* Accordion (kurs dasturi) */}
<div className="collapse collapse-arrow bg-base-200">
  <input type="checkbox" />
  <div className="collapse-title font-medium">1-Bo'lim: Kirish</div>
  <div className="collapse-content">
    <p>1-Dars: Python haqida • 15 daq</p>
  </div>
</div>
```

---

## 📊 Redux State

```javascript
import { useSelector } from 'react-redux'
import { selectCourses, selectCoursesLoading } from '@store/slices/courseSlice'

const courses = useSelector(selectCourses)
const loading = useSelector(selectCoursesLoading)
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] Kurslar ro'yxati yuklanadi
- [ ] Filter ishlaydi (kategoriya, daraja)
- [ ] Qidiruv ishlaydi
- [ ] Pagination ishlaydi
- [ ] Kurs detail sahifasi kurs ma'lumotlarini ko'rsatadi
- [ ] Accordion kurs dasturi ishlaydi
- [ ] Tavsiya etilgan kurslar carousel ishlaydi
- [ ] Loading skeleton ko'rsatiladi
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
| POST | `/api/subscriptions/verify-instagram` | ✅ | Instagram |
| POST | `/api/subscriptions/verify-telegram` | ✅ | Telegram |

---

### 3️⃣ COURSES — `/api/courses` (9 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/courses`** | ❌ | **Barcha kurslar (filter, pagination)** |
| **GET** | **`/api/courses/top`** | ❌ | **Top kurslar (viewCount)** |
| GET | `/api/courses/categories` | ❌ | Kategoriyalar ro'yxati |
| **GET** | **`/api/courses/:id`** | ❌ | **Bitta kurs to'liq ma'lumoti** |
| **GET** | **`/api/courses/:id/recommended`** | ❌ | **Tavsiya etilgan kurslar** |
| POST | `/api/courses/:id/rate` | ✅ | Baholash (1-5 ⭐) |
| POST | `/api/courses` | ✅ Admin | Yaratish |
| PUT | `/api/courses/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/courses/:id` | ✅ Admin | O'chirish |

**GET `/api/courses`** — Filter va pagination bilan
```json
// Query params: ?category=react&search=javascript&page=1&limit=12
// Mavjud kategoriyalar: html | css | javascript | typescript | react | nodejs | general

// Javob (200):
{
  "success": true,
  "data": {
    "count": 6,
    "courses": [
      {
        "_id": "65f100000000000000000005",
        "title": "React.js Frontend Development",
        "description": "React hooks, komponentlar...",
        "price": 349000,
        "category": "react",
        "rating": 4.8,
        "ratingCount": 45,
        "thumbnail": "https://...react-icon.svg",
        "viewCount": 3840,
        "instructor": { "username": "aidevix_admin", "jobTitle": "Frontend Developer" }
      }
    ]
  }
}
```

**GET `/api/courses/:id`** — Bitta kurs + videolar ro'yxati
```json
// Javob (200):
{
  "success": true,
  "data": {
    "course": {
      "_id": "65f1...", "title": "React.js Frontend Development",
      "description": "React hooks, komponentlar...",
      "price": 349000, "category": "react", "rating": 4.8,
      "instructor": { "_id": "...", "username": "aidevix_admin" },
      "videos": [
        { "_id": "65f2...", "title": "1-dars: React nima?", "order": 0, "duration": 900 },
        { "_id": "65f2...", "title": "2-dars: JSX sintaksisi", "order": 1, "duration": 1200 },
        { "_id": "65f2...", "title": "3-dars: useState Hook", "order": 2, "duration": 1500 }
      ],
      "isActive": true, "createdAt": "2026-01-01T00:00:00.000Z"
    }
  }
}
// ⚠️ videos — faqat sarlavha va davomiylik, telegram link YO'Q!
```

**GET `/api/courses/:id/recommended`** — Tavsiya etilgan (bir xil kategoriyadan)
```json
// Query: ?limit=4
// Javob (200):
{
  "success": true,
  "data": {
    "courses": [
      {
        "_id": "65f1...", "title": "React Advanced Patterns",
        "category": "react", "rating": 4.9, "price": 399000
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

### 6️⃣ RANKING — `/api/ranking` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/ranking/courses` | ❌ | Top kurslar |
| GET | `/api/ranking/users` | ❌ | Top foydalanuvchilar |
| GET | `/api/ranking/users/:userId/position` | ✅ | O'z pozitsiyasi |

---

### 7️⃣ LOYIHALAR — `/api/projects` (6 ta) ← CourseDetailPage uchun kerak

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/projects/course/:courseId`** | ❌ | **Kurs loyihalari ro'yxati** |
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
| GET | `/api/enrollments/:courseId/progress` | ✅ | Progress |
| POST | `/api/enrollments/:courseId/watch/:videoId` | ✅ | Video ko'rildi |

---

### 9️⃣–1️⃣6️⃣ QOLGAN ENDPOINTLAR

| Guruh | Endpoint | Soni |
|-------|----------|------|
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
