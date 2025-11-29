/**
 * Legacy feature flag system (deprecated).
 * 
 * The runtime system is now always enabled. These functions are kept for backward compatibility
 * but always return true to maintain existing code paths.
 * 
 * @deprecated Runtime is always enabled - these functions are legacy compatibility stubs
 */

/**
 * Legacy function - runtime is now always enabled.
 * 
 * Kept for backward compatibility with existing code that checks this flag.
 * Always returns true since the runtime system is permanently enabled.
 * 
 * @deprecated Runtime is always enabled - this always returns true
 * @returns Always true (runtime is permanently enabled)
 */
export function shouldUseFaz3BRuntime(): boolean {
  // Legacy: Runtime is now always enabled, but we keep this function for backward compatibility
  return true;
}

/**
 * Legacy function - runtime is now always enabled.
 * 
 * Kept for backward compatibility. This function is a no-op since runtime cannot be disabled.
 * 
 * @deprecated Runtime is always enabled - this function does nothing
 * @param enabled - Ignored (runtime is always enabled)
 */
export function setFaz3BRuntimeEnabled(_enabled: boolean): void {
  // Legacy: Runtime is always enabled, this function is a no-op
  // Kept for backward compatibility with code that may call it
}

/**
 * Legacy function - runtime is now always enabled.
 * 
 * Kept for backward compatibility. Always returns true.
 * 
 * @deprecated Runtime is always enabled - this always returns true
 * @returns Always true (runtime is permanently enabled)
 */
export function toggleFaz3BRuntime(): boolean {
  // Legacy: Runtime is always enabled, this always returns true
  return true;
}

/**
 * Legacy function - dev toggle shortcut removed.
 * 
 * Kept for backward compatibility. This function is now a no-op since runtime cannot be toggled.
 * 
 * @deprecated Runtime is always enabled - this function does nothing
 */
export function initializeDevToggleShortcut(): void {
  // Legacy: Runtime is always enabled, dev toggle shortcut removed
  // Kept for backward compatibility with main.tsx that calls this
}

