// ============================================================
// OQUVCHI  : DONIYOR
// BRANCH   : feature/doniyor-courses
// ROUTE    : /courses
// ============================================================
//
// VAZIFA: Barcha kurslar sahifasini yaratish
//
// Bu sahifada bo'lishi kerak:
//
//  1. SARLAVHA QISMI:
//     - "Barcha Kurslar" — h1 katta
//     - "Professional dasturlash kurslarini kashf eting" — subtitle
//     - framer-motion fade-in animatsiya
//
//  2. QIDIRUV INPUT:
//     - [ 🔍 Kurs qidirish... ] — keng input
//     - onChange → doFilter({ search: value })
//     - debounce 500ms (har harfda API chaqirmaslik uchun)
//     - "× Tozalash" tugmasi (qidiruv bo'lsa ko'rinadi)
//     - "N ta kurs topildi" matn
//
//  3. KATEGORIYA TABS (gorizontal scroll — mobile'da):
//     - [ 🌐 Barchasi ] [ 🟠 HTML ] [ 🔵 CSS ] [ 🟡 JS ] [ ⚛️ React ] [ 🟢 Node.js ]
//     - Aktiv tab: btn-primary, qolganlar: btn-ghost
//     - URL sync: /courses?category=html
//
//  4. FILTR PANELI:
//     - SARALASH: [ Yangi ] [ Eski ] [ Ommabop ] [ Baho ]
//     - DARAJA:   [ Boshlang'ich ] [ O'rta ] [ Yuqori ]
//     - Mobile'da toggle (showFilters state)
//
//  5. KURSLAR GRID:
//     - loading bo'lsa: SkeletonCard type="course" count={6}
//     - courses.length === 0: "Kurslar topilmadi" bo'sh holat (emoji + matn + filter tozalash)
//     - Bo'lmasa: CourseGrid komponenti
//     - framer-motion AnimatePresence + layout
//
//  6. PAGINATION:
//     - "Yana yuklash" tugmasi
//     - pagination.page < pagination.pages bo'lsa ko'rinadi
//
// HOOKS:
//   useCourses()        → { courses, loading, filters, fetchAll, setFilter }
//   useSearchParams()   → URL ?category= sync uchun
//
// API:
//   GET /api/courses?category=&search=&sort=&level=&page=&limit=
//   Response: { success, data, pagination: { page, pages, total } }
//
// KERAKLI IMPORTLAR:
//   import { useSearchParams } from 'react-router-dom'
//   import { useCourses } from '@hooks/useCourses'
//   import CourseGrid from '@components/courses/CourseGrid'
//   import SkeletonCard from '@components/loading/SkeletonCard'
//   import { motion, AnimatePresence } from 'framer-motion'
//
// FIGMA: "Aidevix Courses Page" sahifasini qarang
// ============================================================

export default function CoursesPage() {
  // TODO: DONIYOR bu sahifani to'liq yozadi
  return null
}
