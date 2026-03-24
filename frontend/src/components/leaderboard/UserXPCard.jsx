<<<<<<< Updated upstream
// ============================================================
// OQUVCHI  : SUHROB
// BRANCH   : feature/suhrob-leaderboard
// FAYL     : src/components/leaderboard/UserXPCard.jsx
// ============================================================
//
// VAZIFA: Leaderboard sahifasida hozirgi foydalanuvchining
//         o'z reytingini ko'rsatuvchi karta
//
// KARTA TARKIBI (Figma "SIZNING REYTINGINGIZ"):
//
//  CHAP:
//   - "{rank}-O'RIN" — juda katta raqam (text-4xl+ font-black)
//   - "SIZNING REYTINGINGIZ" subtitle
//   - "Top {topPercent}%" (agar mavjud bo'lsa)
//
//  O'NG:
//   - "{xp} XP" — primary rang
//   - "🔥 {streak} kun streak"
//
//  PASTDA:
//   - Progress bar → keyingi levelgacha foiz
//   - "{xp % 1000} / 1000 XP" matni
//
// STIL:
//   - card bg-gradient-to-r from-primary/20 to-secondary/20
//   - border border-primary/30
//
// PROPS:
//   - xp: number
//   - level: number
//   - levelProgress: number (0-100)
//   - streak: number
//   - rank: number | '—'
//   - topPercent: number | null
//
// KERAKLI IMPORTLAR:
//   import { FaFire } from 'react-icons/fa'
// ============================================================

const UserXPCard = ({ xp = 0, level = 1, levelProgress = 0, streak = 0, rank = '—', topPercent = null }) => {
  // TODO: SUHROB bu komponentni to'liq yozadi
  return null
=======
// UserXPCard.jsx — SUHROB
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaFire, FaTrophy } from 'react-icons/fa'
import axios from 'axios'
import { selectUser } from '@store/slices/authSlice'

const API = import.meta.env.VITE_API_BASE_URL || 'https://aidevix-backend-production.up.railway.app/api'

const LEVEL_NAMES = {
  1: 'Yangi Boshlovchi', 5: 'Qiziquvchan', 10: 'Izlanuvchi',
  15: 'Bilimdon', 20: 'Ekspert', 25: 'Mantiq Ustasi',
  30: 'Grandmaster', 35: 'Ustoz', 40: 'Afsonaviy', 50: 'Immortal',
}
const getLevelName = (lvl) => {
  const keys = Object.keys(LEVEL_NAMES).map(Number).sort((a, b) => b - a)
  return LEVEL_NAMES[keys.find((k) => lvl >= k)] || 'Yangi Boshlovchi'
}

const UserXPCard = ({ xp = 0, level = 1, levelProgress = 0, xpToNextLevel = 1000, streak = 0, badges = [] }) => {
  const currentUser = useSelector(selectUser)
  const [position, setPosition] = useState(null)

  useEffect(() => {
    if (!currentUser?._id) return
    const token = localStorage.getItem('aidevix_access_token')
    axios.get(`${API}/ranking/users/${currentUser._id}/position`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(({ data }) => setPosition(data?.data || null))
      .catch(() => {})
  }, [currentUser?._id])

  const rank = position?.rank ?? '—'
  const topPercent = position?.topPercent ?? null
  const nextLevelXP = xpToNextLevel || 1000
  const currentLevelXP = xp % nextLevelXP
  const progressPct = levelProgress || Math.round((currentLevelXP / nextLevelXP) * 100)
  const levelName = getLevelName(level)

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-xl overflow-hidden border border-primary/20"
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 60%, rgba(20,20,35,0.95) 100%)' }}
    >
      <div className="flex items-center gap-0 px-4 py-3">
        {/* Rank square */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center mr-4"
          style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)' }}
        >
          <span className="text-2xl font-black text-white leading-none">{rank}</span>
          <span className="text-[9px] text-indigo-300/60 uppercase tracking-wider">o'rin</span>
        </div>

        {/* Center info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-xs font-bold text-white">SIZNING REYTINGINGIZ</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
              {levelName.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-white/40 mb-2 flex-wrap">
            <span>Rank: #{rank}</span>
            {topPercent && <><span>·</span><span>Top {topPercent}%</span></>}
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366f1, #ec4899)' }}
              />
            </div>
            <span className="text-[10px] text-white/40 whitespace-nowrap">
              {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Right stats */}
        <div className="flex-shrink-0 flex items-center gap-4 ml-4">
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">STREAK</p>
            <p className="font-bold text-sm flex items-center gap-1 justify-center">
              <FaFire className="text-orange-400" />
              <span className="text-white">{streak}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider">BADGE</p>
            <p className="font-bold text-sm flex items-center gap-1 justify-center">
              <FaTrophy className="text-yellow-400" />
              <span className="text-white">{badges?.length ?? 0}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
>>>>>>> Stashed changes
}

export default UserXPCard
