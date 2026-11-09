'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, TRANSLATIONS, LanguageCode, LanguageOption } from '@/lib/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  currentLanguage: LanguageOption;
  languages: LanguageOption[];
  t: (key: string, fallback?: string) => string;
  isRtl: boolean;
}

const defaultContext: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  currentLanguage: LANGUAGES[0],
  languages: LANGUAGES,
  t: (key: string, fallback?: string) => TRANSLATIONS['en']?.[key] || fallback || key,
  isRtl: false,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

const STORAGE_KEY = 'threatguard_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode;
        if (saved && TRANSLATIONS[saved]) {
          setLanguageState(saved);
        }
      }
    } catch {
      // Fallback silently if localStorage is restricted
    }
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, code);
      }
    } catch {
      // Ignore
    }
  };

  const currentLanguage = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const isRtl = currentLanguage?.dir === 'rtl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    }
  }, [language, isRtl]);

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguage,
        languages: LANGUAGES,
        t,
        isRtl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context || defaultContext;
}
