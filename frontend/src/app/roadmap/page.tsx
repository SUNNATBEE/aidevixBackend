'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { IoArrowForward, IoCheckmarkCircle, IoLockClosed, IoSchool } from 'react-icons/io5';
import axiosInstance from '@/api/axiosInstance';

const ROADMAP_COLORS = [
  { color: 'from-blue-500/20 to-cyan-500/20', borderColor: 'border-blue-500/30', accentColor: 'text-blue-400', icon: '🖥️' },
  { color: 'from-emerald-500/20 to-green-500/20', borderColor: 'border-emerald-500/30', accentColor: 'text-emerald-400', icon: '⚙️' },
  { color: 'from-violet-500/20 to-purple-500/20', borderColor: 'border-violet-500/30', accentColor: 'text-violet-400', icon: '🤖' },
  { color: 'from-amber-500/20 to-orange-500/20', borderColor: 'border-amber-500/30', accentColor: 'text-amber-400', icon: '📘' },
];

export default function RoadmapPage() {
  const { isDark } = useTheme();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const bgClass = isDark ? 'bg-[#0A0E1A] text-white' : 'bg-slate-50 text-slate-900';
  const cardClass = isDark ? 'bg-[#0d1224]/80 border-white/5' : 'bg-white border-slate-200';

  useEffect(() => {
    axiosInstance.get('public/roadmap')
      .then(({ data }) => {
        const rows = (data?.data?.paths || []).map((p: any, idx: number) => ({
          ...ROADMAP_COLORS[idx % ROADMAP_COLORS.length],
          ...p,
        }));
        setPaths(rows);
      })
      .catch(() => setPaths([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${bgClass}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-4 px-4 py-2 rounded-full border ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
            <IoSchool /> O'rganish yo'llari
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
            Learning{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Roadmap
            </span>
          </h1>
          <p className={`max-w-xl mx-auto text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Qaysi yo'nalishda rivojlanmoqchisiz? Quyidagi 3 ta yo'ldan birini tanlang va qadamba-qadam o'rganing.
          </p>
        </motion.div>

        {/* Path selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {paths.map((path, i) => (
            <motion.button
              key={path.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
              className={`relative text-left rounded-3xl border p-6 transition-all duration-300 bg-gradient-to-br ${path.color} ${path.borderColor} ${
                selectedPath === path.id ? 'scale-[1.02] shadow-2xl' : 'hover:scale-[1.01]'
              } ${cardClass}`}
            >
              <div className="text-4xl mb-4">{path.icon}</div>
              <h2 className={`text-xl font-black mb-2 ${path.accentColor}`}>{path.title}</h2>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {path.description}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs font-bold ${path.accentColor}`}>{path.steps.length} bosqich</span>
                <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>•</span>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {path.steps.reduce((s, p) => s + p.xp, 0).toLocaleString()} XP
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Steps detail */}
          {paths.map((path) => selectedPath === path.id && (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className={`text-2xl font-black mb-8 flex items-center gap-3`}>
              <span>{path.icon}</span>
              <span className={path.accentColor}>{path.title}</span> — Bosqichlar
            </h2>

            <div className="relative">
              {/* Vertical connector */}
              <div className={`absolute left-6 top-8 bottom-8 w-0.5 ${isDark ? 'bg-white/5' : 'bg-slate-200'} hidden sm:block`} />

              <div className="space-y-4">
                {path.steps.map((step, i) => (
                  <motion.div
                    key={step.category}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative flex items-start gap-5 rounded-2xl border p-6 ${cardClass} sm:ml-8`}
                  >
                    {/* Step number circle */}
                    <div className={`absolute -left-[3.25rem] w-6 h-6 rounded-full border-2 ${path.borderColor} ${isDark ? 'bg-[#0d1224]' : 'bg-white'} hidden items-center justify-center sm:flex`}>
                      <span className={`text-[10px] font-black ${path.accentColor}`}>{i + 1}</span>
                    </div>

                    <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl bg-white/5 border border-white/10">
                      {step.icon === 'AI' ? <span className="text-sm font-black text-cyan-400">AI</span> : step.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{step.title}</h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${path.accentColor} bg-white/5`}>
                          {step.level}
                        </span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        +{step.xp} XP • {step.category} yo'nalish
                      </p>
                    </div>

                    <Link
                      href={`/courses?category=${step.category}`}
                      className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:-translate-x-0 hover:translate-y-0 hover:gap-3 ${path.accentColor} bg-white/5 border ${path.borderColor} hover:bg-white/10`}
                    >
                      Kurslar <IoArrowForward />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* CTA */}
        {!loading && paths.length === 0 && (
          <div className="text-center text-sm text-slate-500 mb-12">Roadmap ma'lumotlari vaqtincha mavjud emas</div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-center rounded-3xl border p-12 ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'}`}
        >
          <h2 className="text-3xl font-black mb-3">Hoziroq boshlang!</h2>
          <p className={`mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Kurslarni ko'ring, challenge qiling va leaderboard da yuqoriga ko'tariling.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/courses" className="px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl transition-colors">
              Kurslarni ko'rish
            </Link>
            <Link href="/challenges" className={`px-8 py-3.5 border font-bold rounded-2xl transition-colors ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
              Daily Challenge
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
