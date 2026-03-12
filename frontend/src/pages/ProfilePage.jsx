import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { IoPerson, IoMail, IoCalendar, IoShield } from 'react-icons/io5'
import { FaTelegram } from 'react-icons/fa'
import { IoLogoInstagram } from 'react-icons/io5'

import { selectUser } from '@store/slices/authSlice'
import { selectTelegramSub, selectInstagramSub } from '@store/slices/subscriptionSlice'
import { formatDate } from '@utils/formatDate'
import { ROUTES } from '@utils/constants'
import Button from '@components/common/Button'

export default function ProfilePage() {
  const user      = useSelector(selectUser)
  const telegram  = useSelector(selectTelegramSub)
  const instagram = useSelector(selectInstagramSub)

  if (!user) return null

  return (
    <div className="section-container pt-28 pb-20 max-w-3xl">
      <h1 className="section-title mb-8">Profil</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* User info */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <IoPerson className="text-primary-400" /> Ma'lumotlarim
          </h2>

          {[
            { icon: <IoPerson />, label: 'Username', value: user.username },
            { icon: <IoMail />,   label: 'Email',    value: user.email },
            { icon: <IoShield />, label: 'Role',     value: user.role === 'admin' ? 'Admin' : 'Foydalanuvchi' },
            { icon: <IoCalendar />, label: 'Ro\'yxat sanasi', value: formatDate(user.createdAt) },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-sm">
              <span className="text-primary-400">{item.icon}</span>
              <div>
                <p className="text-zinc-500 text-xs">{item.label}</p>
                <p className="text-white font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Subscription status */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-semibold text-white mb-4">Obuna holati</h2>

          {[
            { icon: <FaTelegram className="text-primary-400 text-xl" />,  label: 'Telegram',  sub: telegram },
            { icon: <IoLogoInstagram className="text-pink-400 text-xl" />, label: 'Instagram', sub: instagram },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-dark-border">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm text-zinc-300">{item.label}</span>
              </div>
              <span className={`text-xs font-medium ${item.sub.subscribed ? 'text-success' : 'text-warning'}`}>
                {item.sub.subscribed ? 'Faol ✓' : 'Tasdiqlanmagan'}
              </span>
            </div>
          ))}

          <Link to={ROUTES.SUBSCRIPTION}>
            <Button variant="outline" size="sm" className="w-full mt-2">
              Obunani boshqarish
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
