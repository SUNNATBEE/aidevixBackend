import { useEffect } from 'react'
import { IoTrophy } from 'react-icons/io5'

import CourseGrid from '@components/courses/CourseGrid'
import VideoCard from '@components/videos/VideoCard'
import { useCourses } from '@hooks/useCourses'
import { useVideos } from '@hooks/useVideos'

export default function TopCoursesPage() {
  const { topCourses, loading: cLoading, fetchTop }      = useCourses()
  const { topVideos, loading: vLoading, fetchTop: fTV }  = useVideos()

  useEffect(() => {
    fetchTop(12)
    fTV(12)
  }, [])

  return (
    <div className="section-container pt-28 pb-20">
      {/* Header */}
      <div className="text-center mb-12">
        <IoTrophy className="text-5xl text-yellow-400 mx-auto mb-4" />
        <h1 className="section-title mb-3">Top kurslar va videolar</h1>
        <p className="text-zinc-400">Eng ko'p ko'rilgan va yuqori baholangan kontentlar</p>
      </div>

      {/* Top Courses */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-yellow-400">🏆</span> Eng ommabop kurslar
        </h2>
        <CourseGrid courses={topCourses} loading={cLoading} />
      </section>

      {/* Top Videos */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-yellow-400">🎥</span> Eng ko'p ko'rilgan videolar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topVideos.map((video, i) => (
            <VideoCard key={video._id} video={video} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
