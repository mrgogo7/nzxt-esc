/**
 * Preset Export vNext — FAZ-3C: OverlayRuntimeState → PresetFile v3
 * 
 * Converts Unified OverlayRuntimeState to PresetFile v3.
 * 
 * Key Principles:
 * - Runtime-only fields are NEVER exported (selection, hover, history, transactions)
 * - Derived fields are NEVER exported (AABB, RBox, combinedBox) - these are computed on-demand
 * - Only STATIC FIELDS are exported (position, size, rotation, style, type, metadata)
 * - Canonical z-order is preserved in overlay.zOrder
 * - Element array order matches z-order (for compatibility)
 * - Extensible for future element types (image, gif, weather, usageBar)
 */

import type { OverlayRuntimeState } from '../../state/overlay/types';
import type { PresetFileV3, OverlayV3 } from './schema_v3';
import type { OverlayElement } from '../../types/overlay';
import { APP_VERSION } from '../../version';
import { getElementsInZOrder } from '../../state/overlay/selectors';

/**
 * Convert OverlayRuntimeState to PresetFile v3.
 * 
 * This function:
 * 1. Extracts elements from runtime state (in z-order)
 * 2. Filters out runtime-only fields (selection, history, transactions)
 * 3. Filters out derived fields (computed on-demand, never stored)
 * 4. Builds PresetFile v3 with canonical z-order
 * 5. Preserves only static element data (position, size, rotation, style, type, metadata)
 * 
 * @param state - Runtime state to export
 * @param presetName - Preset name (optional, defaults to 'Preset')
 * @param exportedAt - Export timestamp (optional, defaults to current time)
 * @returns Preset file v3
 */
export function exportRuntimeStateToPreset(
  state: OverlayRuntimeState,
  presetName: string = 'Preset',
  exportedAt?: string
): PresetFileV3 {
  // Get elements in z-order (canonical render order)
  const elementsInOrder = getElementsInZOrder(state.elements, state.zOrder);
  
  // Filter elements to static fields only (no runtime-only, no derived)
  const staticElements: OverlayElement[] = elementsInOrder.map(element => {
    // Create static element copy (only static fields)
    const staticElement: OverlayElement = {
      id: element.id,
      type: element.type,
      x: element.x,
      y: element.y,
      // zIndex is NOT exported (zOrder array is canonical)
      // angle is exported (it's a static field)
      ...(element.angle !== undefined && { angle: element.angle }),
      // data is exported (contains static style/type data)
      data: element.data,
    };
    
    return staticElement;
  });
  
  // Build canonical z-order array (from runtime state zOrder)
  const zOrderArray = state.zOrder.length > 0 ? [...state.zOrder] : undefined;
  
  // Create overlay v3 with canonical z-order
  const overlay: OverlayV3 = {
    mode: staticElements.length > 0 ? 'custom' : 'none',
    elements: staticElements,
    zOrder: zOrderArray,
  };
  
  // Create preset file v3
  const preset: PresetFileV3 = {
    schemaVersion: 3 as const,
    exportedAt: exportedAt || new Date().toISOString(),
    appVersion: APP_VERSION,
    presetName,
    background: {
      // Background is NOT part of runtime state, so we use empty defaults
      // UI layer should provide background separately if needed
      url: '',
      settings: {
        scale: 1,
        x: 0,
        y: 0,
        fit: 'cover',
        align: 'center',
        loop: true,
        autoplay: true,
        mute: true,
        resolution: '640x640',
        backgroundColor: '#000000',
      },
      source: {
        type: 'remote',
        url: '',
      },
    },
    overlay,
    misc: undefined,
  };
  
  return preset;
}

/**
 * Export runtime state to overlay-only preset (for overlay preset format).
 * This exports only the overlay portion (elements + z-order).
 * 
 * @param state - Runtime state to export
 * @returns Overlay v3 object
 */
export function exportRuntimeStateToOverlay(
  state: OverlayRuntimeState
): OverlayV3 {
  // Get elements in z-order
  const elementsInOrder = getElementsInZOrder(state.elements, state.zOrder);
  
  // Filter to static fields only
  const staticElements: OverlayElement[] = elementsInOrder.map(element => {
    return {
      id: element.id,
      type: element.type,
      x: element.x,
      y: element.y,
      ...(element.angle !== undefined && { angle: element.angle }),
      data: element.data,
    };
  });
  
  // Build canonical z-order array
  const zOrderArray = state.zOrder.length > 0 ? [...state.zOrder] : undefined;
  
  return {
    mode: staticElements.length > 0 ? 'custom' : 'none',
    elements: staticElements,
    zOrder: zOrderArray,
  };
}

