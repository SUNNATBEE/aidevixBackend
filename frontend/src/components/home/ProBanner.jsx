import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiCheckCircle, HiArrowRight } from 'react-icons/hi';

const ProBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full rounded-[2rem] overflow-hidden"
    >
      {/* Background with advanced gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"></div>
      
      {/* Decorative Blur elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>

      <div className="relative z-10 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 border border-white/5 backdrop-blur-[2px]">
        {/* Content Side */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6">
            <HiLightningBolt className="w-4 h-4" />
            <span>Aidevix Pro Imkoniyati</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Dasturlash sirlarini <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              Cheksiz o'rganing
            </span>
          </h2>

          <p className="text-slate-400 text-lg mb-10 max-w-xl leading-relaxed">
            Pro obuna orqali barcha pullik kurslar, yopiq darslar va xalqaro darajadagi sertifikatlarga bir marta to'lov orqali ega bo'ling.
          </p>

          <ul className="space-y-4 mb-10 text-slate-300 font-medium">
            <li className="flex items-center gap-3">
              <HiCheckCircle className="w-6 h-6 text-emerald-500" />
              <span>Barcha kurslarga to'liq kirish</span>
            </li>
            <li className="flex items-center gap-3">
              <HiCheckCircle className="w-6 h-6 text-emerald-500" />
              <span>Yopiq hamjamiyat (Community) a'zoligi</span>
            </li>
            <li className="flex items-center gap-3">
              <HiCheckCircle className="w-6 h-6 text-emerald-500" />
              <span>Mentorlar bilan bevosita aloqa</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/subscription" 
              className="btn btn-lg bg-white text-black hover:bg-slate-200 border-none rounded-2xl px-10 font-bold group"
            >
              Pro'ga o'tish
              <HiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/courses" 
              className="btn btn-lg btn-ghost text-white border-white/10 hover:bg-white/5 rounded-2xl px-10"
            >
              Batafsil ma'lumot
            </Link>
          </div>
        </div>

        {/* Visual Side / Card decoration */}
        <div className="flex-1 w-full max-w-md hidden lg:block">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-30"></div>
            <div className="relative bg-[#0d1117] rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
               <div className="space-y-6">
                 {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                        <div className="w-6 h-6 bg-slate-700/50 rounded-lg animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/2 bg-slate-700/50 rounded-full animate-pulse" />
                        <div className="h-2 w-3/4 bg-slate-800/50 rounded-full animate-pulse" />
                      </div>
                    </div>
                 ))}
                 <div className="pt-4 border-t border-white/5">
                    <div className="h-10 w-full bg-purple-600/20 rounded-xl border border-purple-600/30 flex items-center justify-center text-purple-400 font-bold text-sm">
                      ACTIVE ACCESS
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProBanner;
