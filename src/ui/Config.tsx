import { useEffect, useState } from "react";
import { LANG_KEY, Lang, t, getInitialLang, setLang } from "../i18n";
import ConfigPreview from "./components/ConfigPreview";
import "./styles/ConfigPreview.css";

// LocalStorage keys (namespaced)
const CFG_KEY = "nzxtPinterestConfig";     // primary config (backward compatible name)
const CFG_COMPAT = "nzxtMediaConfig";      // legacy compatibility
const URL_KEY = "media_url";               // the URL that Display page reads

const DEFAULT_URL =
  "https://v1.pinimg.com/videos/iht/expMp4/b0/95/18/b09518df640864a0181b5d242ad49c2b_720w.mp4";

export default function Config() {
  // language
  const [lang, setLangState] = useState<Lang>(getInitialLang());
  // url field with Save/Update
  const [urlInput, setUrlInput] = useState<string>("");

  // load initial
  useEffect(() => {
    const cfgRaw = localStorage.getItem(CFG_KEY) || localStorage.getItem(CFG_COMPAT);
    const savedUrl = localStorage.getItem(URL_KEY);
    if (cfgRaw) {
      try {
        const parsed = JSON.parse(cfgRaw);
        setUrlInput(parsed.url || savedUrl || "");
      } catch {
        setUrlInput(savedUrl || "");
      }
    } else {
      setUrlInput(savedUrl || "");
    }
  }, []);

  // sync language cross components (Preview listens too)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY && e.newValue) {
        setLangState(e.newValue as Lang);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // handlers
  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Lang;
    setLangState(newLang);
    setLang(newLang);
  };

  const handleSave = () => {
    // URL is only applied to device when saved here (kept as current behavior).
    localStorage.setItem(URL_KEY, urlInput);
    // also mirror into config object for persistence (do not wipe other keys)
    try {
      const current = JSON.parse(localStorage.getItem(CFG_KEY) || "{}");
      const next = { ...current, url: urlInput };
      localStorage.setItem(CFG_KEY, JSON.stringify(next));
      localStorage.setItem(CFG_COMPAT, JSON.stringify(next));
      // broadcast for live listeners
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: CFG_KEY,
          newValue: JSON.stringify(next),
        })
      );
      window.dispatchEvent(
        new StorageEvent("storage", { key: URL_KEY, newValue: urlInput })
      );
    } catch {
      const next = { url: urlInput };
      localStorage.setItem(CFG_KEY, JSON.stringify(next));
      localStorage.setItem(CFG_COMPAT, JSON.stringify(next));
    }
  };

  const handleReset = () => {
    if (!window.confirm(t("resetConfirm", lang))) return;

    // wipe all keys this app uses
    localStorage.removeItem(CFG_KEY);
    localStorage.removeItem(CFG_COMPAT);
    // important: keep language!
    localStorage.setItem(URL_KEY, DEFAULT_URL);

    const defaults = {
      url: DEFAULT_URL,
      // mirror default preview settings
      scale: 1,
      x: 0,
      y: 0,
      fit: "cover",
      align: "center",
      loop: true,
      autoplay: true,
      mute: true,
      resolution: `${window.innerWidth}x${window.innerHeight}`,
      showGuide: true,
    };

    localStorage.setItem(CFG_KEY, JSON.stringify(defaults));
    localStorage.setItem(CFG_COMPAT, JSON.stringify(defaults));

    // broadcast updates so Preview refreshes immediately
    window.dispatchEvent(
      new StorageEvent("storage", { key: CFG_KEY, newValue: JSON.stringify(defaults) })
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: URL_KEY, newValue: DEFAULT_URL })
    );

    setUrlInput(DEFAULT_URL);
  };

  return (
    <div className="config-page">
      {/* top bar */}
      <header className="config-header">
        <h1 className="config-title">{t("appTitle", lang)}</h1>

        <div className="header-actions">
          <button className="reset-btn" onClick={handleReset}>
            {t("reset", lang)}
          </button>

          <label className="lang-label" htmlFor="lang-select">
            {t("language", lang)}
          </label>
          <select
            id="lang-select"
            className="lang-select"
            value={lang}
            onChange={handleLangChange}
          >
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
      </header>

      {/* URL input and action */}
      <section className="url-section">
        <label className="url-label" htmlFor="mediaUrl">
          {t("urlLabel", lang)}
        </label>
        <div className="url-row">
          <input
            id="mediaUrl"
            type="text"
            placeholder={t("urlPlaceholder", lang)}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="url-input"
          />
          <button onClick={handleSave} className="save-btn">
            {t("save", lang)}
          </button>
        </div>
        <p className="hint">{t("note", lang)}</p>
      </section>

      {/* Preview + settings (already responsive 9/3 grid in CSS) */}
      <ConfigPreview />
    </div>
  );
}
