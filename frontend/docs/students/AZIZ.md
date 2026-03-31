# 📡 AZIZ — Subscription Page (Obuna bo'lish jarayoni)

## 📋 Vazifa Qisqacha
Sen **obuna bo'lish sahifasini** yasaysan. Foydalanuvchi video ko'rish uchun Instagram va Telegram kanallariga obuna bo'lishi shart. Sen bu jarayonni 3 bosqichli UI bilan amalga oshirasan.

---

## 🌿 Branch
```
feature/aziz-subscription
```
> ⚠️ **DIQQAT:** Faqat `feature/aziz-subscription` branchida ishlash!

---

## 📁 Sening Fayllaring

```
frontend/src/
├── pages/
│   └── SubscriptionPage.jsx          ← Sen yozasan
│
├── components/
│   └── subscription/
│       ├── TelegramVerify.jsx          ← Allaqachon bor, yaxshilasan
│       ├── InstagramVerify.jsx         ← Allaqachon bor, yaxshilasan
│       └── SubscriptionGate.jsx        ← Allaqachon bor, ishlatasan
│
├── hooks/
│   └── useSubscription.js              ← Allaqachon yozilgan
│
└── api/
    └── subscriptionApi.js              ← Allaqachon yozilgan
```

---

## 🎨 Dizayn (Figma)

### SubscriptionPage (`/subscription`)
- **Progress bar** tepada: `1/3 qadam` — `2/3 qadam` — `3/3 qadam`
- **3 bosqich:**

**1-qadam: Ro'yxatdan o'tish** (avtomatik — allaqachon bajarilgan)

**2-qadam: Telegram orqali tasdiqlash:**
- Telegram logosi + sarlavha
- Tavsif: "Aidevix platformasiga kirish uchun Telegram kanalimizga a'zo bo'ling"
- `Telegram ID` input maydoni
  - Placeholder: `Misol: 123456789`
  - Qisqacha izoh: "ID'ingizni `/start` buyrug'ini bot'ga yuborish orqali topishingiz mumkin"
- "Obuna o'lish" tugmasi (Telegram ko'k)
- "Tasdiqlash →" tugmasi (primary)

**3-qadam: Instagram tasdiqlash:**
- Instagram logosi + sarlavha
- Instagram username input
  - Placeholder: `@username`
- "Sahifani tekshirish" tugmasi
- Tasdiqlash statusu (✅ Obuna / ❌ Obuna emas)

- **Pastda:** `Yordam kerakmi?` + `Maxfiylik siyosati` linklar

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/subscriptions/status` | GET | ✅ Bearer | Obuna holati (Instagram + Telegram) |
| `/api/subscriptions/verify/telegram` | POST | ✅ Bearer | Telegram obunasini tasdiqlash |
| `/api/subscriptions/verify/instagram` | POST | ✅ Bearer | Instagram obunasini tasdiqlash |

### Misol — Obuna holati tekshirish:
```javascript
import { subscriptionApi } from '@api/subscriptionApi'

const checkStatus = async () => {
  const { data } = await subscriptionApi.getStatus()
  // data.data.instagram.subscribed — true/false
  // data.data.telegram.subscribed — true/false
  // data.data.canAccessContent — ikkalasi ham true bo'lsa true
}
```

### Misol — Telegram tasdiqlash:
```javascript
const verifyTelegram = async (telegramUserId) => {
  const { data } = await subscriptionApi.verifyTelegram({ telegramUserId })
  // data.success === true bo'lsa tasdiqlandi
}
```

### Misol — Instagram tasdiqlash:
```javascript
const verifyInstagram = async (username) => {
  const { data } = await subscriptionApi.verifyInstagram({ username })
}
```

---

## 💡 SubscriptionGate Komponenti
Video sahifasiga kirishdan oldin bu komponent obuna tekshiriladi:

```javascript
// SubscriptionGate.jsx allaqachon yozilgan
// VideoPage.jsx da ishlatiladi:
import SubscriptionGate from '@components/subscription/SubscriptionGate'

const VideoPage = () => (
  <SubscriptionGate>
    {/* Obuna bo'lmasa bu ko'rsatilmaydi, /subscription ga yo'naltiradi */}
    <VideoPlayer ... />
  </SubscriptionGate>
)
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
react-icons         # FaTelegram, FaInstagram
framer-motion       # Bosqich o'tish animatsiyasi
react-hot-toast     # "Muvaffaqiyatli tasdiqlandi!" xabari
react-hook-form     # Forma validatsiya
```

---

## 🎨 Tailwind + DaisyUI

```jsx
{/* Progress steps */}
<ul className="steps steps-horizontal w-full mb-8">
  <li className="step step-primary">Ro'yxatdan o'tish</li>
  <li className={`step ${telegramVerified ? 'step-primary' : ''}`}>Telegram</li>
  <li className={`step ${instagramVerified ? 'step-primary' : ''}`}>Instagram</li>
</ul>

{/* Telegram verify card */}
<div className="card bg-base-200 shadow-xl max-w-md mx-auto">
  <div className="card-body">
    <div className="flex items-center gap-3 mb-4">
      <FaTelegram className="text-4xl text-blue-400" />
      <h2 className="card-title">Telegram orqali tasdiqlash</h2>
    </div>
    <input
      type="text"
      placeholder="Misol: 123456789"
      className="input input-bordered w-full"
    />
    <div className="card-actions justify-end mt-4">
      <button className="btn btn-primary w-full">Tasdiqlash →</button>
    </div>
  </div>
</div>

{/* Status badge */}
<div className="badge badge-success gap-2">
  ✅ Obuna bo'lingansiz
</div>
```

---

## 📊 Redux State

```javascript
import { useSubscription } from '@hooks/useSubscription'

const { status, loading, verifyTelegram, verifyInstagram } = useSubscription()
// status.instagram.subscribed
// status.telegram.subscribed
// status.canAccessContent
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] 3 bosqichli UI ko'rsatiladi
- [ ] Telegram ID kiritib tasdiqlash ishlaydi
- [ ] Instagram username kiritib tasdiqlash ishlaydi
- [ ] Obuna holati real-time ko'rsatiladi
- [ ] Ikkalasi ham tasdiqlanganda video sahifasiga yo'naltiradi
- [ ] Xato holatlarda toast xabar chiqadi
- [ ] Allaqachon obuna bo'lganlarga qayta tasdiqlash shart emas
- [ ] Dizayn Figma bilan mos keladi

