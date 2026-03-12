// ============================================================
//  LeaderboardPage.jsx
//  KIM YOZADI : SUHROB
//  BRANCH     : feature/suhrob-leaderboard
//  ROUTE      : /leaderboard
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  1. TEPADA — Hozirgi user'ning o'z reytingi:
//       [ 42-O'RIN | SIZNING REYTINGINGIZ | Top 11% ]
//       [ XP: 4,234 | Streak: 3 kun | 🏆 3 badge  ]
//       [████████████──────] 4234/5000 XP progress bar
//
//  2. KATEGORIYA TABS:
//       [ GLOBAL ] [ JAVASCRIPT ] [ REACT ] [ PYTHON ] [ LINUX ]
//
//  3. PODIUM — Top 3 (alohida katta kartalar):
//       [2-Malika R.]  [1-Jamshid K. 👑]  [3-Azizbek T.]
//
//  4. XP ENGINE (o'ng panel):
//       🎬 Video Ko'rish  +50 XP
//       📝 Quizlar       +100 XP
//       💻 Amaliy Mashq  +150 XP
//       🚀 Challenge     +500 XP
//
//  5. JADVAL — #4 dan keyingi foydalanuvchilar:
//       | Rank | Avatar + Ism | Level | XP    | Badges | Badge    |
//       | #4   | Rustam D.   | 76    | 75,493| 🔥     | [badge]  |
//
//  6. "+ YANA YUKLASH" tugmasi (pagination)
//
//  FIGMA: "Aidevix Top Courses Ranking" o'ng panel (GLOBAL AUTHORITY)
// ============================================================

// 📦 IMPORTLAR
import { useState, useEffect }      from 'react'
import { useSelector }              from 'react-redux'
import { motion, AnimatePresence }  from 'framer-motion' // Animatsiyalar uchun
import { FaCrown, FaMedal, FaFire } from 'react-icons/fa'
import { HiTrophy }                 from 'react-icons/hi2'

// Redux hooks — barcha kerakli ma'lumotlar mana shu hooklar orqali olинади
import { useTopUsers }   from '@hooks/useRanking'       // getTopUsers() → state.ranking.topUsers
import { useUserStats }  from '@hooks/useUserStats'     // getUserStats() → state.userStats.*
import { selectUser }    from '@store/slices/authSlice' // Login qilgan user ma'lumoti

// Komponentlar (sen yaratasan)
import LeaderboardTable from '@components/leaderboard/LeaderboardTable'  // jadval
import UserXPCard       from '@components/leaderboard/UserXPCard'        // user stats banner
import LevelUpModal     from '@components/leaderboard/LevelUpModal'      // level up popup

// Loading skeleton (Qudrat yaratadi)
import SkeletonCard from '@components/loading/SkeletonCard'

// Kategoriya tab'lari uchun sabit ma'lumotlar
const TABS = [
  { key: 'all',        label: 'GLOBAL'     },
  { key: 'javascript', label: 'JAVASCRIPT' },
  { key: 'react',      label: 'REACT'      },
  { key: 'nodejs',     label: 'NODE.JS'    },
  { key: 'python',     label: 'PYTHON'     },
]

// XP Engine tushuntirish ro'yxati
const XP_ENGINE = [
  { icon: '🎬', label: 'Video Ko\'rish', xp: '+50 XP'  },
  { icon: '📝', label: 'Quizlar',        xp: '+100 XP' },
  { icon: '💻', label: 'Amaliy Mashq',   xp: '+150 XP' },
  { icon: '🏗️', label: 'Loyiha',         xp: '+200 XP' },
  { icon: '🚀', label: 'Challenge',      xp: '+500 XP' },
]

// Level nomlari (1-leveldan yuqoriga)
const LEVEL_NAMES = {
  1: 'Yangi Boshlovchi', 5: 'Qiziquvchan', 10: 'Izlanuvchi',
  15: 'Bilimdon', 20: 'Ekspert', 25: 'Mantiq Ustasi',
  30: 'Grandmaster', 40: 'Afsonaviy',
}

