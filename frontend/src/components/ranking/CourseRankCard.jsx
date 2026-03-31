// ============================================================
// OQUVCHI  : NUMTON
// BRANCH   : feature/numton-ranking
// FAYL     : src/components/ranking/CourseRankCard.jsx
// ============================================================
//
// VAZIFA: Top kurslar jadvalidagi bitta kurs qatorini yaratish
//
// KARTA TARKIBI (gorizontal, flex items-center gap-4):
//
//  1. O'RIN RAQAMI:
//     - isTop3 = true → 🥇 🥈 🥉 emoji
//     - isTop3 = false → "#{rank}" (katta, text-base-content/30)
//
//  2. THUMBNAIL (40x40, rounded-lg):
//     - Rasm yoki kategoriya emoji
//
//  3. KURS MA'LUMOTI (flex-1):
//     - Sarlavha (font-semibold)
//     - Kategoriya badge (badge-outline badge-sm)
//
//  4. STATISTIKA (o'ngda):
//     - "★ {rating}" (text-warning)
//     - "{viewCount.toLocaleString()} ko'rishlar" (text-xs)
//
//  5. "Ko'rish" TUGMASI:
//     - Link to={`/courses/${course._id}`}
//     - btn btn-primary btn-sm
//
// isTop3 holat:
//   - Katta karta: yuqorida thumbnail, pastda ma'lumot
//   - Alohida rang border (oltin / kumush / bronza)
//
// PROPS:
//   - rank: number
//   - course: { _id, title, thumbnail, category, rating, viewCount }
//   - isTop3: boolean
//
// KERAKLI IMPORTLAR:
//   import { Link } from 'react-router-dom'
//   import { HiTrophy } from 'react-icons/hi2'
// ============================================================

const CourseRankCard = ({ rank, course, isTop3 = false }) => {
  // TODO: NUMTON bu komponentni to'liq yozadi
  return null
}

export default CourseRankCard
