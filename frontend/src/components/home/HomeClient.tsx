'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import CourseCard from '@/components/courses/CourseCard';
import VideoCard from '@/components/videos/VideoCard';
import ProBanner from '@/components/home/ProBanner';
import { HiOutlineDesktopComputer, HiOutlineServer, HiOutlineDeviceMobile, HiOutlineDatabase } from 'react-icons/hi';
import { SiPython, SiFigma } from 'react-icons/si';

const categories = [
  { name: 'Frontend', subtitle: "Web saytlar ko'rinishi", icon: <HiOutlineDesktopComputer className="w-8 h-8 text-white" />, path: 'frontend' },
  { name: 'Backend', subtitle: "Server va mantiq", icon: <HiOutlineServer className="w-8 h-8 text-emerald-400" />, path: 'backend' },
  { name: 'Python', subtitle: "AI va Telegram botlar", icon: <SiPython className="w-8 h-8 text-yellow-500" />, path: 'python' },
  { name: 'Mobile', subtitle: "Android va iOS", icon: <HiOutlineDeviceMobile className="w-8 h-8 text-pink-400" />, path: 'mobile' },
  { name: 'UI/UX', subtitle: "Dizayn va Prototip", icon: <SiFigma className="w-8 h-8 text-purple-400" />, path: 'ui-ux' },
  { name: 'Ma\'lumotlar', subtitle: "SQL va Tahlil", icon: <HiOutlineDatabase className="w-8 h-8 text-blue-400" />, path: 'malumotlar' },
];

export default function HomeClient({ initialCourses = [], initialVideos = [] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show a dark background or simple skeleton during hydration
  if (!isMounted) {
    return (
       <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-purple-500/30">
      {/* 1. HERO SECTION */}
      <section className="bg-transparent text-white min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow effect for background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-slate-300"
          >
            Professional dasturlash platformasi
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-tight"
          >
            Kelajak kasbini <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">O'zbek tilida</span> o'rganing
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Eng talabgir dasturlash yo'nalishlarini noldan boshlab amaliy loyihalar orqali o'rganing va IT sohasiga birinchi qadamingizni qo'ying.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto"
          >
            <Link href="/courses" className="btn bg-purple-600 hover:bg-purple-700 border-none text-white btn-lg rounded-full px-12 shadow-2xl shadow-purple-600/30 font-bold transition-all hover:scale-105 active:scale-95">
              Kurslarni ko'rish
            </Link>
            <Link href="/register" className="btn btn-outline border-slate-700 text-white hover:bg-white hover:text-black btn-lg rounded-full px-12 font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
              Ro'yxatdan o'tish
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="px-4 relative -mt-16 z-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.6)] w-full bg-[#0f0f12] rounded-[2.5rem] border border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5 backdrop-blur-xl">
          {[
            { value: '15k+', label: 'Faol o\'quvchilar', color: 'text-white' },
            { value: '120+', label: 'Video darslar', color: 'bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent' },
            { value: '50+', label: 'Mentorlar', color: 'text-white' },
            { value: '4.9', label: 'Reyting', color: 'text-orange-500' }
          ].map((stat, i) => (
             <div key={i} className="flex-1 py-10 text-center hover:bg-white/5 transition-colors cursor-default first:rounded-l-[2.5rem] last:rounded-r-[2.5rem]">
               <div className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
               <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
             </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
             <span className="text-purple-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Yo'nalishlar</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Sohangizni tanlang</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg font-medium">Barcha darajalar uchun optimallashtirilgan o'quv darsliklari</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="h-full"
              >
                <Link href={`/courses?category=${category.path}`} className="bg-[#0f1115] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#161920] hover:border-purple-500/20 transition-all duration-500 group h-full shadow-lg hover:shadow-purple-500/5">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                    {category.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{category.name}</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{category.subtitle}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COURSES SECTION */}
      <section className="py-32 px-4 max-w-7xl mx-auto bg-transparent">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
             <span className="text-purple-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block underline underline-offset-8 decoration-purple-600/50">Yangi darsliklar</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">Tavsiya etilgan kurslar</h2>
            <p className="text-slate-500 text-lg">Hozirgi kunda eng ko'p o'rganilayotgan texnologiyalar</p>
          </div>
          <Link href="/courses" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-slate-300 hover:bg-white hover:text-black transition-all duration-500 group">
             Barchasini ko'rish <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </div>
        
        <div className="courses-swiper-container -mx-4 px-4 sm:mx-0 sm:px-0">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {initialCourses.length > 0 ? (
              initialCourses.map((course: any, index: any) => (
                <SwiperSlide key={course._id || index} className="h-auto">
                  <CourseCard course={course} index={index} />
                </SwiperSlide>
              ))
            ) : (
                <div className="text-center py-20 text-slate-500 w-full bg-[#121215] rounded-[3rem] border border-white/5 p-12">
                   <p className="text-xl font-bold mb-2">Hozircha kurslar yo'q</p>
                   <p className="text-sm opacity-50">Kechirasiz, tizimda hali darsliklar mavjud emas.</p>
                </div>
            )}
          </Swiper>
        </div>
      </section>

      {/* PRO BANNER */}
      <section className="py-20 px-4 max-w-7xl mx-auto mb-20">
        <ProBanner />
      </section>

      {/* 5. VIDEOS SECTION */}
      <section className="py-32 px-4 max-w-7xl mx-auto bg-transparent border-t border-white/5">
        <div className="text-center mb-20">
          <span className="text-purple-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block italic">Mustaqil o'rganish</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Top amaliy videolar</h2>
          <p className="text-slate-500 text-lg">Tezkor o'rganish uchun qisqa va amaliy videolar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialVideos.length > 0 ? (
            initialVideos.map((video: any, index: any) => (
              <VideoCard key={video._id || index} video={video} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500 bg-[#0f1115] rounded-[3rem] border border-white/5 p-12 italic opacity-60">
              Videolar topilmadi
            </div>
          )}
        </div>
      </section>
      
      {/* 6. FOOTER CTA */}
      <section className="py-40 px-4 bg-[#050505] border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight">Kelajakni biz bilan <span className="text-indigo-500 underline decoration-indigo-600/30 underline-offset-[12px]">kodlang!</span></h2>
          <p className="text-xl md:text-2xl text-slate-400 mb-16 leading-relaxed font-medium">
            Minglab muvaffaqiyatli bitiruvchilarga qo'shiling va professional karyerangizni bugun boshlang.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="btn btn-lg bg-white text-black hover:bg-slate-200 border-none rounded-full px-16 font-bold shadow-2xl shadow-white/5 transition-all hover:scale-105 active:scale-95 h-16">
              Bepul boshlash
            </Link>
            <Link href="/courses" className="btn btn-lg btn-outline border-white/10 text-white hover:bg-white/10 rounded-full px-16 font-semibold h-16 backdrop-blur-md">
               Barcha kurslar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
