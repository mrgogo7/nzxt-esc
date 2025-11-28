/**
 * Feature Flags — FAZ-3E: Enhanced Rollout System
 * 
 * Centralized feature flag management for gradual rollout of new features.
 * 
 * FAZ-3E Enhancement: Multi-source flag override system with priority order:
 * 1. URL query parameter (?runtimev3=1 or ?runtimev3=0)
 * 2. LocalStorage key (nzxtesc_runtimev3)
 * 3. Window global variable (__NZXT_ESC_USE_FAZ3B_RUNTIME)
 * 4. Default value (false)
 * 
 * FAZ-3E PATCH #2: Hardened with dev logging and safety checks.
 */

import { IS_DEV } from './env';

/**
 * Feature flag: Use FAZ-3B new runtime system.
 * 
 * When true: Use OverlayStateManager and new action-based system.
 * When false: Use old overlayRuntime.ts and direct mutations.
 * 
 * Default: false (disabled until stable)
 * 
 * FAZ-3E: Enhanced with multiple override sources:
 * - URL query param: ?runtimev3=1
 * - LocalStorage: nzxtesc_runtimev3
 * - Window global: __NZXT_ESC_USE_FAZ3B_RUNTIME
 * - Dev shortcut: Ctrl+Alt+Shift+R (toggles localStorage)
 */
export const USE_FAZ3B_RUNTIME = (() => {
  if (typeof window === 'undefined') {
    return false; // SSR safety
  }
  
  // Priority 1: URL query parameter (highest priority)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlValue = urlParams.get('runtimev3');
    if (urlValue !== null) {
      return urlValue === '1' || urlValue === 'true';
    }
  } catch {
    // URL parsing might fail, continue to next source
  }
  
  // Priority 2: LocalStorage override
  try {
    const stored = localStorage.getItem('nzxtesc_runtimev3');
    if (stored !== null) {
      return stored === 'true' || stored === '1';
    }
  } catch {
    // localStorage might not be available, continue to next source
  }
  
  // Priority 3: Window global variable (backward compatibility)
  try {
    const envValue = (window as any).__NZXT_ESC_USE_FAZ3B_RUNTIME;
    if (envValue !== undefined) {
      return envValue === true || envValue === 'true';
    }
    
    // Also check legacy localStorage key (backward compatibility)
    const legacyStored = localStorage.getItem('__NZXT_ESC_USE_FAZ3B_RUNTIME');
    if (legacyStored !== null) {
      return legacyStored === 'true';
    }
  } catch {
    // Continue to default
  }
  
  // Priority 4: Default value (disabled)
  return false;
})();

/**
 * Log active feature flags on app start (dev mode only).
 * FAZ-3E PATCH #2: Added for visibility and debugging.
 */
if (IS_DEV && typeof window !== 'undefined') {
  // Log once on module load (app start)
  const activeFlags: string[] = [];
  if (USE_FAZ3B_RUNTIME) {
    activeFlags.push('USE_FAZ3B_RUNTIME');
  }
  
  if (activeFlags.length > 0) {
    console.log(`[FeatureFlags] Active flags: ${activeFlags.join(', ')}`);
  } else {
    console.log('[FeatureFlags] All flags disabled (using legacy systems)');
  }
}

/**
 * Check if FAZ-3B runtime should be used.
 * 
 * FAZ-3E: Dynamic check (re-evaluates on each call for URL/localStorage changes).
 * 
 * FAZ-4-4 HOTFIX: Legacy overlayRuntime.ts deleted, so vNext is required.
 * In DEV mode, default to true to ensure runtime works.
 * 
 * @returns True if new runtime system should be used
 */
export function shouldUseFaz3BRuntime(): boolean {
  // Re-check for dynamic values (URL and localStorage can change)
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Priority 1: URL query parameter
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlValue = urlParams.get('runtimev3');
    if (urlValue !== null) {
      return urlValue === '1' || urlValue === 'true';
    }
  } catch {
    // Continue
  }
  
  // Priority 2: LocalStorage
  try {
    const stored = localStorage.getItem('nzxtesc_runtimev3');
    if (stored !== null) {
      return stored === 'true' || stored === '1';
    }
  } catch {
    // Continue
  }
  
  // Priority 3: Window global (backward compatibility)
  try {
    const envValue = (window as any).__NZXT_ESC_USE_FAZ3B_RUNTIME;
    if (envValue !== undefined) {
      return envValue === true || envValue === 'true';
    }
    
    const legacyStored = localStorage.getItem('__NZXT_ESC_USE_FAZ3B_RUNTIME');
    if (legacyStored !== null) {
      return legacyStored === 'true';
    }
  } catch {
    // Continue
  }
  
  // Priority 4: FAZ-4-4 HOTFIX - DEV mode default to true
  // Legacy overlayRuntime.ts deleted, so vNext is required for overlay to work
  if (IS_DEV) {
    return true;
  }
  
  // Priority 5: Default (production)
  return false;
}

/**
 * Set feature flag value in LocalStorage.
 * 
 * FAZ-3E: Allows programmatic toggle of feature flag.
 * 
 * @param enabled - True to enable, false to disable
 */
export function setFaz3BRuntimeEnabled(enabled: boolean): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem('nzxtesc_runtimev3', enabled ? 'true' : 'false');
    // Also update legacy key for backward compatibility
    localStorage.setItem('__NZXT_ESC_USE_FAZ3B_RUNTIME', enabled ? 'true' : 'false');
    
    // Log for dev mode
    if (IS_DEV) {
      console.log(`[FeatureFlag] FAZ-3B Runtime ${enabled ? 'ENABLED' : 'DISABLED'} via LocalStorage`);
    }
  } catch (error) {
    console.warn('[FeatureFlag] Failed to set feature flag:', error);
  }
}

/**
 * Toggle feature flag value.
 * 
 * FAZ-3E: Convenience function to toggle feature flag.
 * 
 * @returns New state (true if enabled, false if disabled)
 */
export function toggleFaz3BRuntime(): boolean {
  const current = shouldUseFaz3BRuntime();
  const newValue = !current;
  setFaz3BRuntimeEnabled(newValue);
  return newValue;
}

/**
 * Initialize dev toggle shortcut.
 * 
 * FAZ-3E: Ctrl+Alt+Shift+R toggles feature flag in development mode.
 * 
 * Call this once during app initialization.
 */
export function initializeDevToggleShortcut(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Only in development mode
  if (!IS_DEV) {
    return;
  }
  
  window.addEventListener('keydown', (event) => {
    // Ctrl+Alt+Shift+R
    if (event.ctrlKey && event.altKey && event.shiftKey && event.key === 'R') {
      event.preventDefault();
      const newState = toggleFaz3BRuntime();
      
      console.log(
        `%c[FeatureFlag] Runtime v3 ${newState ? 'ENABLED' : 'DISABLED'}%c\n` +
        `Refresh the page for changes to take effect.\n` +
        `URL override: ?runtimev3=${newState ? '1' : '0'}\n` +
        `LocalStorage: nzxtesc_runtimev3=${newState ? 'true' : 'false'}`,
        'font-weight: bold; color: #4CAF50;',
        'color: #666;'
      );
    }
  });
}

