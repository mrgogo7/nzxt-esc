/**
 * Selection State — PART 2: Selection & Hover State
 * 
 * Pure, immutable selection state management for OverlayRuntimeState.
 * 
 * Design Principles:
 * - Set<string> for multi-select (O(1) operations)
 * - Single-select + multi-select toggle rules (Ctrl, Shift)
 * - lastSelectedId support (keyboard navigation)
 * - Hover state is UI-only (NOT stored in runtime state)
 * - Pure functions only (no mutations)
 * - No pointer/mouse logic inside runtime
 */

/**
 * Selection state interface.
 * 
 * Note: hoverId is NOT included here because hover state is UI-only.
 * UI components should manage hover state in their own React state.
 */
export interface SelectionState {
  /** Set of selected element IDs (multi-select support) */
  selectedIds: Set<string>;
  
  /** Last selected element ID (for keyboard navigation, range selection) */
  lastSelectedId: string | null;
}

/**
 * Modifier keys abstraction (UI-independent).
 * Used by selection operations to determine behavior.
 */
export interface ModifierKeys {
  /** Ctrl key (Windows/Linux) or Cmd key (Mac) */
  ctrl: boolean;
  /** Shift key */
  shift: boolean;
  /** Alt key (optional, for future use) */
  alt?: boolean;
  /** Meta key (optional, for future use) */
  meta?: boolean;
}

/**
 * Create initial selection state.
 * 
 * @returns Empty selection state
 */
export function createInitialSelectionState(): SelectionState {
  return {
    selectedIds: new Set<string>(),
    lastSelectedId: null,
  };
}

/**
 * Select single element (deselect others).
 * 
 * @param state - Current selection state
 * @param elementId - Element ID to select
 * @returns New selection state with element selected
 */
export function selectElement(
  _state: SelectionState,
  elementId: string
): SelectionState {
  return {
    selectedIds: new Set([elementId]),
    lastSelectedId: elementId,
  };
}

/**
 * Deselect all elements.
 * 
 * @param state - Current selection state
 * @returns New selection state with no selection
 */
export function deselectAll(
  _state: SelectionState
): SelectionState {
  return {
    selectedIds: new Set<string>(),
    lastSelectedId: null,
  };
}

/**
 * Add element to selection (multi-select).
 * 
 * @param state - Current selection state
 * @param elementId - Element ID to add to selection
 * @returns New selection state with element added
 */
export function addToSelection(
  state: SelectionState,
  elementId: string
): SelectionState {
  const newSelectedIds = new Set(state.selectedIds);
  newSelectedIds.add(elementId);
  
  return {
    selectedIds: newSelectedIds,
    lastSelectedId: elementId, // Update last selected
  };
}

/**
 * Remove element from selection.
 * 
 * @param state - Current selection state
 * @param elementId - Element ID to remove from selection
 * @returns New selection state with element removed
 */
export function removeFromSelection(
  state: SelectionState,
  elementId: string
): SelectionState {
  const newSelectedIds = new Set(state.selectedIds);
  newSelectedIds.delete(elementId);
  
  // Update lastSelectedId if removed element was last selected
  let newLastSelectedId = state.lastSelectedId;
  if (state.lastSelectedId === elementId) {
    // Find new last selected from remaining selection
    const remainingIds = Array.from(newSelectedIds);
    newLastSelectedId = remainingIds.length > 0 
      ? remainingIds[remainingIds.length - 1] 
      : null;
  }
  
  return {
    selectedIds: newSelectedIds,
    lastSelectedId: newLastSelectedId,
  };
}

/**
 * Toggle element selection (add if not selected, remove if selected).
 * 
 * @param state - Current selection state
 * @param elementId - Element ID to toggle
 * @returns New selection state with element toggled
 */
export function toggleSelection(
  state: SelectionState,
  elementId: string
): SelectionState {
  const newSelectedIds = new Set(state.selectedIds);
  
  if (newSelectedIds.has(elementId)) {
    // Remove from selection
    newSelectedIds.delete(elementId);
    
    // Update lastSelectedId if removed element was last selected
    let newLastSelectedId = state.lastSelectedId;
    if (state.lastSelectedId === elementId) {
      const remainingIds = Array.from(newSelectedIds);
      newLastSelectedId = remainingIds.length > 0 
        ? remainingIds[remainingIds.length - 1] 
        : null;
    }
    
    return {
      selectedIds: newSelectedIds,
      lastSelectedId: newLastSelectedId,
    };
  } else {
    // Add to selection
    newSelectedIds.add(elementId);
    
    return {
      selectedIds: newSelectedIds,
      lastSelectedId: elementId, // Update last selected
    };
  }
}

/**
 * Select multiple elements (replace current selection).
 * 
 * @param state - Current selection state
 * @param elementIds - Array of element IDs to select
 * @returns New selection state with elements selected
 */
