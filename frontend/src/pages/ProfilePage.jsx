// ============================================================
// OQUVCHI  : FIRDAVS
// BRANCH   : feature/firdavs-auth
// ROUTE    : /profile
// ============================================================
//
// VAZIFA: Foydalanuvchi profil sahifasini yaratish
//
// Bu sahifada bo'lishi kerak:
//
//  1. PROFIL HEADER (katta banner):
//     - Avatar (katta daire: foydalanuvchi ismining birinchi harfi)
//     - Username (katta, bold) + email
//     - Level badge: "🏆 Level 12" + level nomi: "Bilimdon"
//     - XP Progress bar: "1,200 / 2,000 XP  [████████──] 60%"
//     - Streak badge: "🔥 7 kun streak"
//     - "Tahrirlash" tugmasi
//
//  2. STATISTIKA KARTALAR (2x2 grid):
//     - 🎬 Ko'rilgan videolar: videosWatched
//     - 📝 Yechilgan quizlar: quizzesCompleted
//     - 💫 Jami XP: xp
//     - 🏅 Badgelar: badges.length
//     - framer-motion stagger animatsiya
//
//  3. FOYDALANUVCHI MA'LUMOTLARI:
//     - Username, Email, Role, Ro'yxat sanasi
//     - Har biri: ikonka + label + qiymat
//     - "Profilni tahrirlash" tugmasi
//
//  4. OBUNA HOLATI:
//     - Telegram: Faol ✓ yoki Tasdiqlanmagan ⚠️
//     - Instagram: Faol ✓ yoki Tasdiqlanmagan ⚠️
//     - "Obunani boshqarish →" link /subscription ga
//
//  5. TAHRIRLASH MODAL (editOpen state bilan):
//     - framer-motion yoki DaisyUI modal
//     - Username input
//     - Bio textarea
//     - Skills inputlar
//     - "Saqlash" → PUT /api/xp/profile
//     - "Bekor qilish" tugmasi
//
// HOOKS:
//   useSelector(selectUser)         → { username, email, role, createdAt }
//   useSelector(selectTelegramSub)  → { subscribed, username }
//   useSelector(selectInstagramSub) → { subscribed, username }
//   useUserStats()                  → { xp, level, levelProgress, streak, badges,
//                                       videosWatched, quizzesCompleted, updateProfile }
//
// API:
//   GET /api/xp/stats    → UserStats (xp, level, streak, badges...)
//   PUT /api/xp/profile  → { username, bio, skills }
//
// KERAKLI IMPORTLAR:
//   import { useSelector } from 'react-redux'
//   import { selectUser } from '@store/slices/authSlice'
//   import { selectTelegramSub, selectInstagramSub } from '@store/slices/subscriptionSlice'
//   import { useUserStats } from '@hooks/useUserStats'
//   import { formatDate } from '@utils/formatDate'
//
// FIGMA: "Aidevix Profile Page" sahifasini qarang
// ============================================================

export default function ProfilePage() {
  // TODO: FIRDAVS bu sahifani to'liq yozadi
  return null
}
