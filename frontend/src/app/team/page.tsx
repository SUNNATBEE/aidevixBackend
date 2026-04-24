'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import axiosInstance from '@/api/axiosInstance';

type TeamMember = {
  id: string;
  name: string;
  age: number;
  stack: string[];
  contribution: string;
  imageFile: string;
  badge: string;
  color: string;
  accentBg: string;
  emoji: string;
  roadmapRole: string;
  objectPos?: string;
  portfolioUrl?: string;
};

const MEMBERS: TeamMember[] = [
  {
    id: 'sardor',
    name: 'Sardor',
    age: 15,
    stack: ['Next.js 14', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'React Native', 'Tailwind CSS', 'Railway', 'Vercel'],
    contribution:
      'Aidevix loyihasining asoschisi va texnik rahbari. Butun full-stack arxitekturani loyihalagan: Railway (backend) + Vercel (frontend) production infratuzilmasini qurib ishga tushirgan. JWT cookie auth, Mongoose sxemalari, Swagger API dokumentatsiyasi va CI/CD pipeline — barchasi uning qo\'li bilan yozilgan.',
    imageFile: 'Sardor.jpg',
    badge: 'Founder · Team Lead',
    color: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.15)',
    emoji: '🚀',
    roadmapRole: 'Architecture & Production Deploy',
    objectPos: '50% 20%',
    portfolioUrl: 'https://sardoruz.vercel.app',
  },
  {
    id: 'firdavs',
    name: 'Firdavs',
    age: 16,
    stack: ['React 18', 'TypeScript', 'Next.js 14', 'Redux Toolkit', 'Axios', 'Tailwind CSS'],
    contribution:
      'Platforma autentifikatsiya tizimini noldan qurgan. Cookie-based JWT sessiyasi, login/register formlar, ProtectedRoute va AdminRoute komponentlari, email orqali parolni tiklash va kunlik mukofot modali — hammasi Firdavsning ishi.',
    imageFile: 'Firdavs.jpg',
    badge: 'Auth Specialist',
    color: '#6366f1',
    accentBg: 'rgba(99,102,241,0.15)',
    emoji: '🔐',
    roadmapRole: 'Auth & Session System',
    objectPos: '50% 15%',
  },
  {
    id: 'abduvoris',
    name: 'Abduvoris',
    age: 16,
    stack: ['React 18', 'TypeScript', 'Next.js 14', 'Bunny.net SDK', 'HLS.js', 'Redux Toolkit'],
    contribution:
      'Video platformasining asosini yaratgan. Bunny.net Stream bilan token-autentifikatsiyali HLS video pleer, videolar ichidagi quiz tizimi, qidiruv va filtrlash — bular Abduvorisning hissasi. Video yuklanish skeletoni va progress tracking ham uniki.',
    imageFile: 'Abduvoris.jpg',
    badge: 'Video Engineer',
    color: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.15)',
    emoji: '🎬',
    roadmapRole: 'Video Platform & HLS Player',
    objectPos: '50% 20%',
  },
  {
    id: 'doniyor',
    name: 'Doniyor',
    age: 16,
    stack: ['React 18', 'TypeScript', 'Next.js 14', 'Node.js', 'React Native', 'Redux Toolkit', 'Tailwind CSS'],
    contribution:
      'Kurslar katalogini to\'liq qurgan. Kategoriya va narx filtrlar, skeleton loading, yulduzcha reyting tizimi, kursga yozilish oqimi va wishlist — bular Doniyorning loyihaga qo\'shgan hissasi. React Native versiyasi uchun ham komponentlar yozgan.',
    imageFile: 'Doniyor.jpg',
    badge: 'Course Architect',
    color: '#10b981',
    accentBg: 'rgba(16,185,129,0.15)',
    emoji: '📚',
    roadmapRole: 'Course Catalog & Enrollment',
    objectPos: '50% 20%',
  },
  {
    id: 'suhrob',
    name: 'Suhrob',
    age: 14,
    stack: ['React 18', 'TypeScript', 'Next.js 14', 'Node.js', 'React Native', 'Redux Toolkit'],
    contribution:
      'XP asosidagi liderlar jadvalini yaratgan. AMATEUR dan LEGEND gacha bo\'lgan rank tizimi, AI Stack ikonlari (🤖⚡🐙), haftalik statistika va foydalanuvchi pozitsiyasini real vaqtda kuzatish — bu Suhrob yaratgan tizim.',
    imageFile: 'Suhrob.jpg',
    badge: 'Ranking Builder',
    color: '#ec4899',
    accentBg: 'rgba(236,72,153,0.15)',
    emoji: '🏆',
    roadmapRole: 'Leaderboard & XP Ranking',
    objectPos: '50% 20%',
  },
  {
    id: 'qudrat',
    name: 'Qudrat',
    age: 14,
    stack: ['React 18', 'TypeScript', 'Next.js 14', 'GSAP 3', 'Three.js', 'Framer Motion', 'Node.js'],
    contribution:
      'Platforma vizual tajribasini butunlay o\'zgartirgan. GSAP bilan 3D yuklanish ekrani, sahifalar orasidagi silliq o\'tishlar, Three.js fon effektlari va scroll animatsiyalari — bular Qudratning qo\'li. Micro-interaction va UX polishing ham uning ishi.',
    imageFile: 'Qudrat.jpg',
    badge: 'Motion Creator',
    color: '#a855f7',
    accentBg: 'rgba(168,85,247,0.15)',
    emoji: '✨',
    roadmapRole: 'Animations & Visual UX',
    objectPos: '50% 20%',
  },
];

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

