/**
 * Feature Flags — FAZ-3B: Runtime Integration
 * 
 * Centralized feature flag management for gradual rollout of new features.
 */

/**
 * Feature flag: Use FAZ-3B new runtime system.
 * 
 * When true: Use OverlayStateManager and new action-based system.
 * When false: Use old overlayRuntime.ts and direct mutations.
 * 
 * Default: false (disabled until stable)
 */
export const USE_FAZ3B_RUNTIME = (() => {
  // Check environment variable
  if (typeof window !== 'undefined') {
    const envValue = (window as any).__NZXT_ESC_USE_FAZ3B_RUNTIME;
    if (envValue !== undefined) {
      return envValue === true || envValue === 'true';
    }
    
    // Check localStorage (for runtime toggle)
    try {
      const stored = localStorage.getItem('__NZXT_ESC_USE_FAZ3B_RUNTIME');
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // localStorage might not be available
    }
  }
  
  // Default: disabled
  return false;
})();

/**
 * Check if FAZ-3B runtime should be used.
 * 
 * @returns True if new runtime system should be used
 */
export function shouldUseFaz3BRuntime(): boolean {
  return USE_FAZ3B_RUNTIME;
}

