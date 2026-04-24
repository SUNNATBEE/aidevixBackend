'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoHomeOutline, IoSearchOutline } from 'react-icons/io5';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full min-w-0 max-w-full flex-col items-center justify-center overflow-x-clip bg-[#0A0E1A] p-4 text-center font-sans selection:bg-indigo-500/30 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mb-8">
           <h1 className="select-none text-[clamp(6rem,42vw,14rem)] font-black italic leading-none text-white opacity-5 sm:text-[14rem]">404</h1>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-2xl shadow-indigo-500/10">
                 <IoSearchOutline size={40} className="text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Sahifa topilmadi</h2>
              <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                 Siz qidirayotgan sahifa o&apos;chirilgan, nomi o&apos;zgartirilgan yoki vaqtincha mavjud emas.
              </p>
           </div>
        </div>

        <div className="flex w-full max-w-md flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
          <Link 
            href="/" 
            className="btn btn-primary flex h-12 min-h-[3rem] w-full items-center justify-center gap-2 rounded-2xl border-none bg-indigo-500 px-6 text-sm font-bold normal-case shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 sm:h-14 sm:w-auto sm:px-10 sm:text-base"
          >
            <IoHomeOutline size={20} />
            Bosh sahifaga qaytish
          </Link>
          <Link 
            href="/courses" 
            className="btn flex h-12 min-h-[3rem] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-bold normal-case text-white transition-all hover:bg-white/10 sm:h-14 sm:w-auto sm:px-10 sm:text-base"
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
