# ✨ QUDRAT — Loading Screen + 3D Animation + Skeleton

## 📋 Vazifa Qisqacha
Sen **sahifa ochilganda ko'rsatiladigan 3D loading animatsiyasini** va **barcha sahifalar uchun skeleton komponentlarini** yasaysan. Bu eng kreativ vazifa!

---

## 🌿 Branch
```
feature/qudrat-loading
```
> ⚠️ **DIQQAT:** Faqat `feature/qudrat-loading` branchida ishlash!

```bash
git checkout -b feature/qudrat-loading
git push origin feature/qudrat-loading
```

---

## 📁 Sening Fayllaring

```
frontend/src/
├── components/
│   └── loading/
│       ├── LoadingScreen.jsx        ← Sen yozasan (asosiy 3D loader)
│       ├── PageLoader.jsx           ← Sen yozasan (Suspense fallback)
│       └── SkeletonCard.jsx         ← Sen yozasan (content skeleton)
│
└── animations/
    ├── three/
    │   └── HeroScene.js             ← Sen yaxshilaysan (HomePage Three.js sahna)
    └── gsap/
        ├── heroAnimations.js        ← Sen yaxshilaysan
        └── pageTransitions.js       ← Sen yaxshilaysan
```

---

## 🎨 Dizayn va Texnik Tavsif

### 1. LoadingScreen.jsx — Birinchi Ochilish

**G'oya:** Sahifa birinchi marta ochilganda 2-3 soniya ko'rsatiladi.

**Three.js Sahna:**
```
- Qorong'i kosmik background (deep space navy)
- Suzib yuruvchi geometrik shakllar:
  - Kublar (wireframe, neon blue)
  - Sferalar (gradient)
  - Oktaedra (rotating)
- Aidevix logosi — 3D harflar yoki particles bilan yig'iladi
- Neon glow effekti (bloom postprocessing)
```

**Loading bar:**
```
[████████████─────────] 75%
     Loading Aidevix...
```

### 2. PageLoader.jsx — Sahifalar O'rtasida
```
- Oddiyroq loader (to'liq ekran shart emas)
- DaisyUI loading-spinner bilan
- Aidevix logosi + spinner
```

### 3. SkeletonCard.jsx — Kontent Yuklanayotganda
```
Turlar:
- type="course"   → kurs kartasi skeleton
- type="user"     → foydalanuvchi kartasi skeleton
- type="video"    → video kartasi skeleton
- type="profile"  → profil sahifasi skeleton
```

---

## 🔌 API Endpointlar
Skeleton va Loading uchun backend API kerak emas.
Lekin `App.jsx` da `checkAuthStatus` bo'lguncha LoadingScreen ko'rsatiladi:

```javascript
import { useSelector } from 'react-redux'
import { selectAuthLoading } from '@store/slices/authSlice'
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
three                    # Three.js
@react-three/fiber       # React uchun Three.js
@react-three/drei        # Yordam kutubxonasi (OrbitControls, Stars, Float, ...)
gsap                     # Animatsiya
framer-motion            # Exit animatsiyasi
```

---

## 💻 Kod Misollari

### LoadingScreen.jsx:
```javascript
import { Canvas } from '@react-three/fiber'
import { Stars, Float, OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// Three.js 3D Sahna
const Scene = () => (
  <>
    {/* Yulduzli background */}
    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

    {/* Suzuvchi geometrik shakllar */}
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <octahedronGeometry args={[1.5]} />
        <meshStandardMaterial color="#6366f1" wireframe />
      </mesh>
    </Float>

    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.5, 0.5]}>
      <mesh position={[3, 1, -2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8b5cf6" wireframe />
      </mesh>
    </Float>

    {/* Ambient va point lights */}
    <ambientLight intensity={0.3} />
    <pointLight position={[10, 10, 10]} color="#6366f1" intensity={1} />
  </>
)

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setDone(true)
            onComplete?.()
          }, 500)
          return 100
        }
        return p + 2
      })
    }, 60)
    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-[#0A0E1A]"
        >
          {/* Three.js Canvas */}
          <Canvas className="absolute inset-0">
            <Scene />
          </Canvas>

          {/* Overlay content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black text-white mb-8"
            >
              Ai<span className="text-indigo-400">devix</span>
            </motion.h1>

            {/* Progress bar */}
            <div className="w-64">
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <motion.div
                  className="bg-indigo-500 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <p className="text-center text-white/40 text-xs mt-2">{progress}%</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
```

