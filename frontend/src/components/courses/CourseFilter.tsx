import { useDispatch, useSelector } from 'react-redux'
import { setFilter, selectFilters } from '@store/slices/courseSlice'
import { CATEGORIES, SORT_OPTIONS } from '@utils/constants'
import { IoStar } from 'react-icons/io5'

const LEVELS = [
  { id: 'all',          label: 'Barchasi' },
  { id: 'beginner',     label: "Boshlang'ich" },
  { id: 'intermediate', label: "O'rta" },
  { id: 'advanced',     label: 'Yuqori' },
]

const RATINGS = [
  { value: 0,   label: 'Barchasi' },
  { value: 4.5, label: '4.5+' },
  { value: 4.0, label: '4.0+' },
  { value: 3.5, label: '3.5+' },
]

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

      {/* Level + Rating + Sort row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Level filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-base-content/40 whitespace-nowrap">Daraja:</span>
          <div className="flex gap-1">
            {LEVELS.map((lvl) => {
              const active = (filters.level || 'all') === lvl.id
              return (
                <button
                  key={lvl.id}
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
          <span className="text-xs text-base-content/40 whitespace-nowrap">Reyting:</span>
          <div className="flex gap-1">
            {RATINGS.map((r) => {
              const active = (filters.minRating || 0) === r.value
              return (
                <button
                  key={r.value}
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
          <span className="text-xs text-base-content/40 whitespace-nowrap">Saralash:</span>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
            className="select select-xs sm:select-sm bg-base-200 border-base-content/10 text-xs sm:text-sm max-w-[180px] rounded-xl"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

