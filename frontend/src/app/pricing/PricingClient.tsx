'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IoCheckmark, IoClose, IoSparkles, IoFlash, IoRocket, IoStar,
  IoShieldCheckmark, IoChatbubbles, IoCalendar, IoTrendingUp,
} from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

type Tier = {
  id: 'free' | 'pro' | 'team';
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  badge?: string;
  icon: React.ReactNode;
  accent: string;
  features: { label: string; included: boolean }[];
  cta: string;
};

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Bepul',
    tagline: 'Boshlash uchun barcha asoslar',
    priceMonthly: 0,
    priceYearly: 0,
    icon: <IoSparkles />,
    accent: 'from-slate-400 to-slate-500',
    features: [
      { label: 'Tanlangan bepul kurslar', included: true },
      { label: 'Prompt Library — barchasi', included: true },
      { label: 'XP, daily challenges va leaderboard', included: true },
      { label: 'Daily reward va streak', included: true },
      { label: 'Sertifikat (bepul kurslar bo\'yicha)', included: true },
      { label: 'AI Code Playground — kuniga 5 marta', included: true },
      { label: 'Pro kurslarga to\'liq kirish', included: false },
      { label: 'AI Coach 24/7', included: false },
      { label: 'Mentorship sessiyalari', included: false },
    ],
    cta: 'Bepul boshlash',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Eng mashhur tanlov',
    priceMonthly: 99_000,
    priceYearly: 990_000,
    badge: 'Eng mashhur',
    icon: <IoFlash />,
    accent: 'from-indigo-500 via-purple-500 to-pink-500',
    features: [
      { label: 'Bepul tarif imkoniyatlarining hammasi', included: true },
      { label: 'Barcha kurslarga to\'liq kirish (50+)', included: true },
      { label: 'AI Coach 24/7 — cheksiz savol', included: true },
      { label: 'AI Code Playground — cheksiz', included: true },
      { label: 'Premium sertifikatlar (PDF)', included: true },
      { label: 'Ranking 2x XP ko\'paytirgich', included: true },
      { label: 'Yangi kurslarni birinchilardan oling', included: true },
      { label: 'Discord/Telegram private community', included: true },
      { label: '1-on-1 mentorship', included: false },
    ],
    cta: 'Pro ga o\'tish',
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Jamoa va kompaniyalar uchun',
    priceMonthly: 490_000,
    priceYearly: 4_900_000,
    icon: <IoRocket />,
    accent: 'from-cyan-500 to-emerald-500',
    features: [
      { label: 'Pro tarif imkoniyatlarining hammasi', included: true },
      { label: '5 ta seat (qo\'shimcha har birini +49k)', included: true },
      { label: 'Centralized billing va analytics', included: true },
      { label: 'Custom learning paths', included: true },
      { label: 'Oylik 1-on-1 mentorship sessiyalari', included: true },
      { label: 'Priority support (4-soat ichida javob)', included: true },
      { label: 'Brending: sertifikatlarda kompaniyangiz logosi', included: true },
      { label: 'SSO (kelajakda)', included: true },
      { label: 'API access', included: true },
    ],
    cta: 'Aloqaga chiqish',
  },
];

const FAQ = [
  {
    q: 'Bepul tarifda nima farqi bor?',
    a: 'Bepul tarifda asosiy kurslar va platforma imkoniyatlari mavjud. Pro tarifda barcha premium kurslar, AI Coach va cheksiz Playground bor.',
  },
  {
    q: 'Pulni qaytarish (refund) bormi?',
    a: 'Ha. Pro obunani sotib olgandan keyin 7 kun ichida pulingizni qaytarish mumkin — to\'liq, savol bermay.',
  },
  {
    q: 'Yillik obunani oylikdan qanday foydasi bor?',
    a: 'Yillik obuna 2 oy bepul (16% chegirma) + premium badge va early access yangi feature\'larga.',
  },
  {
    q: 'Click va Payme orqali to\'lov ishlaydimi?',
    a: 'Ha, ikkalasi ham. Karta yoki UzCard/Humo bilan to\'g\'ridan-to\'g\'ri to\'lov mumkin.',
  },
  {
    q: 'Obunani qanday bekor qilaman?',
    a: 'Profile → Sozlamalar → Obuna → Bekor qilish. Joriy davr oxirigacha ishlaydi.',
  },
];

const formatPrice = (uzs: number) => {
  if (uzs === 0) return '0';
  return new Intl.NumberFormat('uz-UZ').format(uzs);
};

