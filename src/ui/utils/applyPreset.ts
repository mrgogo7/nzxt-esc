/**
 * Shared utility for applying preset to runtime and settings.
 * 
 * FAZ-11: Extracted from Config.tsx to be reused by both Config and KrakenOverlay.
 * 
 * This function:
 * - Seeds runtime overlay Map from preset.overlay.elements
 * - Applies settings (background, overlay mode, showGuide)
 * - Applies mediaUrl
 * - Manages __disableAutosave flag to prevent autosave during load
 * 
 * @param preset - Preset to apply
 * @param setSettings - Settings setter function
 * @param setMediaUrl - Media URL setter function
 * @param options - Options including autosaveDelayMs
 */

import { loadPreset } from '@/state/overlayRuntime';
import type { StoredPreset } from '../../preset/storage';
import type { AppSettings } from '../../constants/defaults';

export interface ApplyPresetOptions {
  autosaveDelayMs?: number;
}

export function applyPresetToRuntimeAndSettings(
  preset: StoredPreset,
  setSettings: (settings: AppSettings) => void,
  setMediaUrl: (url: string) => void,
  options: ApplyPresetOptions = {}
): void {
  const autosaveDelayMs = options.autosaveDelayMs ?? 700;
  const isDebug = typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true;
  
  // Step 1: CRITICAL - Disable autosave FIRST
  if (typeof window !== 'undefined') {
    window.__disableAutosave = true;
    if (isDebug) {
      console.log(`[applyPresetToRuntimeAndSettings] Step 1: __disableAutosave = true for preset ${preset.id}`);
    }
  }
  
  // Step 2: Load overlay elements from preset into runtime
  const presetElements = preset.preset.overlay?.elements ?? [];
  loadPreset(preset.id, presetElements);
  
  if (isDebug) {
    console.log(`[applyPresetToRuntimeAndSettings] Step 2: Loaded ${presetElements.length} elements for preset ${preset.id}`);
  }
  
  // Step 3: WAIT 10ms (micro delay to ensure runtime is seeded)
  setTimeout(() => {
    // Step 4: Load settings from preset (background settings, overlay mode, etc.)
    // CRITICAL: settings.overlay should ONLY contain mode, NEVER elements
    const overlayModeFromPreset = preset.preset.overlay?.mode;
    const preservedOverlayMode = overlayModeFromPreset || 'none';
    
    setSettings({
      ...preset.preset.background.settings,
      overlay: {
        mode: preservedOverlayMode,
        elements: [], // CRITICAL: Always empty - elements are in runtime state only
      },
      showGuide: preset.preset.misc?.showGuide,
    });
    
    if (isDebug) {
      console.log(`[applyPresetToRuntimeAndSettings] Step 4: Applied settings for preset ${preset.id}`);
    }
    
    // Step 5: Load media URL from preset
    setMediaUrl(preset.preset.background.url || '');
    
    if (isDebug) {
      console.log(`[applyPresetToRuntimeAndSettings] Step 5: Applied media URL for preset ${preset.id}`);
    }
    
    // Step 6: WAIT autosaveDelayMs (700ms) before re-enabling autosave
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__disableAutosave = false;
        if (isDebug) {
          console.log(`[applyPresetToRuntimeAndSettings] Step 6: __disableAutosave = false after ${autosaveDelayMs}ms for preset ${preset.id}`);
        }
      }
    }, autosaveDelayMs);
  }, 10); // 10ms micro delay
}

