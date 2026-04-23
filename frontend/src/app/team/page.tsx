'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

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
      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        >
          {!imgError ? (
            <img
              src={`/team/${member.imageFile}`}
              alt={member.name}
              className="h-full w-full object-cover object-top"
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
      className={`relative flex items-center gap-5 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content */}
      <div
        className={`flex-1 rounded-2xl border border-white/[0.07] p-4 ${isLeft ? 'text-right' : 'text-left'}`}
        style={{ background: `linear-gradient(135deg, ${member.accentBg}, rgba(12,16,24,0.96))` }}
      >
        <div className={`flex items-center gap-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
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

      <div className="flex-1" />
    </motion.div>
  );
}

export default function TeamPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.35, 0.92], ['0%', '100%']);
  const smoothLine = useSpring(lineHeight as any, { stiffness: 55, damping: 18 });

  const avgAge = (MEMBERS.reduce((s, m) => s + m.age, 0) / MEMBERS.length).toFixed(1);
  const techCount = new Set(MEMBERS.flatMap((m) => m.stack)).size;

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-[#060a12] text-white">
      {/* fixed ambient bg */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-[-18%] top-[-8%] h-[560px] w-[560px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute right-[-12%] top-[18%] h-[480px] w-[480px] rounded-full bg-cyan-500/7 blur-[110px]" />
        <div className="absolute bottom-[8%] left-[28%] h-[420px] w-[420px] rounded-full bg-amber-500/6 blur-[100px]" />
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        {/* top label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            Aidevix Development Team
          </span>
        </motion.div>

        {/* heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[1.06] tracking-[-0.04em]"
        >
          Platformani yozgan
          <br />
          <span className="bg-gradient-to-r from-indigo-300 via-cyan-200 to-amber-200 bg-clip-text text-transparent">
            yosh dasturchilar
          </span>
        </motion.h1>

        {/* sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-5 max-w-lg text-base leading-relaxed text-slate-400"
        >
          O&apos;rtacha yoshi {avgAge}. Hammasi haqiqiy production kodini yozgan. Quyida har birining Aidevix'ga qo&apos;shgan hissasi.
        </motion.p>

        {/* stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {[
            { label: 'Ishtirokchi', value: String(MEMBERS.length) },
            { label: "O'rtacha yosh", value: avgAge },
            { label: 'Texnologiyalar', value: `${techCount}+` },
            { label: 'Deploy', value: 'Production' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-4 backdrop-blur-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
              <p className="mt-1 text-[1.6rem] font-black leading-none text-white">{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* divider */}
        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ── CARDS ── */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600"
        >
          Jamoa a&apos;zolari — {MEMBERS.length} kishi
        </motion.p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {MEMBERS.map((m, i) => (
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
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            🗺 Loyiha yo&apos;l xaritasi
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-[2.4rem]">
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
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2">
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
            {MEMBERS.map((m, i) => (
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
