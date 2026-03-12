// ============================================================
//  TopCoursesPage.jsx
//  KIM YOZADI : NUMTON
//  BRANCH     : feature/numton-top-courses
//  ROUTE      : /top-courses
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  LAYOUT: Chap (2/3 kenglik) + O'ng panel (1/3)
//
//  1. SARLAVHA:
//       🏆 ikonasi (katta, sariq)
//       "Top Kurslar Reytingi" — h1
//       "Eng ko'p o'qilgan va yuqori baholangan kurslar" — subtitle
//
//  2. KATEGORIYA FILTER TABS:
//       [ BARCHASI ] [ HTML ] [ CSS ] [ JS ] [ REACT ] [ NODE.JS ]
//       — activeCategory state bilan boshqariladi
//       — tab bosiganda useTopCourses({ category }) re-fetch
//
//  3. PODIUM — Top 3 kurs (alohida katta kartalar):
//       ┌─────────────────────────────────────────┐
//       │   [2-o'rin]   [1-o'rin 👑]   [3-o'rin]  │
//       │  Kumush       Oltin toj       Bronza     │
//       │  CSS kurs     JS kurs        React kurs  │
//       │  1,200 o'q    2,500 o'q       980 o'q    │
//       └─────────────────────────────────────────┘
//       — topCourses[0] = 1-o'rin (o'rtada, katta, scale-110)
//       — topCourses[1] = 2-o'rin (chapda, o'rta)
//       — topCourses[2] = 3-o'rin (o'ngda, o'rta)
//       — framer-motion: delay bilan pastdan yuqoriga animatsiya
//
//  4. TOP KURSLAR RO'YXATI (4-o'rindan pastga):
//       | # | Thumbnail | Kurs nomi        | Daraja  | O'q-lar | ⭐ | XP  |
//       | 4 | [img]     | JavaScript Kurs  | Beginner| 1,200   |4.8| 200 |
//       | 5 | [img]     | React Kurs       | Adv     | 980     |4.6| 300 |
//       — CourseRankCard komponenti har bir qator uchun
//       — loading bo'lsa SkeletonCard type="course" count={5}
//       — framer-motion stagger animatsiya (har qator 0.1s kechikish)
//
//  5. "YANA YUKLASH" TUGMASI:
//       — pagination.page < pagination.pages bo'lsa ko'rinadi
//       — loadMore() dispatch qiladi
//
//  O'NG PANEL (desktop'da lg:block):
//  ┌──────────────────────────────┐
//  │ ⭐ TOP KURS STATISTIKASI     │
//  │ Jami kurslar: 45             │
//  │ Jami o'quvchilar: 12,500     │
//  │ O'rtacha baho: 4.7           │
//  ├──────────────────────────────┤
//  │ 🏅 KATEGORIYA REYTINGI      │
//  │ 1. JavaScript  ████████ 2.5k │
//  │ 2. React       ██████   1.9k │
//  │ 3. HTML        █████    1.5k │
//  └──────────────────────────────┘
//
//  FIGMA: "Aidevix Top Courses Ranking" sahifasini qarang
//
//  API ENDPOINTLAR:
//    GET /api/ranking/courses?category=&page=&limit=
//    → topCourses massivi + pagination
//
//  KERAKLI PAKETLAR:
//    npm install framer-motion react-icons
// ============================================================

// 📦 IMPORTLAR
import { useState, useEffect }      from 'react'
import { motion, AnimatePresence }  from 'framer-motion'  // Animatsiyalar
import { FaCrown, FaMedal }         from 'react-icons/fa'
import { HiTrophy }                 from 'react-icons/hi2'
import { IoTrophy }                 from 'react-icons/io5'

// Redux hooks
import { useTopCourses }  from '@hooks/useRanking'   // getTopCourses() → state.ranking.topCourses
import { useCourses }     from '@hooks/useCourses'   // backup: eski hook

// Komponentlar
import CourseRankCard from '@components/ranking/CourseRankCard'  // NUMTON yozadi
import SkeletonCard   from '@components/loading/SkeletonCard'    // QUDRAT yozadi

// Kategoriya tabs ma'lumotlari
const CATEGORY_TABS = [
  { key: 'all',        label: 'BARCHASI',  icon: '🌐' },
  { key: 'html',       label: 'HTML',      icon: '🟠' },
  { key: 'css',        label: 'CSS',       icon: '🔵' },
  { key: 'javascript', label: 'JAVASCRIPT',icon: '🟡' },
  { key: 'react',      label: 'REACT',     icon: '⚛️' },
  { key: 'nodejs',     label: 'NODE.JS',   icon: '🟢' },
]

// Podium rang sxemasi
const PODIUM_CONFIG = {
  1: { color: 'border-yellow-500 shadow-yellow-500/30 bg-yellow-900/20', badge: 'badge-warning', icon: '👑' },
  2: { color: 'border-gray-400  shadow-gray-400/30   bg-gray-800/20',   badge: 'badge-ghost',   icon: '🥈' },
  3: { color: 'border-amber-600 shadow-amber-600/30  bg-amber-900/20',  badge: 'badge-outline',  icon: '🥉' },
}

