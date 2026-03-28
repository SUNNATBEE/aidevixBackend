import { useDispatch, useSelector } from 'react-redux'
import { setFilter, selectFilters } from '@store/slices/courseSlice'
import { CATEGORIES, SORT_OPTIONS } from '@utils/constants'

export default function CourseFilter() {
  const dispatch = useDispatch()
  const filters  = useSelector(selectFilters)

  return (
    <div className="space-y-3">
      {/* Category tabs — horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const active = filters.category === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => dispatch(setFilter({ category: cat.id }))}
              className={
                'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ' +
                (active
                  ? 'bg-primary text-primary-content shadow-lg shadow-primary/25'
                  : 'bg-base-200 border border-base-content/8 text-base-content/55 hover:bg-base-300 hover:text-base-content')
              }
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-base-content/40 whitespace-nowrap">Saralash:</span>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
          className="select select-xs sm:select-sm bg-base-200 border-base-content/10 text-xs sm:text-sm flex-1 max-w-[180px] rounded-xl"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
