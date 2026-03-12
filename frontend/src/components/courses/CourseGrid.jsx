import CourseCard from './CourseCard'
import CourseSkeleton from './CourseSkeleton'

/**
 * CourseGrid — responsive grid of CourseCards
 */
export default function CourseGrid({ courses = [], loading = false, emptyText = 'Kurs topilmadi' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => <CourseSkeleton key={i} />)}
      </div>
    )
  }

  if (!courses.length) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-zinc-400 text-lg">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {courses.map((course, i) => (
        <CourseCard key={course._id} course={course} index={i} />
      ))}
    </div>
  )
}
