// ╔══════════════════════════════════════════════════════════════╗
// ║  CourseRankCard.jsx                                          ║
// ║  OQUVCHI: NUMTON                                             ║
// ║  Branch:  feature/numton-ranking                             ║
// ║  Vazifa:  Reyting jadvalida bitta kurs kartasi               ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Props:
 * - rank: number (1, 2, 3, ...)
 * - course: { title, thumbnail, category, rating, viewCount, instructor, price }
 * - isTop3: boolean (1-3 o'rin uchun maxsus stil)
 *
 * Figma: jadval qatori (raqam, kurs nomi, kategoriya, reyting, o'quvchilar, ko'rish tugmasi)
 */

const CourseRankCard = ({ rank, course, isTop3 = false }) => {
  // TODO: NUMTON shu yerga kurs rank kartasi yozadi
  return (
    <div>
      <span>#{rank}</span>
      <span>{course?.title}</span>
    </div>
  )
}

export default CourseRankCard