---

## 🌐 BACKEND API — TO'LIQ QO'LLANMA

**Backend:** Node.js + Express.js | **Port:** 5000 | **Database:** MongoDB Atlas
**Jami endpointlar: ~75 ta**

### 🔗 Server URL'lari

| Muhit | URL |
|-------|-----|
| Local (Development) | `http://localhost:5000` |
| Production (Railway) | `https://aidevix-backend-production.up.railway.app` |

---

### 📖 Swagger UI — Interaktiv Hujjat

```
URL:      http://localhost:5000/api-docs
Username: Aidevix
Password: sunnatbee
```

**Swagger'da token kiritish:**
1. `http://localhost:5000/api-docs` ni oching
2. Yuqori o'ngda **"Authorize 🔓"** tugmasini bosing
3. `Bearer eyJhbGciOiJ...` formatida token kiriting
4. **"Authorize"** bosing — endi `🔒` belgili endpointlar ishlaydi

> **Swagger'da token qanday olish?**
> Authentication → POST `/api/auth/login` → Execute → Response'dan `accessToken` ni ko'chiring

---

## 📋 BARCHA ENDPOINTLAR (~75 ta)

### 1️⃣ AUTHENTICATION — `/api/auth` (5 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| POST | `/api/auth/register` | ❌ | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | ❌ | Tizimga kirish |
| POST | `/api/auth/refresh-token` | ❌ | Token yangilash |
| POST | `/api/auth/logout` | ✅ | Chiqish |
| GET | `/api/auth/me` | ✅ | Mening profilim |

---

### 2️⃣ SUBSCRIPTIONS — `/api/subscriptions` (3 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/subscriptions/status`** | ✅ | **Obuna holati (Instagram + Telegram)** |
| **POST** | **`/api/subscriptions/verify-instagram`** | ✅ | **Instagram obunasini tekshirish** |
| **POST** | **`/api/subscriptions/verify-telegram`** | ✅ | **Telegram obunasini tekshirish** |

**GET `/api/subscriptions/status`** — Token kerak
```json
// Javob (200):
{
  "success": true,
  "data": {
    "subscriptions": {
      "instagram": {
        "subscribed": true,
        "username": "aidevix_official",
        "verifiedAt": "2026-03-10T08:00:00.000Z"
      },
      "telegram": {
        "subscribed": true,
        "telegramUserId": "987654321",
        "verifiedAt": "2026-03-10T08:05:00.000Z"
      }
    },
    "hasAllSubscriptions": true
  }
}
// hasAllSubscriptions: true  → video ko'rish mumkin!
// hasAllSubscriptions: false → obuna sahifasiga yo'naltir
```

**POST `/api/subscriptions/verify-telegram`** — Telegram tekshirish
```json
// So'rov body:
{ "username": "aidevix", "telegramUserId": "987654321" }

// Javob (200) — Obuna bor:
{
  "success": true,
  "message": "Telegram subscription verified successfully.",
  "data": {
    "subscription": {
      "telegram": { "subscribed": true, "telegramUserId": "987654321" }
    }
  }
}

// Javob (200) — Obuna YO'Q:
{
  "success": true,
  "message": "Telegram subscription not found. Please join the channel.",
  "data": { "subscription": { "telegram": { "subscribed": false } } }
}
// ⚠️ 200 = tekshiruv o'tdi, lekin subscribed: false bo'lishi mumkin!
```

