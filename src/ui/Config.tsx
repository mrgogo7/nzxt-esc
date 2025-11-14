import { useEffect, useState } from 'react';
import { LANG_KEY, Lang, t, getInitialLang, setLang } from '../i18n';
import ConfigPreview from './components/ConfigPreview';
import './styles/ConfigPreview.css';
import { STORAGE_KEYS } from '../constants/storage';
import { DEFAULT_MEDIA_URL, DEFAULT_SETTINGS } from '../constants/defaults';
import { useMediaUrl } from '../hooks/useMediaUrl';
import { useConfig } from '../hooks/useConfig';

export default function Config() {
  const [lang, setLangState] = useState<Lang>(getInitialLang());
  const { mediaUrl, setMediaUrl } = useMediaUrl();
  const { setSettings } = useConfig();
  const [urlInput, setUrlInput] = useState<string>(mediaUrl);

  // Sync urlInput with mediaUrl changes
  useEffect(() => {
    setUrlInput(mediaUrl);
  }, [mediaUrl]);

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
    // Update media URL (useMediaUrl hook handles storage sync)
    setMediaUrl(urlInput);
  };

  const handleReset = () => {
    if (!window.confirm(t('resetConfirm', lang))) return;

    // Reset to defaults
    setMediaUrl(DEFAULT_MEDIA_URL);
    setUrlInput(DEFAULT_MEDIA_URL);
    
    // Reset settings to defaults (including overlay)
    setSettings({
      ...DEFAULT_SETTINGS,
      url: DEFAULT_MEDIA_URL,
    });
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
