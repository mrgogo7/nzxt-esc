import React from "react";
import ReactDOM from "react-dom/client";
import Config from "./ui/Config";
import KrakenOverlay from "./ui/components/KrakenOverlay";

// Detect page type based on query parameters
const searchParams = new URLSearchParams(window.location.search);
const isKraken = searchParams.get("kraken") === "1";

const rootElement = document.getElementById("root");

if (!rootElement) {
  // Fail fast in case root element is missing
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {isKraken ? <KrakenOverlay /> : <Config />}
  </React.StrictMode>
);
