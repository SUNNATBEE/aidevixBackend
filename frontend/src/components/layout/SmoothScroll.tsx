'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactNode, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Lenis adds noticeable jank on mid-tier mobile and ignores user accessibility
 * preferences out of the box. Skip it on small viewports, slow connections,
 * and when the user requested reduced motion — fall through to native scroll.
 */
function useSkipLenis() {
  const [skip, setSkip] = useState(true); // start true so SSR/first paint = native scroll

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const compute = () => {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const isSmall = window.innerWidth < 768;
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
      const saveData = Boolean(conn?.saveData);
      const slowNetwork = conn?.effectiveType ? /(^|-)2g$/.test(conn.effectiveType) : false;
      setSkip(mql.matches || isSmall || saveData || slowNetwork);
    };
    compute();
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    mql.addEventListener('change', compute);
    window.addEventListener('resize', compute);
    return () => {
      mql.removeEventListener('change', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return skip;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>();
  const skip = useSkipLenis();

  // GSAP↔Lenis sync — only attach the ticker when Lenis is actually mounted.
  useEffect(() => {
    if (skip) return;
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, [skip]);

  if (skip) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
