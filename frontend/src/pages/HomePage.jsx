import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useCourses } from '../hooks/useCourses';
import { useVideos } from '../hooks/useVideos';
import CourseCard from '../components/courses/CourseCard';
import VideoCard from '../components/videos/VideoCard';
import ProBanner from '../components/home/ProBanner';
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

export default function HomePage() {
  const { topCourses, courses, loading: coursesLoading, fetchTop: fetchTopCourses } = useCourses();
  const { topVideos, loading: videosLoading, error: videosError, fetchTop: fetchTopVideos } = useVideos();

  useEffect(() => {
    if (fetchTopCourses) fetchTopCourses(8);
    if (fetchTopVideos) fetchTopVideos(6);
  }, [fetchTopCourses, fetchTopVideos]);

  const coursesData = Array.isArray(topCourses) && topCourses.length > 0 ? topCourses : (Array.isArray(courses) ? courses : []);
  const safeTopVideos = Array.isArray(topVideos) ? topVideos : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-purple-500/30">
      {/* 1. HERO SECTION */}
      <section className="bg-transparent text-white min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Glow effect for background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

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
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
          >
            Kelajak kasbini <span className="text-purple-500">O'zbek tilida</span> o'rganing
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Eng talabgir dasturlash yo'nalishlarini noldan boshlab amaliy loyihalar orqali o'rganing va IT sohasiga birinchi qadamingizni qoying.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto"
          >
            <Link to="/courses" className="btn bg-purple-600 hover:bg-purple-700 border-none text-white btn-lg rounded-full px-10 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
              Kurslarni ko'rish
            </Link>
            <Link to="/register" className="btn btn-outline border-slate-700 text-white hover:bg-white hover:text-black btn-lg rounded-full px-10">
              Ro'yxatdan o'tish
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="px-4 relative -mt-16 z-20 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-full bg-[#0f0f12] rounded-2xl border border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5">
          <div className="flex-1 place-items-center py-8 text-center">
            <div className="text-3xl font-bold text-white mb-2">15k+</div>
            <div className="text-sm font-medium text-slate-400">Faol o'quvchilar</div>
          </div>
          <div className="flex-1 place-items-center py-8 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">120+</div>
            <div className="text-sm font-medium text-slate-400">Video darslar</div>
          </div>
          <div className="flex-1 place-items-center py-8 text-center">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-sm font-medium text-slate-400">Mentorlar</div>
          </div>
          <div className="flex-1 place-items-center py-8 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2">4.9</div>
            <div className="text-sm font-medium text-slate-400">Reyting</div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="py-24 bg-[#050505] mt-10">
        <div className="w-full">
          <div className="text-center mb-16 px-4">
            <h2 className="text-4xl font-bold text-white mb-4">Yo'nalishlar</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">O'zingizga ma'qul bo'lgan sohani tanlang</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-4 max-w-7xl mx-auto">
            {categories.map((category, idx) => (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                key={idx} 
                className="h-full"
              >
                <Link to={`/courses?category=${category.path}`} className="bg-[#0f1115] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#161920] transition-all duration-300 group h-full">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-slate-500 text-xs font-medium">{category.subtitle}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COURSES SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto bg-transparent">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Tavsiya etilgan kurslar</h2>
            <p className="text-slate-400">Eng mashhur va sifatli darsliklar</p>
          </div>
          <Link to="/courses" className="text-sm text-slate-400 hover:text-white shrink-0 transition-colors">Barchasini ko'rish &rarr;</Link>
        </div>
        
        {coursesLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-purple-500"></span>
            <p className="mt-4 text-slate-400 font-medium">Kurslar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="courses-swiper-container -mx-4 px-4 sm:mx-0 sm:px-0">
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="py-4 px-2"
            >
              {coursesData.length > 0 ? (
                coursesData.map((course, index) => (
                  <SwiperSlide key={course._id || index} className="pb-8 h-auto">
                    <CourseCard course={course} index={index} />
                  </SwiperSlide>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 w-full bg-[#121215] rounded-2xl border border-white/5">Kurslar topilmadi</div>
              )}
            </Swiper>
          </div>
        )}
      </section>

      {/* PRO BANNER SECTION */}
      <section className="py-12 px-4 max-w-7xl mx-auto bg-transparent">
        <ProBanner />
      </section>

      {/* 5. VIDEOS SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto bg-transparent border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Top videolar</h2>
        </div>

        {videosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="skeleton h-48 w-full bg-slate-800/50 rounded-2xl"></div>
                <div className="skeleton h-6 w-3/4 bg-slate-800/50"></div>
                <div className="skeleton h-4 w-1/2 bg-slate-800/50"></div>
              </div>
            ))}
          </div>
        ) : videosError ? (
          <div className="text-center py-12 text-red-500 bg-[#121215] rounded-2xl border border-red-500/20">
            Videolarni yuklashda xatolik yuz berdi
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeTopVideos.length > 0 ? (
              safeTopVideos.map((video, index) => (
                <VideoCard key={video._id || index} video={video} index={index} />
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-slate-400 bg-[#121215] rounded-2xl border border-white/5">Videolar topilmadi</div>
            )}
          </div>
        )}
      </section>
      
      {/* 6. FOOTER CTA */}
      <section className="py-24 px-4 bg-[#0a0a0a] border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-purple-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Bugun boshlang!</h2>
          <p className="text-lg md:text-xl text-slate-400 mb-10">
            Minglab o'quvchilar safiga qo'shiling va o'z yorqin kelajagingizni biz bilan quring.
          </p>
          <Link to="/register" className="btn btn-lg bg-white text-black hover:bg-slate-200 border-none rounded-full px-12 font-bold">
            Bepul ro'yxatdan o'tish
          </Link>
        </div>
      </section>
    </div>
  );
}
