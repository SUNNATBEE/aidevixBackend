# Aidevix — Video Tizimi: Frontend Integratsiya Qo'llanmasi

> **Abduvoris uchun yozilgan.** Backend tayyor — siz faqat frontend qismini implement qilasiz.

---

## 1. Muhit o'zgaruvchilari (.env)

Backend `.env` faylida quyidagilar **albatta** bo'lishi kerak. Bularni Sunnatbekdan oling:

```env
# ── Bunny.net Stream ──────────────────────────────────────────────────
BUNNY_STREAM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Bunny dashboard → Stream → Library → API Key
# Bu kalit: video yaratish, o'chirish, holat tekshirish uchun

BUNNY_LIBRARY_ID=123456
# Bunny dashboard → Stream → Library → Library ID (raqam)
# Har so'rovda URL da ishlatiladi: /library/{BUNNY_LIBRARY_ID}/videos/...

BUNNY_TOKEN_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Bunny dashboard → Stream → Security → Token Authentication Key
# Signed embed URL yaratishda SHA256 hash uchun ishlatiladi
# BU KALIT SIRI — hech qachon frontendga yuborma!

# ── JWT (Auth) ────────────────────────────────────────────────────────
JWT_SECRET=your-jwt-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# ── MongoDB ───────────────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://...

# ── Telegram (Subscription Gate) ─────────────────────────────────────
TELEGRAM_BOT_TOKEN=123456789:AAxxxxxx
TELEGRAM_CHANNEL_USERNAME=aidevix

# ── Frontend CORS ─────────────────────────────────────────────────────
FRONTEND_URL=http://localhost:3000
```

> **Eslatma:** Frontend `.env` ga faqat `NEXT_PUBLIC_` prefix bilan boshlanadigan o'zgaruvchilar yoziladi va ular brauzerda ko'rinadi. Backend URL dan boshqa hech narsa frontendga chiqarilmaydi.

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 2. Arxitektura — Videolar qanday ishlaydi?

```
Bunny.net (CDN + Encode)
      ↑ upload (PUT)
Admin Panel → POST /api/videos → Backend → Bunny API → video slot yaratadi
                                                ↓
                                         bunnyVideoId saqlaydi (MongoDB)

Foydalanuvchi:
  1. Login qiladi (JWT cookie)
  2. Telegram + Instagram ga obuna bo'ladi
  3. GET /api/videos/:id so'raydi
  4. Backend → signed embed URL beradi (2 soat amal qiladi)
  5. Frontend → <iframe src={embedUrl}> ko'rsatadi
  6. Bunny CDN → videoni stream qiladi (token tekshirib)
```

**Asosiy qoida:** Foydalanuvchi hech qachon to'g'ridan-to'g'ri Bunny ga ulanmaydi. Backend har safar yangi signed URL generatsiya qiladi — shuning uchun video URL ni cache qilmang yoki localStorage ga saqlamang.

---

## 3. API Endpointlar

**Base URL:** `http://localhost:5000/api/videos`

Barcha so'rovlarda cookie avtomatik yuborilishi uchun axios instance ni `withCredentials: true` bilan sozlang.

### 3.1 Kurs videolari ro'yxati

```
GET /api/videos/course/:courseId
```

**Auth:** Shart emas (public)

**Javob:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "_id": "664abc...",
        "title": "JavaScript asoslari",
        "description": "...",
        "order": 1,
        "duration": 1845,
        "thumbnail": "https://...",
        "bunnyStatus": "ready",
        "viewCount": 142
      }
    ],
    "count": 12
  }
}
```

**Frontend da nima qilasiz:**
- `bunnyStatus === 'ready'` bo'lgan videolarni bosish mumkin
- `bunnyStatus !== 'ready'` bo'lsa — "Tez kunda" badge ko'rsating
- `duration` soniyada keladi → `Math.floor(d/60) + ':' + String(d%60).padStart(2,'0')` bilan formatlang

---

### 3.2 Bitta videoni ochish (ASOSIY endpoint)

```
GET /api/videos/:id
```

**Auth:** Kerak (JWT cookie)  
**Subscription:** Kerak (Telegram + Instagram)

**Muvaffaqiyatli javob:**
```json
{
  "success": true,
  "data": {
    "video": {
      "_id": "664abc...",
      "title": "JavaScript asoslari",
      "description": "...",
      "duration": 1845,
      "order": 1,
      "thumbnail": "https://...",
      "materials": [
        { "name": "Kod namunalari", "url": "https://..." }
      ],
      "course": { "_id": "...", "title": "..." }
    },
    "player": {
      "embedUrl": "https://iframe.mediadelivery.net/embed/123456/guid?token=abc&expires=1234567890&autoplay=false&responsive=true",
      "expiresAt": "2025-04-23T14:00:00.000Z"
    }
  }
}
```

**Xato holatlari:**

| HTTP | Sabab | Frontend da ko'rsatish |
|------|-------|------------------------|
| `401` | Login qilinmagan | Login sahifasiga yo'naltiring |
| `403` + `isSubscriptionError: true` | Obuna yo'q | `SubscriptionGate` component |
| `503` + `bunnyStatus: "processing"` | Video hali encode bo'lmoqda | "Tayyorlanmoqda..." spinner |
| `503` (bunnyVideoId yo'q) | Video yuklanmagan | "Tez kunda" xabari |

**Frontend implementatsiya:**

```tsx
// app/videos/[id]/page.tsx

