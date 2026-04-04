'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false);
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

  // We always render children for SEO, but Navbar/Footer need isMounted
  // to avoid hydration mismatch with Redux state
  return (
    <>
      {isMounted && !hideLayout && <Navbar />}
      <main className="min-h-[80vh] w-full">
        {children}
      </main>
      {isMounted && !hideLayout && <Footer />}
      {isMounted && <ScrollToTop />}
    </>
  );
}
