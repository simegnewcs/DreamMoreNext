"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import enTranslations from "../../locales/en.json";
import amTranslations from "../../locales/am.json";

export type LanguageCode = "en" | "am";

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

type TranslationValue = string | TranslationObject;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  toggleLanguage: () => void;
  t: (path: string, fallback?: string) => string;
  isAmharic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const LANGUAGE_STORAGE_KEY = "dreammore-language";
const LANGUAGE_COOKIE_KEY = "dreammore-lang";
const translations: Record<LanguageCode, TranslationObject> = {
  en: enTranslations as TranslationObject,
  am: amTranslations as TranslationObject,
};

function resolveTranslationValue(source: TranslationObject | undefined, path: string): string | undefined {
  if (!source) return undefined;

  const segments = path.split(".");
  let current: TranslationValue | undefined = source;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || Array.isArray(current)) {
      return undefined;
    }

    current = current[segment];
  }

  return typeof current === "string" ? current : undefined;
}

function getInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === "en" || stored === "am") {
    return stored;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${LANGUAGE_COOKIE_KEY}=`));

  if (cookieValue) {
    const cookieLanguage = cookieValue.split("=")[1];
    if (cookieLanguage === "en" || cookieLanguage === "am") {
      return cookieLanguage;
    }
  }

  return "en";
}

function persistLanguage(language: LanguageCode) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${language}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  document.documentElement.lang = language;
  document.documentElement.dir = language === "am" ? "ltr" : "ltr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const initialLanguage = getInitialLanguage();
    setLanguageState(initialLanguage);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistLanguage(language);
  }, [hydrated, language]);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
  };

  const toggleLanguage = () => {
    setLanguageState((current) => (current === "en" ? "am" : "en"));
  };

  const t = (path: string, fallback?: string) => {
    const translation = resolveTranslationValue(translations[language], path);
    return translation ?? fallback ?? path;
  };

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      isAmharic: language === "am",
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
