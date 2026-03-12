// ╔══════════════════════════════════════════════════════════════╗
// ║  VideoPlaygroundPage.jsx                                     ║
// ║  OQUVCHI: ABDUVORIS                                          ║
// ║  Branch:  feature/abduvoris-lessons                          ║
// ║  Vazifa:  Video + Code Playground + Quiz sahifasi            ║
// ╚══════════════════════════════════════════════════════════════╝

/**
 * Bu sahifada ko'rsatilishi kerak:
 * - Chapda: Video player + dars nomi + navigatsiya (oldingi/keyingi)
 * - O'rtada: Ko'rsatkichlar (KURSLAR, PLAYGROUND)
 * - Navigatsiya: KURSLAR tab + PLAYGROUND tab
 *
 * PLAYGROUND tab ichida:
 * - Code editor (monaco-editor yoki codemirror)
 * - Terminal output
 * - "RUN CODE" tugmasi
 *
 * Pastda (faqat KURSLAR tab'da):
 * - Materiallar (PDF, ZIP fayllar)
 * - Savollar (Q&A bo'limi)
 *
 * O'ng tomonda:
 * - Quiz savollari (SUHROB qismi bilan bog'liq)
 * - XP counter
 *
 * Figma dizayn: "Aidevix Video Lesson Page" (o'rta va o'ng variant)
 *
 * Ishlatish kerak bo'lgan hooklar:
 * import { useVideos } from '@hooks/useVideos'
 * import { useUserStats } from '@hooks/useUserStats'
 *
 * API endpointlar:
 * GET  /api/videos/:id           — video ma'lumotlari
 * POST /api/videos/link/:linkId/use — Telegram link ishlatish
 * POST /api/xp/video-watched/:videoId — XP olish
 * GET  /api/xp/quiz/video/:videoId   — quiz olish
 */

const VideoPlaygroundPage = () => {
  return (
    <div>
      {/* TODO: ABDUVORIS shu yerga Video Playground UI yozadi */}
      <p>VideoPlaygroundPage — ABDUVORIS yozadi</p>
    </div>
  )
}

export default VideoPlaygroundPage
