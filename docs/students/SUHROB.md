# 🎮 SUHROB — Top User Leaderboard + Level Up Page

## 📋 Vazifa Qisqacha
Sen **global foydalanuvchilar reytingini** (XP bo'yicha) va **Level UP celebration sahifasini** yasaysan. Foydalanuvchilar video ko'rish (+50 XP) va quiz yechish (+10-100 XP) orqali ball to'playdi.

---

## 🌿 Branch
```
feature/suhrob-leaderboard
```
> ⚠️ **DIQQAT:** Faqat `feature/suhrob-leaderboard` branchida ishlash!

```bash
git checkout -b feature/suhrob-leaderboard
git push origin feature/suhrob-leaderboard
```

---

## 📁 Sening Fayllaring

```
frontend/src/
├── pages/
│   ├── LeaderboardPage.jsx              ← Sen yozasan
│   └── LevelUpPage.jsx                  ← Sen yozasan
│
├── components/
│   └── leaderboard/
│       ├── LeaderboardTable.jsx          ← Sen yozasan
│       ├── LevelUpModal.jsx              ← Sen yozasan
│       └── UserXPCard.jsx               ← Sen yozasan (yangi fayl)
│
├── hooks/
│   ├── useRanking.js                     ← useTopUsers() ishlatasan
│   └── useUserStats.js                   ← Allaqachon yozilgan
│
├── store/slices/
│   ├── rankingSlice.js                   ← Allaqachon yozilgan
│   └── userStatsSlice.js                 ← Allaqachon yozilgan
│
└── api/
    ├── rankingApi.js                     ← Allaqachon yozilgan
    └── userApi.js                        ← Allaqachon yozilgan
```

---

## 🎨 Dizayn (Figma)

### 1-Sahifa: LeaderboardPage (`/leaderboard`)

**Tepada — Hozirgi foydalanuvchi panel:**
```
┌─────────────────────────────────────────────┐
│  42-o'RIN     SIZNING REYTINGINGIZ           │
│  O'rin: 1642 | Top 11%                      │
│  Jami XP: 4,234  Streak: 3 kun  Badges: 🏆  │
│                                              │
│  [███████████──────] 4,234 / 5,000 XP       │
└─────────────────────────────────────────────┘
```

**Tabs:** GLOBAL | JAVASCRIPT | REACT | PYTHON | LINUX

**Podium (Top 3):**
```
     [2]         [1] 👑        [3]
   Malika R.   Jamshid K.   Azizbek T.
  Level 30     Level 38     Level 28
  145,269 XP  GRANDMASTER  89,421 XP
```

**XP Engine panel (o'ngda):**
| Faollik | XP |
|---------|-----|
| Video Ko'rish | +50 XP |
| Quizlar | +100 XP |
| Amaliy Mashq | +150 XP |
| Challenge | +500 XP |

**Jadval (#4 dan pastga):**
| Rank | Avatar + Ism | Level | XP | Badges | Badge |
|------|-------------|-------|----|--------|-------|

**"+ YANA YUKLASH"** tugmasi

---

### 2-Sahifa: LevelUpPage (`/level-up`)

```
┌─────────────────────────────────────────┐
│         ✨ confetti animatsiya ✨         │
│                                          │
│              25                          │
│           Tabriklaymiz!                  │
│   Siz N-unvoniga erishdingiz: "Mantiq    │
│   Ustasi"                                │
│                                          │
│  Joriy XP: 12,500    Savollar: +450      │
│  Daraja:    +3       Savollar: 50        │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ JavaScript Master               │    │
│  │ 5 Javascript kursini tugatdi    │    │
│  └─────────────────────────────────┘    │
│                                          │
│       [Davom etish →]                    │
│       [Ulashish/Telegram]               │
└─────────────────────────────────────────┘
```

---

## 🔌 API Endpointlar

### Swagger UI
- **URL:** `http://localhost:5000/api-docs`
- **Username:** `admin`
- **Password:** `admin123`

### Sen ishlatadigan endpointlar:

| Endpoint | Method | Auth | Vazifa |
|----------|--------|------|--------|
| `/api/ranking/users` | GET | ❌ Yo'q | Top foydalanuvchilar |
| `/api/ranking/users?page=1&limit=20` | GET | ❌ Yo'q | Sahifalash bilan |
| `/api/ranking/users/:userId/position` | GET | ✅ Bearer | O'z pozitsiyasi |
| `/api/xp/stats` | GET | ✅ Bearer | XP, level, streak |
| `/api/xp/quiz/:quizId` | POST | ✅ Bearer | Quiz yechish |
| `/api/xp/quiz/video/:videoId` | GET | ✅ Bearer | Video quizini olish |

### Misol — Leaderboard yuklanishi:
```javascript
import { useTopUsers } from '@hooks/useRanking'
import { useUserStats } from '@hooks/useUserStats'

const LeaderboardPage = () => {
  const { users, loading, pagination, loadMore } = useTopUsers({ page: 1, limit: 20 })
  const { xp, level, streak } = useUserStats()

  return (
    <div>
      {/* User o'z reytingini ko'radi */}
      <UserXPCard xp={xp} level={level} streak={streak} />

      {/* Podium */}
      <Podium top3={users.slice(0, 3)} />

      {/* Jadval */}
      <LeaderboardTable users={users.slice(3)} />

      {/* Ko'proq */}
      <button onClick={() => loadMore(pagination.page + 1)}>+ Yana yuklash</button>
    </div>
  )
}
```

---

## 🛠️ Texnologiyalar

```bash
# Allaqachon o'rnatilgan:
framer-motion      # Animatsiyalar
react-icons        # FaCrown, FaMedal, FaTrophy, FaFire

# QO'SHISH KERAK:
npm install react-confetti canvas-confetti
```

### Level UP animatsiya:
```javascript
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'

const LevelUpPage = () => {
  const { justLeveledUp, newLevel, dismissLevelUp } = useUserStats()

  return (
    <AnimatePresence>
      {justLeveledUp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <Confetti numberOfPieces={300} />
          <div className="card bg-base-200 p-8 text-center max-w-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
              className="text-8xl font-black text-primary"
            >
              {newLevel}
            </motion.div>
            <h2 className="text-2xl font-bold mt-4">Tabriklaymiz!</h2>
            <button onClick={dismissLevelUp} className="btn btn-primary mt-6 w-full">
              Davom etish →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## 🎨 Tailwind + DaisyUI

```jsx
{/* Foydalanuvchi reytingi banner */}
<div className="card bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
  <div className="card-body">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-60">SIZNING REYTINGINGIZ</p>
        <p className="text-3xl font-black">42-o'RIN</p>
        <p className="text-sm opacity-60">O'rin: 1642 | Top 11%</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-primary">{xp.toLocaleString()} XP</p>
        <p>🔥 {streak} kun streak</p>
      </div>
    </div>
    <progress
      className="progress progress-primary w-full"
      value={xp % 1000}
      max={1000}
    />
  </div>
</div>

{/* XP Engine */}
<div className="card bg-base-200">
  <div className="card-body">
    <h3 className="card-title text-sm">⚡ XP ENGINE</h3>
    {[
      { label: 'Video Ko\'rish', xp: '+50 XP', icon: '🎬' },
      { label: 'Quizlar', xp: '+100 XP', icon: '📝' },
      { label: 'Amaliy Mashq', xp: '+150 XP', icon: '💻' },
      { label: 'Challenge', xp: '+500 XP', icon: '🚀' },
    ].map(item => (
      <div key={item.label} className="flex justify-between text-sm py-1">
        <span>{item.icon} {item.label}</span>
        <span className="text-success font-bold">{item.xp}</span>
      </div>
    ))}
  </div>
</div>
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] Leaderboard sahifasida top 20 foydalanuvchi ko'rsatiladi
- [ ] Podium (Top 3) maxsus dizaynda ko'rsatiladi
- [ ] Login qilgan user o'z pozitsiyasini ko'radi
- [ ] XP Engine widget ko'rsatiladi
- [ ] Kategoriya tabs ishlaydi (GLOBAL, JS, React, ...)
- [ ] "Ko'proq yuklash" pagination ishlaydi
- [ ] Level UP sahifasi/modali chiqadi
- [ ] Confetti animatsiya ishlaydi
- [ ] Level UP'dan keyin "Davom etish" tugmasi ishlaydi
- [ ] Dizayn Figma bilan mos keladi

---

## 🌐 BACKEND API — TO'LIQ QO'LLANMA

**Backend:** Node.js + Express.js | **Port:** 5000 | **Database:** MongoDB Atlas
**Jami endpointlar: ~75 ta**

### 🔗 Server URL'lari

| Muhit | URL |
|-------|-----|
| Local (Development) | `http://localhost:5000` |
| Production (Render) | `https://aidevixbackend.onrender.com` |

---

### 📖 Swagger UI — Interaktiv Hujjat

```
URL:      http://localhost:5000/api-docs
Username: admin
Password: admin123
```

**Swagger'da token kiritish:**
1. `http://localhost:5000/api-docs` ni oching
2. Yuqori o'ngda **"Authorize 🔓"** tugmasini bosing
3. `Bearer eyJhbGciOiJ...` formatida token kiriting
4. **"Authorize"** bosing — endi `🔒` belgili endpointlar ishlaydi

> **Token qanday olish?** Authentication → POST `/api/auth/login` → Execute → Response'dan `accessToken` ni ko'chiring

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

### 2️⃣ SUBSCRIPTIONS — `/api/subscriptions` (3 ta)

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/subscriptions/status` | ✅ | Obuna holati |
| POST | `/api/subscriptions/verify-instagram` | ✅ | Instagram tasdiqlash |
| POST | `/api/subscriptions/verify-telegram` | ✅ | Telegram tasdiqlash |

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
| GET | `/api/videos/:id` | ✅ + Obuna | Video + Telegram link |
| POST | `/api/videos/link/:linkId/use` | ✅ | Linkni belgilash |
| GET | `/api/videos/:id/questions` | ❌ | Q&A |
| POST | `/api/videos/:id/questions` | ✅ | Savol berish |
| POST | `/api/videos/:id/questions/:qId/answer` | ✅ Admin | Javob |
| POST | `/api/videos` | ✅ Admin | Yaratish |
| PUT | `/api/videos/:id` | ✅ Admin | Yangilash |
| DELETE | `/api/videos/:id` | ✅ Admin | O'chirish |

---

### 5️⃣ XP TIZIMI — `/api/xp` (8 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| **GET** | **`/api/xp/stats`** | ✅ | **XP, level, streak, badges** |
| POST | `/api/xp/video-watched/:videoId` | ✅ | +50 XP |
| **GET** | **`/api/xp/quiz/video/:videoId`** | ✅ | **Video quizini olish** |
| **POST** | **`/api/xp/quiz/:quizId`** | ✅ | **Quiz yechish (+XP)** |
| PUT | `/api/xp/profile` | ✅ | Profil yangilash |
| GET | `/api/xp/weekly-leaderboard` | ❌ | Haftalik TOP |
| POST | `/api/xp/streak-freeze` | ✅ | Freeze ishlatish |
| POST | `/api/xp/streak-freeze/add` | ✅ | Freeze qo'shish |

**GET `/api/xp/stats`** — Foydalanuvchi XP statistikasi:
```json
{
  "success": true,
  "data": {
    "stats": {
      "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "xp": 4234,
      "level": 4,
      "xpToNextLevel": 766,
      "streak": 3,
      "streakFreezes": 1,
      "videosWatched": 47,
      "quizzesCompleted": 23,
      "badges": [
        { "id": "first_video", "name": "Birinchi Video", "icon": "🎬", "earnedAt": "2026-03-01" },
        { "id": "week_streak", "name": "7 Kunlik Streak", "icon": "🔥", "earnedAt": "2026-03-07" }
      ],
      "bio": "React developer",
      "skills": ["JavaScript", "React", "Node.js"],
      "avatar": "https://res.cloudinary.com/aidevix/avatars/user123.jpg"
    }
  }
}
// xp = 4234, level = 4 (1000 XP = 1 Level)
// xpToNextLevel = 5000 - 4234 = 766 XP qoldi
// streak = ketma-ket faol kunlar
```

---

### 6️⃣ RANKING — `/api/ranking` (3 ta) ← SEN ISHLATASAN

| Method | URL | Auth | Vazifa |
|--------|-----|------|--------|
| GET | `/api/ranking/courses` | ❌ | Top kurslar |
| **GET** | **`/api/ranking/users`** | ❌ | **Top foydalanuvchilar (XP bo'yicha)** |
| **GET** | **`/api/ranking/users/:userId/position`** | ✅ | **O'z pozitsiyasi** |

**GET `/api/ranking/users`** — Leaderboard ro'yxati:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "username": "jamshidk",
        "avatar": "https://res.cloudinary.com/aidevix/avatars/jamshid.jpg",
        "xp": 145269,
        "level": 145,
        "streak": 62,
        "badges": ["grandmaster", "week_streak", "quiz_master"],
        "rank": 1
      },
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "username": "malikar",
        "xp": 98540,
        "level": 98,
        "streak": 31,
        "rank": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1642,
      "totalPages": 83
    }
  }
}
```

**GET `/api/ranking/users?page=2&limit=20`** — Sahifalash:
```json
{
  "success": true,
  "data": {
    "users": [ /* 21-40 o'rinlar */ ],
    "pagination": { "page": 2, "limit": 20, "total": 1642 }
  }
}
```

**GET `/api/ranking/users/:userId/position`** — O'z pozitsiyasi:
```json
{
  "success": true,
  "data": {
    "position": {
      "rank": 42,
      "totalUsers": 1642,
      "percentile": 11,
      "xp": 4234,
      "level": 4
    }
  }
}
// rank: 42 → "42-o'RIN"
// percentile: 11 → "Top 11%"
```

**useTopUsers hook qanday ishlaydi:**
```javascript
import { useTopUsers } from '@hooks/useRanking'
import { useUserStats } from '@hooks/useUserStats'

const LeaderboardPage = () => {
  const { users, loading, pagination, loadMore } = useTopUsers({ page: 1, limit: 20 })
  const { xp, level, streak, badges } = useUserStats()

  // users[0], users[1], users[2] → Podium (Top 3)
  // users.slice(3) → Jadval (#4 dan pastga)
  // pagination.total → "1,642 o'quvchi"

  const handleLoadMore = () => loadMore(pagination.page + 1)
}
```

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

### 🎮 XP Tizimi — To'liq Hisoblash

```
1000 XP = 1 Level
Level = Math.floor(xp / 1000) + 1

XP manbalari:
  +50 XP  → Video ko'rish (POST /api/xp/video-watched/:videoId)
  +10–100 XP → Quiz yechish (POST /api/xp/quiz/:quizId)
  +150 XP → Amaliy mashq
  +500 XP → Challenge

XP progress:
  xp = 4234 → Level 4
  currentLevelXP = 4234 % 1000 = 234
  progressBar = 234 / 1000 = 23.4%
  xpToNextLevel = 1000 - 234 = 766

Streak:
  Har kuni login qilsa streak oshadi
  1 kun o'tkazib yuborsa streak sıfırlanadi
  streakFreeze ishlatilsa saqlangan bo'ladi
```

### 🏆 Leaderboard To'liq Oqimi

```
1. LeaderboardPage ochiladi
2. GET /api/ranking/users?page=1&limit=20 → Top 20 yuklanadi
3. GET /api/xp/stats (agar login) → O'z XP/level/streak
4. GET /api/ranking/users/:userId/position → O'z o'rni

5. "Ko'proq yuklash" bosiladi
   → GET /api/ranking/users?page=2&limit=20
   → users massivga qo'shiladi (concat)

6. Level UP trigger:
   → Yangi video ko'riladi → POST /api/xp/video-watched/:videoId
   → Response: { newLevel: 5, leveledUp: true }
   → LevelUpPage/Modal ko'rsatiladi + Confetti 🎉
```
