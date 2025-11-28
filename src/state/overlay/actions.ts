/**
 * Actions — PART 3: Action Model (Action-Based Undo/Redo)
 * 
 * Action interfaces and action creation helpers for the action-based undo/redo system.
 * 
 * Design Principles:
 * - Action-based model (not diff model)
 * - Discriminated union for type safety
 * - Pure execute/undo methods (deterministic)
 * - Serializable action data
 * - Replay-safe actions
 */

import type { OverlayElement } from '../../types/overlay';
import type { OverlayRuntimeState } from './types';
import * as elementStore from './elementStore';
import * as selection from './selection';
import * as zOrder from './zOrder';

/**
 * Action type discriminated union.
 */
export type ActionType =
  | 'addElement'
  | 'removeElement'
  | 'updateElement'
  | 'transform'
  | 'select'
  | 'zOrderChange'
  | 'batch';

/**
 * Add element action data.
 */
export interface AddElementActionData {
  element: OverlayElement;
}

/**
 * Remove element action data.
 */
export interface RemoveElementActionData {
  elementId: string;
  element: OverlayElement; // Removed element (for undo)
  zOrderIndex: number; // Original z-order index (for undo)
}

/**
 * Update element action data.
 */
export interface UpdateElementActionData {
  elementId: string;
  oldState: OverlayElement;
  newState: OverlayElement;
}

/**
 * Transform action data.
 * Used for element transformations (move, resize, rotate, or combined).
 */
export interface TransformActionData {
  elementIds: string[];
  oldStates: Map<string, OverlayElement>; // Old element states
  newStates: Map<string, OverlayElement>; // New element states
}

/**
 * Selection change action data.
 */
export interface SelectActionData {
  oldSelectedIds: string[];
  newSelectedIds: string[];
  oldLastSelectedId: string | null;
  newLastSelectedId: string | null;
}

/**
 * Z-order change action data.
 */
export interface ZOrderActionData {
  oldZOrder: string[];
  newZOrder: string[];
}

/**
 * Batch action data (contains nested actions).
 */
export interface BatchActionData {
  actions: Action[]; // Nested actions
}

/**
 * Action data union type.
 */
export type ActionData =
  | AddElementActionData
  | RemoveElementActionData
  | UpdateElementActionData
  | TransformActionData
  | SelectActionData
  | ZOrderActionData
  | BatchActionData;

/**
 * Base action interface.
 * All actions implement execute() and undo() as pure functions.
 */
export interface Action {
  /** Unique action ID */
  id: string;
  
  /** Action type (discriminated union discriminator) */
  type: ActionType;
  
  /** Timestamp (for ordering, conflict resolution) */
  timestamp: number;
  
  /** Action data (serializable, type-specific) */
  data: ActionData;
  
  /** Execute action (pure function, deterministic) */
  execute(state: OverlayRuntimeState): OverlayRuntimeState;
  
  /** Undo action (pure function, deterministic) */
  undo(state: OverlayRuntimeState): OverlayRuntimeState;
}

/**
 * Generate unique action ID.
 * 
 * @returns Unique action ID string
 */
