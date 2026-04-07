'use client';

import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>();

  // Sync GSAP ticker with Lenis raf
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    
    gsap.ticker.add(update);
    
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

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
