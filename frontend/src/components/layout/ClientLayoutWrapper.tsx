'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';

const DailyRewardModal = dynamic(() => import('@components/common/DailyRewardModal'), { ssr: false });
const LiveActivityTicker = dynamic(() => import('@components/common/LiveActivityTicker'), { ssr: false });
const AICoach = dynamic(() => import('@components/common/AICoach'), { ssr: false });

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [showEnhancements, setShowEnhancements] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // List of paths where we DON'T want the global Navbar and Footer
  const hideLayout = [
    '/login',
    '/register',
    '/forgot-password',
    '/verify-code',
    '/reset-password',
  ].includes(pathname || '');
  const showAmbientWidgets = pathname === '/' || pathname?.startsWith('/courses');

  useEffect(() => {
    if (!isMounted || hideLayout) {
      setShowEnhancements(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const enable = () => setShowEnhancements(true);

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(enable, 900);
    }

    return () => {
      if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isMounted, hideLayout, pathname]);

  return (
    <>
      {isMounted && !hideLayout && <Navbar />}
      {showEnhancements && <DailyRewardModal />}
      
      <main className=" w-full">
        {children}
      </main>

      {showEnhancements && showAmbientWidgets && <LiveActivityTicker />}
      {showEnhancements && showAmbientWidgets && <AICoach />}
      {isMounted && !hideLayout && <Footer />}
      {isMounted && <ScrollToTop />}
    </>
  );
}
