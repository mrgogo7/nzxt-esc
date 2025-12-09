/**
 * Runtime — PART 4: Runtime Integration & State Management
 * 
 * Runtime Merge Overview (High-Level)
 * - Handles state serialization/deserialization for sync pipeline
 * - Ensures state consistency and validation
 * - Behavior is locked (Frozen Zone) after FAZ-6
 * 
 * FROZEN ZONE — DO NOT MODIFY LOGIC
 * 
 * This subsystem is behavior-locked after FAZ-6.
 * Only documentation and type-level improvements allowed.
 * 
 * - Serialization/deserialization logic MUST remain identical
 * - State validation rules MUST NOT change
 * - Consistency guarantees MUST remain identical
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
import type { OverlayRuntimeState, StateMetadata, HistoryState, TransactionState } from './types';
import type { ActionData, TransformActionData, BatchActionData, ActionType } from './actions';
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
 * Serializable version of TransformActionData (Maps converted to plain objects).
 */
interface SerializableTransformActionData {
  elementIds: string[];
  oldStates: Record<string, OverlayElement>; // Plain object instead of Map
  newStates: Record<string, OverlayElement>; // Plain object instead of Map
}

/**
 * Serializable version of BatchActionData (nested actions without functions).
 */
interface SerializableBatchActionData {
  actions: Array<{
    id: string;
    type: string;
    timestamp: number;
    data: SerializableActionData;
    // Functions (execute/undo) are NOT included
  }>;
}

/**
 * Serializable version of ActionData (for sync/broadcast).
 */
type SerializableActionData =
  | Omit<Exclude<ActionData, TransformActionData | BatchActionData>, never>
  | SerializableTransformActionData
  | SerializableBatchActionData;

/**
 * Sanitize action data for serialization.
 * Converts Maps to plain objects/arrays to ensure structuredClone compatibility.
 * 
 * FAZ-4-4H: Enhanced to handle BatchActionData (removes functions from nested actions).
 * 
 * @param data - Action data to sanitize
 * @returns Sanitized action data (Maps converted to objects/arrays, functions removed)
 */
function sanitizeActionData(data: ActionData): SerializableActionData {
  // TransformActionData contains Maps that need to be converted
  if (data && typeof data === 'object' && 'oldStates' in data && 'newStates' in data) {
    const transformData = data as TransformActionData;
    return {
      elementIds: transformData.elementIds,
      // Convert Map<string, OverlayElement> to plain object
      oldStates: transformData.oldStates instanceof Map
        ? Object.fromEntries(transformData.oldStates)
        : (transformData.oldStates as Record<string, OverlayElement>),
      newStates: transformData.newStates instanceof Map
        ? Object.fromEntries(transformData.newStates)
        : (transformData.newStates as Record<string, OverlayElement>),
    };
  }
  
  // BatchActionData contains nested Actions with functions - sanitize them
  if (data && typeof data === 'object' && 'actions' in data) {
    const batchData = data as BatchActionData;
    const serializedBatch: SerializableBatchActionData = {
      actions: batchData.actions.map(action => ({
        id: action.id,
        type: action.type,
        timestamp: action.timestamp,
        data: sanitizeActionData(action.data),
        // Functions (execute/undo) are NOT included in serialized form
      })),
    };
    return serializedBatch as SerializableActionData;
  }
  
  // All other action data types are already serializable
  return data as SerializableActionData;
}

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
 * Serializable version of OverlayRuntimeState (all Maps/Sets converted to plain objects/arrays).
 * 
 * FAZ-4-4G: StructuredClone-safe state representation.
 */
