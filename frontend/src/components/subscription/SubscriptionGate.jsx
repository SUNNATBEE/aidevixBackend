// ============================================================
// OQUVCHI  : AZIZ
// BRANCH   : feature/aziz-subscription
// FAYL     : src/components/subscription/SubscriptionGate.jsx
// ============================================================
//
// VAZIFA: Obuna tekshiruv "darvoza" komponentini yaratish
//
// ISHLATILISHI:
//   <SubscriptionGate>
//     <ProtectedContent />  ← faqat obuna bo'lganlarga ko'rsatiladi
//   </SubscriptionGate>
//
// UCHTA HOLAT:
//
//  1. KIRISH BO'LMAGAN (isLoggedIn = false):
//     - IoLockClosed ikonkasi (text-4xl text-primary-400)
//     - Sarlavha: "Kontent himoyalangan"
//     - Tavsif: "Videolarni ko'rish uchun avval tizimga kiring."
//     - Tugma: "Kirish" → Link to="/login"
//
//  2. OBUNA BO'LMAGAN (allVerified = false):
//     - IoLockClosed ikonkasi (text-4xl text-yellow-400)
//     - Sarlavha: "Ijtimoiy tarmoqlarga obuna bo'ling"
//     - Tavsif: "Videolarni ko'rish uchun Telegram va Instagram ga obuna bo'lishingiz kerak."
//     - Tekshiruvlar ro'yxati:
//       - Telegram kanal: { done: telegram.subscribed, icon: FaTelegram }
//       - Instagram:       { done: instagram.subscribed, icon: IoLogoInstagram }
//       - Har biri: Tasdiqlangan ✓ (text-success) yoki Tasdiqlanmagan (text-warning)
//     - Tugma: "Obuna bo'lish" → Link to="/subscription"
//
//  3. HAMMASI OK (allVerified = true, isLoggedIn = true):
//     - {children} — himoyalangan kontent ko'rsatiladi
//
// UMUMIY PANEL STILI (1 va 2 holat uchun):
//   - flex flex-col items-center text-center py-16 px-6
//   - glass-card max-w-md mx-auto
//
// STATE:
//   - useSelector(selectIsLoggedIn)
//   - useSelector(selectAllVerified)
//   - useSelector(selectTelegramSub)
//   - useSelector(selectInstagramSub)
//
// KERAKLI IMPORTLAR:
//   import { useSelector } from 'react-redux'
//   import { Link } from 'react-router-dom'
//   import { FaTelegram } from 'react-icons/fa'
//   import { IoLogoInstagram, IoLockClosed } from 'react-icons/io5'
//   import { selectAllVerified, selectTelegramSub, selectInstagramSub } from '@store/slices/subscriptionSlice'
//   import { selectIsLoggedIn } from '@store/slices/authSlice'
//   import { ROUTES } from '@utils/constants'
// ============================================================

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaTelegram } from 'react-icons/fa'
import { IoLogoInstagram, IoLockClosed } from 'react-icons/io5'
import { selectAllVerified, selectTelegramSub, selectInstagramSub } from '@store/slices/subscriptionSlice'
import { selectIsLoggedIn } from '@store/slices/authSlice'

export default function SubscriptionGate({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const allVerified = useSelector(selectAllVerified)
  const telegram = useSelector(selectTelegramSub)
  const instagram = useSelector(selectInstagramSub)

  // 1. KIRISH BO'LMAGAN
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-2xl mx-auto rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-md">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <IoLockClosed className="text-4xl text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Kontent himoyalangan</h2>
        <p className="text-zinc-400 mb-10 max-w-sm">
          Videolarni ko'rish va topshiriqlarni bajarish uchun avval tizimga kiring.
        </p>
        <Link to="/login" className="btn btn-primary px-12 h-14 rounded-2xl text-lg font-bold">
          Tizimga kirish
        </Link>
      </div>
    )
  }

  // 2. OBUNA BO'LMAGAN
  if (!allVerified) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 max-w-2xl mx-auto rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-md">
        <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
          <IoLockClosed className="text-4xl text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Ijtimoiy tarmoqlarga obuna bo'ling</h2>
        <p className="text-zinc-400 mb-10 max-w-md text-lg">
          Videolarni ko'rish uchun Telegram va Instagram sahifalarimizga a'zo bo'lishingiz shart.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-10">
          <div className={`p-4 rounded-2xl border ${telegram.subscribed ? 'bg-green-500/5 border-green-500/20' : 'bg-zinc-800/40 border-white/5'} flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${telegram.subscribed ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-400'}`}>
              <FaTelegram size={24} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-white uppercase tracking-wider">Telegram</span>
              <span className={`text-xs ${telegram.subscribed ? 'text-green-500' : 'text-zinc-500'}`}>
                {telegram.subscribed ? '✓ Tasdiqlandi' : 'Tasdiqlanmagan'}
              </span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${instagram.subscribed ? 'bg-green-500/5 border-green-500/20' : 'bg-zinc-800/40 border-white/5'} flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${instagram.subscribed ? 'bg-green-500/20 text-green-500' : 'bg-pink-500/20 text-pink-500'}`}>
              <IoLogoInstagram size={24} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-white uppercase tracking-wider">Instagram</span>
              <span className={`text-xs ${instagram.subscribed ? 'text-green-500' : 'text-zinc-500'}`}>
                {instagram.subscribed ? '✓ Tasdiqlandi' : 'Tasdiqlanmagan'}
              </span>
            </div>
          </div>
        </div>

        <Link to="/subscription" className="btn btn-warning px-12 h-14 rounded-2xl text-lg font-bold text-black border-none bg-yellow-500 hover:bg-yellow-400">
          Obuna bo'lish sahifasiga o'tish
        </Link>
      </div>
    )
  }

  // 3. HAMMASI OK
  return <>{children}</>
}
