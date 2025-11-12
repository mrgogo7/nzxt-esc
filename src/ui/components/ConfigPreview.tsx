import React, { useState, useEffect, useRef } from "react";
import "../styles/ConfigPreview.css";
import { LANG_KEY, Lang, t, getInitialLang } from "../../i18n";

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
  showGuide?: boolean; // persisted overlay guide toggle
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

// Keys (kept backward compatible)
const CFG_KEY = "nzxtPinterestConfig";
const CFG_COMPAT = "nzxtMediaConfig";
const URL_KEY = "media_url";

export default function ConfigPreview() {
  const [lang, setLang] = useState<Lang>(getInitialLang());
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  // Keep LCD vs preview scale parity
  const lcdResolution = (window as any)?.nzxt?.v1?.width || 640;
  const previewSize = 200;
  const offsetScale = previewSize / lcdResolution;

  // Load persisted settings+url
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

  // Sync on storage changes (URL, config, language)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === URL_KEY && e.newValue !== null) setMediaUrl(e.newValue);
      if (e.key === CFG_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {/* ignore */}
      }
      if (e.key === LANG_KEY && e.newValue) {
        setLang(e.newValue as Lang);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist on any change here (keeps everything sticky, including showGuide)
  useEffect(() => {
    const save = { url: mediaUrl, ...settings };
    localStorage.setItem(CFG_KEY, JSON.stringify(save));
    localStorage.setItem(CFG_COMPAT, JSON.stringify(save));
    // notify listeners (e.g., Display, Config URL header)
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: CFG_KEY,
        newValue: JSON.stringify(save),
      })
    );
  }, [mediaUrl, settings]);

  const isVideo =
    /\.mp4($|\?)/i.test(mediaUrl) || mediaUrl.toLowerCase().includes("mp4");

  const base = (() => {
    switch (settings.align) {
      case "top":
        return { x: 50, y: 0 };
      case "bottom":
        return { x: 50, y: 100 };
      case "left":
        return { x: 0, y: 50 };
      case "right":
        return { x: 100, y: 50 };
      default:
        return { x: 50, y: 50 };
    }
  })();

  const adjX = settings.x * offsetScale;
  const adjY = settings.y * offsetScale;
  const objectPosition = `calc(${base.x}% + ${adjX}px) calc(${base.y}% + ${adjY}px)`;

  // Drag handlers (translate offsets in LCD pixels)
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
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Wheel zoom (non-passive)
  useEffect(() => {
    const circle = document.querySelector(".preview-circle");
    if (!circle) return;

    const onWheel = (e: WheelEvent) => {
      if (!circle.contains(e.target as Node)) return;
      e.preventDefault();
      const step = e.shiftKey ? 0.05 : e.ctrlKey ? 0.2 : 0.1;
      const delta = e.deltaY < 0 ? step : -step;
      setSettings((p) => ({
        ...p,
        scale: Math.min(Math.max(parseFloat((p.scale + delta).toFixed(2)), 0.1), 5),
      }));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const adjustScale = (delta: number) =>
    setSettings((p) => ({
      ...p,
      scale: Math.min(Math.max(parseFloat((p.scale + delta).toFixed(2)), 0.1), 5),
    }));

  const toggleGuide = (checked: boolean) =>
    setSettings((p) => ({ ...p, showGuide: checked }));

  return (
    <div className="config-wrapper">
      {/* LEFT: circular LCD preview */}
      <div className="preview-column">
        <div className="preview-title">{t("previewTitle", lang)}</div>

        <div
          className={`preview-circle ${isDragging ? "dragging" : ""}`}
          onMouseDown={handleMouseDown}
        >
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
                transformOrigin: "center center",
              }}
            >
              <div className="crosshair horizontal" />
              <div className="crosshair vertical" />
            </div>
          )}

          {/* Zoom buttons (center bottom inside the circle) */}
          <div className="zoom-buttons-bottom">
            <button onClick={() => adjustScale(-0.1)}>−</button>
            <button onClick={() => adjustScale(0.1)}>＋</button>
          </div>
        </div>
      </div>

      {/* RIGHT: settings */}
      <div className="settings-column">
        <div className="panel">
          <div className="panel-title">{t("settingsTitle", lang)}</div>

          <div className="overlay-toggle nice-row">
            <label className="switch">
              <input
                type="checkbox"
                checked={!!settings.showGuide}
                onChange={(e) => toggleGuide(e.target.checked)}
              />
              <span className="slider" />
            </label>
            <span className="switch-label">{t("overlayGuide", lang)}</span>
          </div>

          <div className="settings-grid">
            <label>{t("scale", lang)}</label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={settings.scale}
              onChange={(e) =>
                setSettings((p) => ({ ...p, scale: parseFloat(e.target.value || "1") }))
              }
            />

            <label>{t("xOffset", lang)}</label>
            <input
              type="number"
              value={settings.x}
              onChange={(e) =>
                setSettings((p) => ({ ...p, x: parseInt(e.target.value || "0", 10) }))
              }
            />

            <label>{t("yOffset", lang)}</label>
            <input
              type="number"
              value={settings.y}
              onChange={(e) =>
                setSettings((p) => ({ ...p, y: parseInt(e.target.value || "0", 10) }))
              }
            />

            <label>{t("align", lang)}</label>
            <select
              value={settings.align}
              onChange={(e) =>
                setSettings((p) => ({ ...p, align: e.target.value as Settings["align"] }))
              }
            >
              <option value="center">{t("alignCenter", lang)}</option>
              <option value="top">{t("alignTop", lang)}</option>
              <option value="bottom">{t("alignBottom", lang)}</option>
              <option value="left">{t("alignLeft", lang)}</option>
              <option value="right">{t("alignRight", lang)}</option>
            </select>

            <label>{t("fit", lang)}</label>
            <select
              value={settings.fit}
              onChange={(e) =>
                setSettings((p) => ({ ...p, fit: e.target.value as Settings["fit"] }))
              }
            >
              <option value="cover">{t("fitCover", lang)}</option>
              <option value="contain">{t("fitContain", lang)}</option>
              <option value="fill">{t("fitFill", lang)}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
