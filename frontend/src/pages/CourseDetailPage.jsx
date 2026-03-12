// ============================================================
//  CourseDetailPage.jsx
//  KIM YOZADI : DONIYOR
//  BRANCH     : feature/doniyor-courses
//  ROUTE      : /courses/:id
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  LAYOUT: Chap panel (2/3) + O'ng sticky panel (1/3)
//
//  SOL PANEL:
//  ─────────────
//  1. BREADCRUMB navigatsiya:
//       Bosh sahifa > Kurslar > [Kurs nomi]
//       — Link komponenti bilan
//
//  2. KURS HEADER:
//       — Kategoriya badge (🟠 HTML, 🟡 JavaScript...)
//       — "Daraja" badge (Boshlang'ich / O'rta / Yuqori)
//       — Sarlavha (h1, text-3xl md:text-4xl font-black)
//       — Qisqa tavsif (text-zinc-400)
//       — ⭐ Yulduzlar + baho raqami + izohlar soni
//       — Meta row: "12 dars | 24 soat | 1,200 o'quvchi"
//
//  3. "NIMA O'RGANASIZ?" ACCORDION:
//       — course.requirements massividan
//       — DaisyUI collapse/accordion
//       — ✅ ikonasi har bir element uchun
//
//  4. DARSLAR RO'YXATI (accordion yoki open list):
//       — courseVideos massividan
//       — Har bir dars:
//           [raqam] [nomi] [davomiylik] [🔒/▶]
//       — Obunasiz: 🔒 yopiq, birinchi 2 ta: ▶ ochiq (demo)
//       — Bosiganda: /videos/:id sahifasiga o'tadi
//       — SkeletonCard loading davomida
//
//  5. PROYEKTLAR BO'LIMI:
//       — GET /api/projects/course/:id dan olinadi
//       — Har bir loyiha kartasi:
//           [emoji] Loyiha nomi
//           Texnologiyalar: React, Redux, Node.js
//           XP mukofoti: +200 XP
//           Daraja: Intermediate
//           Vazifalar soni: 5 ta vazifa
//       — loading bo'lsa skeleton
//
//  O'NG PANEL (sticky top-24):
//  ─────────────────────────────
//  — Thumbnail rasm (aspect-video) yoki kategoriya emoji
//  — Narx: "$0" yoki "Bepul" (katta, yashil/primary)
//  — "Boshlash" CTA tugmasi (btn-primary btn-block)
//  — Divider
//  — Statistika:
//      📹 Darslar: 14 ta
//      💻 Loyihalar: 3 ta
//      ⏱ Umumiy: 24 soat
//      🏆 XP mukofoti: +2,800 XP
//      📊 Daraja: Boshlang'ich
//
//  FIGMA: "Aidevix Course Detail" sahifasini qarang
//
//  API ENDPOINTLAR:
//    GET /api/courses/:id          → kurs ma'lumoti
//    GET /api/videos/course/:id    → video darslar ro'yxati
//    GET /api/projects/course/:id  → loyihalar ro'yxati
//
//  HOOKS:
//    useCourse(id)  → { course, loading }
//    useVideos()    → { courseVideos, loading, fetchByCourse }
//    + projectsApi  → loyihalar (TODO: useProjects hook yozing)
//
//  KERAKLI PAKETLAR:
//    framer-motion, react-icons, axios
// ============================================================

// 📦 IMPORTLAR
import { useEffect, useState }           from 'react'
import { useParams, Link, useNavigate }  from 'react-router-dom'
import { motion, AnimatePresence }       from 'framer-motion'
import {
  IoTime, IoPlay, IoArrowBack,
  IoCheckmarkCircle, IoLockClosed,
  IoPeople, IoStar, IoCode,
} from 'react-icons/io5'
import { FaProjectDiagram }              from 'react-icons/fa'

// Redux hooks
import { useCourse }   from '@hooks/useCourses'  // GET /api/courses/:id
import { useVideos }   from '@hooks/useVideos'   // GET /api/videos/course/:id

// Komponentlar (mavjud)
import Loader       from '@components/common/Loader'
import Badge        from '@components/common/Badge'
import StarRating   from '@components/common/StarRating'
import VideoCard    from '@components/videos/VideoCard'
import SkeletonCard from '@components/loading/SkeletonCard'  // QUDRAT yozadi

