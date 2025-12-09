import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./locales/en.json";
import tr from "./locales/tr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import pt from "./locales/pt.json";
import it from "./locales/it.json";
import jp from "./locales/jp.json";
import { LANG_KEY, getInitialLang } from "./index";

const dictionaries: Record<string, Record<string, string>> = {
  en,
  tr,
  de,
  es,
  fr,
  pt,
  it,
  jp
};

interface I18nContextValue {
  lang: string;
  t: (key: string) => string;
  setLang: (lang: string) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Initialize from localStorage
  const [lang, setLangState] = useState<string>(getInitialLang());

  // Listen to storage events (cross-tab) and custom events (same-tab) to update language
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY && e.newValue) {
        const supportedLangs = ["en", "tr", "es", "de", "pt", "fr", "it", "jp"];
        if (supportedLangs.includes(e.newValue)) {
          setLangState(e.newValue);
        }
      }
    };
    
    const onLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: string }>;
      if (customEvent.detail?.lang) {
        const supportedLangs = ["en", "tr", "es", "de", "pt", "fr", "it", "jp"];
        if (supportedLangs.includes(customEvent.detail.lang)) {
          setLangState(customEvent.detail.lang);
        }
      }
    };
    
    window.addEventListener("storage", onStorage);
    window.addEventListener("languagechange", onLanguageChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("languagechange", onLanguageChange);
    };
  }, []);

  const setLang = (newLang: string) => {
    const supportedLangs = ["en", "tr", "es", "de", "pt", "fr", "it", "jp"];
    if (supportedLangs.includes(newLang)) {
      setLangState(newLang);
      localStorage.setItem(LANG_KEY, newLang);
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(
        new CustomEvent("languagechange", { detail: { lang: newLang } })
      );
    }
  };

  const t = (key: string) => {
    const dict = dictionaries[lang] || dictionaries.en;
    return dict[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18nContext = () => useContext(I18nContext);
