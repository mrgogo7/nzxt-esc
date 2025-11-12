import React, { useState, useEffect, useRef } from "react";
import "../styles/ConfigPreview.css";
import { LANG_KEY, Lang, t, getInitialLang } from "../../i18n";
import {
  RefreshCw,
  AlignCenter,
  AlignVerticalJustifyCenter,
  AlignLeft,
  AlignRight,
  AlignTop,
  AlignBottom,
  Maximize2,
  Square,
  StretchHorizontal,
} from "lucide-react"; // icon set

type Settings = {
  scale: number;
  x: number;
  y: number;
  fit: "cover" | "contain" | "fill";
  align: "center" | "top" | "bottom" | "left" | "right";
  loop: boolean;
  autoplay: boolean;
  mute: boolean;
  resolution: string;
  showGuide?: boolean;
};

const DEFAULTS: Settings = {
  scale: 1,
  x: 0,
  y: 0,
  fit: "cover",
  align: "center",
  loop: true,
  autoplay: true,
  mute: true,
  resolution: `${window.innerWidth} x ${window.innerHeight}`,
  showGuide: true,
};

const CFG_KEY = "nzxtPinterestConfig";
const CFG_COMPAT = "nzxtMediaConfig";
const URL_KEY = "media_url";

export default function ConfigPreview() {
  const [lang, setLang] = useState<Lang>(getInitialLang());
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const lcdResolution = (window as any)?.nzxt?.v1?.width || 640;
  const previewSize = 200;
  const offsetScale = previewSize / lcdResolution;

  useEffect(() => {
    const cfgRaw =
      localStorage.getItem(CFG_KEY) || localStorage.getItem(CFG_COMPAT);
    const savedUrl = localStorage.getItem(URL_KEY);
    if (cfgRaw) {
      try {
        const parsed = JSON.parse(cfgRaw);
        setSettings({ ...DEFAULTS, ...parsed });
        setMediaUrl(parsed.url || savedUrl || "");
      } catch {
        setSettings(DEFAULTS);
        setMediaUrl(savedUrl || "");
      }
    } else {
      setSettings(DEFAULTS);
      setMediaUrl(savedUrl || "");
    }
    setLang(getInitialLang());
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === URL_KEY && e.newValue !== null) setMediaUrl(e.newValue);
      if (e.key === CFG_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings((p) => ({ ...p, ...parsed }));
        } catch {}
      }
      if (e.key === LANG_KEY && e.newValue) setLang(e.newValue as Lang);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const save = { url: mediaUrl, ...settings };
    localStorage.setItem(CFG_KEY, JSON.stringify(save));
    localStorage.setItem(CFG_COMPAT, JSON.stringify(save));
  }, [mediaUrl, settings]);

  const isVideo =
    /\.mp4($|\?)/i.test(mediaUrl) || mediaUrl.toLowerCase().includes("mp4");

  const base = (() => {
    switch (settings.align) {
      case "top": return { x: 50, y: 0 };
      case "bottom": return { x: 50, y: 100 };
      case "left": return { x: 0, y: 50 };
      case "right": return { x: 100, y: 50 };
      default: return { x: 50, y: 50 };
    }
  })();

  const adjX = settings.x * offsetScale;
  const adjY = settings.y * offsetScale;
  const objectPosition = `calc(${base.x}% + ${adjX}px) calc(${base.y}% + ${adjY}px)`;

  // --- Mouse interactions ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setSettings((p) => ({
      ...p,
      x: p.x + Math.round(dx / offsetScale),
      y: p.y + Math.round(dy / offsetScale),
    }));
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDragging]);

  const adjustScale = (delta: number) =>
    setSettings((p) => ({
      ...p,
      scale: Math.min(Math.max(parseFloat((p.scale + delta).toFixed(2)), 0.1), 5),
    }));

  // Reset helper for any field
  const resetField = (field: keyof Settings) => {
    setSettings((p) => ({ ...p, [field]: DEFAULTS[field] }));
  };

  const alignIcons = [
    { key: "center", icon: <AlignCenter size={16} /> },
    { key: "top", icon: <AlignTop size={16} /> },
    { key: "bottom", icon: <AlignBottom size={16} /> },
    { key: "left", icon: <AlignLeft size={16} /> },
    { key: "right", icon: <AlignRight size={16} /> },
  ];
  const fitIcons = [
    { key: "cover", icon: <Maximize2 size={16} /> },
    { key: "contain", icon: <Square size={16} /> },
    { key: "fill", icon: <StretchHorizontal size={16} /> },
  ];

  return (
    <div className="config-wrapper">
      {/* --- Left side preview --- */}
      <div className="preview-column">
        <div className="preview-title">{t("previewTitle", lang)}</div>

        <div className={`preview-circle ${isDragging ? "dragging" : ""}`} onMouseDown={handleMouseDown}>
          <div className="scale-label">Scale: {settings.scale.toFixed(2)}×</div>
          {isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: settings.fit,
                objectPosition,
                transform: `scale(${settings.scale})`,
                transformOrigin: "center center",
              }}
            />
          ) : (
            mediaUrl && (
              <img
                src={mediaUrl}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: settings.fit,
                  objectPosition,
                  transform: `scale(${settings.scale})`,
                  transformOrigin: "center center",
                }}
              />
            )
          )}

          {settings.showGuide && (
            <div
              className="overlay-guide"
              style={{
                transform: `translate(${settings.x * offsetScale}px, ${
                  settings.y * offsetScale
                }px) scale(${settings.scale})`,
              }}
            >
              <div className="crosshair horizontal" />
              <div className="crosshair vertical" />
            </div>
          )}

          <div className="zoom-buttons-bottom">
            <button onClick={() => adjustScale(-0.1)}>−</button>
            <button onClick={() => adjustScale(0.1)}>＋</button>
          </div>
        </div>
      </div>

      {/* --- Right side settings --- */}
      <div className="settings-column">
        <div className="panel">
          <div className="panel-header">
            <h3>{t("settingsTitle", lang)}</h3>
            <div className="overlay-toggle-compact">
              <span>{t("overlayGuide", lang)}</span>
              <label className="switch small">
                <input
                  type="checkbox"
                  checked={!!settings.showGuide}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, showGuide: e.target.checked }))
                  }
                />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="settings-grid-modern">
            {[
              { label: t("scale", lang), field: "scale" },
              { label: t("xOffset", lang), field: "x" },
              { label: t("yOffset", lang), field: "y" },
            ].map(({ label, field }) => (
              <div className="setting-row" key={field}>
                <label>{label}</label>
                <input
                  type="number"
                  value={settings[field as keyof Settings] as any}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      [field]: parseFloat(e.target.value || "0"),
                    }))
                  }
                />
                <button
                  className="reset-icon"
                  title="Reset"
                  onClick={() => resetField(field as keyof Settings)}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            ))}

            {/* Align Icons */}
            <div className="setting-row">
              <label>{t("align", lang)}</label>
              <div className="icon-group">
                {alignIcons.map(({ key, icon }) => (
                  <button
                    key={key}
                    className={`icon-btn ${settings.align === key ? "active" : ""}`}
                    title={t(`align${key[0].toUpperCase() + key.slice(1)}`, lang)}
                    onClick={() =>
                      setSettings((p) => ({ ...p, align: key as Settings["align"] }))
                    }
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <button
                className="reset-icon"
                onClick={() => resetField("align")}
                title="Reset"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {/* Fit Icons */}
            <div className="setting-row">
              <label>{t("fit", lang)}</label>
              <div className="icon-group">
                {fitIcons.map(({ key, icon }) => (
                  <button
                    key={key}
                    className={`icon-btn ${settings.fit === key ? "active" : ""}`}
                    title={t(`fit${key[0].toUpperCase() + key.slice(1)}`, lang)}
                    onClick={() =>
                      setSettings((p) => ({ ...p, fit: key as Settings["fit"] }))
                    }
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <button
                className="reset-icon"
                onClick={() => resetField("fit")}
                title="Reset"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
