/**
 * Atomic Preset Sync Hook
 * 
 * Automatically saves UI config state to active preset using atomic merge strategy.
 * 
 * Architecture:
 * - Listens to settings, mediaUrl, and runtime overlay elements changes
 * - Converts to PresetFile format using createPresetFromState
 * - Applies atomic merge to active preset
 * - Uses 500ms debounce to prevent excessive writes
 * - Disabled during preset apply to prevent loops
 * 
 * CRITICAL: This hook does NOT modify useSettingsSync or useMediaUrl.
 * It's a separate layer that writes to presets.
 * 
 * CRITICAL: Autosave is driven by runtime elements changes, NOT by overlay config.
 * This prevents infinite loops between preset save and overlay config updates.
 */

import { useEffect, useRef } from 'react';
import type { AppSettings } from '../constants/defaults';
import { createPresetFromState } from '../preset';
import { getPresetById, updatePreset } from '../preset/storage';
import { useOverlayStateManager } from '../state/overlay/useOverlayStateManager';
import { getElementsInZOrder } from '../state/overlay/selectors';

/**
 * Debug mode flag for atomic preset sync logging.
 */
const isDebugMode = (): boolean => {
  return typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true;
};

/**
 * Global flag to disable autosave during preset apply.
 * Set to true when applying a preset, reset to false after 300ms.
 */
declare global {
  interface Window {
    __disableAutosave?: boolean;
  }
}

export interface UseAtomicPresetSyncOptions {
  /** Current app settings */
  settings: AppSettings;
  /** Current media URL */
  mediaUrl: string;
  /** Current overlay mode (only mode, not elements) */
  overlayMode: 'none' | 'custom';
  /** Active preset ID (null if no preset is active) */
  activePresetId: string | null;
  /** Preset name to use when creating preset from state */
  presetName?: string;
}

/**
 * Hook for atomic preset synchronization.
 * 
 * Automatically saves config state to active preset when changes occur.
 * Uses atomic merge to preserve existing preset data.
 * 
 * CRITICAL: Autosave is driven by runtime elements changes, NOT by overlay config.
 * This prevents infinite loops between preset save and overlay config updates.
 * 
 * @param options - Hook options
 */
