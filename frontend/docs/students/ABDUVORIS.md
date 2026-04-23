# 🎬 ABDUVORIS — Video Lesson Pages (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **2 ta Video Lesson sahifasini** yasaysan. Hozirgi React kodidan farqli ravishda, sen ularni **Next.js App Router** va **TypeScript** da yasashing kerak bo'ladi.
1. **VideoPage** — Bunny.net video player + Q&A + Materiallar
2. **VideoPlaygroundPage** — Video + Code Editor + Quiz

---

## 🌿 Branch
```
feature/abduvoris-lessons
```
> ⚠️ **DIQQAT:** Faqat o'z branchingda ishlash.

---

## ⚡ Nega Next.js + TypeScript?

### Next.js (React o'rniga):
- SEO uchun 10x yaxshi. Video sahifalar Google da topilishi uchun SEO juda muhim.
- React Router yo'q. `app/videos/[id]/page.tsx` orqali marshrutizatsiya qilinadi.
- Sahifalar tezroq ochilishi uchun Server-Side Rendering (SSR) dan foydalanamiz.

### TypeScript:
- Video malumotlarini o'qiyotganingizda, `video.duration` ga o'xshash hususiyatlarda auto-complete ishlashi va typelar xato qilib qoymasligini taminlaydi.
- API dan qanday property kelishini aniq bilish imkonini beradi.

---

## 📁 Sening Fayllaring (Next.js)

```
frontend/
├── app/
│   ├── videos/
│   │   ├── [id]/
│   │   │   ├── page.tsx               ← Sen yozasan (VideoPage)
│   │   │   └── playground/
│   │   │       └── page.tsx           ← Sen yozasan (VideoPlaygroundPage)
│
├── components/
│   └── videos/
│       ├── VideoCard.tsx              
│       └── VideoRating.tsx          
│
├── types/
│   └── video.ts                       ← Typelarni saqlash uchun  
```

---

## 📝 Kod Misollari (Next.js + TypeScript)

### Turlar (`types/video.ts`):
```typescript
export interface Video {

  _id: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  thumbnail: string;
  materials: { name: string; url: string }[];
  viewCount: number;
}

export interface Player {
  embedUrl: string;
  expiresAt: string;
}

export interface VideoResponse {
  success: boolean;
  data: {
    video: Video;
    player: Player;
  };
}
```

### Video Sahifa asosi (`app/videos/[id]/page.tsx`):
```tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import axiosInstance from '@/lib/api/axiosInstance'
import SubscriptionGate from '@/components/subscription/SubscriptionGate'
import type { VideoResponse } from '@/types/video'

export default function VideoPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<VideoResponse['data'] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    axiosInstance.get(`/videos/${id}`)
      .then(res => setData(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <span className="loading loading-spinner" />
  if (!data) return <div>Xatolik</div>

  const { video, player } = data

  return (
    <SubscriptionGate>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <button onClick={() => router.back()} className="btn btn-ghost">← Orqaga</button>

        <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={player.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        <h1 className="text-2xl font-bold">{video.title}</h1>
      </div>
    </SubscriptionGate>
  )
}
```

## ✅ Tekshiruv Ro'yxati 
- [ ] Fayllar `.tsx` yozilgan.
- [ ] `useNavigate` o'rniga `useRouter`, `Link` NextJS dan chaqirilgan.
- [ ] TypeScript yordamida tiplash bajarilgan.
