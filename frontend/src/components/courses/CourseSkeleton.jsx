// ============================================================
// OQUVCHI  : DONIYOR
// BRANCH   : feature/doniyor-courses
// FAYL     : src/components/courses/CourseSkeleton.jsx
// ============================================================
//
// VAZIFA: Kurs kartasi skeleton (yuklash holati) komponentini yaratish
//
// SKELETON TARKIBI:
//
//  - glass-card overflow-hidden animate-pulse
//  - Yuqorida: h-44 bg-base-300 rounded-none (thumbnail o'rniga)
//  - Tanada (p-4):
//    - h-4 bg-base-300 w-3/4 rounded   (sarlavha)
//    - h-3 bg-base-300 w-full rounded  (tavsif 1-qator)
//    - h-3 bg-base-300 w-2/3 rounded   (tavsif 2-qator)
//    - h-4 bg-base-300 w-24 rounded    (rating)
//    - h-5 bg-base-300 w-12 rounded    (narx)
//
//  DaisyUI skeleton-base yoki bg-base-300 ishlatiladi
//
// ISHLATISH:
//   <CourseSkeleton />              — bitta skeleton
//   loading && Array.from({length:8}).map((_,i) => <CourseSkeleton key={i} />)
// ============================================================

export default function CourseSkeleton() {
  // TODO: DONIYOR bu komponentni to'liq yozadi
  return null
}
