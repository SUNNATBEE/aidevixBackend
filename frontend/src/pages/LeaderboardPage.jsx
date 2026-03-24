<<<<<<< Updated upstream
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
=======
// LeaderboardPage.jsx — SUHROB
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import axios from 'axios'
import { HiTrophy, HiBolt } from 'react-icons/hi2'
import { useUserStats } from '@hooks/useUserStats'
import { selectUser, selectIsLoggedIn } from '@store/slices/authSlice'
import UserXPCard from '@components/leaderboard/UserXPCard'
import LeaderboardTable from '@components/leaderboard/LeaderboardTable'
import LevelUpModal from '@components/leaderboard/LevelUpModal'

const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/api$/, '') || 'https://aidevix-backend-production.up.railway.app'

const TABS = [
  { key: 'all', label: 'GLOBAL' },
  { key: 'javascript', label: 'JAVASCRIPT' },
  { key: 'react', label: 'REACT' },
  { key: 'python', label: 'PYTHON' },
  { key: 'ui/ux', label: 'UI/UX' },
]

const XP_ENGINE = [
  { icon: '🎬', label: 'Video Darslar', xp: '+50 XP', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: '📝', label: 'Quizlar', xp: '+100 XP', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: '💻', label: 'Amaliy Mashq', xp: '+150 XP', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { icon: '🚀', label: 'Challenge', xp: '+500 XP', color: 'text-orange-400', bg: 'bg-orange-500/10' },
]

const LEVEL_NAMES = {
  1: 'Yangi Boshlovchi', 5: 'Qiziquvchan', 10: 'Izlanuvchi',
  15: 'Bilimdon', 20: 'Ekspert', 25: 'Mantiq Ustasi',
  30: 'Grandmaster', 35: 'Ustoz', 40: 'Afsonaviy', 50: 'Immortal',
}
const getLevelName = (lvl) => {
  if (!lvl) return 'Yangi Boshlovchi'
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  return LEVEL_NAMES[keys.find((k) => lvl >= k)] || 'Yangi Boshlovchi'
}
const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

// ── Podium Card ──────────────────────────────────────────────
function PodiumCard({ user, rank }) {
  if (!user) return null
  const username = user.user?.username || user.user?.name || 'Foydalanuvchi'
  const cfg = {
    1: { wrap: 'order-2 z-10', card: 'border-yellow-500/50 bg-yellow-900/10', badgeBg: 'bg-yellow-500', avatarBorder: 'border-yellow-500', avatarSize: 'w-20 h-20', shadow: '0 0 30px rgba(234,179,8,0.2)' },
    2: { wrap: 'order-1', card: 'border-gray-400/30 bg-base-200', badgeBg: 'bg-gray-400', avatarBorder: 'border-gray-400/50', avatarSize: 'w-16 h-16', shadow: 'none' },
    3: { wrap: 'order-3', card: 'border-amber-600/30 bg-base-200', badgeBg: 'bg-amber-600', avatarBorder: 'border-amber-600/50', avatarSize: 'w-16 h-16', shadow: 'none' },
  }
  const c = cfg[rank]
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, type: 'spring', stiffness: 180 }}
      className={`flex-1 max-w-[160px] ${c.wrap}`}
    >
      <div className={`relative flex flex-col items-center p-4 rounded-2xl border ${c.card}`} style={{ boxShadow: c.shadow }}>
        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full ${c.badgeBg} flex items-center justify-center text-white font-black text-sm`}>
          {rank}
        </div>
        {rank === 1 && <HiTrophy className="text-yellow-400 text-3xl mb-2" />}
        <div className={`${c.avatarSize} rounded-full border-2 ${c.avatarBorder} flex items-center justify-center font-bold text-lg overflow-hidden bg-base-300`}>
          {user.user?.avatar
            ? <img src={user.user.avatar} alt={username} className="w-full h-full object-cover" />
            : getInitials(username)}
        </div>
        <p className="font-bold text-sm mt-2 text-center truncate w-full">{username}</p>
        {rank === 1 ? (
          <>
            <span className="mt-1 px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] font-bold tracking-wider">GRANDMASTER</span>
            <p className="text-yellow-400 font-black text-base mt-2">{(user.xp || 0).toLocaleString()} XP</p>
            <div className="flex gap-3 mt-1 text-xs text-base-content/50">
              <span>LVL <b className="text-white">{user.level ?? 1}</b></span>
              <span>🔥 <b className="text-white">{user.streak ?? 0}</b></span>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-base-content/40 mt-0.5">{getLevelName(user.level || 1)}</p>
            <p className="text-primary font-bold text-sm mt-1">{(user.xp || 0).toLocaleString()} XP</p>
            <div className="w-full h-1 bg-base-300 rounded-full mt-2">
              <div className="h-full bg-primary/50 rounded-full w-1/2" />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const isLoggedIn = useSelector(selectIsLoggedIn)
  const currentUser = useSelector(selectUser)
  const { xp, level, levelProgress, xpToNextLevel, streak, badges, justLeveledUp, newLevel, quizResult, dismissLevelUp } = useUserStats()

  const MOCK_USERS = [
    { rank: 1, xp: 145200, level: 99, streak: 84, badges: ['🏆','⚡'], user: { _id: 'm1', username: 'Jamshid K.' } },
    { rank: 2, xp: 92450,  level: 80, streak: 42, badges: ['🥈'],      user: { _id: 'm2', username: 'Malika R.' } },
    { rank: 3, xp: 86100,  level: 80, streak: 30, badges: ['🥉'],      user: { _id: 'm3', username: 'Azizbek T.' } },
    { rank: 4, xp: 75400,  level: 78, streak: 20, badges: ['🔥'],      user: { _id: 'm4', username: 'Rustam B.' } },
    { rank: 5, xp: 72150,  level: 76, streak: 15, badges: ['⭐'],      user: { _id: 'm5', username: 'Sevara M.' } },
    { rank: 6, xp: 69800,  level: 74, streak: 10, badges: [],          user: { _id: 'm6', username: 'Javlon D.' } },
    { rank: 7, xp: 64200,  level: 71, streak: 8,  badges: [],          user: { _id: 'm7', username: 'Nodira S.' } },
    { rank: 8, xp: 58900,  level: 68, streak: 5,  badges: [],          user: { _id: 'm8', username: 'Bobur A.' } },
  ]

  const fetchUsers = async (p = 1, replace = false) => {
    setLoading(true)
    try {
      const url = `${BASE}/api/ranking/users`
      console.log('🔍 Fetching:', url)
      const { data } = await axios.get(url, { params: { page: p, limit: 20 } })
      console.log('✅ API response:', data)
      const list = data?.data?.users || data?.users || []
      const pagination = data?.data?.pagination || data?.pagination || {}
      console.log('👥 Users from API:', list.length, list)
      const finalList = list.length > 0 ? list : (p === 1 ? MOCK_USERS : [])
      setUsers(prev => replace ? finalList : [...prev, ...finalList])
      setHasMore(list.length > 0 && p < (pagination.pages || pagination.totalPages || 1))
    } catch (e) {
      console.error('❌ Leaderboard fetch error:', e.message, e.response?.data)
      if (p === 1) setUsers(MOCK_USERS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers(1, true) }, [])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    fetchUsers(next, false)
  }

  const podiumUsers = users.slice(0, 3)
  const tableUsers = users.slice(3)

  return (
    <div className="min-h-screen bg-base-100">
      <LevelUpModal
        isOpen={justLeveledUp}
        level={newLevel}
        levelName={getLevelName(newLevel)}
        xp={xp}
        quizResult={quizResult}
        onClose={dismissLevelUp}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-4xl font-black tracking-tight">
            GLOBAL <span className="text-primary">AUTHORITY</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">

            {isLoggedIn && (
              <UserXPCard xp={xp} level={level} levelProgress={levelProgress} xpToNextLevel={xpToNextLevel} streak={streak} badges={badges} />
            )}

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`btn btn-sm rounded-lg font-semibold transition-all ${
                    activeTab === tab.key ? 'btn-primary shadow-md shadow-primary/30' : 'btn-ghost border border-base-300 text-base-content/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Podium */}
            {loading && users.length === 0 ? (
              <div className="flex justify-center items-end gap-4 py-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton rounded-2xl" style={{ width: 130, height: i === 1 ? 220 : 180 }} />
                ))}
              </div>
            ) : podiumUsers.length >= 3 ? (
              <div className="flex items-end justify-center gap-3 py-4">
                <PodiumCard user={podiumUsers[1]} rank={2} />
                <PodiumCard user={podiumUsers[0]} rank={1} />
                <PodiumCard user={podiumUsers[2]} rank={3} />
              </div>
            ) : null}

            {/* Table */}
            {loading && users.length === 0 ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
              </div>
            ) : (
              <LeaderboardTable users={tableUsers} currentUserId={currentUser?._id} loading={false} />
            )}

            {/* Load more */}
            {hasMore && (
              <div className="text-center py-4">
                <button onClick={handleLoadMore} disabled={loading} className="btn btn-outline btn-sm px-8 gap-2">
                  {loading && <span className="loading loading-spinner loading-xs" />}
                  + YANA YUKLASH
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="rounded-xl border border-base-300 bg-base-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-base-300">
                <HiBolt className="text-yellow-400 text-lg" />
                <span className="font-bold text-sm tracking-wide">XP ENGINE</span>
              </div>
              <div className="p-3 space-y-1">
                {XP_ENGINE.map((item) => (
                  <div key={item.label} className={`flex justify-between items-center px-3 py-2 rounded-lg ${item.bg}`}>
                    <span className="text-sm flex items-center gap-2 text-base-content/80">
                      <span>{item.icon}</span> {item.label}
                    </span>
                    <span className={`font-black text-sm ${item.color}`}>{item.xp}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-[10px] text-base-content/40 uppercase tracking-widest mb-3">Haftalik Missiya</p>
              <div className="bg-base-200/80 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm">JavaScript Master</p>
                  <span className="badge badge-primary badge-xs whitespace-nowrap">3 kun qoldi</span>
                </div>
                <p className="text-xs text-base-content/40 mt-1 leading-relaxed">
                  5 ta JavaScript quizini 100% natija bilan yakunlang.
                </p>
                <div className="w-full h-1.5 bg-base-300 rounded-full mt-3">
                  <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-full bg-primary rounded-full" />
                </div>
                <p className="text-[10px] text-base-content/30 mt-1 text-right">2/5 bajarildi</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
>>>>>>> Stashed changes
}
