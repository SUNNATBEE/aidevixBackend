# 🎨 AIDEVIX FRONTEND — PROFESSIONAL ARCHITECTURE

Ushbu hujjat Aidevix platformasining frontend qismi (Next.js 14 App Router, NextUI, Redux Toolkit) arxitekturasini batafsil tushuntiradi.

---

## 📂 Core Structure: `frontend/src/app/` (Pages & Routing)
Next.js App Router tizimi asosida qurilgan sahifalar.

| Yo'l | Vazifasi |
| :--- | :--- |
| `page.tsx` | **Landing Page:** Platformaning bosh sahifasi (Hero, Stats, Advantages). |
| `courses/page.tsx` | Barcha kurslar ro'yxati, filterlar va qidiruv. |
| `courses/[id]/page.tsx` | Kursning ichki sahifasi: darslar ro'yxati, muallif va "Videoni ko'rish" tugmasi. |
| `videos/[id]/page.tsx` | **LMS View:** Video pleer, dars matni, Quiz bo'limi va Rating. |
| `leaderboard/page.tsx` | **Ranking:** Global foydalanuvchilar reytingi, Podium va XP Engine info. |
| `profile/page.tsx` | Foydalanuvchi shaxsiy kabineti: XP, badge'lar va ko'rilgan kurslar. |
| `subscription/page.tsx`| Ijtimoiy tarmoq obunalarini boshqarish sahifasi. |
| `referral/page.tsx` | Do'stlarni taklif qilish va 1000 XP bonus olish sahifasi. |
| `admin/page.tsx` | **Super Admin:** Platforma statistikasi (yangi userlar, to'lovlar). |
| `admin/courses/` | Kurslarni tahrirlash, yangi video qo'shish va tartiblash uchun admin dashboard. |
| `auth/telegram-login/`| Bot orqali kelganda avtomatik saytga kirituvchi ko'prik sahifa. |

### 🧩 Components (`frontend/src/components/`)
UI interfeysini shakllantiruvchi qayta ishlatiladigan qismlar.

| Papka | Asosiy Fayllar va Vazifasi |
| :--- | :--- |
| `common/` | `AICoach`, `LiveActivityTicker` (jonli harakatlar), `DailyRewardModal`, `Skeleton` (yuklanish). |
| `layout/` | `Navbar` (XP ko'rsatkichi bilan), `Footer`, `ClientLayoutWrapper`. |
| `subscription/` | `SubscriptionGate` (modal), `TelegramVerify` (auto-robot orqali ulash), `InstagramVerify`. |
| `leaderboard/` | `LeaderboardTable` (dinamik jadval), `LevelUpModal` (daraja oshganda chiqadigan animatsiya). |
| `visuals/` | 3D elementlar, `FloatingCode`, `ParticleHero` va boshqa premium effektlar. |
| `courses/` | `CourseCard` (shisha effektli), `CourseFilter`. |

### 🔌 API Layer (`frontend/src/api/`)
Backend bilan aloqa qiluvchi servislar.

| Fayl | Vazifasi |
| :--- | :--- |
| `axiosInstance.ts` | Barcha so'rovlar uchun asosiy sozlamalar (BaseURL, Auth Header). |
| `authApi.ts` | Login, Register va Refresh Token so'rovlari. |
| `subscriptionApi.ts` | **New:** `generateToken` (bot ulanishi) va `checkToken` (polling) metodlari. |
| `userApi.ts` | XP statsini olish va profilni yangilash. |
| `videoApi.ts` | Video ma'lumotlari va BunnyCDN xavfsiz tokenlarini olish. |

### 🧠 State Management (`frontend/src/store/`)
Redux Toolkit orqali global holatni saqlash.

- `slices/authSlice.ts` — User, Login holati.
- `slices/subscriptionSlice.ts` — Telegram/Instagram obuna statuslari.
- `slices/userStatsSlice.ts` — XP, Level va Badge'lar.
- `slices/courseSlice.ts` — Kurslar ro'yxati va filterlar.

### 🪝 Hooks, Context & Utils
- **Hooks**: `useAuth`, `useSubscription`, `useUserStats` (kodni qisqartirish uchun).
- **Context**: `LangContext` (UZ/RU/EN), `ThemeContext` (Dark/Light), `SoundContext`.
- **Utils**: `xpLevel.ts` (unvonlar logikasi), `i18n.ts` (tarjimalar).

---

> [!IMPORTANT]
> **Animations:** Saytda `framer-motion` va `GSAP` dan faol foydalanilgan. Har bir sahifa silliq o'tishlar (Page Transitions) bilan ta'minlangan.
