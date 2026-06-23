'use client';

import { useCallback, useEffect, useState } from 'react';

// `beforeinstallprompt` event'i butun sahifada BIR MARTA otiladi. Uni bir nechta
// komponent (banner + suzuvchi knopka) mustaqil ushlasa, `.prompt()` ikki marta
// chaqirilib xato beradi. Shuning uchun event'ni MODUL DARAJASIDA (singleton) ushlab,
// barcha komponentlar shu yagona manbadan o'qiydi.

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((l) => l());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // brauzerning avtomatik mini-infobar'ini to'samiz
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    notify();
  });
}

const isStandalone = (): boolean =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari standalone bayrog'i
    (window.navigator as unknown as { standalone?: boolean }).standalone === true);

const detectIOS = (): boolean =>
  typeof navigator !== 'undefined' &&
  /iphone|ipad|ipod/i.test(navigator.userAgent) &&
  !(window as unknown as { MSStream?: unknown }).MSStream;

export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

export function usePwaInstall() {
  const [, force] = useState(0);

  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    // mount'da joriy holatni bir marta sinxronlaymiz
    l();
    return () => {
      listeners.delete(l);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    if (!deferredPrompt) return 'unavailable';
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      // Event bir martalik — qaytadan ishlatib bo'lmaydi
      deferredPrompt = null;
      notify();
      return choice.outcome;
    } catch {
      return 'unavailable';
    }
  }, []);

  return {
    canInstall: !!deferredPrompt, // Android/Chrome/Edge/desktop native prompt tayyor
    isInstalled: installed || isStandalone(),
    isIOS: detectIOS(),
    promptInstall,
  };
}
