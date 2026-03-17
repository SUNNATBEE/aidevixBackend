// ============================================================
// OQUVCHI  : SUHROB
// BRANCH   : feature/suhrob-leaderboard
// FAYL     : src/components/leaderboard/LeaderboardTable.jsx
// ============================================================
//
// VAZIFA: Leaderboard jadval komponentini yaratish (#4 dan pastga)
//
// JADVAL QATORI TARKIBI (har bir user uchun):
//   - Rank raqami (#4, #5, ...)
//   - Avatar (dumaloq rasm yoki ism birinchi harfi)
//   - Ism + Level nomi
//   - XP miqdori (bold)
//   - Badges ikonkalar
//   - Hozirgi foydalanuvchi qatori: alohida rang (highlight)
//
// PROPS:
//   - users: array  — [{ rank, user: { _id, username, avatar }, xp, level, streak, badges }]
//   - currentUserId: string — hozirgi login qilgan user'ning ID si
//   - loading: boolean
//
// HOLAT:
//   - loading = true  → SkeletonCard type="user" count={5}
//   - users bo'sh     → "Hali ma'lumot yo'q" bo'sh holat
//   - Bo'lmasa        → jadval qatorlari
//
// KERAKLI IMPORTLAR:
//   import SkeletonCard from '@components/loading/SkeletonCard'
//   import { FaCrown, FaMedal } from 'react-icons/fa'
// ============================================================

const LeaderboardTable = ({ users = [], currentUserId, loading }) => {
  // TODO: SUHROB bu komponentni to'liq yozadi
  return null
}

export default LeaderboardTable
