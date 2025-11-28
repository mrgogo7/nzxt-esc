/**
 * Z-Order / Layer Stack — PART 2: Canonical Array-based Model
 * 
 * Pure, immutable z-order management for OverlayRuntimeState.
 * 
 * Design Principles:
 * - Canonical array-based layer stack (zOrder: string[])
 * - Element insertion rules (new elements on top)
 * - Removal rules (remove ID when element deleted)
 * - Pure functions only (no mutations)
 * - element.zIndex is NOT canonical (only zOrder[] is canonical)
 * - Undo/redo compatibility (deterministic, replay-safe)
 */

/**
 * Z-order type (array of element IDs in render order).
 * Front-to-back order: last element in array is rendered on top (front).
 */
export type ZOrder = string[];

/**
 * Create initial z-order (empty array).
 * 
 * @returns Empty z-order array
 */
export function createInitialZOrder(): ZOrder {
  return [];
}

/**
 * Add element ID to z-order (inserted at end = front position).
 * New elements are added on top (end of array).
 * 
 * @param zOrder - Current z-order array
 * @param elementId - Element ID to add
 * @returns New z-order array with element added at end
 */
export function addToZOrder(
  zOrder: ZOrder,
  elementId: string
): ZOrder {
  // If element already exists, remove it first (then add to end)
  const filtered = zOrder.filter(id => id !== elementId);
  return [...filtered, elementId];
}

/**
 * Remove element ID from z-order.
 * Called when element is deleted.
 * 
 * @param zOrder - Current z-order array
 * @param elementId - Element ID to remove
 * @returns New z-order array with element removed
 */
export function removeFromZOrder(
  zOrder: ZOrder,
  elementId: string
): ZOrder {
  return zOrder.filter(id => id !== elementId);
}

/**
 * Remove multiple element IDs from z-order.
 * Called when multiple elements are deleted.
 * 
 * @param zOrder - Current z-order array
 * @param elementIds - Array of element IDs to remove
 * @returns New z-order array with elements removed
 */
export function removeManyFromZOrder(
  zOrder: ZOrder,
  elementIds: string[]
): ZOrder {
  const idsToRemove = new Set(elementIds);
  return zOrder.filter(id => !idsToRemove.has(id));
}

/**
 * Bring element to front (end of array).
 * Element is moved to the last position (rendered on top).
 * 
 * @param zOrder - Current z-order array
 * @param elementId - Element ID to bring to front
 * @returns New z-order array with element at end
 */
export function bringToFront(
  zOrder: ZOrder,
  elementId: string
): ZOrder {
  const index = zOrder.indexOf(elementId);
  
  if (index === -1) {
    // Element not found, return unchanged
    return zOrder;
  }
  
  if (index === zOrder.length - 1) {
    // Already at front, return unchanged
    return zOrder;
  }
  
  // Remove from current position and add to end
  const newZOrder = [...zOrder];
  newZOrder.splice(index, 1);
  newZOrder.push(elementId);
  
  return newZOrder;
}

/**
 * Send element to back (beginning of array).
 * Element is moved to the first position (rendered at bottom).
 * 
 * @param zOrder - Current z-order array
 * @param elementId - Element ID to send to back
 * @returns New z-order array with element at beginning
 */
export function sendToBack(
  zOrder: ZOrder,
  elementId: string
): ZOrder {
  const index = zOrder.indexOf(elementId);
  
  if (index === -1) {
    // Element not found, return unchanged
    return zOrder;
  }
  
  if (index === 0) {
    // Already at back, return unchanged
    return zOrder;
  }
  
  // Remove from current position and add to beginning
  const newZOrder = [...zOrder];
  newZOrder.splice(index, 1);
  newZOrder.unshift(elementId);
  
  return newZOrder;
}

/**
 * Move element forward by one position.
 * Element is swapped with the next element in z-order.
 * 
 * @param zOrder - Current z-order array
 * @param elementId - Element ID to move forward
 * @returns New z-order array with element moved forward
 */
export function moveForward(
  zOrder: ZOrder,
  elementId: string
): ZOrder {
  const index = zOrder.indexOf(elementId);
  
  if (index === -1 || index === zOrder.length - 1) {
    // Element not found or already at front, return unchanged
    return zOrder;
  }
  
  // Swap with next element
  const newZOrder = [...zOrder];
  [newZOrder[index], newZOrder[index + 1]] = [newZOrder[index + 1], newZOrder[index]];
  
  return newZOrder;
}

