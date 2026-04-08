# 🚫 BOISXON — 404 Error Page (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **404 xato sahifasini** yasaysan. Next.js da topilmagan sahifalar uchun o'ziga xos API va maxsus fayl borki, uni men senga ko'rsataman.

---

## 🌿 Branch
```
feature/boisxon-404
```

---

## ⚡ Nega Next.js + TypeScript?

### Next.js dagi `not-found.tsx` fayli:
React Router da siz `<Route path="*" />` qilib yozishingiz kerak edi. Next.js da esa, siz shunchaki `app/not-found.tsx` deb bitta fayl yaratsangiz bo'ldi, barchasini Server o'zi tushunib, SEO da index qilmay, to'g'ri ishlashini ta'minlaydi! Va bunda Server hech qanday resurslarni isrof qilmaydi.

### TypeScript:
Animatsiyalar va propslar yozishda aniq `interface` turlarini ishlatasiz.

---

## 📁 Sening Fayllaring (Next.js)

```
frontend/
└── app/
    └── not-found.tsx        ← Sen yozasan (faqat shu fayl!)
```

*(Diqqat! `app/not-found.tsx` Next.js dagi to'g'ri kelmaydigan routerlar uchun avtomatik ishlaydigan nomlangan fayl!)*

---

## 📝 Kod Misoli

### NotFoundPage (`app/not-found.tsx`):
```tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">

        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
           <div className="bg-base-300 rounded-xl p-6">
             <code className="text-error">&lt;Route not Found /&gt;</code>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="text-right">
          <p className="text-[12rem] font-black opacity-10 leading-none">404</p>
          <h1 className="text-4xl font-bold">Sahifa topilmadi</h1>
          <div className="flex gap-4 mt-8 justify-end">
            <Link href="/" className="btn btn-primary">🏠 Bosh sahifa</Link>
            <button onClick={() => router.back()} className="btn btn-outline">← Ortga</button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
```

## ✅ Tekshiruv Ro'yxati 
- [ ] Foydalanilgan sahifa maxsus `not-found.tsx` o'laroq app routerichida joylashtirilgan.
- [ ] Barcha link larda `<Link href="/" />` NextJS tegidan foydalanilgan.
- [ ] `.tsx` kengaytmasidan foydalanilgan.