export function useAtomicPresetSync({
  settings,
  mediaUrl,
  overlayMode,
  activePresetId,
  presetName,
}: UseAtomicPresetSyncOptions): void {
  // Get elements from vNext state
  const stateManagerHook = activePresetId
    ? useOverlayStateManager(activePresetId)
    : null;
  const runtimeState = stateManagerHook?.state ?? null;
  
  // Get runtime elements from vNext state (reactive subscription)
  const runtimeElements = runtimeState
    ? getElementsInZOrder(runtimeState.elements, runtimeState.zOrder)
    : [];
  
  const lastSyncRef = useRef<number>(0);
  const isInitialMountRef = useRef(true);
  const lastSavedElementsKeyRef = useRef<string | null>(null);
  const lastSavedSettingsKeyRef = useRef<string | null>(null);
  const lastSavedMediaUrlRef = useRef<string | null>(null);
  const lastSavedPresetIdRef = useRef<string | null>(null);
  const prevStateRef = useRef<{
    settings: AppSettings;
    mediaUrl: string;
    overlayMode: 'none' | 'custom';
  } | null>(null);
  const autosaveTimeoutRef = useRef<number | null>(null);

  // CRITICAL: Track runtime elements as JSON key for comparison
  const runtimeElementsKey = JSON.stringify(runtimeElements);
  
  // CRITICAL: Extract settings without overlay.elements for comparison
  // This prevents expensive JSON.stringify of entire settings object
  const getSettingsKey = (s: AppSettings): string => {
    const { overlay, ...rest } = s;
    return JSON.stringify({
      ...rest,
      overlay: { mode: overlay?.mode || 'none' }
    });
  };
  const settingsKey = getSettingsKey(settings);

  // Effect for settings/mediaUrl/overlayMode changes (non-runtime)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevStateRef.current = { settings, mediaUrl, overlayMode };
      lastSavedPresetIdRef.current = activePresetId;
      lastSavedElementsKeyRef.current = runtimeElementsKey;
      lastSavedSettingsKeyRef.current = settingsKey;
      lastSavedMediaUrlRef.current = mediaUrl;
      return;
    }

    // Check if autosave is disabled (during preset apply)
    if (window.__disableAutosave) {
      return;
    }

    // Check if active preset exists
    if (!activePresetId) {
      return;
    }

    // Check if preset changed - reset saved keys
    if (lastSavedPresetIdRef.current !== activePresetId) {
      lastSavedPresetIdRef.current = activePresetId;
      lastSavedElementsKeyRef.current = runtimeElementsKey;
      lastSavedSettingsKeyRef.current = settingsKey;
      lastSavedMediaUrlRef.current = mediaUrl;
      return; // Don't autosave on preset switch
    }

    // Check if state actually changed
    const settingsChanged = settingsKey !== lastSavedSettingsKeyRef.current;
    const mediaUrlChanged = mediaUrl !== lastSavedMediaUrlRef.current;
    const overlayModeChanged = prevStateRef.current?.overlayMode !== overlayMode;
    
    if (!settingsChanged && !mediaUrlChanged && !overlayModeChanged) {
      // No changes, update prevState and return
      prevStateRef.current = { settings, mediaUrl, overlayMode };
      return;
    }

    // Schedule autosave (debounced) - will save settings/media/overlay
    scheduleAutosave('settings');

    // Update previous state
    prevStateRef.current = { settings, mediaUrl, overlayMode };
  }, [settings, mediaUrl, overlayMode, activePresetId, presetName, runtimeElementsKey, settingsKey]);

  // Effect for runtime elements changes (separate from settings changes)
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMountRef.current) {
      return;
    }

    // Check if autosave is disabled (during preset apply)
    if (window.__disableAutosave) {
      return;
    }

    // Check if active preset exists
    if (!activePresetId) {
      return;
    }

    // Check if preset changed - reset saved key
    if (lastSavedPresetIdRef.current !== activePresetId) {
      lastSavedPresetIdRef.current = activePresetId;
      lastSavedElementsKeyRef.current = runtimeElementsKey;
      return; // Don't autosave on preset switch
    }

    // Check if elements actually changed
    if (runtimeElementsKey === lastSavedElementsKeyRef.current) {
      return; // No change
    }

    // Schedule autosave (debounced) - will save settings/media/overlay
    scheduleAutosave('overlay');
  }, [runtimeElementsKey, activePresetId]);

  /**
   * Schedule autosave with debounce (500ms).
   * Prevents excessive writes and ensures we only save when changes stabilize.
   * 
   * @param reason - What triggered the autosave ('settings' or 'overlay')
   */
  function scheduleAutosave(reason: 'settings' | 'overlay') {
    // Clear existing timeout
    if (autosaveTimeoutRef.current !== null) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Schedule new autosave
    autosaveTimeoutRef.current = window.setTimeout(() => {
      performAutosave(reason);
      autosaveTimeoutRef.current = null;
    }, 500);
  }

  /**
   * Perform the actual autosave operation.
   * Reads current state and writes to preset storage.
   * Saves ALL fields: settings, mediaUrl, overlay (mode + elements).
   * 
   * CRITICAL: In dev mode, if color picker is open, freeze autosave to prevent re-renders.
   * 
   * @param reason - What triggered the autosave ('settings' or 'overlay')
   */
  function performAutosave(reason: 'settings' | 'overlay') {
    // Strict check for autosave disabled (during preset apply/initial load)
    if (window.__disableAutosave === true) {
      if (isDebugMode()) {
      }
      return;
    }

    // Check if active preset exists
    if (!activePresetId) {
      return;
    }

    // Get active preset to get its name
    const activePreset = getPresetById(activePresetId);
    if (!activePreset) {
      return; // Preset not found
    }

    // CRITICAL: Check if anything actually changed
    // For settings/media changes, check if settings/media changed
    // For overlay changes, check if elements changed
    const currentElementsKey = JSON.stringify(runtimeElements);
    const currentSettingsKey = settingsKey;
    const currentMediaUrl = mediaUrl;
    
    if (reason === 'settings') {
      // Settings/media autosave - check if settings/media actually changed
      if (currentSettingsKey === lastSavedSettingsKeyRef.current && 
          currentMediaUrl === lastSavedMediaUrlRef.current) {
        // Nothing changed, skip save
        return;
      }
    } else {
      // Overlay autosave - check if elements actually changed
      if (currentElementsKey === lastSavedElementsKeyRef.current) {
        // Elements haven't changed, skip save
        return;
      }
    }

    // Throttle: only save if 500ms has passed since last save
    const now = Date.now();
    if (now - lastSyncRef.current < 500) {
      return;
    }
    lastSyncRef.current = now;

    // Create PresetFile from current state
    // Use existing preset name or provided name
    const nameToUse = presetName || activePreset.name;

    // Autosave performed
    
    // Pass runtime elements directly, don't include in settings
    const newPresetFile = createPresetFromState(
      settings, // Use original settings (without overlay.elements)
      mediaUrl,
      nameToUse,
      runtimeElements // Pass runtime elements separately
    );

    // Update preset using atomic merge
    // Only update preset field, preserve other fields (name, isDefault, etc.)
    // CRITICAL: This does NOT modify runtime - it only writes to preset storage
    updatePreset(activePresetId, {
      preset: newPresetFile,
    });

    // Update last saved keys
    lastSavedElementsKeyRef.current = currentElementsKey;
    lastSavedSettingsKeyRef.current = currentSettingsKey;
    lastSavedMediaUrlRef.current = currentMediaUrl;
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current !== null) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);
}

