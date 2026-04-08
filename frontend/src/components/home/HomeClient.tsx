'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import CourseCard from '@/components/courses/CourseCard';
import VideoCard from '@/components/videos/VideoCard';
import ProBanner from '@/components/home/ProBanner';
import { useLang } from '@/context/LangContext';
import { useTheme } from '@/context/ThemeContext';
import { HiArrowRight, HiOutlineDesktopComputer, HiOutlineServer, HiOutlineDeviceMobile, HiOutlineDatabase } from 'react-icons/hi';
import { SiPython, SiFigma } from 'react-icons/si';

const ThreeHero = dynamic(() => import('@/components/home/ThreeHero'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeClient({ initialCourses = [], initialVideos = [] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [showHeroVisual, setShowHeroVisual] = useState(false);
  const { t } = useLang();
  const { isDark } = useTheme();
  const statsRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const enable = () => {
      if (window.innerWidth >= 768) {
        setShowHeroVisual(true);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 1800 });
    } else {
      timeoutId = setTimeout(enable, 1200);
    }

    return () => {
      if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !pageRef.current) return;

    const ctx = gsap.context(() => {
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll('.stat-value');
        counters.forEach((counter: Element) => {
          const targetValue = parseInt(counter.getAttribute('data-value') || '0', 10);
          gsap.fromTo(
            counter,
            { innerText: 0 },
            {
              innerText: targetValue,
              duration: 1.8,
              snap: { innerText: 1 },
              ease: 'power2.out',
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 82%',
                once: true,
              },
            },
          );
        });
      }

      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section, index) => {
        gsap.fromTo(
          section,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: Math.min(index * 0.04, 0.18),
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 84%',
              once: true,
            },
          },
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, [isMounted]);

  const categories = [
    { name: t('cat.frontend'), subtitle: t('cat.frontendSub'), icon: <HiOutlineDesktopComputer className="w-8 h-8 text-white" />, path: 'frontend' },
    { name: t('cat.backend'), subtitle: t('cat.backendSub'), icon: <HiOutlineServer className="w-8 h-8 text-emerald-400" />, path: 'backend' },
    { name: t('cat.ai'), subtitle: t('cat.aiSub'), icon: <div className="w-8 h-8 text-cyan-400 flex items-center justify-center font-bold text-xl">AI</div>, path: 'ai' },
    { name: t('cat.python'), subtitle: t('cat.pythonSub'), icon: <SiPython className="w-8 h-8 text-yellow-500" />, path: 'python' },
    { name: t('cat.mobile'), subtitle: t('cat.mobileSub'), icon: <HiOutlineDeviceMobile className="w-8 h-8 text-pink-400" />, path: 'mobile' },
    { name: t('cat.uiux'), subtitle: t('cat.uiuxSub'), icon: <SiFigma className="w-8 h-8 text-purple-400" />, path: 'ui-ux' },
    { name: t('cat.data'), subtitle: t('cat.dataSub'), icon: <HiOutlineDatabase className="w-8 h-8 text-blue-400" />, path: 'malumotlar' },
  ];

  const stats = [
    { value: '15000', display: '15k+', label: t('stats.students'), color: isDark ? 'text-white' : 'text-gray-900' },
    { value: '120', display: '120+', label: t('stats.videos'), color: 'bg-gradient-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent' },
    { value: '50', display: '50+', label: t('stats.mentors'), color: isDark ? 'text-white' : 'text-gray-900' },
    { value: '5', display: '4.9', label: t('stats.rating'), color: 'text-orange-500' },
  ];

  const pageBg = isDark ? 'text-slate-100' : 'text-slate-900';
  const heroText = isDark ? 'text-white' : 'text-slate-950';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-600';
  const hairline = isDark ? 'border-white/10' : 'border-slate-900/10';
  const softSurface = isDark ? 'bg-white/[0.03]' : 'bg-white/70';
  const railSurface = isDark ? 'bg-white/[0.02]' : 'bg-slate-950/[0.03]';
  const ctaBg = isDark ? 'bg-[#07080d] border-white/10' : 'bg-slate-950 border-slate-800';

  if (!isMounted) return null;

  return (
    <div ref={pageRef} className={`min-h-screen font-sans selection:bg-indigo-500/30 ${pageBg}`}>
      <section className={`relative isolate overflow-hidden px-4 pt-8 ${heroText}`}>
        <div className="aidevix-grid absolute inset-0 opacity-20" />
        <div className={`absolute inset-x-0 top-0 h-[42rem] ${isDark ? 'bg-[radial-gradient(circle_at_top,rgba(86,98,246,0.24),transparent_46%)]' : 'bg-[radial-gradient(circle_at_top,rgba(86,98,246,0.16),transparent_44%)]'}`} />
        {showHeroVisual && <ThreeHero isDark={isDark} />}
        <div className={`pointer-events-none absolute inset-x-0 top-24 mx-auto h-64 max-w-5xl rounded-full blur-3xl ${isDark ? 'bg-amber-400/10' : 'bg-amber-300/20'}`} />

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-end gap-12 pb-16 pt-20 xl:grid-cols-[minmax(0,1.15fr)_22rem] xl:gap-16 xl:pb-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={`section-kicker mb-6 inline-flex items-center gap-3 border-b ${hairline} pb-4 ${mutedText}`}
            >
              <span>Aidevix</span>
              <span>{t('hero.badge')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="max-w-5xl font-display text-[3.5rem] font-bold leading-[0.92] tracking-[-0.06em] sm:text-[4.8rem] lg:text-[7rem]"
            >
              {t('hero.title1')}{' '}
              <span className="bg-gradient-to-r from-white via-indigo-200 to-amber-300 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className={`mt-8 max-w-2xl text-base leading-8 sm:text-lg ${mutedText}`}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/courses"
                className="inline-flex h-14 items-center justify-center rounded-full bg-indigo-500 px-8 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(86,98,246,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-400"
              >
                {t('hero.cta1')}
              </Link>
              <Link
                href="/register"
                className={`inline-flex h-14 items-center justify-center gap-2 rounded-full border px-8 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${isDark ? 'border-white/12 bg-white/5 text-white hover:bg-white hover:text-slate-950' : 'border-slate-300 bg-white/80 text-slate-900 hover:bg-slate-950 hover:text-white'}`}
              >
                {t('hero.cta2')}
                <HiArrowRight className="text-base" />
              </Link>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className={`self-end border-t pt-6 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0 ${hairline}`}
          >
            <div className={`section-kicker ${mutedText}`}>{t('home.learningSignal')}</div>
            <div className={`mt-6 space-y-6 border-y py-6 ${hairline}`}>
              {stats.slice(0, 3).map((stat, index) => (
                <div key={stat.label} className="flex items-end justify-between gap-4">
                  <div>
                    <div className={`text-xs uppercase tracking-[0.26em] ${mutedText}`}>0{index + 1}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{stat.display}</div>
                  </div>
                  <div className={`max-w-[10rem] text-right text-sm leading-6 ${mutedText}`}>{stat.label}</div>
                </div>
              ))}
            </div>
            <p className={`mt-6 max-w-xs text-sm leading-7 ${mutedText}`}>{t('home.learningSignalSub')}</p>
          </motion.aside>
        </div>
      </section>

      <section ref={statsRef} className="relative z-20 mx-auto mt-2 max-w-7xl px-4 reveal-section">
        <div className={`grid gap-px overflow-hidden rounded-[2rem] border ${hairline} ${softSurface} backdrop-blur-2xl md:grid-cols-4`}>
          {stats.map((stat, i) => (
            <div key={i} className={`px-6 py-8 md:px-8 md:py-10 ${i < stats.length - 1 ? 'md:border-r' : ''} ${hairline}`}>
              <div className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}>Metric 0{i + 1}</div>
              <div className={`mt-4 flex items-end text-4xl font-black tracking-[-0.06em] md:text-5xl ${stat.color}`}>
                <span className="stat-value" data-value={stat.value}>0</span>
                {stat.display.includes('+') ? '+' : ''}
                {stat.display.includes('.') ? '.9' : ''}
              </div>
              <div className={`mt-3 text-sm leading-6 ${mutedText}`}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal-section px-4 py-28 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 xl:grid-cols-[0.8fr_1.2fr] xl:gap-20">
          <div className="xl:sticky xl:top-28 xl:h-fit">
            <div className={`section-kicker ${mutedText}`}>{t('home.paths')}</div>
            <h2 className="mt-5 max-w-lg font-display text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              {t('cat.title')}
            </h2>
            <p className={`mt-6 max-w-md text-base leading-8 ${mutedText}`}>{t('cat.subtitle')}</p>
          </div>
          <div className={`border-t ${hairline}`}>
            {categories.map((category, idx) => (
              <Link
                key={idx}
                href={`/courses?category=${category.path}`}
                className={`group grid gap-4 border-b px-0 py-7 transition-all duration-300 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-center ${hairline}`}
              >
                <div className={`text-sm font-semibold tracking-[0.28em] ${mutedText}`}>0{idx + 1}</div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] transition-colors duration-300 group-hover:text-indigo-400 md:text-3xl">
                    {category.name}
                  </h3>
                  <p className={`mt-2 max-w-xl text-sm leading-7 ${mutedText}`}>{category.subtitle}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-indigo-400/30 group-hover:text-indigo-300">
                  {category.icon}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-section px-4 py-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className={`section-kicker ${mutedText}`}>{t('home.showcase')}</div>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] md:text-6xl">{t('courses.title')}</h2>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition-transform duration-300 hover:translate-x-1">
              {t('courses.viewAll')} <HiArrowRight />
            </Link>
          </div>
          <div className={`mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]`}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {initialCourses.slice(0, 6).map((course: any, index: number) => (
                <CourseCard key={course._id || index} course={course} index={index} />
              ))}
            </div>

            <div className={`rounded-[2rem] border p-6 md:p-8 ${hairline} ${railSurface}`}>
              <div className={`section-kicker ${mutedText}`}>{t('home.freshVideos')}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                {t('home.videoRailTitle')}
              </h3>
              <p className={`mt-4 text-sm leading-7 ${mutedText}`}>{t('home.videoRailSubtitle')}</p>
              <div className="mt-8 space-y-4">
                {initialVideos.slice(0, 4).map((video: any, index: number) => (
                  <VideoCard key={video._id || index} video={video} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 reveal-section">
        <ProBanner />
      </section>

      <section className={`relative overflow-hidden border-y px-4 py-28 text-center reveal-section ${ctaBg}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(86,98,246,0.2),transparent_34%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(circle_at_bottom,rgba(245,158,11,0.16),transparent_38%)]" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="section-kicker text-slate-400">{t('home.startNow')}</div>
          <h2 className="mt-6 font-display text-5xl font-semibold tracking-[-0.06em] text-white md:text-7xl lg:text-8xl">
            {t('cta.title1')}<span className="text-indigo-300">{t('cta.titleHighlight')}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400">{t('home.ctaSubtitle')}</p>
          <Link
            href="/register"
            className="mt-10 inline-flex h-16 items-center justify-center rounded-full bg-white px-10 text-base font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            {t('cta.start')}
          </Link>
        </div>
      </section>
    </div>
  );
}
