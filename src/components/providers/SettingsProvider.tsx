'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type SettingsType = {
    aiMode: boolean;
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3-opus' | 'claude-3-sonnet';
    useIcons: boolean;
};

const defaultSettings: SettingsType = {
    aiMode: false,
    model: 'gpt-3.5-turbo',
    useIcons: true,
};

const SettingsContext = createContext<{
    settings: SettingsType;
    setSettings: (settings: SettingsType) => void;
}>({
    settings: defaultSettings,
    setSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SettingsType>(defaultSettings);

    useEffect(() => {
        // Load settings from localStorage on mount
        const savedSettings = localStorage.getItem('gameSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleSetSettings = (newSettings: SettingsType) => {
        setSettings(newSettings);
        localStorage.setItem('gameSettings', JSON.stringify(newSettings));
    };

    return (
        <SettingsContext.Provider value={{ settings, setSettings: handleSetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext); 