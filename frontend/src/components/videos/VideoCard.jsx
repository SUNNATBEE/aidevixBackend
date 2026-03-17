// ============================================================
// OQUVCHI  : ABDUVORIS
// BRANCH   : feature/abduvoris-lessons
// FAYL     : src/components/videos/VideoCard.jsx
// ============================================================
//
// VAZIFA: Bitta video kartasini yaratish (kurs sahifasida ro'yxatda ko'rsatiladi)
//
// KARTA TARKIBI (gorizontal — flex items-start gap-4):
//
//  1. THUMBNAIL / ORDER RAQAMI (flex-shrink-0, w-16 h-16 rounded-xl):
//     - Agar video.thumbnail bo'lsa: <img>
//     - Aks holda: katta raqam (index+1, padStart(2,'0'))
//     - Lock overlay (canWatch = false bo'lsa):
//       - absolute inset-0 bg-black/60 + IoLockClosed sariq rang
//     - Play overlay (canWatch = true, hover):
//       - opacity-0 group-hover:opacity-100
//
//  2. VIDEO AXBOROTI (flex-1):
//     - Link to: canWatch ? /videos/:id : /subscription
//     - Sarlavha: text-sm font-medium line-clamp-1
//     - Tavsif: text-xs text-zinc-500 line-clamp-1
//     - Statistika: davomiylik (formatDuration) + ko'rishlar soni
//
//  3. REYTING (o'ng tomon, ixtiyoriy):
//     - video.rating?.average > 0 bo'lsa yulduzlar
//
// canWatch SHARTLARI:
//   - isLoggedIn = true AND allVerified = true
//   - Aks holda qulf ko'rsatiladi, /subscription ga yo'naltiradi
//
// PROPS:
//   - video: { _id, title, description, thumbnail, duration, views, rating }
//   - index: number (tartib raqami)
//
// KERAKLI IMPORTLAR:
//   import { Link } from 'react-router-dom'
//   import { useSelector } from 'react-redux'
//   import { IoPlay, IoTime, IoEye, IoLockClosed } from 'react-icons/io5'
//   import { selectIsLoggedIn } from '@store/slices/authSlice'
//   import { selectAllVerified } from '@store/slices/subscriptionSlice'
//   import { formatDuration } from '@utils/formatDuration'
//   import { ROUTES } from '@utils/constants'
// ============================================================

export default function VideoCard({ video, index = 0 }) {
  // TODO: ABDUVORIS bu komponentni to'liq yozadi
  return null
}
