/**
 * Atomic Preset Sync Hook
 * 
 * Automatically saves UI config state to active preset using atomic merge strategy.
 * 
 * Architecture:
 * - Listens to settings, mediaUrl, and overlay changes
 * - Converts to PresetFile format using createPresetFromState
 * - Applies atomic merge to active preset
 * - Uses 100ms throttle to prevent excessive writes
 * - Disabled during preset apply to prevent loops
 * 
 * CRITICAL: This hook does NOT modify useSettingsSync or useMediaUrl.
 * It's a separate layer that writes to presets.
 */

import { useEffect, useRef } from 'react';
import type { AppSettings } from '../constants/defaults';
import type { Overlay } from '../types/overlay';
import { createPresetFromState } from '../preset';
import { getActivePresetId, getPresetById, updatePreset } from '../preset/storage';

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
  /** Current overlay configuration */
  overlay: Overlay;
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
 * @param options - Hook options
 */
export function useAtomicPresetSync({
  settings,
  mediaUrl,
  overlay,
  activePresetId,
  presetName,
}: UseAtomicPresetSyncOptions): void {
  const lastSyncRef = useRef<number>(0);
  const isInitialMountRef = useRef(true);
  const prevStateRef = useRef<{
    settings: AppSettings;
    mediaUrl: string;
    overlay: Overlay;
  } | null>(null);

  useEffect(() => {
    // Skip on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      prevStateRef.current = { settings, mediaUrl, overlay };
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

    // Check if state actually changed
    const prevState = prevStateRef.current;
    if (prevState) {
      const settingsChanged = JSON.stringify(prevState.settings) !== JSON.stringify(settings);
      const mediaUrlChanged = prevState.mediaUrl !== mediaUrl;
      const overlayChanged = JSON.stringify(prevState.overlay) !== JSON.stringify(overlay);
      
      if (!settingsChanged && !mediaUrlChanged && !overlayChanged) {
        return; // No changes
      }
    }

    // Throttle: only save if 100ms has passed since last save
    const now = Date.now();
    if (now - lastSyncRef.current < 100) {
      return;
    }
    lastSyncRef.current = now;

    // Get active preset to get its name
    const activePreset = getPresetById(activePresetId);
    if (!activePreset) {
      return; // Preset not found
    }

    // Create PresetFile from current state
    // Use existing preset name or provided name
    const nameToUse = presetName || activePreset.name;

    // Create partial PresetFile with current state
    // Overlay comes from hook parameter (already computed from settings via useOverlayConfig)
    const newPresetFile = createPresetFromState(
      {
        ...settings,
        overlay: overlay, // Use overlay from hook parameter (computed overlay)
      },
      mediaUrl,
      nameToUse
    );

    // Update preset using atomic merge
    // Only update preset field, preserve other fields (name, isDefault, etc.)
    updatePreset(activePresetId, {
      preset: newPresetFile,
    });

    // Update previous state
    prevStateRef.current = { settings, mediaUrl, overlay };
  }, [settings, mediaUrl, overlay, activePresetId, presetName]);
}