### SkeletonCard.jsx:
```javascript
// type="course" skeleton
const CourseSkeleton = () => (
  <div className="card bg-base-200 animate-pulse">
    <div className="h-44 bg-base-300 rounded-t-2xl" />
    <div className="card-body gap-3">
      <div className="flex justify-between">
        <div className="h-4 w-12 bg-base-300 rounded" />
        <div className="h-4 w-24 bg-base-300 rounded" />
      </div>
      <div className="h-5 bg-base-300 rounded w-3/4" />
      <div className="h-4 bg-base-300 rounded w-1/2" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-4 w-16 bg-base-300 rounded" />
        <div className="h-6 w-20 bg-base-300 rounded" />
      </div>
    </div>
  </div>
)
```

---

## 🚀 App.jsx da Ishlatish

```javascript
// App.jsx da LoadingScreen qo'shish:
import LoadingScreen from '@components/loading/LoadingScreen'
import { useState } from 'react'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      <AppRouter />
    </>
  )
}
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] LoadingScreen sahifa birinchi ochilganda ko'rsatiladi
- [ ] Three.js sahna ishlaydi (shakllar suzib yuradi)
- [ ] Progress bar 0→100% to'ldiriladi
- [ ] Smooth exit animatsiya (fade out)
- [ ] PageLoader Suspense da ishlaydi
- [ ] SkeletonCard type="course" ishlaydi
- [ ] SkeletonCard type="user" ishlaydi
- [ ] SkeletonCard count={6} → 6 ta skeleton ko'rsatiladi
- [ ] Performans yaxshi (60 FPS)

---

## 🌐 BACKEND API — TO'LIQ QO'LLANMA

**Backend:** Node.js + Express.js | **Port:** 5000 | **Database:** MongoDB Atlas
**Jami endpointlar: ~75 ta**

> **Loading sahifasi va Skeleton uchun backend API to'g'ridan-to'g'ri kerak emas.**
> Lekin jamoa bilan ishlashda quyidagi ma'lumotlar zarur bo'ladi.

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

**Swagger'da ishlash:**
1. `http://localhost:5000/api-docs` ni oching
2. Istalgan endpoint'ni bosing → "Try it out" → "Execute"
3. Token kerak bo'lsa: yuqori o'ngdagi **"Authorize 🔓"** tugmasi → `Bearer <token>`

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

**Auth holati — sening koding uchun:**
```javascript
// App.jsx da checkAuthStatus bo'lguncha LoadingScreen ko'rsat
import { useSelector } from 'react-redux'
import { selectAuthLoading } from '@store/slices/authSlice'

// authLoading true bo'lsa → LoadingScreen
// authLoading false bo'lsa → AppRouter
```

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

**SkeletonCard qachon ko'rsatiladi:**
```javascript
// Kurslar yuklanganda skeleton:
const CoursesPage = () => {
  const { courses, loading } = useCourses()

  if (loading) return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} type="course" />
      ))}
    </div>
  )

  return courses.map(course => <CourseCard key={course._id} course={course} />)
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

### ⚡ Loading oqimi — App boshlanganda nima bo'ladi

```
1. App.jsx renders → LoadingScreen ko'rsatiladi (3D animatsiya)
2. authSlice.checkAuthStatus() dispatch bo'ladi
3. GET /api/auth/me → token bor/yo'q tekshiriladi
4. authLoading → false bo'ladi
5. LoadingScreen.onComplete() → AppRouter ko'rsatiladi

Kurslar sahifasida:
1. CoursesPage → GET /api/courses (loading: true)
2. SkeletonCard × 6 ko'rsatiladi
3. loading: false → kurs kartalar ko'rsatiladi
```

### 🎨 SkeletonCard — barcha sahifalar uchun

```javascript
// Qaysi sahifada qaysi skeleton:
<SkeletonCard type="course" />   // CoursesPage, HomePage
<SkeletonCard type="user" />     // LeaderboardPage
<SkeletonCard type="video" />    // VideoPage
<SkeletonCard type="profile" />  // ProfilePage

// Miqdor bilan:
{loading && [...Array(count)].map((_, i) => (
  <SkeletonCard key={i} type={type} />
))}
```
