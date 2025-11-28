/**
 * Selectors — PART 2: Derived State Selectors
 * 
 * Pure selector functions for derived state calculations.
 * 
 * Design Principles:
 * - Derived values are NEVER stored in state (AABB, RBox, combined AABB)
 * - Selector functions compute derived values on-demand
 * - Selectors are pure functions (deterministic, no side effects)
 * - Selectors use element store and selection state as input
 * - Performance: Selectors can be memoized at UI layer (React useMemo)
 */

import type { OverlayElement } from '../../types/overlay';
import type { ElementStore } from './elementStore';
import type { SelectionState } from './selection';
import { calculateElementDimensions, calculateAABB, type BoundingBox } from '../../transform/engine/BoundingBox';

/**
 * Get element from store by ID.
 * 
 * @param store - Element store
 * @param elementId - Element ID
 * @returns Element or undefined
 */
export function getElement(
  store: ElementStore,
  elementId: string
): OverlayElement | undefined {
  return store.get(elementId);
}

/**
 * Check if element is selected.
 * 
 * @param selection - Selection state
 * @param elementId - Element ID to check
 * @returns True if element is selected
 */
export function isSelected(
  selection: SelectionState,
  elementId: string
): boolean {
  return selection.selectedIds.has(elementId);
}

/**
 * Get all selected elements from store.
 * 
 * @param store - Element store
 * @param selection - Selection state
 * @returns Array of selected elements
 */
export function getSelectedElements(
  store: ElementStore,
  selection: SelectionState
): OverlayElement[] {
  const selectedElements: OverlayElement[] = [];
  
  for (const elementId of selection.selectedIds) {
    const element = store.get(elementId);
    if (element) {
      selectedElements.push(element);
    }
  }
  
  return selectedElements;
}

/**
 * Get combined AABB (Axis-Aligned Bounding Box) for selected elements.
 * Returns null if no elements are selected.
 * 
 * This is a derived value and is NEVER stored in state.
 * It's computed on-demand using selector functions.
 * 
 * @param store - Element store
 * @param selection - Selection state
 * @returns Combined bounding box or null
 */
export function getCombinedAABB(
  store: ElementStore,
  selection: SelectionState
): BoundingBox | null {
  const selectedElements = getSelectedElements(store, selection);
  
  if (selectedElements.length === 0) {
    return null;
  }
  
  if (selectedElements.length === 1) {
    // Single selection: return element's AABB
    return calculateAABB(selectedElements[0]);
  }
  
  // Multi-select: calculate combined AABB
  let minLeft = Infinity;
  let minTop = Infinity;
  let maxRight = -Infinity;
  let maxBottom = -Infinity;
  
  for (const element of selectedElements) {
    const aabb = calculateAABB(element);
    
    // AABB is relative to element center, so we need to offset by element position
    const left = element.x + aabb.left;
    const top = element.y + aabb.top;
    const right = element.x + aabb.right;
    const bottom = element.y + aabb.bottom;
    
    minLeft = Math.min(minLeft, left);
    minTop = Math.min(minTop, top);
    maxRight = Math.max(maxRight, right);
    maxBottom = Math.max(maxBottom, bottom);
  }
  
  // Convert back to center-relative coordinates
  const centerX = (minLeft + maxRight) / 2;
  const centerY = (minTop + maxBottom) / 2;
  
  return {
    left: minLeft - centerX,
    top: minTop - centerY,
    right: maxRight - centerX,
    bottom: maxBottom - centerY,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
  };
}

/**
 * Get element AABB (Axis-Aligned Bounding Box).
 * 
 * This is a derived value and is NEVER stored in state.
 * 
 * @param element - Overlay element
 * @returns Element's bounding box
 */
export function getElementAABB(element: OverlayElement): BoundingBox {
  return calculateAABB(element);
}

/**
 * Get element dimensions.
 * 
 * This is a derived value and is NEVER stored in state.
 * 
 * @param element - Overlay element
 * @returns Element dimensions
 */
export function getElementDimensions(element: OverlayElement): { width: number; height: number } {
  return calculateElementDimensions(element);
}

/**
 * Get all elements from store as array (in no particular order).
 * For z-ordered iteration, use getElementsInZOrder.
 * 
 * @param store - Element store
 * @returns Array of all elements
 */
export function getAllElements(store: ElementStore): OverlayElement[] {
  return Array.from(store.values());
}

/**
 * Get elements in z-order.
 * 
 * @param store - Element store
 * @param zOrder - Z-order array
 * @returns Array of elements in z-order (front-to-back)
 */
export function getElementsInZOrder(
  store: ElementStore,
  zOrder: string[]
): OverlayElement[] {
  const elements: OverlayElement[] = [];
  
  for (const elementId of zOrder) {
    const element = store.get(elementId);
    if (element) {
      elements.push(element);
    }
  }
  
  return elements;
}

/**
 * Get selected element (single selection only).
 * Returns null if selection is not single or element not found.
 * 
 * @param store - Element store
 * @param selection - Selection state
 * @returns Selected element or null
 */
export function getSelectedElement(
  store: ElementStore,
  selection: SelectionState
): OverlayElement | null {
  if (selection.selectedIds.size !== 1) {
    return null; // Not single selection
  }
  
  const elementId = Array.from(selection.selectedIds)[0];
  return store.get(elementId) || null;
}

