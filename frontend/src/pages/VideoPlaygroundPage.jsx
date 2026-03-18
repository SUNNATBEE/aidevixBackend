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

import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import Editor from '@monaco-editor/react'
import { IoPlay, IoRefresh, IoChatbubbleEllipsesOutline, IoDocumentTextOutline, IoTrophyOutline, IoChevronForward } from 'react-icons/io5'
import { FaTerminal, FaCode, FaBook } from 'react-icons/fa'
import { useVideo } from '@hooks/useVideos'
import { useUserStats } from '@hooks/useUserStats'
import { useTopUsers } from '@hooks/useRanking'
import { userApi } from '@api/userApi'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDurationText } from '@utils/formatDuration'

export default function VideoPlaygroundPage() {
  const { id } = useParams()
  const { video, videoLink, loading } = useVideo(id)
  const { xp, submitQuiz } = useUserStats()
  const { users: topUsers } = useTopUsers({ limit: 5 })
  
  const [activeTab, setActiveTab] = useState('courses') // 'courses' | 'playground'
  const [code, setCode] = useState('// Bu yerga kod yozing...\nconsole.log("Salom, Aidevix!");\n')
  const [output, setOutput] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [xpAdded, setXpAdded] = useState(false)

  // Terminal output capture logic
  const runCode = () => {
    setIsRunning(true)
    setOutput([{ type: 'info', content: '$ node main.js' }])
    
    setTimeout(() => {
      const logs = []
      const oldLog = console.log
      console.log = (...args) => logs.push({ type: 'log', content: args.join(' ') })
      
      try {
        // eslint-disable-next-line no-eval
        eval(code)
        setOutput(prev => [...prev, ...logs])
      } catch (err) {
        setOutput(prev => [...prev, { type: 'error', content: err.toString() }])
      } finally {
        console.log = oldLog
        setIsRunning(false)
      }
    }, 500)
  }

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0e1a]">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-[#0d0e1a] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#121425] shrink-0">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-black text-white tracking-tighter hover:opacity-80 transition-opacity">
            AIDEVIX<span className="text-primary">.</span>
          </Link>
          
          <nav className="flex bg-black/20 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'courses' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-500 hover:text-white'}`}
            >
              <FaBook /> KURSLAR
            </button>
            <button 
              onClick={() => setActiveTab('playground')}
              className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'playground' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-500 hover:text-white'}`}
            >
              <FaCode /> PLAYGROUND
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20">
            <span className="text-yellow-500 font-bold">⚡ {xp?.toLocaleString()}</span>
            <span className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-wider">XP</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/10"></div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'courses' ? (
              <motion.div 
                key="courses"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar"
              >
                {/* Video Area */}
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-primary/5">
                    <ReactPlayer 
                      url={videoLink?.telegramLink}
                      width="100%"
                      height="100%"
                      controls
                      onEnded={handleVideoEnd}
                      playsinline
                    />
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-2">{video?.title}</h1>
                      <p className="text-zinc-500 text-sm">{video?.description}</p>
                    </div>
                    {xpAdded && (
                      <div className="badge badge-success gap-2 py-3 px-4 font-bold">
                        ✓ KO'RILDI +50 XP
                      </div>
                    )}
                  </div>

                  {/* Q&A Section Implementation */}
                  <div className="bg-[#121425] rounded-3xl border border-white/5 p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <IoChatbubbleEllipsesOutline className="text-primary" />
                      Savol va Javoblar
                    </h3>
                    <div className="space-y-4 mb-6">
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0"></div>
                        <div className="bg-white/5 p-4 rounded-2xl flex-1 border border-white/5">
                          <p className="text-sm text-zinc-300">Bu mavzu bo'yicha savolingiz bormi? Pastda yozib qoldiring.</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea 
                        className="textarea textarea-bordered w-full bg-black/20 rounded-2xl h-24 focus:border-primary transition-colors text-sm"
                        placeholder="Savolingizni yozing..."
                      ></textarea>
                      <button className="btn btn-primary btn-sm absolute bottom-4 right-4 rounded-xl px-6">Yuborish</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="playground"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex"
              >
                {/* Editor Section */}
                <div className="flex-1 flex flex-col border-r border-white/5">
                  <div className="h-10 bg-[#1a1c2e] border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-t-lg border-x border-t border-white/10 -mb-[1px]">
                      <FaCode className="text-yellow-500 text-[10px]" />
                      <span className="text-[10px] font-bold text-zinc-400">main.js</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#1a1c2e]">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      value={code}
                      onChange={setCode}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        padding: { top: 20 },
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                      }}
                    />
                  </div>
                </div>

                {/* Terminal Section */}
                <div className="w-[40%] flex flex-col bg-[#080914]">
                  <div className="h-10 bg-[#121425] border-b border-white/5 flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <FaTerminal className="text-zinc-500 text-xs" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Terminal</span>
                    </div>
                    <button onClick={() => setOutput([])} className="text-zinc-500 hover:text-white transition-colors">
                      <IoRefresh size={14} />
                    </button>
                  </div>
                  <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar-thin">
                    {output.map((line, i) => (
                      <div key={i} className={`mb-1 ${
                        line.type === 'error' ? 'text-red-400' : 
                        line.type === 'info' ? 'text-zinc-500' : 'text-green-400'
                      }`}>
                        {line.content}
                      </div>
                    ))}
                    {isRunning && <div className="text-zinc-500 animate-pulse">Bajarilmoqda...</div>}
                    <div className="w-2 h-4 bg-zinc-700 animate-blink inline-block ml-1"></div>
                  </div>
                  <div className="p-4 border-t border-white/5">
                    <button 
                      onClick={runCode}
                      disabled={isRunning}
                      className="btn bg-green-500 hover:bg-green-400 text-black border-none w-full font-black tracking-widest gap-3 h-14 rounded-2xl shadow-lg shadow-green-500/20"
                    >
                      <IoPlay size={20} />
                      RUN CODE
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 bg-[#121425] border-l border-white/5 p-6 space-y-8 flex flex-col shrink-0">
          {/* Rankings Section */}
          <section>
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center justify-between">
              Top O'quvchilar
              <IoTrophyOutline className="text-yellow-500 text-lg" />
            </h4>
            <div className="space-y-4">
              {topUsers.map((user, idx) => (
                <div key={user._id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${
                      idx === 0 ? 'bg-yellow-500/20 border-yellow-500/20 text-yellow-500' : 
                      idx === 1 ? 'bg-zinc-400/20 border-zinc-400/20 text-zinc-400' :
                      idx === 2 ? 'bg-orange-500/20 border-orange-500/20 text-orange-500' :
                      'bg-zinc-800/50 border-white/5 text-zinc-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate w-24">{user.username}</p>
                      <p className="text-[10px] text-zinc-500">{user.level}-bosqich</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-400">{user.xp?.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quiz Preview/CTA */}
          <section className="mt-auto">
            <div className="bg-gradient-to-br from-primary/10 to-purple-600/20 border border-primary/20 rounded-3xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg">
                <IoDocumentTextOutline className="text-primary text-2xl" />
              </div>
              <h4 className="font-bold text-white">Bilimingizni sinab ko'ring</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">Ushbu dars bo'yicha quizlarni topshiring va qo'shimcha XP oling.</p>
              <button className="btn btn-primary w-full btn-sm rounded-xl py-4 h-auto">Quizni boshlash</button>
            </div>
          </section>

          {/* Materials in Sidebar */}
          <section>
             <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <IoDocumentTextOutline className="text-primary" /> Materiallar
            </h4>
            <div className="space-y-3">
              {video?.materials?.map((mat, i) => (
                <a key={i} href={mat.url} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                   <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                      <IoDocumentTextOutline className="text-zinc-500 group-hover:text-primary" size={14} />
                    </div>
                    <span className="text-xs text-zinc-300 truncate w-32">{mat.name}</span>
                  </div>
                  <IoChevronForward className="text-zinc-600" size={14} />
                </a>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  )
}
