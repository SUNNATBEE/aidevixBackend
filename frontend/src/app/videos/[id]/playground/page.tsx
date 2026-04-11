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
  IoSettings,
} from 'react-icons/io5';
import { FaTerminal, FaCode, FaBook } from 'react-icons/fa';
import { BsLightningChargeFill } from 'react-icons/bs';
import { useVideos } from '@hooks/useVideos';
import { useUserStats } from '@hooks/useUserStats';
import { selectIsLoggedIn } from '@store/slices/authSlice';
import { userApi } from '@/api/userApi';
import { videoApi } from '@/api/videoApi';

interface OutputLine {
  type: 'log' | 'error' | 'info';
  content: string;
}

const DEFAULT_CODE = `# O'zgaruvchilar bilan ishlash # Vazifa:
# O'zgaruvchiga qiymat bering va uni ekranga
chiqaring def salom_ber(ism): xabar = f"Salom,
{ism}! Dasturlashga xush kelibsiz." return xabar if
__name__ == "__main__": # O'zgaruvchini yarating
foydalanuvchi = "O'quvchi" # Funksiyani chaqiring
natija = salom_ber(foydalanuvchi) print(natija) #
Sonli o'zgaruvchilar yosh = 25 bal = 95.5
print(f"Yosh: {yosh}, Bal: {bal}")
`;