interface SerializableOverlayRuntimeState {
  elements: Record<string, OverlayElement>; // Map → Record
  selection: {
    selectedIds: string[]; // Set → Array
    lastSelectedId: string | null;
  };
  zOrder: string[];
  history: {
    past: Array<{
      id: string;
      type: string;
      timestamp: number;
      data: SerializableActionData;
    }>;
    present: {
      id: string;
      type: string;
      timestamp: number;
      data: SerializableActionData;
    } | null;
    future: Array<{
      id: string;
      type: string;
      timestamp: number;
      data: SerializableActionData;
    }>;
    maxHistorySize: number;
  };
  transactions: {
    active: boolean;
    batch: Array<{
      id: string;
      type: string;
      timestamp: number;
      data: SerializableActionData;
    }> | null;
    startState: null; // Not serialized
  };
  meta: StateMetadata;
}

/**
 * Sanitize runtime state for structuredClone compatibility.
 * Converts all Maps and Sets to plain objects/arrays.
 * 
 * FAZ-4-4H: Enhanced with structuredClone validation and comprehensive sanitization.
 * 
 * @param state - Runtime state to sanitize
 * @returns Sanitized state (all Maps/Sets converted to plain objects/arrays)
 * @throws Error if sanitized state fails structuredClone test
 */
