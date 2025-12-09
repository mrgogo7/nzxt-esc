import type { AppSettings } from '../constants/defaults';
import type { Overlay, OverlayElement, MetricElementData, TextElementData, DividerElementData, ClockElementData, DateElementData } from '../types/overlay';
import {
  bringToFront,
  sendToBack,
  distributeHorizontally,
  distributeVertically,
  alignLeft,
  alignRight,
  alignTop,
  alignBottom,
  alignCenterX,
  alignCenterY,
} from './alignment';
import { getStateManagerForPreset } from '../state/overlay/useOverlayStateManager';
import { getElementsInZOrder } from '../state/overlay/selectors';
import { generateElementId } from '../overlayPreset/utils';
import { IS_DEV } from '../utils/env';

// ============================================================================
// LEGACY HELPERS (DELETED)
// ============================================================================
// The following legacy functions were deleted:
// - updateOverlayField
// - resetOverlayFieldValue
// - updateOverlayFields
// - updateCustomReading
// - updateCustomText
// All replaced by OverlayStateManager.dispatch() actions

// ============================================================================
// NEW ELEMENT-BASED HELPERS
// ============================================================================

/**
 * NOTE:
 * - Bu helper halen settings.overlay.elements üzerinde çalışıyor.
 * - ARCHITECT MODE'da settings.overlay.elements canonical değil (OverlayState vNext).
 * - Davranışı değiştirmemek için faz-4-2'de sadece işaretlendi.
 * - Gelecek fazlarda OverlayStateManager tabanlı hale getirilmeli.
 *
 * Updates a single overlay element in the overlay.
 * 
 * @param settings - Current app settings
 * @param overlay - Current overlay configuration (must be Overlay type)
 * @param elementId - ID of the element to update
 * @param updates - Partial element object with fields to update
 * @returns Updated app settings
 */
