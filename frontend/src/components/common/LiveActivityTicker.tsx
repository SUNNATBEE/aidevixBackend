'use client';

import { useState, useEffect, useRef } from 'react';
import { IoFlash, IoStar, IoCheckmarkCircle } from 'react-icons/io5';
import { gsap } from 'gsap';

const ACTIVITIES = [
  { id: 1, user: 'Sunnatbek', action: 'Legend darajasiga chiqdi', icon: <IoStar className="text-yellow-400" />, color: 'from-yellow-400/20' },
  { id: 2, user: 'Abubakir', action: 'AI-SaaS kursini tugatdi', icon: <IoCheckmarkCircle className="text-emerald-400" />, color: 'from-emerald-400/20' },
  { id: 3, user: 'Jasurbek', action: '500 XP to\'pladi', icon: <IoFlash className="text-blue-400" />, color: 'from-blue-400/20' },
  { id: 4, user: 'Farruxbek', action: 'Cursor AI darsini boshladi', icon: <IoFlash className="text-purple-400" />, color: 'from-purple-400/20' },
  { id: 5, user: 'Sardor', action: 'Yangi jamoaga qo\'shildi', icon: <IoStar className="text-pink-400" />, color: 'from-pink-400/20' },
];

export default function LiveActivityTicker() {
  const [index, setIndex] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!itemRef.current) return;

      gsap.to(itemRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.35,
        onComplete: () => {
          setIndex((prev) => {
            const nextIndex = (prev + 1) % ACTIVITIES.length;

            if (itemRef.current) {
              gsap.fromTo(itemRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.35 }
              );
            }

            return nextIndex;
          });
        }
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      if (itemRef.current) {
        gsap.killTweensOf(itemRef.current);
      }
    };
  }, []);

  const current = ACTIVITIES[index];

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[40] w-fit">
      <div
        ref={itemRef}
        className={`activity-item px-4 py-2 bg-[#12141c]/80 backdrop-blur-md border border-white/5 rounded-full flex items-center gap-3 shadow-2xl bg-gradient-to-r ${current.color} to-transparent`}
      >
        <div className="flex items-center gap-2">
          {current.icon}
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{current.user}</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-white/20" />
        <span className="text-[10px] text-white/50 font-medium">{current.action}</span>
      </div>
    </div>
  );
}
