'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@components/auth/LoginForm';
import { useAuth } from '@hooks/useAuth';
import gsap from 'gsap';

export default function LoginPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/profile');
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex font-sans selection:bg-indigo-500/30">
      {/* Chap tomon: 3D Scene Placeholder */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0A0E1A] justify-center items-center">
        {/* Placeholder for Qudrat's 3D particle scene */}
        <div className="absolute inset-0 z-0">
          {/* Particles will be rendered here */}
        </div>

        {/* Matnlar (Chap burchakda pastda) */}
        <div className="absolute bottom-24 left-20 z-10 max-w-lg">
          <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-[3.5rem] font-extrabold mb-4 leading-[1.1] tracking-tight text-white">
            Kelajakni
            <br />
            <span className="text-indigo-400">kodlashni boshlang</span>
          </h1>
          <div className="border-l-2 border-indigo-500/70 pl-5 mt-8">
            <p className="text-gray-400/90 text-[1.1rem] leading-relaxed">
              "Aidevix platformasi orqali dasturlash olamiga
              sho'ng'ing va o'z imkoniyatlaringizni kashf eting."
            </p>
          </div>
        </div>
      </div>

      {/* O'ng tomon: Login form wrapper */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#0A0E1A]">
        <div 
          ref={cardRef}
          className="w-full max-w-[420px] bg-[#0A0E1A] lg:bg-[#0d1224]/40 rounded-3xl border-0 lg:border lg:border-white/5 p-8 sm:p-10 opacity-0 shadow-2xl shadow-indigo-500/5"
        >
          <div className="text-center mb-10">
            <h2 className="text-[1.75rem] font-bold text-white mb-3">Xush kelibsiz</h2>
            <p className="text-gray-400 text-[0.95rem] px-2 leading-relaxed">
              Aidevix platformasiga kirish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <LoginForm />
          
        </div>

        <div className="mt-12 text-center text-xs text-gray-500/70 absolute bottom-8">
          © 2024 Aidevix. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  );
}
