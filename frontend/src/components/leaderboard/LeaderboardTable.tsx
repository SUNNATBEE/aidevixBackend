// LeaderboardTable.tsx — SUHROB
import { memo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaFire, FaMedal, FaGithub, FaCommentDots, FaRobot, FaMagic, FaWrench } from 'react-icons/fa'
import { HiTrophy, HiSparkles } from 'react-icons/hi2'
import { FiZap, FiCpu, FiRepeat, FiCompass } from 'react-icons/fi'
import { useLang } from '@/context/LangContext'

const LEVEL_KEYS = [50, 40, 35, 30, 25, 20, 15, 10, 5, 1] as const

const getLevelName = (lvl: number, t: (k: string) => string) => {
  const found = LEVEL_KEYS.find((k) => lvl >= k) ?? 1
  return t(`lb.level.${found}`) || t('lb.level.1')
}

const getDisplayName = (u: any, fallback: string) => {
  const first = u?.firstName?.trim()
  const last  = u?.lastName?.trim()
  const full  = [first, last].filter(Boolean).join(' ').trim()
  return full || u?.username || u?.name || fallback
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  'Claude Code': <FaRobot className="text-blue-400" />,
  'Cursor': <FiZap className="text-yellow-400" />,
  'GitHub Copilot': <FaGithub className="text-white" />,
  'ChatGPT': <FaCommentDots className="text-emerald-400" />,
  'Gemini': <HiSparkles className="text-purple-400 animate-pulse" />,
  'Windsurf': <FiCompass className="text-cyan-400" />,
  'Devin': <FiCpu className="text-indigo-400" />,
  'Replit AI': <FiRepeat className="text-red-400" />,
  'Codeium': <FaMagic className="text-pink-400" />,
  'Other': <FaWrench className="text-slate-400" />,
}

interface RowProps {
  user: any
  index: number
  isMe: boolean
  username: string
  lvlName: string
  youLabel: string
}

const ANIMATE_LIMIT = 8

