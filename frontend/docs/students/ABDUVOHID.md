# 🏠 ABDUVOHID — Home Page (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **bosh sahifani** yasaysan — bu platforma uchun eng muhim sahifa. Shuningdek **Navbar** va **Footer** komponentlarini ham tartibga solasan. Hammasi **Next.js App Router** va **TypeScript** da yoziladi.

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

## ⚡ Nega Next.js + TypeScript?

### Next.js afzalliklari (sening vazifangda):
Bosh sahifa — Google'da birinchi bo'lib chiqadigan sahifa! Agar u React CSR (Client-Side Rendering) bilan yozilsa, Google bot **bo'sh sahifani** ko'radi. Lekin Next.js SSR/SSG bilan:

| React (CSR) | Next.js (SSR/SSG) |
|-------------|-------------------|
| Google bot **bo'sh `<div id="root">`** ni ko'radi | Google **tayyor sahifani** ko'radi va **indekslaydi** |
| Kurslarni `useEffect` da yuklash kerak | **Server Component** da to'g'ridan-to'g'ri `fetch` — sahifa tayyor keladi |
| SEO uchun `react-helmet` kutubxona o'rnatish kerak | `metadata` export qilsang bas — Next.js **o'zi boshqaradi** |
| `public/index.html` da faqat bitta `<title>` | Har sahifa uchun **alohida title va description** |

### TypeScript afzalliklari (sening vazifangda):
| Muammo (JavaScript) | Yechim (TypeScript) |
|---------------------|---------------------|
| `course.pirce` — brauzerda `undefined` | IDE **qizil chiziq** chiqaradi |
| API dan kurs keladi — qaysi field bor? | `.` bosing — **hammasini ko'rasiz** |
| Props noto'g'ri yuborildi — ekran oq | Kompilatsiya **o'tmaydi** — xato topiladi |

---

## 📁 Sening Fayllaring (Next.js App Router)

```
frontend/
├── app/
│   ├── page.tsx                        ← Sen yozasan (Home Page = `/`)
│   ├── layout.tsx                      ← Root layout (allaqachon bor)
│   └── metadata.ts                     ← SEO meta taglar
│
├── components/
│   └── layout/
│       ├── Navbar.tsx                   ← Sen yaxshilasan
│       └── Footer.tsx                   ← Sen yaxshilasan
│
├── types/
│   └── course.ts                       ← Kurs turlari (pastda berilgan)
│
├── lib/
│   ├── api/
│   │   └── courseApi.ts                 ← Allaqachon yozilgan
│   └── hooks/
│       └── useCourses.ts                ← Allaqachon yozilgan
│
└── animations/
    ├── three/
    │   └── HeroScene.ts                 ← Qudrat yaxshilaydi
    └── gsap/
        ├── heroAnimations.ts            ← Allaqachon bor
        └── cardAnimations.ts            ← Allaqachon bor
```

> **Muhim:** Next.js App Router da `app/page.tsx` = Bosh sahifa (`/`).
> React dagi `pages/HomePage.jsx` o'rniga `app/page.tsx` yozasan.

---

## 🔑 TypeScript Turlari (Types)

```typescript
// types/course.ts

/** Kurs — ro'yxatdagi qisqa ma'lumot */
export interface CourseShort {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: CourseCategory;
  rating: number;
  ratingCount: number;
  viewCount: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  instructor: {
    username: string;
    email: string;
    jobTitle?: string;
    position?: string;
  };
}

/** Mavjud kategoriyalar */
export type CourseCategory =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'nodejs'
  | 'general';

/** Kurslar API javobi */
export interface CoursesResponse {
  success: boolean;
  data: {
    courses: CourseShort[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

/** Statistika raqamlari */
export interface PlatformStats {
  students: string;
  videos: string;
  mentors: string;
  rating: string;
}
```

---

## 🎨 Dizayn (Figma)

### Navbar
- Logo: "Aidevix" (chap), Links: Kurslar | Yo'nalishlar | Hamjamiyat | Blog
- O'ng: "Kirish" (ghost) + "Ro'yxatdan o'tish" (primary) yoki Avatar

### Hero Section
- Dark space background, katta sarlavha, Two CTA buttons, Three.js animatsiya
- Statistika: **15k+ O'quvchilar** | **120+ Video darslar** | **50+ Mentorlar** | **4.9 Reyting**

### Featured Courses + Stats/CTA + Footer

---

## 📝 Kod Misollari (Next.js + TypeScript)

### SEO Metadata (`app/page.tsx` tepasi yoki `app/layout.tsx`):
```tsx
// Next.js da SEO uchun maxsus export:
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aidevix — Kelajak kasbini O\'zbek tilida o\'rganing',
  description: 'Dasturlashni o\'rganishning eng oddiy yo\'li. React, JavaScript, Python va boshqa kurslar.',
  openGraph: {
    title: 'Aidevix — Online Ta\'lim Platformasi',
    description: 'O\'zbek tilida dasturlash kurslari',
    images: ['/og-image.jpg'],
  },
}
// Bu metadata Google'ga va ijtimoiy tarmoqlarda link ulashganda ko'rinadi.
// React'da react-helmet kerak edi — Next.js da hech narsa o'rnatish SHART EMAS.
```

