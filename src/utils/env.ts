/**
 * Environment Detection — FAZ-3E PATCH #1: Browser-Compatible
 * 
 * Cross-platform environment detection that works in both Node.js and browser contexts.
 * 
 * FAZ-3E Enhancement: Replaces process.env.NODE_ENV checks with browser-safe detection.
 */

// TypeScript: Declare process for browser compatibility
declare const process: { env?: { NODE_ENV?: string } } | undefined;

//export const IS_DEV =
//  (typeof process !== "undefined" && process?.env?.NODE_ENV !== "production") ||
//  (typeof window !== "undefined" && (window as any).__DEV__ === true);

// GEÇİCİ: Debug için zorla açık
export const IS_DEV = true;