// Utils
import { formatCourseDuration, formatDuration } from '@utils/formatDuration'
import { ROUTES }                                from '@utils/constants'

// API (loyihalar uchun)
// TODO: useProjects hook yarating yoki to'g'ridan-to'g'ri projectApi.getProjectsByCourse(id) chaqiring
import axios from 'axios'

// Kategoriya emoji xaritasi
const CAT_ICONS = {
  html:       '🟠',
  css:        '🔵',
  tailwind:   '💨',
  javascript: '🟡',
  react:      '⚛️',
  redux:      '🔴',
  typescript: '🔷',
  nodejs:     '🟢',
}

// ─────────────────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  // ── Kurs + video ─────────────────────────────────────────────────────────
  const { course, loading }                              = useCourse(id)
  const { courseVideos, loading: vLoading, fetchByCourse } = useVideos()

  // ── Loyihalar state ──────────────────────────────────────────────────────
  /*
    TODO: useProjects hook yarating:
    frontend/src/hooks/useProjects.js
    — fetchProjectsByCourse(courseId) → GET /api/projects/course/:id
    — projects state, loading state
    — Redux yoki local state bilan
  */
  const [projects, setProjects]         = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)

  // ── Accordion state ──────────────────────────────────────────────────────
  const [openAccordion, setOpenAccordion] = useState(null)

  // ── Ma'lumotlarni yuklash ─────────────────────────────────────────────────
  useEffect(() => {
    if (id) {
      fetchByCourse(id)
      loadProjects(id)
    }
    window.scrollTo(0, 0)
  }, [id])

  const loadProjects = async (courseId) => {
    /*
      TODO: projectApi orqali loyihalarni yuklash:
      import { getProjectsByCourse } from '@api/projectApi'
      const data = await getProjectsByCourse(courseId)
      setProjects(data)

      Hozircha: backend /api/projects/course/:id dan to'g'ridan fetch
    */
    try {
      setProjectsLoading(true)
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const { data } = await axios.get(`${base}/api/projects/course/${courseId}`)
      setProjects(data.data || [])
    } catch {
      setProjects([])
    } finally {
      setProjectsLoading(false)
    }
  }

  // ── Loading holat ─────────────────────────────────────────────────────────
  if (loading) return <Loader fullScreen text="Kurs yuklanmoqda..." />

  // ── Kurs topilmasa ────────────────────────────────────────────────────────
  if (!course) return (
    <div className="section-container pt-28 text-center">
      {/* TODO: Chiroyli "topilmadi" sahifa dizayn qiling */}
      <p className="text-7xl mb-4">😕</p>
      <h2 className="text-2xl font-bold mb-3">Kurs topilmadi</h2>
      <p className="text-base-content/60 mb-6">Bu kurs mavjud emas yoki o'chirilgan.</p>
      <Link to={ROUTES.COURSES} className="btn btn-primary">Kurslarga qaytish</Link>
    </div>
  )

  // ── Umumiy ma'lumotlar ────────────────────────────────────────────────────
  const catIcon       = CAT_ICONS[course.category?.toLowerCase()] || '📚'
  const totalXP       = projects.reduce((s, p) => s + (p.xpReward || 0), 0)
  const totalDuration = courseVideos.reduce((s, v) => s + (v.duration || 0), 0)

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 pt-24">

        {/* ─── Breadcrumb ───────────────────────────────────────────────── */}
        {/*
          TODO: DaisyUI breadcrumb komponenti:
          <div className="breadcrumbs text-sm mb-6">
            <ul>
              <li><Link to="/">Bosh sahifa</Link></li>
              <li><Link to="/courses">Kurslar</Link></li>
              <li className="font-semibold">{course.title}</li>
            </ul>
          </div>
        */}
        <div className="flex items-center gap-2 text-sm text-base-content/60 mb-6">
          <Link to={ROUTES.HOME} className="hover:text-primary">Bosh sahifa</Link>
          <span>/</span>
          <Link to={ROUTES.COURSES} className="hover:text-primary">Kurslar</Link>
          <span>/</span>
          <span className="text-base-content font-medium truncate max-w-[200px]">{course.title}</span>
        </div>

        {/* ─── 2-ustunli layout ─────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── SOL PANEL ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* 1. Kurs header ─────────────────────────────────────────── */}
            {/*
              TODO: Kurs header dizayn:
              — Kategoriya badge + Daraja badge (bir qatorda)
              — Sarlavha katta
              — Tavsif
              — Yulduz reytingi
              — Meta row (darslar, davomiylik, o'quvchilar)
            */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Badgelar */}
              <div className="flex gap-2 flex-wrap mb-4">
                <Badge category={course.category} />
                {/*
                  TODO: Daraja badge qo'shing:
                  <span className="badge badge-outline">
                    {course.level === 'beginner' ? 'Boshlang\'ich' :
                     course.level === 'intermediate' ? 'O\'rta' : 'Yuqori'}
                  </span>
                  {course.isFree && <span className="badge badge-success">Bepul</span>}
                */}
                {course.isFree && <span className="badge badge-success badge-sm">Bepul</span>}
              </div>

              {/* Sarlavha */}
              <h1 className="text-3xl md:text-4xl font-black mb-4">{course.title}</h1>

              {/* Tavsif */}
              <p className="text-base-content/70 leading-relaxed mb-4">{course.description}</p>

              {/* Yulduzlar */}
              {course.rating?.average > 0 && (
                <StarRating value={course.rating.average} count={course.rating.count} size="md" />
              )}

              {/* Meta */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-base-content/60">
                <span className="flex items-center gap-1">
                  <IoPlay className="text-primary" />
                  {courseVideos.length} dars
                </span>
                <span className="flex items-center gap-1">
                  <IoTime className="text-primary" />
                  {formatCourseDuration(courseVideos.map((v) => v.duration))}
                </span>
                {/*
                  TODO: O'quvchilar soni:
                  <span className="flex items-center gap-1">
                    <IoPeople className="text-primary" />
                    {course.studentsCount?.toLocaleString()} o'quvchi
                  </span>
                */}
              </div>
            </motion.div>

            {/* 2. "Nima o'rganasiz?" accordion ──────────────────────── */}
            {/*
              TODO: DaisyUI collapse/accordion:
              — course.requirements massividan
              — Har bir element: ✅ + matn
              — Ochiq/yopiq toggle
              Misol:
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title font-bold">
                  📋 Nima o'rganasiz?
                </div>
                <div className="collapse-content">
                  <ul className="space-y-2">
                    {requirements.map((r, i) => (
                      <li key={i} className="flex gap-2">
                        <IoCheckmarkCircle className="text-success flex-shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            */}
            {course.requirements?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="collapse collapse-arrow bg-base-200 rounded-xl"
              >
                <input type="checkbox" defaultChecked />
                <div className="collapse-title font-bold text-lg">
                  📋 Nima o'rganasiz?
                </div>
                <div className="collapse-content">
                  <ul className="space-y-2 pt-2">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <IoCheckmarkCircle className="text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* 3. Darslar ro'yxati ────────────────────────────────────── */}
            {/*
              TODO: Darslar ro'yxati dizayn:
              — Sarlavha + "N ta dars | Umumiy vaqt"
              — Har bir dars:
                  [raqam] [nomi (truncate)] [davomiylik] [▶/🔒]
              — Birinchi 2 ta: bepul demo (▶)
              — Qolganlar: login + obuna kerak (🔒)
              — hover animatsiya + link to /videos/:id
            */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">📹 Darslar ro'yxati</h2>
                <span className="text-sm text-base-content/60">
                  {courseVideos.length} ta dars •{' '}
                  {formatCourseDuration(courseVideos.map((v) => v.duration))}
                </span>
              </div>

              {vLoading ? (
                <SkeletonCard type="video" count={5} />
              ) : (
                <div className="space-y-2">
                  {courseVideos.map((video, i) => (
                    <motion.div
                      key={video._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      {/*
                        TODO: Chiroyli dars qatori dizayn:
                        — Raqam (1, 2, 3...) — kichik badge
                        — Dars nomi (truncate)
                        — Davomiylik (⏱ 12:30)
                        — ▶ yoki 🔒 ikonasi
                        — hover: background o'zgaradi
                        — link: /videos/:id ga o'tadi
                      */}
                      <VideoCard key={video._id} video={video} index={i} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 4. Loyihalar bo'limi ────────────────────────────────────── */}
            {/*
              TODO: Loyihalar kartalar grid:
              — Sarlavha: "💻 Amaliy Loyihalar"
              — Har bir loyiha kartasi:
                  ┌──────────────────────────────┐
                  │ emoji/thumbnail               │
                  │ Loyiha nomi (bold)            │
                  │ Daraja badge + XP badge       │
                  │ Texnologiyalar (chip list)     │
                  │ [N ta vazifa] [+XP XP]        │
                  │ [ Loyihani boshlash → ]       │
                  └──────────────────────────────┘
              — loading bo'lsa SkeletonCard
            */}
            {(projects.length > 0 || projectsLoading) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-bold mb-4">💻 Amaliy Loyihalar</h2>

                {projectsLoading ? (
                  <SkeletonCard type="course" count={2} />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {projects.map((project, i) => (
                      <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card bg-base-200 border border-base-300 hover:border-primary/50 transition-colors"
                      >
                        <div className="card-body p-5">
                          {/*
                            TODO: Loyiha kartasi to'liq dizayn:
                            — project.thumbnail yoki emoji
                            — project.title
                            — project.level badge
                            — project.xpReward badge
                            — project.technologies chip list
                            — project.tasks.length "N ta vazifa"
                            — "Loyihani boshlash" button
                          */}
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-sm">{project.title}</h3>
                            <span className="badge badge-primary badge-sm">+{project.xpReward} XP</span>
                          </div>
                          <p className="text-xs text-base-content/60 mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          {/* Texnologiyalar */}
                          <div className="flex gap-1 flex-wrap mb-3">
                            {project.technologies?.slice(0, 4).map((tech) => (
                              <span key={tech} className="badge badge-ghost badge-xs">{tech}</span>
                            ))}
                          </div>
                          {/* Meta */}
                          <div className="flex justify-between text-xs text-base-content/60">
                            <span>
                              <IoCode className="inline mr-1" />
                              {project.tasks?.length || 0} ta vazifa
                            </span>
                            <span>{project.estimatedTime}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>{/* ── SOL PANEL END ── */}

          {/* ── O'NG PANEL (sticky) ──────────────────────────────────────── */}
          {/*
            TODO: O'ng panel to'liq dizayn:
            — Thumbnail rasm (aspect-video yoki 16:9)
            — Narx yoki "Bepul" (katta yashil matn)
            — "Boshlash" btn-primary btn-block
            — Separator
            — Statistika:
                📹 Darslar: N ta
                💻 Loyihalar: N ta
                ⏱ Umumiy: N soat
                🏆 XP: +N XP
                📊 Daraja: Boshlang'ich
            — Faqat desktop'da sticky top-24
          */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 overflow-hidden sticky top-24 shadow-xl">
              {/* Thumbnail */}
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-base-300 flex items-center justify-center text-7xl">
                  {catIcon}
                </div>
              )}

              <div className="p-5 space-y-4">
                {/* Narx */}
                <div className="text-3xl font-black">
                  {course.isFree ? (
                    <span className="text-success">Bepul</span>
                  ) : course.price > 0 ? (
                    <span className="text-primary">${course.price}</span>
                  ) : (
                    <span className="text-success">Bepul</span>
                  )}
                </div>

                {/* CTA tugmasi */}
                {/*
                  TODO: "Boshlash" tugmasi:
                  — Birinchi videoga yo'naltirsin: /videos/:firstVideoId
                  — Yoki birinchi loyihaga: /projects/:firstProjectId
                  — Login bo'lmagan bo'lsa: /login ga yo'naltirsin
                */}
                <Link
                  to={courseVideos[0] ? `/videos/${courseVideos[0]._id}` : ROUTES.COURSES}
                  className="btn btn-primary btn-block gap-2"
                >
                  <IoPlay /> Kursni boshlash
                </Link>

                {/* Divider */}
                <div className="divider my-2" />

                {/* Statistika */}
                <div className="space-y-3 text-sm">
                  {[
                    { icon: '📹', label: 'Video darslar', value: `${courseVideos.length} ta` },
                    { icon: '💻', label: 'Loyihalar',     value: `${projects.length} ta` },
                    { icon: '⏱', label: 'Umumiy vaqt',   value: formatCourseDuration(courseVideos.map((v) => v.duration)) },
                    { icon: '🏆', label: 'XP mukofoti',   value: `+${totalXP} XP` },
                    {
                      icon: '📊', label: 'Daraja',
                      value: course.level === 'beginner' ? 'Boshlang\'ich'
                           : course.level === 'intermediate' ? 'O\'rta' : 'Yuqori',
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-base-content/60">
                        {item.icon} {item.label}
                      </span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
