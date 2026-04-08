'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';

interface SoundContextType {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  playSound: (path: string, volume?: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  // Cache for audio objects to avoid repeated creation
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    const saved = localStorage.getItem('aidevix_sound_enabled');
    if (saved !== null) {
      setIsSoundEnabled(saved === 'true');
    }
  }, []);

  const toggleSound = (enabled: boolean) => {
    setIsSoundEnabled(enabled);
    localStorage.setItem('aidevix_sound_enabled', String(enabled));
  };

  const playSound = (path: string, volume: number = 0.2) => {
    if (!isSoundEnabled) return;

    try {
      if (!audioCache.current[path]) {
        audioCache.current[path] = new Audio(path);
      }
      
      const audio = audioCache.current[path];
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Interacting with the page is usually required before audio can play
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('button, a, [role="button"]');
      if (clickable) {
        playSound('/sounds/onlyclick.wav', 0.1);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isSoundEnabled]);

  return (
    <SoundContext.Provider value={{ isSoundEnabled, setIsSoundEnabled: toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
