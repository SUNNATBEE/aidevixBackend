// ============================================================
//  CoursesPage.jsx
//  KIM YOZADI : DONIYOR
//  BRANCH     : feature/doniyor-courses
//  ROUTE      : /courses
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//
//  1. SARLAVHA QISMI:
//       "Barcha Kurslar" — h1 katta
//       "Professional dasturlash kurslarini kashf eting" — subtitle
//       Animatsiya: framer-motion fade-in (yuqoridan pastga)
//
//  2. QIDIRUV INPUT:
//       [ 🔍 Kurs qidirish... ] — keng input
//       — onChange → doFilter({ search: value })
//       — debounce 500ms: har harfda API chaqirmaslik
//         Misol: useEffect + setTimeout(() => fetchAll({...}), 500)
//       — Qidiruv natijasi: "5 ta kurs topildi"
//
//  3. KATEGORIYA TABS (horizontal scroll mobile):
//       [ 🌐 Barchasi ] [ 🟠 HTML ] [ 🔵 CSS ] [ 💨 Tailwind ]
//       [ 🟡 JS ] [ ⚛️ React ] [ 🔴 Redux ] [ 🟢 Node.js ]
//       — Aktiv tab: btn-primary, qolganlar: btn-ghost
//       — URL sync: /courses?category=html
//
//  4. FILTR PANELI (accordion/collapse yoki inline):
//       SARALASH:  [ Yangi ] [ Eski ] [ Ommabop ] [ Baho ]
//       DARAJA:    [ Beginner ] [ Intermediate ] [ Advanced ]
//       NARX:      [ Barchasi ] [ Bepul ] [ Pullik ]
//       — Faol filtrlar: chip bilan ko'rinadi + "×" o'chirish
//
//  5. NATIJA SARLAVHASI:
//       "45 ta kurs topildi" (courses.total yoki courses.length)
//
//  6. KURSLAR GRID:
//       — loading bo'lsa: SkeletonCard type="course" count={6}
//       — bo'lmasa: courses massivini CourseCard komponentida ko'rsating
//       — Responsive grid: 1→2→3 ustun
//       — "Kurslar topilmadi" bo'sh holat (emoji + matn + filter tozalash)
//       — framer-motion AnimatePresence + layout animation
//
//  7. PAGINATION:
//       — "Yana yuklash" tugmasi
//       — YOKI sahifa raqamlari (1 2 3 ... N)
//       — pagination.page < pagination.pages bo'lsa ko'rinadi
//
//  HOOKS:
//    useCourses() → { courses, loading, filters, fetchAll, setFilter }
//    useSearchParams() → URL ?category= sync
//
//  API:
//    GET /api/courses?category=&search=&sort=&level=&isFree=&page=&limit=
//    Response: { success, data, pagination: { page, pages, total } }
//
//  KERAKLI PAKETLAR:
//    framer-motion, react-icons
// ============================================================

// 📦 IMPORTLAR
import { useState, useEffect, useCallback }  from 'react'
import { useSearchParams }                    from 'react-router-dom'
import { useDispatch }                        from 'react-redux'
import { motion, AnimatePresence }            from 'framer-motion'
import { IoSearch, IoFilter, IoClose }        from 'react-icons/io5'

// Redux
import { useCourses }   from '@hooks/useCourses'
import { setFilter }    from '@store/slices/courseSlice'

// Komponentlar
import CourseGrid       from '@components/courses/CourseGrid'    // Mavjud
import CourseFilter     from '@components/courses/CourseFilter'  // Mavjud
import Input            from '@components/common/Input'          // Mavjud
import SkeletonCard     from '@components/loading/SkeletonCard'  // QUDRAT yozadi

// Kategoriya tabs ma'lumotlari
const CATEGORY_TABS = [
  { key: 'all',        label: 'Barchasi',   icon: '🌐' },
  { key: 'html',       label: 'HTML',       icon: '🟠' },
  { key: 'css',        label: 'CSS',        icon: '🔵' },
  { key: 'tailwind',   label: 'Tailwind',   icon: '💨' },
  { key: 'javascript', label: 'JavaScript', icon: '🟡' },
  { key: 'react',      label: 'React',      icon: '⚛️' },
  { key: 'redux',      label: 'Redux',      icon: '🔴' },
  { key: 'nodejs',     label: 'Node.js',    icon: '🟢' },
]

// Saralash variantlari
const SORT_OPTIONS = [
  { value: 'newest',  label: 'Yangi'    },
  { value: 'oldest',  label: 'Eski'     },
  { value: 'popular', label: 'Ommabop'  },
  { value: 'rating',  label: 'Baho'     },
]

