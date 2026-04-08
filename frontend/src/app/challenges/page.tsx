'use client';

import { motion } from 'framer-motion';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import { IoGameControllerOutline } from 'react-icons/io5';

export default function ChallengesPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-amber-400/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-400/20"
        >
          <IoGameControllerOutline className="text-4xl text-amber-400" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-black mb-4"
        >
          Daily <span className="text-amber-400">Challenges</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base-content/60 mb-8"
        >
          Tez orada! Har kuni yangi dasturlash topshiriqlarini bajaring va qo'shimcha XP ballarini qo'lga kiriting.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 justify-center bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 text-sm font-bold"
        >
          <HiOutlineLightningBolt />
          Yaqin kunlarda ishga tushadi
        </motion.div>
      </div>
    </div>
  );
}
