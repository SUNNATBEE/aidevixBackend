import { Link } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { IoPlay, IoPeople, IoTime } from 'react-icons/io5'
import clsx from 'clsx'

import Badge from '@components/common/Badge'
import StarRating from '@components/common/StarRating'
import { formatDurationText } from '@utils/formatDuration'
import { ROUTES } from '@utils/constants'

/**
 * CourseCard — animated course card with hover GSAP effects
 */
export default function CourseCard({ course, index = 0, className }) {
  const cardRef = useRef(null)

  useEffect(() => {
    // Staggered entrance animation
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, delay: index * 0.08, ease: 'power2.out' },
    )
  }, [index])

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { y: -6, duration: 0.3, ease: 'power2.out' })
  }
  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.3, ease: 'power2.out' })
  }

  const totalDuration = (course.videos || []).reduce((s, v) => s + (v.duration || 0), 0)

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx('glass-card overflow-hidden group cursor-pointer shadow-card', className)}
    >
      <Link to={ROUTES.COURSE(course._id)}>
        {/* Thumbnail */}
        <div className="relative h-44 bg-dark-border overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/40 to-dark-border">
              <span className="text-5xl">{getCategoryIcon(course.category)}</span>
            </div>
          )}

          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-primary-600/90 flex items-center justify-center
                            shadow-glow-sm">
              <IoPlay className="text-white text-xl ml-0.5" />
            </div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge category={course.category} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm leading-snug mb-2 line-clamp-2
                          group-hover:text-primary-300 transition-colors">
            {course.title}
          </h3>

          <p className="text-zinc-500 text-xs line-clamp-2 mb-3">{course.description}</p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
            <span className="flex items-center gap-1">
              <IoPlay className="text-primary-400" />
              {course.videos?.length || 0} dars
            </span>
            {totalDuration > 0 && (
              <span className="flex items-center gap-1">
                <IoTime className="text-primary-400" />
                {formatDurationText(totalDuration)}
              </span>
            )}
          </div>

          {/* Rating + Price */}
          <div className="flex items-center justify-between">
            <StarRating value={course.rating?.average || 0} count={course.rating?.count || 0} size="sm" />
            <span className="font-bold text-primary-400 text-sm">
              {course.price > 0 ? `$${course.price}` : 'Bepul'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

function getCategoryIcon(category) {
  const icons = {
    html: '🟠', css: '🔵', javascript: '🟡', react: '⚛️',
    typescript: '🔷', nodejs: '🟢', general: '📚',
  }
  return icons[category?.toLowerCase()] || '📌'
}
