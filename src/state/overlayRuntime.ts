/**
 * Overlay Runtime State
 * 
 * Manages overlay elements in-memory, scoped per preset.
 * 
 * ARCHITECT MODE Architecture:
 * - Runtime elements are stored in-memory only (not persisted to presets)
 * - Runtime elements are scoped per preset (each preset has its own runtime overlay state)
 * - Runtime elements persist across preset switches (each preset remembers its own overlay)
 * - Runtime elements are cleared only when user explicitly clears them (per preset)
 * - overlay.elements are NEVER stored in preset files
 * - overlay.elements are ONLY stored in this runtime Map
 * 
 * CRITICAL: This ensures each preset can have its own overlay configuration,
 * even though overlay.elements are not stored in preset JSON files.
 */

import type { OverlayElement } from '../types/overlay';
import { MAX_OVERLAY_ELEMENTS } from '../utils/overlaySettingsHelpers';

/**
 * Generate a unique ID for an overlay element.
 * Used for remapping imported element IDs during append operations.
 */
function generateElementId(): string {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debug mode flag for runtime overlay logging.
 * Set window.__NZXT_ESC_DEBUG_RUNTIME = true to enable detailed logging.
 */
const isDebugMode = (): boolean => {
  return typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true;
};

/**
 * Runtime state container for overlay elements.
 * Keyed by preset ID to ensure each preset has its own overlay state.
 * This is a singleton module-level state (not React state) to ensure persistence
 * across component re-renders.
 */
const runtimeOverlays: Map<string, OverlayElement[]> = new Map();

/**
 * Event-based subscription system for runtime overlay changes.
 * Allows components to react to runtime overlay updates without polling.
 */
type RuntimeChangeCallback = (presetId: string | null) => void;
const runtimeChangeCallbacks: Set<RuntimeChangeCallback> = new Set();

/**
 * Subscribe to runtime overlay changes.
 * Callback will be invoked whenever overlay elements are modified for any preset.
 * 
 * @param callback - Function to call when runtime overlay changes (receives presetId)
 * @returns Unsubscribe function
 */
export function subscribeRuntimeChange(callback: RuntimeChangeCallback): () => void {
  runtimeChangeCallbacks.add(callback);
  return () => {
    runtimeChangeCallbacks.delete(callback);
  };
}

/**
 * Notify all subscribers that runtime overlay has changed for a specific preset.
 * Called internally after any append/replace/update/clear operation.
 * 
 * @param presetId - Preset ID that was modified (null if operation failed)
 */
function notifyRuntimeChange(presetId: string | null): void {
  if (isDebugMode()) {
    console.log('[overlayRuntime] Notifying runtime change for preset:', presetId);
  }
  runtimeChangeCallbacks.forEach(callback => {
    try {
      callback(presetId);
    } catch (error) {
      // CRITICAL: Always log errors in callbacks
      console.error('[overlayRuntime] Error in runtime change callback:', error);
    }
  });
}

/**
 * CRITICAL DEBUG: Verify runtime overlay state before and after operations.
 * Logs detailed information to track down reset issues.
 */
function verifyRuntimeState(
  presetId: string | null,
  beforeCount: number,
  afterCount: number,
  callerFunction: string,
  newElements?: OverlayElement[]
): void {
  const isDebug = isDebugMode();
  
  // Always log critical state changes (even outside debug mode)
  if (afterCount === 0 && beforeCount > 0) {
    console.error('[RUNTIME-VERIFY] ⚠️ RUNTIME LOST ELEMENTS HERE', {
      presetId,
      beforeElementsCount: beforeCount,
      afterElementsCount: afterCount,
      callerFunction,
      stackTrace: new Error().stack,
    });
  }
  
  // Debug mode: log all state changes
  if (isDebug) {
    console.log('[RUNTIME-VERIFY]', {
      presetId,
      beforeElementsCount: beforeCount,
      afterElementsCount: afterCount,
      callerFunction,
      newElementsLength: newElements?.length,
      newElements: newElements,
    });
  }
}

/**
 * Internal helper: Get elements from Map for a specific preset.
 * Always returns an array (never null/undefined).
 * CRASH PREVENTION: Handles null presetId, undefined Map entries, and non-array values.
 */
function getElementsForPresetInternal(presetId: string | null): OverlayElement[] {
  if (!presetId) {
    return []; // No preset = no runtime elements
  }
  
  const elements = runtimeOverlays.get(presetId);
  
  // CRASH PREVENTION: Ensure elements is always an array
  if (!Array.isArray(elements)) {
    // CRITICAL: If Map contains non-array value, log error and return empty array
    if (elements !== undefined && elements !== null) {
      console.error(`[overlayRuntime] CRITICAL: Non-array value in runtimeOverlays for preset ${presetId}:`, typeof elements);
      // Clean up corrupted entry
      runtimeOverlays.set(presetId, []);
    }
    return [];
  }
  
  return elements;
}

/**
 * Get overlay elements for a specific preset.
 * Returns empty array if preset has no runtime elements.
 * 
 * @param presetId - Active preset ID (null for default/fallback)
 * @returns Array of overlay elements for the preset (copy to prevent mutations)
 */
export function getElementsForPreset(presetId: string | null): OverlayElement[] {
  const elements = getElementsForPresetInternal(presetId);
  const result = [...elements]; // Return copy to prevent mutations
  // DEBUG: Only log in debug mode
  if (isDebugMode()) {
    console.log('[RUNTIME] getElementsForPreset presetId:', presetId, 'count:', result.length);
  }
  return result;
}

/**
 * Set overlay elements for a specific preset.
 * Directly replaces all elements for the preset.
 * ARCHITECT MODE: Uses "ya hep ya hiç" approach via canReplaceElements check.
 * 
 * @param presetId - Active preset ID (null = no-op, logs error in debug mode)
 * @param elements - Elements to set (must be <= MAX_OVERLAY_ELEMENTS)
 */
export function setElementsForPreset(presetId: string | null, elements: OverlayElement[]): void {
  // CRASH PREVENTION: Null presetId guard
  if (!presetId) {
    if (isDebugMode()) {
      console.error('[overlayRuntime] setElementsForPreset called with null presetId - no-op');
    }
    return; // No preset = no-op
  }
  
  // DEFENSIVE: Ensure elements is an array
  const safeElements = Array.isArray(elements) ? elements : [];
  
  // Use replaceElementsForPreset which enforces "ya hep ya hiç" limit
  replaceElementsForPreset(presetId, safeElements);
}

/**
 * Check if elements can be appended to a preset without exceeding limit.
 * 
 * @param presetId - Active preset ID (null = returns false)
 * @param elementsCount - Number of elements to append
 * @returns true if append is allowed, false if limit would be exceeded
 */
export function canAppendElements(presetId: string | null, elementsCount: number): boolean {
  // CRASH PREVENTION: Null presetId guard
  if (!presetId) {
    return false;
  }
  
  // DEFENSIVE: Ensure elementsCount is a valid number
  const safeCount = typeof elementsCount === 'number' && !isNaN(elementsCount) && elementsCount >= 0 ? elementsCount : 0;
  
  const currentCount = getElementCountForPreset(presetId);
  return (currentCount + safeCount) <= MAX_OVERLAY_ELEMENTS;
}

/**
 * Generate a unique overlay element with a new ID.
 * Deep clones the element and assigns a new unique ID to prevent React key conflicts.
 * 
 * FAZ 9.2 HOTFIX: Used during append operations to remap imported element IDs.
 * 
 * @param element - Original element to clone
 * @returns Deep-cloned element with new unique ID
 */
function generateUniqueOverlayElement(element: OverlayElement): OverlayElement {
  // Deep clone the element
  const cloned: OverlayElement = {
    ...element,
    data: { ...element.data }, // Shallow clone data (should be sufficient for current structure)
  };
  
  // Generate new unique ID
  const newId = generateElementId();
  cloned.id = newId;
  
  return cloned;
}

/**
 * Append elements to runtime state for a specific preset.
 * ARCHITECT MODE: "Ya hep ya hiç" - either all elements are appended or none.
 * 
 * FAZ 9.2 HOTFIX: Remaps imported element IDs to prevent React key conflicts.
 * Also adjusts zIndex to preserve render order.
 * 
 * @param presetId - Active preset ID (null = no-op, returns 0, logs error)
 * @param elements - Elements to append to runtime elements
 * @returns Number of elements appended (0 if limit would be exceeded, elements.length if successful)
 */
export function appendElementsForPreset(presetId: string | null, elements: OverlayElement[]): number {
  // CRASH PREVENTION: Null presetId guard
  if (!presetId) {
    console.error('[overlayRuntime] CRITICAL: appendElementsForPreset called with null presetId - aborting');
    return 0; // No preset = no-op
  }
  
  // DEFENSIVE: Ensure elements is an array
  const safeElements = Array.isArray(elements) ? elements : [];
  
  if (safeElements.length === 0) {
    return 0;
  }

  // CRITICAL: Pre-check limit - "ya hep ya hiç" approach
  if (!canAppendElements(presetId, safeElements.length)) {
    if (isDebugMode()) {
      const currentCount = getElementCountForPreset(presetId);
      console.log(`[overlayRuntime] Append rejected - limit would be exceeded (current: ${currentCount}, adding: ${safeElements.length}, max: ${MAX_OVERLAY_ELEMENTS})`);
    }
    return 0; // Limit would be exceeded, do not append anything
  }

  const currentElements = getElementsForPresetInternal(presetId);
  const beforeCount = currentElements.length;
  
  // FAZ 9.2 HOTFIX: Remap IDs for imported elements to prevent React key conflicts
  // Deep clone and regenerate IDs for all imported elements
  const remappedElements = safeElements.map(el => {
    const oldId = el.id;
    const remapped = generateUniqueOverlayElement(el);
    
    // Safety check: Ensure remapped ID doesn't conflict with existing elements
    // This is extremely rare but handle it defensively
    const existingIds = new Set(currentElements.map(e => e.id));
    let attempts = 0;
    while (existingIds.has(remapped.id) && attempts < 10) {
      remapped.id = generateElementId();
      attempts++;
    }
    
    if (attempts > 0 && isDebugMode()) {
      console.warn(`[appendElementsForPreset] ID conflict resolved after ${attempts} attempts for oldId: ${oldId}`);
    }
    
    if (isDebugMode()) {
      console.log(`[appendElementsForPreset] ID remapped for append: ${oldId} → ${remapped.id}`);
    }
    
    return remapped;
  });
  
  // FAZ 9.2 HOTFIX: Preserve zIndex ordering
  // Calculate max zIndex from existing elements
  const maxZIndex = currentElements.length > 0
    ? Math.max(...currentElements.map(el => el.zIndex ?? 0), 0)
    : -1;
  
  // Shift all imported elements' zIndex by (maxZIndex + 1) to place them after existing elements
  const zIndexShift = maxZIndex + 1;
  remappedElements.forEach(el => {
    const originalZIndex = el.zIndex ?? 0;
    el.zIndex = originalZIndex + zIndexShift;
  });
  
  if (isDebugMode() && remappedElements.length > 0) {
    console.log(`[appendElementsForPreset] zIndex shifted by ${zIndexShift} (max existing: ${maxZIndex})`);
  }
  
  const newElements = [...currentElements, ...remappedElements];
  const afterCount = newElements.length;
  
  // CRITICAL DEBUG: Verify state before set
  verifyRuntimeState(presetId, beforeCount, afterCount, 'appendElementsForPreset', newElements);
  
  runtimeOverlays.set(presetId, newElements);
  
  // Notify subscribers of runtime change (ONCE, after all elements are appended)
  notifyRuntimeChange(presetId);
  
  if (isDebugMode()) {
    console.log(`[overlayRuntime] Append successful - preset ${presetId}: ${currentElements.length} -> ${newElements.length} elements (${remappedElements.length} remapped)`);
  }
  
  return remappedElements.length; // All elements appended
}

/**
 * Check if elements can replace current elements without exceeding limit.
 * 
 * @param presetId - Active preset ID (null = returns false)
 * @param elementsCount - Number of elements to set
 * @returns true if replace is allowed, false if limit would be exceeded
 */
export function canReplaceElements(presetId: string | null, elementsCount: number): boolean {
  // CRASH PREVENTION: Null presetId guard
  if (!presetId) {
    return false;
  }
  
  // DEFENSIVE: Ensure elementsCount is a valid number
  const safeCount = typeof elementsCount === 'number' && !isNaN(elementsCount) && elementsCount >= 0 ? elementsCount : 0;
  
  // Replace: new count must be <= MAX_OVERLAY_ELEMENTS
  return safeCount <= MAX_OVERLAY_ELEMENTS;
}

/**
 * Replace all elements for a specific preset.
 * ARCHITECT MODE: "Ya hep ya hiç" - either all elements are set or none.
 * 
 * @param presetId - Active preset ID (null = no-op, returns 0, logs error)
 * @param elements - Elements to set as runtime elements
 * @returns Number of elements set (0 if limit would be exceeded, elements.length if successful)
 */
export function replaceElementsForPreset(presetId: string | null, elements: OverlayElement[]): number {
  // CRASH PREVENTION: Null presetId guard
  if (!presetId) {
    console.error('[overlayRuntime] CRITICAL: replaceElementsForPreset called with null presetId - aborting');
    return 0; // No preset = no-op
  }

  // DEFENSIVE: Ensure elements is an array
  const safeElements = Array.isArray(elements) ? elements : [];
  
  // CRITICAL: Pre-check limit - "ya hep ya hiç" approach
  if (!canReplaceElements(presetId, safeElements.length)) {
    if (isDebugMode()) {
      console.log(`[overlayRuntime] Replace rejected - limit would be exceeded (requested: ${safeElements.length}, max: ${MAX_OVERLAY_ELEMENTS})`);
    }
    return 0; // Limit would be exceeded, do not set anything
  }
  
  const currentElements = getElementsForPresetInternal(presetId);
  const beforeCount = currentElements.length;
  const afterCount = safeElements.length;
  
  // CRITICAL DEBUG: Verify state before set
  verifyRuntimeState(presetId, beforeCount, afterCount, 'replaceElementsForPreset', safeElements);
  
  runtimeOverlays.set(presetId, [...safeElements]);
  
  // Notify subscribers of runtime change
  notifyRuntimeChange(presetId);
  
  if (isDebugMode()) {
    console.log(`[overlayRuntime] Replace successful - preset ${presetId}: ${safeElements.length} elements`);
  }
  
  return safeElements.length; // All elements set
}

/**
 * Get count of overlay elements for a specific preset.
 * 
 * @param presetId - Active preset ID (null for default/fallback)
 * @returns Number of overlay elements for the preset
 */
export function getElementCountForPreset(presetId: string | null): number {
  const elements = getElementsForPresetInternal(presetId);
  return elements.length;
}

/**
 * Clear all overlay elements for a specific preset.
 * 
 * @param presetId - Active preset ID (null = no-op, logs error)
 */
export function clearElementsForPreset(presetId: string | null): void {
  // CRASH PREVENTION: Null presetId guard
  if (!presetId) {
    console.error('[overlayRuntime] CRITICAL: clearElementsForPreset called with null presetId - aborting');
    return; // No preset = no-op
  }
  
  runtimeOverlays.set(presetId, []);
  
  // Notify subscribers of runtime change
  notifyRuntimeChange(presetId);
  
  if (isDebugMode()) {
    console.log(`[overlayRuntime] Cleared elements for preset: ${presetId}`);
  }
}

/**
 * Update a single element in the runtime overlay Map.
 * ARCHITECT MODE: Updates element in runtime, NOT in settings.
 * 
 * @param presetId - Active preset ID (null = no-op, logs error)
 * @param elementId - ID of the element to update
 * @param updater - Function that receives current element and returns updated element
 * @returns true if element was found and updated, false otherwise
 */
export function updateElementInRuntime(presetId: string | null, elementId: string, updater: (element: OverlayElement) => OverlayElement): boolean {
  // CRASH PREVENTION: Null presetId guard
  if (!presetId) {
    console.error('[overlayRuntime] CRITICAL: updateElementInRuntime called with null presetId - aborting');
    return false;
  }
  
  const currentElements = getElementsForPresetInternal(presetId);
  const beforeCount = currentElements.length;
  const elementIndex = currentElements.findIndex(el => el.id === elementId);
  
  if (elementIndex === -1) {
    console.warn(`[overlayRuntime] Element ${elementId} not found in preset ${presetId}`);
    return false;
  }
  
  const element = currentElements[elementIndex];
  const updatedElement = updater(element);
  
  const updatedElements = [...currentElements];
  updatedElements[elementIndex] = updatedElement;
  const afterCount = updatedElements.length;
  
  // CRITICAL DEBUG: Verify state before set
  verifyRuntimeState(presetId, beforeCount, afterCount, 'updateElementInRuntime', updatedElements);
  
  runtimeOverlays.set(presetId, updatedElements);
  
  // Notify subscribers of runtime change
  notifyRuntimeChange(presetId);
  
  if (isDebugMode()) {
    console.log('[overlayRuntime] updateElementInRuntime - presetId:', presetId, 'elementId:', elementId, 'new count:', updatedElements.length);
  }
  
  return true;
}

/**
 * Load overlay elements from preset into runtime Map.
 * FAZ 7: Per-preset save/load system - loads overlay elements from preset.overlay.elements.
 * 
 * This function should be called when:
 * - Preset is switched (activePresetId changes)
 * - Preset is loaded from storage
 * - Page refresh (preset data is loaded from localStorage)
 * 
 * CRITICAL: This function should NOT trigger autosave. It's a one-way load operation.
 * 
 * @param presetId - Active preset ID (null = no-op, logs error)
 * @param presetElements - Overlay elements from preset.overlay.elements (can be undefined/null/empty array)
 * @returns Number of elements loaded into runtime
 */
export function loadPreset(presetId: string | null, presetElements?: OverlayElement[] | null): number {
  // CRASH PREVENTION: Null presetId guard
  if (!presetId) {
    console.error('[overlayRuntime] CRITICAL: loadPreset called with null presetId - aborting');
    return 0;
  }
  
  // DEFENSIVE: Ensure presetElements is an array
  const safeElements = Array.isArray(presetElements) ? presetElements : [];
  
  // CRITICAL: Deep clone elements to prevent mutations
  // This ensures preset data and runtime data are independent
  const clonedElements = safeElements.map(el => ({ ...el }));
  
  // Load into runtime Map
  // CRITICAL: Check if elements actually changed before notifying (prevents infinite loop)
  const existingElements = getElementsForPresetInternal(presetId);
  const beforeCount = existingElements.length;
  const afterCount = clonedElements.length;
  
  // CRITICAL DEBUG: Verify state before set
  verifyRuntimeState(presetId, beforeCount, afterCount, 'loadPreset', clonedElements);
  
  // CRITICAL: Log presetElements source for debugging (debug mode only)
  if (isDebugMode()) {
    console.log(`[loadPreset] presetId: ${presetId}, presetElements type: ${typeof presetElements}, presetElements length: ${Array.isArray(presetElements) ? presetElements.length : 'N/A'}, safeElements length: ${safeElements.length}, clonedElements length: ${clonedElements.length}`);
  }
  
  // CRITICAL: Compare elements deeply to avoid unnecessary notifications
  const elementsChanged = beforeCount !== afterCount || 
    existingElements.some((el, idx) => {
      const newEl = clonedElements[idx];
      return !newEl || el.id !== newEl.id || el.x !== newEl.x || el.y !== newEl.y;
    });
  
  runtimeOverlays.set(presetId, clonedElements);
  
  // CRITICAL: Only notify if elements actually changed (prevents infinite loop)
  // NOTE: This notification is for UI updates, NOT for autosave triggers
  if (elementsChanged) {
    notifyRuntimeChange(presetId);
  }
  
  if (isDebugMode()) {
    console.log(`[overlayRuntime] Loaded ${clonedElements.length} elements for preset ${presetId} from preset file (changed: ${elementsChanged})`);
  }
  
  return clonedElements.length;
}

/**
 * MEMORY LEAK PREVENTION: Check for orphaned preset IDs in runtime overlay Map.
 * Orphaned IDs are preset IDs that no longer exist in the preset list.
 * 
 * This function should be called periodically (e.g., on preset list changes) to clean up.
 * In debug mode, it logs warnings about orphaned entries.
 * 
 * @param validPresetIds - Array of valid preset IDs (from getPresets())
 * @returns Number of orphaned entries found (and optionally cleaned)
 */
export function checkForOrphanedRuntimeEntries(validPresetIds: string[]): number {
  const validSet = new Set(validPresetIds);
  let orphanedCount = 0;
  
  for (const [presetId, elements] of runtimeOverlays.entries()) {
    if (!validSet.has(presetId)) {
      orphanedCount++;
      if (isDebugMode()) {
        console.warn(`[overlayRuntime] MEMORY LEAK WARNING: Orphaned runtime overlay entry found for preset ${presetId} (${elements.length} elements). This preset no longer exists.`);
      }
      // Note: We don't auto-delete orphaned entries to preserve user data
      // They can be manually cleaned up if needed
    }
  }
  
  if (orphanedCount > 0 && isDebugMode()) {
    console.warn(`[overlayRuntime] Found ${orphanedCount} orphaned runtime overlay entries. Consider cleaning up if these presets were deleted.`);
  }
  
  return orphanedCount;
}
