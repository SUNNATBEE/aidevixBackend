import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter, selectFilters } from '@store/slices/courseSlice'
import { CATEGORIES, SORT_OPTIONS } from '@utils/constants'
import { useSound } from '@/context/SoundContext'
import { useLang } from '@context/LangContext'

export default function CourseFilter() {
  const { t } = useLang()
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false)
  const filters  = useSelector(selectFilters)

  const LEVELS = [
    { id: 'all',          label: t('filter.all') },
    { id: 'beginner',     label: t('filter.beginner') },
    { id: 'intermediate', label: t('filter.intermediate') },
    { id: 'advanced',     label: t('filter.advanced') },
  ]

  const RATINGS = [
    { value: 0,   label: t('filter.all') },
    { value: 4.5, label: '4.5+' },
    { value: 4.0, label: '4.0+' },
    { value: 3.5, label: '3.5+' },
  ]

  const COLLAPSED_COUNT = 4
  const displayedCategories = expanded ? CATEGORIES : CATEGORIES.slice(0, COLLAPSED_COUNT)
  const hasMore = CATEGORIES.length > COLLAPSED_COUNT

  const { playSound } = useSound()

  const playHoverSound = () => {
    playSound('/sounds/onlyclick.wav')
  }

  return (
    <div className="space-y-4">
      {/* Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
        {displayedCategories.map((cat) => {
          const active = filters.category === cat.id
          return (
            <button
              key={cat.id}
              onMouseEnter={playHoverSound}
              onClick={() => dispatch(setFilter({ category: cat.id }))}
              className={
                'w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 text-center ' +
                (active
                  ? 'bg-primary text-primary-content shadow-[0_8px_25px_rgba(99,102,241,0.3)] scale-[1.02]'
                  : 'bg-base-200/50 border border-base-content/5 text-base-content/60 hover:bg-base-300 hover:text-base-content hover:scale-[1.01]')
              }
            >
              {t(`cat.${cat.id}`, cat.label)}
            </button>
          )
        })}

        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            onMouseEnter={playHoverSound}
            className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 text-center bg-base-200/80 border border-dashed border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
          >
            {expanded ? t('filter.collapse') : t('filter.expand')}
          </button>
        )}
      </div>

      {/* Level + Rating + Sort row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Level filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-base-content/40 whitespace-nowrap">{t('filter.level')}</span>
          <div className="flex gap-1">
            {LEVELS.map((lvl) => {
              const active = (filters.level || 'all') === lvl.id
              return (
                <button
                  key={lvl.id}
                  onMouseEnter={playHoverSound}
                  onClick={() => dispatch(setFilter({ level: lvl.id === 'all' ? undefined : lvl.id }))}
                  className={
                    'px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ' +
                    (active
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-base-200 border border-base-content/8 text-base-content/45 hover:bg-base-300')
                  }
                >
                  {lvl.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Rating filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-base-content/40 whitespace-nowrap">{t('filter.rating')}</span>
          <div className="flex gap-1">
            {RATINGS.map((r) => {
              const active = (filters.minRating || 0) === r.value
              return (
                <button
                  key={r.value}
                  onMouseEnter={playHoverSound}
                  onClick={() => dispatch(setFilter({ minRating: r.value || undefined }))}
                  className={
                    'flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ' +
                    (active
                      ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                      : 'bg-base-200 border border-base-content/8 text-base-content/45 hover:bg-base-300')
                  }
                >
                  {r.value > 0 && <IoStar className="text-yellow-400 text-[10px]" />}
                  {r.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-base-content/40 whitespace-nowrap">{t('filter.sort')}</span>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
            className="select select-xs sm:select-sm bg-base-200 border-base-content/10 text-xs sm:text-sm max-w-[180px] rounded-xl"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{t(`sort.${opt.value}`, opt.label)}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

