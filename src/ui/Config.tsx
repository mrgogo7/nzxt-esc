import { useState, useEffect } from "react";
import ConfigPreview from "./components/ConfigPreview";

export default function Config() {
  const initialUrl = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("nzxtMediaConfig") || "{}");
      return saved.url || localStorage.getItem("media_url") || "";
    } catch {
      return localStorage.getItem("media_url") || "";
    }
  })();

  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem("nzxtMediaConfig") || "{}");
      } catch {
        return {} as any;
      }
    })();
    const current = saved.url || localStorage.getItem("media_url") || "";
    setInputUrl(current);
  }, []);

  const handleSave = () => {
    setSaving(true);
    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem("nzxtMediaConfig") || "{}");
      } catch {
        return {} as any;
      }
    })();
    const newCfg = { ...saved, url: inputUrl };
    localStorage.setItem("nzxtMediaConfig", JSON.stringify(newCfg));
    localStorage.setItem("media_url", inputUrl);

    // LCD ve Display bileşenine anında bildirim gönder
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "nzxtMediaConfig",
        newValue: JSON.stringify(newCfg),
      })
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: "media_url", newValue: inputUrl })
    );

    setTimeout(() => setSaving(false), 300);
  };

  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "sans-serif",
        color: "white",
        backgroundColor: "#111",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Pinterest Media URL</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://...jpg / ...png / ...gif / ...mp4"
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#222",
            color: "white",
          }}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.55rem 0.9rem",
            borderRadius: "6px",
            border: "1px solid #5a5a5a",
            background: saving ? "#2d2d2d" : "#3b3b3b",
            color: "#fff",
            cursor: saving ? "default" : "pointer",
            fontWeight: 600,
          }}
          title="URL’i kaydet ve LCD’ye uygula"
        >
          {saving ? "Kaydediliyor…" : "Kaydet / Güncelle"}
        </button>
      </div>

      <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "#aaa" }}>
        Not: URL, yalnızca <b>Kaydet / Güncelle</b> butonuna bastığında LCD’ye
        uygulanır.
      </p>

      <hr style={{ margin: "2rem 0", borderColor: "#333" }} />

      {/* 🔹 Önizleme ve medya ayar bileşeni */}
      <ConfigPreview />
    </div>
  );
}
