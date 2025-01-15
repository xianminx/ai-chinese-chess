"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SettingsProvider } from "./SettingsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <NextUIProvider>
        <SettingsProvider>{children}</SettingsProvider>
      </NextUIProvider>
    </NextThemesProvider>
  );
}
