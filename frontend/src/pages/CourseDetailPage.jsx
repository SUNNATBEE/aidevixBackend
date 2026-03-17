// ============================================================
// OQUVCHI  : DONIYOR
// BRANCH   : feature/doniyor-courses
// ROUTE    : /courses/:id
// ============================================================
//
// VAZIFA: Kurs tafsilotlari sahifasini yaratish
//
// LAYOUT: Chap panel (2/3) + O'ng sticky panel (1/3)
//
// CHAP PANEL:
//
//  1. BREADCRUMB NAVIGATSIYA:
//     - Bosh sahifa > Kurslar > [Kurs nomi]
//     - Link komponentlari bilan
//
//  2. KURS HEADER:
//     - Kategoriya badge + Daraja badge
//     - Sarlavha (h1, text-3xl)
//     - Qisqa tavsif
//     - ⭐ Yulduz reytingi (StarRating komponenti)
//     - Meta: "12 dars | 24 soat | 1,200 o'quvchi"
//
//  3. "NIMA O'RGANASIZ?" ACCORDION (DaisyUI collapse):
//     - course.requirements massividan
//     - Har bir element: ✅ + matn
//
//  4. DARSLAR RO'YXATI:
//     - "📹 Darslar ro'yxati" sarlavha + "N ta dars | Umumiy vaqt"
//     - Har bir dars: [raqam] [nomi] [davomiylik] [▶/🔒]
//     - Birinchi 2 ta: bepul demo (▶)
//     - Qolganlar: obuna kerak (🔒)
//     - VideoCard komponenti
//     - SkeletonCard yuklanayotganda
//
//  5. LOYIHALAR BO'LIMI (GET /api/projects/course/:id):
//     - "💻 Amaliy Loyihalar" sarlavha
//     - Har loyiha kartasi: nom, daraja badge, XP badge, texnologiyalar chips
//
// O'NG PANEL (sticky top-24):
//   - Thumbnail rasm yoki kategoriya emoji
//   - Narx: "Bepul" (yashil) yoki "$N"
//   - "Kursni boshlash" btn-primary btn-block
//   - Divider
//   - Statistika: 📹 Darslar | 💻 Loyihalar | ⏱ Umumiy | 🏆 XP | 📊 Daraja
//
// HOOKS:
//   useCourse(id)    → { course, loading }
//   useVideos()      → { courseVideos, loading, fetchByCourse }
//
// API:
//   GET /api/courses/:id         → kurs ma'lumoti
//   GET /api/videos/course/:id   → video darslar ro'yxati
//   GET /api/projects/course/:id → loyihalar ro'yxati
//
// KERAKLI IMPORTLAR:
//   import { useParams, Link } from 'react-router-dom'
//   import { useCourse } from '@hooks/useCourses'
//   import { useVideos } from '@hooks/useVideos'
//   import VideoCard from '@components/videos/VideoCard'
//   import SkeletonCard from '@components/loading/SkeletonCard'
//   import { formatDuration } from '@utils/formatDuration'
//
// FIGMA: "Aidevix Course Detail" sahifasini qarang
// ============================================================

export default function CourseDetailPage() {
  // TODO: DONIYOR bu sahifani to'liq yozadi
  return null
}
