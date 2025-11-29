/**
 * Dev mode toggle system.
 * 
 * Provides reactive dev mode state that can be toggled at runtime.
 * Completely tree-shakeable in production builds.
 */

import { IS_DEV } from './dev';
import { devLog } from './dev';

/**
 * Simple event emitter for dev mode state changes.
 */
type DevModeListener = (enabled: boolean) => void;

class DevModeStore {
  private enabled: boolean;
  private listeners: Set<DevModeListener> = new Set();

  constructor() {
    // Initialize from environment (compile-time constant)
    this.enabled = IS_DEV;
  }

  /**
   * Get current dev mode state.
   */
  get isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Toggle dev mode state.
   * Only works in development builds (no-op in production).
   */
  toggle(): void {
    if (!IS_DEV) {
      // In production, dev mode cannot be toggled
      return;
    }

    this.enabled = !this.enabled;

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(this.enabled);
      } catch (error) {
        // Silently handle listener errors
      }
    });

    // Log the toggle
    if (this.enabled) {
      devLog('DevToggle', 'Activated via hotkey', { timestamp: Date.now() });
    } else {
      devLog('DevToggle', 'Deactivated via hotkey', { timestamp: Date.now() });
    }
  }

  /**
   * Subscribe to dev mode state changes.
   * 
   * @param listener - Callback function called when state changes
   * @returns Unsubscribe function
   */
  subscribe(listener: DevModeListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Singleton instance
const devModeStore = new DevModeStore();

/**
 * Dev mode API.
 * 
 * Provides reactive dev mode state that can be toggled at runtime.
 * In production builds, this is completely tree-shaken.
 */
export const devMode = {
  /**
   * Current dev mode state.
   */
  get enabled(): boolean {
    return devModeStore.isEnabled;
  },

  /**
   * Toggle dev mode state.
   * Only works in development builds.
   */
  toggle(): void {
    devModeStore.toggle();
  },

  /**
   * Subscribe to dev mode state changes.
   * 
   * @param listener - Callback function called when state changes
   * @returns Unsubscribe function
   */
  subscribe(listener: DevModeListener): () => void {
    return devModeStore.subscribe(listener);
  },
};

// Log initialization (only in dev mode)
if (IS_DEV && typeof window !== 'undefined') {
  devLog('DevToggle', 'Initialized', { enabled: devMode.enabled });
}

