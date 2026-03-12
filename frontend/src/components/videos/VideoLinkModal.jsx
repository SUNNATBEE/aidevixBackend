import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTelegram } from 'react-icons/fa'
import { IoCheckmarkCircle, IoTime, IoWarning } from 'react-icons/io5'
import toast from 'react-hot-toast'

import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useVideoLink, selectVideoLink } from '@store/slices/videoSlice'
import { SOCIAL_LINKS } from '@utils/constants'

/**
 * VideoLinkModal — shows one-time Telegram video link
 * User must click "Ochish" to mark the link as used.
 *
 * IMPORTANT: Link is one-time-use. Once opened, it expires.
 */
export default function VideoLinkModal({ isOpen, onClose }) {
  const dispatch  = useDispatch()
  const videoLink = useSelector(selectVideoLink)
  const [marking, setMarking] = useState(false)
  const [opened, setOpened]   = useState(false)

  const handleOpen = async () => {
    if (!videoLink) return
    setMarking(true)

    // Mark as used on backend
    const result = await dispatch(useVideoLink(videoLink._id))
    setMarking(false)

    if (!result.error) {
      setOpened(true)
      // Open Telegram link in new tab
      window.open(videoLink.telegramLink, '_blank', 'noopener,noreferrer')
      toast.success('Link muvaffaqiyatli ochildi!')
    } else {
      toast.error(result.payload || 'Link ochilmadi')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Video havola" size="md">
      <div className="space-y-5">

        {/* Warning banner */}
        <div className="flex gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <IoWarning className="text-yellow-400 text-xl flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-200 leading-relaxed">
            <strong className="block mb-1">Muhim ogohlantirish!</strong>
            Bu havola <strong>bir martalik</strong>. Siz "Ochish" tugmasini bosgach,
            havola avtomatik bekor bo'ladi va uni boshqalarga yubora olmaysiz.
          </div>
        </div>

        {/* Link info */}
        {videoLink && !videoLink.isUsed && !opened && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-600/20 border border-primary-500/30
                            flex items-center justify-center">
              <FaTelegram className="text-3xl text-primary-400" />
            </div>
            <p className="text-sm text-zinc-400">
              Video Telegram kanalida joylashgan. Havolani ochish uchun tugmani bosing.
            </p>
            {videoLink.expiresAt && (
              <p className="flex items-center justify-center gap-1 text-xs text-zinc-500">
                <IoTime /> Muddati: {new Date(videoLink.expiresAt).toLocaleString()}
              </p>
            )}
            <Button onClick={handleOpen} loading={marking} size="lg" className="w-full gap-2">
              <FaTelegram className="text-lg" />
              Telegram'da ochish
            </Button>
          </div>
        )}

        {/* Already used */}
        {(videoLink?.isUsed || opened) && (
          <div className="text-center space-y-3">
            <IoCheckmarkCircle className="text-5xl text-success mx-auto" />
            <p className="text-sm text-zinc-300">
              Havola muvaffaqiyatli ochildi. Telegram'da video ko'rishingiz mumkin.
            </p>
            <Button variant="outline" onClick={onClose} className="w-full">
              Yopish
            </Button>
          </div>
        )}

      </div>
    </Modal>
  )
}