export function updateOverlayElement(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string,
  updates: Partial<OverlayElement>
): AppSettings {
  const elementIndex = overlay.elements.findIndex(el => el.id === elementId);
  
  if (elementIndex === -1) {
    return settings; // Element not found
  }
  
  const updatedElements = [...overlay.elements];
  updatedElements[elementIndex] = {
    ...updatedElements[elementIndex],
    ...updates,
  };
  
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * NOTE:
 * - Bu helper halen settings.overlay.elements üzerinde çalışıyor.
 * - ARCHITECT MODE'da settings.overlay.elements canonical değil (OverlayState vNext).
 * - Davranışı değiştirmemek için faz-4-2'de sadece işaretlendi.
 * - Gelecek fazlarda OverlayStateManager tabanlı hale getirilmeli.
 *
 * Updates the data of a metric element.
 * 
 * @param settings - Current app settings
 * @param overlay - Current overlay configuration
 * @param elementId - ID of the metric element to update
 * @param dataUpdates - Partial MetricElementData object
 * @returns Updated app settings
 */
export function updateMetricElementData(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string,
  dataUpdates: Partial<MetricElementData>
): AppSettings {
  const elementIndex = overlay.elements.findIndex(el => el.id === elementId);
  
  if (elementIndex === -1 || overlay.elements[elementIndex].type !== 'metric') {
    return settings; // Element not found or not a metric element
  }
  
  // Normalize numeric values to integers (except for fields that should remain float)
  const normalizedUpdates: Partial<MetricElementData> = { ...dataUpdates };
  if ('numberSize' in normalizedUpdates && typeof normalizedUpdates.numberSize === 'number') {
    normalizedUpdates.numberSize = Math.round(normalizedUpdates.numberSize);
  }
  if ('textSize' in normalizedUpdates && typeof normalizedUpdates.textSize === 'number') {
    normalizedUpdates.textSize = Math.round(normalizedUpdates.textSize);
  }
  
  const updatedElements = [...overlay.elements];
  updatedElements[elementIndex] = {
    ...updatedElements[elementIndex],
    data: {
      ...(updatedElements[elementIndex].data as MetricElementData),
      ...normalizedUpdates,
    },
  };
  
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * NOTE:
 * - Bu helper halen settings.overlay.elements üzerinde çalışıyor.
 * - ARCHITECT MODE'da settings.overlay.elements canonical değil (OverlayState vNext).
 * - Davranışı değiştirmemek için faz-4-2'de sadece işaretlendi.
 * - Gelecek fazlarda OverlayStateManager tabanlı hale getirilmeli.
 *
 * Updates the data of a text element.
 * 
 * @param settings - Current app settings
 * @param overlay - Current overlay configuration
 * @param elementId - ID of the text element to update
 * @param dataUpdates - Partial TextElementData object
 * @returns Updated app settings
 */
export function updateTextElementData(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string,
  dataUpdates: Partial<TextElementData>
): AppSettings {
  const elementIndex = overlay.elements.findIndex(el => el.id === elementId);
  
  if (elementIndex === -1 || overlay.elements[elementIndex].type !== 'text') {
    return settings; // Element not found or not a text element
  }
  
  // Normalize numeric values to integers
  const normalizedUpdates: Partial<TextElementData> = { ...dataUpdates };
  if ('textSize' in normalizedUpdates && typeof normalizedUpdates.textSize === 'number') {
    normalizedUpdates.textSize = Math.round(normalizedUpdates.textSize);
  }
  
  const updatedElements = [...overlay.elements];
  updatedElements[elementIndex] = {
    ...updatedElements[elementIndex],
    data: {
      ...(updatedElements[elementIndex].data as TextElementData),
      ...normalizedUpdates,
    },
  };
  
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * NOTE:
 * - Bu helper halen settings.overlay.elements üzerinde çalışıyor.
 * - ARCHITECT MODE'da settings.overlay.elements canonical değil (OverlayState vNext).
 * - Davranışı değiştirmemek için faz-4-2'de sadece işaretlendi.
 * - Gelecek fazlarda OverlayStateManager tabanlı hale getirilmeli.
 *
 * Updates the data of a divider element.
 * 
 * @param settings - Current app settings
 * @param overlay - Current overlay configuration
 * @param elementId - ID of the divider element to update
 * @param dataUpdates - Partial DividerElementData object
 * @returns Updated app settings
 */
export function updateDividerElementData(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string,
  dataUpdates: Partial<DividerElementData>
): AppSettings {
  const elementIndex = overlay.elements.findIndex(el => el.id === elementId);
  
  if (elementIndex === -1 || overlay.elements[elementIndex].type !== 'divider') {
    return settings; // Element not found or not a divider element
  }
  
  // Normalize numeric values to integers
  const normalizedUpdates: Partial<DividerElementData> = { ...dataUpdates };
  if ('width' in normalizedUpdates && typeof normalizedUpdates.width === 'number') {
    normalizedUpdates.width = Math.round(normalizedUpdates.width);
  }
  if ('height' in normalizedUpdates && typeof normalizedUpdates.height === 'number') {
    normalizedUpdates.height = Math.round(normalizedUpdates.height);
  }
  
  const updatedElements = [...overlay.elements];
  updatedElements[elementIndex] = {
    ...updatedElements[elementIndex],
    data: {
      ...(updatedElements[elementIndex].data as DividerElementData),
      ...normalizedUpdates,
    },
  };
  
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

// addOverlayElement deleted - use OverlayStateManager.dispatch(createAddElementAction(...)) instead

/**
 * Creates a default clock element with proper defaults.
 * 
 * @param x - X position (default: 0)
 * @param y - Y position (default: 0)
 * @param zIndex - Z index (default: 0)
 * @returns New clock element with default values
 */
export function defaultClockElement(x: number = 0, y: number = 0, zIndex: number = 0): OverlayElement {
  const id = generateElementId();
  
  return {
    id,
    type: 'clock',
    x,
    y,
    zIndex,
    data: {
      format: "HH:mm",
      mode: "24h",
      fontSize: 45, // Same default as text element
      color: "rgba(255, 255, 255, 1)", // Same default as text element
      outlineColor: undefined,
      outlineThickness: 0,
    } as ClockElementData,
  };
}

/**
 * Creates a default date element with proper defaults.
 * 
 * @param x - X position (default: 0)
 * @param y - Y position (default: 0)
 * @param zIndex - Z index (default: 0)
 * @returns New date element with default values
 */
export function defaultDateElement(x: number = 0, y: number = 0, zIndex: number = 0): OverlayElement {
  const id = generateElementId();
  
  return {
    id,
    type: 'date',
    x,
    y,
    zIndex,
    data: {
      format: "DD.MM.YYYY", // Default format
      fontSize: 45, // Same default as text element
      color: "rgba(255, 255, 255, 1)", // Same default as text element
      outlineColor: undefined,
      outlineThickness: 0,
    } as DateElementData,
  };
}

/**
 * Creates a new overlay element with proper defaults and ID generation.
 * ARCHITECT MODE: This function only creates the element, it does NOT write to settings or runtime.
 * Use OverlayStateManager.dispatch(createAddElementAction(element)) to actually add it to runtime.
 * 
 * @param settings - Current app settings (for context, not modified)
 * @param overlayConfig - Current overlay configuration (for zIndex calculation)
 * @param partial - Partial element configuration (type and data are required)
 * @returns New overlay element with generated ID and normalized zIndex
 */
export function createOverlayElementForAdd(
  _settings: AppSettings,
  overlayConfig: Overlay,
  partial: Partial<OverlayElement> & { type: OverlayElement['type']; data: OverlayElement['data'] }
): OverlayElement {
  // Handle clock type with defaultClockElement
  if (partial.type === 'clock') {
    const currentCount = Array.isArray(overlayConfig.elements) ? overlayConfig.elements.length : 0;
    return defaultClockElement(partial.x ?? 0, partial.y ?? 0, partial.zIndex ?? currentCount);
  }
  
  // Handle date type with defaultDateElement
  if (partial.type === 'date') {
    const currentCount = Array.isArray(overlayConfig.elements) ? overlayConfig.elements.length : 0;
    return defaultDateElement(partial.x ?? 0, partial.y ?? 0, partial.zIndex ?? currentCount);
  }
  
  // Get current runtime count for zIndex calculation (from overlayConfig which comes from runtime)
  const currentCount = Array.isArray(overlayConfig.elements) ? overlayConfig.elements.length : 0;
  
  // Generate unique ID
  const id = generateElementId();
  
  // Create element with defaults
  const element: OverlayElement = {
    id,
    type: partial.type,
    x: partial.x ?? 0,
    y: partial.y ?? 0,
    zIndex: partial.zIndex ?? currentCount,
    angle: partial.angle,
    data: partial.data,
  };
  
  return element;
}

/**
 * Removes an overlay element from the overlay.
 * 
 * @param settings - Current app settings
 * @param overlay - Current overlay configuration
 * @param elementId - ID of the element to remove
 * @returns Updated app settings
 */
export function removeOverlayElement(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string
): AppSettings {
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: overlay.elements.filter(el => el.id !== elementId),
    },
  };
}

// reorderOverlayElements deleted - use OverlayStateManager.dispatch(createZOrderAction(...)) instead

/**
 * Updates the position of an overlay element.
 * 
 * @param settings - Current app settings
 * @param overlay - Current overlay configuration
 * @param elementId - ID of the element to update
 * @param x - New X position
 * @param y - New Y position
 * @returns Updated app settings
 */
export function updateOverlayElementPosition(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string,
  x: number,
  y: number
): AppSettings {
  // Ensure integer values for position
  return updateOverlayElement(settings, overlay, elementId, { 
    x: Math.round(x), 
    y: Math.round(y) 
  });
}

/**
 * Updates an overlay element's rotation angle.
 */
export function updateOverlayElementAngle(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string,
  angle: number
): AppSettings {
  // Normalize angle to 0-360 range and round to integer
  let normalizedAngle = angle % 360;
  if (normalizedAngle < 0) {
    normalizedAngle += 360;
  }
  const roundedAngle = Math.round(normalizedAngle);
  // Omit angle if 0 for cleaner data
  return updateOverlayElement(settings, overlay, elementId, { 
    angle: roundedAngle === 0 ? undefined : roundedAngle 
  });
}

/**
 * Alignment helper functions.
 */

/**
 * Brings an element to the front (highest z-index).
 */
export function bringElementToFront(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string
): AppSettings {
  const updatedElements = bringToFront(overlay.elements, elementId);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Sends an element to the back (lowest z-index).
 */
export function sendElementToBack(
  settings: AppSettings,
  overlay: Overlay,
  elementId: string
): AppSettings {
  const updatedElements = sendToBack(overlay.elements, elementId);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Distributes selected elements horizontally with equal spacing.
 */
export function distributeElementsHorizontally(
  settings: AppSettings,
  overlay: Overlay,
  elementIds: string[]
): AppSettings {
  const updatedElements = distributeHorizontally(overlay.elements, elementIds);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Distributes selected elements vertically with equal spacing.
 */
export function distributeElementsVertically(
  settings: AppSettings,
  overlay: Overlay,
  elementIds: string[]
): AppSettings {
  const updatedElements = distributeVertically(overlay.elements, elementIds);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Aligns selected elements to the left.
 */
export function alignElementsLeft(
  settings: AppSettings,
  overlay: Overlay,
  elementIds: string[]
): AppSettings {
  const updatedElements = alignLeft(overlay.elements, elementIds);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Aligns selected elements to the right.
 */
export function alignElementsRight(
  settings: AppSettings,
  overlay: Overlay,
  elementIds: string[]
): AppSettings {
  const updatedElements = alignRight(overlay.elements, elementIds);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Aligns selected elements to the top.
 */
export function alignElementsTop(
  settings: AppSettings,
  overlay: Overlay,
  elementIds: string[]
): AppSettings {
  const updatedElements = alignTop(overlay.elements, elementIds);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Aligns selected elements to the bottom.
 */
export function alignElementsBottom(
  settings: AppSettings,
  overlay: Overlay,
  elementIds: string[]
): AppSettings {
  const updatedElements = alignBottom(overlay.elements, elementIds);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Centers selected elements horizontally (x = 0).
 */
export function alignElementsCenterX(
  settings: AppSettings,
  overlay: Overlay,
  elementIds: string[]
): AppSettings {
  const updatedElements = alignCenterX(overlay.elements, elementIds);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Centers selected elements vertically (y = 0).
 */
export function alignElementsCenterY(
  settings: AppSettings,
  overlay: Overlay,
  elementIds: string[]
): AppSettings {
  const updatedElements = alignCenterY(overlay.elements, elementIds);
  return {
    ...settings,
    overlay: {
      ...overlay,
      elements: updatedElements,
    },
  };
}

/**
 * Maximum number of overlay elements allowed.
 * This is a GLOBAL HARD LIMIT that applies to ALL sources:
 * - Manual elements (preset-based)
 * - Runtime elements (imported templates)
 * - Total combined elements
 */
export const MAX_OVERLAY_ELEMENTS = 20;

/**
 * Get total element count from runtime overlay only.
 * ARCHITECT MODE: Only runtime overlay elements are counted (preset elements are ignored).
 * 
 * Migrated to vNext - uses OverlayStateManager
 * 
 * @param activePresetId - Active preset ID (null for default/fallback)
 * @returns Total element count from runtime overlay
 */
export function getTotalElementCount(activePresetId: string | null): number {
  if (!activePresetId) {
    return 0;
  }
  try {
    const stateManager = getStateManagerForPreset(activePresetId);
    const state = stateManager.getState();
    const elements = getElementsInZOrder(state.elements, state.zOrder);
    return elements.length;
  } catch {
    return 0;
  }
}

/**
 * Checks if adding a single element would exceed the maximum limit.
 * ARCHITECT MODE: Only runtime overlay elements are counted.
 * 
 * Migrated to vNext - uses OverlayStateManager
 * 
 * @param activePresetId - Active preset ID (null for default/fallback)
 * @param additionalCount - Number of elements to add (default: 1)
 * @returns true if adding would not exceed limit, false otherwise
 */
export function canAddElement(activePresetId: string | null, additionalCount: number = 1): boolean {
  if (!activePresetId) {
    return false;
  }
  try {
    const stateManager = getStateManagerForPreset(activePresetId);
    const state = stateManager.getState();
    const elements = getElementsInZOrder(state.elements, state.zOrder);
    return (elements.length + additionalCount) <= MAX_OVERLAY_ELEMENTS;
  } catch {
    return false;
  }
}

/**
 * Checks if adding new elements would exceed the maximum limit.
 * ARCHITECT MODE: Only runtime overlay elements are counted.
 * 
 * @deprecated Use canAddElement() instead for single element checks.
 * This function is kept for backward compatibility but now uses runtime-only count.
 * 
 * @param _settings - Current app settings (ignored, kept for backward compatibility)
 * @param runtimeElementCount - Current runtime element count
 * @param countToAdd - Number of elements to add
 * @returns true if adding would not exceed limit, false otherwise
 */
export function canAddElements(
  _settings: AppSettings,
  runtimeElementCount: number,
  countToAdd: number
): boolean {
  // ARCHITECT MODE: Only use runtime count (ignore settings.overlay.elements)
  // activePresetId is not available here, so we use runtimeElementCount as fallback
  // This is a compatibility function - prefer canAddElement(activePresetId, countToAdd) in new code
  const safeCountToAdd = typeof countToAdd === 'number' && !isNaN(countToAdd) ? countToAdd : 0;
  const safeRuntimeCount = typeof runtimeElementCount === 'number' && !isNaN(runtimeElementCount) ? runtimeElementCount : 0;
  
  const result = (safeRuntimeCount + safeCountToAdd) <= MAX_OVERLAY_ELEMENTS;
  return result;
}

/**
 * Merges base and new elements while enforcing the global limit.
 * Returns only the elements that fit within MAX_OVERLAY_ELEMENTS.
 * 
 * @param baseElements - Existing elements (preset manual)
 * @param newElements - New elements to merge (runtime imported)
 * @returns Merged array truncated to MAX_OVERLAY_ELEMENTS
 */
export function mergeWithLimit(
  baseElements: OverlayElement[],
  newElements: OverlayElement[]
): OverlayElement[] {
  const merged = [...baseElements, ...newElements];
  if (merged.length > MAX_OVERLAY_ELEMENTS) {
    return merged.slice(0, MAX_OVERLAY_ELEMENTS);
  }
  return merged;
}

/**
 * Checks if adding new elements would exceed the maximum limit.
 * 
 * @deprecated Use canAddElements() instead for accurate total count checking.
 * This function is kept for backward compatibility.
 * 
 * @param currentElementCount - Current number of elements in overlay
 * @param newElementCount - Number of elements to add
 * @returns true if adding would exceed limit, false otherwise
 */
export function wouldExceedElementLimit(
  currentElementCount: number,
  newElementCount: number
): boolean {
  // DEFENSIVE: Ensure inputs are valid numbers
  const safeCurrent = typeof currentElementCount === 'number' && !isNaN(currentElementCount) ? currentElementCount : 0;
  const safeNew = typeof newElementCount === 'number' && !isNaN(newElementCount) ? newElementCount : 0;
  
  const result = (safeCurrent + safeNew) > MAX_OVERLAY_ELEMENTS;
  return result;
}

/**
 * Clears all overlay elements from settings.
 * This is the central helper for resetting overlay state.
 * 
 * @param settings - Current app settings
 * @returns New settings with empty overlay elements array
 */
export function clearAllOverlayElements(settings: AppSettings): AppSettings {
  return {
    ...settings,
    overlay: {
      mode: settings.overlay?.mode || 'none',
      elements: [],
    },
  };
}

/**
 * Resolve ID conflicts for overlay elements during append import.
 * 
 * If element ID already exists in current state, clone element with new unique ID.
 * 
 * @param element - Element to check/resolve
 * @param existingElementIds - Set of existing element IDs in current state
 * @returns Element with resolved ID (cloned with new ID if conflict detected)
 */
export function resolveElementIdConflict(
  element: OverlayElement,
  existingElementIds: Set<string>
): OverlayElement {
  // If ID doesn't exist, return element as-is
  if (!existingElementIds.has(element.id)) {
    return element;
  }
  
  // ID conflict detected - clone element with new unique ID
  const newId = generateElementId();
  
  if (IS_DEV) {
    // ID conflict detected → cloning element
  }
  
  // Clone element with new ID
  const clonedElement: OverlayElement = {
    ...element,
    id: newId,
    // Note: createdAt/updatedAt are not part of OverlayElement interface
    // They would be in metadata if present, but we're just cloning the element
  };
  
  return clonedElement;
}