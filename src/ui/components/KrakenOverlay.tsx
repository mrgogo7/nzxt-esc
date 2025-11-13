import React, { useEffect, useMemo, useState, CSSProperties } from "react";

/**
 * KrakenOverlay
 *
 * Shown only inside NZXT Kraken Browser (?kraken=1).
 * Renders the user's selected media PLUS the infographic overlay.
 * Uses settings saved by ConfigPreview.
 */

const CFG_KEY = "nzxtPinterestConfig";
const CFG_COMPAT = "nzxtMediaConfig";
const URL_KEY = "media_url";

// Types must match ConfigPreview logic
export type OverlayMode = "none" | "single" | "dual" | "triple";

export type OverlayMetricKey =
  | "cpuTemp"
  | "cpuLoad"
  | "cpuClock"
  | "liquidTemp"
  | "gpuTemp"
  | "gpuLoad"
  | "gpuClock";

type Settings = {
  scale: number;
  x: number; // LCD pixel offsets
  y: number;
  fit: "cover" | "contain" | "fill";
  align: "center" | "top" | "bottom" | "left" | "right";
  loop: boolean;
  autoplay: boolean;
  mute: boolean;
  resolution: string;

  overlay?: {
    mode: OverlayMode;
    primaryMetric: OverlayMetricKey;
    numberColor: string;
    textColor: string;
  };
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
  resolution: `${window.innerWidth}x${window.innerHeight}`,
  overlay: {
    mode: "none",
    primaryMetric: "cpuTemp",
    numberColor: "#ffffff",
    textColor: "#ffffff",
  },
};

type MonitoringData = any;

// Detect media type
const isVideoUrl = (url: string): boolean =>
  /\.mp4($|\?)/i.test(url) || url.toLowerCase().includes("mp4");

// Human-readable labels
const readingLabelMap: Record<OverlayMetricKey, string> = {
  cpuTemp: "CPU Temperature",
  cpuLoad: "CPU Load",
  cpuClock: "CPU Clock Speed",
  liquidTemp: "Liquid Temperature",
  gpuTemp: "GPU Temperature",
  gpuLoad: "GPU Load",
  gpuClock: "GPU Clock Speed",
};

