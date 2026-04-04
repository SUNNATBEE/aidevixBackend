# 📚 DONIYOR — All Courses Page & Course Detail Page (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **barcha kurslar sahifasi** va **kurs tafsilotlari sahifasini** **Next.js App Router** va **TypeScript** yordamida yasaysan.

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

## ⚡ Nega Next.js + TypeScript?

### Next.js afzalliklari (sening vazifangda):
Kurslar sahifasi va kurs tafsilot sahifasi Google'da **eng ko'p qidiriladigan** sahifalar. Agar React CSR da yozilsa, Google bot ularni ko'ra olmaydi. Next.js da esa:

| React (CSR) | Next.js (SSR/SSG) |
|-------------|-------------------|
| Google "React kurslari" deb qidirsa — **o'zing chiqmaysan** | **Har kurs alohida sahifa** — Google indekslaydi |
| `useParams()` bilan `:id` olish + `useEffect` | `app/courses/[id]/page.tsx` — **dinamik routing** built-in |
| URL: `/courses?id=123` (yomon SEO) | URL: `/courses/65f1a2b3...` (yaxshi SEO) |
| Sahifa ochilganda 1-2 soniya **loading spinner** | Server tayyor HTML yuboradi — **darhol ko'rinadi** |

### TypeScript afzalliklari (sening vazifangda):
| Muammo (JavaScript) | Yechim (TypeScript) |
|---------------------|---------------------|
| `course.pirce` → `undefined` (ekranda "NaN so'm") | IDE **yozish paytida** xato ko'rsatadi |
| Backend qaysi field qaytardi? Console.log qilish kerak | Tip bor — `.` bosing, **hammasini ko'rasiz** |
| `videos.map(v => v.duraton)` — typo | TypeScript **kompilyatsiya qilmaydi** — xato topiladi |

---

## 📁 Sening Fayllaring (Next.js App Router)

```
frontend/
├── app/
│   ├── courses/
│   │   ├── page.tsx                     ← Sen yozasan (Barcha kurslar = `/courses`)
│   │   └── [id]/
│   │       └── page.tsx                 ← Sen yozasan (Kurs tafsiloti = `/courses/:id`)
│   └── layout.tsx                       ← Root layout (allaqachon bor)
│
├── components/
│   └── courses/
│       ├── CourseCard.tsx                ← Allaqachon bor, o'zgartirsa bo'ladi
│       ├── CourseFilter.tsx             ← Allaqachon bor, ishlatasan
│       ├── CourseGrid.tsx               ← Allaqachon bor, ishlatasan
│       └── CourseSkeleton.tsx           ← Allaqachon bor, ishlatasan
│
├── types/
│   └── course.ts                        ← Tayyor turlar (pastda berilgan)
│
├── lib/
│   ├── api/
│   │   └── courseApi.ts                  ← Allaqachon yozilgan
│   └── hooks/
│       └── useCourses.ts                 ← Allaqachon yozilgan
│
└── store/slices/
    └── courseSlice.ts                     ← Allaqachon yozilgan
```

> **Diqqat!** Next.js da **dinamik routing** papka nomi bilan ishlaydi:
> `app/courses/[id]/page.tsx` → brauzerda `/courses/65f1a2b3c4d5e6f7a8b9c0d2`
> React dagi `<Route path="/courses/:id">` EMAS — papka nomi `[id]` sifatida yoziladi.

---

## 🔑 TypeScript Turlari (Types)

