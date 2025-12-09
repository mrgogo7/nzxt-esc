// Export I18nProvider and hooks
export * from "./I18nProvider";
export * from "./useI18n";

// Import dictionaries
import en from "./locales/en.json";
import tr from "./locales/tr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import pt from "./locales/pt.json";
import it from "./locales/it.json";
import jp from "./locales/jp.json";

// Language type - updated to match new system
export type Lang = "en" | "tr" | "es" | "de" | "pt" | "fr" | "it" | "jp";

// Storage key constant
export const LANG_KEY = "nzxtLang";

// Dictionary mapping
const dictionaries: Record<Lang, Record<string, string>> = {
  en,
  tr,
  de,
  es,
  fr,
  pt,
  it,
  jp
};

/**
 * Get initial language from localStorage
 * Falls back to "en" if invalid or not set
 */
export function getInitialLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY) as Lang | null;
  const supportedLangs: Lang[] = ["en", "tr", "es", "de", "pt", "fr", "it", "jp"];
  return saved && supportedLangs.includes(saved) ? saved : "en";
}

/**
 * Translation function - compatible with old API
 * @param key Translation key
 * @param lang Optional language override
 * @returns Translated string or key if not found
 */
export function t(key: string, lang?: Lang): string {
  const l = lang ?? getInitialLang();
  return dictionaries[l]?.[key] ?? dictionaries.en[key] ?? key;
}

/**
 * Set language preference
 * @param lang Language code to set
 */
export function setLang(lang: Lang) {
  localStorage.setItem(LANG_KEY, lang);
  // Dispatch storage event for cross-tab sync
  window.dispatchEvent(
    new StorageEvent("storage", { key: LANG_KEY, newValue: lang })
  );
  // Dispatch custom event for same-tab updates (StorageEvent only fires cross-tab)
  window.dispatchEvent(
    new CustomEvent("languagechange", { detail: { lang } })
  );
}
