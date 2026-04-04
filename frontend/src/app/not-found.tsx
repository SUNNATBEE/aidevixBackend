'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoHomeOutline, IoSearchOutline } from 'react-icons/io5';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-indigo-500/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mb-8">
           <h1 className="text-[10rem] sm:text-[14rem] font-black text-white leading-none opacity-5 italic select-none">404</h1>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-2xl shadow-indigo-500/10">
                 <Io SearchOutline size={40} className="text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Sahifa topilmadi</h2>
              <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                 Siz qidirayotgan sahifa o&apos;chirilgan, nomi o&apos;zgartirilgan yoki vaqtincha mavjud emas.
              </p>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none rounded-2xl px-10 h-14 font-bold normal-case text-base shadow-xl shadow-indigo-500/20 flex items-center gap-2"
          >
            <IoHomeOutline size={20} />
            Bosh sahifaga qaytish
          </Link>
          <Link 
            href="/courses" 
            className="btn bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-2xl px-10 h-14 font-bold normal-case text-base transition-all"
          >
            Kurslarni ko&apos;rish
          </Link>
        </div>
      </motion.div>
      
      <div className="mt-20 opacity-20 hover:opacity-50 transition-opacity duration-500">
         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Aidevix Professional Learning Platform</p>
      </div>
    </div>
  );
}
