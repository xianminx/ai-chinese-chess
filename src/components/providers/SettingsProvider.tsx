'use client';

import { Language } from '@/i18n/translations';
import { createContext, useContext, useState, ReactNode } from 'react';

export const MODEL_OPTIONS = [
    "gpt-3.5-turbo",
    "gpt-4o-mini",
    "gpt-4o",
    "o1-mini",
    "o1-preview",
  ];
   
export type SettingsType = {
    aiMode: boolean;
    model: typeof MODEL_OPTIONS[number];
    useIcons: boolean;
    aiEngine: "LLM" | "MINIMAX";
    minimaxDepth: number;
    theme?: "light" | "dark" | "system";
    language?: Language;
};

const defaultSettings: SettingsType = {
    aiMode: false,
    model: 'gpt-4o-mini',
    useIcons: false,
    aiEngine: "MINIMAX",
    minimaxDepth: 3,
    theme: "system",
    language: undefined
};

const SettingsContext = createContext<{
    settings: SettingsType;
    setSettings: (settings: SettingsType) => void;
}>({
    settings: defaultSettings,
    setSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, saveSettings] = useState<SettingsType>(() => {
        if (typeof window !== 'undefined') {
            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) {
                return { ...defaultSettings, ...JSON.parse(savedSettings) };
            }
        }
        return defaultSettings;
    });

    const setSettings = (newSettings: SettingsType) => {        
        if (!newSettings) {
            console.error('Attempted to save invalid settings:', newSettings);
            return;
        }
        saveSettings(newSettings);
        localStorage.setItem('settings', JSON.stringify(newSettings));
    };

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);