export function selectElements(
  _state: SelectionState,
  elementIds: string[]
): SelectionState {
  const newSelectedIds = new Set(elementIds);
  const lastSelectedId = elementIds.length > 0 ? elementIds[elementIds.length - 1] : null;
  
  return {
    selectedIds: newSelectedIds,
    lastSelectedId,
  };
}

/**
 * Select range of elements (for Shift+Click range selection).
 * Requires zOrder array to determine range.
 * 
 * @param state - Current selection state
 * @param startElementId - Start element ID (or lastSelectedId if null)
 * @param endElementId - End element ID (target element)
 * @param zOrder - Z-order array (element IDs in render order)
 * @returns New selection state with range selected
 */
export function selectRange(
  state: SelectionState,
  startElementId: string | null,
  endElementId: string,
  zOrder: string[]
): SelectionState {
  // Use lastSelectedId as start if startElementId is null
  const startId = startElementId || state.lastSelectedId;
  
  if (!startId) {
    // No start element: fallback to single selection
    return selectElement(state, endElementId);
  }
  
  const startIndex = zOrder.indexOf(startId);
  const endIndex = zOrder.indexOf(endElementId);
  
  if (startIndex === -1 || endIndex === -1) {
    // Invalid range: fallback to single selection
    return selectElement(state, endElementId);
  }
  
  // Select range (preserve existing selection)
  const newSelectedIds = new Set(state.selectedIds);
  const start = Math.min(startIndex, endIndex);
  const end = Math.max(startIndex, endIndex);
  
  for (let i = start; i <= end; i++) {
    const elementId = zOrder[i];
    if (elementId) {
      newSelectedIds.add(elementId);
    }
  }
  
  return {
    selectedIds: newSelectedIds,
    lastSelectedId: endElementId, // Update last selected
  };
}

/**
 * Handle selection with modifier keys (UI-independent abstraction).
 * Determines selection behavior based on modifier keys.
 * 
 * @param state - Current selection state
 * @param elementId - Element ID to select
 * @param modifierKeys - Modifier keys state
 * @param zOrder - Z-order array (for range selection)
 * @returns New selection state based on modifier keys
 */
export function handleSelection(
  state: SelectionState,
  elementId: string,
  modifierKeys: ModifierKeys,
  zOrder: string[]
): SelectionState {
  // Shift+Ctrl: Range toggle (add/remove range)
  if (modifierKeys.shift && modifierKeys.ctrl) {
    // Toggle range: if all elements in range are selected, deselect them; otherwise, select them
    const startId = state.lastSelectedId;
    if (!startId) {
      return toggleSelection(state, elementId);
    }
    
    const startIndex = zOrder.indexOf(startId);
    const endIndex = zOrder.indexOf(elementId);
    
    if (startIndex === -1 || endIndex === -1) {
      return toggleSelection(state, elementId);
    }
    
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    const rangeIds = zOrder.slice(start, end + 1);
    
    // Check if all elements in range are selected
    const allSelected = rangeIds.every(id => state.selectedIds.has(id));
    
    const newSelectedIds = new Set(state.selectedIds);
    if (allSelected) {
      // Deselect all in range
      rangeIds.forEach(id => newSelectedIds.delete(id));
    } else {
      // Select all in range
      rangeIds.forEach(id => newSelectedIds.add(id));
    }
    
    return {
      selectedIds: newSelectedIds,
      lastSelectedId: elementId,
    };
  }
  
  // Shift: Range selection (add range to selection)
  if (modifierKeys.shift) {
    return selectRange(state, state.lastSelectedId, elementId, zOrder);
  }
  
  // Ctrl/Cmd: Toggle selection (add/remove)
  if (modifierKeys.ctrl) {
    return toggleSelection(state, elementId);
  }
  
  // No modifier: Single selection (deselect others)
  return selectElement(state, elementId);
}

/**
 * Check if element is selected.
 * 
 * @param state - Current selection state
 * @param elementId - Element ID to check
 * @returns True if element is selected
 */
export function isSelected(
  state: SelectionState,
  elementId: string
): boolean {
  return state.selectedIds.has(elementId);
}

/**
 * Check if selection is single (exactly one element selected).
 * 
 * @param state - Current selection state
 * @returns True if exactly one element is selected
 */
export function isSingleSelection(state: SelectionState): boolean {
  return state.selectedIds.size === 1;
}

/**
 * Check if selection is multi (more than one element selected).
 * 
 * @param state - Current selection state
 * @returns True if more than one element is selected
 */
export function isMultiSelection(state: SelectionState): boolean {
  return state.selectedIds.size > 1;
}

/**
 * Check if selection is empty (no elements selected).
 * 
 * @param state - Current selection state
 * @returns True if no elements are selected
 */
export function isEmptySelection(state: SelectionState): boolean {
  return state.selectedIds.size === 0;
}

/**
 * Get selected element count.
 * 
 * @param state - Current selection state
 * @returns Number of selected elements
 */
export function getSelectionCount(state: SelectionState): number {
  return state.selectedIds.size;
}