### Bosh sahifa (`app/page.tsx`):
```tsx
// Bu Server Component — 'use client' YO'Q!
// Server'da render bo'ladi — SEO uchun juda yaxshi.
import type { CoursesResponse, CourseShort } from '@/types/course'
import HeroSection from '@/components/home/HeroSection'
import FeaturedCourses from '@/components/home/FeaturedCourses'
import StatsSection from '@/components/home/StatsSection'

// Server Component'da to'g'ridan-to'g'ri fetch:
async function getTopCourses(): Promise<CourseShort[]> {
  const res = await fetch(
    'https://aidevix-backend-production.up.railway.app/api/courses/top?limit=8',
    { next: { revalidate: 3600 } }   // 1 soat cache (SEO uchun tez)
  )
  const data: CoursesResponse = await res.json()
  return data.data.courses
}

export default async function HomePage() {
  // Server'da fetch — brauzer hech narsa yuklamaydi!
  const courses: CourseShort[] = await getTopCourses()

  return (
    <main>
      <HeroSection />
      <FeaturedCourses courses={courses} />
      <StatsSection />
    </main>
  )
}
```

> **Muhim farqlar:**
> - React: `useEffect(() => fetch(...))` — brauzerda yuklanadi
> - Next.js: `async function` + `await fetch(...)` — **serverda tayyor** bo'lib keladi
> - `{ next: { revalidate: 3600 } }` — ISR (Incremental Static Regeneration), 1 soatda bir marta yangilanadi

### Navbar (`components/layout/Navbar.tsx`):
```tsx
'use client'   // ← Navbar interaktiv — client component

import { FC } from 'react'
import Link from 'next/link'                  // react-router Link EMAS!
import { usePathname } from 'next/navigation'  // hozirgi sahifani bilish uchun

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Kurslar', href: '/courses' },
  { label: 'Yo\'nalishlar', href: '/paths' },
  { label: 'Hamjamiyat', href: '/community' },
  { label: 'Blog', href: '/blog' },
]

const Navbar: FC = () => {
  const pathname = usePathname()   // useLocation() EMAS!

  return (
    <nav className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-40">
      <div className="navbar-start">
        <Link href="/" className="text-xl font-black text-primary">
          Aidevix
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2">
          {NAV_LINKS.map((link: NavLink) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <Link href="/login" className="btn btn-ghost btn-sm">Kirish</Link>
        <Link href="/register" className="btn btn-primary btn-sm">
          Ro'yxatdan o'tish
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
```

> **Muhim farqlar (React vs Next.js):**
> - `<Link to="/login">` → `<Link href="/login">`
> - `useLocation()` → `usePathname()` (`next/navigation`)
> - `useNavigate()` → `useRouter()` (`next/navigation`)
> - `import { Link } from 'react-router-dom'` → `import Link from 'next/link'`

---

## 🛠️ Texnologiyalar

```bash
# Next.js da o'rnatilgan:
next                 # Framework (SSR, routing, bundler, SEO)
typescript           # Tip xavfsizlik
gsap                 # Hero animatsiyalar
three                # 3D sahna (Qudrat boshqaradi)
swiper               # Kurs carousel
framer-motion        # Seksiyalar kirish animatsiyasi
react-icons          # Ikonkalar

# O'CHIRILADIGAN:
# react-router-dom   ← Next.js da kerak emas
# react-helmet       ← Next.js da metadata export bor
```

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `Aidevix`
- **Password:** `sunnatbee`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/courses/top` | GET | ❌ Yo'q | Tavsiya etilgan kurslar |
| `/api/courses?limit=8` | GET | ❌ Yo'q | Yangi kurslar |
| `/health` | GET | ❌ Yo'q | Server holati |

> **Muhim:** Sening endpointlaring hammasi **public** (token kerak EMAS). Shuning uchun ularni to'g'ridan-to'g'ri **Server Component** da `fetch` qilasan — brauzer hech narsa yuklamaydi, sahifa serverda tayyor bo'lib keladi!

---

## ✅ Tekshiruv Ro'yxati
- [ ] Hero section to'g'ri ko'rsatiladi
- [ ] Navbar responsive (mobil va desktop)
- [ ] Login holati: Avatar ko'rsatiladi (logout dropdown)
- [ ] Kurslar carousel yuklanadi (**Server Component** dan)
- [ ] Statistika raqamlari ko'rsatiladi
- [ ] Footer barcha linklar bilan
- [ ] `metadata` export qilingan (SEO)
- [ ] Barcha fayl nomlari `.tsx` / `.ts` (`.jsx` EMAS)
- [ ] Har qanday `any` tip ishlatilmagan
- [ ] `'use client'` faqat interaktiv komponentlarda
- [ ] Dizayn Figma bilan mos keladi
- [ ] `main` branchga kod yozilmagan
