"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations, Language } from "./translations";
import { useSettings } from "@/components/providers/SettingsProvider";

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
  const [language, setInternalLanguage] = useState<Language>("en");
  const { settings, setSettings } = useSettings();

  useEffect(() => {
    // On mount, use settings.language if available, otherwise use system language
    const initialLang = settings.language || getSystemLanguage();
    setInternalLanguage(initialLang as Language);
    setMounted(true);
  }, [settings.language]);

  const setLanguage = (newLang: Language) => {
    setInternalLanguage(newLang);
    setSettings({ ...settings, language: newLang });
  };

  const t = (key: string) => {
    const lang = language;
    
    if (!mounted) return '';

    const keys = key.split(".");
    let value: unknown = translations[lang];
    
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    
    return (value as string) || key;
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