// ============================================================
// OQUVCHI  : AZIZ
// BRANCH   : feature/aziz-subscription
// FAYL     : src/components/subscription/TelegramVerify.jsx
// ============================================================
//
// VAZIFA: Telegram obunasini tekshirish komponentini yaratish
//
// IKKI HOLAT:
//
//  1. ALLAQACHON TASDIQLANGAN (telegram.subscribed = true):
//     - ✅ IoCheckmarkCircle (yashil, text-3xl)
//     - "Telegram tasdiqlangan" matni
//     - "@{telegram.username}" — text-zinc-400
//     - glass-card border border-success/30
//
//  2. TASDIQLANMAGAN:
//     a) SARLAVHA:
//        - FaTelegram ikonkasi (text-3xl text-primary-400)
//        - "Telegram kanalga obuna bo'ling"
//        - "Kanalga obuna bo'ling, keyin tasdiqlang" (text-xs)
//
//     b) 1-QADAM — TELEGRAM KANALGA O'TISH:
//        - <a href={SOCIAL_LINKS.telegram} target="_blank">
//        - "Telegram kanalini ochish →" matni
//        - bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20
//
//     c) 2-QADAM — ID KIRITISH:
//        - Izoh: "Botimizga /start yozing → ID ni oling"
//        - Input: placeholder="Telegram User ID (masalan: 123456789)"
//        - "Tasdiqlash" tugmasi → handleVerify()
//
// handleVerify() LOGIKASI:
//   - userId bo'sh bo'lsa → toast.error('Telegram ID ni kiriting')
//   - dispatch(verifyTelegram({ telegramUserId: userId }))
//   - Muvaffaqiyatli → toast.success('Telegram obuna tasdiqlandi!')
//   - Xato → toast.error(result.payload || 'Telegram tekshirishda xato')
//
// STATE:
//   - useSelector(selectTelegramSub) → { subscribed, username }
//   - useSelector(selectSubLoading)
//   - useState(userId)
//
// KERAKLI IMPORTLAR:
//   import { useState } from 'react'
//   import { useDispatch, useSelector } from 'react-redux'
//   import { FaTelegram } from 'react-icons/fa'
//   import { IoCheckmarkCircle } from 'react-icons/io5'
//   import toast from 'react-hot-toast'
//   import { verifyTelegram, selectTelegramSub, selectSubLoading } from '@store/slices/subscriptionSlice'
//   import { SOCIAL_LINKS } from '@utils/constants'
// ============================================================

export default function TelegramVerify() {
  // TODO: AZIZ bu komponentni to'liq yozadi
  return null
}
