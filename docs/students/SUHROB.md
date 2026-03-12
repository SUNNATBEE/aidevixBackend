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
