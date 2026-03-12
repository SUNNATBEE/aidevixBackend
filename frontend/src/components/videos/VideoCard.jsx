import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IoPlay, IoTime, IoEye, IoLockClosed } from 'react-icons/io5'

import StarRating from '@components/common/StarRating'
import { formatDuration } from '@utils/formatDuration'
import { selectIsLoggedIn } from '@store/slices/authSlice'
import { selectAllVerified } from '@store/slices/subscriptionSlice'
import { ROUTES } from '@utils/constants'

/**
 * VideoCard — shows video info + lock icon if access requires subscription
 */
export default function VideoCard({ video, index = 0 }) {
  const isLoggedIn  = useSelector(selectIsLoggedIn)
  const allVerified = useSelector(selectAllVerified)
  const canWatch    = isLoggedIn && allVerified

  return (
    <div className="flex items-start gap-4 p-4 glass-card card-hover group video-card">
      {/* Thumbnail / Order */}
      <div className="relative flex-shrink-0 w-16 h-16 rounded-xl bg-dark-border overflow-hidden
                      flex items-center justify-center">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-zinc-600 font-mono">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

        {/* Lock overlay */}
        {!canWatch && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <IoLockClosed className="text-yellow-400 text-sm" />
          </div>
        )}

        {/* Play overlay (if can watch) */}
        {canWatch && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity">
            <IoPlay className="text-white text-sm ml-0.5" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={canWatch ? ROUTES.VIDEO(video._id) : ROUTES.SUBSCRIPTION}
          className="block"
        >
          <h4 className="text-sm font-medium text-white line-clamp-1 mb-1
                          group-hover:text-primary-300 transition-colors">
            {video.title}
          </h4>
          {video.description && (
            <p className="text-xs text-zinc-500 line-clamp-1 mb-2">{video.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {video.duration > 0 && (
              <span className="flex items-center gap-1">
                <IoTime className="text-primary-400" />
                {formatDuration(video.duration)}
              </span>
            )}
            {video.views > 0 && (
              <span className="flex items-center gap-1">
                <IoEye className="text-primary-400" />
                {video.views}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Rating */}
      {video.rating?.average > 0 && (
        <StarRating value={video.rating.average} count={video.rating.count} size="sm" />
      )}
    </div>
  )
}
