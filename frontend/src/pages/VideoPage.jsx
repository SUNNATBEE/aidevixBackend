// ============================================================
//  VideoPage.jsx
//  KIM YOZADI : ABDUVORIS
//  BRANCH     : feature/abduvoris-video
//  ROUTE      : /videos/:id
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  Video ma'lumotlarini ko'rsatuvchi sahifa.
//  Login qilmagan yoki obunasi yo'q foydalanuvchi → SubscriptionGate bloklaydi.
//
//  LAYOUT: max-w-4xl markazlashgan konteyner
//
//  1. ORQAGA TUGMA:
//       [ ← Orqaga ] — navigate(-1) yoki Link to={-1}
//
//  2. VIDEO HEADER KARTI:
//    ┌─────────────────────────────────────────┐
//    │ [Video sarlavhasi (h1, 2xl-3xl)]        │
//    │ [Tavsif (text-zinc-400)]                │
//    │ Meta: ⏱ 14:30  |  👁 1,200 ko'rilgan   │
//    │ Kurs: [Badge → /courses/:courseId]      │
//    └─────────────────────────────────────────┘
//
//  3. VIDEO KIRISH KARTI (Telegram link):
//    ┌─────────────────────────────────────────┐
//    │         [🔵 Telegram ikonasi — katta]   │
//    │   "Video Telegram'da joylashgan"        │
//    │   "Xavfsizlik uchun bir martalik havola"│
//    │                                         │
//    │   [▶ Videoni ko'rish] — videoLink bor  │
//    │   [⚠️ Havola ishlatilgan] — used bo'lsa│
//    │   [🔒 Kirish kerak] — link yo'q bo'lsa  │
//    │                                         │
//    │   [ 💻 Playground'da o'rganish → ]     │  link to /videos/:id/playground
//    └─────────────────────────────────────────┘
//
//  4. MATERIALLAR (video.materials bo'lsa):
//    ┌─────────────────────────────────────────┐
//    │ 📎 Materiallar                          │
//    │ 📄 homework.pdf  [Yuklab olish ↓]       │
//    │ 📄 exercise.zip  [Yuklab olish ↓]       │
//    └─────────────────────────────────────────┘
//    — video.materials massividan [{name, url}]
//    — download link yoki tashqi link
//
//  5. VIDEO BAHOLASH:
//    ┌─────────────────────────────────────────┐
//    │ ⭐⭐⭐⭐⭐  (yulduzlar)                   │
//    │ "Bu darsni baholang"                    │
//    └─────────────────────────────────────────┘
//    — VideoRating komponenti
//
//  6. KEYINGI/OLDINGI VIDEO (optional):
//    ┌─────────────────────────────────────────┐
//    │ ← [Oldingi dars]    [Keyingi dars] →   │
//    └─────────────────────────────────────────┘
//
//  MODAL:
//    VideoLinkModal — Telegram bir martalik link
//    isOpen={modalOpen} onClose={() => setModalOpen(false)}
//    — Modal ichida: link ko'rsatish + "Ko'rdim" tugmasi
//    — Link ishlatilgandan keyin isUsed = true
//
//  SUBSCRIPTION GATE:
//    SubscriptionGate — obuna yo'q bo'lsa bloklaydi
//    — "Obuna bo'ling" xabari + /subscription linkiga yo'naltiradi
//
//  HOOKS:
//    useVideo(id) → { video, videoLink, loading, error }
//    useSubscription() → { allVerified }
//
//  API:
//    GET /api/videos/:id
//    → { video: {..., materials, questions}, videoLink: {_id, isUsed, ...} }
//    POST /api/videos/link/:linkId/use
//    → video havolasini ishlatilgan deb belgilash
//
//  KERAKLI PAKETLAR:
//    react-icons, framer-motion
// ============================================================

// 📦 IMPORTLAR
import { useState }                 from 'react'
import { useParams, Link }          from 'react-router-dom'
import { motion, AnimatePresence }  from 'framer-motion'
import {
  IoArrowBack, IoPlay, IoTime,
  IoEye, IoDownload, IoCode,
  IoLockClosed,
} from 'react-icons/io5'
import { FaTelegram }               from 'react-icons/fa'

// Komponentlar
import Loader           from '@components/common/Loader'
import VideoRating      from '@components/videos/VideoRating'
import VideoLinkModal   from '@components/videos/VideoLinkModal'
import SubscriptionGate from '@components/subscription/SubscriptionGate'
import Button           from '@components/common/Button'

// Hook
import { useVideo }   from '@hooks/useVideos'

