/**
 * Preset Schema v3 — FAZ-3C: Unified Runtime State Integration
 * 
 * Schema v3 introduces canonical z-order support and ensures compatibility
 * with the unified OverlayRuntimeState model from FAZ-3A.
 * 
 * Key Changes from v2:
 * - overlay.zOrder: Canonical z-order array (element IDs in render order)
 * - overlay.elements: Element array (maintained for compatibility)
 * - Runtime-only fields NEVER stored (selection, hover, history, transactions)
 * - Derived fields NEVER stored (AABB, RBox, combinedBox)
 * - Only STATIC FIELDS stored (position, size, rotation, style, type, metadata)
 */

import type { PresetFile } from '../schema';
import type { OverlayElement } from '../../types/overlay';

/**
 * PresetFile v3 interface.
 * Extends PresetFile with canonical z-order support.
 */
export interface PresetFileV3 extends PresetFile {
  /** Schema version 3 */
  schemaVersion: 3;
  /** Overlay configuration with canonical z-order */
  overlay: OverlayV3;
}

/**
 * Overlay v3 interface.
 * Adds canonical z-order array for deterministic layer stack.
 */
export interface OverlayV3 {
  /** Overlay mode */
  mode: 'none' | 'custom';
  /** Overlay elements array (maintained for compatibility) */
  elements: OverlayElement[];
  /**
   * Canonical z-order array (element IDs in render order).
   * 
   * - Front-to-back order: Last element in array is rendered on top (front)
   * - Must contain all element IDs from elements array
   * - Must NOT contain duplicate IDs
   * - Must NOT contain IDs not in elements array (orphans)
   * 
   * This is the authoritative source for element render order.
   * Element array order is ignored when zOrder is present.
   */
  zOrder?: string[];
}

/**
 * Type guard to check if a PresetFile is v3.
 */
export function isPresetFileV3(file: PresetFile): file is PresetFileV3 {
  return file.schemaVersion === 3;
}

/**
 * Validate PresetFile v3 structure.
 * 
 * @param file - PresetFile to validate
 * @returns True if file is valid v3 structure
 */
export function validatePresetFileV3(file: PresetFile): boolean {
  if (!isPresetFileV3(file)) {
    return false;
  }

  // Validate z-order if present
  if (file.overlay.zOrder !== undefined) {
    const zOrder = file.overlay.zOrder;
    const elementIds = new Set(file.overlay.elements.map(el => el.id));

    // Check for duplicates
    const seenIds = new Set<string>();
    for (const id of zOrder) {
      if (seenIds.has(id)) {
        return false; // Duplicate ID
      }
      seenIds.add(id);
    }

    // Check for orphan IDs (IDs in zOrder but not in elements)
    for (const id of zOrder) {
      if (!elementIds.has(id)) {
        return false; // Orphan ID
      }
    }

    // Check that all elements are in zOrder
    for (const element of file.overlay.elements) {
      if (!zOrder.includes(element.id)) {
        return false; // Element missing from zOrder
      }
    }
  }

  return true;
}

