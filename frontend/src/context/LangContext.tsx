'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, Lang } from '@utils/i18n';

const LANG_STORAGE_KEY = 'aidevix_lang';

const readInitialLang = (): Lang => {
  if (typeof window === 'undefined') {
    return 'uz';
  }

  const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === 'uz' || saved === 'ru' || saved === 'en') {
    return saved;
  }

  return 'uz';
};

const syncDocumentLang = (nextLang: Lang) => {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.lang = nextLang;
  root.dataset.lang = nextLang;
};

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'uz',
  setLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    syncDocumentLang(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
  };

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== LANG_STORAGE_KEY) {
        return;
      }

      if (event.newValue === 'uz' || event.newValue === 'ru' || event.newValue === 'en') {
        setLangState(event.newValue);
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const t = (key: string, vars?: Record<string, string>): string => {
    let text = translations[lang]?.[key] ?? translations['uz']?.[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v);
      });
    }
    return text;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
