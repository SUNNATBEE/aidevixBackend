// ============================================================
// OQUVCHI  : ABDUVORIS
// BRANCH   : feature/abduvoris-lessons
// ROUTE    : /videos/:id/playground
// ============================================================
//
// VAZIFA: Video + Code Playground sahifasini yaratish
//
// Bu sahifada 2 ta asosiy tab bo'ladi:
//
// ─── TAB 1: "📚 KURSLAR" ───────────────────────────────────
//
//  Video player (ReactPlayer):
//   - URL: Telegram bir martalik havola
//   - Link yo'q bo'lsa: "Video olish (Telegram)" tugmasi
//   - Video tugaganida: handleVideoEnd() → +50 XP
//     API: POST /api/xp/video-watched/:videoId
//
//  Video sarlavha va tavsif:
//   - video.title, video.description
//   - Video ko'rilsa: ✅ Ko'rildi +50 XP badge
//
//  Oldingi/Keyingi navigatsiya:
//   - [ ← Oldingi dars ] [ Keyingi dars → ]
//   - Kurs videolari ro'yxatidan
//
//  Materiallar (video.materials):
//   - [📄 fayl.pdf  Ko'chirish↓]
//
//  Q&A Bo'limi:
//   - Savollar ro'yxati
//   - Yangi savol input + "Yuborish" tugmasi
//
// ─── TAB 2: "💻 PLAYGROUND" ───────────────────────────────
//
//  Fayl nomi tab: "main.js" (monaco-editor uslubida)
//
//  Monaco Code Editor (chap tomonda):
//   - npm install @monaco-editor/react
//   - Dark theme, JavaScript language
//   - Font: JetBrains Mono / monospace
//   - value={code} onChange={(val) => setCode(val)}
//
//  Terminal Output (o'ng tomonda):
//   - Qora background, yashil matn
//   - console.log natijalari chiqadi
//   - Cursor blink animatsiyasi
//
//  "▶ RUN CODE" tugmasi (neon yashil):
//   - Kod bajariladi: eval(code) yoki server-side
//   - Natija Terminal'da ko'rsatiladi
//
// ─── O'NG PANEL: Quiz (agar mavjud bo'lsa) ─────────────────
//   - Quiz savollari (4 ta variant)
//   - Har bir savol uchun variant tanlash
//   - "Natijani tekshirish" tugmasi
//   - Natija: score%, XP earned, passed/failed
//   - API: GET /api/xp/quiz/video/:videoId
//          POST /api/xp/quiz/:quizId
//
// TEPADA NAVIGATSIYA (navbar-benzar):
//   - Aidevix logosi
//   - [ 📚 KURSLAR ] [ 💻 PLAYGROUND ] tabs
//   - O'ngda: ⚡ {xp} XP ko'rsatgich
//
// HOOKS:
//   useVideos(videoId)  → { video, loading, telegramLink }
//   useUserStats()      → { xp, submitQuiz, quizResult, justLeveledUp }
//
// KERAKLI IMPORTLAR:
//   import ReactPlayer from 'react-player'
//   import Editor from '@monaco-editor/react'    (npm install @monaco-editor/react)
//   import { useParams } from 'react-router-dom'
//   import { userApi } from '@api/userApi'        addVideoWatchXP() uchun
//   import VideoLinkModal from '@components/videos/VideoLinkModal'
//
// FIGMA: "Aidevix Video Lesson Page (PLAYGROUND tab)" sahifasini qarang
// ============================================================

export default function VideoPlaygroundPage() {
  // TODO: ABDUVORIS bu sahifani to'liq yozadi
  return null
}
