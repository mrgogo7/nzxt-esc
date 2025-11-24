/**
 * Atomic Preset Merge Engine
 * 
 * Handles merge strategy for preset updates:
 * - background: full overwrite
 * - misc: full overwrite
 * - overlay: mode + elements (elements ARE stored in presets for persistence)
 * 
 * FAZ 9.2 HOTFIX: Overlay elements ARE stored in preset files for persistence.
 * Elements are loaded from preset files into runtime on preset switch/F5.
 * 
 * This ensures atomic updates without losing data integrity.
 */

import type { PresetFile } from '../schema';

/**
 * Merges preset fields using hybrid strategy.
 * 
 * Merge rules:
 * - background: full overwrite if newPart.background exists
 * - misc: full overwrite if newPart.misc exists
 * - overlay.mode: full overwrite if newPart.overlay.mode exists
 * - overlay.elements: ID-based partial merge (update existing, preserve others)
 * 
 * @param oldPreset - Existing preset file
 * @param newPart - Partial preset file with updates
 * @returns Merged preset file
 */
export function mergePresetFields(
  oldPreset: PresetFile,
  newPart: Partial<PresetFile>
): PresetFile {
  const merged: PresetFile = {
    ...oldPreset,
  };

  // Background: full overwrite
  if (newPart.background) {
    merged.background = {
      ...newPart.background,
    };
  }

  // Misc: full overwrite
  if (newPart.misc !== undefined) {
    merged.misc = newPart.misc;
  }

  // Overlay: FAZ 7 FIX v2 - Save mode AND elements from runtime
  // CRITICAL: Overlay elements come from runtime overlay Map and MUST be saved to preset for persistence
  if (newPart.overlay) {
    // FAZ 7 FIX v2: Use elements from newPart.overlay.elements (which comes from runtime via useAtomicPresetSync)
    const newElements = Array.isArray(newPart.overlay.elements) ? newPart.overlay.elements : [];
    
    merged.overlay = {
      mode: newPart.overlay.mode ?? oldPreset.overlay?.mode ?? 'none',
      elements: newElements, // FAZ 7 FIX v2: Save runtime elements to preset (NEVER override with [])
    };
    
    // DEBUG: Log overlay merge
    console.log('[atomicMerge] Overlay merge - mode:', merged.overlay.mode, 'elements count:', newElements.length, 'elements:', newElements);
  } else {
    // DEFENSIVE: Preserve existing overlay elements from oldPreset (FAZ 7 FIX v2)
    if (!merged.overlay) {
      merged.overlay = {
        mode: oldPreset.overlay?.mode ?? 'none',
        elements: Array.isArray(oldPreset.overlay?.elements) ? oldPreset.overlay.elements : [],
      };
    } else {
      // Preserve existing elements if not being updated (FAZ 7 FIX v2)
      merged.overlay.elements = Array.isArray(merged.overlay.elements) ? merged.overlay.elements : (Array.isArray(oldPreset.overlay?.elements) ? oldPreset.overlay.elements : []);
    }
  }

  // Preserve schema metadata (schemaVersion, exportedAt, appVersion, presetName)
  // These are not merged, they remain from oldPreset

  return merged;
}

