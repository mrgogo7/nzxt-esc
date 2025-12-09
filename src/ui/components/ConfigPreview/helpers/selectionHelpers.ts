/**
 * Selection Helpers
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
import { createSelectAction } from '../../../../state/overlay/actions';
import type { Action } from '../../../../state/overlay/actions';

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

/**
 * Multi-select safe selection helpers
 * 
 * These helpers create selection actions for UI layer.
 * They work with selectedIds: Set<string> and always produce new Set instances.
 */

/**
 * Create action to select a single element (clears existing selection).
 * 
 * @param currentState - Current runtime state
 * @param elementId - Element ID to select
 * @returns Selection action
 */
export function selectSingle(currentState: OverlayRuntimeState, elementId: string): Action {
  const oldSelectedIds = Array.from(currentState.selection.selectedIds);
  const oldLastSelectedId = currentState.selection.lastSelectedId;
  const newSelectedIds = [elementId];
  const newLastSelectedId = elementId;
  
  return createSelectAction(
    oldSelectedIds,
    newSelectedIds,
    oldLastSelectedId,
    newLastSelectedId
  );
}

/**
 * Create action to toggle element selection (add if not selected, remove if selected).
 * 
 * @param currentState - Current runtime state
 * @param elementId - Element ID to toggle
 * @returns Selection action
 */
export function toggleSelect(currentState: OverlayRuntimeState, elementId: string): Action {
  const oldSelectedIds = Array.from(currentState.selection.selectedIds);
  const oldLastSelectedId = currentState.selection.lastSelectedId;
  
  // Create new Set (immutable)
  const newSelectedIdsSet = new Set(currentState.selection.selectedIds);
  
  if (newSelectedIdsSet.has(elementId)) {
    // Remove from selection
    newSelectedIdsSet.delete(elementId);
    
    // Update lastSelectedId if removed element was last selected
    let newLastSelectedId = oldLastSelectedId;
    if (oldLastSelectedId === elementId) {
      const remainingIds = Array.from(newSelectedIdsSet);
      newLastSelectedId = remainingIds.length > 0 ? remainingIds[remainingIds.length - 1] : null;
    }
    
    return createSelectAction(
      oldSelectedIds,
      Array.from(newSelectedIdsSet),
      oldLastSelectedId,
      newLastSelectedId
    );
  } else {
    // Add to selection
    newSelectedIdsSet.add(elementId);
    
    return createSelectAction(
      oldSelectedIds,
      Array.from(newSelectedIdsSet),
      oldLastSelectedId,
      elementId // Update last selected
    );
  }
}

/**
 * Create action to clear all selections.
 * 
 * @param currentState - Current runtime state
 * @returns Selection action
 */
export function clearSelection(currentState: OverlayRuntimeState): Action {
  const oldSelectedIds = Array.from(currentState.selection.selectedIds);
  const oldLastSelectedId = currentState.selection.lastSelectedId;
  const newSelectedIds: string[] = [];
  const newLastSelectedId: string | null = null;
  
  return createSelectAction(
    oldSelectedIds,
    newSelectedIds,
    oldLastSelectedId,
    newLastSelectedId
  );
}

