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
