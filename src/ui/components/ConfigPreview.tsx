import React, { useState, useEffect } from "react";
import "../styles/ConfigPreview.css";

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
};

const DEFAULTS: Settings = {
  scale: 1.0,
  x: 0,
  y: 0,
  fit: "cover",
  align: "center",
  loop: true,
  autoplay: true,
  mute: true,
  resolution: `${window.innerWidth} x ${window.innerHeight}`,
};

export default function ConfigPreview() {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  // Başlangıçta config veya eski anahtarlardan yükle
  useEffect(() => {
    const saved = localStorage.getItem("nzxtMediaConfig");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMediaUrl(parsed.url || localStorage.getItem("media_url") || "");
        setSettings({ ...DEFAULTS, ...parsed });
      } catch {
        setMediaUrl(localStorage.getItem("media_url") || "");
        setSettings(DEFAULTS);
      }
    } else {
      setMediaUrl(localStorage.getItem("media_url") || "");
      setSettings(DEFAULTS);
    }
  }, []);

  // Config.tsx’ten URL değişirse senkronize et
  useEffect(() => {
    const sync = setInterval(() => {
      const u = localStorage.getItem("media_url") || "";
      if (u !== mediaUrl) setMediaUrl(u);
    }, 400);
    return () => clearInterval(sync);
  }, [mediaUrl]);

  // Her değişiklikte kaydet (LCD de okuyacak)
  useEffect(() => {
    const cfg = { url: mediaUrl, ...settings };
    localStorage.setItem("nzxtMediaConfig", JSON.stringify(cfg));
    localStorage.setItem("media_url", mediaUrl);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "nzxtMediaConfig",
        newValue: JSON.stringify(cfg),
      })
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: "media_url", newValue: mediaUrl })
    );
  }, [mediaUrl, settings]);

  const handleChange = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const isVideo =
    /\.mp4($|\?)/i.test(mediaUrl) || mediaUrl.toLowerCase().includes("mp4");

  // object-position eşlemesi
  const objectPosition =
    settings.align === "center"
      ? "50% 50%"
      : settings.align === "top"
      ? "50% 0%"
      : settings.align === "bottom"
      ? "50% 100%"
      : settings.align === "left"
      ? "0% 50%"
      : "100% 50%";

  return (
    <div className="config-container">
      <h2>Media Configuration</h2>
      <p className="hint">
        Aşağıdaki dairesel önizleme, Config’te girdiğin URL ve bu ayarlarla birebir LCD’deki görüntüyü simüle eder.
      </p>

      <div className="preview-section">
        <h3>Thumbnail Preview (Kraken-style)</h3>

        {/* Dairesel sabit maske */}
        <div className="preview-circle">
          <div
            className="media-layer"
            style={{
              width: "100%",
              height: "100%",
              transform: `translate(${settings.x}px, ${settings.y}px) scale(${settings.scale})`,
              transformOrigin: "center center",
            }}
          >
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
                  display: "block",
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
                    display: "block",
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <label>Resolution</label>
        <input value={settings.resolution} readOnly />

        <label>Scale</label>
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={settings.scale}
          onChange={(e) =>
            handleChange("scale", parseFloat(e.target.value || "1"))
          }
        />

        <label>X Offset (px)</label>
        <input
          type="number"
          value={settings.x}
          onChange={(e) =>
            handleChange("x", parseInt(e.target.value || "0", 10))
          }
        />

        <label>Y Offset (px)</label>
        <input
          type="number"
          value={settings.y}
          onChange={(e) =>
            handleChange("y", parseInt(e.target.value || "0", 10))
          }
        />

        <label>Align</label>
        <select
          value={settings.align}
          onChange={(e) =>
            handleChange("align", e.target.value as Settings["align"])
          }
        >
          <option>center</option>
          <option>top</option>
          <option>bottom</option>
          <option>left</option>
          <option>right</option>
        </select>

        <label>Fit</label>
        <select
          value={settings.fit}
          onChange={(e) =>
            handleChange("fit", e.target.value as Settings["fit"])
          }
        >
          <option>cover</option>
          <option>contain</option>
          <option>fill</option>
        </select>
      </div>
    </div>
  );
}
