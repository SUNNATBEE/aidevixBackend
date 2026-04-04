// ============================================================
// OQUVCHI  : ABDUVORIS
// BRANCH   : feature/abduvoris-lessons
// ROUTE    : /videos/:id
// ============================================================
//
// VAZIFA: Video ko'rish sahifasini yaratish
//
// Bu sahifada bo'lishi kerak:
//
//  1. ORQAGA TUGMA:
//     - "← Orqaga" — Link to={-1} yoki router.push(-1)
//
//  2. VIDEO HEADER KARTI:
//     - Video sarlavhasi (h1)
//     - Tavsif matni
//     - Meta: ⏱ davomiylik | 👁 ko'rishlar soni
//     - Kurs badge (courseId bo'lsa)
//
//  3. VIDEO KIRISH KARTI (Telegram link):
//     - 🔵 Telegram ikonasi (katta, animatsiyali)
//     - "Video Telegram'da joylashgan" sarlavha
//     - Tushuntirish matni
//     - Tugma holatlari:
//         a) videoLink mavjud va isUsed=false → [ ▶ Videoni ko'rish ]
//            (tugma bosilganda VideoLinkModal ochiladi)
//         b) videoLink.isUsed=true → ⚠️ "Havola allaqachon ishlatilgan"
//         c) link yo'q → 🔒 "Havola yuklanmoqda..."
//     - "💻 Playground'da o'rganish →" link → /videos/:id/playground
//
//  4. MATERIALLAR (video.materials bo'lsa):
//     - "📎 Materiallar" sarlavha
//     - Har bir material: nom + "Yuklab olish ↓" link
//
//  5. VIDEO BAHOLASH:
//     - VideoRating komponenti
//     - videoId={id} prop bilan
//
//  6. KEYINGI/OLDINGI VIDEO (ixtiyoriy):
//     - [ ← Oldingi dars ] [ Keyingi dars → ]
//
//  MODAL:
//     VideoLinkModal — isOpen={modalOpen} onClose={() => setModalOpen(false)}
//
//  SUBSCRIPTION GATE:
//     SubscriptionGate — obuna yo'q bo'lsa bloklaydi va /subscription ga yo'naltiradi
//     <SubscriptionGate>
//       {/* Sahifa kontenti */}
//     </SubscriptionGate>
//
// HOOKS:
//   useVideo(id) → { video, videoLink, loading, error }
//
// API:
//   GET /api/videos/:id
//   → { video: {..., materials}, videoLink: { _id, isUsed, telegramLink } }
//   POST /api/videos/link/:linkId/use
//   → havolani ishlatilgan deb belgilash
//
// KERAKLI IMPORTLAR:
//   import Link from 'next/link';
import { useParams } from 'next/navigation';
//   import { useVideo } from '@hooks/useVideos'
//   import VideoRating from '@components/videos/VideoRating'
//   import VideoLinkModal from '@components/videos/VideoLinkModal'
//   import SubscriptionGate from '@components/subscription/SubscriptionGate'
//   import { formatDuration } from '@utils/formatDuration'
//
// FIGMA: "Aidevix Video Page" sahifasini qarang
// ============================================================

export default function VideoPage() {
  // TODO: ABDUVORIS bu sahifani to'liq yozadi
  return null
}
