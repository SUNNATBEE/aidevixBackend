// LeaderboardTable.jsx — SUHROB
import { motion } from 'framer-motion'
import { FaFire, FaMedal } from 'react-icons/fa'
import { HiTrophy } from 'react-icons/hi2'
import { useLang } from '@/context/LangContext'

const getLevelName = (lvl, t) => {
  const keys = [1, 5, 10, 15, 20, 25, 30, 35, 40, 50].sort((a,b)=>b-a)
  return t(`lb.level.${keys.find((k) => lvl >= k)}`) || t('lb.level.1')
}
const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

const LeaderboardTable = ({ users = [], currentUserId, loading }) => {
  const { t } = useLang()
  if (loading) return null

  return (
    <div className="rounded-xl overflow-hidden border border-base-300 bg-base-200">
      {/* Header */}
      <div className="grid grid-cols-[56px_1fr_72px_110px_72px] gap-2 px-4 py-2 text-[11px] text-base-content/40 uppercase tracking-wider border-b border-base-300 bg-base-300/40">
        <span>{t('lb.rank')}</span>
        <span>{t('courses.badge')}</span>
        <span className="text-center">{t('profile.stat.level')}</span>
        <span className="text-center">{t('profile.stat.xp').split(' ')[0]}</span>
        <span className="text-center">Badges</span>
      </div>

      <div className="divide-y divide-base-300/60">
        {users.map((u, i) => {
          const isMe     = u.user?._id === currentUserId
          const username = u.user?.username || u.user?.name || t('auth.register.username')
          const lvlName  = getLevelName(u.level || 1, t)

          return (
            <motion.div
              key={u.rank ?? i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`grid grid-cols-[56px_1fr_72px_110px_72px] gap-2 px-4 py-3 items-center transition-colors
                ${isMe ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-base-300/30'}`}
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
                    : getInitials(username)}
                </div>
                <div className="min-w-0">
                  <p className={`font-semibold text-sm truncate ${isMe ? 'text-primary' : ''}`}>
                    {username}
                    {isMe && <span className="text-xs text-primary/60 ml-1">({t('auth.register.refBonus').includes('bonus') ? 'You' : 'Siz'})</span>}
                  </p>
                  <p className="text-xs text-base-content/40 truncate">{lvlName}</p>
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

              {/* Badges + AI Stack */}
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-1">
                  {u.streak > 0 && <FaFire className="text-orange-400 text-sm" />}
                  {u.badges?.length > 0 && (
                    <span className="flex items-center gap-0.5 text-yellow-400 text-sm">
                      <HiTrophy />
                      <span className="text-xs text-base-content/50">{u.badges.length}</span>
                    </span>
                  )}
                  {!u.streak && !u.badges?.length && <FaMedal className="text-base-content/20 text-sm" />}
                </div>
                {u.aiStack?.length > 0 && (
                  <div className="flex gap-0.5 flex-wrap justify-center" title={u.aiStack.join(', ')}>
                    {u.aiStack.slice(0, 3).map((tool: string) => {
                      const icons: Record<string, string> = {
                        'Claude Code': '🤖', 'Cursor': '⚡', 'GitHub Copilot': '🐙',
                        'ChatGPT': '💬', 'Gemini': '✨', 'Windsurf': '🌊',
                        'Devin': '🦾', 'Replit AI': '🔁', 'Codeium': '🔮', 'Other': '🛠️',
                      }
                      return <span key={tool} className="text-[10px]">{icons[tool] || '🔧'}</span>
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-base-content/40">
            <HiTrophy className="text-4xl mx-auto mb-2 opacity-20" />
            <p className="text-sm">{t('courses.empty')}</p>
          </div>
        )}
    </div>
  )
}

export default LeaderboardTable
