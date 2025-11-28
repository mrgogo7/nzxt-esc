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
import { deriveBackgroundSourceFromUrl, sanitizeBackgroundSource } from '../../preset/utils/mediaSource';
// FAZ-3D: vNext preset import system (full integration)
import { shouldUseFaz3BRuntime } from '../../utils/featureFlags';
import { importPresetToRuntimeState } from '../../preset/vNext/presetImportVNext';
import { getStateManagerForPreset } from '../../state/overlay/useOverlayStateManager';

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
  
  // Step 1: CRITICAL - Disable autosave FIRST
  if (typeof window !== 'undefined') {
    window.__disableAutosave = true;
  }
  
  // Step 2: Load overlay elements from preset into runtime
  // FAZ-3D: Full integration with StateManager.replaceState()
  const useNewRuntime = shouldUseFaz3BRuntime();
  
  if (useNewRuntime) {
    try {
      // Import preset using vNext system
      const importResult = importPresetToRuntimeState(preset.preset, preset.id);
      
      // Log warnings if any
      if (importResult.warnings.length > 0) {
        console.warn('[PresetImport] Import warnings:', importResult.warnings);
      }
      
      // FAZ-3D: Apply imported state to StateManager using replaceState()
      const stateManager = getStateManagerForPreset(preset.id);
      stateManager.replaceState(importResult.state);
      
      // Skip old system (vNext replaces it)
      // Continue with settings/mediaUrl handling below
    } catch (error) {
      // Fallback to old system if vNext import fails
      console.warn('[PresetImport] vNext import failed, falling back to old system:', error);
      // Continue with old system below
      const presetElements = preset.preset.overlay?.elements ?? [];
      loadPreset(preset.id, presetElements);
    }
  } else {
    // Old system (used when feature flag is OFF)
    const presetElements = preset.preset.overlay?.elements ?? [];
    loadPreset(preset.id, presetElements);
  }
  
  // Step 3: WAIT 10ms (micro delay to ensure runtime is seeded)
  setTimeout(() => {
    // Derive effective background source (v2)
    const bg: any = preset.preset.background;
    const rawSource = bg?.source;
    const sanitizedSource =
      rawSource !== undefined
        ? sanitizeBackgroundSource(rawSource)
        : null;
    const effectiveSource =
      sanitizedSource ?? deriveBackgroundSourceFromUrl(bg?.url);

    // Map background source → AppSettings + mediaUrl
    let mediaUrl: string;
    let sourceType: AppSettings['sourceType'];
    let localFileName: AppSettings['localFileName'];

    if (effectiveSource.type === 'local') {
      mediaUrl = '';
      sourceType = 'local';
      localFileName = effectiveSource.localFileName;
    } else {
      mediaUrl = (bg?.url as string) || '';
      sourceType = 'remote';
      localFileName = undefined;
    }

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
      sourceType,
      localFileName,
    });
    
    // Step 5: Load media URL from preset
    setMediaUrl(mediaUrl);
    
    // Step 6: WAIT autosaveDelayMs (700ms) before re-enabling autosave
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__disableAutosave = false;
      }
    }, autosaveDelayMs);
  }, 10); // 10ms micro delay
}

