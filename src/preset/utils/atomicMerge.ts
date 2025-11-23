/**
 * Atomic Preset Merge Engine
 * 
 * Handles hybrid merge strategy for preset updates:
 * - background: full overwrite
 * - misc: full overwrite
 * - overlay: hybrid (mode full overwrite, elements ID-based partial merge)
 * 
 * This ensures atomic updates without losing data integrity.
 */

import type { PresetFile } from '../schema';
import type { OverlayElement } from '../../types/overlay';

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

  // Overlay: hybrid merge
  if (newPart.overlay) {
    merged.overlay = {
      ...oldPreset.overlay,
    };

    // Mode: full overwrite
    if (newPart.overlay.mode !== undefined) {
      merged.overlay.mode = newPart.overlay.mode;
    }

    // Elements: ID-based partial merge
    if (newPart.overlay.elements !== undefined) {
      const oldElements = oldPreset.overlay.elements || [];
      const newElements = newPart.overlay.elements;

      // Create a map of new elements by ID for quick lookup
      const newElementsMap = new Map<string, OverlayElement>();
      newElements.forEach(el => {
        if (el.id) {
          newElementsMap.set(el.id, el);
        }
      });

      // Merge: update existing elements by ID, preserve others
      const mergedElements: OverlayElement[] = [];
      const processedIds = new Set<string>();

      // First: update existing elements by ID
      oldElements.forEach(oldEl => {
        if (oldEl.id) {
          const newEl = newElementsMap.get(oldEl.id);
          if (newEl) {
            mergedElements.push(newEl);
            processedIds.add(oldEl.id);
          } else {
            mergedElements.push(oldEl);
          }
        } else {
          // Element without ID - preserve as-is
          mergedElements.push(oldEl);
        }
      });

      // Second: add new elements that don't exist in old array (by ID)
      newElements.forEach(newEl => {
        if (newEl.id && !processedIds.has(newEl.id)) {
          mergedElements.push(newEl);
          processedIds.add(newEl.id);
        } else if (!newEl.id) {
          // New element without ID - add it (shouldn't happen in normal flow)
          mergedElements.push(newEl);
        }
      });

      merged.overlay.elements = mergedElements;
    }
  }

  // Preserve schema metadata (schemaVersion, exportedAt, appVersion, presetName)
  // These are not merged, they remain from oldPreset

  return merged;
}

