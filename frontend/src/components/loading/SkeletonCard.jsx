// ╔══════════════════════════════════════════════════════════════╗
// ║  SkeletonCard.jsx                                            ║
// ║  OQUVCHI: QUDRAT                                             ║
// ║  Branch:  feature/qudrat-loading                             ║
// ║  Vazifa:  Kurs/User kartalar uchun loading skeleton          ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Props:
 * - type: 'course' | 'user' | 'video' | 'profile'
 * - count: nechta skeleton ko'rsatish (default: 1)
 *
 * Ishlatish:
 * import SkeletonCard from '@components/loading/SkeletonCard'
 * <SkeletonCard type="course" count={6} />
 *
 * Texnologiyalar:
 * - DaisyUI skeleton class
 * - Tailwind CSS animate-pulse
 */

const SkeletonCard = ({ type = 'course', count = 1 }) => {
  // TODO: QUDRAT type ga mos skeleton dizayn yozadi
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-200 shadow animate-pulse">
          <div className="h-48 bg-base-300 rounded-t-2xl"></div>
          <div className="card-body gap-3">
            <div className="h-4 bg-base-300 rounded w-3/4"></div>
            <div className="h-3 bg-base-300 rounded w-1/2"></div>
            <div className="h-3 bg-base-300 rounded w-full"></div>
          </div>
        </div>
      ))}
    </>
  )
}

export default SkeletonCard
