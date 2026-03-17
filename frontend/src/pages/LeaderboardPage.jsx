// ============================================================
// OQUVCHI  : SUHROB
// BRANCH   : feature/suhrob-leaderboard
// ROUTE    : /leaderboard
// ============================================================
//
// VAZIFA: Global foydalanuvchilar reytingi sahifasini yaratish
//
// LAYOUT: Chap panel (2/3) + O'ng panel (1/3 — desktop'da)
//
// CHAP PANEL:
//
//  1. HOZIRGI USER'NIN REYTINGI (faqat login bo'lganda):
//     UserXPCard komponenti:
//     ┌─────────────────────────────────────────────┐
//     │  42-O'RIN     SIZNING REYTINGINGIZ           │
//     │  Top 11%                                     │
//     │  XP: 4,234  |  Streak: 3 kun  |  🏆 3 badge │
//     │  [████████████──────] progress bar           │
//     └─────────────────────────────────────────────┘
//     - O'rin: GET /api/ranking/users/:userId/position
//
//  2. KATEGORIYA TABS:
//     - [ GLOBAL ] [ JAVASCRIPT ] [ REACT ] [ NODE.JS ] [ PYTHON ]
//     - activeTab state bilan boshqariladi
//
//  3. PODIUM — Top 3 foydalanuvchi:
//     - [2-o'rin (chapda)] [1-o'rin (o'rtada, 👑)] [3-o'rin (o'ngda)]
//     - 1-o'rin: katta, oltin rang, toj
//     - Har karta: avatar, ism, level, XP
//     - framer-motion animatsiya
//
//  4. JADVAL — #4 dan pastga:
//     - LeaderboardTable komponenti
//     - loading bo'lsa SkeletonCard type="user" count={5}
//     - LeaderboardTable props: users, currentUserId, loading
//
//  5. "+ YANA YUKLASH" tugmasi:
//     - pagination.page < pagination.pages bo'lsa ko'rinadi
//
// O'NG PANEL (desktop'da):
//   ⚡ XP ENGINE karti:
//   | 🎬 Video Ko'rish  | +50 XP  |
//   | 📝 Quizlar        | +100 XP |
//   | 💻 Amaliy Mashq   | +150 XP |
//   | 🏗️ Loyiha         | +200 XP |
//   | 🚀 Challenge      | +500 XP |
//
// LEVEL UP MODAL:
//   LevelUpModal — justLeveledUp true bo'lsa avtomatik ochiladi
//   <LevelUpModal isOpen={justLeveledUp} level={newLevel} ... onClose={dismissLevelUp} />
//
// HOOKS:
//   useTopUsers({ page, limit })   → { users, loading, pagination, loadMore }
//   useUserStats()                 → { xp, level, streak, justLeveledUp, newLevel, dismissLevelUp }
//   useSelector(selectUser)        → { _id, username }
//
// API:
//   GET /api/ranking/users?page=1&limit=20          → Top foydalanuvchilar
//   GET /api/ranking/users/:userId/position         → O'z pozitsiyasi
//   GET /api/xp/stats                               → XP, level, streak
//
// KERAKLI IMPORTLAR:
//   import { useTopUsers } from '@hooks/useRanking'
//   import { useUserStats } from '@hooks/useUserStats'
//   import { selectUser } from '@store/slices/authSlice'
//   import LeaderboardTable from '@components/leaderboard/LeaderboardTable'
//   import UserXPCard from '@components/leaderboard/UserXPCard'
//   import LevelUpModal from '@components/leaderboard/LevelUpModal'
//   import SkeletonCard from '@components/loading/SkeletonCard'
//
// FIGMA: "Aidevix Global Leaderboard" sahifasini qarang
// ============================================================

export default function LeaderboardPage() {
  // TODO: SUHROB bu sahifani to'liq yozadi
  return null
}
