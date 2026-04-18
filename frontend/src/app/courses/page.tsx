'use client';

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSearch, IoClose, IoOptions } from 'react-icons/io5'
import { useCourses } from '@hooks/useCourses'
import CourseGrid from '@components/courses/CourseGrid'
import CourseFilter from '@components/courses/CourseFilter'
import { useLang } from '@/context/LangContext'

function useDebounce(value: any, delay: number) {
  const [d, setD] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return d
}

function CoursesContent() {
  const searchParams = useSearchParams()
  const [search, setSearch]             = useState(searchParams?.get('search') || '')
  const [showFilter, setShowFilter]     = useState(false)
  const [isReady, setIsReady]           = useState(false)
  const debouncedSearch                 = useDebounce(search, 500)

  const { t } = useLang()
  const { courses, loading, filters, pages, total, fetchAll, setFilter, setPage } = useCourses()

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1500)
    const cat = searchParams?.get('category')
    if (cat) setFilter({ category: cat })
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const params = {
      category: filters.category !== 'all' ? filters.category : undefined,
      search:   debouncedSearch || undefined,
      sort:     filters.sort,
      level:    filters.level || undefined,
      minRating: filters.minRating || undefined,
      page:     filters.page,
      limit:    12,
    }
    fetchAll(params)
  }, [filters.category, filters.sort, filters.level, filters.minRating, filters.page, debouncedSearch])

  const clearSearch = useCallback(() => setSearch(''), [])
  const hasMore     = filters.page < pages

  if (!isReady) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 space-y-4">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-12 w-64" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-72 w-full rounded-[2rem]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

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
                {t('courses.allTitle').split(' ')[0]}{' '}
                <span className="text-primary">{t('courses.allTitle').split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-base-content/45 text-sm sm:text-base mt-1">
                {t('courses.allSubtitle')}
              </p>
            </div>
            {total > 0 && (
              <div className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-xs font-bold text-primary">{total} {t('courses.count')}</span>
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
          <div className="relative flex-1">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/35 text-sm pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setFilter({ page: 1 }) }}
              placeholder={t('courses.search')}
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

        <div className="hidden lg:block mb-6">
          <CourseFilter />
        </div>

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

        <CourseGrid
          courses={courses}
          loading={loading && filters.page === 1}
          emptyText={
            debouncedSearch
              ? `"${debouncedSearch}" ${t('courses.notFound')}`
              : t('courses.empty')
          }
        />

        {loading && filters.page > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-60 rounded-2xl bg-base-200 animate-pulse" />
            ))}
          </div>
        )}

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
              {t('courses.loadMore')}
            </button>
          </motion.div>
        )}

          <p className="text-center text-xs text-base-content/25 mt-8">
            {t('courses.allShown').replace('{total}', total.toString()).includes('{total}') 
              ? t('courses.allShown').replace('{total}', total.toString())
              : `${t('filter.all')} ${total} ${t('courses.allShown')}`}
          </p>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-20 px-4 bg-base-100">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-12 h-10 w-64 bg-base-300 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 w-full bg-base-300 rounded-[2rem]" />
            ))}
          </div>
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  )
}
