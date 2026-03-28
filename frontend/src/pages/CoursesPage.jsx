import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSearch, IoClose, IoOptions } from 'react-icons/io5'
import { useCourses } from '@hooks/useCourses'
import CourseGrid from '@components/courses/CourseGrid'
import CourseFilter from '@components/courses/CourseFilter'

function useDebounce(value, delay) {
  const [d, setD] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return d
}

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch]             = useState(searchParams.get('search') || '')
  const [showFilter, setShowFilter]     = useState(false)
  const debouncedSearch                 = useDebounce(search, 500)

  const { courses, loading, filters, pages, total, fetchAll, setFilter, setPage } = useCourses()

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setFilter({ category: cat })
  }, [])

  useEffect(() => {
    const params = {
      category: filters.category !== 'all' ? filters.category : undefined,
      search:   debouncedSearch || undefined,
      sort:     filters.sort,
      page:     filters.page,
      limit:    12,
    }
    fetchAll(params)
    const sp = {}
    if (params.category) sp.category = params.category
    if (params.search)   sp.search   = params.search
    setSearchParams(sp, { replace: true })
  }, [filters.category, filters.sort, filters.page, debouncedSearch])

  const clearSearch = useCallback(() => setSearch(''), [])
  const hasMore     = filters.page < pages

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 sm:mb-10"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-base-content leading-tight">
                Barcha{' '}
                <span className="text-primary">Kurslar</span>
              </h1>
              <p className="text-base-content/45 text-sm sm:text-base mt-1">
                Professional dasturlash kurslarini kashf eting
              </p>
            </div>
            {total > 0 && (
              <div className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-xs font-bold text-primary">{total} kurs</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Search + Filter toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="flex gap-2 mb-4"
        >
          {/* Search */}
          <div className="relative flex-1">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35 text-sm pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setFilter({ page: 1 }) }}
              placeholder="Kurs qidirish..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-base-200 border border-base-content/8 focus:border-primary/40 focus:outline-none text-sm transition-colors placeholder:text-base-content/30"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/35 hover:text-base-content transition-colors"
                >
                  <IoClose className="text-sm" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filter toggle — mobile only */}
          <button
            onClick={() => setShowFilter(v => !v)}
            className={
              'lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 flex-shrink-0 ' +
              (showFilter
                ? 'bg-primary/15 border-primary/30 text-primary'
                : 'bg-base-200 border-base-content/8 text-base-content/55')
            }
          >
            <IoOptions className="text-base" />
            <span className="hidden xs:inline">Filter</span>
          </button>
        </motion.div>

        {/* ── Filter panel ── */}
        {/* Desktop: always visible */}
        <div className="hidden lg:block mb-6">
          <CourseFilter />
        </div>

        {/* Mobile: toggle */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              key="mobile-filter"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4 lg:hidden"
            >
              <div className="pb-2">
                <CourseFilter />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Grid ── */}
        <CourseGrid
          courses={courses}
          loading={loading && filters.page === 1}
          emptyText={
            debouncedSearch
              ? `"${debouncedSearch}" bo'yicha kurs topilmadi`
              : "Hozircha kurslar yo'q"
          }
        />

        {/* Loading more */}
        {loading && filters.page > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-60 rounded-2xl bg-base-200 animate-pulse" />
            ))}
          </div>
        )}

        {/* Load more */}
        {!loading && hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8 sm:mt-12"
          >
            <button
              onClick={() => setPage(filters.page + 1)}
              className="btn btn-outline btn-primary rounded-2xl px-8 sm:px-12"
            >
              Yana yuklash
            </button>
          </motion.div>
        )}

        {/* End */}
        {!loading && !hasMore && courses.length > 0 && (
          <p className="text-center text-xs text-base-content/25 mt-8">
            Barcha {total} ta kurs ko'rsatildi
          </p>
        )}
      </div>
    </div>
  )
}
