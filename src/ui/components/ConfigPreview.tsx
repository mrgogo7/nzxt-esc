import React, { useEffect, useRef, useState } from "react";
import "../styles/ConfigPreview.css";
import { LANG_KEY, Lang, t, getInitialLang } from "../../i18n";
import {
  RefreshCw,
  Move,
  MoveDiagonal,
  MoveHorizontal,
  AlignStartHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignEndVertical,
  AlignVerticalSpaceAround,
} from "lucide-react";

/* =================================================================================================
   Overlay System – Types (future-proof)
================================================================================================= */

export type OverlayMode = "none" | "single" | "dual" | "triple";

export type OverlayMetricKey =
  | "cpuTemp"
  | "cpuLoad"
  | "cpuClock"
  | "liquidTemp"
  | "gpuTemp"
  | "gpuLoad"
  | "gpuClock";

export interface OverlaySettings {
  mode: OverlayMode;

  primaryMetric?: OverlayMetricKey;

  numberColor?: string;
  textColor?: string;

  numberSize?: number;
  textSize?: number;

  circularBar?: {
    enabled: boolean;
    color: string;
    thickness: number;
    opacity: number;
  };
}

/* =================================================================================================
   Main Settings
================================================================================================= */

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

  overlay?: OverlaySettings;
};

/* =================================================================================================
   Default Settings
================================================================================================= */

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

  overlay: {
    mode: "none",
    primaryMetric: "cpuTemp",

    numberColor: "#FFFFFF",
    textColor: "#E5E7EB",

    numberSize: 38,
    textSize: 14,

    circularBar: {
      enabled: false,
      color: "#00A2FF",
      thickness: 6,
      opacity: 0.9,
    },
  },
};

const CFG_KEY = "nzxtPinterestConfig";
const CFG_COMPAT = "nzxtMediaConfig";
const URL_KEY = "media_url";

/* =================================================================================================
   Component
================================================================================================= */

