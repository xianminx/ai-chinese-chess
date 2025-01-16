"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations, Language } from "./translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  mounted: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  mounted: false
});

const getSystemLanguage = (): Language => {
  if (typeof window === 'undefined') return "en";
  
  // Get browser language (e.g., "en-US" or "zh-CN")
  const browserLang = navigator.language.split('-')[0];
  
  // Check if the browser language is supported
  if (browserLang in translations) {
    return browserLang as Language;
  }
  
  // Default to English if not supported
  return "en";
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    setLanguage(getSystemLanguage());
    setMounted(true);
  }, []);

  const t = (key: string) => {
    if (!mounted) return key;

    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context;
}; 