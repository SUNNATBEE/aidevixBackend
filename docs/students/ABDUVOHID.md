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
