/**
 * Development logging utilities.
 * 
 * Centralized dev logging that automatically disables in production builds.
 * All console calls should use these functions instead of direct console.* calls.
 * 
 * Production builds will tree-shake these functions (zero runtime cost).
 */

export const DEV = import.meta.env.DEV;

/**
 * Development mode flag - tree-shakeable boolean.
 * 
 * Use this for conditional rendering that should only appear in dev mode.
 * Production builds will completely remove code guarded by this flag.
 */
export const IS_DEV = import.meta.env.DEV === true;

/**
 * Development log - only logs in dev mode.
 * 
 * @param scope - Scope identifier (e.g., "OverlaySync", "PresetImport", "KrakenOverlay")
 * @param message - Log message
 * @param data - Optional data object to log
 */
export function devLog(scope: string, message: string, data?: unknown): void {
  if (!DEV) return;
  if (data !== undefined) {
    console.log(`[DEV][${scope}] ${message}`, data);
  } else {
    console.log(`[DEV][${scope}] ${message}`);
  }
}

/**
 * Development warning - only logs in dev mode.
 * 
 * @param scope - Scope identifier
 * @param message - Warning message
 * @param data - Optional data object to log
 */
export function devWarn(scope: string, message: string, data?: unknown): void {
  if (!DEV) return;
  if (data !== undefined) {
    console.warn(`[DEV][${scope}] ${message}`, data);
  } else {
    console.warn(`[DEV][${scope}] ${message}`);
  }
}

/**
 * Development error - only logs in dev mode.
 * 
 * @param scope - Scope identifier
 * @param message - Error message
 * @param data - Optional data object to log
 */
export function devError(scope: string, message: string, data?: unknown): void {
  if (!DEV) return;
  if (data !== undefined) {
    console.error(`[DEV][${scope}] ${message}`, data);
  } else {
    console.error(`[DEV][${scope}] ${message}`);
  }
}

/**
 * Development debug - only logs in dev mode.
 * 
 * @param scope - Scope identifier
 * @param message - Debug message
 * @param data - Optional data object to log
 */
export function devDebug(scope: string, message: string, data?: unknown): void {
  if (!DEV) return;
  if (data !== undefined) {
    console.debug(`[DEV][${scope}] ${message}`, data);
  } else {
    console.debug(`[DEV][${scope}] ${message}`);
  }
}