export default function KrakenOverlay() {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [monitoring, setMonitoring] = useState<MonitoringData | null>(null);

  // Load settings
  useEffect(() => {
    try {
      const savedUrl = localStorage.getItem(URL_KEY) || "";
      const savedCfg =
        localStorage.getItem(CFG_KEY) ||
        localStorage.getItem(CFG_COMPAT);

      if (savedCfg) {
        const parsed = JSON.parse(savedCfg);
        const merged: Settings = {
          ...DEFAULTS,
          ...parsed,
          overlay: {
            ...DEFAULTS.overlay!,
            ...(parsed.overlay || {}),
          },
        };

        setSettings(merged);
        setMediaUrl(parsed.url || savedUrl || "");
      } else {
        setSettings(DEFAULTS);
        setMediaUrl(savedUrl || "");
      }
    } catch {
      setSettings(DEFAULTS);
    }
  }, []);

  // Listen configuration updates
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (!e.key) return;

      if (e.key === URL_KEY && e.newValue) {
        setMediaUrl(e.newValue);
      }

      if ((e.key === CFG_KEY || e.key === CFG_COMPAT) && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSettings((p) => ({
            ...p,
            ...parsed,
            overlay: {
              ...p.overlay!,
              ...(parsed.overlay || {}),
            },
          }));
        } catch {}
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // monitoring hook
  useEffect(() => {
    const w = window as any;

    const nz = w.nzxt || {};
    const v1 = nz.v1 || {};
    const prevHandler = v1.onMonitoringDataUpdate;

    w.nzxt = {
      ...nz,
      v1: {
        ...v1,
        onMonitoringDataUpdate: (data: MonitoringData) => {
          setMonitoring(data);
          if (typeof prevHandler === "function") {
            try {
              prevHandler(data);
            } catch {}
          }
        },
      },
    };

    return () => {
      const cur = (window as any).nzxt || {};
      const curv1 = cur.v1 || {};

      (window as any).nzxt = {
        ...cur,
        v1: { ...curv1, onMonitoringDataUpdate: prevHandler },
      };
    };
  }, []);

  // Compute objectPosition
  const objectPosition = useMemo(() => {
    const a = settings.align;
    const base = {
      top: { x: 50, y: 0 },
      bottom: { x: 50, y: 100 },
      left: { x: 0, y: 50 },
      right: { x: 100, y: 50 },
      center: { x: 50, y: 50 },
    }[a];

    return `calc(${base.x}% + ${settings.x}px) calc(${base.y}% + ${settings.y}px)`;
  }, [settings.align, settings.x, settings.y]);

  // Extract value/unit/label
  const { v, u, lbl } = useMemo(() => {
    const key = settings.overlay?.primaryMetric || "cpuTemp";
    const label = readingLabelMap[key];

    const data = monitoring || {};
    const cpu = data.cpus?.[0] || {};
    const gpu = data.gpus?.[0] || {};
    const k = data.kraken || {};

    const safe = (n: any): number | null =>
      typeof n === "number" && !isNaN(n) ? n : null;

    let raw: number | null = null;
    let unit = "";

    switch (key) {
      case "cpuTemp":
        raw = safe(cpu.temperature) ?? safe(k.cpuTemp);
        unit = "°C";
        break;

      case "cpuLoad":
        raw = safe(cpu.load) ?? safe(k.cpuLoad);
        unit = "%";
        break;

      case "cpuClock":
        raw = safe(cpu.clockSpeed) ?? safe(k.cpuClock);
        unit = "MHz";
        break;

      case "liquidTemp":
        raw = safe(k.liquidTemp) ?? safe(k.liquidTemperature);
        unit = "°C";
        break;

      case "gpuTemp":
        raw = safe(gpu.temperature) ?? safe(k.gpuTemp);
        unit = "°C";
        break;

      case "gpuLoad":
        raw = safe(gpu.load) ?? safe(k.gpuLoad);
        unit = "%";
        break;

      case "gpuClock":
        raw = safe(gpu.clockSpeed) ?? safe(k.gpuClock);
        unit = "MHz";
        break;
    }

    return {
      v: raw !== null ? Math.round(raw).toString() : "--",
      u: raw !== null ? unit : "",
      lbl: label,
    };
  }, [monitoring, settings.overlay]);

  const isVideo = isVideoUrl(mediaUrl);

  // Overlay styles
  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: settings.overlay?.mode === "single" ? "flex" : "none",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  const numberStyle: CSSProperties = {
    fontSize: "52px",
    fontWeight: 700,
    color: settings.overlay?.numberColor || "#fff",
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
    textShadow: "0 0 6px rgba(0,0,0,0.8)",
  };

  const unitStyle: CSSProperties = {
    fontSize: "18px",
    opacity: 0.9,
  };

  const labelStyle: CSSProperties = {
    marginTop: "4px",
    fontSize: "14px",
    color: settings.overlay?.textColor || "#fff",
    opacity: 0.85,
    textShadow: "0 0 4px rgba(0,0,0,0.8)",
  };

  // layout container
  const box: CSSProperties = {
    width: "100%",
    height: "100%",
    background: "#000",
    overflow: "hidden",
    position: "relative",
  };

  const mediaStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: settings.fit,
    objectPosition,
    transform: `scale(${settings.scale})`,
  };

  return (
    <div style={box}>
      {mediaUrl &&
        (isVideo ? (
          <video
            src={mediaUrl}
            autoPlay={settings.autoplay}
            muted={settings.mute}
            loop={settings.loop}
            playsInline
            style={mediaStyle}
          />
        ) : (
          <img src={mediaUrl} style={mediaStyle} alt="" />
        ))}

      <div style={overlayStyle}>
        <div style={numberStyle}>
          <span>{v}</span>
          {u && <span style={unitStyle}>{u}</span>}
        </div>
        <div style={labelStyle}>{lbl}</div>
      </div>
    </div>
  );
}
