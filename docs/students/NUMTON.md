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
