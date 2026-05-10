'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IoRocket, IoHeart, IoGlobe, IoSchool, IoCode, IoShieldCheckmark,
  IoPeople, IoTrophy, IoSparkles, IoArrowForward,
} from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';

type Stats = {
  students?: number;
  videos?: number;
  mentors?: number;
  rating?: number;
};

const VALUES = [
  {
    icon: <IoGlobe />,
    title: 'O\'zbek tilida',
    text: 'Hamma kontent o\'zbek tilida — yangi boshlovchilar uchun ona tilida o\'rganish qulay.',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <IoSparkles />,
    title: 'AI birinchi',
    text: 'Claude, Cursor, Copilot — biz an\'anaviy dasturlashdan tashqari, AI tools bilan ishlashni o\'rgatamiz.',
    accent: 'from-indigo-500 to-purple-500',
  },
  {
    icon: <IoCode />,
    title: 'Amaliyot bilan',
    text: 'Har bir kursda real loyihalar, AI Code Playground, prompt library — bilim emas, ko\'nikma beramiz.',
    accent: 'from-pink-500 to-red-500',
  },
  {
    icon: <IoShieldCheckmark />,
    title: 'Tartibli o\'sish',
    text: 'XP, daily challenges va leaderboard — har kungi kichik qadamlar katta natija beradi.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    icon: <IoPeople />,
    title: 'Hamjamiyat',
    text: 'Telegram kanal, Discord, real-time leaderboard. Yolg\'iz emassiz.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <IoTrophy />,
    title: 'Sertifikat va karyera',
    text: 'Tugatgan har bir kurs uchun verified sertifikat. Ish topishga yordam — Careers bo\'limi.',
    accent: 'from-yellow-500 to-amber-500',
  },
];

const TIMELINE = [
  { year: '2025 Q3', title: 'G\'oya tug\'ildi', text: 'O\'zbek dasturchilariga AI tools bo\'yicha to\'liq qo\'llanma yo\'qligini ko\'rdik.' },
  { year: '2025 Q4', title: 'Birinchi kurslar', text: 'Bepul kurslar va Telegram kanal ishga tushdi.' },
  { year: '2026 Q1', title: 'Platforma launch', text: 'aidevix.uz to\'liq platforma — XP, sertifikat, Prompt Library.' },
  { year: '2026 Q2', title: 'Telegram Mini App + AI Playground', text: 'TMA, AI Code Playground va haftalik AI digest.' },
  { year: '2026+', title: 'Kelajak', text: 'Mobile app, live coding session, mentorship marketplace.' },
];

