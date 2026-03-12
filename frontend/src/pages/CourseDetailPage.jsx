import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { IoTime, IoPlay, IoArrowBack } from 'react-icons/io5'

import Loader from '@components/common/Loader'
import Badge from '@components/common/Badge'
import StarRating from '@components/common/StarRating'
import VideoCard from '@components/videos/VideoCard'
import { useCourse } from '@hooks/useCourses'
import { useVideos } from '@hooks/useVideos'
import { formatCourseDuration } from '@utils/formatDuration'
import { ROUTES } from '@utils/constants'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { course, loading }               = useCourse(id)
  const { courseVideos, loading: vLoading, fetchByCourse } = useVideos()

  useEffect(() => {
    if (id) fetchByCourse(id)
  }, [id])

  if (loading) return <Loader fullScreen text="Kurs yuklanmoqda..." />
  if (!course) return (
    <div className="section-container pt-28 text-center">
      <p className="text-zinc-400">Kurs topilmadi</p>
      <Link to={ROUTES.COURSES} className="btn btn-primary mt-4">Kurslarga qaytish</Link>
    </div>
  )

  const totalDuration = courseVideos.reduce((s, v) => s + (v.duration || 0), 0)

  return (
    <div className="section-container pt-28 pb-20">
      {/* Back */}
      <Link to={ROUTES.COURSES} className="btn btn-ghost btn-sm gap-2 mb-6">
        <IoArrowBack /> Kurslarga qaytish
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — course info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <Badge category={course.category} className="mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{course.title}</h1>
            <p className="text-zinc-400 leading-relaxed">{course.description}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <IoPlay className="text-primary-400" />
              {courseVideos.length} dars
            </span>
            <span className="flex items-center gap-2">
              <IoTime className="text-primary-400" />
              {formatCourseDuration(courseVideos.map((v) => v.duration))}
            </span>
          </div>

          {course.rating?.average > 0 && (
            <StarRating value={course.rating.average} count={course.rating.count} size="md" />
          )}

          {/* Videos list */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Darslar ro'yxati</h2>
            {vLoading ? (
              <Loader text="Darslar yuklanmoqda..." />
            ) : (
              <div className="space-y-3">
                {courseVideos.map((video, i) => (
                  <VideoCard key={video._id} video={video} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — course card */}
        <div className="lg:col-span-1">
          <div className="glass-card overflow-hidden sticky top-24">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-primary-900/40 to-dark-border
                              flex items-center justify-center text-6xl">
                {getCatIcon(course.category)}
              </div>
            )}
            <div className="p-5 space-y-4">
              <div className="text-3xl font-bold text-primary-400">
                {course.price > 0 ? `$${course.price}` : 'Bepul'}
              </div>
              <Link to={ROUTES.COURSES} className="btn-neon btn btn-block">
                Boshlash
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCatIcon(c) {
  const m = { html: '🟠', css: '🔵', javascript: '🟡', react: '⚛️', typescript: '🔷', nodejs: '🟢' }
  return m[c?.toLowerCase()] || '📚'
}