**POST `/api/subscriptions/verify-instagram`** — Instagram tekshirish
```json
// So'rov body:
{ "username": "ahmadjon_ig" }

// Javob (200):
{
  "success": true,
  "data": {
    "subscription": {
      "instagram": { "subscribed": true, "username": "ahmadjon_ig" }
    }
  }
}
```

---

### 3️⃣ COURSES — `/api/courses` (9 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/courses` | ❌ | Barcha kurslar |
| GET | `/api/courses/top` | ❌ | Top kurslar |
| GET | `/api/courses/categories` | ❌ | Kategoriyalar |
| GET | `/api/courses/:id` | ❌ | Bitta kurs |
| GET | `/api/courses/:id/recommended` | ❌ | Tavsiya etilgan |
| POST | `/api/courses/:id/rate` | ✅ | Baholash |
| POST | `/api/courses` | ✅ Admin | Yaratish |
| PUT | `/api/courses/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/courses/:id` | ✅ Admin | O'chirish |

---

### 4️⃣ VIDEOS — `/api/videos` (9 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/videos/course/:courseId` | ❌ | Kurs videolari |
| GET | `/api/videos/:id` | ✅ + Obuna | Video + Bunny embed URL |
| POST | `/api/videos/link/:linkId/use` | ✅ | Linkni belgilash |
| GET | `/api/videos/:id/questions` | ❌ | Q&A |
| POST | `/api/videos/:id/questions` | ✅ | Savol berish |
| POST | `/api/videos/:id/questions/:qId/answer` | ✅ Admin | Javob |
| POST | `/api/videos` | ✅ Admin | Yaratish |
| PUT | `/api/videos/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/videos/:id` | ✅ Admin | O'chirish |

**Video ko'rish — 3 qatlam himoya:**
```
1. authenticate    → Token tekshiruvi
2. checkSubscriptions → Instagram + Telegram obuna real-time tekshiruvi
3. getVideo        → Video + Bunny embed URL yaratish
```

---

### 5️⃣ XP TIZIMI — `/api/xp` (8 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/xp/stats` | ✅ | XP, level, streak |
| POST | `/api/xp/video-watched/:videoId` | ✅ | +50 XP |
| GET | `/api/xp/quiz/video/:videoId` | ✅ | Video quizi |
| POST | `/api/xp/quiz/:quizId` | ✅ | Quiz yechish |
| PUT | `/api/xp/profile` | ✅ | Bio, skills yangilash |
| GET | `/api/xp/weekly-leaderboard` | ❌ | Haftalik TOP |
| POST | `/api/xp/streak-freeze` | ✅ | Freeze ishlatish |
| POST | `/api/xp/streak-freeze/add` | ✅ | Freeze qo'shish |

---

### 6️⃣ RANKING — `/api/ranking` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/ranking/courses` | ❌ | Top kurslar |
| GET | `/api/ranking/users` | ❌ | Top foydalanuvchilar |
| GET | `/api/ranking/users/:userId/position` | ✅ | O'z pozitsiyasi |

---

### 7️⃣–1️⃣6️⃣ QOLGAN ENDPOINTLAR

| Guruh | Endpoint | Soni |
|-------|----------|------|
| Projects | `/api/projects` | 6 ta |
| Enrollments | `/api/enrollments` | 4 ta |
| Wishlist | `/api/wishlist` | 3 ta |
| Certificates | `/api/certificates` | 2 ta |
| Sections | `/api/sections` | 5 ta |
| Follow | `/api/follow` | 4 ta |
| Challenges | `/api/challenges` | 3 ta |
| Payments | `/api/payments` | 3 ta |
| Admin | `/api/admin` | 5 ta |
| Upload | `/api/upload` | 2 ta |
| Health | `/health` | 1 ta |

---

### ❌ HTTP Status Kodlar

| Kod | Ma'no | Sabab |
|-----|-------|-------|
| `200` | OK | Muvaffaqiyat |
| `201` | Created | Yaratildi |
| `400` | Bad Request | Noto'g'ri ma'lumot |
| `401` | Unauthorized | Token yo'q/eskirgan |
| `403` | Forbidden | Ruxsat yo'q |
| `404` | Not Found | Topilmadi |
| `429` | Too Many Requests | Rate limit (200 req/15min) |
| `500` | Server Error | Server xatosi |

### 🔄 Obuna Jarayoni To'liq Oqimi

```
1. Foydalanuvchi Telegram kanalga qo'shiladi (t.me/aidevix)
2. POST /api/subscriptions/verify-telegram → { username, telegramUserId }
3. subscribed: true → Telegram ✅

4. Foydalanuvchi Instagram'ga obuna bo'ladi (@aidevix)
5. POST /api/subscriptions/verify-instagram → { username }
6. subscribed: true → Instagram ✅

7. GET /api/subscriptions/status → hasAllSubscriptions: true
8. Video sahifasiga yo'naltirish → Video ko'rish mumkin!
```
