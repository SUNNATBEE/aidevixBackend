// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/components/loading/SkeletonCard.jsx
// ============================================================
//
// VAZIFA: Kontent yuklanayotganda ko'rsatiladigan skeleton kartalar
//
// PROPS:
//   - type: 'course' | 'user' | 'video' | 'profile'
//   - count: nechta skeleton (default: 1)
//
// TYPE BO'YICHA SKELETON TUZILISHI:
//
//  type="course":
//   - h-44 rasm joy + karta tanasi (sarlavha, tavsif, narx) — animate-pulse
//
//  type="user":
//   - Dumaloq avatar + ism + level + XP progress bar
//
//  type="video":
//   - Gorizontal: thumbnail + sarlavha + davomiylik
//
//  type="profile":
//   - Katta avatar markazi + 4 ta statistika katak
//
// ISHLATISH:
//   import SkeletonCard from '@components/loading/SkeletonCard'
//   <SkeletonCard type="course" count={6} />
//   <SkeletonCard type="user" count={3} />
//
// KERAKLI IMPORTLAR: (faqat Tailwind/DaisyUI klass kerak)
// ============================================================

const SkeletonCard = ({ type = 'course', count = 1 }) => {
  // TODO: QUDRAT type ga mos skeleton dizayn yozadi
  return null
}

export default SkeletonCard
