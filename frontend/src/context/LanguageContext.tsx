import React, { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Locale } from "../types";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [locale, setLocaleState] = useState<Locale>((localStorage.getItem("yormand_lang") as Locale) || "tj");

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    i18n.changeLanguage(l);
    localStorage.setItem("yormand_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
