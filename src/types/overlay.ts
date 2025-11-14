/**
 * Shared overlay types and helpers for Kraken LCD overlays.
 * This file intentionally does not contain any JSX.
 */

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
  primaryMetric: OverlayMetricKey;
  secondaryMetric?: OverlayMetricKey; // For dual and triple modes
  tertiaryMetric?: OverlayMetricKey; // For triple mode
  numberColor: string;
  textColor: string;
  // Dual mode specific colors
  primaryNumberColor?: string; // For dual mode
  primaryTextColor?: string; // For dual mode
  secondaryNumberColor?: string; // For dual mode
  secondaryTextColor?: string; // For dual mode
  numberSize: number;
  textSize: number;
  // Dual mode specific settings
  secondaryNumberSize?: number; // For dual mode
  secondaryTextSize?: number; // For dual mode
  showDivider?: boolean; // Show divider between dual metrics
  dividerWidth?: number; // Divider line width
  dividerThickness?: number; // Divider line thickness
  gap?: number; // Space between primary and secondary metrics (dual mode)
  x?: number; // Overlay X offset
  y?: number; // Overlay Y offset
}

export type OverlayMetrics = {
  cpuTemp: number;
  cpuLoad: number;
  cpuClock: number;
  liquidTemp: number;
  gpuTemp: number;
  gpuLoad: number;
  gpuClock: number;
};

/**
 * Default overlay configuration when none is stored yet.
 * Must stay in sync with ConfigPreview default overlay block.
 */
export const DEFAULT_OVERLAY: OverlaySettings = {
  mode: "none",
  primaryMetric: "cpuTemp",
  secondaryMetric: "gpuTemp", // Default for dual/triple modes
  tertiaryMetric: "liquidTemp", // Default for triple mode
  numberColor: "rgba(255, 255, 255, 1)", // White with full opacity
  textColor: "rgba(255, 255, 255, 1)", // White with full opacity (changed from #cccccc)
  numberSize: 180,
  textSize: 45, // Changed from 80 to 45
  // Dual mode defaults
  primaryNumberColor: "rgba(255, 255, 255, 1)",
  primaryTextColor: "rgba(255, 255, 255, 1)",
  secondaryNumberColor: "rgba(255, 255, 255, 1)",
  secondaryTextColor: "rgba(255, 255, 255, 1)",
  secondaryNumberSize: 120,
  secondaryTextSize: 35,
  showDivider: false,
  dividerWidth: 60, // Percentage of height
  dividerThickness: 2,
  gap: 36, // Default gap (120 * 0.3)
  x: 0,
  y: 0,
};

export type OverlayValueUnitType = "temp" | "percent" | "clock" | "none";

export interface OverlayValueInfo {
  label: string;
  valueNumber: string;
  valueUnit: string;
  valueUnitType: OverlayValueUnitType;
}

/**
 * Derive label + value + unit for a given metric key.
 * The goal is to keep a stable display model independent of the raw data shape.
 */
export function getOverlayLabelAndValue(
  key: OverlayMetricKey,
  rawValue: number
): OverlayValueInfo {
  let label: string;
  let unit = "";
  let unitType: OverlayValueUnitType = "none";

  if (key.startsWith("cpu")) label = "CPU";
  else if (key.startsWith("gpu")) label = "GPU";
  else if (key === "liquidTemp") label = "Liquid";
  else label = key.toUpperCase();

  if (key === "cpuTemp" || key === "gpuTemp" || key === "liquidTemp") {
    unit = "°";
    unitType = "temp";
  } else if (key === "cpuLoad" || key === "gpuLoad") {
    unit = "%";
    unitType = "percent";
  } else if (key === "cpuClock" || key === "gpuClock") {
    unit = "MHz";
    unitType = "clock";
  }

  const rounded = Math.round(rawValue);
  const valueNumber =
    typeof rounded === "number" && !Number.isNaN(rounded)
      ? `${rounded}`
      : "-";

  return {
    label,
    valueNumber,
    valueUnit: unit,
    valueUnitType: unitType,
  };
}
