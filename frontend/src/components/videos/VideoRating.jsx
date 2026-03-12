import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import StarRating from '@components/common/StarRating'
import Button from '@components/common/Button'
import { rateVideo, selectRatings } from '@store/slices/videoSlice'
import { selectIsLoggedIn } from '@store/slices/authSlice'

/**
 * VideoRating — allow authenticated user to rate a video
 */
export default function VideoRating({ videoId }) {
  const dispatch   = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const ratings    = useSelector(selectRatings)
  const [selected, setSelected] = useState(0)
  const [loading, setLoading]   = useState(false)

  const currentRating = ratings[videoId]

  const handleRate = async () => {
    if (!selected) return toast.error('Yulduz tanlang')
    if (!isLoggedIn) return toast.error('Baholash uchun tizimga kiring')

    setLoading(true)
    const result = await dispatch(rateVideo({ id: videoId, rating: selected }))
    setLoading(false)

    if (!result.error) {
      toast.success(`${selected} yulduz berdingiz!`)
    } else {
      toast.error('Baholashda xato yuz berdi')
    }
  }

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="font-semibold text-white">Bu videoni baholang</h3>

      {/* Current average */}
      {currentRating && (
        <div className="flex items-center gap-2">
          <StarRating value={currentRating.average} count={currentRating.count} size="md" />
          <span className="text-sm text-zinc-400">umumiy baho</span>
        </div>
      )}

      {/* User rating input */}
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <StarRating value={selected} editable onRate={setSelected} size="lg" />
          <Button
            size="sm"
            loading={loading}
            disabled={!selected}
            onClick={handleRate}
          >
            Yuborish
          </Button>
        </div>
      ) : (
        <p className="text-sm text-zinc-400">Baholash uchun tizimga kiring</p>
      )}
    </div>
  )
}
