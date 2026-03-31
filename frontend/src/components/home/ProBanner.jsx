import React from 'react';
import { motion } from 'framer-motion';

// react-icons/hi o'rniga xavfsiz inline SVG icon
const CheckIcon = () => (
  <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ProBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="bg-slate-950 rounded-[40px] p-8 md:p-16 border border-dashed border-blue-500/40 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden"
    >
      {/* LEFT SIDE */}
      <div className="flex-1 relative z-10">
        <div className="inline-block mb-4">
          <span className="text-blue-500 font-bold tracking-wider text-sm uppercase">
            PREMIUM A'ZOLIK
          </span>
        </div>
        
        <h2 className="text-white text-3xl md:text-5xl font-bold mb-8 leading-tight">
          Cheklovsiz bilim olish imkoniyati
        </h2>
        
        <ul className="space-y-4 mb-10">
          <li className="flex items-center gap-3 text-slate-300 md:text-lg">
            <CheckIcon />
            <span>Barcha kurslarga cheksiz ruxsat</span>
          </li>
          <li className="flex items-center gap-3 text-slate-300 md:text-lg">
            <CheckIcon />
            <span>Yopiq vebinar va master-klasslar</span>
          </li>
          <li className="flex items-center gap-3 text-slate-300 md:text-lg">
            <CheckIcon />
            <span>Bitiruv sertifikati va karyera maslahatlari</span>
          </li>
        </ul>
        
        <button className="bg-white text-black font-bold rounded-full px-10 py-4 hover:bg-slate-200 transition-colors shadow-lg active:scale-95">
          Pro ga o'tish
        </button>
      </div>
      
      {/* RIGHT SIDE (Visual Stack) */}
      <div className="flex-1 relative w-full h-[280px] md:h-[350px] flex items-center justify-center mt-8 md:mt-0">
        {/* Glow behind cards */}
        <div className="absolute inset-0 bg-blue-600/30 blur-[80px] rounded-full"></div>
        
        {/* Card Stack Container */}
        <div className="relative w-full max-w-[300px] aspect-[4/3]">
          {/* Card 1 (Backmost Blur) */}
          <motion.div 
            initial={{ rotate: -15, scale: 0.8, x: -30, opacity: 0 }}
            whileInView={{ rotate: -12, scale: 0.9, x: -25, opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute inset-0 bg-blue-800/60 border border-blue-500/20 rounded-3xl backdrop-blur-md"
          ></motion.div>
          
          {/* Card 2 (Middle Blur) */}
          <motion.div 
            initial={{ rotate: 5, scale: 0.85, x: 30, opacity: 0 }}
            whileInView={{ rotate: 10, scale: 0.95, x: 25, opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute inset-0 bg-blue-700/80 border border-blue-400/30 rounded-3xl backdrop-blur-sm"
          ></motion.div>
          
          {/* Card 3 (Front Main) */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute inset-0 bg-[#0a0a0c] border border-blue-500/50 rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.2)] flex flex-col p-8 justify-between z-10"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">PRO PLAN</p>
                <h3 className="text-white text-xl md:text-2xl font-bold">Aidevix Pro</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <span className="text-xl">🚀</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-white text-3xl md:text-4xl font-extrabold">$120</span>
                <span className="text-slate-400 text-lg mb-1">/yil</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-[70%] h-full rounded-full"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
