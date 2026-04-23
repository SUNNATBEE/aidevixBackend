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

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { rateVideo, selectRatings } from '@store/slices/videoSlice'
import { selectIsLoggedIn } from '@store/slices/authSlice'
import { motion } from 'framer-motion'

export default function VideoRating({ videoId }) {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const ratings = useSelector(selectRatings)
  const videoRating = ratings[videoId] || { average: 0, count: 0, userRating: 0 }
  
  const [selected, setSelected] = useState(videoRating.userRating || 0)
  const [hovered, setHovered] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleRate = async () => {
    if (selected === 0) {
      toast.error('Yulduz tanlang')
      return
    }

    setLoading(true)
    try {
      const resultAction = await dispatch(rateVideo({ id: videoId, rating: selected }))
      if (rateVideo.fulfilled.match(resultAction)) {
        toast.success(`${selected} yulduz berdingiz!`)
      } else {
        toast.error('Baholashda xato yuz berdi')
      }
    } catch (err) {
      toast.error('Kutilmagan xato yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Bu videoni baholang</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar key={s} className={s <= Math.round(videoRating.average) ? 'fill-current' : 'text-zinc-700'} />
              ))}
            </div>
            <span className="text-sm font-medium text-white">{videoRating.average?.toFixed(1) || '0.0'}</span>
            <span className="text-xs text-zinc-500">({videoRating.count} ta baho)</span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          {!isLoggedIn ? (
            <p className="text-sm text-zinc-500 italic">Baholash uchun tizimga kiring</p>
          ) : (
            <>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setSelected(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    {star <= (hovered || selected) ? (
                      <FaStar className="text-2xl text-yellow-500" />
                    ) : (
                      <FaRegStar className="text-2xl text-zinc-600" />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={handleRate}
                disabled={loading || selected === 0}
                className={`btn btn-sm px-6 rounded-full border-none font-bold ${
                  loading ? 'loading' : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {loading ? 'Yuborilmoqda...' : 'Yuborish'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
