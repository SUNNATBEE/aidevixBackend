'use client';

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  IoChevronForward, IoStar, IoPeople, IoTime, IoBookOutline,
  IoTrophy, IoBarChart, IoCalendar, IoLanguage, IoChevronDown,
  IoChevronUp, IoPlay, IoLockClosed, IoCheckmarkCircle,
  IoCodeSlash, IoRocket, IoFlash,
} from 'react-icons/io5'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '@store/slices/authSlice'
import { selectInstagramSub, selectTelegramSub } from '@store/slices/subscriptionSlice'
import { useCourse, useCourses } from '@hooks/useCourses'
import { useVideos } from '@hooks/useVideos'
import { useSubscription } from '@hooks/useSubscription'
import StarRating from '@components/common/StarRating'
import CourseCard from '@components/courses/CourseCard'
import SubscriptionGate from '@components/subscription/SubscriptionGate'
import { formatDurationText, formatDuration } from '@utils/formatDuration'
import { ROUTES } from '@utils/constants'
import api from '@api/axiosInstance'

const LEVEL_LABELS = { beginner: "Boshlang'ich", intermediate: "O'rta", advanced: 'Yuqori' }
const LEVEL_COLORS = { beginner: 'badge-success', intermediate: 'badge-warning', advanced: 'badge-error' }
const CAT_TEXT = {
  html: 'text-orange-400', css: 'text-blue-400', javascript: 'text-yellow-400',
  react: 'text-cyan-400', typescript: 'text-blue-300', nodejs: 'text-green-400',
  redux: 'text-purple-400', tailwind: 'text-teal-400', general: 'text-violet-400',
}

