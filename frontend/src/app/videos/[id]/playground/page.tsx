'use client';

// ============================================================
// OQUVCHI  : ABDUVORIS
// BRANCH   : feature/abduvoris-lessons
// ROUTE    : /videos/:id/playground
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

// Monaco Editor server-side render bo'lmaydi (window API ishlatadi)
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  IoPlay,
  IoRefresh,
  IoBookmark,
  IoShareSocial,
  IoLockClosed,
  IoDocumentText,
  IoChevronForward,
  IoChevronUp,
  IoSettings,
  IoEye,
  IoTime,
} from 'react-icons/io5';
import { FaTerminal, FaCode, FaBook } from 'react-icons/fa';
import { BsLightningChargeFill } from 'react-icons/bs';
import { useVideos } from '@hooks/useVideos';
import { useUserStats } from '@hooks/useUserStats';
import { useSubscription } from '@hooks/useSubscription';
import { selectIsLoggedIn } from '@store/slices/authSlice';
import { selectInstagramSub, selectTelegramSub } from '@store/slices/subscriptionSlice';
import { userApi } from '@/api/userApi';
import { videoApi } from '@/api/videoApi';
import SubscriptionGate from '@/components/subscription/SubscriptionGate';

interface OutputLine {
  type: 'log' | 'error' | 'info';
  content: string;
}

