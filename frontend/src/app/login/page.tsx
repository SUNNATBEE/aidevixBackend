'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@components/auth/LoginForm';
import { useAuth } from '@hooks/useAuth';
import { useLang } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';
import gsap from 'gsap';
import type { Lang } from '@utils/i18n';

const LANG_BADGES: Record<Lang, string> = { uz: 'UZ', ru: 'RU', en: 'EN' };

export default function LoginPage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const { t, lang, setLang } = useLang();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    }
  }, []);

  useEffect(() => {
    if (!loading && isLoggedIn) router.replace('/profile');
  }, [isLoggedIn, loading, router]);

  const bg = isDark ? 'bg-[#0A0E1A]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#0d1224]/40 border-white/5' : 'bg-white border-gray-200 shadow-xl';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen ${bg} ${textMain} flex font-sans selection:bg-indigo-500/30`}>
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden ${isDark ? 'bg-[#0A0E1A]' : 'bg-indigo-600'} justify-center items-center`}>
        <div className="absolute bottom-24 left-20 z-10 max-w-lg">
          <div className={`w-14 h-14 ${isDark ? 'bg-indigo-600/20 border-indigo-500/30' : 'bg-white/20 border-white/30'} rounded-xl flex items-center justify-center mb-6 border`}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke={isDark ? "#818cf8" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h1 className="text-[3.5rem] font-extrabold mb-4 leading-[1.1] tracking-tight text-white">
            {t('cta.title1')}<br /><span className={isDark ? 'text-indigo-400' : 'text-yellow-300'}>{t('cta.titleHighlight')}</span>
          </h1>
          <div className={`border-l-2 ${isDark ? 'border-indigo-500/70' : 'border-white/50'} pl-5 mt-8`}>
            <p className={`text-[1.1rem] leading-relaxed ${isDark ? 'text-gray-400/90' : 'text-white/70'}`}>
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className={`w-full lg:w-1/2 flex flex-col justify-center items-center p-3 sm:p-12 relative ${bg}`}>
        <div className="absolute top-4 right-3 sm:top-6 sm:right-6 flex items-center gap-1.5 sm:gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-indigo-600'}`}>
            {isDark ? '☀' : '☾'}
          </button>
          {(['uz', 'ru', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${lang === l ? 'bg-indigo-600 text-white' : isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}
            >
              {LANG_BADGES[l]}
            </button>
          ))}
        </div>

        <div ref={cardRef} className={`w-full max-w-[420px] rounded-2xl sm:rounded-3xl border p-5 sm:p-10 opacity-0 ${cardBg}`}>
          <div className="text-center mb-7 sm:mb-10">
            <h2 className={`text-[1.45rem] sm:text-[1.75rem] font-bold mb-3 ${textMain}`}>{t('auth.login.welcome')}</h2>
            <p className={`text-[0.95rem] px-2 leading-relaxed ${textMuted}`}>{t('auth.login.subtitle')}</p>
          </div>
          <LoginForm />
        </div>

        <div className={`mt-8 sm:mt-12 text-center text-[11px] sm:text-xs relative sm:absolute sm:bottom-8 ${isDark ? 'text-gray-500/70' : 'text-gray-400'}`}>
          {t('footer.copyright')}
        </div>
      </div>
    </div>
  );
}