async function getVideoData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${id}`, {
    credentials: 'include',  // cookie yuborish uchun MUHIM
    cache: 'no-store',       // embedUrl har safar yangi bo'lishi kerak
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw err;
  }
  
  return res.json();
}
```

```tsx
// Video player component

function VideoPlayer({ embedUrl }: { embedUrl: string }) {
  return (
    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
      <iframe
        src={embedUrl}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          border: 'none',
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
```

> **MUHIM:** `embedUrl` ni hech qachon localStorage yoki sessionStorage ga saqlamang. Bu URL 2 soatdan keyin o'chadi. Sahifani har ochganda backend dan yangi URL oling.

---

### 3.3 Video qidirish

```
GET /api/videos/search?q=javascript&courseId=664abc&page=1&limit=20
```

**Auth:** Kerak  
**Query params:**

| Param | Tavsif | Default |
|-------|--------|---------|
| `q` | Sarlavha bo'yicha qidirish (ixtiyoriy) | `''` |
| `courseId` | Kurs bo'yicha filter (ixtiyoriy) | — |
| `page` | Sahifa raqami | `1` |
| `limit` | Har sahifada nechta (max 100) | `20` |

**Javob:**
```json
{
  "success": true,
  "data": {
    "videos": [...],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

---

### 3.4 Top videolar

```
GET /api/videos/top?limit=10
```

**Auth:** Shart emas  
Ko'rishlar soni (`viewCount`) bo'yicha eng ommabop videolar.

---

### 3.5 Video savollar (Q&A)

**Savol yuborish:**
```
POST /api/videos/:id/questions
Content-Type: application/json

{ "question": "Async/await ni qachon ishlatamiz?" }
```

**Savollarni olish:**
```
GET /api/videos/:id/questions?page=1&limit=20
```

**Javob:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "_id": "...",
        "question": "Async/await ni qachon ishlatamiz?",
        "answer": "Promise zanjiri murakkablashganda...",
        "isAnswered": true,
        "userId": { "username": "abduvoris" },
        "answeredBy": { "username": "sunnatbek" },
        "createdAt": "2025-04-23T10:00:00.000Z",
        "answeredAt": "2025-04-23T11:30:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "pages": 1
  }
}
```

---

## 4. Obuna (Subscription) Gate

Video ochishda **eng muhim** qism — bu `403` xato holatini to'g'ri handle qilish.

```tsx
// Subscription xatosini qanday aniqlash:

try {
  const data = await getVideoData(videoId);
  // muvaffaqiyat
} catch (err) {
  if (err.status === 403 && err.isSubscriptionError) {
    // Foydalanuvchini subscription gate ga yo'naltiring
    // err.missingSubscriptions massivi: ['Telegram'] yoki ['Instagram'] yoki ikkalasi
    router.push('/subscription');
  }
}
```

**Subscription tekshirish jarayoni:**
1. Foydalanuvchi Telegram `@aidevix` kanaliga obuna bo'ladi
2. Bot orqali Telegram ID ni bog'laydi (`/api/subscription/verify-telegram`)
3. Backend har video so'rovida real-time tekshiradi (Telegram Bot API)
4. Obuna bo'lmasa → `403` qaytaradi

---

## 5. Video Statusi (bunnyStatus)

Video yuklanganidan keyin Bunny uni encode qiladi. Bu 1-10 daqiqa oladi.

| Status | Ma'no | Frontend |
|--------|-------|----------|
| `pending` | Bunny ga yuklanmagan | "Tez kunda" |
| `processing` | Bunny qabul qildi, encode boshlanmagan | Spinner |
| `encoding` | Encode jarayonida | Progress (encodeProgress %) |
| `ready` | Tayyor, ko'rish mumkin ✅ | Player ko'rsat |
| `failed` | Xato yuz berdi | "Xato yuz berdi" |

---

## 6. Auth (Cookie) ni to'g'ri sozlash

Backend JWT tokenni **httpOnly cookie** da saqlaydi. Siz uni ko'ra olmaysiz va ko'rishingiz shart emas. Faqat bitta narsa kerak:

```ts
// axiosInstance.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,  // ← BU MUHIM! Cookie avtomatik yuboriladi
});

export default api;
```

```ts
// fetch ishlatayotgan bo'lsangiz:
fetch(url, {
  credentials: 'include',  // ← BU MUHIM!
})
```