/**
 * Move element backward by one position.
 * Element is swapped with the previous element in z-order.
 * 
 * @param zOrder - Current z-order array
 * @param elementId - Element ID to move backward
 * @returns New z-order array with element moved backward
 */
export function moveBackward(
  zOrder: ZOrder,
  elementId: string
): ZOrder {
  const index = zOrder.indexOf(elementId);
  
  if (index === -1 || index === 0) {
    // Element not found or already at back, return unchanged
    return zOrder;
  }
  
  // Swap with previous element
  const newZOrder = [...zOrder];
  [newZOrder[index], newZOrder[index - 1]] = [newZOrder[index - 1], newZOrder[index]];
  
  return newZOrder;
}

/**
 * Reorder element to specific index.
 * 
 * @param zOrder - Current z-order array
 * @param elementId - Element ID to reorder
 * @param newIndex - New index (0-based, clamped to valid range)
 * @returns New z-order array with element at new index
 */
export function reorder(
  zOrder: ZOrder,
  elementId: string,
  newIndex: number
): ZOrder {
  const index = zOrder.indexOf(elementId);
  
  if (index === -1) {
    // Element not found, return unchanged
    return zOrder;
  }
  
  // Clamp newIndex to valid range
  const clampedIndex = Math.max(0, Math.min(newIndex, zOrder.length - 1));
  
  if (index === clampedIndex) {
    // Already at target index, return unchanged
    return zOrder;
  }
  
  // Remove from current position
  const newZOrder = [...zOrder];
  newZOrder.splice(index, 1);
  
  // Insert at new position
  newZOrder.splice(clampedIndex, 0, elementId);
  
  return newZOrder;
}

/**
 * Bring multiple elements to front (preserving relative order).
 * All selected elements are moved to end of array (front position).
 * 
 * @param zOrder - Current z-order array
 * @param elementIds - Array of element IDs to bring to front
 * @returns New z-order array with elements at end
 */
export function bringToFrontMulti(
  zOrder: ZOrder,
  elementIds: string[]
): ZOrder {
  const idsToMove = new Set(elementIds);
  
  // Separate elements into "to move" and "remaining"
  const remaining: string[] = [];
  const toMove: string[] = [];
  
  for (const id of zOrder) {
    if (idsToMove.has(id)) {
      toMove.push(id);
    } else {
      remaining.push(id);
    }
  }
  
  // Preserve relative order of moved elements
  return [...remaining, ...toMove];
}

/**
 * Send multiple elements to back (preserving relative order).
 * All selected elements are moved to beginning of array (back position).
 * 
 * @param zOrder - Current z-order array
 * @param elementIds - Array of element IDs to send to back
 * @returns New z-order array with elements at beginning
 */
export function sendToBackMulti(
  zOrder: ZOrder,
  elementIds: string[]
): ZOrder {
  const idsToMove = new Set(elementIds);
  
  // Separate elements into "to move" and "remaining"
  const remaining: string[] = [];
  const toMove: string[] = [];
  
  for (const id of zOrder) {
    if (idsToMove.has(id)) {
      toMove.push(id);
    } else {
      remaining.push(id);
    }
  }
  
  // Preserve relative order of moved elements
  return [...toMove, ...remaining];
}

/**
 * Get z-order index of element.
 * 
 * @param zOrder - Current z-order array
 * @param elementId - Element ID to find
 * @returns Index in z-order array, or -1 if not found
 */
export function getZOrderIndex(
  zOrder: ZOrder,
  elementId: string
): number {
  return zOrder.indexOf(elementId);
}

/**
 * Validate z-order (ensure all IDs are unique, no duplicates).
 * 
 * @param zOrder - Z-order array to validate
 * @returns True if z-order is valid
 */
export function validateZOrder(zOrder: ZOrder): boolean {
  const seen = new Set<string>();
  
  for (const id of zOrder) {
    if (seen.has(id)) {
      return false; // Duplicate found
    }
    seen.add(id);
  }
  
  return true;
}

/**
 * Filter z-order to only include IDs that exist in element store.
 * Removes stale IDs (elements that were deleted but IDs remained in z-order).
 * 
 * @param zOrder - Current z-order array
 * @param validIds - Set of valid element IDs (from element store)
 * @returns New z-order array with only valid IDs
 */
export function filterValidZOrder(
  zOrder: ZOrder,
  validIds: Set<string>
): ZOrder {
  return zOrder.filter(id => validIds.has(id));
}

