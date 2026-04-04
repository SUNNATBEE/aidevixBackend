export default function CourseSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-base-200 animate-pulse border border-base-content/5">
      <div className="h-40 bg-base-300" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 bg-base-300 rounded-full w-12" />
          <div className="h-3 bg-base-300 rounded-full w-20" />
        </div>
        <div className="h-4 bg-base-300 rounded-lg w-4/5" />
        <div className="h-3 bg-base-300 rounded-lg w-full" />
        <div className="h-3 bg-base-300 rounded-lg w-2/3" />
        <div className="flex justify-between items-center pt-2 border-t border-base-300">
          <div className="h-3 bg-base-300 rounded-full w-16" />
          <div className="h-4 bg-base-300 rounded-lg w-20" />
        </div>
      </div>
    </div>
  )
}