**Tekshirish:** Login qilgandan keyin browser DevTools → Application → Cookies → `access_token` cookie ko'rinishi kerak.

---

## 7. Xato holatlari — To'liq ro'yxat

```ts
async function loadVideo(id: string) {
  try {
    const res = await api.get(`/videos/${id}`);
    return res.data.data;
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 401:
        // Login qilinmagan
        router.push('/login');
        break;

      case 403:
        if (data?.isSubscriptionError) {
          // Obuna yo'q — subscription gate ko'rsat
          showSubscriptionModal(data.missingSubscriptions);
        }
        break;

      case 404:
        // Video topilmadi
        router.push('/404');
        break;

      case 503:
        if (data?.bunnyStatus) {
          // Video encode bo'lmoqda
          showMessage('Video tayyorlanmoqda, biroz kuting...');
        } else {
          // Video yuklanmagan
          showMessage('Bu video tez kunda qo\'shiladi');
        }
        break;

      default:
        showMessage('Xato yuz berdi. Sahifani yangilang.');
    }
  }
}
```

---

## 8. Video Player — Tayyor iframe kodi

Bunny player `responsive=true` bilan keladi, lekin containerni to'g'ri o'lchamda berish kerak:

```tsx
// components/VideoPlayer.tsx

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
  expiresAt: string;
}

export function VideoPlayer({ embedUrl, title, expiresAt }: VideoPlayerProps) {
  const isExpired = new Date() > new Date(expiresAt);

  if (isExpired) {
    // Sahifani reload qiling — yangi URL oladi
    window.location.reload();
    return null;
  }

  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full rounded-lg"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
```

---

## 9. Materiallar (PDF, ZIP fayllar)

Video response ichida `materials` massivi keladi:

```tsx
{video.materials?.map((material) => (
  <a
    key={material.url}
    href={material.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 p-3 bg-gray-800 rounded hover:bg-gray-700"
  >
    <span>📎</span>
    <span>{material.name}</span>
  </a>
))}
```

---

## 10. XP — Video ko'rishdan +50 XP

Foydalanuvchi video ko'rganidan keyin XP berish backend da **alohida endpoint** orqali amalga oshiriladi:

```
POST /api/xp/watch-video
Content-Type: application/json

{ "videoId": "664abc..." }
```

Bu endpointni video tomosha tugagandan keyin chaqiring. Bunny player `onEnded` eventini qo'llab-quvvatlaydi:

```tsx
// Bunny player events uchun postMessage listener:
useEffect(() => {
  const handleMessage = (e: MessageEvent) => {
    if (e.data === 'video:ended') {
      api.post('/xp/watch-video', { videoId });
    }
  };
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, [videoId]);
```

---

## 11. Tez-tez so'raladigan savollar

**Q: Video URL ni olishda CORS xatosi chiqyapti?**  
A: Backend `FRONTEND_URL` env var ni tekshiring. U `http://localhost:3000` bo'lishi kerak (port bilan).

**Q: Cookie yuborilmayapti?**  
A: `withCredentials: true` qo'shilganmi tekshiring. HTTPS da ishlamasa backend `sameSite: 'none'` va `secure: true` cookie sozlamalari kerak bo'ladi.

**Q: embedUrl expired bo'lib qoldi?**  
A: URL 2 soat amal qiladi. `expiresAt` ni tekshirib, expired bo'lsa sahifani reload qiling — backend yangi URL beradi.

**Q: Video `processing` holatida qolib ketdi?**  
A: Bu admin muammosi. Sunnatbekga ayting — `/api/videos/:id/status` endpoint orqali Bunny dan holat tekshiriladi.

**Q: `isSubscriptionError: true` lekin foydalanuvchi obuna bo'lgan?**  
A: Telegram Bot API vaqtincha ishlamayapti. Backend 503 qaytarishi kerak, lekin ayrim hollarda 403 kelishi mumkin. `missingSubscriptions` massivini ko'rsat va foydalanuvchiga qayta urinib ko'rishni ayting.

---

## 12. Qisqacha Cheat Sheet

```
# Video ro'yxati (auth shart emas)
GET /api/videos/course/:courseId

# Video ochish (auth + subscription kerak)
GET /api/videos/:id

# Qidirish (auth kerak)
GET /api/videos/search?q=...

# Top videolar (auth shart emas)
GET /api/videos/top?limit=10

# Savol yuborish (auth kerak)
POST /api/videos/:id/questions   { "question": "..." }

# Savollarni olish
GET  /api/videos/:id/questions

# XP olish (video ko'rgandan keyin)
POST /api/xp/watch-video   { "videoId": "..." }
```

---

*Muammo bo'lsa — Sunnatbekga Telegram orqali yozing yoki Swagger UI ni tekshiring:*  
`GET /api-docs` — Public API  
`GET /api-docs/admin` — Admin API (login: admin / password Sunnatbekdan)