// ─────────────────────────────────────────────────────────────────────────────
export default function TopCoursesPage() {
  // ── Lokal state ──────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState('all')
  // TODO: pageNum — "Yana yuklash" uchun
  const [pageNum, setPageNum] = useState(1)

  // ── Redux hook ────────────────────────────────────────────────────────────
  // useTopCourses() — rankingSlice.fetchTopCourses() dispatch qiladi
  // { courses, loading, pagination, loadMore } qaytaradi
  const { courses, loading, pagination, loadMore } = useTopCourses({
    category: activeCategory !== 'all' ? activeCategory : undefined,
    page: 1,
    limit: 20,
  })

  // ── Scroll top ────────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ── Kategoriya o'zgarganda reset ─────────────────────────────────────────
  useEffect(() => {
    setPageNum(1)
  }, [activeCategory])

  // ── Podium uchun top 3 ajratish ───────────────────────────────────────────
  const podiumCourses = courses.slice(0, 3)   // [0]=1-o'rin, [1]=2-o'rin, [2]=3-o'rin
  const tableCourses  = courses.slice(3)       // 4-o'rindan pastga jadval uchun

  // ── Ko'proq yuklash ───────────────────────────────────────────────────────
  const handleLoadMore = () => {
    const next = pageNum + 1
    setPageNum(next)
    loadMore(next)
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">

        {/* ─── Sarlavha ─────────────────────────────────────────────────── */}
        {/*
          TODO: Chiroyli header dizayn qiling
          — Katta trophy ikonasi (sariq/oltin rang)
          — "Top Kurslar Reytingi" sarlavha
          — Subtitle matni
          — framer-motion fade-in animatsiya
        */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <HiTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl font-black mb-2">Top Kurslar Reytingi</h1>
          <p className="text-base-content/60">
            Eng ko'p o'qilgan va yuqori baholangan professional kurslar
          </p>
        </motion.div>

        {/* ─── Chap panel + O'ng panel ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── CHAP PANEL (asosiy kontent) ────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── Kategoriya tabs ─────────────────────────────────────── */}
            {/*
              TODO: Chiroyli tab dizayn:
              — Har bir tab: ikonka + label
              — Aktiv tab: btn-primary, qolganlar btn-ghost
              — Responsive: mobile'da scroll, desktop'da wrap
              — Tab o'zgarganda: useTopCourses hook re-fetch qiladi
            */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_TABS.map((tab) => (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`btn btn-sm gap-1 ${activeCategory === tab.key ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* ── Podium — Top 3 kurs ─────────────────────────────────── */}
            {/*
              TODO: Podium dizaynini to'liq qiling:
              TARTIB: [2-o'rin (chapda)] [1-o'rin (o'rtada, katta)] [3-o'rin (o'ngda)]
              1-o'rin: scale-110, oltin rang border, 👑 toj
              2-o'rin: kumush rang border, 🥈
              3-o'rin: bronza rang border, 🥉

              Har bir karta:
              — Thumbnail rasm yoki emoji
              — Kurs nomi (truncate)
              — Kategoriya badge
              — O'quvchilar soni
              — O'rtacha baho ⭐
              — XP mukofoti
              — O'rin badge (#1, #2, #3)

              framer-motion: delay(rank * 0.15)s bilan pastdan yuqoriga
            */}
            {!loading && podiumCourses.length >= 3 && (
              <div className="flex items-end justify-center gap-4 py-6">
                {/* 2-o'rin (chapda) */}
                <PodiumCard course={podiumCourses[1]} rank={2} />
                {/* 1-o'rin (o'rtada, katta) */}
                <PodiumCard course={podiumCourses[0]} rank={1} />
                {/* 3-o'rin (o'ngda) */}
                <PodiumCard course={podiumCourses[2]} rank={3} />
              </div>
            )}

            {/* ── Top kurslar ro'yxati (4-dan pastga) ─────────────────── */}
            {/*
              TODO: Jadval/ro'yxat dizayn:
              — loading bo'lsa SkeletonCard type="course" count={5}
              — tableCourses bo'lsa CourseRankCard list
              — "Kurslar topilmadi" bo'sh holat
              — framer-motion stagger: har bir karta 0.05s kechikish bilan

              CourseRankCard props:
              { rank, course, isTop3 } — rank=4,5,6... boshlanadi
            */}
            {loading ? (
              <SkeletonCard type="course" count={5} />
            ) : (
              <div className="space-y-3">
                {tableCourses.length === 0 ? (
                  // TODO: Chiroyli "topilmadi" holat dizayn qiling
                  <div className="text-center py-10 text-base-content/40">
                    <p className="text-4xl mb-2">🔍</p>
                    <p>Bu kategoriyada kurslar topilmadi</p>
                  </div>
                ) : (
                  tableCourses.map((course, index) => (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CourseRankCard
                        rank={index + 4}
                        course={course}
                        isTop3={false}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* ── "Yana yuklash" tugmasi ──────────────────────────────── */}
            {/*
              TODO: pagination.page < pagination.pages bo'lsa ko'rsatiladi
              — loading bo'lsa "Yuklanmoqda..." spinner
              — bosiganda handleLoadMore() chaqiriladi
            */}
            {pagination && pageNum < pagination.pages && (
              <div className="text-center py-4">
                <button
                  onClick={handleLoadMore}
                  className="btn btn-outline btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    '+ YANA YUKLASH'
                  )}
                </button>
              </div>
            )}

          </div>{/* ── CHAP PANEL END ── */}

          {/* ─── O'NG PANEL ──────────────────────────────────────────────── */}
          {/*
            TODO: O'ng panel — faqat desktop (lg:block):
            1. Statistika karti:
               — Jami kurslar soni
               — Jami o'quvchilar soni
               — O'rtacha baho
            2. Kategoriya reytingi progress bar:
               — JavaScript ████████ 2,500
               — React      ██████   1,900
               — HTML       █████    1,500
               — ...
          */}
          <div className="hidden lg:block space-y-4">
            {/* Statistika */}
            <div className="card bg-base-200 p-4">
              <h3 className="font-bold text-sm mb-3">📊 STATISTIKA</h3>
              {/*
                TODO: Real statistika qo'shing:
                — courses.length (jami kurslar)
                — Jami o'quvchilar (reduce(sum, studentsCount))
                — O'rtacha baho (reduce(sum, rating) / courses.length)
              */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Jami kurslar</span>
                  <span className="font-bold">{courses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">O'quvchilar</span>
                  <span className="font-bold text-success">
                    {courses.reduce((s, c) => s + (c.studentsCount || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Kategoriya reytingi */}
            <div className="card bg-base-200 p-4">
              <h3 className="font-bold text-sm mb-3">🏅 KATEGORIYALAR</h3>
              {/*
                TODO: Har bir kategoriya uchun progress bar:
                — kategoriya nomi + emoji
                — o'quvchilar soni
                — progress bar (max = eng ko'p o'quvchi)
                — animatsiyali width
              */}
              {CATEGORY_TABS.filter((t) => t.key !== 'all').map((tab) => {
                const count = courses
                  .filter((c) => c.category === tab.key)
                  .reduce((s, c) => s + (c.studentsCount || 0), 0)
                return (
                  <div key={tab.key} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{tab.icon} {tab.label}</span>
                      <span className="text-base-content/60">{count.toLocaleString()}</span>
                    </div>
                    {/* TODO: progress bar animatsiya */}
                    <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: count > 0 ? `${Math.min((count / 2500) * 100, 100)}%` : '0%' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Ichki komponent: Podium kartasi ─────────────────────────────────────────
// TODO: NUMTON bu komponentni to'liq dizayn qiladi
// rank=1: oltin toj, scale-110; rank=2: kumush; rank=3: bronza
function PodiumCard({ course, rank }) {
  if (!course) return null

  const config = PODIUM_CONFIG[rank] || PODIUM_CONFIG[3]

  return (
    /*
      TODO: Podium kartasi to'liq dizayn:
      — Thumbnail rasm (aspect-video) yoki kategoriya emoji
      — 1-o'rin uchun 👑 toj animatsiya (bounce)
      — Kurs nomi (truncate, 2 qator max)
      — Kategoriya badge (HTML/CSS/JS...)
      — O'quvchilar soni
      — ⭐ o'rtacha baho
      — XP mukofoti (+200 XP)
      — O'rin badge (#1, #2, #3)

      Figma "GLOBAL AUTHORITY" podium qismini qarang
    */
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15, type: 'spring', damping: 15 }}
      className={`card border ${config.color} p-4 text-center w-36 shadow-lg ${rank === 1 ? 'scale-110' : ''}`}
    >
      {/* Toj / Medal */}
      <div className="text-2xl mb-1">{config.icon}</div>

      {/* TODO: Thumbnail rasm yoki kategoriya emoji */}
      <div className="w-14 h-14 rounded-xl bg-primary/20 mx-auto mb-2 flex items-center justify-center text-2xl">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <span>📚</span>
        )}
      </div>

      {/* Kurs nomi */}
      <p className="font-bold text-xs truncate w-full">{course.title}</p>

      {/* O'quvchilar */}
      <p className="text-xs text-base-content/60 mt-0.5">
        {(course.studentsCount || 0).toLocaleString()} o'q.
      </p>

      {/* XP */}
      <p className="text-primary font-bold text-xs mt-1">
        +{course.xpReward || 200} XP
      </p>

      {/* O'rin badge */}
      <div className="mt-2">
        <span className={`badge badge-xs ${config.badge}`}>#{rank}</span>
      </div>
    </motion.div>
  )
}
