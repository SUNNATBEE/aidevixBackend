# 🚫 BOISXON — 404 Error Page

## 📋 Vazifa Qisqacha
Sen **404 xato sahifasini** yasaysan. Bu sahifa mavjud bo'lmagan URL ga kirilganda ko'rsatiladi.

---

## 🌿 Branch
```
feature/boisxon-404
```
> ⚠️ **DIQQAT:** Faqat `feature/boisxon-404` branchida ishlash!

```bash
git checkout -b feature/boisxon-404
git push origin feature/boisxon-404
```

---

## 📁 Sening Fayllaring

```
frontend/src/
└── pages/
    └── NotFoundPage.jsx        ← Sen yozasan (faqat shu fayl!)
```

Router'da allaqachon qo'shilgan:
```jsx
// AppRouter.jsx da:
<Route path="*" element={<NotFoundPage />} />
```

---

## 🎨 Dizayn (Figma)

### NotFoundPage

**Navbar:** Oddiy Aidevix navbar

**Asosiy qism (centered):**
- **Chap tomonda:** Animatsiyali monitor ikonkasi
  - Monitor ekranida: `<Route not Found />`  matni
  - Qizil xato belgisi
  - `Error: 404` tag
- **O'ng tomonda:**
  - Katta "**404**" raqami (very big, slightly transparent)
  - "**Sahifa topilmadi**" — katta sarlavha
  - Tavsif: "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki manzili o'zgartirilgan bo'lishi mumkin. Keling, sizni to'g'ri yo'lga qaytaramiz."
  - **"🏠 Bosh sahifa"** tugmasi (primary)
  - **"← Ortga qaytish"** tugmasi (outline/ghost)

**Footer:** Oddiy footer

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
framer-motion      # Animatsiyalar (monitor titraydi)
react-icons        # FaHome, FaArrowLeft, BsDisplay
react-router-dom   # useNavigate, Link
```

---

## 🎨 Tailwind + DaisyUI

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Chap: Monitor animatsiya */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {/* Monitor SVG yoki react-icons BsDisplay */}
            <div className="relative w-64 h-48 mx-auto">
              <div className="bg-base-300 rounded-xl p-6 border border-error/30">
                <code className="text-error text-sm">
                  &lt;Route not Found /&gt;
                </code>
                <br />
                <code className="text-warning text-xs mt-2 block">
                  Error: 404
                </code>
              </div>
            </div>
          </motion.div>

          {/* O'ng: Matn */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-right"
          >
            {/* Katta 404 raqami */}
            <p className="text-[12rem] font-black text-base-content/10 leading-none select-none">
              404
            </p>
            <h1 className="text-4xl font-bold -mt-8">Sahifa topilmadi</h1>
            <p className="text-base-content/60 mt-4 max-w-md ml-auto">
              Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki manzili
              o'zgartirilgan bo'lishi mumkin.
            </p>
            <div className="flex gap-4 justify-end mt-8">
              <Link to="/" className="btn btn-primary gap-2">
                🏠 Bosh sahifa
              </Link>
              <button onClick={() => navigate(-1)} className="btn btn-outline gap-2">
                ← Ortga qaytish
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
```

---

## 💡 Qo'shimcha Vazifalar (ixtiyoriy)
Agar asosiy vazifani tez tugatsan, quyidagilarni qo'shishingiz mumkin:
1. **Titroq animatsiya** (monitor sahifa yo'qligida chayqalsin)
2. **Countdown** (5 soniyada bosh sahifaga qaytish)
3. **"Nima qidirmoqda edingiz?"** qidiruv inputi
4. **Random 404 quotes** ("Hazillar" — mashhur 404 xabarlar)

---

## ✅ Tekshiruv Ro'yxati
- [ ] Mavjud bo'lmagan URL ga kirishda 404 ko'rsatiladi (masalan `/abc`)
- [ ] "Bosh sahifa" tugmasi `/` ga yo'naltiradi
- [ ] "Ortga qaytish" tugmasi ishlaydi
- [ ] Animatsiya ishlaydi
- [ ] Dizayn Figma bilan mos keladi
- [ ] Responsive (mobil va desktop)

---

## 🌐 BACKEND API — TO'LIQ QO'LLANMA

**Backend:** Node.js + Express.js | **Port:** 5000 | **Database:** MongoDB Atlas
**Jami endpointlar: ~75 ta**

> **404 sahifasi uchun backend API kerak emas** — bu sahifa client-side.
> Lekin quyida butun backend haqida umumiy ma'lumot berilgan — jamoa bilan ishlashda kerak bo'ladi.

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

**POST `/api/auth/login`** — Response:
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "username": "ahmadjon", "role": "user" },
    "accessToken": "eyJ...", "refreshToken": "eyJ..."
  }
}
```

---

### 2️⃣ SUBSCRIPTIONS — `/api/subscriptions` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/subscriptions/status` | ✅ | Obuna holati |
| POST | `/api/subscriptions/verify-instagram` | ✅ | Instagram |
| POST | `/api/subscriptions/verify-telegram` | ✅ | Telegram |

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

---

### 5️⃣ XP TIZIMI — `/api/xp` (8 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/xp/stats` | ✅ | XP, level, streak |
| POST | `/api/xp/video-watched/:videoId` | ✅ | +50 XP |
| GET | `/api/xp/quiz/video/:videoId` | ✅ | Video quizi |
| POST | `/api/xp/quiz/:quizId` | ✅ | Quiz yechish |
| PUT | `/api/xp/profile` | ✅ | Profil yangilash |
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
| `404` | Not Found | Topilmadi ← Sening sahifang shu holat uchun! |
| `429` | Too Many Requests | Rate limit |
| `500` | Server Error | Server xatosi |

### 🛡️ Rate Limiting
- **Umumiy API:** 200 so'rov / 15 daqiqa
- **Auth endpoints:** 10 so'rov / 15 daqiqa
