// ============================================================
// OQUVCHI  : ABDUVORIS
// BRANCH   : feature/abduvoris-lessons
// FAYL     : src/components/videos/VideoRating.jsx
// ============================================================
//
// VAZIFA: Video baholash komponentini yaratish
//
// KOMPONENT TARKIBI:
//
//  1. SARLAVHA:
//     - "Bu videoni baholang" — font-semibold text-white
//
//  2. JORIY UMUMIY REYTING (agar mavjud bo'lsa):
//     - Yulduzlar ko'rsatiladi (average + count)
//     - "umumiy baho" matni (text-zinc-400)
//
//  3. FOYDALANUVCHI BAHOLASHI:
//     - Agar isLoggedIn = true:
//       - Interaktiv yulduzlar (1-5, selected state)
//       - "Yuborish" tugmasi → handleRate()
//       - loading holat
//     - Agar isLoggedIn = false:
//       - "Baholash uchun tizimga kiring" — text-zinc-400
//
// handleRate() LOGIKASI:
//   - selected = 0 → toast.error('Yulduz tanlang')
//   - dispatch(rateVideo({ id: videoId, rating: selected }))
//   - Muvaffaqiyatli → toast.success(`${selected} yulduz berdingiz!`)
//   - Xato → toast.error('Baholashda xato yuz berdi')
//
// PROPS:
//   - videoId: string
//
// KERAKLI IMPORTLAR:
//   import { useState } from 'react'
//   import { useDispatch, useSelector } from 'react-redux'
//   import toast from 'react-hot-toast'
//   import { rateVideo, selectRatings } from '@store/slices/videoSlice'
//   import { selectIsLoggedIn } from '@store/slices/authSlice'
// ============================================================

export default function VideoRating({ videoId }) {
  // TODO: ABDUVORIS bu komponentni to'liq yozadi
  return null
}