```typescript
// types/course.ts

/** Kurslar ro'yxati uchun (qisqa) */
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
  level: CourseLevel;
  isFree: boolean;
  instructor: {
    username: string;
    email: string;
    jobTitle?: string;
  };
}

/** Kurs to'liq ma'lumoti (tafsilot sahifasi uchun) */
export interface CourseFull extends CourseShort {
  videos: VideoShort[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  instructor: {
    _id: string;
    username: string;
    email: string;
    jobTitle?: string;
    position?: string;
  };
}

/** Video qisqa ma'lumoti (kurs ichidagi ro'yxat uchun) */
export interface VideoShort {
  _id: string;
  title: string;
  description?: string;
  order: number;
  duration: number;       // soniyalarda (masalan: 900 = 15 daqiqa)
  thumbnail?: string;
}

/** Mavjud kategoriyalar */
export type CourseCategory =
  | 'html' | 'css' | 'javascript' | 'typescript'
  | 'react' | 'nodejs' | 'general';

/** Daraja turlari */
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

/** Kurslar API javobi (pagination bilan) */
export interface CoursesResponse {
  success: boolean;
  data: {
    courses: CourseShort[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

/** Bitta kurs API javobi */
export interface CourseDetailResponse {
  success: boolean;
  data: {
    course: CourseFull;
  };
}

/** Filter parametrlari */
export interface CourseFilters {
  category?: CourseCategory | 'all';
  search?: string;
  level?: CourseLevel;
  sort?: 'newest' | 'oldest' | 'popular' | 'rating' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
  isFree?: boolean;
}
```

---

## 🎨 Dizayn (Figma)

### 1-Sahifa: CoursesPage (`/courses`)
- **Sarlavha:** "Barcha Kurslar" + tavsif
- **Chapda:** Filter panel (qidiruv, kategoriya, daraja, reyting)
- **O'ngda:** Kurslar grid (3 ustun)
- **Pagination:** sahifa raqamlari pastda

### 2-Sahifa: CourseDetailPage (`/courses/:id`)
- Breadcrumb, Kurs sarlavhasi + tavsif, Instruktr, Meta (rating, o'quvchilar)
- Narx + "Kursni sotib olish" + "Saqlash" tugmalari
- Kurs Dasturi (accordion)
- "Tavsiya etilgan kurslar" carousel

---

## 📝 Kod Misollari (Next.js + TypeScript)

### Barcha kurslar sahifasi (`app/courses/page.tsx`):
```tsx
'use client'   // Filter va qidiruv interaktiv — client component

import { useState, useEffect } from 'react'
import type { CourseShort, CourseFilters, CoursesResponse } from '@/types/course'
import CourseGrid from '@/components/courses/CourseGrid'
import CourseFilter from '@/components/courses/CourseFilter'
import CourseSkeleton from '@/components/courses/CourseSkeleton'

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseShort[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<CourseFilters>({
    category: 'all',
    page: 1,
    limit: 12,
    sort: 'newest',
  })

  useEffect(() => {
    const fetchCourses = async (): Promise<void> => {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.category && filters.category !== 'all') params.set('category', filters.category)
      if (filters.search) params.set('search', filters.search)
      if (filters.page) params.set('page', String(filters.page))
      if (filters.limit) params.set('limit', String(filters.limit))

      const res = await fetch(`/api/courses?${params.toString()}`)
      const data: CoursesResponse = await res.json()
      setCourses(data.data.courses)
      setLoading(false)
    }
    fetchCourses()
  }, [filters])

  return (
    <main className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Barcha Kurslar</h1>
      <p className="text-base-content/60 mb-8">
        Dasturlashning har tomonini o'zbek tilida o'rganing
      </p>

      <div className="flex gap-8">
        <aside className="w-72 shrink-0 hidden lg:block">
          <CourseFilter
            filters={filters}
            onChange={(newFilters: CourseFilters) => setFilters(newFilters)}
          />
        </aside>

        <section className="flex-1">
          {loading ? (
            <CourseSkeleton count={6} />
          ) : (
            <CourseGrid courses={courses} />
          )}
        </section>
      </div>
    </main>
  )
}
```

### Kurs tafsilot sahifasi (`app/courses/[id]/page.tsx`):
```tsx
// Bu Server Component — SEO uchun juda muhim!
// 'use client' YO'Q — server'da render bo'ladi
import type { Metadata } from 'next'
import type { CourseFull, CourseDetailResponse, VideoShort } from '@/types/course'
import Link from 'next/link'

// Dinamik params turi
interface PageProps {
  params: Promise<{ id: string }>;     // Next.js 15+ da params Promise qaytaradi
}

// Server'da kurs olish
async function getCourse(id: string): Promise<CourseFull> {
  const res = await fetch(
    `https://aidevix-backend-production.up.railway.app/api/courses/${id}`,
    { next: { revalidate: 600 } }      // 10 daqiqa cache
  )
  const data: CourseDetailResponse = await res.json()
  return data.data.course
}