export function sanitizeRuntimeState(state: OverlayRuntimeState): SerializableOverlayRuntimeState {
  const sanitized: SerializableOverlayRuntimeState = {
    // Convert Map<string, OverlayElement> to Record<string, OverlayElement>
    elements: Object.fromEntries(state.elements),
    
    // Convert Set<string> to string[]
    selection: {
      selectedIds: Array.from(state.selection.selectedIds),
      lastSelectedId: state.selection.lastSelectedId,
    },
    
    // zOrder is already an array
    zOrder: [...state.zOrder],
    
    // Sanitize history entries (sanitize action data)
    history: {
      past: state.history.past.map(action => ({
        id: action.id,
        type: action.type,
        timestamp: action.timestamp,
        data: sanitizeActionData(action.data),
      })),
      present: state.history.present ? {
        id: state.history.present.id,
        type: state.history.present.type,
        timestamp: state.history.present.timestamp,
        data: sanitizeActionData(state.history.present.data),
      } : null,
      future: state.history.future.map(action => ({
        id: action.id,
        type: action.type,
        timestamp: action.timestamp,
        data: sanitizeActionData(action.data),
      })),
      maxHistorySize: state.history.maxHistorySize,
    },
    
    // Sanitize transaction batch (sanitize action data)
    transactions: {
      active: state.transactions.active,
      batch: state.transactions.batch ? state.transactions.batch.map(action => ({
        id: action.id,
        type: action.type,
        timestamp: action.timestamp,
        data: sanitizeActionData(action.data),
      })) : null,
      startState: null, // Not serialized (too large)
    },
    
    // Meta is already plain object
    meta: { ...state.meta },
  };
  
  // FAZ-4-4H: Validate that sanitized state passes structuredClone test
  try {
    structuredClone(sanitized);
  } catch (error) {
    // If structuredClone fails, log the offending state and throw
    console.error('[sanitizeRuntimeState] Sanitized state failed structuredClone test:', error);
    console.error('[sanitizeRuntimeState] Sanitized state:', sanitized);
    throw new Error(
      `Sanitized state is not structuredClone-safe: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  
  return sanitized;
}

/**
 * Get serializable state representation.
 * Converts runtime state to JSON-serializable format.
 * 
 * FAZ-4-4H: Uses sanitizeRuntimeState() to ensure structuredClone compatibility.
 * 
 * @param state - Runtime state to serialize
 * @returns Serializable state object
 */
export function getSerializableState(
  state: OverlayRuntimeState
): SerializableOverlayRuntimeState {
  // FAZ-4-4H: Use sanitizeRuntimeState() to ensure structuredClone compatibility
  return sanitizeRuntimeState(state);
}

/**
 * Deserialize state from serializable representation.
 * Reconstructs runtime state from serialized format.
 * 
 * FAZ-4-4I: Fixed to handle plain objects/arrays from sanitizeRuntimeState().
 * 
 * Note: Actions cannot be fully reconstructed (execute/undo methods are lost).
 * This is for sync/migration purposes only, not for full state restoration.
 * 
 * @param serialized - Serialized state (plain objects/arrays, not Maps/Sets)
 * @returns Runtime state (with Maps/Sets reconstructed)
 */
export function deserializeState(
  serialized: ReturnType<typeof getSerializableState>
): OverlayRuntimeState {
  // FAZ-4-4I: Reconstruct element store from Record<string, OverlayElement>
  // serialized.elements is now a plain object, not a Map or array
  const elementsArray = Object.values(serialized.elements);
  const elements = elementStore.createStoreFromArray(elementsArray);
  
  // FAZ-4-4I: Reconstruct selection from array
  // serialized.selection.selectedIds is now string[], not Set<string>
  const selectionState = selection.selectElements(
    selection.createInitialSelectionState(),
    serialized.selection.selectedIds // Already an array, selectElements handles it
  );
  const selectionWithLast: typeof selectionState = {
    ...selectionState,
    lastSelectedId: serialized.selection.lastSelectedId,
  };
  
  // Reconstruct z-order (already an array, no change needed)
  const zOrderArray = zOrder.filterValidZOrder(
    serialized.zOrder,
    new Set(elements.keys())
  );
  
  // FAZ-4-4I: Reconstruct history from sanitized actions
  // Actions are sanitized (no execute/undo functions), so we create stub actions
  // that preserve metadata but have no-op execute/undo
  const historyState: HistoryState = {
    past: serialized.history.past.map(action => ({
      id: action.id,
      type: action.type as ActionType,
      timestamp: action.timestamp,
      data: action.data as ActionData,
      // Stub functions (actions can't be executed/undone after deserialization)
      execute: (state: OverlayRuntimeState) => state,
      undo: (state: OverlayRuntimeState) => state,
    })),
    present: serialized.history.present ? {
      id: serialized.history.present.id,
      type: serialized.history.present.type as ActionType,
      timestamp: serialized.history.present.timestamp,
      data: serialized.history.present.data as ActionData,
      // Stub functions
      execute: (state: OverlayRuntimeState) => state,
      undo: (state: OverlayRuntimeState) => state,
    } : null,
    future: serialized.history.future.map(action => ({
      id: action.id,
      type: action.type as ActionType,
      timestamp: action.timestamp,
      data: action.data as ActionData,
      // Stub functions
      execute: (state: OverlayRuntimeState) => state,
      undo: (state: OverlayRuntimeState) => state,
    })),
    maxHistorySize: serialized.history.maxHistorySize,
  };
  
  // FAZ-4-4I: Reconstruct transactions from sanitized batch
  const transactionsState: TransactionState = {
    active: serialized.transactions.active,
    batch: serialized.transactions.batch ? serialized.transactions.batch.map(action => ({
      id: action.id,
      type: action.type as ActionType,
      timestamp: action.timestamp,
      data: action.data as ActionData,
      // Stub functions
      execute: (state: OverlayRuntimeState) => state,
      undo: (state: OverlayRuntimeState) => state,
    })) : null,
    startState: null, // Not serialized (too large)
  };
  
  // Reconstruct metadata
  const meta: StateMetadata = {
    ...serialized.meta,
    updatedAt: Date.now(),
  };
  
  const deserialized: OverlayRuntimeState = {
    elements,
    selection: selectionWithLast,
    zOrder: zOrderArray,
    history: historyState,
    transactions: transactionsState,
    meta,
  };
  
  // FAZ-4-4I: Validate that deserialized state passes structuredClone test
  // (This ensures the reconstructed state is still cloneable)
  try {
    structuredClone(sanitizeRuntimeState(deserialized));
  } catch (error) {
    console.error('[deserializeState] Deserialized state failed structuredClone test:', error);
    throw new Error(
      `Deserialized state is not structuredClone-safe: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  
  return deserialized;
}

