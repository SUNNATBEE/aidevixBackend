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
//   import Link from 'next/link';
//   import { FaTelegram } from 'react-icons/fa'
//   import { IoLogoInstagram, IoLockClosed } from 'react-icons/io5'
//   import { selectAllVerified, selectTelegramSub, selectInstagramSub } from '@store/slices/subscriptionSlice'
//   import { selectIsLoggedIn } from '@store/slices/authSlice'
//   import { ROUTES } from '@utils/constants'
// ============================================================

export default function SubscriptionGate({ children }) {
  // TODO: AZIZ bu komponentni to'liq yozadi
  return null
}
