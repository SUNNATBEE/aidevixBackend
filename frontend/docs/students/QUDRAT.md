# ✨ QUDRAT — Loading Screen & 3D (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **sahifa ochilganda ko'rsatiladigan 3D loading animatsiyasini** va **barcha sahifalar uchun skeleton komponentlarini** yasaysan. Next.js dagi Loading.js avtomatizatsiyasini yaxshi o'rganamiz!

---

## 🌿 Branch
```
feature/qudrat-loading
```

---

## ⚡ Nega Next.js + TypeScript?

### Next.js `loading.tsx`:
React da Loader ni Redux holatiga qarab o'zgartirar edik, lekin Next.js o'zining "loading.tsx" nomli qoidali fayliga ega — agar ma'lumotlar serverdan kelayotganda kutiladigan bo'lsa, avtomatik ravishda uning ichidagi Skeleton komponentni ochadi! Suspension ishlashlari 20 barobar ishonchli bo'ladi.

### TypeScript:
3D Three.js kodlari ko'plab Math yechimlari bilan bo'ladi va Three.js tiplari sizga propslar nima ekanini tez beradi, ayniqsa `<meshStandardMaterial/>` singari hududlarda.

---

## 📁 Sening Fayllaring (Next.js)

```
frontend/
├── app/
│   ├── loading.tsx                  ← Sen yozasan (Next.js avto-loaderi)
│   └── global-loader.tsx            ← (Three.js katta loader)
│
├── components/
│   └── loading/
│       ├── LoadingScreen.tsx        ← Sen yozasan (asosiy 3D loader)
│       └── SkeletonCard.tsx         ← Sen yozasan (content skeleton)
│
└── animations/
    └── three/
```

---

## 📝 Kod Misoli

### Skeleton (`components/loading/SkeletonCard.tsx`):
```tsx
import { FC } from 'react'

interface SkeletonProps {
  type: 'course' | 'user' | 'video' | 'profile';
}

const SkeletonCard: FC<SkeletonProps> = ({ type }) => {
  return (
    <div className="card bg-base-200 animate-pulse">
      <div className="h-44 bg-base-300 rounded-t-2xl" />
      <div className="card-body">
         <div className="h-4 bg-base-300 rounded w-1/2" />
      </div>
    </div>
  )
}

export default SkeletonCard
```

### Next.js avtomatik loader (`app/loading.tsx`):
```tsx
// Har qanday Async Server Component yuklanayotganda o'zi ko'rinadi
import SkeletonCard from '@/components/loading/SkeletonCard'

export default function Loading() {
  return (
    <div className="container mx-auto grid grid-cols-3 gap-4 mt-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <SkeletonCard key={i} type="course" />
      ))}
    </div>
  )
}
```

## ✅ Tekshiruv Ro'yxati 
- [ ] TypeScript da interfacelar yaratilgan.
- [ ] Global initial loading va page routing loading tushunilgan (Next.js kabi).
- [ ] Barcha JS kodlar TSX ga o'tkazilgan!
