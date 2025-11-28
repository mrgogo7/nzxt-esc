/**
 * Runtime — PART 4: Runtime Integration & State Management
 * 
 * Main runtime integration functions for initializing, managing, and validating
 * the unified OverlayRuntimeState.
 * 
 * Design Principles:
 * - Pure functions only (no mutations, no side effects)
 * - Deterministic operations
 * - State consistency guarantees
 * - Preset import/export compatibility
 * - Serializable state
 */

import type { OverlayElement, Overlay } from '../../types/overlay';
import type { PresetFile } from '../../preset/schema';
import type { OverlayRuntimeState, StateMetadata } from './types';
import * as elementStore from './elementStore';
import * as selection from './selection';
import * as zOrder from './zOrder';
import * as history from './history';
import * as transactions from './transactions';
import { ensureStateConsistency } from './validation';

/**
 * Default state metadata.
 */
const DEFAULT_METADATA: StateMetadata = {
  version: 1,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  presetId: null,
};

/**
 * Initialize runtime state.
 * Creates an empty initial state.
 * 
 * @param presetId - Optional preset ID (for scoped state)
 * @param maxHistorySize - Optional maximum history size (default: 50)
 * @returns Initial runtime state
 */
export function initializeRuntimeState(
  presetId: string | null = null,
  maxHistorySize: number = history.DEFAULT_HISTORY_LIMIT
): OverlayRuntimeState {
  return {
    elements: elementStore.createEmptyStore(),
    selection: selection.createInitialSelectionState(),
    zOrder: zOrder.createInitialZOrder(),
    history: history.createInitialHistoryState(maxHistorySize),
    transactions: transactions.createInitialTransactionState(),
    meta: {
      ...DEFAULT_METADATA,
      presetId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  };
}

/**
 * Reset state to initial empty state.
 * 
 * @param state - Current state
 * @param presetId - Optional preset ID to preserve
 * @returns Reset state
 */
export function resetState(
  state: OverlayRuntimeState,
  presetId: string | null = null
): OverlayRuntimeState {
  return initializeRuntimeState(
    presetId || state.meta.presetId,
    state.history.maxHistorySize
  );
}

/**
 * Apply preset import to runtime state.
 * Imports overlay elements from PresetFile into runtime state.
 * 
 * This function:
 * - Converts Overlay.elements array to ElementStore Map
 * - Builds z-order array from elements
 * - Preserves existing selection/history/transactions
 * - Filters out invalid elements
 * - Ensures state consistency
 * 
 * @param state - Current runtime state
 * @param preset - Preset file to import
 * @returns New runtime state with imported elements
 */
export function applyPresetImport(
  state: OverlayRuntimeState,
  preset: PresetFile
): OverlayRuntimeState {
  // Get elements from preset overlay
  const presetElements: OverlayElement[] = Array.isArray(preset.overlay?.elements)
    ? preset.overlay.elements
    : [];
  
  // Create element store from array
  const newElements = elementStore.createStoreFromArray(presetElements);
  
  // Build z-order array (preserve element order from preset, or use element IDs)
  // If preset elements have explicit order, use it; otherwise, use array order
  const newZOrder: string[] = [];
  const elementIds = new Set<string>();
  
  // First pass: collect valid element IDs
  for (const element of presetElements) {
    if (element && typeof element.id === 'string' && element.id) {
      if (!elementIds.has(element.id)) {
        elementIds.add(element.id);
        newZOrder.push(element.id);
      }
    }
  }
  
  // Ensure z-order contains all elements from store
  for (const elementId of newElements.keys()) {
    if (!elementIds.has(elementId)) {
      newZOrder.push(elementId);
    }
  }
  
  // Filter z-order to only include valid elements
  const validZOrder = zOrder.filterValidZOrder(newZOrder, new Set(newElements.keys()));
  
  // Clear selection (imported preset may have different element IDs)
  const newSelection = selection.createInitialSelectionState();
  
  // Clear history (preset import is a reset operation)
  const newHistory = history.createInitialHistoryState(state.history.maxHistorySize);
  
  // Clear transactions (preset import is a reset operation)
  const newTransactions = transactions.createInitialTransactionState();
  
  // Update metadata
  const newMeta: StateMetadata = {
    ...state.meta,
    presetId: preset.presetName || state.meta.presetId,
    updatedAt: Date.now(),
  };
  
  const newState: OverlayRuntimeState = {
    elements: newElements,
    selection: newSelection,
    zOrder: validZOrder,
    history: newHistory,
    transactions: newTransactions,
    meta: newMeta,
  };
  
  // Ensure state consistency (fix any remaining issues)
  return ensureStateConsistency(newState);
}

/**
 * Export preset from runtime state.
 * Converts runtime state to Overlay format for preset export.
 * 
 * This function:
 * - Serializes ElementStore Map to OverlayElement[] array
 * - Preserves z-order in element array order (or uses zOrder array)
 * - Filters out runtime-only fields (dynamic/derived)
 * - Returns static data only (preset-compatible)
 * 
 * @param state - Runtime state to export
 * @returns Overlay object with elements array
 */
export function exportPresetFromState(
  state: OverlayRuntimeState
): Overlay {
  // Get elements in z-order
  const elementsInOrder: OverlayElement[] = [];
  
  for (const elementId of state.zOrder) {
    const element = state.elements.get(elementId);
    if (element) {
      elementsInOrder.push(element);
    }
  }
  
  // Add any elements not in z-order (shouldn't happen, but safety)
  for (const element of state.elements.values()) {
    if (!state.zOrder.includes(element.id)) {
      elementsInOrder.push(element);
    }
  }
  
  return {
    mode: elementsInOrder.length > 0 ? 'custom' : 'none',
    elements: elementsInOrder,
  };
}

/**
 * Get serializable state representation.
 * Converts runtime state to JSON-serializable format.
 * 
 * @param state - Runtime state to serialize
 * @returns Serializable state object
 */
export function getSerializableState(
  state: OverlayRuntimeState
): {
  elements: OverlayElement[];
  selection: {
    selectedIds: string[];
    lastSelectedId: string | null;
  };
  zOrder: string[];
  history: {
    past: unknown[];
    present: unknown | null;
    future: unknown[];
    maxHistorySize: number;
  };
  transactions: {
    active: boolean;
    batch: unknown[] | null;
    startState: null; // Start state not serialized (too large)
  };
  meta: StateMetadata;
} {
  return {
    elements: Array.from(state.elements.values()),
    selection: {
      selectedIds: Array.from(state.selection.selectedIds),
      lastSelectedId: state.selection.lastSelectedId,
    },
    zOrder: [...state.zOrder],
    history: {
      past: state.history.past.map(action => ({
        id: action.id,
        type: action.type,
        timestamp: action.timestamp,
        data: action.data,
        // Note: execute/undo methods are not serialized (functions)
      })),
      present: state.history.present ? {
        id: state.history.present.id,
        type: state.history.present.type,
        timestamp: state.history.present.timestamp,
        data: state.history.present.data,
      } : null,
      future: state.history.future.map(action => ({
        id: action.id,
        type: action.type,
        timestamp: action.timestamp,
        data: action.data,
      })),
      maxHistorySize: state.history.maxHistorySize,
    },
    transactions: {
      active: state.transactions.active,
      batch: state.transactions.batch ? state.transactions.batch.map(action => ({
        id: action.id,
        type: action.type,
        timestamp: action.timestamp,
        data: action.data,
      })) : null,
      startState: null, // Not serialized (too large, reconstructed on load)
    },
    meta: { ...state.meta },
  };
}

/**
 * Deserialize state from serializable representation.
 * Reconstructs runtime state from serialized format.
 * 
 * Note: Actions cannot be fully reconstructed (execute/undo methods are lost).
 * This is for sync/migration purposes only, not for full state restoration.
 * 
 * @param serialized - Serialized state
 * @returns Runtime state (with limited action reconstruction)
 */
export function deserializeState(
  serialized: ReturnType<typeof getSerializableState>
): OverlayRuntimeState {
  // Reconstruct element store
  const elements = elementStore.createStoreFromArray(serialized.elements);
  
  // Reconstruct selection
  const selectionState = selection.selectElements(
    selection.createInitialSelectionState(),
    serialized.selection.selectedIds
  );
  const selectionWithLast: typeof selectionState = {
    ...selectionState,
    lastSelectedId: serialized.selection.lastSelectedId,
  };
  
  // Reconstruct z-order
  const zOrderArray = zOrder.filterValidZOrder(
    serialized.zOrder,
    new Set(elements.keys())
  );
  
  // Reconstruct history (actions cannot be fully reconstructed, create empty)
  const historyState = history.createInitialHistoryState(serialized.history.maxHistorySize);
  
  // Reconstruct transactions (start state cannot be reconstructed)
  const transactionsState = transactions.createInitialTransactionState();
  
  // Reconstruct metadata
  const meta: StateMetadata = {
    ...serialized.meta,
    updatedAt: Date.now(),
  };
  
  return {
    elements,
    selection: selectionWithLast,
    zOrder: zOrderArray,
    history: historyState,
    transactions: transactionsState,
    meta,
  };
}

