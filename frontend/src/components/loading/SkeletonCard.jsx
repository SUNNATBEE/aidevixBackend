import { memo } from 'react'

// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/components/loading/SkeletonCard.jsx
// ============================================================

const CourseSkeleton = () => (
  <div className="card bg-base-200 border border-base-300 shadow-xl overflow-hidden animate-pulse">
    {/* Image skeleton */}
    <div className="h-48 bg-base-300 relative">
      <div className="absolute top-4 left-4 h-6 w-20 bg-base-100/20 rounded-full" />
    </div>
    
    <div className="card-body p-5 gap-3">
      {/* Category and Rating */}
      <div className="flex justify-between items-center">
        <div className="h-4 w-16 bg-base-300 rounded" />
        <div className="h-4 w-12 bg-base-300 rounded" />
      </div>
      
      {/* Title */}
      <div className="h-6 bg-base-300 rounded w-full mt-1" />
      <div className="h-6 bg-base-300 rounded w-2/3" />
      
      {/* Stats */}
      <div className="flex gap-4 mt-2">
        <div className="h-4 w-14 bg-base-300 rounded" />
        <div className="h-4 w-14 bg-base-300 rounded" />
      </div>
      
      {/* Footer */}
      <div className="divider my-0" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-6 w-20 bg-base-300 rounded" />
        <div className="h-10 w-28 bg-indigo-500/20 rounded-xl" />
      </div>
    </div>
  </div>
)

const UserSkeleton = () => (
  <div className="bg-base-200 p-4 rounded-2xl border border-base-300 flex items-center gap-4 animate-pulse">
    <div className="w-16 h-16 rounded-full bg-base-300 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-5 bg-base-300 rounded w-1/2" />
      <div className="h-4 bg-base-300 rounded w-1/4" />
      <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden mt-2">
        <div className="w-1/3 h-full bg-indigo-500/30" />
      </div>
    </div>
    <div className="w-12 h-12 rounded-xl bg-base-300 shrink-0" />
  </div>
)

const VideoSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-4 bg-base-200 p-3 rounded-2xl border border-base-300 animate-pulse">
    <div className="w-full md:w-48 h-32 bg-base-300 rounded-xl shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-6 bg-base-300 rounded w-3/4" />
      <div className="h-4 bg-base-300 rounded w-1/2" />
      <div className="flex gap-3 mt-4">
        <div className="h-4 w-16 bg-base-300 rounded" />
        <div className="h-4 w-16 bg-base-300 rounded" />
      </div>
    </div>
  </div>
)

const ProfileSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto animate-pulse">
    {/* Header */}
    <div className="flex flex-col items-center mb-12">
      <div className="w-32 h-32 rounded-full bg-base-300 border-4 border-base-100 shadow-xl mb-4" />
      <div className="h-8 bg-base-300 rounded w-48 mb-2" />
      <div className="h-4 bg-base-300 rounded w-32" />
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-base-200 p-6 rounded-3xl border border-base-300 flex flex-col items-center">
          <div className="h-4 bg-base-300 rounded w-16 mb-3" />
          <div className="h-8 bg-base-300 rounded w-12" />
        </div>
      ))}
    </div>
    
    {/* Content Area */}
    <div className="space-y-4">
      <div className="h-8 bg-base-300 rounded w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CourseSkeleton />
        <CourseSkeleton />
      </div>
    </div>
  </div>
)

const SkeletonCard = ({ type = 'course', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'course': return <CourseSkeleton />
      case 'user': return <UserSkeleton />
      case 'video': return <VideoSkeleton />
      case 'profile': return <ProfileSkeleton />
      default: return <CourseSkeleton />
    }
  }

  // If type is profile, count is ignored as it's a full page skeleton
  if (type === 'profile') return renderSkeleton()

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="w-full">
          {renderSkeleton()}
        </div>
      ))}
    </>
  )
}

export default memo(SkeletonCard)
