# 🎮 SUHROB — Top User Leaderboard + Level Up Page (Next.js + TypeScript)

> [!IMPORTANT]
> **DIQQAT:** Loyiha **Next.js 14 (App Router)** ga o'tkazildi. Davom etishdan oldin [Next.js Migratsiya Qo'llanmasini](../MIGRATION_GUIDE.md) to'liq o'qib chiqing.


## 📋 Vazifa Qisqacha
Sen **global foydalanuvchilar reytingini** (XP bo'yicha) va **Level UP celebration sahifasini** **Next.js App Router** va **TypeScript** yordamida yasaysan.

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

## ⚡ Nega Next.js + TypeScript?

### Next.js afzalliklari (sening vazifangda):
| Muammo (React) | Yechim (Next.js) |
|----------------|------------------|
| Leaderboard sahifasi Google'da **indekslanmaydi** | SSR bilan Google bot **tayyor HTML** ko'radi |
| `useEffect` da API chaqirib, loading ko'rsatasan | **Server Component**'da `fetch` — sahifa tayyor keladi |
| `react-router-dom` bilan routing | `app/leaderboard/page.tsx` = `/leaderboard` (fayl = yo'l) |
| `import { useNavigate } from 'react-router-dom'` | `import { useRouter } from 'next/navigation'` |

### TypeScript afzalliklari (sening vazifangda):
| Muammo (JavaScript) | Yechim (TypeScript) |
|---------------------|---------------------|
| `user.xp` nima turi? `number` mi? `string` mi? | `xp: number` — **aniq belgilangan** |
| `users.map(u => u.nmae)` — typo brauzerda ko'rinadi | IDE **yozish paytida** xato ko'rsatadi |
| `badges` massiv ichida nima bor aniq emas | `Badge[]` turi bor — `.` bosib ko'rasan |

---

## 📁 Sening Fayllaring (Next.js App Router)

```
frontend/
├── app/
│   ├── leaderboard/
│   │   └── page.tsx                    ← Sen yozasan (Leaderboard sahifasi)
│   └── level-up/
│       └── page.tsx                    ← Sen yozasan (Level Up sahifasi)
│
├── components/
│   └── leaderboard/
│       ├── LeaderboardTable.tsx         ← Sen yozasan
│       ├── LevelUpModal.tsx            ← Sen yozasan
│       ├── UserXPCard.tsx              ← Sen yozasan
│       └── Podium.tsx                  ← Sen yozasan
│
├── types/
│   ├── ranking.ts                      ← Tayyor turlar (pastda berilgan)
│   └── xp.ts                          ← XP turlari
│
├── lib/
│   ├── api/
│   │   ├── rankingApi.ts               ← Allaqachon yozilgan
│   │   └── userApi.ts                  ← Allaqachon yozilgan
│   └── hooks/
│       ├── useRanking.ts               ← useTopUsers() ishlatasan
│       └── useUserStats.ts             ← Allaqachon yozilgan
│
└── store/slices/
    ├── rankingSlice.ts                  ← Allaqachon yozilgan
    └── userStatsSlice.ts                ← Allaqachon yozilgan
```

> **Esda tuting:** `.jsx` → `.tsx`, `.js` → `.ts` bo'ldi.
> Next.js da `pages/LeaderboardPage.jsx` emas → `app/leaderboard/page.tsx`

---

## 🔑 TypeScript Turlari (Types)

```typescript
// types/ranking.ts

/** Leaderboard'dagi bitta foydalanuvchi */
export interface RankedUser {
  _id: string;
  username: string;
  avatar: string | null;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  rank: number;
}

/** Foydalanuvchining o'z pozitsiyasi */
export interface UserPosition {
  rank: number;
  totalUsers: number;
  percentile: number;    // Top N% (masalan: 11 = "Top 11%")
  xp: number;
  level: number;
}

/** Sahifalash (Pagination) */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Leaderboard API javobi */
export interface LeaderboardResponse {
  success: boolean;
  data: {
    users: RankedUser[];
    pagination: Pagination;
  };
}

/** Pozitsiya API javobi */
export interface PositionResponse {
  success: boolean;
  data: {
    position: UserPosition;
  };
}
```

```typescript
// types/xp.ts

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
}

/** XP statistikasi */
export interface UserStats {
  userId: string;
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
  streakFreezes: number;
  videosWatched: number;
  quizzesCompleted: number;
  badges: Badge[];
  bio: string | null;
  skills: string[];
  avatar: string | null;
}

/** XP Engine — qancha XP beriladi */
export interface XPSource {
  label: string;
  xp: string;
  icon: string;
}

/** Level UP triggeri */
export interface LevelUpEvent {
  newLevel: number;
  leveledUp: boolean;
}
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
Confetti + animatsiya bilan darajaga erishganlik sahifasi.

---

## 📝 Kod Misollari (Next.js + TypeScript)

### Leaderboard sahifasi (`app/leaderboard/page.tsx`):
```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { RankedUser, UserPosition, Pagination } from '@/types/ranking'
import type { UserStats, XPSource } from '@/types/xp'
import UserXPCard from '@/components/leaderboard/UserXPCard'
import Podium from '@/components/leaderboard/Podium'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'

// XP Engine ma'lumotlari — tip bilan himoyalangan
const XP_SOURCES: XPSource[] = [
  { label: 'Video Ko\'rish', xp: '+50 XP', icon: '🎬' },
  { label: 'Quizlar', xp: '+100 XP', icon: '📝' },
  { label: 'Amaliy Mashq', xp: '+150 XP', icon: '💻' },
  { label: 'Challenge', xp: '+500 XP', icon: '🚀' },
]

export default function LeaderboardPage() {
  const [users, setUsers] = useState<RankedUser[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [position, setPosition] = useState<UserPosition | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // ... fetch logic

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Foydalanuvchi o'z reytingi */}
      {position && <UserXPCard position={position} />}

      {/* Podium — Top 3 */}
      <Podium top3={users.slice(0, 3)} />

      {/* Jadval — #4 dan */}
      <LeaderboardTable users={users.slice(3)} />

      {/* Ko'proq yuklash */}
      {pagination && pagination.page < pagination.totalPages && (
        <button
          onClick={() => loadMore(pagination.page + 1)}
          className="btn btn-primary btn-outline mt-6 mx-auto block"
        >
          + Yana yuklash
        </button>
      )}
    </main>
  )
}
```

### LevelUp Modal (`components/leaderboard/LevelUpModal.tsx`):
```tsx
'use client'

import { FC } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'

interface LevelUpModalProps {
  isVisible: boolean;
  newLevel: number;
  onDismiss: () => void;
}

const LevelUpModal: FC<LevelUpModalProps> = ({ isVisible, newLevel, onDismiss }) => {
  return (
    <AnimatePresence>
      {isVisible && (
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
            <button onClick={onDismiss} className="btn btn-primary mt-6 w-full">
              Davom etish →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LevelUpModal
```

> **Muhim farqlar (React vs Next.js):**
> - `const LevelUpModal = ({ props }) =>` → `const LevelUpModal: FC<Props> = ({ props }) =>`
> - Props'lar uchun **interface** yozish **SHART** (TypeScript)
> - `useNavigate()` dan foydalanmang → `useRouter()` (`next/navigation`)
> - `<Link to="/">` → `<Link href="/">`
> - Fayl nomlari `.tsx` bo'lishi kerak

---

## 🛠️ Texnologiyalar

```bash
# Next.js da o'rnatilgan:
next                   # Framework
typescript             # Tip xavfsizlik
framer-motion          # Animatsiyalar
react-icons            # FaCrown, FaMedal, FaTrophy, FaFire

# QO'SHISH KERAK:
npm install react-confetti

# O'CHIRILADIGAN:
# react-router-dom    ← Next.js da kerak emas
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
| `/api/ranking/users` | GET | ❌ Yo'q | Top foydalanuvchilar |
| `/api/ranking/users?page=1&limit=20` | GET | ❌ Yo'q | Sahifalash bilan |
| `/api/ranking/users/:userId/position` | GET | ✅ Bearer | O'z pozitsiyasi |
| `/api/xp/stats` | GET | ✅ Bearer | XP, level, streak |
| `/api/xp/quiz/:quizId` | POST | ✅ Bearer | Quiz yechish |
| `/api/xp/quiz/video/:videoId` | GET | ✅ Bearer | Video quizini olish |

---

## 🎮 XP Tizimi — To'liq Hisoblash

```
1000 XP = 1 Level
Level = Math.floor(xp / 1000) + 1

XP manbalari:
  +50 XP  → Video ko'rish
  +10–100 XP → Quiz yechish
  +150 XP → Amaliy mashq
  +500 XP → Challenge

TypeScript da progress hisoblash:
  const currentLevelXP: number = xp % 1000            // 234
  const progressPercent: number = (currentLevelXP / 1000) * 100  // 23.4%
  const xpToNextLevel: number = 1000 - currentLevelXP  // 766
```

---

## ✅ Tekshiruv Ro'yxati
- [ ] Leaderboard sahifasida top 20 foydalanuvchi ko'rsatiladi
- [ ] Podium (Top 3) maxsus dizaynda ko'rsatiladi
- [ ] Login qilgan user o'z pozitsiyasini ko'radi
- [ ] XP Engine widget ko'rsatiladi
- [ ] Kategoriya tabs ishlaydi (GLOBAL, JS, React, ...)
- [ ] "Ko'proq yuklash" pagination ishlaydi
- [ ] Level UP modali chiqadi
- [ ] Confetti animatsiya ishlaydi
- [ ] Barcha fayl nomlari `.tsx` / `.ts`
- [ ] Har qanday `any` tip ishlatilmagan
- [ ] Props uchun interface yozilgan
- [ ] Dizayn Figma bilan mos keladi