const DesktopRow = memo(function DesktopRow({ user: u, index, isMe, username, lvlName, youLabel }: RowProps) {
  const animate = index < ANIMATE_LIMIT
  return (
    <motion.div
      initial={animate ? { opacity: 0, x: -16 } : false}
      animate={animate ? { opacity: 1, x: 0 } : { opacity: 1 }}
      transition={animate ? { delay: index * 0.04 } : undefined}
      className={`grid grid-cols-[56px_1fr_72px_110px_72px] gap-2 px-4 py-3 items-center transition-colors
        ${isMe ? 'bg-[#370617]/40 border-l-2 border-[#e85d04]' : 'hover:bg-[#370617]/20'}`}
    >
      <div className="flex items-center justify-center">
        <span className={`font-bold text-sm ${isMe ? 'text-[#ffba08]' : 'text-[#fff1ce]/50'}`}>
          #{u.rank}
        </span>
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden bg-base-300">
          <Image src={u.user?.avatar || '/Logo.jpg'} alt={username} width={36} height={36} sizes="36px" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className={`font-semibold text-sm truncate ${isMe ? 'text-[#ffba08]' : 'text-[#fff1ce]'}`}>
            {username}
            {isMe && <span className="text-xs text-[#ffba08]/75 ml-1">({youLabel})</span>}
          </p>
          <p className="text-xs text-[#fff1ce]/40 truncate">{lvlName}</p>
        </div>
      </div>

      <div className="text-center">
        <span className="badge badge-sm bg-[#370617] border border-[#ffba08]/20 text-[#fff1ce] font-semibold">{u.level ?? 1}</span>
      </div>

      <div className="text-center">
        <span className="font-bold text-sm text-[#e85d04]">{(u.xp || 0).toLocaleString()}</span>
        <span className="text-xs text-[#fff1ce]/40 ml-0.5">XP</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-1">
          {u.streak > 0 && <FaFire className="text-orange-400 text-sm" />}
          {u.badges?.length > 0 && (
            <span className="flex items-center gap-0.5 text-[#ffba08] text-sm">
              <HiTrophy />
              <span className="text-xs text-[#fff1ce]/50">{u.badges.length}</span>
            </span>
          )}
          {!u.streak && !u.badges?.length && <FaMedal className="text-[#fff1ce]/20 text-sm" />}
        </div>
        {u.aiStack?.length > 0 && (
          <div className="flex gap-1 flex-wrap justify-center" title={u.aiStack.join(', ')}>
            {u.aiStack.slice(0, 3).map((tool: string) => (
              <span key={tool} className="flex items-center justify-center p-0.5 rounded bg-[#370617]/30 border border-[#ffba08]/10" title={tool}>
                {TOOL_ICONS[tool] || <FaWrench className="text-slate-400 text-[10px]" />}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
})

const MobileRow = memo(function MobileRow({ user: u, index, isMe, username, lvlName }: RowProps) {
  const animate = index < ANIMATE_LIMIT
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 1 }}
      transition={animate ? { delay: index * 0.03 } : undefined}
      className={`p-3 ${isMe ? 'bg-[#370617]/40 border-l-2 border-[#e85d04]' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base-300 text-sm font-bold overflow-hidden">
          <Image src={u.user?.avatar || '/Logo.jpg'} alt={username} width={36} height={36} sizes="36px" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={`truncate text-sm font-semibold ${isMe ? 'text-[#ffba08]' : 'text-[#fff1ce]'}`}>{username}</p>
            <span className="text-xs font-bold text-[#fff1ce]/55">#{u.rank}</span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-[#fff1ce]/40">{lvlName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="badge badge-xs bg-[#370617] border border-[#ffba08]/20 text-[#fff1ce]">Lvl {u.level ?? 1}</span>
            <span className="text-xs font-bold text-[#e85d04]">{(u.xp || 0).toLocaleString()} XP</span>
            {u.streak > 0 && <FaFire className="text-xs text-orange-400" />}
            {u.badges?.length > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-[#ffba08]">
                <HiTrophy className="text-[#ffba08] text-xs" />
                <span>{u.badges.length}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

interface LeaderboardTableProps {
  users: any[]
  currentUserId?: string
  loading: boolean
}

const LeaderboardTable = ({ users = [], currentUserId, loading }: LeaderboardTableProps) => {
  const { t } = useLang()
  if (loading) return null

  const youLabel = t('auth.register.refBonus').includes('bonus') ? 'You' : 'Siz'

  return (
    <div className="rounded-xl overflow-hidden border border-[#ffba08]/10 bg-[#01030b]">
      <div className="hidden sm:block">
        <div className="grid grid-cols-[56px_1fr_72px_110px_72px] gap-2 px-4 py-2 text-[11px] text-[#fff1ce]/40 uppercase tracking-wider border-b border-[#ffba08]/10 bg-[#370617]/10">
          <span>{t('lb.rank')}</span>
          <span>{t('courses.badge')}</span>
          <span className="text-center">{t('profile.stat.level')}</span>
          <span className="text-center">{t('profile.stat.xp').split(' ')[0]}</span>
          <span className="text-center">Badges</span>
        </div>

        <div className="divide-y divide-[#ffba08]/5">
          {users.map((u: any, i: number) => {
            const isMe = u.user?._id === currentUserId
            const username = getDisplayName(u.user, t('auth.register.username'))
            const lvlName = getLevelName(u.level || 1, t)
            return (
              <DesktopRow
                key={u.rank ?? u.user?._id ?? i}
                user={u}
                index={i}
                isMe={isMe}
                username={username}
                lvlName={lvlName}
                youLabel={youLabel}
              />
            )
          })}
        </div>
      </div>

      <div className="sm:hidden divide-y divide-[#ffba08]/5">
        {users.map((u: any, i: number) => {
          const isMe = u.user?._id === currentUserId
          const username = getDisplayName(u.user, t('auth.register.username'))
          const lvlName = getLevelName(u.level || 1, t)
          return (
            <MobileRow
              key={`m-${u.rank ?? u.user?._id ?? i}`}
              user={u}
              index={i}
              isMe={isMe}
              username={username}
              lvlName={lvlName}
              youLabel={youLabel}
            />
          )
        })}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-[#fff1ce]/40">
          <HiTrophy className="text-4xl mx-auto mb-2 opacity-20" />
          <p className="text-sm">{t('courses.empty')}</p>
        </div>
      )}
    </div>
  )
}

export default LeaderboardTable
