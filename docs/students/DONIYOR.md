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
