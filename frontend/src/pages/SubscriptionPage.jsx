import { useEffect } from 'react'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { Link } from 'react-router-dom'

import TelegramVerify from '@components/subscription/TelegramVerify'
import InstagramVerify from '@components/subscription/InstagramVerify'
import { useSubscription } from '@hooks/useSubscription'
import { ROUTES } from '@utils/constants'
import Button from '@components/common/Button'

export default function SubscriptionPage() {
  const { allVerified, telegram, instagram, refetch } = useSubscription()

  useEffect(() => { refetch() }, [])

  return (
    <div className="section-container pt-28 pb-20 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="section-title mb-3">Ijtimoiy tarmoqlarga obuna</h1>
        <p className="text-zinc-400 leading-relaxed">
          Videolarni ko'rish uchun quyidagi kanallarga obuna bo'lish shart.
          Obuna bekor qilinsa, video ko'rish imkoni ham bekor bo'ladi.
        </p>
      </div>

      {/* Success state */}
      {allVerified ? (
        <div className="glass-card p-10 text-center space-y-4">
          <IoCheckmarkCircle className="text-6xl text-success mx-auto" />
          <h2 className="text-2xl font-bold text-white">Barcha obunalar tasdiqlandi!</h2>
          <p className="text-zinc-400 text-sm">
            Endi barcha videolarni ko'rishingiz mumkin.
          </p>
          <Link to={ROUTES.COURSES}>
            <Button size="lg">Kurslarga o'tish</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress */}
          <div className="glass-card p-4">
            <div className="flex justify-between text-sm text-zinc-400 mb-2">
              <span>Obuna holati</span>
              <span>{[telegram.subscribed, instagram.subscribed].filter(Boolean).length} / 2</span>
            </div>
            <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${([telegram.subscribed, instagram.subscribed].filter(Boolean).length / 2) * 100}%` }}
              />
            </div>
          </div>

          <TelegramVerify />
          <InstagramVerify />

          <p className="text-xs text-zinc-500 text-center leading-relaxed">
            Obuna holatingiz real-time tekshiriladi. Obunani bekor qilsangiz,
            video ko'rish imkoni ham avtomatik bekor bo'ladi.
          </p>
        </div>
      )}
    </div>
  )
}
