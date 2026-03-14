'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from './translations/en';
import { fr } from './translations/fr';
import { es } from './translations/es';
import { pt } from './translations/pt';
import type { TranslationKeys } from './translations';

const translations: Record<string, TranslationKeys> = { en, fr, es, pt };

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationKeys;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('ranchie-lang');
    if (saved && translations[saved]) {
      setLanguageState(saved);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (translations[browserLang]) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('ranchie-lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] || en }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);