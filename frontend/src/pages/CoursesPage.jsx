import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import CourseGrid from '@components/courses/CourseGrid'
import CourseFilter from '@components/courses/CourseFilter'
import Input from '@components/common/Input'
import { IoSearch } from 'react-icons/io5'
import { useCourses } from '@hooks/useCourses'
import { setFilter } from '@store/slices/courseSlice'

export default function CoursesPage() {
  const dispatch      = useDispatch()
  const [params]      = useSearchParams()
  const { courses, loading, filters, fetchAll, setFilter: doFilter } = useCourses()

  // Sync URL query param → filter
  useEffect(() => {
    const cat = params.get('category')
    if (cat) dispatch(setFilter({ category: cat }))
  }, [])

  // Fetch on filter change
  useEffect(() => {
    fetchAll({
      category: filters.category !== 'all' ? filters.category : undefined,
      search:   filters.search   || undefined,
      sort:     filters.sort,
      page:     filters.page,
    })
  }, [filters])

  return (
    <div className="section-container pt-28 pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="section-title mb-2">Barcha kurslar</h1>
        <p className="text-zinc-400">Professional dasturlash kurslarini kashf eting</p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="Kurs qidirish..."
          icon={<IoSearch />}
          value={filters.search}
          onChange={(e) => doFilter({ search: e.target.value })}
        />
      </div>

      {/* Filters */}
      <div className="mb-8">
        <CourseFilter />
      </div>

      {/* Results */}
      <CourseGrid courses={courses} loading={loading} />
    </div>
  )
}
