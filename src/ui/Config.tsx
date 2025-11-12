import { useEffect, useState } from "react";
import { LANG_KEY, Lang, t, getInitialLang, setLang } from "../i18n";
import ConfigPreview from "./components/ConfigPreview";
import "./styles/ConfigPreview.css";

// Storage keys (kept backward compatible)
const CFG_KEY = "nzxtPinterestConfig";
const CFG_COMPAT = "nzxtMediaConfig";
const URL_KEY = "media_url";

const DEFAULT_URL =
  "https://v1.pinimg.com/videos/iht/expMp4/b0/95/18/b09518df640864a0181b5d242ad49c2b_720w.mp4";

export default function Config() {
  // language
  const [lang, setLangState] = useState<Lang>(getInitialLang());
  // url input bound to Save/Update
  const [urlInput, setUrlInput] = useState<string>("");

  // initial load
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

  // language sync listener
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY && e.newValue) {
        setLangState(e.newValue as Lang);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Lang;
    setLangState(newLang);
    setLang(newLang);
  };

  const handleSave = () => {
    // persist URL and broadcast—Display page will pick it up
    localStorage.setItem(URL_KEY, urlInput);

    // also mirror into config object without wiping other fields
    const current = (() => {
      try { return JSON.parse(localStorage.getItem(CFG_KEY) || "{}"); }
      catch { return {}; }
    })();
    const next = { ...current, url: urlInput };
    localStorage.setItem(CFG_KEY, JSON.stringify(next));
    localStorage.setItem(CFG_COMPAT, JSON.stringify(next));

    // broadcast changes so live preview updates
    window.dispatchEvent(
      new StorageEvent("storage", { key: CFG_KEY, newValue: JSON.stringify(next) })
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: URL_KEY, newValue: urlInput })
    );
  };

  const handleReset = () => {
    if (!window.confirm(t("resetConfirm", lang))) return;

    // clear config but keep language
    localStorage.removeItem(CFG_KEY);
    localStorage.removeItem(CFG_COMPAT);

    // factory defaults for preview
    const defaults = {
      url: DEFAULT_URL,
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

    localStorage.setItem(URL_KEY, DEFAULT_URL);
    localStorage.setItem(CFG_KEY, JSON.stringify(defaults));
    localStorage.setItem(CFG_COMPAT, JSON.stringify(defaults));

    // broadcast
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
      {/* top header */}
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

      {/* URL + Save */}
      <section className="url-section">
        <label className="url-label" htmlFor="mediaUrl">
          {t("urlLabel", lang)}
        </label>
        <div className="url-row">
          <input
            id="mediaUrl"
            type="text"
            className="url-input"
            placeholder={t("urlPlaceholder", lang)}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button onClick={handleSave} className="save-btn">
            {t("save", lang)}
          </button>
        </div>
        <p className="hint">{t("note", lang)}</p>
      </section>

      {/* Preview + Settings */}
      <ConfigPreview />
    </div>
  );
}
