import { useDispatch, useSelector } from 'react-redux'
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

import { setFilter, selectFilters } from '@store/slices/courseSlice'
import { CATEGORIES, SORT_OPTIONS } from '@utils/constants'

/**
 * CourseFilter — category tabs + sort dropdown
 */
export default function CourseFilter() {
  const dispatch = useDispatch()
  const filters  = useSelector(selectFilters)
  const tabsRef  = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      tabsRef.current.children,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out' },
    )
  }, [])

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div ref={tabsRef} className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => dispatch(setFilter({ category: cat.id }))}
            className={`category-badge transition-all duration-200 ${
              filters.category === cat.id
                ? 'bg-primary-500/25 border-primary-500/60 text-primary-300 scale-105'
                : ''
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-500">Saralash:</span>
        <select
          value={filters.sort}
          onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
          className="select select-bordered select-xs bg-dark-card border-dark-border text-zinc-300
                     focus:border-primary-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
