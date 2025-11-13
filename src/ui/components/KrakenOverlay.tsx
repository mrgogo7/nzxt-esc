import React, { useEffect, useState } from "react";

/*
  ================================================================
   KrakenOverlay
   LCD render surface for NZXT Kraken Elite.

   - Reads media URL + settings from localStorage (same keys as ConfigPreview)
   - Mirrors the LCD transform logic (scale, offset, align, fit)
   - Adds basic "Single Infographic" overlay support
   - Does NOT require any props (safe for ?kraken=1 entry)
  ================================================================
*/

type OverlayMode = "none" | "single" | "dual" | "triple";

type OverlayMetricKey =
  | "cpuTemp"
  | "cpuLoad"
  | "cpuClock"
  | "liquidTemp"
  | "gpuTemp"
  | "gpuLoad"
  | "gpuClock";

interface OverlaySettings {
  mode: OverlayMode;
  primaryMetric: OverlayMetricKey;
  numberColor: string;
  textColor: string;
}

interface Settings {
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
  overlay?: OverlaySettings; // optional to stay compatible with old saved configs
}

/**
 * Default overlay config when none is stored yet.
 */
const DEFAULT_OVERLAY: OverlaySettings = {
  mode: "none",
  primaryMetric: "cpuTemp",
  numberColor: "#ffffff",
  textColor: "#cccccc",
};

/**
 * Default visual settings (must match ConfigPreview logic).
 * NOTE: overlay is optional and will be merged with DEFAULT_OVERLAY at runtime.
 */
const DEFAULTS: Settings = {
  scale: 1,
  x: 0,
  y: 0,
  fit: "cover",
  align: "center",
  loop: true,
  autoplay: true,
  mute: true,
  resolution: "640 x 640",
  showGuide: false,
  overlay: DEFAULT_OVERLAY,
};

/**
 * Storage keys shared with the ConfigPreview component.
 */
const CFG_KEY = "nzxtPinterestConfig";
const CFG_COMPAT = "nzxtMediaConfig";
const URL_KEY = "media_url";

/**
 * Convert alignment setting to base percentage anchor.
 */
function getBaseAlign(align: Settings["align"]) {
  switch (align) {
    case "top":
      return { x: 50, y: 0 };
    case "bottom":
      return { x: 50, y: 100 };
    case "left":
      return { x: 0, y: 50 };
    case "right":
      return { x: 100, y: 50 };
    default:
      return { x: 50, y: 50 }; // center
  }
}

/**
 * Hook to provide monitoring data.
 * - In NZXT CAM, this should be replaced by @nzxt/web-integrations data.
 * - In normal browsers, it falls back to smooth mock values so the overlay
 *   still looks alive during development.
 */