export default function AboutClient({ stats }: { stats: Stats | null }) {
  const { isDark } = useTheme();
  const bgClass = isDark ? 'bg-[#0A0E1A] text-white' : 'bg-slate-50 text-slate-900';
  const cardBg = isDark ? 'bg-[#0d1224]/70 border-white/5' : 'bg-white border-slate-200';
  const muted = isDark ? 'text-slate-400' : 'text-slate-600';

  const fmt = (n?: number) => (n || 0).toLocaleString();

  return (
    <div className={`min-h-screen pt-24 pb-20 ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">
            Biz haqimizda
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] mb-5">
            O'zbek dasturchilarining{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              yangi avlodi
            </span>
          </h1>
          <p className={`text-base sm:text-lg leading-relaxed ${muted}`}>
            Aidevix — O'zbekistondagi birinchi AI-first dasturlash platformasi.
            Biz dasturlashni nafaqat tushuntiramiz, balki Claude, Cursor va boshqa
            AI tools bilan <strong>10x tezroq</strong> ishlashni o'rgatamiz.
          </p>
        </motion.section>

        {/* Stats */}
        {stats && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-20"
          >
            {[
              { label: 'O\'quvchilar', value: fmt(stats.students), color: 'text-indigo-400' },
              { label: 'Video darslar', value: fmt(stats.videos), color: 'text-cyan-400' },
              { label: 'Mentorlar', value: fmt(stats.mentors), color: 'text-pink-400' },
              { label: 'O\'rtacha reyting', value: `${stats.rating || 0}/5`, color: 'text-yellow-400' },
            ].map((s, i) => (
              <div key={i} className={`rounded-3xl border p-5 sm:p-6 text-center ${cardBg}`}>
                <div className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className={`text-xs mt-1 uppercase tracking-wider ${muted}`}>{s.label}</div>
              </div>
            ))}
          </motion.section>
        )}

        {/* Mission */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">
                Bizning missiyamiz
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mb-5">
                Har bir o'zbek dasturchisi AI bilan ishlashga tayyor bo'lsin
              </h2>
              <p className={`text-base leading-7 ${muted}`}>
                AI dunyoni o'zgartirmoqda — va biz O'zbekistondagi har bir talaba, ishchi va
                ishbilarmonga shu yangi tilni ona tilida o'rgatishni xohlaymiz.
              </p>
              <p className={`text-base leading-7 mt-3 ${muted}`}>
                Maqsad: 2030 yilgacha O'zbekistonda 100,000+ AI-fluent dasturchi tayyorlash.
              </p>
            </div>

            <div className={`rounded-3xl border p-6 sm:p-8 ${cardBg} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 pointer-events-none" />
              <IoHeart className="text-4xl text-pink-400 mb-4 relative" />
              <blockquote className="relative">
                <p className={`text-lg leading-relaxed font-medium ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  "Bilim eski edi — endi vositalar bor. Biz vositalarni o'zbek tilida o'rgatib,
                  har bir talabani global standartga tayyorlaymiz."
                </p>
                <footer className="mt-5 text-sm">
                  <div className="font-bold">Aidevix jamoasi</div>
                  <div className={muted}>2026 yil missiyamiz</div>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">
              Bizning qiymatlarimiz
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight">
              Nima bilan farq qilamiz?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-3xl border p-6 ${cardBg}`}
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl text-white bg-gradient-to-br ${v.accent} mb-4 text-xl`}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-base mb-2">{v.title}</h3>
                <p className={`text-sm leading-relaxed ${muted}`}>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">
              Bizning yo'limiz
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight">Aidevix qisqa tarixi</h2>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className={`absolute left-4 sm:left-1/2 -translate-x-px top-0 bottom-0 w-px ${
              isDark ? 'bg-white/10' : 'bg-slate-200'
            }`} />

            <div className="space-y-8">
              {TIMELINE.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.06 }}
                  className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-8 ${
                    i % 2 === 0 ? '' : 'sm:rtl-fix'
                  }`}
                >
                  <div className={`absolute left-4 sm:left-1/2 -translate-x-1/2 top-2 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 ring-4 ${
                    isDark ? 'ring-[#0A0E1A]' : 'ring-slate-50'
                  }`} />

                  <div className={`${i % 2 === 0 ? 'sm:text-right sm:pr-8' : 'sm:col-start-2 sm:pl-8'}`}>
                    <div className="inline-block text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">
                      {step.year}
                    </div>
                    <h3 className="font-bold text-base mb-1">{step.title}</h3>
                    <p className={`text-sm ${muted}`}>{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`rounded-3xl border p-8 sm:p-12 text-center ${cardBg} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 pointer-events-none" />
          <div className="relative">
            <IoRocket className="text-5xl mx-auto text-indigo-400 mb-4" />
            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight mb-3">
              Sayohatga qo'shiling
            </h2>
            <p className={`max-w-xl mx-auto text-base mb-6 ${muted}`}>
              Bepul ro'yxatdan o'ting va birinchi kursingizni boshlang. Aidevix sizni kutmoqda.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-shadow"
              >
                Bepul boshlash <IoArrowForward />
              </Link>
              <Link
                href="/courses"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border transition-colors ${
                  isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-100'
                }`}
              >
                <IoSchool /> Kurslarni ko'rish
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