function TiltCard({ member, index }: { member: TeamMember; index: number }) {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 12, y: -x * 12 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 6 : 0}px) scale(${hovered ? 1.02 : 1})`,
        transition: hovered ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        transformStyle: 'preserve-3d',
      }}
      className="relative cursor-default overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0c1018]"
    >
      {/* hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] transition-opacity duration-400"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(ellipse at 50% -10%, ${member.accentBg}, transparent 65%)`,
          boxShadow: `inset 0 1px 0 ${member.color}30`,
        }}
      />
      {/* hover border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] transition-opacity duration-400"
        style={{ opacity: hovered ? 1 : 0, border: `1px solid ${member.color}40` }}
      />

      {/* Photo */}
      <div className="relative h-72 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        >
          {!imgError ? (
            <img
              src={`/team/${member.imageFile}`}
              alt={member.name}
              className="h-full w-full object-cover"
              style={{ objectPosition: member.objectPos ?? '50% 20%' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: `radial-gradient(circle at 40% 30%, ${member.color}25, #0c1018 70%)` }}
            >
              <span
                className="select-none text-8xl font-black tracking-tight"
                style={{ color: `${member.color}50` }}
              >
                {getInitials(member.name)}
              </span>
            </div>
          )}
        </div>

        {/* bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1018] via-[#0c1018]/30 to-transparent" />

        {/* badge */}
        <div className="absolute left-4 top-4">
          <span
            className="rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.06em]"
            style={{
              background: `${member.color}20`,
              color: member.color,
              border: `1px solid ${member.color}35`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {member.badge}
          </span>
        </div>

        {/* emoji */}
        <div className="absolute right-4 top-4 text-2xl drop-shadow-lg">{member.emoji}</div>
      </div>

      {/* Body */}
      <div className="p-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[22px] font-black tracking-tight text-white">{member.name}</h2>
          <span className="mt-0.5 shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-slate-400">
            {member.age} yosh
          </span>
        </div>

        <p className="mt-3 text-sm leading-[1.7] text-slate-400">{member.contribution}</p>

        {member.portfolioUrl && (
          <motion.a
            href={member.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                `0 0 0 ${member.color}00`,
                `0 0 0 6px ${member.color}18`,
                `0 0 0 ${member.color}00`,
              ],
            }}
            transition={{
              boxShadow: { duration: 2.1, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            className="group relative mt-4 inline-flex items-center gap-2 overflow-hidden rounded-xl border px-3.5 py-2 text-xs font-bold uppercase tracking-[0.08em]"
            style={{
              borderColor: `${member.color}60`,
              color: '#fff',
              background: `linear-gradient(90deg, ${member.color}cc, ${member.color}88)`,
            }}
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.22), transparent)' }} />
            <span className="relative">Portfolio</span>
            <motion.span
              aria-hidden
              className="relative"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↗
            </motion.span>
          </motion.a>
        )}

        {/* Stack pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {member.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-[0.08em]"
              style={{
                background: `${member.color}14`,
                color: member.color,
                border: `1px solid ${member.color}28`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* dot grid depth layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
    </motion.div>
  );
}

function RoadmapNode({ member, index }: { member: TeamMember; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-center gap-3 sm:gap-5 flex-col sm:${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content */}
      <div
        className={`w-full sm:flex-1 rounded-2xl border border-white/[0.07] p-3 sm:p-4 text-left sm:${isLeft ? 'text-right' : 'text-left'}`}
        style={{ background: `linear-gradient(135deg, ${member.accentBg}, rgba(12,16,24,0.96))` }}
      >
        <div className={`flex items-center gap-2 justify-start sm:${isLeft ? 'justify-end' : 'justify-start'}`}>
          <span className="text-lg">{member.emoji}</span>
          <span className="font-bold text-white">{member.name}</span>
          <span className="text-xs text-slate-500">· {member.age} yosh</span>
        </div>
        <p
          className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: member.color }}
        >
          {member.roadmapRole}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {member.contribution}
        </p>
      </div>

      {/* Node circle */}
      <div className="relative z-10 shrink-0">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${member.color}ee, ${member.color}77)`,
            boxShadow: `0 0 28px ${member.color}55, 0 0 8px ${member.color}33`,
          }}
        >
          {member.emoji}
        </div>
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-[0.15]"
          style={{ background: member.color }}
        />
      </div>

      <div className="hidden sm:block flex-1" />
    </motion.div>
  );
}

export default function TeamPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [members, setMembers] = useState<TeamMember[]>(MEMBERS);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.35, 0.92], ['0%', '100%']);
  const smoothLine = useSpring(lineHeight as any, { stiffness: 55, damping: 18 });

  useEffect(() => {
    axiosInstance.get('public/team')
      .then(({ data }) => {
        const rows = (data?.data?.members || []).map((m: any, i: number) => ({
          id: m.id,
          name: m.name || m.username || `Member ${i + 1}`,
          age: Math.max(14, Math.min(30, 16 + (m.level || 1) % 10)),
          stack: (m.stack && m.stack.length ? m.stack : ['JavaScript', 'React', 'Node.js']).slice(0, 8),
          contribution: `${(m.username || m.name)} platformada faol contributor. XP: ${m.xp || 0}, level: ${m.level || 1}, streak: ${m.streak || 0}.`,
          imageFile: '',
          badge: `${String(m.role || 'member').toUpperCase()} · Level ${m.level || 1}`,
          color: ['#f59e0b', '#6366f1', '#06b6d4', '#10b981', '#ec4899', '#a855f7'][i % 6],
          accentBg: ['rgba(245,158,11,0.15)', 'rgba(99,102,241,0.15)', 'rgba(6,182,212,0.15)', 'rgba(16,185,129,0.15)', 'rgba(236,72,153,0.15)', 'rgba(168,85,247,0.15)'][i % 6],
          emoji: ['🚀', '🔐', '🎬', '📚', '🏆', '✨'][i % 6],
          roadmapRole: `${m.role || 'Member'} · Dynamic profile`,
          objectPos: '50% 20%',
          portfolioUrl: undefined,
        }));
        if (rows.length) setMembers(rows);
      })
      .catch(() => {});
  }, []);

  const avgAge = (members.reduce((s, m) => s + m.age, 0) / Math.max(1, members.length)).toFixed(1);
  const techCount = new Set(members.flatMap((m) => m.stack)).size;

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-[#060a12] text-white">
      {/* fixed ambient bg */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-[-18%] top-[-8%] h-[560px] w-[560px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute right-[-12%] top-[18%] h-[480px] w-[480px] rounded-full bg-cyan-500/7 blur-[110px]" />
        <div className="absolute bottom-[8%] left-[28%] h-[420px] w-[420px] rounded-full bg-amber-500/6 blur-[100px]" />
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 overflow-hidden">
        {/* hero bg overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.22),transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8">
          {/* badge */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-indigo-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
              Aidevix Development Team · 2025
            </span>
          </div>

          {/* heading — 2 clear lines */}
          <h1 className="mt-5 max-w-3xl font-black leading-[1.08] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(1.8rem, 8.8vw, 4rem)' }}>
            <span className="text-white">Platformani yaratgan</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #a5b4fc 0%, #67e8f9 45%, #fcd34d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              yosh dasturchilar
            </span>
          </h1>

          {/* description */}
          <p className="mt-4 max-w-xl text-sm sm:text-[15px] leading-relaxed text-slate-400">
            O&apos;rtacha yoshi {avgAge}. Har biri haqiqiy production kodini yozgan. Quyida
            har birining Aidevix&apos;ga qo&apos;shgan hissasi va texnologik steki.
          </p>

          {/* stats grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Ishtirokchi', value: `${members.length}`, icon: '👥' },
              { label: "O'rtacha yosh", value: avgAge, icon: '🎂' },
              { label: 'Texnologiyalar', value: `${techCount}+`, icon: '⚡' },
              { label: 'Holat', value: 'Production', icon: '🚀' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{s.label}</p>
                </div>
                <p className="mt-2 text-[1.35rem] sm:text-[1.75rem] font-black leading-none text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* bottom divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ── CARDS ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600"
        >
          Jamoa a&apos;zolari — {members.length} kishi
        </motion.p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((m, i) => (
            <TiltCard key={m.id} member={m} index={i} />
          ))}
        </div>
      </section>

      {/* ── 3D ROADMAP ── */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 pb-32 sm:px-6 lg:px-8">
        {/* section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-14 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-amber-300">
            🗺 Loyiha yo&apos;l xaritasi
          </span>
          <h2 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight sm:text-[2.4rem]">
            Har bir modul —
            <span className="block bg-gradient-to-r from-amber-300 to-orange-200 bg-clip-text text-transparent">
              bitta o&apos;quvchi
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-slate-500">
            Aidevix'ning har bir sahifasi biror o&apos;quvchi tomonidan yozilgan. Bu — ularning yo&apos;li.
          </p>
        </motion.div>

        {/* road container */}
        <div className="relative" style={{ perspective: '1000px' }}>
          {/* vertical line */}
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 hidden sm:block">
            <div className="absolute inset-0 bg-white/[0.06]" />
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                height: smoothLine,
                background: 'linear-gradient(to bottom, #6366f1, #06b6d4 45%, #10b981 70%, #f59e0b)',
                boxShadow: '0 0 10px rgba(99,102,241,0.5)',
              }}
            />
          </div>

          <div className="relative flex flex-col gap-7 py-2">
            {members.map((m, i) => (
              <RoadmapNode key={m.id} member={m} index={i} />
            ))}
          </div>
        </div>

        {/* finish */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', boxShadow: '0 0 40px rgba(99,102,241,0.45)' }}
          >
            🌐
          </div>
          <p className="mt-1 text-sm font-bold text-white tracking-tight">aidevix.uz</p>
          <p className="text-xs text-slate-500">Production · Hammasi bir loyihada birlashdi</p>
        </motion.div>
      </section>
    </main>
  );
}
