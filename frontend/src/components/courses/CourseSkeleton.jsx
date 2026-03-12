/** Skeleton loader for CourseCard */
export default function CourseSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="h-44 skeleton-base rounded-none" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton-base w-3/4" />
        <div className="h-3 skeleton-base w-full" />
        <div className="h-3 skeleton-base w-2/3" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-4 skeleton-base w-24" />
          <div className="h-5 skeleton-base w-12" />
        </div>
      </div>
    </div>
  )
}
