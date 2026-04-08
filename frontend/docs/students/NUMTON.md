# 🏆 NUMTON — Top Courses Ranking Page (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **eng ko'p ko'rilgan kurslar reytingini** ko'rsatuvchi sahifani yasaysan. Bu sahifani butunlay SEO ochiq holda, **Next.js App Router** va **TypeScript** vositasida qurishing lozim bo'ladi.

---

## 🌿 Branch
```
feature/numton-ranking
```

---

## ⚡ Nega Next.js + TypeScript?

### Next.js
Reytinglar, xuddi HomePage kabi odamlar tomonidan ko'p qidiriladi. Kurslaringiz ro'yxati SSR orqali rendering bo'ladi va botlar uni ishonchli indekslab oladi. Shuningdek `generateMetadata` senga dynamic seo ochib beradi.

### TypeScript
Top Courses dagi ma'lumotlar ro'yxat array bo'lib, har birlari `course` tiplarga ega bo'ladi, bu holatda `course.thumbnail` turidan to `course.studentsCount` larni bilib yozish ishingni tezlatadi va "Cannot read properties of undefined" degan react dagi klassik xatolik bo'lmaydi.

---

## 📁 Sening Fayllaring (Next.js)

```
frontend/
├── app/
│   └── top/
│       └── page.tsx              ← Sen yozasan
│
├── components/
│   └── ranking/
│       └── CourseRankCard.tsx     ← Sen yozasan
│
├── types/
│   └── ranking.ts                ← Typlarni saqlash
```

---

## 📝 Kod Misollari

### Turlar (`types/ranking.ts`):
```typescript
import { CourseShort } from './course';

export interface RankedCourse extends CourseShort {
  rank: number;
  studentsCount: number;
  duration: string;
}
```

### Top Courses Page (`app/top/page.tsx`):
```tsx
'use client'

import { useState } from 'react'
import CourseRankCard from '@/components/ranking/CourseRankCard'
import type { RankedCourse } from '@/types/ranking'

export default function TopCoursesPage() {
  const [category, setCategory] = useState<string | null>(null)
  
  // Bu yerda API dan Array<RankedCourse> olamiz va saqlaymiz...

  return (
    <div className="container mx-auto">
      {/* Tops */}
      <div className="flex gap-2">
        {['javascript', 'react', 'nodejs', 'python'].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className="btn btn-sm">
            {cat}
          </button>
        ))}
      </div>

       {/* Cards go here */}
    </div>
  )
}
```

## ✅ Tekshiruv Ro'yxati 
- [ ] Sahifa `app/top/page.tsx` papkasida ochilgan.
- [ ] Interface lar qo'shilgan, any ishlatilmagan.
- [ ] Server / Client komponentlar tushunib yozilgan (useState bo'lsa use client ishlatilgan).