// Dinamik SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const course: CourseFull = await getCourse(id)
  return {
    title: `${course.title} | Aidevix Kurslari`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.thumbnail],
    },
  }
}

// Sahifa
export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params
  const course: CourseFull = await getCourse(id)

  // Video davomiyligini formatlash
  const formatDuration = (seconds: number): string => {
    const min: number = Math.floor(seconds / 60)
    return `${min} daq`
  }

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li><Link href="/">Bosh sahifa</Link></li>
          <li><Link href="/courses">Barcha kurslar</Link></li>
          <li className="text-primary">{course.title}</li>
        </ul>
      </div>

      <div className="flex gap-8">
        {/* Asosiy kontent */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-base-content/70 mt-2">{course.description}</p>

          {/* Kurs dasturi (Accordion) */}
          <h2 className="text-xl font-bold mt-8 mb-4">📖 Kurs Dasturi</h2>
          {course.videos.map((video: VideoShort) => (
            <div key={video._id} className="collapse collapse-arrow bg-base-200 mb-2">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                {video.order + 1}-Dars: {video.title}
              </div>
              <div className="collapse-content">
                <p className="text-sm text-base-content/60">
                  Davomiylik: {formatDuration(video.duration)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Narx panel */}
        <aside className="w-80 shrink-0">
          <div className="card bg-base-200 sticky top-24">
            <div className="card-body">
              <p className="text-3xl font-black text-primary">
                {course.isFree ? 'Bepul' : `${course.price.toLocaleString()} so'm`}
              </p>
              <button className="btn btn-primary btn-lg w-full mt-4">
                Kursni sotib olish
              </button>
              <button className="btn btn-outline btn-sm w-full mt-2">
                ❤️ Saqlash
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
```

> **Diqqat!** `generateMetadata` funksiyasi faqat Server Component'da ishlaydi.
> Har kurs uchun alohida `<title>` va `<meta>` tag chiqadi — Google buni juda yaxshi ko'radi.
> React'da buning uchun `react-helmet` kerak edi va u ham SSR da ishlamasdi.

---

## 🛠️ Texnologiyalar

```bash
# Next.js da o'rnatilgan:
next                 # Framework
typescript           # Tip xavfsizlik
swiper               # Tavsiya etilgan kurslar carousel
framer-motion        # Animatsiyalar
react-icons          # FiStar, FiUsers, FiClock, ...
react-hot-toast      # Xabarlar

# O'CHIRILADIGAN:
# react-router-dom   ← Next.js da kerak emas
# react-helmet       ← Next.js metadata export bor
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
| `/api/courses` | GET | ❌ Yo'q | Barcha kurslar (filter, pagination) |
| `/api/courses/:id` | GET | ❌ Yo'q | Bitta kurs tafsiloti |
| `/api/courses/top` | GET | ❌ Yo'q | Top/tavsiya etilgan kurslar |
| `/api/courses/:id/recommended` | GET | ❌ Yo'q | Tavsiya etilgan (bir xil kategoriya) |
| `/api/courses/categories` | GET | ❌ Yo'q | Kategoriyalar |

> **Muhim:** Sening endpointlaring hammasi **public** (token kerak EMAS).
> CourseDetail sahifasini **Server Component** sifatida yozasan — Google **to'liq o'qiy oladi**.

---

## ✅ Tekshiruv Ro'yxati
- [ ] Kurslar ro'yxati yuklanadi
- [ ] Filter ishlaydi (kategoriya, daraja)
- [ ] Qidiruv ishlaydi
- [ ] Pagination ishlaydi
- [ ] Kurs detail sahifasi kurs ma'lumotlarini ko'rsatadi
- [ ] `generateMetadata` — har kurs uchun alohida SEO
- [ ] Accordion kurs dasturi ishlaydi
- [ ] Tavsiya etilgan kurslar carousel ishlaydi
- [ ] Loading skeleton ko'rsatiladi
- [ ] Barcha fayl nomlari `.tsx` / `.ts`
- [ ] Har qanday `any` tip ishlatilmagan
- [ ] Server/Client Component to'g'ri ajratilgan
- [ ] Dizayn Figma bilan mos keladi
- [ ] `main` branchga kod yozilmagan