function useMockOrRealMetrics() {
  const [data, setData] = useState({
    cpuTemp: 42,
    cpuLoad: 17,
    cpuClock: 4520,
    liquidTemp: 38,
    gpuTemp: 55,
    gpuLoad: 34,
    gpuClock: 1780,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const nzxt = (window as any)?.nzxt?.v1;

      // Real NZXT data path (to be aligned with @nzxt/web-integrations)
      if (nzxt && typeof nzxt.onMonitoringDataUpdate === "function") {
        // If user wires @nzxt/web-integrations, they can override this hook.
        // For now, we keep mock behaviour here and rely on future integration.
        // This block is left intentionally simple for forward compatibility.
      }

      // Mock animation for browser preview / development
      setData((prev) => ({
        cpuTemp: (prev.cpuTemp + 0.3) % 90,
        cpuLoad: (prev.cpuLoad + 1) % 100,
        cpuClock: 4500 + (prev.cpuClock % 200),
        liquidTemp: (prev.liquidTemp + 0.1) % 50,
        gpuTemp: (prev.gpuTemp + 0.2) % 80,
        gpuLoad: (prev.gpuLoad + 1.5) % 100,
        gpuClock: 1800 + (prev.gpuClock % 150),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return data;
}

/**
 * Single infographic overlay rendered on top of the media.
 * This is the first overlay mode we support.
 */
function SingleOverlay({
  overlay,
  metrics,
}: {
  overlay: OverlaySettings;
  metrics: ReturnType<typeof useMockOrRealMetrics>;
}) {
  if (overlay.mode !== "single") return null;

  const key = overlay.primaryMetric;
  const value = (metrics as any)[key];

  const numberColor = overlay.numberColor;
  const textColor = overlay.textColor;

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 20,
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "80px",
          fontWeight: 700,
          color: numberColor,
          lineHeight: 0.9,
        }}
      >
        {typeof value === "number" ? Math.round(value) : value}
      </div>
      <div
        style={{
          fontSize: "26px",
          color: textColor,
          marginTop: -6,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {key}
      </div>
    </div>
  );
}

/**
 * KrakenOverlay:
 * - No props
 * - Reads from localStorage (same data model as ConfigPreview)
 * - Renders the LCD-sized media (640x640) with the same transform logic
 * - Draws overlays on top of the media
 */
export default function KrakenOverlay() {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const metrics = useMockOrRealMetrics();

  // Determine LCD size from NZXT if available, otherwise default to 640.
  const lcdResolution = (window as any)?.nzxt?.v1?.width || 640;
  const lcdSize = lcdResolution; // square LCD

  // Load from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem(URL_KEY);
    const savedCfg =
      localStorage.getItem(CFG_KEY) || localStorage.getItem(CFG_COMPAT);

    if (savedCfg) {
      try {
        const parsed = JSON.parse(savedCfg);

        const cleaned = Object.fromEntries(
          Object.entries(parsed).filter(
            ([, v]) => v !== undefined && v !== null,
          ),
        );

        const mergedOverlay: OverlaySettings = {
          ...DEFAULT_OVERLAY,
          ...(cleaned.overlay || {}),
        };

        setSettings({
          ...DEFAULTS,
          ...cleaned,
          overlay: mergedOverlay,
        });

        setMediaUrl(cleaned.url || savedUrl || "");
      } catch {
        console.warn(
          "[KrakenOverlay] Failed to parse saved config, using defaults.",
        );
        setSettings(DEFAULTS);
        setMediaUrl(savedUrl || "");
      }
    } else {
      setSettings(DEFAULTS);
      setMediaUrl(savedUrl || "");
    }
  }, []);

  // Listen for config changes (ConfigPreview updates localStorage + storage events)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === URL_KEY && e.newValue !== null) {
        setMediaUrl(e.newValue);
      }
      if (e.key === CFG_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const mergedOverlay: OverlaySettings = {
            ...DEFAULT_OVERLAY,
            ...(parsed.overlay || {}),
          };

          setSettings((prev) => ({
            ...prev,
            ...parsed,
            overlay: mergedOverlay,
          }));
        } catch {
          // ignore malformed payloads
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isVideo =
    /\.mp4($|\?)/i.test(mediaUrl) || mediaUrl.toLowerCase().includes("mp4");

  const base = getBaseAlign(settings.align);

  // IMPORTANT:
  // - settings.x / settings.y are stored in REAL LCD px (not scaled).
  // - Here we apply them directly as px offsets in objectPosition.
  const objectPosition = `calc(${base.x}% + ${settings.x}px) calc(${base.y}% + ${settings.y}px)`;

  const overlayConfig: OverlaySettings = {
    ...DEFAULT_OVERLAY,
    ...(settings.overlay || {}),
  };

  return (
    <div
      style={{
        position: "relative",
        width: `${lcdSize}px`,
        height: `${lcdSize}px`,
        overflow: "hidden",
        borderRadius: "50%",
        background: "#000",
      }}
    >
      {isVideo ? (
        <video
          src={mediaUrl}
          autoPlay={settings.autoplay}
          muted={settings.mute}
          loop={settings.loop}
          playsInline
          style={{
            width: `${lcdSize}px`,
            height: `${lcdSize}px`,
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
            alt="NZXT LCD"
            style={{
              width: `${lcdSize}px`,
              height: `${lcdSize}px`,
              objectFit: settings.fit,
              objectPosition,
              transform: `scale(${settings.scale})`,
              transformOrigin: "center center",
            }}
          />
        )
      )}

      {/* Single Infographic overlay (more modes will be added later) */}
      <SingleOverlay overlay={overlayConfig} metrics={metrics} />
    </div>
  );
}
