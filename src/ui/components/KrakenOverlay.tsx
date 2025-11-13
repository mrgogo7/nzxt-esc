import React, { useEffect, useState } from "react";

/*
  ================================================================
   KrakenOverlay
   LCD render surface for NZXT Kraken Elite.

   - Reads media URL + settings from localStorage
   - Mirrors LCD transform logic (scale, offset, align, fit)
   - Fully supports Single Infographic overlays:
       ➤ Number font
       ➤ Label font
       ➤ Number size
       ➤ Label size
       ➤ °  %  MHz suffixes
       ➤ CPU / GPU / Liquid label mapping
   - Registers window.nzxt.v1.onMonitoringDataUpdate so CAM pushes
     real monitoring data every second.
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

  numberFont: string;  // gotham-bold, arial-bold
  textFont: string;

  numberSize: number;  // px
  textSize: number;    // px
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
  overlay?: OverlaySettings;
}

const DEFAULT_OVERLAY: OverlaySettings = {
  mode: "none",
  primaryMetric: "cpuTemp",
  numberColor: "#ffffff",
  textColor: "#cccccc",
  numberFont: "arial-bold",
  textFont: "arial-bold",
  numberSize: 80,
  textSize: 26,
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
  resolution: "640 x 640",
  showGuide: false,
  overlay: DEFAULT_OVERLAY,
};

const CFG_KEY = "nzxtPinterestConfig";
const CFG_COMPAT = "nzxtMediaConfig";
const URL_KEY = "media_url";

function getBaseAlign(align: Settings["align"]) {
  switch (align) {
    case "top": return { x: 50, y: 0 };
    case "bottom": return { x: 50, y: 100 };
    case "left": return { x: 0, y: 50 };
    case "right": return { x: 100, y: 50 };
    default: return { x: 50, y: 50 };
  }
}

function pickNumeric(...vals: unknown[]): number {
  for (const v of vals)
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  return 0;
}

type OverlayMetrics = {
  cpuTemp: number;
  cpuLoad: number;
  cpuClock: number;
  liquidTemp: number;
  gpuTemp: number;
  gpuLoad: number;
  gpuClock: number;
};

const DEFAULT_METRICS: OverlayMetrics = {
  cpuTemp: 0,
  cpuLoad: 0,
  cpuClock: 0,
  liquidTemp: 0,
  gpuTemp: 0,
  gpuLoad: 0,
  gpuClock: 0,
};

function mapMonitoringToOverlay(data: any): OverlayMetrics {
  const cpu0 = data?.cpus?.[0];
  const gpu0 = data?.gpus?.[0];
  const kraken = data?.kraken;

  const rawCpuLoad = pickNumeric(
    cpu0?.load, cpu0?.usage, cpu0?.totalLoad, cpu0?.processorLoad
  );
  const rawGpuLoad = pickNumeric(
    gpu0?.load, gpu0?.usage, gpu0?.totalLoad
  );

  const cpuLoad = rawCpuLoad <= 1 ? rawCpuLoad * 100 : rawCpuLoad;
  const gpuLoad = rawGpuLoad <= 1 ? rawGpuLoad * 100 : rawGpuLoad;

  return {
    cpuTemp: pickNumeric(
      cpu0?.temperature,
      cpu0?.currentTemperature,
      cpu0?.packageTemperature
    ),
    cpuLoad,
    cpuClock: pickNumeric(
      cpu0?.clockSpeed,
      cpu0?.frequency,
      cpu0?.frequencyMhz,
      cpu0?.frequencyMHz,
      cpu0?.processorFrequency
    ),
    liquidTemp: pickNumeric(
      kraken?.liquidTemperature,
      kraken?.temperature,
      kraken?.liquidTemp
    ),
    gpuTemp: pickNumeric(
      gpu0?.temperature, gpu0?.currentTemperature, gpu0?.gpuTemperature
    ),
    gpuLoad,
    gpuClock: pickNumeric(
      gpu0?.coreFrequency,
      gpu0?.clockSpeed,
      gpu0?.frequency,
      gpu0?.frequencyMHz,
      gpu0?.frequencyMhz,
      gpu0?.gpuFrequency
    ),
  };
}

function useMonitoringMetrics(): OverlayMetrics {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  useEffect(() => {
    const isKraken = new URLSearchParams(window.location.search).get("kraken") === "1";

    if (isKraken) {
      const handler = (data: any) => {
        try {
          const mapped = mapMonitoringToOverlay(data);
          setMetrics(mapped);
        } catch (e) {
          console.warn("[NZXT] Mapping error:", e);
        }
      };

      const w = window as any;
      const prev = w.nzxt || {};
      const prevV1 = prev.v1 || {};

      w.nzxt = {
        ...prev,
        v1: { ...prevV1, onMonitoringDataUpdate: handler },
      };

      return () => {
        const cur = (window as any).nzxt?.v1;
        if (cur?.onMonitoringDataUpdate === handler)
          delete cur.onMonitoringDataUpdate;
      };
    }

    let t = 0;
    const intv = setInterval(() => {
      t++;
      setMetrics({
        cpuTemp: 40 + 10 * Math.sin(t / 15),
        cpuLoad: (t * 3) % 100,
        cpuClock: 4500 + (t % 200),
        liquidTemp: 34 + 5 * Math.sin(t / 40),
        gpuTemp: 50 + 10 * Math.sin(t / 25),
        gpuLoad: (t * 2) % 100,
        gpuClock: 1800 + (t % 150),
      });
    }, 1000);

    return () => clearInterval(intv);
  }, []);

  return metrics;
}

function SingleOverlay({
  overlay,
  metrics,
}: {
  overlay: OverlaySettings;
  metrics: OverlayMetrics;
}) {
  if (overlay.mode !== "single") return null;

  const key = overlay.primaryMetric;
  const value = metrics[key];

  let formatted = Math.round(value).toString();
  if (key.includes("Temp")) formatted += "°";
  if (key.includes("Load")) formatted += "%";
  if (key.includes("Clock")) formatted += " MHz";

  let label = "DATA";
  if (key.startsWith("cpu")) label = "CPU";
  if (key.startsWith("gpu")) label = "GPU";
  if (key.startsWith("liquid")) label = "Liquid";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: `${overlay.numberSize}px`,
          color: overlay.numberColor,
          fontFamily: overlay.numberFont,
          fontWeight: 700,
          lineHeight: 0.9,
        }}
      >
        {formatted}
      </div>
      <div
        style={{
          marginTop: -4,
          fontSize: `${overlay.textSize}px`,
          color: overlay.textColor,
          fontFamily: overlay.textFont,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function KrakenOverlay() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const metrics = useMonitoringMetrics();

  useEffect(() => {
    const savedUrl = localStorage.getItem(URL_KEY);
    const savedCfg = localStorage.getItem(CFG_KEY) || localStorage.getItem(CFG_COMPAT);

    if (savedCfg) {
      try {
        const parsed = JSON.parse(savedCfg);
        const cleaned = Object.fromEntries(
          Object.entries(parsed).filter(([, v]) => v !== undefined && v !== null)
        );

        const mergedOverlay = {
          ...DEFAULT_OVERLAY,
          ...(cleaned.overlay || {}),
        };

        setSettings({ ...DEFAULTS, ...cleaned, overlay: mergedOverlay });
        setMediaUrl(cleaned.url || savedUrl || "");
      } catch {
        setSettings(DEFAULTS);
        setMediaUrl(savedUrl || "");
      }
    }
  }, []);

  const lcdResolution = (window as any)?.nzxt?.v1?.width || 640;
  const lcdSize = lcdResolution;

  const base = getBaseAlign(settings.align);
  const objectPosition = `calc(${base.x}% + ${settings.x}px) calc(${base.y}% + ${settings.y}px)`;

  const overlay = {
    ...DEFAULT_OVERLAY,
    ...(settings.overlay || {}),
  };

  const isVideo = mediaUrl?.toLowerCase().includes("mp4");

  return (
    <div
      style={{
        width: `${lcdSize}px`,
        height: `${lcdSize}px`,
        position: "relative",
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
            width: lcdSize,
            height: lcdSize,
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
            alt=""
            style={{
              width: lcdSize,
              height: lcdSize,
              objectFit: settings.fit,
              objectPosition,
              transform: `scale(${settings.scale})`,
              transformOrigin: "center center",
            }}
          />
        )
      )}

      <SingleOverlay overlay={overlay} metrics={metrics} />
    </div>
  );
}
