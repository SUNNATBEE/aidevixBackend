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

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { IoArrowBack, IoTimeOutline, IoEyeOutline, IoDocumentTextOutline, IoDownloadOutline } from 'react-icons/io5'
import { FaTelegram } from 'react-icons/fa'
import ReactPlayer from 'react-player'
import { useVideo } from '@hooks/useVideos'
import VideoRating from '@components/videos/VideoRating'
import VideoLinkModal from '@components/videos/VideoLinkModal'
import SubscriptionGate from '@components/subscription/SubscriptionGate'
import { formatDurationText } from '@utils/formatDuration'
import { userApi } from '@api/userApi'
import toast from 'react-hot-toast'

export default function VideoPage() {
  const { id } = useParams()
  const { video, videoLink, loading, error } = useVideo(id)
  const [modalOpen, setModalOpen] = useState(false)
  const [xpAdded, setXpAdded] = useState(false)

  const handleVideoEnd = async () => {
    if (xpAdded) return
    try {
      await userApi.addVideoWatchXP(id)
      setXpAdded(true)
      toast.success("+50 XP! Darsni yakunladingiz.")
    } catch (err) {
      console.error("XP qo'shishda xato:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="text-center py-20 px-4">
        <div className="max-w-md mx-auto bg-zinc-900/50 border border-white/5 p-10 rounded-3xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-white mb-4">Video topilmadi</h2>
          <p className="text-zinc-400 mb-8">Siz qidirayotgan dars o'chirilgan bo'lishi yoki ulanishda xatolik yuz bergan bo'lishi mumkin.</p>
          <Link to={-1} className="btn btn-primary px-8 rounded-2xl">Orqaga qaytish</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      {/* Back Button */}
      <Link 
        to={-1} 
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8 group bg-white/5 px-4 py-2 rounded-xl border border-transparent hover:border-white/10"
      >
        <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Orqaga</span>
      </Link>

      <SubscriptionGate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Video & Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player Header */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
                {video.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <IoTimeOutline className="text-primary" size={18} />
                  <span className="font-medium">{formatDurationText(video.duration)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <IoEyeOutline className="text-primary" size={18} />
                  <span className="font-medium">{video.views || 0} marta ko'rilgan</span>
                </div>
                {video.courseId && (
                  <div className="badge badge-primary badge-outline px-4 py-3 font-bold uppercase tracking-widest text-[10px]">
                    Kurs darsi
                  </div>
                )}
              </div>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-white/10 ring-1 ring-white/5">
              {videoLink?.telegramLink ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-black">
                  <ReactPlayer
                    url={videoLink.telegramLink}
                    width="100%"
                    height="100%"
                    controls
                    onEnded={handleVideoEnd}
                    playsinline
                    config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center text-center p-8">
                    <div className="w-20 h-20 rounded-3xl bg-blue-500/20 flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-xl shadow-blue-500/10">
                      <FaTelegram className="text-blue-400 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Video Telegram'da joylashgan</h3>
                    <p className="text-sm text-zinc-500 mb-8 max-w-sm leading-relaxed">
                      Dars videolarining xavfsizligini ta'minlash uchun biz ularni maxfiy Telegram kanallarida saqlaymiz.
                    </p>
                    <button 
                      onClick={() => setModalOpen(true)} 
                      className="btn btn-primary px-10 rounded-2xl h-14 text-lg font-bold shadow-lg shadow-primary/30"
                    >
                      Havolani olish
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 md:p-10 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
                Dars tavsifi
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap font-light">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Rating Component */}
            <VideoRating videoId={id} />
          </div>

          {/* Right Column: Sidebar (Materials & Links) */}
          <div className="space-y-6">
            {/* Telegram Activation Card */}
            <div className="bg-gradient-to-br from-blue-600/10 to-indigo-900/20 border border-blue-500/20 rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors duration-700"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-lg">
                    <FaTelegram className="text-blue-400 text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Xavfsiz ulanish</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Bir martalik havola</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {videoLink?.isUsed ? (
                    <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0 animate-pulse"></div>
                      <p className="text-xs font-medium text-yellow-500/90 leading-relaxed">
                        Ushbu dars uchun havola allaqachon ishlatilgan. Yangi havola uchun sahifani yangilang.
                      </p>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setModalOpen(true)}
                      className="btn btn-primary w-full h-15 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Videoni Telegramda ko'rish
                    </button>
                  )}
                  
                  <Link 
                    to={`/videos/${id}/playground`}
                    className="btn btn-ghost w-full hover:bg-white/5 border border-white/5 h-15 rounded-2xl flex items-center justify-center gap-3 group/play transition-colors"
                  >
                    <span className="text-zinc-400 group-hover/play:text-white transition-colors">Playground'da dars qilish</span>
                    <span className="text-zinc-500 group-hover/play:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Materials List */}
            {video.materials && video.materials.length > 0 && (
              <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl">
                <h4 className="font-bold text-white mb-8 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IoDocumentTextOutline className="text-primary text-xl" />
                  </div>
                  Resurslar
                </h4>
                <div className="space-y-4">
                  {video.materials.map((mat, idx) => (
                    <a 
                      key={idx}
                      href={mat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <IoDocumentTextOutline className="text-zinc-500 group-hover:text-primary transition-colors text-xl" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{mat.name}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{mat.type || 'fayl'}</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-zinc-500 group-hover:text-white transition-colors">
                        <IoDownloadOutline size={20} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SubscriptionGate>

      {/* Modals */}
      <VideoLinkModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  )
}
