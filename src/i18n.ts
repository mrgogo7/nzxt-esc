// Simple i18n helper with localStorage persistence and storage-sync.
// No React context needed; both pages read from the same source.

export type Lang = "en" | "tr";
export const LANG_KEY = "nzxtLang";

// UI dictionaries
const dict: Record<Lang, Record<string, string>> = {
  en: {
    appTitle: "NZXT Media Config",
    language: "Language",
    reset: "Reset",
    resetConfirm: "Are you sure? This will reset ALL settings including the URL.",
    urlLabel: "Media URL",
    urlPlaceholder: "https://...mp4 / ...jpg / ...gif",
    save: "Save / Update",
    note:
      "Enter the URL you want to display on your device. After entering the URL, you can fine-tune the position in the preview below.",
    previewTitle: "LCD Preview",
    settingsTitle: "Preview Settings",
    scale: "Scale",
    xOffset: "X Offset",
    yOffset: "Y Offset",
    align: "Align",
    fit: "Fit",
    alignCenter: "center",
    alignTop: "top",
    alignBottom: "bottom",
    alignLeft: "left",
    alignRight: "right",
    fitCover: "cover",
    fitContain: "contain",
    fitFill: "fill",
    overlayGuide: "Overlay Guide",
  },
  tr: {
    appTitle: "NZXT Medya Ayarları",
    language: "Dil",
    reset: "Sıfırla",
    resetConfirm:
      "Emin misiniz? Bu işlem URL dahil TÜM ayarları sıfırlayacak.",
    urlLabel: "Medya URL",
    urlPlaceholder: "https://...mp4 / ...jpg / ...gif",
    save: "Kaydet / Güncelle",
    note:
      "Cihazınızda göstermek istediğiniz URL’yi giriniz. URL’yi girdikten sonra konumu aşağıdaki önizleme alanında ayarlayabilirsiniz.",
    previewTitle: "LCD Önizleme",
    settingsTitle: "Önizleme Ayarları",
    scale: "Ölçek",
    xOffset: "X Ofset",
    yOffset: "Y Ofset",
    align: "Hizalama",
    fit: "Sığdırma",
    alignCenter: "merkez",
    alignTop: "üst",
    alignBottom: "alt",
    alignLeft: "sol",
    alignRight: "sağ",
    fitCover: "kapla",
    fitContain: "içer",
    fitFill: "doldur",
    overlayGuide: "Rehber Çizgileri",
  },
};

// Default/fallback language
export function getInitialLang(): Lang {
  const saved = localStorage.getItem(LANG_KEY) as Lang | null;
  if (saved === "en" || saved === "tr") return saved;
  return "en";
}

// Translator
export function t(key: string, lang?: Lang): string {
  const l = lang ?? getInitialLang();
  return dict[l]?.[key] ?? dict.en[key] ?? key;
}

// Persist language and broadcast to other tabs/components
export function setLang(lang: Lang) {
  localStorage.setItem(LANG_KEY, lang);
  window.dispatchEvent(
    new StorageEvent("storage", { key: LANG_KEY, newValue: lang })
  );
}
