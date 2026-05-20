"use client";

import { ThemeProvider } from "@/context/ThemeContext";

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