// Utils
import { formatDuration } from '@utils/formatDuration'

// ─────────────────────────────────────────────────────────────────────────────
export default function VideoPage() {
  const { id } = useParams()

  // ── Video ma'lumotlari ────────────────────────────────────────────────────
  // useVideo(id) — videoSlice dan ma'lumot qaytaradi
  // { video, videoLink, loading, error }
  const { video, videoLink, loading, error } = useVideo(id)

  // ── Modal state ───────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false)

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return <Loader fullScreen text="Video yuklanmoqda..." />

  // ── Xato holati ───────────────────────────────────────────────────────────
  /*
    TODO: Xato holati uchun chiroyli sahifa:
    — Abuna kerakmi? → SubscriptionGate komponenti
    — Video topilmadimi? → "Qaytish" tugmasi
    — Server xatosi? → qayta urinish tugmasi
  */
  if (error) {
    const isSubError = error?.message?.includes('obuna') || error?.subscriptions
    return (
      <div className="container mx-auto px-4 pt-24 pb-20 max-w-2xl">
        <SubscriptionGate>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-200 p-10 text-center"
          >
            <div className="text-5xl mb-4">😕</div>
            <h2 className="text-xl font-bold mb-2">Video yuklanmadi</h2>
            <p className="text-base-content/60 mb-6">
              {error?.message || 'Video topilmadi yoki kirish huquqingiz yo\'q'}
            </p>
            <Link to={-1} className="btn btn-primary">← Orqaga qaytish</Link>
          </motion.div>
        </SubscriptionGate>
      </div>
    )
  }

  if (!video) return null

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">

          {/* ── Orqaga tugma ──────────────────────────────────────────── */}
          {/*
            TODO: Chiroyli "← Orqaga" tugmasi:
            — Link to={-1} (oldingi sahifaga qaytadi)
            — btn-ghost btn-sm
            — IoArrowBack ikonasi
          */}
          <Link to={-1} className="btn btn-ghost btn-sm gap-2 mb-6 inline-flex">
            <IoArrowBack /> Orqaga
          </Link>

          <div className="space-y-6">

            {/* ── 2. Video header karti ───────────────────────────────── */}
            {/*
              TODO: Video header karti dizayn:
              — Sarlavha (h1, katta, bold)
              — Tavsif (agar mavjud bo'lsa)
              — Meta qator:
                  ⏱ davomiylik | 👁 ko'rishlar soni
              — Kurs badge (agar courseId bo'lsa)
              — framer-motion fade-in
            */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-base-200 p-6"
            >
              {/* Sarlavha */}
              <h1 className="text-2xl md:text-3xl font-black mb-3">{video.title}</h1>

              {/* Tavsif */}
              {video.description && (
                <p className="text-base-content/70 leading-relaxed mb-4">
                  {video.description}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                {video.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <IoTime className="text-primary" />
                    {formatDuration(video.duration)}
                  </span>
                )}
                {/*
                  TODO: Ko'rishlar soni (video.viewCount):
                  <span className="flex items-center gap-1">
                    <IoEye className="text-primary" />
                    {video.viewCount?.toLocaleString()} marta ko'rilgan
                  </span>
                */}
                {video.viewCount > 0 && (
                  <span className="flex items-center gap-1">
                    <IoEye className="text-primary" />
                    {video.viewCount?.toLocaleString()} marta ko'rilgan
                  </span>
                )}
              </div>
            </motion.div>

            {/* ── 3. Video kirish karti ────────────────────────────────── */}
            {/*
              TODO: Video kirish karti dizayn:
              — Telegram ikonasi (katta, ko'k)
              — "Video Telegram'da joylashgan" sarlavha
              — Tushuntirish matni
              — Tugma holatlari:
                  1. videoLink && !videoLink.isUsed → [ ▶ Videoni ko'rish ]
                  2. videoLink?.isUsed → ⚠️ "Havola ishlatilgan"
                  3. !videoLink → 🔒 "Havola yuklanmoqda..."
              — Playground link
            */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card bg-base-200 p-6 text-center space-y-4"
            >
              {/* Telegram ikonasi */}
              {/*
                TODO: Katta, animatsiyali ikonasi:
                — motion.div bilan pulse yoki float animatsiya
                — FaTelegram text-primary katta
              */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="w-24 h-24 mx-auto rounded-2xl bg-primary/20 border border-primary/30
                           flex items-center justify-center"
              >
                <FaTelegram className="text-5xl text-primary" />
              </motion.div>

              <h2 className="text-xl font-bold">Video Telegram'da joylashgan</h2>
              <p className="text-base-content/60 text-sm max-w-md mx-auto">
                Video xavfsizligi uchun bir martalik havola orqali taqdim etiladi.
                Havolani faqat bir marta ishlatishingiz mumkin.
              </p>

              {/* Tugma holatlari */}
              {videoLink && !videoLink.isUsed ? (
                // ✅ Havola mavjud va ishlatilmagan
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                >
                  <Button
                    onClick={() => setModalOpen(true)}
                    size="lg"
                    className="gap-2 min-w-[200px]"
                  >
                    <IoPlay /> Videoni ko'rish
                  </Button>
                </motion.div>
              ) : videoLink?.isUsed ? (
                // ⚠️ Havola ishlatilgan
                /*
                  TODO: Havola ishlatilgan holat dizayn:
                  — warning rang
                  — "Yangi havola olish" tugmasi (optional)
                */
                <div className="alert alert-warning max-w-sm mx-auto">
                  <span>⚠️ Bu video havolasi allaqachon ishlatilgan.</span>
                </div>
              ) : (
                // 🔒 Havola hali yuklanmagan yoki yo'q
                <div className="flex items-center justify-center gap-2 text-base-content/50">
                  <span className="loading loading-spinner loading-sm" />
                  <span>Havola yuklanmoqda...</span>
                </div>
              )}

              {/* Playground link */}
              {/*
                TODO: Playground linkini chiroyli ko'rsating:
                — VideoPlaygroundPage ga o'tadi
                — IoCode ikonasi + "Playground'da o'rganish"
                — btn-ghost btn-sm
              */}
              <div className="pt-2">
                <Link
                  to={`/videos/${id}/playground`}
                  className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-primary"
                >
                  <IoCode /> 💻 Playground'da o'rganish
                </Link>
              </div>
            </motion.div>

            {/* ── 4. Materiallar ──────────────────────────────────────── */}
            {/*
              TODO: Materiallar bo'limi (video.materials bo'lsa ko'rsatiladi):
              — "📎 Materiallar" sarlavha
              — Har bir material: ikonka + nom + "Yuklab olish ↓" link
              — download attribute bilan href
              — framer-motion stagger animatsiya
            */}
            {video.materials?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="card bg-base-200 p-6"
              >
                <h3 className="font-bold mb-4">📎 Materiallar</h3>
                <div className="space-y-2">
                  {video.materials.map((material, i) => (
                    <motion.a
                      key={i}
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.08 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-base-300
                                 hover:bg-base-300/80 transition-colors group"
                    >
                      <span className="text-sm font-medium">{material.name}</span>
                      <span className="btn btn-ghost btn-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <IoDownload /> Yuklab olish
                      </span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── 5. Video baholash ────────────────────────────────────── */}
            {/*
              TODO: VideoRating komponenti:
              — ⭐⭐⭐⭐⭐ yulduzlar (1-5)
              — "Bu darsni baholang" matn
              — Bosiganda: POST /api/videos/:id/rate
              — Allaqachon baholangan bo'lsa: o'zgartirishga ruxsat

              VideoRating props: videoId={id}
            */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <VideoRating videoId={id} />
            </motion.div>

            {/* ── 6. Keyingi/Oldingi video (optional) ─────────────────── */}
            {/*
              TODO: Navigatsiya tugmalari:
              — Kurs videolari ro'yxatidan oldingi va keyingi video
              — [ ← Oldingi dars ] [ Keyingi dars → ]

              Misol:
              <div className="flex justify-between gap-4">
                {prevVideo && (
                  <Link to={`/videos/${prevVideo._id}`} className="btn btn-ghost gap-2">
                    <IoArrowBack /> {prevVideo.title}
                  </Link>
                )}
                {nextVideo && (
                  <Link to={`/videos/${nextVideo._id}`} className="btn btn-ghost gap-2 ml-auto">
                    {nextVideo.title} <IoArrowForward />
                  </Link>
                )}
              </div>
            */}

          </div>

          {/* ── VideoLinkModal — bir martalik Telegram link ──────────── */}
          {/*
            TODO: VideoLinkModal ni to'liq dizayn qiling:
            — Modal ichida: Telegram link ko'rsatish
            — "Linkni nusxalash" tugmasi
            — "Telegramda ochish" tugmasi (target="_blank")
            — "Ko'rdim, yopish" tugmasi → markAsUsed() dispatch
            — framer-motion modal animatsiya
          */}
          <VideoLinkModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />

        </div>
      </div>
    </SubscriptionGate>
  )
}
