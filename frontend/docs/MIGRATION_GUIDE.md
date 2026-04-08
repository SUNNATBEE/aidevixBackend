# 🚀 Aidevix Frontend: Next.js + TypeScript Migratsiya Qo'llanmasi

Ushbu qo'llanma **Vite (React)** dan **Next.js 14 (App Router)** ga o'tishimiz munosabati bilan barcha o'quvchilar uchun qo'llanma bo'lib xizmat qiladi. `git pull origin main` qilinganidan keyin quyidagi qadamlarni bajarish shart.

---

## 🛠 1. Birinchi Qadamlar (Setup)

Loyiha kodi yangilanganidan keyin terminalda quyidagilarni bajaring:

### 📥 Dependency'larni o'rnatish
Eski `node_modules` ni o'chirib, yangilarini o'rnatish tavsiya etiladi:
```bash
# Windows uchun
rd /s /q node_modules
npm install

# Mac/Linux uchun
rm -rf node_modules
npm install
```

### 🔐 Environment Variables (Muhit O'zgaruvchilari)
Next.js da brauzerda ishlaydigan o'zgaruvchilar **`NEXT_PUBLIC_`** prefiksi bilan boshlanishi shart. `.env` yoki `.env.local` faylingizni quyidagicha yangilang:

```env
NEXT_PUBLIC_API_BASE_URL=https://aidevix-backend-production.up.railway.app/api
NEXT_PUBLIC_TELEGRAM_BOT=https://t.me/aidevix_bot
NEXT_PUBLIC_TELEGRAM_CHANNEL=https://t.me/aidevix
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/aidevix
```

### 🏃‍♂️ Loyihani ishga tushirish
Next.js da ishga tushirish buyrug'i o'zgardi:
```bash
npm run dev
```
Endi loyiha odatda **`http://localhost:3000`** portida ochiladi.

---

## 🆕 2. Yangi Arxitektura (App Router)

### 📁 Fayllar Strukturasi
Eski `src/pages` endi ishlatilmaydi! Barcha sahifalar **`src/app`** papkasida joylashgan bo'lishi kerak.

- `src/app/path/page.tsx` → `http://localhost:3000/path` sahifasi bo'ladi.
- `src/app/courses/[id]/page.tsx` → Dinamik dars sahifasi (id orqali).

### 🔄 Routing (Yo'naltirish)
`react-router-dom` o'rniga Next.js ning ichki kutubxonasi ishlatiladi:

| Vite (Eski) | Next.js (Yangi) |
| :--- | :--- |
| `import { Link } from 'react-router-dom'` | `import Link from 'next/link'` |
| `<Link to="/courses">` | `<Link href="/courses">` |
| `import { useNavigate } from 'react-router-dom'` | `import { useRouter } from 'next/navigation'` |
| `const navigate = useNavigate()` | `const router = useRouter()` |
| `navigate('/login')` | `router.push('/login')` |
| `import { useParams } from 'react-router-dom'` | `import { useParams } from 'next/navigation'` |

---

## 🔷 3. TypeScript va 'use client'

### 'use client' Direktivasi
Next.js da barcha komponentlar default holatda **Server Component**. Agar sizda `useState`, `useEffect` yoki `onClick` kabi interaktivlik bo'lsa, faylning eng tepasiga quyidagicha yozishingiz SHART:
```tsx
'use client';

import { useState } from 'react';
// ... qolgan kodlar
```

### TypeScript Turlari
Loyiha endi to'liq TypeScript da. JavaScript (`.jsx`) fayllarni `.tsx` ga o'zgartiring. Agar xatoliklar ko'p bo'lsa, vaqtincha `any` ishlating, lekin keyinchalik aniq tipga o'ting:

```tsx
interface Course {
  _id: string;
  title: string;
  price: number;
}

export default function CourseList({ courses }: { courses: Course[] }) {
  // ...
}
```

---

## 🏠 4. Global Komponentlar
- **Navbar** va **Footer** endi `src/app/layout.tsx` da joylashgan. Ularni har bir sahifada qayta import qilish shart emas.
- Loyiha asosiy stilini `src/styles/globals.css` da sozlashingiz mumkin.

---

## 🆘 Muammo bo'lsa?
1. `.next` papkasini o'chirib, `npm run dev` ni qayta bosing.
2. `tsconfig.json` yoki `next.config.mjs` fayllariga tegmang, ular avtomatik sozlangan.
3. Import yo'llarida `@components`, `@hooks`, `@utils` aliaslaridan foydalaning.

🚀 **Omad! Kelajakni biz bilan kodlang.**
