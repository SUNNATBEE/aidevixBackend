'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoLockClosed, IoCheckmarkCircle, IoArrowForward, IoRefreshOutline } from 'react-icons/io5';
import { FiInstagram, FiMessageSquare } from 'react-icons/fi';
import { useSubscription } from '@hooks/useSubscription';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { allVerified, telegram, instagram, loading, refetch, verifyTelegram, verifyInstagram } = useSubscription();
  const verifiedCount = (telegram?.subscribed ? 1 : 0) + (instagram?.subscribed ? 1 : 0);

  const handleVerifyTelegram = async () => {
    try {
      await verifyTelegram({});
      refetch();
    } catch {}
  };

  const handleVerifyInstagram = async () => {
    try {
      await verifyInstagram({});
      refetch();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/5">
             <IoLockClosed size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">
             Ijtimoiy tarmoqlarga obuna
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
             Kurslarni ko&apos;rish uchun ijtimoiy tarmoqlarimizga a&apos;zo bo&apos;ling va darslarimizga cheksiz kirish huquqiga ega bo&apos;ling.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-16">
          <ul className="steps w-full">
            <li className={`step ${telegram?.subscribed ? 'step-primary font-bold text-white' : 'text-gray-500'}`}>Telegram</li>
            <li className={`step ${instagram?.subscribed ? 'step-primary font-bold text-white' : 'text-gray-500'}`}>Instagram</li>
            <li className={`step ${allVerified ? 'step-primary font-bold text-white' : 'text-gray-500'}`}>Tayyor!</li>
          </ul>
        </div>

        {/* Content */}
        <div className="bg-[#0d1224]/60 border border-white/5 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl -z-10"></div>
          
          <AnimatePresence mode="wait">
            {!allVerified ? (
              <motion.div 
                key="subscription-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-10"
              >
                {/* Telegram Step */}
                <div className={`p-6 rounded-3xl border transition-all duration-300 ${telegram?.subscribed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:border-indigo-500/30'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${telegram?.subscribed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        <FiMessageSquare size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">Telegram Kanal</h3>
                        <p className="text-gray-400 text-xs mt-0.5">@aidevix — 5,200+ a&apos;zo</p>
                      </div>
                    </div>
                    {telegram?.subscribed && (
                      <IoCheckmarkCircle className="text-emerald-400" size={28} />
                    )}
                  </div>
                  
                  {!telegram?.subscribed && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                       <a 
                         href="https://t.me/aidevix" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                       >
                         → Telegram kanalga o&apos;tish
                       </a>
                       <button 
                         onClick={handleVerifyTelegram}
                         disabled={loading}
                         className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold h-12 rounded-2xl transition-all disabled:opacity-50"
                       >
                         {loading ? <span className="loading loading-spinner loading-sm"></span> : '✅ Tasdiqlashni tekshirish'}
                       </button>
                    </div>
                  )}
                </div>

                {/* Instagram Step */}
                <div className={`p-6 rounded-3xl border transition-all duration-300 ${instagram?.subscribed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:border-pink-500/30'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${instagram?.subscribed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-pink-500/20 text-pink-400'}`}>
                        <FiInstagram size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">Instagram Sahifa</h3>
                        <p className="text-gray-400 text-xs mt-0.5">@aidevix.uz — 3,100+ kuzatuvchi</p>
                      </div>
                    </div>
                    {instagram?.subscribed && (
                      <IoCheckmarkCircle className="text-emerald-400" size={28} />
                    )}
                  </div>

                  {!instagram?.subscribed && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                       <a 
                         href="https://instagram.com/aidevix.uz" 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white font-bold h-12 rounded-2xl transition-all shadow-lg shadow-pink-500/20"
                       >
                         → Instagram sahifaga o&apos;tish
                       </a>
                       <button 
                         onClick={handleVerifyInstagram}
                         disabled={loading}
                         className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold h-12 rounded-2xl transition-all disabled:opacity-50"
                       >
                         {loading ? <span className="loading loading-spinner loading-sm"></span> : '✅ Tasdiqlashni tekshirish'}
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                   <IoCheckmarkCircle size={64} className="text-emerald-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 italic">Tabriklaymiz! 🎉</h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                   Barcha obunalar muvaffaqiyatli tasdiqlandi. Endi siz platformamizdan to&apos;liq foydalana olasiz.
                </p>
                <Link 
                  href="/courses" 
                  className="btn btn-primary bg-indigo-500 hover:bg-indigo-600 border-none w-full rounded-2xl h-14 font-black normal-case text-lg shadow-2xl shadow-indigo-500/30"
                >
                  Kurslarga o&apos;tish <IoArrowForward className="ml-2" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Info */}
          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                Obuna holatingiz real-time tekshiriladi. Muammo bo&apos;lsa yangilang.
             </p>
             <button 
               onClick={() => refetch()}
               className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all active:rotate-180 duration-500"
             >
                <IoRefreshOutline size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
