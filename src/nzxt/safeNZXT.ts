/**
 * Safe NZXT Web Integration API Wrapper
 * 
 * NZXT Web Integration wrapper:
 * - getApi(): returns the NZXT Web Integration object (or null)
 * - hasAPI(): true if window.nzxt.v1 exists
 * - subscribeMonitoring(cb): wires cb to NZXT monitoring updates with retry logic and returns an unsubscribe fn
 * 
 * Official NZXT API format:
 * window.nzxt = {
 *   v1: {
 *     onMonitoringDataUpdate: null | ((data) => void)
 *   }
 * }
 * 
 * Subscription is property assignment: window.nzxt.v1.onMonitoringDataUpdate = handler
 * 
 * This module provides a safe, spec-compliant wrapper for all NZXT API calls.
 * All NZXT API interactions must go through this module to ensure:
 * - Proper error handling
 * - API availability checks
 * - Event listener cleanup
 * - Retry logic for delayed API injection
 * - No namespace pollution
 */

/**
 * NZXT API interface based on official spec:
 * - window.nzxt.v1 (lowercase nzxt)
 * - onMonitoringDataUpdate is a property you assign to
 */
interface NZXTAPI {
  v1?: {
    width?: number;
    height?: number;
    shape?: 'circle' | 'rectangle';
    targetFps?: number;
    onMonitoringDataUpdate?: (data: any) => void | null;
  };
}

/**
 * Get the NZXT API object safely.
 * Official API is window.nzxt (lowercase).
 * 
 * @returns NZXT API object or null if not available
 */
function getNZXTAPI(): NZXTAPI | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Official API is window.nzxt (lowercase)
  const api = (window as any).nzxt;

  // Validate that it's an object
  if (api && typeof api === 'object') {
    return api as NZXTAPI;
  }

  return null;
}

/**
 * Stored monitoring callback reference for cleanup
 */
let currentMonitoringHandler: ((data: any) => void) | null = null;
let currentMonitoringCleanup: (() => void) | null = null;
let isInitialized = false;
let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Safe wrapper for NZXT API access.
 */
export const safeNZXT = {
  /**
   * Get the NZXT API object safely.
   * Returns null if API is not available.
   * 
   * @returns NZXT API object or null
   */
  getApi(): NZXTAPI | null {
    try {
      return getNZXTAPI();
    } catch (error) {
      return null;
    }
  },

  /**
   * Get the NZXT API object safely (alias for getApi for backward compatibility).
   * 
   * @returns NZXT API object or null
   */
  get(): NZXTAPI | null {
    return this.getApi();
  },

  /**
   * Check if NZXT API is available.
   * 
   * @returns True if API is available
   */
  isAvailable(): boolean {
    return this.getApi() !== null;
  },

  /**
   * Check if NZXT API v1 exists.
   * Simple check: window.nzxt?.v1 exists.
   * 
   * @returns True if API v1 is available
   */
  hasAPI(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return Boolean((window as any).nzxt?.v1);
  },

  /**
   * Subscribe to NZXT monitoring data updates.
   * Uses the official API pattern: window.nzxt.v1.onMonitoringDataUpdate = callback
   * 
   * Implements retry logic for delayed API injection (NZXT CAM may inject API after page load):
   * - Try immediately
   * - If window.nzxt?.v1 doesn't exist → retry after 200ms
   * - Retry up to 10 times (max 2s), then give up
   * 
   * @param callback - Function to call when monitoring data is received
   * @returns Cleanup function to unsubscribe
   */
  subscribeMonitoring(callback: (data: any) => void): (() => void) {
    // Clean up previous subscription if exists
    if (currentMonitoringCleanup) {
      currentMonitoringCleanup();
      currentMonitoringCleanup = null;
    }

    // Clear any pending retry
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId);
      retryTimeoutId = null;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const trySubscribe = (): boolean => {
      try {
        const api = (window as any).nzxt?.v1;
        
        if (api) {
          // API is available - assign callback
          currentMonitoringHandler = callback;
          api.onMonitoringDataUpdate = callback;

          // Create cleanup function
          const cleanup = () => {
            const currentApi = (window as any).nzxt?.v1;
            if (currentApi && currentApi.onMonitoringDataUpdate === callback) {
              currentApi.onMonitoringDataUpdate = null;
            }
            currentMonitoringHandler = null;
          };

          currentMonitoringCleanup = cleanup;
          return true;
        }

        // API not available yet - retry if attempts remain
        attempts++;
        if (attempts < maxAttempts) {
          retryTimeoutId = setTimeout(trySubscribe, 200);
        }
        return false;
      } catch (error) {
        return false;
      }
    };

    // Try immediately
    trySubscribe();

    // Return cleanup function
    return () => {
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
        retryTimeoutId = null;
      }
      if (currentMonitoringCleanup) {
        currentMonitoringCleanup();
        currentMonitoringCleanup = null;
      }
    };
  },


  /**
   * Get LCD dimensions from NZXT API.
   * 
   * @param defaults - Default dimensions if API is not available
   * @returns LCD dimensions object
   */
  getLCDDimensions(defaults: { width: number; height: number; shape: 'circle' | 'rectangle' }): {
    width: number;
    height: number;
    shape: 'circle' | 'rectangle';
  } {
    try {
      const api = this.getApi();
      if (api?.v1) {
        return {
          width: api.v1.width ?? defaults.width,
          height: api.v1.height ?? defaults.height,
          shape: api.v1.shape ?? defaults.shape,
        };
      }
    } catch (error) {
      // Error handled silently
    }

    return defaults;
  },


  /**
   * Initialize NZXT handshake.
   * This should be called once on application startup.
   * Idempotent - safe to call multiple times.
   * 
   * @returns True if handshake was successful
   */
  init(): boolean {
    // Idempotent - only initialize once
    if (isInitialized) {
      return true;
    }

    try {
      const api = this.getApi();
      if (!api) {
        // Not in NZXT CAM environment - this is OK for browser mode
        return false;
      }

      // Handshake is typically automatic in NZXT Web Integration
      // We just verify API is available
      
      isInitialized = true;
      return true;
    } catch (error) {
      return false;
    }
  },
};

/**
 * Initialize NZXT API on module load (if in NZXT environment).
 * This ensures handshake happens early.
 */
if (typeof window !== 'undefined') {
  // Initialize on next tick to ensure window is fully ready
  setTimeout(() => {
    safeNZXT.init();
  }, 0);
}
