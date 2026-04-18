// UserXPCard.jsx — SUHROB
import { motion } from 'framer-motion'
import { FaFire, FaTrophy } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi2'
import { useLang } from '@context/LangContext'

const getLevelName = (lvl, t) => {
  if (!lvl) return t('lb.level.1')
  const keys = [1, 5, 10, 15, 20, 25, 30, 35, 40, 50].sort((a,b)=>b-a)
  return t(`lb.level.${keys.find((k) => lvl >= k)}`) || t('lb.level.1')
}

const UserXPCard = ({
  xp = 0, level = 1, levelProgress = 0,
  xpToNextLevel = 1000, streak = 0, badges = [],
  rank, topPercent,
}) => {
  const { t } = useLang()
  const nextLevelXP    = xpToNextLevel || 1000
  const currentLevelXP = xp % nextLevelXP
  const progressPct    = levelProgress || Math.round((currentLevelXP / nextLevelXP) * 100)
  const levelName      = getLevelName(level, t)

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-xl overflow-hidden border border-primary/20"
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.10) 60%, rgba(20,20,35,0.95) 100%)' }}
    >
      <div className="flex items-center px-4 py-3 gap-3 flex-wrap">

        {/* Rank box */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.25)', border: '1px solid rgba(99,102,241,0.4)' }}
        >
          <span className="text-2xl font-black text-white leading-none">{rank ?? '—'}</span>
          <span className="text-[9px] text-indigo-300/60 uppercase tracking-wider">{t('lb.rank')}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-xs font-bold text-white uppercase">{t('lb.myRating')}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
              {levelName.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-white/40 mb-2 flex-wrap">
            {rank && <span>{t('lb.rank').charAt(0).toUpperCase() + t('lb.rank').slice(1)}: #{rank}</span>}
            {topPercent && <><span>·</span><span>Top {topPercent}%</span></>}
          </div>
          {/* Progress */}
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

        {/* Stats */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase">{t('general.streak').toUpperCase()}</p>
            <p className="font-bold text-sm flex items-center gap-1 justify-center">
              <FaFire className="text-orange-400" />
              <span className="text-white">{streak}</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase">BADGE</p>
            <p className="font-bold text-sm flex items-center gap-1 justify-center">
              <FaTrophy className="text-yellow-400" />
              <span className="text-white">{badges?.length ?? 0}</span>
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  )
}

export default UserXPCard
