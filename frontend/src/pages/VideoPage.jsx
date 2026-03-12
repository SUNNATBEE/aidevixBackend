import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { IoArrowBack, IoPlay, IoTime } from 'react-icons/io5'
import { FaTelegram } from 'react-icons/fa'

import Loader from '@components/common/Loader'
import VideoRating from '@components/videos/VideoRating'
import VideoLinkModal from '@components/videos/VideoLinkModal'
import SubscriptionGate from '@components/subscription/SubscriptionGate'
import Button from '@components/common/Button'
import { useVideo } from '@hooks/useVideos'
import { formatDuration } from '@utils/formatDuration'

/**
 * VideoPage — displays video info + access button
 * User must be logged in and subscribed to access the one-time link
 */
export default function VideoPage() {
  const { id } = useParams()
  const { video, videoLink, loading, error } = useVideo(id)
  const [modalOpen, setModalOpen] = useState(false)

  if (loading) return <Loader fullScreen text="Video yuklanmoqda..." />

  if (error) {
    const isSubError = error?.message?.includes('obuna') || error?.subscriptions
    return (
      <div className="section-container pt-28 pb-20 max-w-2xl">
        <SubscriptionGate>
          <div className="text-center glass-card p-10">
            <p className="text-zinc-400">{error?.message || 'Video topilmadi'}</p>
          </div>
        </SubscriptionGate>
      </div>
    )
  }

  if (!video) return null

  return (
    <SubscriptionGate>
      <div className="section-container pt-28 pb-20 max-w-4xl">
        {/* Back */}
        <Link to={-1} className="btn btn-ghost btn-sm gap-2 mb-6">
          <IoArrowBack /> Orqaga
        </Link>

        <div className="space-y-6">
          {/* Video header */}
          <div className="glass-card p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{video.title}</h1>
            {video.description && (
              <p className="text-zinc-400 leading-relaxed mb-4">{video.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              {video.duration > 0 && (
                <span className="flex items-center gap-1">
                  <IoTime className="text-primary-400" />
                  {formatDuration(video.duration)}
                </span>
              )}
            </div>
          </div>

          {/* Video access */}
          <div className="glass-card p-6 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary-600/20 border border-primary-500/30
                            flex items-center justify-center">
              <FaTelegram className="text-4xl text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Video Telegram'da joylashgan</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Video xavfsizligi uchun bir martalik havola orqali taqdim etiladi.
              Havolani faqat bir marta ishlatishingiz mumkin.
            </p>

            {videoLink && !videoLink.isUsed ? (
              <Button
                onClick={() => setModalOpen(true)}
                size="lg"
                className="gap-2"
              >
                <IoPlay /> Videoni ko'rish
              </Button>
            ) : videoLink?.isUsed ? (
              <div className="text-sm text-warning">
                Bu video havolasi allaqachon ishlatilgan.
              </div>
            ) : null}
          </div>

          {/* Rating */}
          <VideoRating videoId={id} />
        </div>

        {/* One-time link modal */}
        <VideoLinkModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </SubscriptionGate>
  )
}
