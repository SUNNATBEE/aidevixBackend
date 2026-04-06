'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from '@components/auth/RegisterForm';
import { useAuth } from '@hooks/useAuth';
import gsap from 'gsap';
import { FiUserPlus, FiSend, FiInstagram, FiPlayCircle } from 'react-icons/fi';

export default function RegisterPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/profile');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  const steps = [
    {
      id: 1,
      title: "Ro'yxatdan o'tish",
      description: "Shaxsiy ma'lumotlaringizni kiriting",
      icon: <FiUserPlus className="w-5 h-5" />,
      active: true,
    },
    {
      id: 2,
      title: "Telegram kanaliga a'zo bo'lish",
      description: "Yangiliklardan xabardor bo'ling",
      icon: <FiSend className="w-5 h-5" />,
      active: false,
    },
    {
      id: 3,
      title: "Instagram sahifasini kuzatish",
      description: "Jamoamiz hayotini kuzating",
      icon: <FiInstagram className="w-5 h-5" />,
      active: false,
    },
    {
      id: 4,
      title: "Birinchi darsni ko'rish",
      description: "Bepul darsni boshlang",
      icon: <FiPlayCircle className="w-5 h-5" />,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white flex font-sans selection:bg-indigo-500/30">
      
      {/* Chap tomon: Ma'lumot va qadamlar */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative bg-[#0A0E1A]">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="z-10 max-w-lg mx-auto w-full">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              &lt;/&gt;
            </div>
            <span className="text-xl font-bold tracking-wide">Aidevix</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight tracking-tight text-white">
            Aidevix-ga xush <br /> kelibsiz
          </h1>
          <p className="text-gray-400 text-lg mb-12">
            Dasturlashni o&apos;rganishni bugun boshlang.
          </p>

          <div className="space-y-8 relative">
            {/* Chiziq (Timeline) */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-white/10 z-0"></div>
            
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4 relative z-10">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    step.active 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                      : 'bg-[#131B31] border-white/10 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="pt-2">
                  <h3 className={`font-semibold text-lg ${step.active ? 'text-indigo-400' : 'text-gray-300'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* O'ng tomon: Registratsiya formasi */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#0A0E1A]">
        {/* Glow effect o'ng tomon uchun */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div 
          ref={cardRef}
          className="w-full max-w-[480px] bg-[#0d1224]/60 backdrop-blur-xl rounded-3xl border border-white/5 p-8 sm:p-10 opacity-0 shadow-2xl z-10"
        >
          <RegisterForm />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Hisobingiz bormi?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Kirish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
