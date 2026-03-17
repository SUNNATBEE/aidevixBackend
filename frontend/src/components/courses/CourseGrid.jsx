// ============================================================
// OQUVCHI  : DONIYOR
// BRANCH   : feature/doniyor-courses
// FAYL     : src/components/courses/CourseGrid.jsx
// ============================================================
//
// VAZIFA: Kurslar grid (to'r) komponentini yaratish
//
// HOLATI:
//
//  1. LOADING:
//     - Grid ko'rsatiladi, har bir yacheykada CourseSkeleton
//     - Array.from({ length: 8 }).map → <CourseSkeleton key={i} />
//
//  2. BO'SH (courses.length === 0):
//     - 🔍 emoji (katta)
//     - {emptyText} matni — text-zinc-400
//
//  3. MA'LUMOT BOR:
//     - Responsive grid:
//       grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5
//     - {courses.map((course, i) => <CourseCard course={course} index={i} />)}
//
// PROPS:
//   - courses: array (kurslar ro'yxati)
//   - loading: boolean
//   - emptyText: string (default: 'Kurs topilmadi')
//
// KERAKLI IMPORTLAR:
//   import CourseCard from './CourseCard'
//   import CourseSkeleton from './CourseSkeleton'
// ============================================================

export default function CourseGrid({ courses = [], loading = false, emptyText = 'Kurs topilmadi' }) {
  // TODO: DONIYOR bu komponentni to'liq yozadi
  return null
}