export default function ConfigPreview() {
  const [lang, setLang] = useState<Lang>(getInitialLang());
  const [mediaUrl, setMediaUrl] = useState("");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const hasLoadedRef = useRef(false);
  const hasInteractedRef = useRef(false);

  const lcdResolution = (window as any)?.nzxt?.v1?.width || 640;
  const previewSize = 200;
  const offsetScale = previewSize / lcdResolution;

  /* ================================================================================================
     Load settings (deep merge for overlay compatibility)
  ================================================================================================= */

  useEffect(() => {
    const savedURL = localStorage.getItem(URL_KEY);
    const savedCfg =
      localStorage.getItem(CFG_KEY) || localStorage.getItem(CFG_COMPAT);

    if (savedCfg) {
      try {
        const parsed = JSON.parse(savedCfg);

        const merged: Settings = {
          ...DEFAULTS,
          ...parsed,
          overlay: {
            ...DEFAULTS.overlay,
            ...(parsed.overlay || {}),
            circularBar: {
              ...DEFAULTS.overlay?.circularBar,
              ...(parsed.overlay?.circularBar || {}),
            },
          },
        };

        setSettings(merged);
        setMediaUrl(parsed.url || savedURL || "");
      } catch {
        console.warn("⚠ Failed to load config, using defaults.");
        setSettings(DEFAULTS);
        setMediaUrl(savedURL || "");
      }
    } else {
      setSettings(DEFAULTS);
      setMediaUrl(savedURL || "");
    }

    if (!localStorage.getItem(LANG_KEY)) {
      setLang(getInitialLang());
    }

    hasLoadedRef.current = true;
  }, []);

  /* ================================================================================================
     Unlock realtime sync after first interaction
  ================================================================================================= */

  useEffect(() => {
    const enableRealtime = () => (hasInteractedRef.current = true);
    window.addEventListener("mousedown", enableRealtime, { once: true });
    window.addEventListener("wheel", enableRealtime, { once: true });
    window.addEventListener("keydown", enableRealtime, { once: true });

    return () => {
      window.removeEventListener("mousedown", enableRealtime);
      window.removeEventListener("wheel", enableRealtime);
      window.removeEventListener("keydown", enableRealtime);
    };
  }, []);

  /* ================================================================================================
     Multi-tab + NZXT CAM sync
  ================================================================================================= */

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === URL_KEY && e.newValue !== null) setMediaUrl(e.newValue);

      if (e.key === CFG_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);

          setSettings((prev) => ({
            ...prev,
            ...parsed,
            overlay: {
              ...prev.overlay,
              ...(parsed.overlay || {}),
              circularBar: {
                ...prev.overlay?.circularBar,
                ...(parsed.overlay?.circularBar || {}),
              },
            },
          }));
        } catch {}
      }

      if (e.key === LANG_KEY && e.newValue) setLang(e.newValue as Lang);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* ================================================================================================
     Persist config every 100ms
  ================================================================================================= */

  const lastSync = useRef(0);
  useEffect(() => {
    if (!hasLoadedRef.current || !hasInteractedRef.current) return;

    const now = Date.now();
    if (now - lastSync.current < 100) return;
    lastSync.current = now;

    const save = { url: mediaUrl, ...settings };

    localStorage.setItem(CFG_KEY, JSON.stringify(save));
    localStorage.setItem(CFG_COMPAT, JSON.stringify(save));

    window.dispatchEvent(
      new StorageEvent("storage", { key: CFG_KEY, newValue: JSON.stringify(save) })
    );
  }, [mediaUrl, settings]);

  /* ================================================================================================
     Helpers
  ================================================================================================= */

  const isVideo =
    /\.mp4($|\?)/i.test(mediaUrl) || mediaUrl.toLowerCase().includes("mp4");

  const baseAlign = (() => {
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

  const objectPosition = `calc(${baseAlign.x}% + ${adjX}px) calc(${baseAlign.y}% + ${adjY}px)`;

  /* ================================================================================================
     Dragging
  ================================================================================================= */

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const onDragMove = (e: MouseEvent) => {
    if (!isDragging || !dragStart.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    setSettings((prev) => ({
      ...prev,
      x: prev.x + Math.round(dx / offsetScale),
      y: prev.y + Math.round(dy / offsetScale),
    }));
  };

  const stopDrag = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onDragMove);
      window.addEventListener("mouseup", stopDrag);
    } else {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", stopDrag);
    }
  }, [isDragging]);

  /* ================================================================================================
     Wheel Zoom
  ================================================================================================= */

  useEffect(() => {
    const circle = document.querySelector(".preview-circle");
    if (!circle) return;

    const onWheel = (e: WheelEvent) => {
      if (!circle.contains(e.target as Node)) return;
      e.preventDefault();

      const step = e.ctrlKey ? 0.2 : 0.1;
      const delta = e.deltaY < 0 ? step : -step;

      setSettings((prev) => ({
        ...prev,
        scale: Math.min(Math.max(parseFloat((prev.scale + delta).toFixed(2)), 0.1), 5),
      }));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const adjustScale = (delta: number) =>
    setSettings((prev) => ({
      ...prev,
      scale: Math.min(Math.max(parseFloat((prev.scale + delta).toFixed(2)), 0.1), 5),
    }));

  const resetField = (field: keyof Settings) =>
    setSettings((prev) => ({ ...prev, [field]: DEFAULTS[field] }));

  /* ================================================================================================
     UI Icon Groups
  ================================================================================================= */

  const alignIcons = [
    { key: "center", icon: <AlignVerticalSpaceAround size={16} /> },
    { key: "top", icon: <AlignStartHorizontal size={16} /> },
    { key: "bottom", icon: <AlignEndHorizontal size={16} /> },
    { key: "left", icon: <AlignStartVertical size={16} /> },
    { key: "right", icon: <AlignEndVertical size={16} /> },
  ];

  const fitIcons = [
    { key: "cover", icon: <Move size={16} /> },
    { key: "contain", icon: <MoveDiagonal size={16} /> },
    { key: "fill", icon: <MoveHorizontal size={16} /> },
  ];

  /* ================================================================================================
     Render
  ================================================================================================= */

  return (
    <div className="config-wrapper">

      {/* LEFT - LIVE LCD PREVIEW */}
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

      {/* RIGHT - SETTINGS + OVERLAY PANEL */}
      <div className="settings-column">

        {/* SETTINGS PANEL */}
        <div className="panel">
          <div className="panel-header">
            <h3>{t("settingsTitle", lang)}</h3>

            <div className="overlay-toggle-compact">
              <span>{t("overlayGuide", lang)}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={!!settings.showGuide}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, showGuide: e.target.checked }))
                  }
                />
                <span className="slider" />
              </label>
            </div>
          </div>

          <div className="settings-grid-modern">
            {[
              { field: "scale", label: t("scale", lang), step: 0.1 },
              { field: "x", label: t("xOffset", lang) },
              { field: "y", label: t("yOffset", lang) },
            ].map(({ field, label, step }) => (
              <div className="setting-row" key={field}>
                <label>{label}</label>
                <input
                  type="number"
                  step={step || 1}
                  value={(settings as any)[field]}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
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

            {/* ALIGN */}
            <div className="setting-row">
              <label>{t("align", lang)}</label>
              <div className="icon-group">
                {alignIcons.map(({ key, icon }) => (
                  <button
                    key={key}
                    className={`icon-btn ${settings.align === key ? "active" : ""}`}
                    title={t(
                      `align${key[0].toUpperCase() + key.slice(1)}`,
                      lang
                    )}
                    onClick={() =>
                      setSettings((prev) => ({ ...prev, align: key as any }))
                    }
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <button
                className="reset-icon"
                title="Reset"
                onClick={() => resetField("align")}
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {/* FIT */}
            <div className="setting-row">
              <label>{t("fit", lang)}</label>
              <div className="icon-group">
                {fitIcons.map(({ key, icon }) => (
                  <button
                    key={key}
                    className={`icon-btn ${settings.fit === key ? "active" : ""}`}
                    title={t(
                      `fit${key[0].toUpperCase() + key.slice(1)}`,
                      lang
                    )}
                    onClick={() =>
                      setSettings((prev) => ({ ...prev, fit: key as any }))
                    }
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <button
                className="reset-icon"
                title="Reset"
                onClick={() => resetField("fit")}
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================================
            OVERLAY PANEL
        ================================================================================ */}
        <div className="panel" style={{ marginTop: 16 }}>
          <div className="panel-header">
            <h3>Overlay Options</h3>
          </div>

          <div className="settings-grid-modern">

            {/* Overlay Mode */}
            <div className="setting-row">
              <label>Overlay Mode</label>
              <select
                className="url-input"
                style={{ maxWidth: 180 }}
                value={settings.overlay?.mode || "none"}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    overlay: {
                      ...prev.overlay!,
                      mode: e.target.value as OverlayMode,
                    },
                  }))
                }
              >
                <option value="none">None</option>
                <option value="single">Single Infographic</option>
                <option value="dual">Dual Infographic</option>
                <option value="triple">Triple Infographic</option>
              </select>
            </div>

            {/* ONLY SHOW WHEN SINGLE MODE */}
            {settings.overlay?.mode === "single" && (
              <>
                {/* Primary Metric */}
                <div className="setting-row">
                  <label>Primary Reading</label>
                  <select
                    className="url-input"
                    style={{ maxWidth: 180 }}
                    value={settings.overlay?.primaryMetric || "cpuTemp"}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        overlay: {
                          ...prev.overlay!,
                          primaryMetric: e.target.value as OverlayMetricKey,
                        },
                      }))
                    }
                  >
                    <option value="cpuTemp">CPU Temperature</option>
                    <option value="cpuLoad">CPU Load</option>
                    <option value="cpuClock">CPU Clock Speed</option>
                    <option value="liquidTemp">Liquid Temperature</option>
                    <option value="gpuTemp">GPU Temperature</option>
                    <option value="gpuLoad">GPU Load</option>
                    <option value="gpuClock">GPU Clock Speed</option>
                  </select>
                </div>

                {/* Number Color */}
                <div className="setting-row">
                  <label>Number Color</label>
                  <input
                    type="color"
                    value={settings.overlay?.numberColor || "#FFFFFF"}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        overlay: {
                          ...prev.overlay!,
                          numberColor: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                {/* Text Color */}
                <div className="setting-row">
                  <label>Text Color</label>
                  <input
                    type="color"
                    value={settings.overlay?.textColor || "#E5E7EB"}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        overlay: {
                          ...prev.overlay!,
                          textColor: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
