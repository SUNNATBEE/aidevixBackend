import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { IoPlay, IoTime, IoBookOutline, IoStar } from 'react-icons/io5'
import { ROUTES } from '@utils/constants'
import { formatDurationText } from '@utils/formatDuration'

const CAT = {
  html:       { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400',  label: 'HTML',   glow: 'hover:shadow-orange-500/10'  },
  css:        { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',    label: 'CSS',    glow: 'hover:shadow-blue-500/10'    },
  javascript: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400',  label: 'JS',     glow: 'hover:shadow-yellow-500/10'  },
  typescript: { bg: 'bg-blue-600/10',   border: 'border-blue-600/20',   text: 'text-blue-300',    label: 'TS',     glow: 'hover:shadow-blue-600/10'    },
  react:      { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   text: 'text-cyan-400',    label: 'React',  glow: 'hover:shadow-cyan-500/10'    },
  redux:      { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400',  label: 'Redux',  glow: 'hover:shadow-purple-500/10'  },
  nodejs:     { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',   label: 'Node',   glow: 'hover:shadow-green-500/10'   },
  tailwind:   { bg: 'bg-teal-500/10',   border: 'border-teal-500/20',   text: 'text-teal-400',    label: 'TW',     glow: 'hover:shadow-teal-500/10'    },
  general:    { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400',  label: 'Other',  glow: 'hover:shadow-violet-500/10'  },
}

export default function CourseCard({ course, index = 0, className = '' }) {
  const cardRef = useRef(null)

  useEffect(() => {
    if (!cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, delay: index * 0.05, ease: 'power2.out' },
    )
  }, [index])

  const onEnter = () => gsap.to(cardRef.current, { y: -4, duration: 0.2, ease: 'power2.out' })
  const onLeave = () => gsap.to(cardRef.current, { y: 0,  duration: 0.2, ease: 'power2.out' })

  if (!course) return null

  const cat          = CAT[course.category] || CAT.general
  const totalSecs    = (course.videos || []).reduce((s, v) => s + (v.duration || 0), 0)
  const videoCount   = course.videos?.length ?? course.videoCount ?? 0
  const rating       = typeof course.rating === 'object' ? (course.rating?.average ?? 0) : (course.rating ?? 0)
  const ratingCount  = typeof course.rating === 'object' ? (course.rating?.count ?? 0)   : (course.ratingCount ?? 0)
  const isPro        = course.price > 0
  const instructorName = typeof course.instructor === 'object'
    ? course.instructor?.username : course.instructor
  const isNew = course.createdAt
    ? Date.now() - new Date(course.createdAt) < 14 * 24 * 60 * 60 * 1000
    : false

  return (
    <Link
      to={ROUTES.COURSE(course._id)}
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={
        'group block rounded-2xl overflow-hidden ' +
        'bg-base-200 border border-base-content/5 ' +
        'hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 ' +
        'transition-all duration-300 ' +
        cat.glow + ' ' +
        className
      }
    >
      {/* Thumbnail */}
      <div className="relative h-36 sm:h-40 bg-base-300 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className={'w-full h-full flex items-center justify-center ' + cat.bg}>
            <span className={'text-3xl font-black tracking-tighter opacity-40 ' + cat.text}>
              {cat.label}
            </span>
          </div>
        )}

        {/* Gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-200/60 via-transparent to-transparent" />

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
            <IoPlay className="text-white text-sm ml-0.5" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {isNew && (
            <span className="px-1.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500 text-white shadow-sm">
              NEW
            </span>
          )}
          {isPro && (
            <span className="px-1.5 py-0.5 rounded-md text-xs font-bold bg-primary text-white shadow-sm">
              PRO
            </span>
          )}
        </div>

        {/* Category */}
        <div className={'absolute top-2 right-2 px-2 py-0.5 rounded-lg text-xs font-bold backdrop-blur-sm border ' + cat.bg + ' ' + cat.text + ' ' + cat.border}>
          {cat.label}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 space-y-2">
        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-base-content/40">
          <span className="flex items-center gap-1">
            <IoBookOutline className="text-xs" />
            {videoCount} dars
          </span>
          {totalSecs > 0 && (
            <>
              <span className="text-base-content/20">·</span>
              <span className="flex items-center gap-1">
                <IoTime className="text-xs" />
                {formatDurationText(totalSecs)}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2 text-base-content group-hover:text-primary transition-colors duration-200">
          {course.title}
        </h3>

        {/* Instructor */}
        {instructorName && (
          <p className="text-xs text-base-content/30 truncate">{instructorName}</p>
        )}

        {/* Rating + Price */}
        <div className="flex items-center justify-between pt-2 border-t border-base-content/5">
          <div className="flex items-center gap-1">
            <IoStar className="text-yellow-400 text-xs" />
            <span className="text-xs font-semibold text-base-content/60">
              {rating > 0 ? Number(rating).toFixed(1) : '—'}
            </span>
            {ratingCount > 0 && (
              <span className="text-xs text-base-content/25">({ratingCount})</span>
            )}
          </div>
          <span className={'text-xs sm:text-sm font-bold ' + (isPro ? 'text-primary' : 'text-emerald-400')}>
            {isPro ? course.price.toLocaleString() + " so'm" : 'Bepul'}
          </span>
        </div>
      </div>
    </Link>
  )
}