const SCROLLBAR_STYLE = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DEFAULT_CODES: Record<string, string> = {
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: white; padding: 20px; margin: 0; }
    h1 { color: #6366f1; text-align: center; margin-top: 30px; font-size: 2rem; }
    .card { background: #1e293b; padding: 25px; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
    p { line-height: 1.6; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Salom Aidevix!</h1>
    <p>Bu yerda HTML kodingizni yozing va natijani darhol ko'ring.</p>
    <button style="background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">Tugmani bosing</button>
  </div>
</body>
</html>`,
  python: `# Python kodingizni yozing
print("Salom Aidevix!")

def salom_ber(ism):
    return f"Salom, {ism}! Dasturlashga xush kelibsiz."

if __name__ == "__main__":
    natija = salom_ber("O'quvchi")
    print(natija)
    
    yosh = 25
    bal = 95.5
    print(f"Yosh: {yosh}, Bal: {bal}")`,
  javascript: `// JavaScript kodingizni yozing
console.log("Salom Aidevix!");

function salom(ism) {
  return "Assalomu alaykum, " + ism + "!";
}

console.log(salom("O'quvchi"));`
};

export default function VideoPlaygroundPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { current: video, player, loading, fetchById } = useVideos();
  const { xp } = useUserStats();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { instagram, telegram, allVerified } = useSubscription();
  const isSubscribed = !!(isLoggedIn && instagram?.subscribed && telegram?.subscribed);
  const [showModal, setShowModal] = useState<boolean>(false);
  const wasSubscribedRef = useRef(isSubscribed);

  const [activeTab, setActiveTab] = useState<'courses' | 'playground'>('playground');
  const [outputTab, setOutputTab] = useState<'terminal' | 'preview'>('terminal');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [pyodide, setPyodide] = useState<any>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [xpAdded, setXpAdded] = useState(false);
  const [question, setQuestion] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const watchedSecondsRef = useRef<number>(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isOutputExpanded, setIsOutputExpanded] = useState(true);

  const category = video?.course?.category || 'html';
  const fileName = category === 'html' ? 'index.html' : category === 'javascript' ? 'script.js' : 'main.py';
  const language = category === 'html' ? 'html' : category === 'javascript' ? 'javascript' : 'python';

  // Set initial code when video loads
  useEffect(() => {
    if (video && !code) {
      setCode(DEFAULT_CODES[category] || DEFAULT_CODES.html);
      if (category === 'html') setOutputTab('preview');
    }
  }, [video, category]);

  // Load Pyodide for Python
  useEffect(() => {
    if ((category === 'python' || category === 'ai') && !pyodide && !isPyodideLoading) {
      setIsPyodideLoading(true);
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.async = true;
      script.onload = async () => {
        // @ts-ignore
        const py = await window.loadPyodide();
        setPyodide(py);
        setIsPyodideLoading(false);
      };
      document.body.appendChild(script);
    }
  }, [category, pyodide, isPyodideLoading]);
 
  // Live HTML Preview
  useEffect(() => {
    if (category === 'html' && code) {
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [code, category]);

  useEffect(() => {
    setIsMounted(true);
    if (id) fetchById(id);
  }, [id]);

  // Track watch progress every 10s and save to backend
  useEffect(() => {
    const courseId = typeof video?.course === 'object' ? video.course?._id : undefined;
    if (!isLoggedIn || !isSubscribed || !id || !courseId) return;
    progressTimerRef.current = setInterval(() => {
      watchedSecondsRef.current += 10;
      videoApi.saveProgress(courseId, id, watchedSecondsRef.current).catch(() => {});
    }, 10_000);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [id, isLoggedIn, isSubscribed, video?.course]);

  // Obuna bekor qilinganda avtomatik gate ochish
  useEffect(() => {
    if (wasSubscribedRef.current && !isSubscribed && isLoggedIn) {
      setShowModal(true);
    }
    wasSubscribedRef.current = isSubscribed;
  }, [isSubscribed, isLoggedIn]);

  const handleModalSuccess = () => {
    setShowModal(false);
    window.location.reload();
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const runCode = async () => {
    setIsRunning(true);
    
    if (category === 'html') {
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setOutputTab('preview');
      setOutput([{ type: 'info', content: 'Preview yangilandi' }]);
      setIsRunning(false);
      return;
    }

    const logs: OutputLine[] = [
      { type: 'info', content: '┌── user@aidevix:~/' },
      { type: 'info', content: `└─ $ ${language} ${fileName}` }
    ];

    if (category === 'python' || category === 'ai') {
      if (!pyodide) {
        logs.push({ type: 'error', content: 'Pyodide hali yuklanmadi...' });
        setOutput(logs);
        setIsRunning(false);
        return;
      }
      try {
        pyodide.runPython(`
          import sys
          import io
          sys.stdout = io.StringIO()
        `);
        await pyodide.runPythonAsync(code);
        const result = pyodide.runPython('sys.stdout.getvalue()');
        result.split('\n').filter((l: string) => l).forEach((l: string) => {
          logs.push({ type: 'log', content: l });
        });
      } catch (err: any) {
        logs.push({ type: 'error', content: err.message });
      }
    } else {
      // JavaScript
      try {
        const oldLog = console.log;
        console.log = (...args: any[]) => logs.push({ type: 'log', content: args.join(' ') });
        eval(code);
        console.log = oldLog;
      } catch (err: any) {
        logs.push({ type: 'error', content: err.message });
      }
    }
    
    setOutput(logs);
    setIsRunning(false);
    setOutputTab('terminal');
  };

  // Called manually when user marks lesson as done (no onEnded in iframe)
  const handleMarkWatched = async () => {
    if (xpAdded || !isLoggedIn) return;
    try {
      await userApi.addVideoWatchXP(id);
      setXpAdded(true);
      toast.success('+50 XP! Darsni yakunladingiz.');
    } catch {
      // silent
    }
  };

  const handleQuestionSubmit = () => {
    if (!question.trim()) return;
    toast.success('Savolingiz yuborildi!');
    setQuestion('');
  };

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0e1a]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const courseTitle = video?.course?.title || 'KURS';
  const videoTitle = video?.title || 'Dars';

  return (
    <div className="flex flex-col h-screen bg-[#0d0f1a] overflow-hidden text-zinc-100 font-sans selection:bg-indigo-500/30">
      <style dangerouslySetInnerHTML={{ __html: SCROLLBAR_STYLE }} />

      {/* ── TOP NAVBAR ── */}
      <header className="h-16 shrink-0 border-b border-white/5 bg-[#10121f]/80 backdrop-blur-xl flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg italic">A</span>
            </div>
            <span className="text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Aidevix <span className="text-indigo-400 font-medium text-sm ml-1 uppercase tracking-widest">Lab</span>
            </span>
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Live Session</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <BsLightningChargeFill className="text-yellow-400" size={14} />
            <span className="text-xs font-black text-indigo-100">{xp} XP</span>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
            <IoShareSocial size={18} />
          </button>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] cursor-pointer hover:scale-105 transition-transform">
             <div className="w-full h-full rounded-[15px] bg-[#10121f] flex items-center justify-center">
                <span className="text-xs font-bold text-white">M</span>
             </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex overflow-hidden relative">
 
        {/* ── LEFT PANEL: Video + Info ── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '45%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex flex-col border-r border-white/5 overflow-y-auto shrink-0 scrollbar-hide"
            >

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 px-5 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 shrink-0 overflow-hidden whitespace-nowrap">
            <span className="hover:text-white cursor-pointer transition-colors shrink-0">{courseTitle}</span>
            <IoChevronForward size={8} className="shrink-0" />
            <span className="text-white truncate">{videoTitle}</span>
          </div>

          {/* Video Player — Bunny.net iframe */}
          <div className="mx-5 rounded-2xl overflow-hidden bg-black aspect-video relative border border-white/5 shadow-xl shrink-0">
            {player?.embedUrl ? (
              <iframe
                src={player.embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              /* Placeholder */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                <div className="absolute inset-0 opacity-15 overflow-hidden text-[9px] leading-4 font-mono text-green-400 p-4 select-none pointer-events-none">
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i} className="whitespace-nowrap">
                      {`${String(i + 1).padStart(2, ' ')}  ${['def salom_ber(ism):', '  return f"Salom, {ism}!"', 'foydalanuvchi = "O\'quvchi"', 'print(salom_ber(foydalanuvchi))', 'yosh = 25; bal = 95.5'][i % 5]}`}
                    </div>
                  ))}
                </div>
                <button className="relative z-10 w-16 h-16 rounded-full bg-primary/80 hover:bg-primary border border-primary/40 flex items-center justify-center shadow-2xl shadow-primary/30 transition-all hover:scale-110">
                  <IoPlay size={22} className="ml-1" />
                </button>
                <p className="relative z-10 text-xs text-zinc-500 mt-3">Video yuklanmoqda...</p>
              </div>
            )}
          </div>

          {/* Lesson Title + Actions */}
          <div className="flex flex-col gap-4 px-6 py-6 shrink-0 border-b border-white/5 bg-white/[0.01]">
            <div>
              <h1 className="text-xl font-black text-white leading-tight tracking-tight">{videoTitle}</h1>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-lg">
                {video?.description || 'Ushbu darsda dasturlashning asosiy tushunchalarini o\'rganamiz va amaliy mashqlar bajaramiz.'}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {xpAdded && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-full"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    +50 XP QO&apos;SHILDI
                  </motion.span>
                )}
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <IoTime className="text-indigo-400" size={12} />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">15 daqiqa</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
                  <IoBookmark size={16} />
                </button>
                {!xpAdded ? (
                  <button 
                    onClick={handleMarkWatched}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all text-xs font-bold text-white shadow-lg shadow-indigo-600/20"
                  >
                    <IoPlay size={14} className="fill-current" />
                    Yakunladim
                  </button>
                ) : (
                  <div className="px-5 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                    ✓ Tugallandi
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resources + Next Lesson */}
          <div className="flex flex-col gap-3 px-5 py-4 shrink-0">
            {/* Resources */}
            <div className="bg-[#13152a] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Resurslar</p>
              <div className="grid grid-cols-1 gap-2">
                {(video?.materials?.length ? video.materials : [
                  { name: 'Dars Slaydlari.pdf', url: '#', size: '2MB' },
                  { name: 'Source Code.zip', url: '#', size: '14KB' },
                ]).map((mat: { name: string; url: string; size?: string }, i: number) => (
                  <a
                    key={i}
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                        <IoDocumentText size={12} className="text-primary" />
                      </div>
                      <span className="text-xs text-zinc-300 truncate max-w-[110px]">{mat.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600">{mat.size || ''}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Next Lesson */}
            <div className="bg-[#13152a] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Keyingi Dars</p>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center shrink-0">
                  <IoLockClosed size={12} className="text-zinc-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">3. Shartli Operatorlar</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">15 daqiqa • 120 XP</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/courses/${video?.course?._id || ''}`)}
                className="w-full mt-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-[11px] text-zinc-400 hover:text-white transition-colors font-medium"
              >
                Barcha darslarni ko&apos;rish
              </button>
            </div>
          </div>

          {/* Q&A */}
          <div className="mx-5 mb-5 bg-[#13152a] border border-white/5 rounded-2xl p-4 shrink-0">
            <h3 className="text-sm font-bold text-white mb-4">
              Savol va Javoblar
              <span className="text-zinc-500 font-normal text-xs ml-2">(12)</span>
            </h3>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0" />
              <div className="flex-1 relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-600 px-4 py-3 resize-none focus:outline-none focus:border-primary/50 transition-colors"
                  rows={2}
                  placeholder="Dars bo'yicha savolingiz bormi?"
                />
                <button
                  onClick={handleQuestionSubmit}
                  className="absolute bottom-3 right-3 px-4 py-1 rounded-lg bg-primary hover:bg-primary/80 text-white text-xs font-bold transition-colors"
                >
                  Yuborish
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        )}
        </AnimatePresence>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-8 h-24 bg-[#1a1c2e] border border-white/10 border-l-0 rounded-r-2xl flex flex-col items-center justify-center hover:bg-indigo-600 transition-all group shadow-2xl"
          title={isSidebarOpen ? "Videoni yopish" : "Videoni ochish"}
        >
          <div className="w-1 h-8 bg-white/10 group-hover:bg-white/40 rounded-full mb-1 transition-colors" />
          <IoChevronForward className={`transition-transform duration-500 text-white/50 group-hover:text-white ${isSidebarOpen ? 'rotate-180' : ''}`} size={14} />
          <div className="w-1 h-8 bg-white/10 group-hover:bg-white/40 rounded-full mt-1 transition-colors" />
        </button>

        {/* ── RIGHT PANEL: Code Editor + Terminal ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Editor header */}
          <div className="h-10 shrink-0 bg-[#1a1c2e] border-b border-white/5 flex items-center justify-between px-3">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 border-b-0 px-3 py-1 rounded-t-lg -mb-[1px]">
                <FaCode className={category === 'html' ? 'text-orange-500' : category === 'javascript' ? 'text-blue-400' : 'text-yellow-400'} size={12} />
                <span className="text-[11px] text-zinc-300 font-medium">{fileName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCode(DEFAULT_CODES[category] || DEFAULT_CODES.html)}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-white transition-colors"
              >
                <IoRefresh size={12} />
                Reset
              </button>
              <div className="w-px h-3 bg-white/10 mx-1" />
              <button 
                onClick={() => setLayoutMode(layoutMode === 'vertical' ? 'horizontal' : 'vertical')}
                className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/5 font-bold"
                title="Layoutni o'zgartirish"
              >
                <div className={`w-3 h-3 border border-current rounded-[2px] relative overflow-hidden ${layoutMode === 'horizontal' ? 'flex' : 'flex-col'}`}>
                   <div className="flex-1 bg-current opacity-20 border-r border-current" />
                   <div className="flex-1" />
                </div>
                {layoutMode === 'vertical' ? 'Yonma-yon' : 'Ustma-ust'}
              </button>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <IoSettings size={14} />
              </button>
            </div>
          </div>

          <div className={`flex-1 flex ${layoutMode === 'horizontal' ? 'flex-row' : 'flex-col'} overflow-hidden`}>
            
            {/* Editor Area */}
            <div className={`${layoutMode === 'horizontal' ? 'w-1/2 border-r' : 'flex-1'} bg-[#1e1e1e] overflow-hidden border-white/5`}>
              <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val ?? '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16 },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Terminal / Preview */}
          <div className={`${layoutMode === 'horizontal' ? 'w-1/2' : (isOutputExpanded ? 'h-[65%]' : 'h-11')} transition-all duration-300 shrink-0 flex flex-col border-t border-white/5 bg-[#080914] shadow-[0_-10px_30px_rgba(0,0,0,0.3)]`}>
            <div className="h-11 shrink-0 bg-[#10121f] border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-6 h-full">
                <button 
                  onClick={() => setOutputTab('terminal')}
                  className={`flex items-center gap-2 h-full px-1 border-b-2 transition-all relative ${outputTab === 'terminal' ? 'border-primary text-white font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                >
                  <FaTerminal className="text-[10px]" />
                  <span className="text-[10px] uppercase tracking-widest">Terminal</span>
                  {outputTab === 'terminal' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                {category === 'html' && (
                  <button 
                    onClick={() => setOutputTab('preview')}
                    className={`flex items-center gap-2 h-full px-1 border-b-2 transition-all relative ${outputTab === 'preview' ? 'border-primary text-white font-bold' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <IoEye className="text-[10px]" />
                    <span className="text-[10px] uppercase tracking-widest">Preview</span>
                    {outputTab === 'preview' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOutput([])}
                  className="text-zinc-600 hover:text-zinc-300 transition-colors"
                  title="Tozalash"
                >
                  <IoRefresh size={12} />
                </button>
                <div className="w-px h-3 bg-white/10 mx-1" />
                <button
                  onClick={() => setIsOutputExpanded(!isOutputExpanded)}
                  className="text-zinc-600 hover:text-white transition-all hover:scale-110 active:scale-95"
                  title={isOutputExpanded ? "Yopish" : "Ochish"}
                >
                  <IoChevronUp className={`transition-transform duration-300 ${isOutputExpanded ? 'rotate-180' : ''}`} size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 px-4 py-3 overflow-hidden font-mono text-xs relative">
              {outputTab === 'terminal' ? (
                <div ref={terminalRef} className="absolute inset-0 px-4 py-3 overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {output.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={
                          line.type === 'error'
                            ? 'text-red-400 mb-0.5'
                            : line.type === 'info'
                            ? 'text-zinc-500 mb-0.5'
                            : 'text-green-400 mb-0.5'
                        }
                      >
                        {line.type === 'log' && <span className="text-zinc-600 mr-2">»</span>}
                        {line.content}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isRunning && (
                    <span className="text-zinc-500 animate-pulse text-xs">Bajarilmoqda...</span>
                  )}
                  {isPyodideLoading && (
                    <span className="text-indigo-400 animate-pulse text-xs">Python muhiti yuklanmoqda...</span>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col bg-[#0f172a] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  {/* Browser Header Emulator */}
                  <div className="h-8 shrink-0 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <div className="flex-1 max-w-[300px] mx-4 h-5 bg-black/20 rounded-md flex items-center px-3">
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-indigo-500/20" />
                      </div>
                    </div>
                    <div className="w-10" />
                  </div>
                  
                  {/* Iframe */}
                  <div className="flex-1 bg-white overflow-hidden">
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-none"
                      title="HTML Preview"
                      scrolling="yes"
                      style={{ minHeight: '100%', display: 'block' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RUN CODE button */}
            <div className="px-3 pb-3 shrink-0">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-black text-sm tracking-widest shadow-lg shadow-green-500/20 transition-all"
              >
                <IoPlay size={16} />
                RUN CODE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
      {/* Subscription Overlay */}
      {!isSubscribed && (
        <div className="absolute inset-x-0 bottom-0 top-14 z-[100] backdrop-blur-md bg-black/40 flex items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1c2e] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
              <IoLockClosed size={32} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Playground Shartlari</h2>
            <p className="text-zinc-400 mb-8">
              Playground&apos;dan foydalanish va kod yozishni mashq qilish uchun Telegram va Instagram kanallarimizga obuna bo&apos;lishingiz kerak.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none rounded-full px-10 h-14 font-bold text-lg shadow-xl shadow-indigo-500/20 w-full"
            >
              Obunani tasdiqlash
            </button>
            <Link 
              href={`/videos/${id}`}
              className="mt-4 inline-block text-zinc-500 hover:text-white transition-colors text-sm font-medium"
            >
              ← Darsga qaytish
            </Link>
          </motion.div>
        </div>
      )}

      {/* Instagram Verification Modal */}
      <SubscriptionGate
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        videoId={id}
      />
    </div>
  );
}
