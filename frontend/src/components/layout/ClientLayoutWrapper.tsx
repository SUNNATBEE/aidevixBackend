'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // List of paths where we DON'T want the global Navbar and Footer
  const hideLayout = [
    '/login',
    '/register',
    '/forgot-password',
    '/verify-code',
    '/reset-password',
  ].includes(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="min-h-[80vh] w-full">
        {children}
      </main>
      {!hideLayout && <Footer />}
      <ScrollToTop />
    </>
  );
}
