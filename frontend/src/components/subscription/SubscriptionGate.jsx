import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaTelegram } from 'react-icons/fa'
import { IoLogoInstagram, IoLockClosed } from 'react-icons/io5'

import { selectAllVerified, selectTelegramSub, selectInstagramSub } from '@store/slices/subscriptionSlice'
import { selectIsLoggedIn } from '@store/slices/authSlice'
import Button from '@components/common/Button'
import { ROUTES } from '@utils/constants'

/**
 * SubscriptionGate — blocks content if user hasn't subscribed to all required socials.
 * Usage: wrap around protected content
 * <SubscriptionGate>
 *   <ProtectedContent />
 * </SubscriptionGate>
 */
export default function SubscriptionGate({ children }) {
  const isLoggedIn  = useSelector(selectIsLoggedIn)
  const allVerified = useSelector(selectAllVerified)
  const telegram    = useSelector(selectTelegramSub)
  const instagram   = useSelector(selectInstagramSub)

  if (!isLoggedIn) {
    return (
      <GateCard
        icon={<IoLockClosed className="text-4xl text-primary-400" />}
        title="Kontent himoyalangan"
        desc="Videolarni ko'rish uchun avval tizimga kiring."
        action={<Link to={ROUTES.LOGIN}><Button>Kirish</Button></Link>}
      />
    )
  }

  if (!allVerified) {
    return (
      <GateCard
        icon={<IoLockClosed className="text-4xl text-yellow-400" />}
        title="Ijtimoiy tarmoqlarga obuna bo'ling"
        desc="Videolarni ko'rish uchun Telegram va Instagram kanallarimizga obuna bo'lishingiz kerak."
        checks={[
          { label: 'Telegram kanal', done: telegram.subscribed, icon: <FaTelegram /> },
          { label: 'Instagram',      done: instagram.subscribed, icon: <IoLogoInstagram /> },
        ]}
        action={
          <Link to={ROUTES.SUBSCRIPTION}>
            <Button>Obuna bo'lish</Button>
          </Link>
        }
      />
    )
  }

  return children
}

function GateCard({ icon, title, desc, checks, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 glass-card max-w-md mx-auto">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{desc}</p>

      {checks && (
        <div className="w-full space-y-2 mb-6">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center gap-3 p-3 rounded-xl bg-dark-border">
              <span className={c.done ? 'text-success' : 'text-zinc-500'}>{c.icon}</span>
              <span className="text-sm text-zinc-300 flex-1 text-left">{c.label}</span>
              <span className={`text-xs font-medium ${c.done ? 'text-success' : 'text-warning'}`}>
                {c.done ? 'Tasdiqlangan ✓' : 'Tasdiqlanmagan'}
              </span>
            </div>
          ))}
        </div>
      )}

      {action}
    </div>
  )
}
