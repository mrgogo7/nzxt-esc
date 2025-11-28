/**
 * FAZ-4-2 NOTE:
 * - Bu utility halen legacy runtime pipeline (overlayRuntime.ts) ile entegre.
 * - vNext mimarisi: OverlayStateManager tabanlı (FAZ-3A/3B/3C/3D).
 * - Feature flag (shouldUseFaz3BRuntime) ile vNext path zaten mevcut.
 * - FAZ-4-2'de sadece işaretleniyor, silme/migration yapılmıyor.
 * - FAZ-4-3 için: legacy path (loadPreset) kaldırılacak.
 */

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

// FAZ-4-3: Legacy overlayRuntime.ts deleted - only vNext path remains
import type { StoredPreset } from '../../preset/storage';
import type { AppSettings } from '../../constants/defaults';
import { deriveBackgroundSourceFromUrl, sanitizeBackgroundSource } from '../../preset/utils/mediaSource';
// FAZ-3D: vNext preset import system (full integration)
import { importPresetToRuntimeState } from '../../preset/vNext/presetImportVNext';
import { getStateManagerForPreset } from '../../state/overlay/useOverlayStateManager';
import { IS_DEV } from '../../utils/env';

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
  // FAZ-4-3: Legacy path removed - only vNext path remains
  try {
    // Import preset using vNext system
    const importResult = importPresetToRuntimeState(preset.preset, preset.id);
    
    // FAZ-3E PATCH #2: Log warnings only in dev mode (already logged in importPresetToRuntimeState)
    // Warnings are already logged in presetImportVNext.ts with IS_DEV check
    
    // FAZ-3D: Apply imported state to StateManager using replaceState()
    const stateManager = getStateManagerForPreset(preset.id);
    stateManager.replaceState(importResult.state);
  } catch (error) {
    // FAZ-4-3: Legacy fallback removed - vNext is required
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (IS_DEV) {
      console.error('[PresetImport] vNext import failed:', errorMessage);
    }
    // Continue with settings/mediaUrl handling even if import fails
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