// Daraja filtrlari
const LEVEL_OPTIONS = [
  { value: 'all',          label: 'Barchasi'     },
  { value: 'beginner',     label: 'Boshlang\'ich' },
  { value: 'intermediate', label: 'O\'rta'        },
  { value: 'advanced',     label: 'Yuqori'        },
]

// ─────────────────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const dispatch        = useDispatch()
  const [params, setParams] = useSearchParams()

  // ── Lokal state ──────────────────────────────────────────────────────────
  const [searchValue,   setSearchValue]   = useState('')
  const [activeLevel,   setActiveLevel]   = useState('all')
  const [activeSort,    setActiveSort]    = useState('newest')
  const [showFilters,   setShowFilters]   = useState(false) // mobile filter panel

  // ── Redux hook ────────────────────────────────────────────────────────────
  // useCourses() — courseSlice bilan ishlaydi
  const {
    courses, loading, filters,
    fetchAll,
    setFilter: doFilter,
  } = useCourses()

  // ── URL dan kategoriya o'qish ─────────────────────────────────────────────
  // Misol: /courses?category=react → activeCategory = 'react'
  useEffect(() => {
    const cat = params.get('category')
    if (cat) dispatch(setFilter({ category: cat }))
  }, [])

  // ── Filtr o'zgarganda fetch ────────────────────────────────────────────────
  useEffect(() => {
    fetchAll({
      category: filters.category !== 'all' ? filters.category : undefined,
      search:   filters.search   || undefined,
      sort:     activeSort,
      level:    activeLevel !== 'all' ? activeLevel : undefined,
      page:     1,
      limit:    12,
    })
  }, [filters.category, filters.search, activeSort, activeLevel])

  // ── Debounce qidiruv ──────────────────────────────────────────────────────
  /*
    TODO: debounce implementatsiyasi:
    useEffect(() => {
      const timer = setTimeout(() => {
        doFilter({ search: searchValue })
      }, 500)
      return () => clearTimeout(timer)
    }, [searchValue])
  */
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
    // Hozircha direct (TODO: debounce qo'shing)
    doFilter({ search: e.target.value })
  }

  // ── Kategoriya tab bosish ─────────────────────────────────────────────────
  const handleCategoryChange = (categoryKey) => {
    doFilter({ category: categoryKey })
    // URL ni yangilash: /courses?category=react
    if (categoryKey !== 'all') {
      setParams({ category: categoryKey })
    } else {
      setParams({})
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 pt-24">

        {/* ─── Sarlavha ─────────────────────────────────────────────────── */}
        {/*
          TODO: Chiroyli animatsiyali sarlavha qism:
          — h1 "Barcha Kurslar" katta bold
          — subtitle matni
          — framer-motion fade-in (yuqoridan pastga, delay: 0.1s)
        */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black mb-2">Barcha Kurslar</h1>
          <p className="text-base-content/60">
            Professional dasturlash kurslarini kashf eting
          </p>
        </motion.div>

        {/* ─── Qidiruv + Filtr tugmasi ──────────────────────────────────── */}
        {/*
          TODO: Qidiruv qatori dizayn:
          — Keng input (max-w-xl)
          — 🔍 ikonasi chapda (yoki inline)
          — "× Tozalash" tugmasi (qidiruv bo'lsa ko'rinadi)
          — [ ⚙ Filtrlar ] tugmasi — mobile'da filtr panelini ochadi
          — "N ta kurs topildi" matn (o'ng tomonda)
        */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Qidiruv */}
          <div className="relative flex-1 max-w-md">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Kurs qidirish..."
              value={searchValue}
              onChange={handleSearchChange}
              className="input input-bordered w-full pl-9 pr-9"
            />
            {/* TODO: "× Tozalash" tugmasi */}
            {searchValue && (
              <button
                onClick={() => { setSearchValue(''); doFilter({ search: '' }) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
              >
                <IoClose />
              </button>
            )}
          </div>

          {/* Filtr tugmasi (mobile) */}
          {/*
            TODO: Mobile'da filtr panelini ochish/yopish
            — showFilters state toggle
            — sm:hidden (faqat mobile'da ko'rinadi)
          */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="btn btn-outline btn-sm gap-2 sm:hidden"
          >
            <IoFilter /> Filtrlar
          </button>
        </div>

        {/* ─── Kategoriya tabs ──────────────────────────────────────────── */}
        {/*
          TODO: Horizontal scroll tabs:
          — Mobile'da overflow-x-auto (swipe bilan scroll)
          — Desktop'da flex-wrap
          — Har bir tab: ikonka + label
          — Aktiv: btn-primary, qolganlar: btn-ghost
          — Animatsiya: framer-motion layout animation
        */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORY_TABS.map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(tab.key)}
              className={`btn btn-sm whitespace-nowrap gap-1 flex-shrink-0 ${
                filters.category === tab.key || (tab.key === 'all' && !filters.category)
                  ? 'btn-primary'
                  : 'btn-ghost'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* ─── Filtr paneli ─────────────────────────────────────────────── */}
        {/*
          TODO: Filtr paneli (desktop'da doim ko'rinadi, mobile'da toggle):
          — Saralash: [ Yangi ] [ Eski ] [ Ommabop ] [ Baho ]
          — Daraja: [ Boshlang'ich ] [ O'rta ] [ Yuqori ]
          — Narx: [ Barchasi ] [ Bepul ] [ Pullik ]
          — Faol filtrlar: "chip" bilan ko'rinadi + "×" o'chirish
        */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card bg-base-200 p-4 mb-6 overflow-hidden"
            >
              {/* Saralash */}
              <div className="mb-3">
                <p className="text-xs text-base-content/60 mb-2 font-semibold">SARALASH</p>
                <div className="flex gap-2 flex-wrap">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setActiveSort(opt.value)}
                      className={`btn btn-xs ${activeSort === opt.value ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daraja */}
              <div>
                <p className="text-xs text-base-content/60 mb-2 font-semibold">DARAJA</p>
                <div className="flex gap-2 flex-wrap">
                  {LEVEL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setActiveLevel(opt.value)}
                      className={`btn btn-xs ${activeLevel === opt.value ? 'btn-secondary' : 'btn-ghost'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop filtrlar (doim ko'rinadi) */}
        <div className="hidden sm:flex gap-6 mb-6 items-center">
          {/* Saralash */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-base-content/60 font-semibold">SARALASH:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveSort(opt.value)}
                className={`btn btn-xs ${activeSort === opt.value ? 'btn-primary' : 'btn-ghost'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Daraja */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-base-content/60 font-semibold">DARAJA:</span>
            {LEVEL_OPTIONS.slice(1).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveLevel(opt.value === activeLevel ? 'all' : opt.value)}
                className={`btn btn-xs ${activeLevel === opt.value ? 'btn-secondary' : 'btn-ghost'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Natija matn ──────────────────────────────────────────────── */}
        {/*
          TODO: "N ta kurs topildi" — courses.length yoki pagination.total
          — loading bo'lsa spinner yoki skeleton
        */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-base-content/60 mb-4"
          >
            {courses.length} ta kurs topildi
          </motion.p>
        )}

        {/* ─── Kurslar grid ─────────────────────────────────────────────── */}
        {/*
          TODO: AnimatePresence + layout animation:
          — loading bo'lsa SkeletonCard type="course" count={6}
          — bo'lmasa CourseGrid komponenti
          — "Kurslar topilmadi" bo'sh holat:
            <div className="text-center py-20">
              <p className="text-6xl mb-4">😕</p>
              <p className="text-xl font-bold mb-2">Kurslar topilmadi</p>
              <p className="text-base-content/60 mb-4">Filtrlarni tozalang</p>
              <button onClick={() => doFilter({ category: 'all', search: '' })}>
                Filtrlarni tozalash
              </button>
            </div>
        */}
        {loading ? (
          <SkeletonCard type="course" count={6} />
        ) : courses.length === 0 ? (
          // Bo'sh holat
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-7xl mb-4"
            >
              😕
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Kurslar topilmadi</h3>
            <p className="text-base-content/60 mb-6">
              Filtr shartlariga mos kurslar mavjud emas. Filtrlarni tozalang.
            </p>
            <button
              onClick={() => {
                setSearchValue('')
                setActiveLevel('all')
                doFilter({ category: 'all', search: '' })
              }}
              className="btn btn-primary btn-sm"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <CourseGrid courses={courses} loading={false} />
        )}

        {/* ─── "Yana yuklash" tugmasi ───────────────────────────────────── */}
        {/*
          TODO: pagination state'dan page < pages bo'lsa ko'rsatiladi
          — loadMore() qo'shimcha kurslarni yuklaydi
          — Yuklanayotganda spinner ko'rsatiladi

          Hozircha CourseGrid ichida pagination mavjud bo'lishi mumkin.
          Agar bo'lmasa, quyidagicha qo'shing:

          {pagination && pagination.page < pagination.pages && (
            <div className="text-center mt-8">
              <button
                onClick={() => fetchAll({ page: pagination.page + 1 })}
                className="btn btn-outline btn-primary"
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner" /> : '+ YANA YUKLASH'}
              </button>
            </div>
          )}
        */}

      </div>
    </div>
  )
}
