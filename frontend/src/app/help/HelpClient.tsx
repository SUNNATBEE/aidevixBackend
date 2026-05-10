'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSearch, IoChevronDown, IoChatbubbles, IoBookOutline,
  IoVideocam, IoTrophy, IoCard, IoShieldCheckmark, IoSparkles,
  IoMail, IoLogoYoutube,
} from 'react-icons/io5';
import { FaTelegramPlane } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';

type FAQItem = { q: string; a: string };
type Category = { id: string; icon: React.ReactNode; title: string; description: string; items: FAQItem[] };

const CATEGORIES: Category[] = [
  {
    id: 'getting-started',
    icon: <IoSparkles />,
    title: 'Boshlanish',
    description: 'Aidevix bilan ishni boshlash',
    items: [
      {
        q: 'Aidevix nima?',
        a: 'Aidevix — O\'zbek tilidagi AI-first dasturlash platformasi. Bizda 50+ kurs, Prompt Library, AI Code Playground, daily challenges va sertifikatlar bor. Maqsadimiz — sizni AI tools (Claude, Cursor, Copilot) bilan ishlashga tayyorlash.',
      },
      {
        q: 'Qanday ro\'yxatdan o\'taman?',
        a: 'Bosh sahifaning yuqori burchagida "Ro\'yxatdan o\'tish" tugmasini bosing. Email + parol bilan yoki Google orqali tez ro\'yxatdan o\'tishingiz mumkin. Telegram Mini App orqali ham — bot ichida sahifa ochiladi va avtomatik login bo\'ladi.',
      },
      {
        q: 'Telegram kanalga obuna nega kerak?',
        a: 'Kurs videolarini ko\'rish uchun @aidevix kanaliga obuna bo\'lishingiz kerak. Bu bizning asosiy biznes modelimiz va siz uchun yangiliklarni birinchidan eshitishingiz uchun. Profil → "Telegramni tasdiqlash" tugmasi orqali bog\'lanasiz.',
      },
      {
        q: 'Aidevix bepulmi?',
        a: 'Asosiy imkoniyatlar (tanlangan kurslar, Prompt Library, XP, daily reward, basic Playground) bepul. Premium kurslar va kengaytirilgan AI Coach uchun Pro tarif (oyiga 99 000 so\'m). Tariflar haqida → /pricing.',
      },
    ],
  },
  {
    id: 'courses',
    icon: <IoVideocam />,
    title: 'Kurslar va videolar',
    description: 'O\'qish jarayoni',
    items: [
      {
        q: 'Kursga qanday yozilaman?',
        a: 'Kurs sahifasida "Yozilish" tugmasini bosing. Bepul kurslar uchun darhol kirish ochiladi. Pullik kurslar uchun Click yoki Payme orqali to\'lovni amalga oshirasiz.',
      },
      {
        q: 'Video ko\'rsa XP olamanmi?',
        a: 'Ha. Har bir video ko\'rilganda +50 XP. Quiz to\'liq to\'g\'ri javob bersangiz +100 XP bonus. Daily challenge yakuniga yetkazsangiz +80-250 XP.',
      },
      {
        q: 'Video to\'xtab qoldi/yuklamayapti?',
        a: '1) Internet ulanishingizni tekshiring. 2) Telegram @aidevix kanaliga obunangizni tasdiqlang (Profil → Obunalar). 3) Brauzeringizni yangilang. 4) Hali ham muammo bo\'lsa — /contact orqali yozing.',
      },
      {
        q: 'Sertifikat qanday olaman?',
        a: 'Kursning barcha videolarini ko\'rib chiqib, oxirgi quizdan o\'tsangiz, avtomatik sertifikat beriladi. Email va Telegram orqali xabar keladi. Profil → "Sertifikatlarim" bo\'limidan ko\'rishingiz va PDF yuklab olishingiz mumkin.',
      },
    ],
  },
  {
    id: 'xp',
    icon: <IoTrophy />,
    title: 'XP, Level va Reyting',
    description: 'Gamification tizimi',
    items: [
      {
        q: 'XP nima va qanday olinadi?',
        a: 'XP = Experience Points. Har bir harakat uchun beriladi: video (+50), quiz (+10/savol, +100 bonus), daily challenge (+80-250), prompt yaratish (+30), project tugatish (+200), daily login reward (+30-100).',
      },
      {
        q: 'Streak nima va nima foydasi bor?',
        a: 'Streak — har kuni platforma\'ga kirib biror harakat qilsangiz oshib boradi. 7 kun streak = +200 XP bonus, 30 kun streak = "Streak Master" badge + premium imkoniyatlar. Streak buzilsa qaytadan boshlanadi (haftada 1 marta freeze ishlatib ushlab turish mumkin).',
      },
      {
        q: 'Level qanday ko\'tariladi?',
        a: 'Har 1000 XP — 1 ta yangi level. Level 5 da — Corporal, Level 15 — Sergeant, va h.k. Profil va leaderboard da level/rank ko\'rinadi. Public profile (/u/username) da hammaga ko\'rsata olasiz.',
      },
      {
        q: 'Leaderboard\'ga qanday tushaman?',
        a: 'Avtomatik — XP qancha bo\'lsa, leaderboard\'da pastdan o\'rin olasiz. Haftalik leaderboard alohida — har dushanba 00:00 reset bo\'ladi. Top 3 ga prizes beriladi.',
      },
    ],
  },
  {
    id: 'payments',
    icon: <IoCard />,
    title: 'To\'lov va Pro obuna',
    description: 'Tarif va to\'lov masalalari',
    items: [
      {
        q: 'Qanday to\'lov turlari qabul qilinadi?',
        a: 'Click va Payme orqali UzCard/Humo, Visa, MasterCard. To\'lov darhol ishga tushadi. Pro yillik obuna uchun 16% chegirma.',
      },
      {
        q: 'Pro obunani qanday bekor qilaman?',
        a: 'Profile → Sozlamalar → Obuna → "Obunani bekor qilish". Joriy davr oxirigacha Pro imkoniyatlar saqlanib qoladi. Avtomatik yangilanish o\'chiriladi.',
      },
      {
        q: 'Pulni qaytarish (refund) bormi?',
        a: 'Ha. Pro obunani sotib olgandan 7 kun ichida pulingiz to\'liq qaytariladi — sababsiz. /contact ga yozing.',
      },
      {
        q: 'Promokod qayerga kiritiladi?',
        a: 'To\'lov sahifasida "Promokod" maydoni bor. PromoCode va kurs uchun amal qiladi. Tugagan promo ishlamaydi.',
      },
    ],
  },
  {
    id: 'account',
    icon: <IoShieldCheckmark />,
    title: 'Hisob va xavfsizlik',
    description: 'Parol, 2FA, sessiyalar',
    items: [
      {
        q: 'Parolimni unutdim, nima qilay?',
        a: '"Login" sahifasida → "Parolni unutdingizmi?" → emailingizni kiriting → 6 raqamli kod keladi → yangi parol o\'rnatasiz. Kod 10 daqiqada amal qiladi.',
      },
      {
        q: '2FA qanday yoqaman?',
        a: 'Profile → Sozlamalar → 2FA → "Yoqish". Google Authenticator yoki Authy app\'ida QR kodni o\'qing. 10 ta backup kod ham beriladi — xavfsiz joyda saqlang. 2FA ni o\'chirish parol qayta tasdiqlashni talab qiladi.',
      },
      {
        q: 'Boshqa qurilmalardan chiqishni qanday boshqaraman?',
        a: 'Profile → Sozlamalar → Faol sessiyalar — barcha kirgan qurilmalarni ko\'rasiz va birini yoki barchasini bir vaqtda chiqarib yuborishingiz mumkin. Yangi qurilmadan kirsangiz, emailga xabar keladi.',
      },
      {
        q: 'Hisobimni qanday o\'chiraman?',
        a: 'Profile → Sozlamalar → "Hisobni o\'chirish" (GDPR). Parolni qayta tasdiqlashingiz kerak. Ma\'lumotlaringiz anonim qilinadi va 30 kundan keyin to\'liq o\'chiriladi.',
      },
    ],
  },
];

