"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SettingsProvider } from "./SettingsProvider";
import { LanguageProvider } from "@/i18n/LanguageProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <NextUIProvider>
        <SettingsProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </SettingsProvider>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
