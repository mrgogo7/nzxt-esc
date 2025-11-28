/**
 * Selection Helpers — FAZ-3B-4: Selection Runtime Wiring
 * 
 * Helper functions for selection operations in ConfigPreview.
 * These helpers bridge UI interactions to runtime selection state.
 * 
 * Design Principles:
 * - Pure functions (no side effects)
 * - UI → Runtime action mapping
 * - Single-select support (multi-select ready)
 */

import type { OverlayRuntimeState } from '../../../../state/overlay/types';
import { getSelectedElement } from '../../../../state/overlay/selectors';

/**
 * Get single selected element ID from runtime state.
 * Returns null if no selection or multi-select.
 * 
 * @param state - Runtime state
 * @returns Selected element ID or null
 */
export function getSingleSelectedId(state: OverlayRuntimeState): string | null {
  if (state.selection.selectedIds.size !== 1) {
    return null;
  }
  return Array.from(state.selection.selectedIds)[0];
}

/**
 * Get single selected element from runtime state.
 * Returns null if no selection or multi-select.
 * 
 * @param state - Runtime state
 * @returns Selected element or null
 */
export function getSingleSelectedElement(state: OverlayRuntimeState) {
  return getSelectedElement(state.elements, state.selection);
}

/**
 * Check if element is selected in runtime state.
 * 
 * @param state - Runtime state
 * @param elementId - Element ID to check
 * @returns True if element is selected
 */
export function isElementSelected(state: OverlayRuntimeState, elementId: string): boolean {
  return state.selection.selectedIds.has(elementId);
}

/**
 * Get all selected element IDs as array.
 * 
 * @param state - Runtime state
 * @returns Array of selected element IDs
 */
export function getSelectedIds(state: OverlayRuntimeState): string[] {
  return Array.from(state.selection.selectedIds);
}