export default function HelpClient() {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return CATEGORIES;
    const q = search.toLowerCase();
    return CATEGORIES
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [search]);

  const totalQuestions = filtered.reduce((sum, cat) => sum + cat.items.length, 0);

  const bgClass = isDark ? 'bg-[#0A0E1A] text-white' : 'bg-slate-50 text-slate-900';
  const cardBg = isDark ? 'bg-[#0d1224]/70 border-white/5' : 'bg-white border-slate-200';
  const muted = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-screen pt-24 pb-20 ${bgClass}`}>
      <div className="mx-auto max-w-5xl px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-3">
            Yordam markazi
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-[-0.04em] mb-4">
            Qanday yordam bera olamiz?
          </h1>
          <p className={`text-sm sm:text-base ${muted}`}>
            Aidevix bo'yicha eng ko'p beriladigan savollar va javoblari.
          </p>
        </motion.div>

        {/* Search */}
        <div className={`flex items-center gap-3 mb-8 px-5 py-3 rounded-2xl border ${cardBg}`}>
          <IoSearch className="text-slate-500 text-lg flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value.slice(0, 80))}
            placeholder="Savolingizni yozing... (masalan: 'parolni unutdim')"
            className={`flex-1 bg-transparent outline-none text-sm ${
              isDark ? 'placeholder:text-slate-500' : 'placeholder:text-slate-400'
            }`}
          />
          {search && (
            <span className={`text-xs px-2 py-1 rounded-md ${
              isDark ? 'bg-white/5' : 'bg-slate-100'
            }`}>
              {totalQuestions} ta natija
            </span>
          )}
        </div>

        {/* Categories + FAQ */}
        {filtered.length === 0 ? (
          <div className={`rounded-3xl border p-12 text-center ${cardBg}`}>
            <IoBookOutline className="text-5xl mx-auto text-slate-500 mb-3" />
            <h3 className="font-bold text-lg mb-1">Natija topilmadi</h3>
            <p className={`text-sm mb-5 ${muted}`}>
              Boshqa kalit so'z bilan urinib ko'ring yoki bizga to'g'ridan-to'g'ri yozing.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30"
            >
              <IoChatbubbles /> Aloqa sahifasiga o'tish
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((cat) => (
              <motion.section
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-lg">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-black tracking-tight">{cat.title}</h2>
                    <p className={`text-xs ${muted}`}>{cat.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item, idx) => {
                    const id = `${cat.id}-${idx}`;
                    const open = openId === id;
                    return (
                      <div
                        key={id}
                        className={`rounded-2xl border overflow-hidden ${cardBg} ${
                          open ? 'border-indigo-400/40' : ''
                        }`}
                      >
                        <button
                          onClick={() => setOpenId(open ? null : id)}
                          className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
                          aria-expanded={open}
                        >
                          <span className="font-bold text-sm sm:text-base flex-1">{item.q}</span>
                          <IoChevronDown
                            className={`flex-shrink-0 text-indigo-400 transition-transform ${
                              open ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className={`px-4 pb-4 text-sm leading-relaxed ${muted}`}>
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className={`mt-14 rounded-3xl border p-6 sm:p-8 text-center ${cardBg}`}>
          <h3 className="font-display text-xl sm:text-2xl font-black mb-2">Javob topa olmadingizmi?</h3>
          <p className={`text-sm mb-5 max-w-md mx-auto ${muted}`}>
            Bizga to'g'ridan-to'g'ri yozing — 24 soat ichida javob beramiz. Telegram orqali bog'lansangiz tezroq.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30"
            >
              <IoMail /> Email orqali
            </Link>
            <a
              href="https://t.me/aidevix_support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-sky-500/30"
            >
              <FaTelegramPlane /> Telegram
            </a>
            <a
              href="https://youtube.com/@aidevix"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border ${
                isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-100'
              }`}
            >
              <IoLogoYoutube /> YouTube qo'llanmalar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
