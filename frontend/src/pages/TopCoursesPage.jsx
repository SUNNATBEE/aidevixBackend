// ============================================================
// OQUVCHI  : NUMTON
// BRANCH   : feature/numton-ranking
// ROUTE    : /top-courses
// ============================================================
//
// VAZIFA: Top kurslar reytingi sahifasini yaratish
//
// LAYOUT: Chap panel (2/3) + O'ng panel (1/3 — desktop'da)
//
// CHAP PANEL:
//
//  1. SARLAVHA:
//     - 🏆 ikonasi (katta, sariq)
//     - "Top Kurslar Reytingi" — h1
//     - "Eng ko'p o'qilgan va yuqori baholangan kurslar" — subtitle
//     - framer-motion fade-in
//
//  2. KATEGORIYA FILTER TABS:
//     - [ 🌐 BARCHASI ] [ 🟠 HTML ] [ 🔵 CSS ] [ 🟡 JAVASCRIPT ] [ ⚛️ REACT ] [ 🟢 NODE.JS ]
//     - activeCategory state bilan boshqariladi
//     - Tab bosiganda: useTopCourses({ category }) re-fetch
//
//  3. PODIUM — Top 3 kurs (alohida katta kartalar):
//     - TARTIB: [2-o'rin (chapda, kumush)] [1-o'rin (o'rtada, katta, 👑)] [3-o'rin (o'ngda, bronza)]
//     - 1-o'rin: scale-110, oltin rang border, 👑 toj
//     - 2-o'rin: kumush rang border, 🥈
//     - 3-o'rin: bronza rang border, 🥉
//     - Har karta: thumbnail/emoji, kurs nomi, o'quvchilar soni, reyting, XP, o'rin badge
//     - framer-motion: delay(rank * 0.15)s bilan pastdan yuqoriga
//
//  4. TOP KURSLAR RO'YXATI (4-o'rindan pastga):
//     - CourseRankCard komponenti har bir qator uchun
//     - loading bo'lsa SkeletonCard type="course" count={5}
//     - "Kurslar topilmadi" bo'sh holat
//     - framer-motion stagger: 0.05s kechikish
//
//  5. "YANA YUKLASH" TUGMASI:
//     - pagination.page < pagination.pages bo'lsa ko'rinadi
//     - loading bo'lsa spinner
//
// O'NG PANEL (desktop'da faqat ko'rinadi):
//   ┌──────────────────────────────┐
//   │ 📊 STATISTIKA               │
//   │ Jami kurslar: N             │
//   │ Jami o'quvchilar: N         │
//   │ O'rtacha baho: 4.7          │
//   ├──────────────────────────────┤
//   │ 🏅 KATEGORIYA REYTINGI     │
//   │ JavaScript ████████ 2,500   │
//   │ React      ██████   1,900   │
//   └──────────────────────────────┘
//
// HOOKS:
//   useTopCourses({ category, page, limit })
//   → { courses, loading, pagination, loadMore }
//
// API:
//   GET /api/ranking/courses?category=&page=&limit=
//
// KERAKLI IMPORTLAR:
//   import { useTopCourses } from '@hooks/useRanking'
//   import CourseRankCard from '@components/ranking/CourseRankCard'
//   import SkeletonCard from '@components/loading/SkeletonCard'
//   import { motion } from 'framer-motion'
//   import { HiTrophy } from 'react-icons/hi2'
//
// FIGMA: "Aidevix Top Courses Ranking" sahifasini qarang
// ============================================================

export default function TopCoursesPage() {
  // TODO: NUMTON bu sahifani to'liq yozadi
  return null
}