// ── Video row ──────────────────────────────────────────────────
function VideoRow({ video, index }) {
  const isFree = index < 2
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-base-300/40 transition-colors">
      <div className="w-7 h-7 rounded-lg bg-base-300 flex items-center justify-center flex-shrink-0 text-xs font-bold text-base-content/40">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-base-content line-clamp-1">{video.title}</p>
        {video.duration > 0 && (
          <p className="text-xs text-base-content/30 mt-0.5 flex items-center gap-1">
            <IoTime className="text-xs" />{formatDuration(video.duration)}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {isFree
          ? <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium"><IoPlay className="text-xs" />Bepul</span>
          : <IoLockClosed className="text-base-content/25 text-sm" />
        }
      </div>
    </div>
  )
}

// ── Accordion ─────────────────────────────────────────────────
function Accordion({ title, subtitle, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-base-content/8 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-base-200 hover:bg-base-300/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-sm truncate">{title}</span>
          {subtitle && <span className="text-xs text-base-content/35 flex-shrink-0">{subtitle}</span>}
        </div>
        {open ? <IoChevronUp className="text-base-content/35 flex-shrink-0 ml-2" />
               : <IoChevronDown className="text-base-content/35 flex-shrink-0 ml-2" />}
      </button>
      {open && <div className="bg-base-100 p-2">{children}</div>}
    </div>
  )
}

// ── Stat row ──────────────────────────────────────────────────
function StatRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-base-content/40">{icon}{label}</span>
      <span className="font-semibold text-base-content/75 text-right">{value}</span>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-3 bg-base-200 rounded w-48 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2"><div className="h-5 bg-base-200 rounded-full w-16" /><div className="h-5 bg-base-200 rounded-full w-20" /></div>
          <div className="h-8 bg-base-200 rounded-xl w-3/4" />
          <div className="h-4 bg-base-200 rounded w-full" />
          <div className="h-4 bg-base-200 rounded w-4/5" />
          <div className="h-14 bg-base-200 rounded-2xl mt-2" />
        </div>
        <div className="h-80 bg-base-200 rounded-2xl" />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { id }                                          = useParams()
  const { course, loading }                             = useCourse(id)
  const { courseVideos, loading: vLoad, fetchByCourse } = useVideos()
  const [recommended, setRecommended]                   = useState([])
  const [projects, setProjects]                         = useState([])

  // Serverdan obuna holatini avtomatik yuklash
  useSubscription()

  useEffect(() => {
    if (!id) return
    fetchByCourse(id)
    api.get(`/courses/${id}/recommended?limit=4`).then(r => setRecommended(r.data?.data?.courses || [])).catch(() => {})
    api.get(`/projects/course/${id}`).then(r => setProjects(r.data?.data?.projects || [])).catch(() => {})
  }, [id])

  const isLoggedIn     = useSelector(selectIsLoggedIn)
  const instagram      = useSelector(selectInstagramSub)
  const telegram       = useSelector(selectTelegramSub)
  const isSubscribed   = !!(isLoggedIn && instagram?.subscribed && telegram?.subscribed)
  const [showGate, setShowGate] = useState(false)

  if (loading) return <Skeleton />
  if (!course)  return null


  const rating         = typeof course.rating === 'object' ? (course.rating?.average ?? 0) : (course.rating ?? 0)
  const ratingCount    = typeof course.rating === 'object' ? (course.rating?.count ?? 0)   : (course.ratingCount ?? 0)
  const totalSecs      = courseVideos.reduce((s, v) => s + (v.duration || 0), 0)
  const level          = course.level || 'beginner'
  const instructorName = typeof course.instructor === 'object' ? course.instructor?.username : course.instructor
  const instructorTitle = typeof course.instructor === 'object' ? course.instructor?.jobTitle : null
  const catColor       = CAT_TEXT[course.category] || 'text-violet-400'

  const handleWatch = () => {
    if (isSubscribed && courseVideos.length > 0) {
      window.location.href = ROUTES.VIDEO(courseVideos[0]._id)
    } else {
      setShowGate(true)
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-base-content/30 mb-6 flex-wrap">
          <Link href={ROUTES.HOME} className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <IoChevronForward className="text-xs opacity-50" />
          <Link href={ROUTES.COURSES} className="hover:text-primary transition-colors">Kurslar</Link>
          <IoChevronForward className="text-xs opacity-50" />
          <span className="text-base-content/55 line-clamp-1 max-w-[160px] sm:max-w-xs">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* ══ LEFT ════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 space-y-6 sm:space-y-8"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {course.category && (
                <span className={'badge badge-outline text-xs font-bold capitalize ' + catColor}>
                  {course.category}
                </span>
              )}
              <span className={'badge text-xs font-semibold ' + (LEVEL_COLORS[level] || 'badge-ghost')}>
                {LEVEL_LABELS[level] || level}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-base-content leading-tight">
                {course.title}
              </h1>
              {course.description && (
                <p className="text-base-content/55 leading-relaxed text-sm sm:text-base">
                  {course.description}
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <StarRating value={rating} count={ratingCount} size="sm" />
              {course.studentsCount > 0 && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-base-content/40">
                  <IoPeople className="text-primary text-sm" />
                  {course.studentsCount.toLocaleString()} o'quvchi
                </span>
              )}
              {course.updatedAt && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-base-content/40">
                  <IoCalendar className="text-primary text-sm" />
                  {new Date(course.updatedAt).toLocaleDateString('uz-UZ')}
                </span>
              )}
              {course.language && (
                <span className="flex items-center gap-1 text-xs sm:text-sm text-base-content/40">
                  <IoLanguage className="text-primary text-sm" />
                  {course.language}
                </span>
              )}
            </div>

            {/* Instructor */}
            {instructorName && (
              <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-base-200 border border-base-content/5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-black text-base sm:text-lg flex-shrink-0">
                  {instructorName[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm">{instructorName}</p>
                  <p className="text-xs text-base-content/35 mt-0.5">{instructorTitle || 'Instruktor'}</p>
                </div>
              </div>
            )}

            {/* Price card — mobile only (shows above videos) */}
            <div className="lg:hidden">
              <MobilePriceCard
                course={course}
                courseVideos={courseVideos}
                totalSecs={totalSecs}
                level={level}
                rating={rating}
                projects={projects}
                catColor={catColor}
                isSubscribed={isSubscribed}
                onWatch={handleWatch}
              />
            </div>

            {/* What you'll learn */}
            {course.requirements?.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <IoCheckmarkCircle className="text-emerald-400" />
                  Nima o'rganasiz?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 sm:p-4 rounded-2xl bg-base-200/50 border border-base-content/5">
                  {course.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-base-content/60">
                      <IoCheckmarkCircle className="text-emerald-400 text-sm flex-shrink-0 mt-0.5" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <IoPlay className="text-primary" />
                  Kurs Dasturi
                </h2>
                {courseVideos.length > 0 && (
                  <span className="text-xs text-base-content/30">
                    {courseVideos.length} dars{totalSecs > 0 && ' · ' + formatDurationText(totalSecs)}
                  </span>
                )}
              </div>

              {vLoad ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 bg-base-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : courseVideos.length > 0 ? (
                <Accordion
                  title="Barcha darslar"
                  subtitle={`${courseVideos.length} ta · ${formatDurationText(totalSecs)}`}
                  defaultOpen
                >
                  <div className="space-y-0.5">
                    {courseVideos.map((v, i) => <VideoRow key={v._id} video={v} index={i} />)}
                  </div>
                </Accordion>
              ) : (
                <div className="py-8 text-center text-sm text-base-content/30 rounded-2xl bg-base-200/40 border border-base-content/5">
                  Darslar hali qo'shilmagan
                </div>
              )}
            </div>

            {/* Projects */}
            {projects.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <IoCodeSlash className="text-primary" />
                  Amaliy Loyihalar
                </h2>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p._id} className="p-3 sm:p-4 rounded-2xl bg-base-200 border border-base-content/5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm">{p.title}</p>
                        <div className="flex gap-1 flex-shrink-0">
                          <span className={'badge badge-sm ' + (LEVEL_COLORS[p.level] || 'badge-ghost')}>
                            {LEVEL_LABELS[p.level] || p.level}
                          </span>
                          {p.xpReward > 0 && (
                            <span className="badge badge-sm bg-yellow-500/15 text-yellow-400 border-yellow-500/20">
                              +{p.xpReward} XP
                            </span>
                          )}
                        </div>
                      </div>
                      {p.description && <p className="text-xs text-base-content/40 line-clamp-2">{p.description}</p>}
                      {p.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.technologies.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-lg text-xs bg-base-300 text-base-content/45">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ══ RIGHT STICKY — desktop only ═════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden lg:block lg:sticky lg:top-24 self-start"
          >
            <DesktopPriceCard
              course={course}
              courseVideos={courseVideos}
              totalSecs={totalSecs}
              level={level}
              rating={rating}
              projects={projects}
              catColor={catColor}
              isSubscribed={isSubscribed}
              onWatch={handleWatch}
            />
          </motion.div>
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12 sm:mt-16"
          >
            <h2 className="text-base sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <IoFlash className="text-primary" />
              Tavsiya etilgan kurslar
            </h2>
            <Swiper
              modules={[Navigation]}
              slidesPerView={2}
              spaceBetween={12}
              navigation
              breakpoints={{ 768: { slidesPerView: 2, spaceBetween: 16 }, 1024: { slidesPerView: 3, spaceBetween: 20 } }}
              className="!pb-1"
            >
              {recommended.map((c, i) => (
                <SwiperSlide key={c._id}>
                  <CourseCard course={c} index={i} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </div>

      <SubscriptionGate
        isOpen={showGate}
        onClose={() => setShowGate(false)}
        onSuccess={() => {
          setShowGate(false)
          if (courseVideos.length > 0) {
            window.location.href = ROUTES.VIDEO(courseVideos[0]._id)
          }
        }}
      />
    </div>
  )
}

// ── Price card shared content ──────────────────────────────────
function PriceCardContent({ course, courseVideos, totalSecs, level, rating, projects, isSubscribed, onWatch }) {
  return (
    <div className="p-4 sm:p-5 space-y-4">
      <div className="space-y-2">
        <button onClick={onWatch} className="btn btn-primary btn-block rounded-xl font-bold gap-2">
          {isSubscribed ? <IoPlay className="text-base" /> : <IoLockClosed className="text-base" />}
          {isSubscribed ? 'Videoni ko\'rish' : 'Obuna bo\'lish va ko\'rish'}
        </button>
      </div>
      <div className="divider my-0 opacity-20" />
      <div className="space-y-2.5">
        <StatRow icon={<IoBookOutline className="text-primary text-sm" />} label="Darslar" value={courseVideos.length} />
        {totalSecs > 0 && <StatRow icon={<IoTime className="text-primary text-sm" />} label="Umumiy vaqt" value={formatDurationText(totalSecs)} />}
        <StatRow icon={<IoBarChart className="text-primary text-sm" />} label="Daraja" value={LEVEL_LABELS[level] || level} />
        {rating > 0 && <StatRow icon={<IoStar className="text-yellow-400 text-sm" />} label="Reyting" value={Number(rating).toFixed(1)} />}
        {course.studentsCount > 0 && <StatRow icon={<IoPeople className="text-primary text-sm" />} label="O'quvchilar" value={course.studentsCount.toLocaleString()} />}
        {projects.length > 0 && <StatRow icon={<IoCodeSlash className="text-primary text-sm" />} label="Loyihalar" value={projects.length} />}
      </div>
    </div>
  )
}

function DesktopPriceCard(props) {
  const { course, catColor } = props
  return (
    <div className="rounded-2xl border border-base-content/8 bg-base-200 overflow-hidden shadow-2xl shadow-base-content/5">
      <div className="relative h-44 bg-base-300 overflow-hidden">
        {course.thumbnail
          ? <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          : <div className={'w-full h-full flex items-center justify-center text-5xl font-black opacity-10 ' + catColor}>{course.category?.toUpperCase().slice(0, 2)}</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-base-200/90 to-transparent" />
      </div>
      <PriceCardContent {...props} />
    </div>
  )
}

function MobilePriceCard(props) {
  const { isSubscribed, onWatch } = props
  return (
    <div className="rounded-2xl border border-base-content/8 bg-base-200 overflow-hidden shadow-lg">
      <div className="flex items-center justify-center px-4 py-3">
        <button onClick={onWatch} className="btn btn-primary btn-sm rounded-xl gap-1">
          {isSubscribed ? <IoPlay className="text-sm" /> : <IoLockClosed className="text-sm" />}
          {isSubscribed ? 'Videoni ko\'rish' : 'Obuna bo\'lish va ko\'rish'}
        </button>
      </div>
    </div>
  )
}
