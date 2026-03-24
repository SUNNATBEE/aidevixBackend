<<<<<<< Updated upstream
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
=======
// LeaderboardTable.jsx — SUHROB
import { motion } from 'framer-motion'
import { FaFire, FaMedal } from 'react-icons/fa'
import { HiTrophy } from 'react-icons/hi2'

const LEVEL_NAMES = {
  1: 'Yangi Boshlovchi', 5: 'Qiziquvchan', 10: 'Izlanuvchi',
  15: 'Bilimdon', 20: 'Ekspert', 25: 'Mantiq Ustasi',
  30: 'Grandmaster', 35: 'Ustoz', 40: 'Afsonaviy', 50: 'Immortal',
}
const getLevelName = (level) => {
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  return LEVEL_NAMES[keys.find((k) => level >= k)] || 'Yangi Boshlovchi'
}
const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

const LeaderboardTable = ({ users = [], currentUserId, loading }) => {
  if (loading) return null

  return (
    <div className="rounded-xl overflow-hidden border border-base-300 bg-base-200">
      {/* Header */}
      <div className="grid grid-cols-[56px_1fr_72px_100px_72px] gap-2 px-4 py-2 text-[11px] text-base-content/40 uppercase tracking-wider border-b border-base-300 bg-base-300/40">
        <span>Rank</span>
        <span>O'yinchi</span>
        <span className="text-center">Level</span>
        <span className="text-center">XP</span>
        <span className="text-center">Badges</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-base-300/60">
        {users.map((u, i) => {
          const isMe = u.user?._id === currentUserId
          const username = u.user?.username || u.user?.name || 'Foydalanuvchi'
          const levelName = getLevelName(u.level || 1)

          return (
            <motion.div
              key={u.rank ?? i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`grid grid-cols-[56px_1fr_72px_100px_72px] gap-2 px-4 py-3 items-center transition-colors
                ${isMe
                  ? 'bg-primary/10 border-l-2 border-primary'
                  : 'hover:bg-base-300/30'
                }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center">
                <span className={`font-bold text-sm ${isMe ? 'text-primary' : 'text-base-content/50'}`}>
                  #{u.rank}
                </span>
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden
                  ${isMe ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content'}`}>
                  {u.user?.avatar
                    ? <img src={u.user.avatar} alt={username} className="w-full h-full object-cover" />
                    : getInitials(username)
                  }
                </div>
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${isMe ? 'text-primary' : ''}`}>
                    {username}
                    {isMe && <span className="text-xs text-primary/60 ml-1">(Siz)</span>}
                  </p>
                  <p className="text-xs text-base-content/40 truncate">{levelName}</p>
                </div>
              </div>

              {/* Level */}
              <div className="text-center">
                <span className="badge badge-sm badge-ghost font-semibold">{u.level ?? 1}</span>
              </div>

              {/* XP */}
              <div className="text-center">
                <span className="font-bold text-sm text-primary">{(u.xp || 0).toLocaleString()}</span>
                <span className="text-xs text-base-content/40 ml-0.5">XP</span>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-center gap-1">
                {u.streak > 0 && (
                  <FaFire className="text-orange-400 text-sm" title={`${u.streak} kun streak`} />
                )}
                {u.badges?.length > 0 && (
                  <span className="flex items-center gap-0.5 text-yellow-400 text-sm">
                    <HiTrophy />
                    <span className="text-xs text-base-content/50">{u.badges.length}</span>
                  </span>
                )}
                {!u.streak && !u.badges?.length && (
                  <FaMedal className="text-base-content/20 text-sm" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-base-content/40">
          <HiTrophy className="text-4xl mx-auto mb-2 opacity-20" />
          <p className="text-sm">Ma'lumot topilmadi</p>
        </div>
      )}
    </div>
  )
>>>>>>> Stashed changes
}

export default LeaderboardTable
