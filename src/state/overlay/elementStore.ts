/**
 * Element Store — PART 2: Element Store Architecture
 * 
 * Pure, immutable, Map-based element store for OverlayRuntimeState.
 * 
 * Design Principles:
 * - Map<string, OverlayElement> for O(1) operations
 * - Pure functions only (no mutations)
 * - Immutable updates (return new state)
 * - Derived values NOT stored (AABB, RBox, etc.)
 * - Element-level versioning support
 * - Type-safe discriminated union compatibility
 */

import type { OverlayElement } from '../../types/overlay';

/**
 * Element store type (Map-based).
 */
export type ElementStore = Map<string, OverlayElement>;

/**
 * Add element to store.
 * Returns new Map with element added.
 * 
 * @param store - Current element store
 * @param element - Element to add
 * @returns New element store with element added
 */
export function addElement(
  store: ElementStore,
  element: OverlayElement
): ElementStore {
  const newStore = new Map(store);
  
  // Check for ID conflict (should not happen in production, but safety check)
  if (newStore.has(element.id)) {
    console.warn(`Element ID conflict: ${element.id} already exists. Skipping add.`);
    return store; // Return unchanged if conflict
  }
  
  newStore.set(element.id, element);
  return newStore;
}

/**
 * Update element in store.
 * Returns new Map with element updated.
 * 
 * @param store - Current element store
 * @param elementId - Element ID to update
 * @param updater - Pure function that transforms element
 * @returns New element store with element updated
 */
export function updateElement(
  store: ElementStore,
  elementId: string,
  updater: (element: OverlayElement) => OverlayElement
): ElementStore {
  const element = store.get(elementId);
  
  if (!element) {
    console.warn(`Element not found: ${elementId}. Cannot update.`);
    return store; // Return unchanged if element not found
  }
  
  const updatedElement = updater(element);
  const newStore = new Map(store);
  newStore.set(elementId, updatedElement);
  
  return newStore;
}

/**
 * Remove element from store.
 * Returns new Map with element removed.
 * 
 * @param store - Current element store
 * @param elementId - Element ID to remove
 * @returns New element store with element removed
 */
export function removeElement(
  store: ElementStore,
  elementId: string
): ElementStore {
  if (!store.has(elementId)) {
    return store; // Element not found, return unchanged
  }
  
  const newStore = new Map(store);
  newStore.delete(elementId);
  return newStore;
}

/**
 * Replace many elements in store.
 * Useful for batch operations (import, reset, etc.).
 * Returns new Map with all elements replaced.
 * 
 * @param store - Current element store
 * @param elements - Array of elements to set (Map will be created from this)
 * @returns New element store with all elements replaced
 */
export function replaceMany(
  _store: ElementStore,
  elements: OverlayElement[]
): ElementStore {
  const newStore = new Map<string, OverlayElement>();
  
  for (const element of elements) {
    // Skip duplicate IDs (first occurrence wins)
    if (!newStore.has(element.id)) {
      newStore.set(element.id, element);
    } else {
      console.warn(`Duplicate element ID in replaceMany: ${element.id}. Skipping duplicate.`);
    }
  }
  
  return newStore;
}

/**
 * Get element from store.
 * Returns undefined if element not found.
 * 
 * @param store - Current element store
 * @param elementId - Element ID to get
 * @returns Element or undefined
 */
export function getElement(
  store: ElementStore,
  elementId: string
): OverlayElement | undefined {
  return store.get(elementId);
}

/**
 * Check if element exists in store.
 * 
 * @param store - Current element store
 * @param elementId - Element ID to check
 * @returns True if element exists
 */
export function hasElement(
  store: ElementStore,
  elementId: string
): boolean {
  return store.has(elementId);
}

/**
 * Get all element IDs from store.
 * 
 * @param store - Current element store
 * @returns Array of element IDs
 */
export function getElementIds(store: ElementStore): string[] {
  return Array.from(store.keys());
}

/**
 * Get all elements from store as array.
 * 
 * @param store - Current element store
 * @returns Array of all elements
 */
export function getAllElements(store: ElementStore): OverlayElement[] {
  return Array.from(store.values());
}

/**
 * Get element count.
 * 
 * @param store - Current element store
 * @returns Number of elements in store
 */
export function getElementCount(store: ElementStore): number {
  return store.size;
}

/**
 * Create empty element store.
 * 
 * @returns Empty Map-based element store
 */
export function createEmptyStore(): ElementStore {
  return new Map<string, OverlayElement>();
}

/**
 * Create element store from array.
 * 
 * @param elements - Array of elements
 * @returns New Map-based element store
 */
export function createStoreFromArray(elements: OverlayElement[]): ElementStore {
  const store = new Map<string, OverlayElement>();
  
  for (const element of elements) {
    if (!store.has(element.id)) {
      store.set(element.id, element);
    } else {
      console.warn(`Duplicate element ID in createStoreFromArray: ${element.id}. Skipping duplicate.`);
    }
  }
  
  return store;
}