const getLevelName = (level) => {
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  const found = keys.find((k) => level >= k)
  return LEVEL_NAMES[found] || 'Yangi Boshlovchi'
}

// ─────────────────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  // ── Lokal state ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('all')
  // pageNum — "Yana yuklash" tugmasi uchun
  const [pageNum, setPageNum]     = useState(1)

  // ── Redux state ───────────────────────────────────────────────────────────
  const currentUser = useSelector(selectUser) // { _id, username, email, role }

  // useTopUsers() hook'i state.ranking.topUsers ni qaytaradi
  // loadMore() → fetchTopUsers({ page: N }) dispatch qiladi
  const { users, loading, pagination, loadMore } = useTopUsers({ page: 1, limit: 20 })

  // Hozirgi foydalanuvchining XP, level, streak ma'lumotlari
  const {
    xp, level, levelProgress, streak, badges,
    xpToNextLevel, justLeveledUp, newLevel, dismissLevelUp,
  } = useUserStats()

  // ── useEffect ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // TODO: Sahifa ochilganda scroll top ga
    window.scrollTo(0, 0)
  }, [])

  // ── Ko'proq yuklash ───────────────────────────────────────────────────────
  const handleLoadMore = () => {
    const nextPage = pageNum + 1
    setPageNum(nextPage)
    loadMore(nextPage) // rankingSlice'ga yangi sahifa dispatch
  }

  // ── Podium top 3 ─────────────────────────────────────────────────────────
  // users massividan birinchi 3 ni podiumga, qolganlarini jadvalga
  const podiumUsers = users.slice(0, 3)    // [0]=1-o'rin, [1]=2-o'rin, [2]=3-o'rin
  const tableUsers  = users.slice(3)       // 4-o'rindan pastga

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">

      {/* ─── Level UP Modal (SUHROB yozadi) ──────────────────────────────── */}
      {/* justLeveledUp true bo'lsa confetti + modal ko'rsatiladi */}
      <LevelUpModal
        isOpen={justLeveledUp}
        level={newLevel}
        levelName={getLevelName(newLevel)}
        xp={xp}
        onClose={dismissLevelUp}
      />

      {/* ─── Sahifa sarlavhasi ────────────────────────────────────────────── */}
      {/*
        TODO: "Global Leaderboard" sarlavha bilan qo'llanish
        Figma'dagi "AIDEVIX" logosi va navigatsiya bor qism
      */}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── CHAP PANEL: Asosiy leaderboard ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Hozirgi user reytingi (faqat login bo'lsa ko'rsatiladi) */}
            {/*
              TODO: currentUser mavjud bo'lsa UserXPCard ko'rsatiladi
              UserXPCard ichida:
              - O'rin raqami (GET /api/ranking/users/:userId/position orqali olinadi)
              - XP progress bar
              - Streak va badges
            */}
            {currentUser && (
              <UserXPCard
                xp={xp}
                level={level}
                levelProgress={levelProgress}
                streak={streak}
                rank={null} // TODO: rankingApi.getUserPosition() dan olinadi
                topPercent={null}
              />
            )}

            {/* 2. Kategoriya tabs */}
            {/*
              TODO: TABS massivi bo'yicha tab tugmalari yarating
              Aktiv tab: activeTab state bilan boshqariladi
              Tab o'zgarganda: useTopUsers hookiga categoriya uzatiladi
            */}
            <div className="flex gap-2 flex-wrap">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`btn btn-sm ${activeTab === tab.key ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 3. Podium — Top 3 foydalanuvchi */}
            {/*
              TODO: podiumUsers[1] = 2-o'rin (chapda, kichik)
                    podiumUsers[0] = 1-o'rin (o'rtada, katta, toj bilan)
                    podiumUsers[2] = 3-o'rin (o'ngda, kichik)
              Figma'dagi podium dizaynini qarang
              Animatsiya: framer-motion bilan pastdan yuqoriga
            */}
            {!loading && podiumUsers.length >= 3 && (
              <div className="flex items-end justify-center gap-4 py-8">
                {/* 2-o'rin */}
                <PodiumCard user={podiumUsers[1]} rank={2} />
                {/* 1-o'rin */}
                <PodiumCard user={podiumUsers[0]} rank={1} />
                {/* 3-o'rin */}
                <PodiumCard user={podiumUsers[2]} rank={3} />
              </div>
            )}

            {/* 4. Jadval (#4 dan pastga) */}
            {/*
              TODO: loading = true bo'lsa SkeletonCard ko'rsatiladi
                    loading = false bo'lsa LeaderboardTable
              LeaderboardTable'ga: users, currentUserId, loading uzatiladi
            */}
            {loading ? (
              <SkeletonCard type="user" count={5} />
            ) : (
              <LeaderboardTable
                users={tableUsers}
                currentUserId={currentUser?._id}
                loading={false}
              />
            )}

            {/* 5. "Yana yuklash" tugmasi */}
            {/*
              TODO: pagination.page < pagination.pages bo'lsa ko'rsatiladi
            */}
            {pagination && pageNum < pagination.pages && (
              <div className="text-center py-4">
                <button
                  onClick={handleLoadMore}
                  className="btn btn-outline btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Yuklanmoqda...' : '+ YANA YUKLASH'}
                </button>
              </div>
            )}

          </div>{/* ─── CHAP PANEL END ─── */}

          {/* ─── O'NG PANEL: XP Engine ────────────────────────────────────── */}
          {/*
            TODO: O'ng panel (desktop'da ko'rinadi)
            XP_ENGINE massivi bo'yicha har bir XP manbasini ko'rsating
            Figma'dagi "⚡ XP ENGINE" bloki
          */}
          <div className="hidden lg:block space-y-4">
            <div className="card bg-base-200 p-4">
              <h3 className="font-bold text-sm mb-3">⚡ XP ENGINE</h3>
              {XP_ENGINE.map((item) => (
                <div key={item.label} className="flex justify-between items-center py-1.5 text-sm border-b border-base-300 last:border-0">
                  <span>{item.icon} {item.label}</span>
                  <span className="text-success font-bold">{item.xp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Ichki komponent: Podium kartasi ─────────────────────────────────────────
// TODO: SUHROB bu komponentni to'liq dizayn qiladi
// rank=1: oltin toj, katta; rank=2: kumush; rank=3: bronza
function PodiumCard({ user, rank }) {
  if (!user) return null

  // Rang sxemasi
  const colorMap = {
    1: 'border-yellow-500 shadow-yellow-500/30 bg-yellow-900/20',
    2: 'border-gray-400  shadow-gray-400/30   bg-gray-800/20',
    3: 'border-amber-600 shadow-amber-600/30  bg-amber-900/20',
  }

  return (
    /*
      TODO: Podium kartasi dizayni:
      - Avatar (rasm yoki initials)
      - 1-o'rin uchun 👑 toj tepasida
      - Ism va level nomi
      - XP raqami
      - Badge ko'rsatish
      Figma "GLOBAL AUTHORITY" podium qismini qarang
    */
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15 }}
      className={`card border ${colorMap[rank]} p-4 text-center ${rank === 1 ? 'scale-110' : ''}`}
    >
      {rank === 1 && <div className="text-2xl mb-1">👑</div>}
      {/* TODO: Avatar */}
      <div className="w-16 h-16 rounded-full bg-primary/30 mx-auto mb-2 flex items-center justify-center font-bold text-xl">
        {user.user?.username?.[0]?.toUpperCase()}
      </div>
      <p className="font-bold text-sm truncate">{user.user?.username}</p>
      <p className="text-xs text-base-content/60">Level {user.level}</p>
      <p className="text-primary font-bold text-sm mt-1">{user.xp?.toLocaleString()} XP</p>
      <div className="mt-1">
        <span className={`badge badge-sm ${rank === 1 ? 'badge-warning' : rank === 2 ? 'badge-ghost' : 'badge-outline'}`}>
          #{rank}
        </span>
      </div>
    </motion.div>
  )
}
