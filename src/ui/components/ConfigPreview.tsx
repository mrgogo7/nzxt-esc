import React, { useState, useEffect } from "react";
import "../styles/ConfigPreview.css";

export default function ConfigPreview() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [settings, setSettings] = useState({
    scale: 1.0,
    x: 0,
    y: 0,
    fit: "cover",
    align: "center",
    loop: true,
    autoplay: true,
    mute: true,
    resolution: `${window.innerWidth} x ${window.innerHeight}`,
  });

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const saved = localStorage.getItem("nzxtMediaConfig");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMediaUrl(parsed.url || "");
      setSettings(parsed);
    }
  }, []);

  // Değişiklikleri localStorage'a yaz
  useEffect(() => {
    const cfg = { url: mediaUrl, ...settings };
    localStorage.setItem("nzxtMediaConfig", JSON.stringify(cfg));
  }, [mediaUrl, settings]);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.includes("mp4");

  return (
    <div className="config-container">
      <h2>Media Configuration</h2>

      <label htmlFor="mediaUrl">Media URL</label>
      <input
        id="mediaUrl"
        type="text"
        value={mediaUrl}
        onChange={(e) => setMediaUrl(e.target.value)}
        placeholder="https://...mp4 / ...jpg / ...gif"
      />

      <div className="preview-section">
        <h3>Thumbnail Preview</h3>
        <div
          className="preview-box"
          style={{
            transform: `scale(${settings.scale}) translate(${settings.x}px, ${settings.y}px)`,
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
                objectFit: settings.fit as any,
                objectPosition: settings.align,
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <img
              src={mediaUrl}
              alt="preview"
              style={{
                objectFit: settings.fit as any,
                objectPosition: settings.align,
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </div>
      </div>

      <div className="settings-grid">
        <label>Resolution</label>
        <input value={settings.resolution} readOnly />

        <label>Scale</label>
        <input
          type="number"
          step="0.1"
          value={settings.scale}
          onChange={(e) => handleChange("scale", parseFloat(e.target.value))}
        />

        <label>X Offset</label>
        <input
          type="number"
          value={settings.x}
          onChange={(e) => handleChange("x", parseInt(e.target.value))}
        />

        <label>Y Offset</label>
        <input
          type="number"
          value={settings.y}
          onChange={(e) => handleChange("y", parseInt(e.target.value))}
        />

        <label>Align</label>
        <select
          value={settings.align}
          onChange={(e) => handleChange("align", e.target.value)}
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
          onChange={(e) => handleChange("fit", e.target.value)}
        >
          <option>cover</option>
          <option>contain</option>
          <option>fill</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={settings.loop}
            onChange={(e) => handleChange("loop", e.target.checked)}
          />
          Loop
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.autoplay}
            onChange={(e) => handleChange("autoplay", e.target.checked)}
          />
          Autoplay
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.mute}
            onChange={(e) => handleChange("mute", e.target.checked)}
          />
          Mute
        </label>
      </div>
    </div>
  );
}
