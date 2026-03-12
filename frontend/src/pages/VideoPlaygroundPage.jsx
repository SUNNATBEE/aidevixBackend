// ============================================================
//  VideoPlaygroundPage.jsx
//  KIM YOZADI : ABDUVORIS
//  BRANCH     : feature/abduvoris-lessons
//  ROUTE      : /videos/:id/playground
// ============================================================
//
//  BU SAHIFADA NIMA BO'LISHI KERAK:
//  ─────────────────────────────────────────────────────────
//  Bu sahifa 2 ta tab'dan iborat:
//
//  TAB 1 — "KURSLAR":
//    [Video player]  |  [Materiallar ro'yxati]
//    [Savol va Javoblar (Q&A)]
//    [Oldingi dars] [Keyingi dars] navigatsiya
//
//  TAB 2 — "PLAYGROUND":
//    [Code Editor (monaco)]  |  [Terminal output]
//    [RUN CODE tugmasi]
//    [Masala tavsifi]
//
//  O'NG PANEL (har ikkala tabda):
//    [Quiz savollari — agar mavjud bo'lsa]
//    [XP progress: +50 video, +100 quiz]
//
//  FIGMA: "Aidevix Video Lesson Page" (o'rta variant — PLAYGROUND tab)
// ============================================================

// 📦 IMPORTLAR
import { useState, useEffect, useRef }  from 'react'
import { useParams, useNavigate }       from 'react-router-dom'  // URL dan videoId olish
import { useSelector }                  from 'react-redux'
import { motion, AnimatePresence }      from 'framer-motion'
import ReactPlayer                      from 'react-player'       // video player
import Editor                           from '@monaco-editor/react' // npm install @monaco-editor/react
import { FiPlay, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi'
import { BsTerminal, BsCodeSlash }      from 'react-icons/bs'
import toast                            from 'react-hot-toast'

// Redux hooks
import { useVideos }    from '@hooks/useVideos'       // video ma'lumotlari
import { useUserStats } from '@hooks/useUserStats'    // XP, submitQuiz
import { useAuth }      from '@hooks/useAuth'
import { userApi }      from '@api/userApi'           // addVideoWatchXP()

// Komponentlar
import VideoLinkModal from '@components/videos/VideoLinkModal'  // Telegram link modal

// ─────────────────────────────────────────────────────────────────────────────
export default function VideoPlaygroundPage() {
  const { id: videoId } = useParams()   // URL dagi :id
  const navigate        = useNavigate()

  // ── Lokal state ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]   = useState('lessons') // 'lessons' | 'playground'
  const [code, setCode]             = useState('// Kodingizni shu yerga yozing\nconsole.log("Salom Dunyo!")')
  const [output, setOutput]         = useState('')         // Terminal output
  const [isRunning, setIsRunning]   = useState(false)      // Kod ishlayaptimi
  const [question, setQuestion]     = useState('')         // Q&A savol input
  const [videoEnded, setVideoEnded] = useState(false)      // Video tugadimi
  const [xpGiven, setXpGiven]       = useState(false)      // XP allaqachon beriganmi
  const [quiz, setQuiz]             = useState(null)        // Quiz ma'lumotlari
  const [quizAnswers, setQuizAnswers] = useState({})        // Tanlangan javoblar

  // ── Video ma'lumotlari ────────────────────────────────────────────────────
  const { video, loading, telegramLink } = useVideos(videoId)
  /*
    useVideos hook'i:
    - video: { _id, title, description, course, materials, questions }
    - telegramLink: { url, isUsed } — Telegram bir martalik link
    - Telegram linkni olish uchun: dispatch(fetchVideoLink(videoId))
  */

  // ── XP va Quiz ────────────────────────────────────────────────────────────
  const { xp, level, submitQuiz, quizResult } = useUserStats()

  // ── Sahifa ochilganda ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!videoId) return

    // 1. Video uchun quiz borligini tekshirish
    userApi.getQuizByVideo(videoId)
      .then(({ data }) => {
        if (data.data?.quiz && !data.data.alreadySolved) {
          setQuiz(data.data.quiz)
        }
      })
      .catch(() => {})
  }, [videoId])

  // ── Video tugaganida XP berish ────────────────────────────────────────────
  const handleVideoEnd = async () => {
    setVideoEnded(true)
    if (!xpGiven) {
      try {
        await userApi.addVideoWatchXP(videoId)  // POST /api/xp/video-watched/:videoId
        setXpGiven(true)
        toast.success('🎉 +50 XP! Video ko\'rib bo\'ldingiz!', { icon: '🎬' })
      } catch {
        /* silent fail */
      }
    }
  }

  // ── Kod ishlatish (PLAYGROUND tab) ───────────────────────────────────────
  const handleRunCode = () => {
    setIsRunning(true)
    setOutput('')

    /*
      TODO: Kod bajarishning 2 usuli:
      1. eval() — faqat JavaScript uchun, oddiy
      2. Server-side execution — Node.js server orqali (xavfsizroq)

      Oddiy usul (eval bilan):
    */
    try {
      // console.log ni capture qilish
      const logs = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.map(String).join(' '))
        originalLog(...args)
      }

      // eslint-disable-next-line no-eval
      eval(code)

      console.log = originalLog
      setOutput(logs.join('\n') || '// Chiqish yo\'q')
    } catch (err) {
      setOutput(`Xato: ${err.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  // ── Quiz javob yuborish ───────────────────────────────────────────────────
  const handleSubmitQuiz = async () => {
    if (!quiz) return

    const answers = Object.entries(quizAnswers).map(([qi, si]) => ({
      questionIndex: parseInt(qi),
      selectedOption: parseInt(si),
    }))

    const result = await submitQuiz(quiz._id, answers)
    // Redux'da quizResult yangilanadi, justLeveledUp trigger bo'lishi mumkin
    if (result?.payload?.passed) {
      toast.success(`✅ Quiz o'tildi! +${result.payload.xpEarned} XP`)
    } else {
      toast.error(`❌ ${result?.payload?.score || 0}% — Qayta urinib ko'ring`)
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-base-100">

      {/* ─── Telegram Link Modal ── */}
      {/*
        VideoLinkModal allaqachon yozilgan (components/videos/VideoLinkModal.jsx)
        Telegram havola modali — ochish/yopish
      */}

      {/* ─── Navbar-benzar yuqori qism ── */}
      {/*
        TODO: "Aidevix" logosi + "KURSLAR" + "PLAYGROUND" tabs
        Figma'dagi yuqori navigatsiya bilan bir xil
      */}
      <div className="navbar bg-base-200 border-b border-base-300 px-4">
        {/* Tabs */}
        <div className="flex gap-1">
          {[
            { key: 'lessons',    label: '📚 KURSLAR',    icon: BsCodeSlash },
            { key: 'playground', label: '💻 PLAYGROUND', icon: BsTerminal  },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn btn-sm ${activeTab === tab.key ? 'btn-primary' : 'btn-ghost'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* O'ng tomonda: XP ko'rsatgich */}
        {/*
          TODO: "⚡ 1,240 XP" ko'rsatgich
          useUserStats() dagi xp qiymatini ko'rsating
        */}
        <div className="ml-auto flex items-center gap-2">
          <span className="badge badge-primary">⚡ {xp?.toLocaleString()} XP</span>
        </div>
      </div>

      {/* ─── Asosiy content ── */}
      <div className="flex h-[calc(100vh-64px)]">

        {/* ─── CHAP/ASOSIY PANEL ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          <AnimatePresence mode="wait">

            {/* ══ TAB 1: KURSLAR ══ */}
            {activeTab === 'lessons' && (
              <motion.div
                key="lessons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 space-y-4"
              >
                {/* Video player */}
                {/*
                  TODO: ReactPlayer bilan video ko'rsatish
                  URL: telegramLink?.url (bir martalik Telegram link)
                  Agar link yo'q bo'lsa — "Link olish" tugmasi ko'rsatiladi
                  Video tugaganida: handleVideoEnd() chaqiriladi
                */}
                <div className="relative aspect-video bg-base-300 rounded-2xl overflow-hidden">
                  {telegramLink?.url ? (
                    <ReactPlayer
                      url={telegramLink.url}
                      controls
                      width="100%"
                      height="100%"
                      onEnded={handleVideoEnd}
                      config={{
                        file: {
                          attributes: { controlsList: 'nodownload' },
                        },
                      }}
                    />
                  ) : (
                    /*
                      TODO: Placeholder — "Video olish" tugmasi
                      VideoLinkModal ochilsin
                    */
                    <div className="w-full h-full flex items-center justify-center">
                      <button className="btn btn-primary gap-2">
                        <FiPlay /> Video olish (Telegram)
                      </button>
                    </div>
                  )}
                </div>

                {/* Video sarlavha va tavsif */}
                {/*
                  TODO: video.title, video.description ko'rsating
                  Video ko'rilgan bo'lsa: ✅ Ko'rildi belgisi
                */}
                {loading ? (
                  <div className="h-8 bg-base-200 rounded animate-pulse" />
                ) : (
                  <div>
                    <h2 className="text-xl font-bold">{video?.title}</h2>
                    <p className="text-base-content/60 mt-1">{video?.description}</p>
                    {videoEnded && (
                      <span className="badge badge-success mt-2">✅ Ko'rildi +50 XP</span>
                    )}
                  </div>
                )}

                {/* Oldingi/Keyingi navigatsiya */}
                {/*
                  TODO: Kurs videolari ro'yxatidan oldingi va keyingisiga o'tish
                  video.order - 1 va video.order + 1
                  navigate(`/videos/${prevVideoId}/playground`)
                */}
                <div className="flex justify-between">
                  <button className="btn btn-ghost gap-2">
                    <FiChevronLeft /> Oldingi dars
                  </button>
                  <button className="btn btn-ghost gap-2">
                    Keyingi dars <FiChevronRight />
                  </button>
                </div>

                {/* Materiallar */}
                {/*
                  TODO: video.materials massivi bo'yicha PDF/ZIP fayllar
                  [📄 Dars_fayli.pdf  Ko'chirish↓]
                  [📦 Source_Code.zip Ko'chirish↓]
                */}
                {video?.materials?.length > 0 && (
                  <div className="card bg-base-200 p-4">
                    <h3 className="font-semibold mb-3">📎 Materiallar</h3>
                    {video.materials.map((m, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-base-300 last:border-0">
                        <span className="text-sm">{m.name}</span>
                        <a href={m.url} download className="btn btn-xs btn-ghost gap-1">
                          <FiDownload /> Yuklab olish
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Q&A Bo'limi */}
                {/*
                  TODO: Savollar bo'limi
                  - Mavjud savollar ro'yxati
                  - Yangi savol qo'shish input + "Yuborish" tugmasi
                  API: video.questions — backend'da saqlanadi
                */}
                <div className="card bg-base-200 p-4">
                  <h3 className="font-semibold mb-3">💬 Savollar va Javoblar</h3>

                  {/* Savol input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Savolingizni yozing..."
                      className="input input-bordered input-sm flex-1"
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        /* TODO: Savolni backendga yuborish */
                        setQuestion('')
                      }}
                    >
                      Yuborish
                    </button>
                  </div>

                  {/* Savollar ro'yxati */}
                  {/*
                    TODO: video.questions massivini ko'rsating
                    Har bir savolda: foydalanuvchi ismi, savol matni, javob (agar bo'lsa)
                  */}
                </div>

              </motion.div>
            )}

            {/* ══ TAB 2: PLAYGROUND ══ */}
            {activeTab === 'playground' && (
              <motion.div
                key="playground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                {/* Fayl nomi */}
                {/*
                  TODO: "bash.js" kabi fayl nomi tab sifatida ko'rsating
                */}
                <div className="bg-base-300 px-4 py-2 flex items-center gap-2 border-b border-base-200">
                  <span className="text-sm font-mono text-warning">main.js</span>
                </div>

                {/* Editor va Terminal */}
                <div className="flex-1 flex">

                  {/* Monaco Code Editor */}
                  {/*
                    TODO: Dark theme, JavaScript syntax highlighting
                    Minimumda quyidagi tillarn qo'llab-quvvatlash kerak:
                    javascript, python, html, css
                    npm install @monaco-editor/react
                  */}
                  <div className="flex-1 border-r border-base-300">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={code}
                      onChange={(val) => setCode(val || '')}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        padding: { top: 16 },
                        fontFamily: 'JetBrains Mono, Fira Code, monospace',
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>

                  {/* Terminal Output */}
                  {/*
                    TODO: Ko'k/qora background
                    console.log natijalari chiqadi
                    "RUN CODE" tugmasi bosilganda yangilanadi
                    Cursor blink animatsiyasi
                  */}
                  <div className="w-80 bg-gray-900 flex flex-col">
                    <div className="px-3 py-2 bg-gray-800 text-green-400 text-xs font-mono flex items-center gap-2">
                      <BsTerminal /> Terminal
                    </div>
                    <div className="flex-1 p-3 font-mono text-sm text-green-400 overflow-y-auto whitespace-pre-wrap">
                      {output || (
                        <span className="text-gray-600">
                          // Natija bu yerda ko'rinadi
                        </span>
                      )}
                      {/* Cursor blink */}
                      <span className="animate-pulse">█</span>
                    </div>
                  </div>

                </div>

                {/* RUN CODE tugmasi */}
                <div className="p-3 bg-base-200 border-t border-base-300 flex justify-end">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="btn bg-green-500 hover:bg-green-400 text-black font-bold gap-2"
                  >
                    {isRunning ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>▶ RUN CODE</>
                    )}
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ─── O'NG PANEL: Quiz ─────────────────────────────────────────── */}
        {/*
          TODO: Agar quiz mavjud bo'lsa o'ng panelda ko'rsating
          - Quiz savollari (4 ta variant)
          - Tanlangan variant highlight
          - "Natijani tekshirish" tugmasi
          - Natija: score%, XP earned, passed/failed
          Swagger: GET /api/xp/quiz/video/:videoId
                   POST /api/xp/quiz/:quizId
        */}
        {quiz && (
          <div className="w-80 bg-base-200 border-l border-base-300 overflow-y-auto p-4 space-y-4">
            <h3 className="font-bold">📝 {quiz.title}</h3>

            {quiz.questions?.map((q, qi) => (
              <div key={qi} className="space-y-2">
                <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
                {q.options?.map((opt, si) => (
                  <button
                    key={si}
                    onClick={() => setQuizAnswers((prev) => ({ ...prev, [qi]: si }))}
                    className={`w-full text-left text-sm p-2 rounded-lg border transition ${
                      quizAnswers[qi] === si
                        ? 'border-primary bg-primary/20'
                        : 'border-base-300 hover:border-primary/50'
                    }`}
                  >
                    {String.fromCharCode(65 + si)}. {opt}
                  </button>
                ))}
              </div>
            ))}

            {/* Natijani tekshirish */}
            {Object.keys(quizAnswers).length === quiz.questions?.length && (
              <button
                onClick={handleSubmitQuiz}
                className="btn btn-primary btn-sm w-full"
              >
                Natijani tekshirish ✓
              </button>
            )}

            {/* Quiz natijasi */}
            {quizResult && (
              <div className={`card p-3 ${quizResult.passed ? 'bg-success/20 border-success' : 'bg-error/20 border-error'} border`}>
                <p className="font-bold">{quizResult.passed ? '✅ O\'tdingiz!' : '❌ Muvaffaqiyatsiz'}</p>
                <p className="text-sm">Ball: {quizResult.score}%</p>
                <p className="text-sm text-success">+{quizResult.xpEarned} XP</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
