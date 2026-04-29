# Video Integration — Frontend Guide

**Masul:** Abduvoris
**Repo:** AidevixBackend -> `frontend/` papka
**Sana:** 2026-04-23

---

## Mundarija

1. [Umumiy arxitektura](#1-umumiy-arxitektura)
2. [Environment Variables](#2-environment-variables)
3. [Bunny.net qanday ishlaydi](#3-bunnynet)
4. [Mavjud fayllar xaritasi](#4-fayllar)
5. [API qatlami — videoApi.ts](#5-api)
6. [Redux slice — videoSlice.ts](#6-redux)
7. [Hook — useVideos.ts](#7-hook)
8. [Subscription Gate](#8-subscription)
9. [Video sahifa — /videos/[id]](#9-video-sahifa)
10. [VideoComments komponenti](#10-comments)
11. [Abduvoris — nima qilish kerak](#11-abduvoris)
12. [Ownership kommentlar](#12-ownership)
13. [Test qilish](#13-test)

---

## 1. Umumiy Arxitektura

```
Foydalanuvchi /videos/[id] sahifasiga kiradi
        |
        v
[Redux] fetchVideo(id) -> GET /api/videos/:id  (cookie auth + subscription check)
        |
        +-- 403 Forbidden --> SubscriptionGate modal ochiladi
        |                     (Telegram + Instagram obuna soradi)
        |
        +-- 200 OK ---------> { video, player: { embedUrl, expiresAt } }
                |
                +-- player.embedUrl mavjud --> Bunny.net iframe (token himoya)
                |
                +-- player null --> Telegram link tugmasi (eski videolar)
```

**Muhim qoidalar:**
- `subscriptionCheck` middleware har bir `GET /api/videos/:id` da Telegram obunasini tekshiradi
- Bunny.net `embedUrl` 2 soat amal qiladi — muddati tugagach reload kerak
- Auth: **faqat cookie** — localStorage token TAQIQLANGAN

---

## 2. Environment Variables

### Frontend `.env.local` (Vercel da ham shu nomlar)

```env
# Lokal dev
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Production (Railway)
# NEXT_PUBLIC_BACKEND_URL=https://aidevix-backend-production.up.railway.app
```

> **Eslatma:** Frontend Bunny.net kalitiga muhtoj EMAS.
> Barcha Bunny.net kalitlari faqat backend `.env` da.

### Backend `.env` (Railway — faqat malumot uchun)

```env
BUNNY_STREAM_API_KEY=xxxxxxxx   # Bunny panel -> Stream Library -> API key
BUNNY_LIBRARY_ID=123456         # Bunny panel -> Library ID (raqam)
BUNNY_TOKEN_KEY=xxxxxxxx        # Bunny panel -> Security -> Token Auth Key

MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHANNEL_USERNAME=aidevix
FRONTEND_URL=https://aidevix.uz,http://localhost:3000
```

### Bunny.net kalitlarini qayerdan olish

1. **bunny.net** ga kiring
2. **Stream** -> Library tanlang
3. **API Key:** Library Settings -> General -> API Key
4. **Library ID:** URL dagi raqam: `video.bunnycdn.com/library/123456` -> `123456`
5. **Token Key:** Library Settings -> Security -> Token Authentication -> Token Security Key

---

## 3. Bunny.net Qanday Ishlaydi

### Token formulasi (backend da avtomatik yaratiladi)

```
expiresAt = Math.floor(Date.now() / 1000) + 7200   // Unix timestamp, 2 soat
token     = SHA256(BUNNY_TOKEN_KEY + videoId + expiresAt) -> hex string

embedUrl  = https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}
            ?token={token}&expires={expiresAt}&autoplay=false&responsive=true
```

### Backend response strukturasi

```json
{
  "success": true,
  "data": {
    "video": {
      "_id": "...",
      "title": "Video nomi",
      "description": "...",
      "duration": 720,
      "viewCount": 1234,
      "course": { "title": "Kurs nomi" }
    },
    "player": {
      "embedUrl": "https://iframe.mediadelivery.net/embed/123456/abc?token=xxx&expires=...",
      "expiresAt": "2026-04-23T14:00:00.000Z"
    },
    "videoLink": null
  }
}
```

`player` null bolsa — video hali Bunny.net ga kochirилмаган (eski Telegram videolar).

### Iframe frontend da

```tsx
<iframe
  title={video.title}
  src={embedUrl}
  className="h-full w-full"
  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
  allowFullScreen
/>
```

Token muddati tugasa Bunny 403 qaytaradi. `window.location.reload()` bilan yangi token olinadi.

---

## 4. Mavjud Fayllar Xaritasi

```
frontend/src/
|
+-- api/
|   +-- axiosInstance.ts         <- Axios + withCredentials: true (ozgartirma!)
|   +-- videoApi.ts              <- Video API metodlari (tayyor)
|
+-- store/slices/
|   +-- videoSlice.ts            <- Redux state + async thunks (tayyor)
|
+-- hooks/
|   +-- useVideos.ts             <- useVideos() va useVideo(id) hooklar (tayyor)
|
+-- components/videos/
|   +-- VideoCard.tsx            <- Video kartochka
|   +-- VideoCardSkeleton.tsx    <- Loading skeleton
|   +-- VideoLinkModal.tsx       <- Telegram link modal
|   +-- VideoRating.tsx          <- 1-5 yulduz reyting
|   +-- VideoComments.tsx        <- Q&A bolimi (tayyor)
|
+-- app/videos/[id]/
|   +-- page.tsx                 <- Asosiy video sahifa (Bunny iframe + SubscriptionGate)
|
+-- components/subscription/
    +-- SubscriptionGate.tsx     <- Obuna tosiq modal
```

---

## 5. API Qatlami

**Fayl:** `frontend/src/api/videoApi.ts`

```typescript
import api from './axiosInstance'

export const videoApi = {
  // Kurs videolari royxati (obuna shart emas)
  getByCourse: (courseId) => api.get(`videos/course/${courseId}`),

  // Bitta video + Bunny embed URL (auth + obuna kerak!)
  getById: (id) => api.get(`videos/${id}`),

  // Bir martalik Telegram link ishlatish (mark as used)
  useLink: (linkId) => api.post(`videos/link/${linkId}/use`),

  // Eng kop korilgan videolar
  getTop: (limit = 8) => api.get('videos/top', { params: { limit } }),

  // Reyting berish (1-5 yulduz)
  rate: (id, rating) => api.post(`videos/${id}/rate`, { rating }),

  // Reyting statistikasi
  getRating: (id) => api.get(`videos/${id}/rating`),

  // Admin funksiyalar
  create: (data) => api.post('videos', data),
  update: (id, data) => api.put(`videos/${id}`, data),
  delete: (id) => api.delete(`videos/${id}`),
}
```

**axiosInstance** sozlamalari:
- `baseURL` = `NEXT_PUBLIC_BACKEND_URL/api/`
- `withCredentials: true` — cookie auth uchun MAJBURIY, ozgartirma

---

## 6. Redux Slice

**Fayl:** `frontend/src/store/slices/videoSlice.ts`

### State strukturasi

```typescript
{
  courseVideos: Video[]            // Kurs videolari royxati
  topVideos:    Video[]            // Top/trending videolar
  current:      Video | null       // Hozirgi ochiq video malumoti
  videoLink:    VideoLink | null   // Telegram one-time link
  player: {
    embedUrl:  string   // <-- iframe src sifatida ishlatiladi (ASOSIY)
    expiresAt: string   // <-- 2 soatdan keyin eskiradi
  } | null
  loading:      boolean
  linkLoading:  boolean
  error:        any
  ratings:      Record<string, { average: number; count: number; userRating?: number }>
}
```

### Asosiy thunks

| Thunk | Qachon ishlatiladi |
|-------|-------------------|
| `fetchCourseVideos(courseId)` | Kurs sahifasida — barcha videolar |
| `fetchVideo(id)` | Video sahifasiga kirilganda |
| `fetchTopVideos(limit)` | Homepage — mashhur videolar |
| `rateVideo({ id, rating })` | Reyting berish |
| `useVideoLink(linkId)` | Telegram link ishlatish |

### Selectors

```typescript
import {
  selectCurrentVideo,   // state.videos.current
  selectVideoLink,      // state.videos.videoLink
  selectVideoPlayer,    // state.videos.player  <-- ASOSIY: { embedUrl, expiresAt }
  selectVideoLoading,   // state.videos.loading
  selectVideoError,     // state.videos.error
  selectCourseVideos,
  selectTopVideos,
  selectRatings,
} from '@store/slices/videoSlice'
```

---

## 7. Hook

**Fayl:** `frontend/src/hooks/useVideos.ts`

### useVideos() — barcha state + metodlar

```tsx
import { useVideos } from '@hooks/useVideos'

function CourseVideoList({ courseId }: { courseId: string }) {
  const { courseVideos, loading, fetchByCourse } = useVideos()

  useEffect(() => {
    fetchByCourse(courseId)
  }, [courseId])

  if (loading) return <div>Yuklanmoqda...</div>

  return (
    <ul>
      {courseVideos.map(v => (
        <li key={v._id}>{v.title}</li>
      ))}
    </ul>
  )
}
```

### useVideo(id) — bitta video + avtomatik fetch + cleanup

```tsx
import { useVideo } from '@hooks/useVideos'

function MyVideoSection({ id }: { id: string }) {
  // Avtomatik: mount -> fetchById(id), unmount -> clearCurrentVideo()
  const { video, player, videoLink, loading, error } = useVideo(id)
  const embedUrl = player?.embedUrl

  if (loading) return <Spinner />
  if (error)   return <ErrorMessage />

  return embedUrl ? (
    <iframe src={embedUrl} allowFullScreen className="w-full aspect-video" />
  ) : (
    <p>Video Telegram da joylashgan</p>
  )
}
```

---

## 8. Subscription Gate

### Backend qanday tekshiradi

```
1. JWT cookie -> userId oladi
2. User.socialSubscriptions.telegram -> telegramId oladi
3. Telegram Bot API: getChatMember(@aidevix, telegramId)
4. Obuna bolmasa -> 403 Forbidden
5. Obuna bolsa  -> video + player data qaytaradi
```

### Frontend da obuna holati

```tsx
import { selectIsLoggedIn } from '@store/slices/authSlice'
import { selectInstagramSub, selectTelegramSub } from '@store/slices/subscriptionSlice'

const isLoggedIn  = useSelector(selectIsLoggedIn)
const instagram   = useSelector(selectInstagramSub)
const telegram    = useSelector(selectTelegramSub)

// Ham Telegram, ham Instagram tasdiqlangan bolsa true
const isSubscribed = !!(isLoggedIn && instagram?.subscribed && telegram?.subscribed)
```

### SubscriptionGate ishlatish

```tsx
import SubscriptionGate from '@components/subscription/SubscriptionGate'

const [showModal, setShowModal] = useState(false)

<SubscriptionGate
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={() => window.location.reload()}
  videoId={id}
/>
```

---

## 9. Video Sahifa

**Fayl:** `frontend/src/app/videos/[id]/page.tsx`

### Sahifa tuzilishi (tartib)

```
1. Orqaga tugma (router.back())
2. Video Header card — title, description, duration, views, reyting
3. Video player
   a) Bunny iframe  — player.embedUrl mavjud bolsa (yangi, HD videolar)
   b) Telegram link — player null bolsa (eski videolar)
4. Playground banner
5. VideoComments videoId={id}
6. SubscriptionGate modal — kerak bolsa
```

### Player qaror qanday qilinadi

```tsx
const { current: video, player, videoLink } = useVideos()
const embedUrl = player?.embedUrl

return embedUrl ? (
  // Bunny.net Stream (yangi, HD videolar)
  <div className="aspect-video w-full">
    <iframe
      src={embedUrl}
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      className="h-full w-full"
    />
  </div>
) : (
  // Telegram link fallback (eski videolar)
  videoLink && isSubscribed ? (
    <a href={videoLink.telegramLink} target="_blank" rel="noopener noreferrer">
      Videoni korish
    </a>
  ) : (
    <button onClick={() => setShowModal(true)}>Videoni korish</button>
  )
)
```

---

## 10. VideoComments

**Fayl:** `frontend/src/components/videos/VideoComments.tsx`

```tsx
import VideoComments from '@/components/videos/VideoComments'

// Video sahifada — bitta prop
<VideoComments videoId={id} />
```

**Funksiyalari:**
- `GET /api/videos/:id/questions?page=1&limit=10` — savollar (paginated)
- `POST /api/videos/:id/questions` — yangi savol (auth kerak)
- `isAnswered: true` bolsa admin javobi korsatiladi (yashil badge)
- Auth bolmasa — "Tizimga kiring" havolasi

---

## 11. Abduvoris — Nima Qilish Kerak

Asosiy video infratuzilma **toliq tayyor**. Yangi feature qoshish tartibi:

### Yangi komponent yaratish

```tsx
// frontend/src/components/videos/MyFeature.tsx
'use client'
// ABDUVORIS

import { useVideo } from '@hooks/useVideos'

interface Props {
  videoId: string
}

export default function MyFeature({ videoId }: Props) {
  const { video, player } = useVideo(videoId)
  // player?.embedUrl  -- Bunny iframe URL (null bolishi mumkin)
  // video?.title      -- video nomi
  // video?.duration   -- davomiyligi (sekund)
  // video?.viewCount  -- korizlar soni

  return (
    <div>
      {/* implementatsiya */}
    </div>
  )
}
```

### Video sahifaga yangi bolim qoshish

`frontend/src/app/videos/[id]/page.tsx` da VideoComments dan keyin:

```tsx
import VideoComments from '@/components/videos/VideoComments'
import MyFeature from '@/components/videos/MyFeature'

// return ichida:
<VideoComments videoId={id} />
{/* ABDUVORIS */}
<MyFeature videoId={id} />
```

### Yangi API metod qoshish

```typescript
// frontend/src/api/videoApi.ts ga qoshing:
export const videoApi = {
  // ... mavjudlar ...
  getTranscript: (id: string) => api.get(`videos/${id}/transcript`),
}
```

### VideoRating komponentini ishlatish

```tsx
import VideoRating from '@/components/videos/VideoRating'

<VideoRating videoId={id} />
```

---

## 12. Ownership

`frontend/CLAUDE.md` qoidasiga kora, o'z fayllaringizga qoshing:

```tsx
// ABDUVORIS
```

Mavjud faylni tahrirlaganda faqat o'z bolimingizni belgilang:

```tsx
{/* ABDUVORIS — related videos grid */}
<RelatedVideos videoId={id} />
```

---

## 13. Test Qilish

### Ishga tushirish

```bash
# Terminal 1: Backend
cd backend && npm run dev     # port 5000

# Terminal 2: Frontend
cd frontend && npm run dev    # port 3000
```

### TypeScript va lint

```bash
cd frontend
npx tsc --noEmit
npx eslint src --ext .ts,.tsx
```

### Video integratsiyani qolda tekshirish

1. `http://localhost:3000` — login qiling
2. Telegram kanalga obuna: `@aidevix`
3. Bot orqali boglanish: bot -> `/start`
4. Kurs -> video bosing
5. Bunny.net iframe ochilishi kerak (HD, responsive)

### Obunasiz holat — 403 test

1. Incognito oyna oching
2. `/videos/[istalgan-id]` ga kiring
3. Tugma bosing -> SubscriptionGate modal ochilishi kerak

### Token muddatini console da tekshirish

```javascript
const iframe = document.querySelector('iframe')
const url = new URL(iframe.src)
const exp = url.searchParams.get('expires')
console.log('Expires:', new Date(Number(exp) * 1000))
// 2 soatdan keyin eskiradi
```

---

## Qoshimcha Manbalar

| Resurs | URL |
|--------|-----|
| Swagger API docs (lokal) | `http://localhost:5000/api-docs` |
| Swagger login | `Aidevix` / `sunnatbee` |
| Production backend | `https://aidevix-backend-production.up.railway.app` |
| Bunny.net panel | `https://bunny.net` |
