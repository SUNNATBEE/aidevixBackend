// ============================================================
// OQUVCHI  : ABDUVORIS
// BRANCH   : feature/abduvoris-lessons
// FAYL     : src/components/videos/VideoLinkModal.jsx
// ============================================================
//
// VAZIFA: Video Telegram havola modal komponentini yaratish
//
// ⚠️ MUHIM: Bu havola BIR MARTALIK ishlatiladi!
//   - Foydalanuvchi "Ochish" tugmasini bosgach, link bekor bo'ladi
//   - Backend'da isUsed = true ga o'zgaradi
//
// MODAL TARKIBI:
//
//  1. OGOHLANTIRISH BANNER:
//     - bg-yellow-500/10 border border-yellow-500/30
//     - IoWarning ikonkasi (sariq)
//     - "Bu havola bir martalik. Ochgandan keyin qayta ishlatib bo'lmaydi."
//
//  2. ASOSIY HOLAT (link bor, ishlatilmagan, opened=false):
//     - FaTelegram ikonkasi (katta, primary rang)
//     - Tavsif matni
//     - Muddati (expiresAt) ko'rsatilsa
//     - "Telegram'da ochish" tugmasi → handleOpen()
//
//  3. MUVAFFAQIYAT HOLATI (isUsed=true yoki opened=true):
//     - IoCheckmarkCircle (yashil, text-5xl)
//     - "Havola muvaffaqiyatli ochildi."
//     - "Yopish" tugmasi
//
// handleOpen() LOGIKASI:
//   - dispatch(useVideoLink(videoLink._id))
//   - Muvaffaqiyatli bo'lsa:
//     - setOpened(true)
//     - window.open(videoLink.telegramLink, '_blank', 'noopener,noreferrer')
//     - toast.success('Link muvaffaqiyatli ochildi!')
//   - Xato bo'lsa: toast.error()
//
// PROPS:
//   - isOpen: boolean
//   - onClose: function
//
// KERAKLI IMPORTLAR:
//   import { useState } from 'react'
//   import { useDispatch, useSelector } from 'react-redux'
//   import { FaTelegram } from 'react-icons/fa'
//   import { IoCheckmarkCircle, IoTime, IoWarning } from 'react-icons/io5'
//   import toast from 'react-hot-toast'
//   import { useVideoLink, selectVideoLink } from '@store/slices/videoSlice'
// ============================================================

export default function VideoLinkModal({ isOpen, onClose }) {
  // TODO: ABDUVORIS bu komponentni to'liq yozadi
  return null
}
