// ============================================================
// OQUVCHI  : DONIYOR
// BRANCH   : feature/doniyor-courses
// FAYL     : src/components/courses/CourseFilter.jsx
// ============================================================
//
// VAZIFA: Kurslar filtri komponentini yaratish (kategoriya tabs + saralash)
//
// FILTER TARKIBI:
//
//  1. KATEGORIYA TABS:
//     - Barcha kategoriyalarni CATEGORIES dan map qilib ko'rsat
//     - Har bir kategoriya: { id, label, icon } (constants.js dan)
//     - Bosqichlar: Barchasi | HTML 🟠 | CSS 🔵 | JavaScript 🟡 | React ⚛️ | Node.js 🟢 | ...
//     - Aktiv tab: bg-primary-500/25 border-primary-500/60 text-primary-300
//     - Bosqandan: dispatch(setFilter({ category: cat.id }))
//
//  2. SARALASH DROPDOWN:
//     - "Saralash:" text + select element
//     - Opsiyalar SORT_OPTIONS dan (constants.js):
//       - latest: "Yangi"
//       - popular: "Mashhur"
//       - rating: "Reyting bo'yicha"
//     - O'zgarishda: dispatch(setFilter({ sort: e.target.value }))
//
//  KIRISH ANIMATSIYASI (ixtiyoriy):
//   - gsap.fromTo(tabsRef.current.children, { opacity:0, x:-20 }, { opacity:1, x:0, stagger:0.05 })
//
// STATE:
//   - useSelector(selectFilters) → { category, sort }
//   - useDispatch() + setFilter()
//
// KERAKLI IMPORTLAR:
//   import { useDispatch, useSelector } from 'react-redux'
//   import { useRef, useEffect } from 'react'
//   import { gsap } from 'gsap'
//   import { setFilter, selectFilters } from '@store/slices/courseSlice'
//   import { CATEGORIES, SORT_OPTIONS } from '@utils/constants'
// ============================================================

export default function CourseFilter() {
  // TODO: DONIYOR bu komponentni to'liq yozadi
  return null
}