export default function PricingClient() {
  const { isDark } = useTheme();
  const { isLoggedIn } = useAuth();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const bgClass = isDark ? 'bg-[#0A0E1A] text-white' : 'bg-slate-50 text-slate-900';
  const cardBg = isDark ? 'bg-[#0d1224]/70 border-white/5' : 'bg-white border-slate-200';
  const muted = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen pt-24 pb-16 ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">
            Tariflar
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Sizga mos paketni tanlang
          </h1>
          <p className={`max-w-xl mx-auto text-sm sm:text-base ${muted}`}>
            14 kun bepul sinov. Istalgan vaqtda bekor qiling. Yashirin to'lov yo'q.
          </p>

          {/* Toggle */}
          <div className={`inline-flex items-center mt-8 p-1 rounded-2xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                billing === 'monthly'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : muted
              }`}
            >
              Oylik
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : muted
              }`}
            >
              Yillik
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold">
                −16%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {TIERS.map((tier, i) => {
            const price = billing === 'monthly' ? tier.priceMonthly : tier.priceYearly;
            const monthlyEquiv = billing === 'yearly' && tier.priceYearly > 0
              ? Math.round(tier.priceYearly / 12)
              : null;
            const isPopular = tier.id === 'pro';

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative rounded-3xl border p-6 sm:p-7 flex flex-col ${cardBg} ${
                  isPopular ? 'lg:scale-[1.03] lg:shadow-2xl lg:shadow-indigo-500/10 ring-1 ring-indigo-500/30' : ''
                }`}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full text-white bg-gradient-to-r ${tier.accent}`}>
                    ⭐ {tier.badge}
                  </div>
                )}

                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white bg-gradient-to-br ${tier.accent} mb-4`}>
                  {tier.icon}
                </div>

                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  {tier.tagline}
                </div>
                <h3 className="text-2xl font-black mb-3">{tier.name}</h3>

                <div className="mb-5">
                  {price === 0 ? (
                    <div className="text-4xl font-black">0 so'm</div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">{formatPrice(price)}</span>
                        <span className={`text-sm ${muted}`}>so'm</span>
                      </div>
                      <div className={`text-xs mt-1 ${muted}`}>
                        / {billing === 'monthly' ? 'oy' : 'yil'}
                        {monthlyEquiv && (
                          <span className="ml-2 text-emerald-400">
                            ≈ {formatPrice(monthlyEquiv)} so'm/oy
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <Link
                  href={tier.id === 'free' ? (isLoggedIn ? '/courses' : '/register')
                    : tier.id === 'team' ? '/contact?subject=team-plan'
                    : '/profile?tab=billing&plan=pro'}
                  className={`text-center font-bold text-sm px-5 py-3 rounded-xl transition-all mb-6 ${
                    isPopular
                      ? `bg-gradient-to-r ${tier.accent} text-white hover:shadow-lg hover:shadow-indigo-500/30`
                      : isDark
                        ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                        : 'bg-slate-100 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {tier.cta}
                </Link>

                <ul className="space-y-2.5 flex-1">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <IoCheckmark className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <IoClose className="text-slate-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={f.included ? '' : 'text-slate-500 line-through'}>{f.label}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className={`rounded-3xl border p-6 sm:p-8 mb-20 ${cardBg}`}>
          <div className="grid sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: <IoShieldCheckmark />, title: 'Xavfsiz to\'lov', text: 'Click va Payme orqali himoyalangan' },
              { icon: <IoCalendar />, title: '14 kun sinov', text: 'Risksiz sinash imkoniyati' },
              { icon: <IoTrendingUp />, title: '7 kun refund', text: 'Yoqmasa pulni qaytaramiz' },
              { icon: <IoChatbubbles />, title: 'Support', text: 'Telegram orqali tez javob' },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-2xl text-indigo-400">{b.icon}</div>
                <div className="font-bold text-sm">{b.title}</div>
                <div className={`text-xs ${muted}`}>{b.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">
              Tez-tez beriladigan savollar
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Boshqa savollaringiz bormi?</h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  className={`rounded-2xl border overflow-hidden transition-colors ${cardBg} ${
                    open ? 'border-indigo-400/40' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-bold text-sm sm:text-base">{item.q}</span>
                    <span className={`flex-shrink-0 text-indigo-400 transition-transform ${open ? 'rotate-180' : ''}`}>
                      <IoStar />
                    </span>
                  </button>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`px-4 pb-4 text-sm leading-relaxed ${muted}`}
                    >
                      {item.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 text-sm font-bold"
            >
              <IoChatbubbles /> Boshqa savol bersangiz — yozing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
