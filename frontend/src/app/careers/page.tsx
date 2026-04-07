'use client';

import { motion } from 'framer-motion';
import { HiOutlineBriefcase } from 'react-icons/hi';
import { FiExternalLink } from 'react-icons/fi';

export default function CareersPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20"
        >
          <HiOutlineBriefcase className="text-4xl text-indigo-500" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-black mb-4"
        >
          Aidevix <span className="text-indigo-500">Careers</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base-content/60 mb-8"
        >
          Eng yaxshi o'quvchilarimiz uchun nufuzli IT kompaniyalaridan ish o'rinlari va amaliyot dasturlari.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-2xl bg-base-200 border border-base-content/5 text-left flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all">
             <div>
               <div className="font-bold text-sm">Talantlar bazasiga qo'shilish</div>
               <div className="text-xs text-base-content/40">Rezyumengizni tayyorlab turing</div>
             </div>
             <FiExternalLink className="text-base-content/20 group-hover:text-indigo-500 transition-colors" />
          </div>
          <div className="text-xs text-base-content/30 italic">
            *Careers bo'limi mentorlar tomonidan tasdiqlangan o'quvchilar uchun ochiladi.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