export function generateActionId(): string {
  return `action-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create add element action.
 * 
 * @param element - Element to add
 * @returns Add element action
 */
export function createAddElementAction(element: OverlayElement): Action {
  const actionId = generateActionId();
  
  return {
    id: actionId,
    type: 'addElement',
    timestamp: Date.now(),
    data: { element },
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      // Add element to store
      const newElements = elementStore.addElement(state.elements, element);
      
      // Add to z-order (at end = front)
      const newZOrder = zOrder.addToZOrder(state.zOrder, element.id);
      
      return {
        ...state,
        elements: newElements,
        zOrder: newZOrder,
      };
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      // Remove element from store
      const newElements = elementStore.removeElement(state.elements, element.id);
      
      // Remove from z-order
      const newZOrder = zOrder.removeFromZOrder(state.zOrder, element.id);
      
      return {
        ...state,
        elements: newElements,
        zOrder: newZOrder,
      };
    },
  };
}

/**
 * Create remove element action.
 * 
 * @param elementId - Element ID to remove
 * @param state - Current state (to get element and z-order index)
 * @returns Remove element action
 */
export function createRemoveElementAction(
  elementId: string,
  state: OverlayRuntimeState
): Action {
  const element = elementStore.getElement(state.elements, elementId);
  if (!element) {
    throw new Error(`Cannot create remove action: element ${elementId} not found`);
  }
  
  const zOrderIndex = zOrder.getZOrderIndex(state.zOrder, elementId);
  if (zOrderIndex === -1) {
    throw new Error(`Cannot create remove action: element ${elementId} not in z-order`);
  }
  
  const actionId = generateActionId();
  
  const actionData: RemoveElementActionData = {
    elementId,
    element,
    zOrderIndex,
  };
  
  return {
    id: actionId,
    type: 'removeElement',
    timestamp: Date.now(),
    data: actionData,
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      // Remove element from store
      const newElements = elementStore.removeElement(state.elements, elementId);
      
      // Remove from z-order
      const newZOrder = zOrder.removeFromZOrder(state.zOrder, elementId);
      
      // Remove from selection if selected
      const newSelection = state.selection.selectedIds.has(elementId)
        ? selection.removeFromSelection(state.selection, elementId)
        : state.selection;
      
      return {
        ...state,
        elements: newElements,
        zOrder: newZOrder,
        selection: newSelection,
      };
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      // Restore element to store
      const newElements = elementStore.addElement(state.elements, actionData.element);
      
      // Restore to z-order at original position
      const newZOrder = [...state.zOrder];
      newZOrder.splice(actionData.zOrderIndex, 0, actionData.elementId);
      
      return {
        ...state,
        elements: newElements,
        zOrder: newZOrder,
      };
    },
  };
}

/**
 * Create update element action.
 * 
 * @param elementId - Element ID to update
 * @param oldState - Old element state
 * @param newState - New element state
 * @returns Update element action
 */
export function createUpdateElementAction(
  elementId: string,
  oldState: OverlayElement,
  newState: OverlayElement
): Action {
  const actionId = generateActionId();
  
  return {
    id: actionId,
    type: 'updateElement',
    timestamp: Date.now(),
    data: {
      elementId,
      oldState,
      newState,
    },
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      const newElements = elementStore.updateElement(
        state.elements,
        elementId,
        () => newState
      );
      
      return {
        ...state,
        elements: newElements,
      };
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      const newElements = elementStore.updateElement(
        state.elements,
        elementId,
        () => oldState
      );
      
      return {
        ...state,
        elements: newElements,
      };
    },
  };
}

/**
 * Create transform action (for element transformations).
 * 
 * @param elementIds - Element IDs to transform
 * @param oldStates - Old element states (Map)
 * @param newStates - New element states (Map)
 * @returns Transform action
 */
export function createTransformAction(
  elementIds: string[],
  oldStates: Map<string, OverlayElement>,
  newStates: Map<string, OverlayElement>
): Action {
  const actionId = generateActionId();
  const transformData: TransformActionData = {
    elementIds,
    oldStates,
    newStates,
  };
  
  return {
    id: actionId,
    type: 'transform',
    timestamp: Date.now(),
    data: transformData,
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      let newElements = state.elements;
      
      // Update all transformed elements
      for (const elementId of transformData.elementIds) {
        const newState = transformData.newStates.get(elementId);
        if (newState) {
          newElements = elementStore.updateElement(
            newElements,
            elementId,
            () => newState
          );
        }
      }
      
      return {
        ...state,
        elements: newElements,
      };
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      let newElements = state.elements;
      
      // Restore all old element states
      for (const elementId of transformData.elementIds) {
        const oldState = transformData.oldStates.get(elementId);
        if (oldState) {
          newElements = elementStore.updateElement(
            newElements,
            elementId,
            () => oldState
          );
        }
      }
      
      return {
        ...state,
        elements: newElements,
      };
    },
  };
}

/**
 * Create selection change action.
 * 
 * @param oldSelectedIds - Old selected IDs
 * @param newSelectedIds - New selected IDs
 * @param oldLastSelectedId - Old last selected ID
 * @param newLastSelectedId - New last selected ID
 * @returns Selection change action
 */
export function createSelectAction(
  oldSelectedIds: string[],
  newSelectedIds: string[],
  oldLastSelectedId: string | null,
  newLastSelectedId: string | null
): Action {
  const actionId = generateActionId();
  const selectData: SelectActionData = {
    oldSelectedIds,
    newSelectedIds,
    oldLastSelectedId,
    newLastSelectedId,
  };
  
  return {
    id: actionId,
    type: 'select',
    timestamp: Date.now(),
    data: selectData,
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      const newSelection = selection.selectElements(
        state.selection,
        selectData.newSelectedIds
      );
      
      // Update lastSelectedId
      const updatedSelection: selection.SelectionState = {
        ...newSelection,
        lastSelectedId: selectData.newLastSelectedId,
      };
      
      return {
        ...state,
        selection: updatedSelection,
      };
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      const oldSelection = selection.selectElements(
        state.selection,
        selectData.oldSelectedIds
      );
      
      // Restore lastSelectedId
      const restoredSelection: selection.SelectionState = {
        ...oldSelection,
        lastSelectedId: selectData.oldLastSelectedId,
      };
      
      return {
        ...state,
        selection: restoredSelection,
      };
    },
  };
}

/**
 * Create z-order change action.
 * 
 * @param oldZOrder - Old z-order array
 * @param newZOrder - New z-order array
 * @returns Z-order change action
 */
export function createZOrderAction(
  oldZOrder: string[],
  newZOrder: string[]
): Action {
  const actionId = generateActionId();
  const zOrderData: ZOrderActionData = {
    oldZOrder,
    newZOrder,
  };
  
  return {
    id: actionId,
    type: 'zOrderChange',
    timestamp: Date.now(),
    data: zOrderData,
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      return {
        ...state,
        zOrder: [...zOrderData.newZOrder],
      };
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      return {
        ...state,
        zOrder: [...zOrderData.oldZOrder],
      };
    },
  };
}

/**
 * Create batch action (contains nested actions).
 * 
 * @param actions - Array of nested actions
 * @returns Batch action
 */
export function createBatchAction(actions: Action[]): Action {
  const actionId = generateActionId();
  const batchData: BatchActionData = {
    actions: [...actions], // Copy array
  };
  
  return {
    id: actionId,
    type: 'batch',
    timestamp: Date.now(),
    data: batchData,
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      // Execute all actions sequentially
      return batchData.actions.reduce(
        (currentState, action) => action.execute(currentState),
        state
      );
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      // Undo all actions in reverse order
      return [...batchData.actions]
        .reverse()
        .reduce(
          (currentState, action) => action.undo(currentState),
          state
        );
    },
  };
}

/**
 * Validate action structure.
 * 
 * @param action - Action to validate
 * @returns True if action is valid
 */
export function validateAction(action: any): action is Action {
  if (!action || typeof action !== 'object') {
    return false;
  }
  
  if (typeof action.id !== 'string' || !action.id) {
    return false;
  }
  
  if (typeof action.type !== 'string') {
    return false;
  }
  
  if (typeof action.timestamp !== 'number') {
    return false;
  }
  
  if (!action.data || typeof action.data !== 'object') {
    return false;
  }
  
  if (typeof action.execute !== 'function') {
    return false;
  }
  
  if (typeof action.undo !== 'function') {
    return false;
  }
  
  return true;
}

