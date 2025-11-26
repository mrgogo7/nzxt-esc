/**
 * Application version - Single Source of Truth (SSOT)
 * 
 * This is the ONLY place where application version should be defined or accessed.
 * All other parts of the application should import APP_VERSION from this file.
 * 
 * Build-time injection: In production builds, Vite injects __APP_VERSION__ from package.json.
 * Fallback is only for development/edge cases and should not be modified.
 */

declare const __APP_VERSION__: string;

export const APP_VERSION =
  typeof __APP_VERSION__ !== "undefined"
    ? __APP_VERSION__
    : "0.0.1"; // fallback, dokunma