export default function VideoPlaygroundPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { current: video, videoLink, loading, fetchById } = useVideos();
  const { xp } = useUserStats();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [activeTab, setActiveTab] = useState<'courses' | 'playground'>('playground');
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [xpAdded, setXpAdded] = useState(false);
  const [question, setQuestion] = useState('');
  const watchedSecondsRef = useRef<number>(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) fetchById(id);
  }, [id]);

  // Track watch progress every 10s and save to backend
  useEffect(() => {
    if (!isLoggedIn || !id) return;
    progressTimerRef.current = setInterval(() => {
      watchedSecondsRef.current += 10;
      videoApi.saveProgress(id, watchedSecondsRef.current).catch(() => {});
    }, 10_000);
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [id, isLoggedIn]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const runCode = () => {
    setIsRunning(true);
    const logs: OutputLine[] = [{ type: 'info', content: '$ python main.py' }];
    const oldLog = console.log;
    const oldError = console.error;

    console.log = (...args: unknown[]) =>
      logs.push({ type: 'log', content: args.join(' ') });
    console.error = (...args: unknown[]) =>
      logs.push({ type: 'error', content: args.join(' ') });

    setTimeout(() => {
      try {
        // eslint-disable-next-line no-eval
        eval(code.replace(/print\(/g, 'console.log(').replace(/def |if __name__.*:/g, '// '));
      } catch (err: unknown) {
        const e = err as Error;
        logs.push({ type: 'error', content: e.message });
      } finally {
        console.log = oldLog;
        console.error = oldError;
        setOutput(logs);
        setIsRunning(false);
      }
    }, 400);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0e1a]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  const courseTitle = video?.course?.title || 'KURS';
  const videoTitle = video?.title || 'Dars';

  return (
    <div className="flex flex-col h-screen bg-[#0d0e1a] overflow-hidden text-white">

      {/* ── TOP NAVBAR ── */}
      <header className="h-14 shrink-0 border-b border-white/5 bg-[#10121f] flex items-center justify-between px-5">
        {/* Left: Logo + Tabs */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary text-xs font-black">A</span>
            </div>
            <span className="font-black text-lg tracking-tight text-white">Aidevix</span>
          </Link>

          <nav className="flex items-center bg-black/30 rounded-xl p-1 border border-white/5">
            <Link
              href={`/videos/${id}`}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'courses'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-zinc-500 hover:text-white'
              }`}
              onClick={() => setActiveTab('courses')}
            >
              <FaBook size={10} />
              KURSLAR
            </Link>
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-2 px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'playground'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              <FaCode size={10} />
              PLAYGROUND
            </button>
          </nav>
        </div>

        {/* Right: XP + Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl">
            <BsLightningChargeFill className="text-yellow-400 text-xs" />
            <span className="text-yellow-400 font-bold text-sm">
              {(xp ?? 1240).toLocaleString()} XP
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-700 border border-white/10 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT PANEL: Video + Info ── */}
        <div className="w-[56%] flex flex-col border-r border-white/5 overflow-y-auto">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 px-5 pt-4 pb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 shrink-0">
            <span className="hover:text-white cursor-pointer transition-colors">{courseTitle}</span>
            <IoChevronForward size={10} />
            <span className="text-white">{videoTitle}</span>
          </div>

          {/* Video Player — Bunny.net iframe */}
          <div className="mx-5 rounded-2xl overflow-hidden bg-black aspect-video relative border border-white/5 shadow-xl shrink-0">
            {videoLink?.embedUrl ? (
              <iframe
                src={videoLink.embedUrl}
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
          <div className="flex items-start justify-between px-5 pt-4 pb-2 shrink-0">
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">{videoTitle}</h1>
              <p className="text-xs text-zinc-500 mt-1">
                {video?.description || 'Ushbu darsda Python dasturlash tilidagi asosiy ma\'lumot turlarini o\'rganamiz.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3 mt-0.5">
              {xpAdded && (
                <span className="badge badge-success text-[10px] font-bold px-2">✓ +50 XP</span>
              )}
              <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <IoBookmark size={14} className="text-zinc-400" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <IoShareSocial size={14} className="text-zinc-400" />
              </button>
              {!xpAdded ? (
                <button
                  onClick={handleMarkWatched}
                  className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold hover:bg-green-500/20 transition-colors whitespace-nowrap"
                >
                  ✓ Yakunladim
                </button>
              ) : (
                <span className="badge badge-success text-[10px] font-bold px-2">✓ +50 XP</span>
              )}
            </div>
          </div>

          {/* Resources + Next Lesson */}
          <div className="flex gap-3 px-5 pb-3 shrink-0">
            {/* Resources */}
            <div className="flex-1 bg-[#13152a] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Resurslar</p>
              <div className="space-y-2">
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
            <div className="flex-1 bg-[#13152a] border border-white/5 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Keyingi Dars</p>
              <div className="flex items-start gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
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
        </div>

        {/* ── RIGHT PANEL: Code Editor + Terminal ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Editor header */}
          <div className="h-10 shrink-0 bg-[#1a1c2e] border-b border-white/5 flex items-center justify-between px-3">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 border-b-0 px-3 py-1 rounded-t-lg -mb-[1px]">
                <FaCode className="text-yellow-400 text-[10px]" />
                <span className="text-[11px] text-zinc-300 font-medium">main.py</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCode(DEFAULT_CODE)}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-white transition-colors"
              >
                <IoRefresh size={12} />
                Reset
              </button>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <IoSettings size={14} />
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 bg-[#1e1e1e] overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="python"
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

          {/* Terminal */}
          <div className="h-[200px] shrink-0 flex flex-col border-t border-white/5 bg-[#080914]">
            <div className="h-9 shrink-0 bg-[#10121f] border-b border-white/5 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <FaTerminal className="text-zinc-500 text-[10px]" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Terminal</span>
              </div>
              <button
                onClick={() => setOutput([])}
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <IoRefresh size={12} />
              </button>
            </div>

            <div className="flex-1 px-4 py-3 overflow-y-auto font-mono text-xs">
              <AnimatePresence>
                {output.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      line.type === 'error'
                        ? 'text-red-400 mb-0.5'
                        : line.type === 'info'
                        ? 'text-zinc-500 mb-0.5'
                        : 'text-green-400 mb-0.5'
                    }
                  >
                    {line.content}
                  </motion.div>
                ))}
              </AnimatePresence>
              {isRunning && (
                <span className="text-zinc-500 animate-pulse text-xs">Bajarilmoqda...</span>
              )}
              <div ref={terminalEndRef} />
              <span className="inline-block w-2 h-3.5 bg-zinc-400 animate-pulse ml-0.5 align-middle" />
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
  );
}
