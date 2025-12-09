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

import type { OverlayElement, MetricElementData, TextElementData, DividerElementData } from '../../types/overlay';
import type { OverlayRuntimeState } from './types';
import * as elementStore from './elementStore';
import * as selection from './selection';
import * as zOrder from './zOrder';
// FAZ-7 / Task 6E: Operation detector for v2Meta computation
import { detectOperationTypeV2 } from '../../transform/operation-detector/operationDetectorV2';
// FAZ-7 / Task 7E: UI helpers for group metadata
import { computeGroupBoundingBox, type ElementBoundingBox } from '../../ui/helpers/groupBoundingBox';
// FAZ-7 / Task 7E: Element dimensions (read-only from Frozen Zone for UI calculations)
import { calculateElementDimensions } from '../../transform/engine/BoundingBox';

/**
 * Action type discriminated union.
 */
export type ActionType =
  | 'addElement'
  | 'removeElement'
  | 'updateElement'
  | 'updateElementData'
  | 'transform'
  | 'select'
  | 'zOrderChange'
  | 'moveElementZUp'
  | 'moveElementZDown'
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
 * Update element data action data (for partial data updates only).
 * More efficient than full element update when only data properties change.
 */
export interface UpdateElementDataActionData {
  elementId: string;
  oldData: MetricElementData | TextElementData | DividerElementData;
  newData: MetricElementData | TextElementData | DividerElementData;
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
 * FAZ-7 / Task 5B — Transform Snapshot v2
 * 
 * This is a versioned snapshot payload for future undo/redo and multi-select features.
 * It is currently NOT integrated into the runtime history system.
 * 
 * Behavior note:
 * - Existing TransformActionData and history logic remain the source of truth.
 * - This type is additive and will be adopted gradually in future phases.
 */

/**
 * Discriminated transform operation type for v2 snapshots.
 */
export type TransformOperationTypeV2 =
  | 'move'
  | 'resize'
  | 'rotate'
  | 'zOrder'
  | 'data'
  | 'other';

/**
 * FAZ-7 / Task 6D: Transform operation metadata (v2)
 * 
 * This is optional, additive metadata attached to actions.
 * It NEVER participates in execute()/undo() logic.
 */
export interface TransformMetadataV2 {
  opType: TransformOperationTypeV2;
  groupId?: string;
  deltas?: {
    dx?: number;
    dy?: number;
    dWidth?: number;
    dHeight?: number;
    dRotationDeg?: number;
  };
  affectedIds?: string[];
  confidence?: number;      // 0..1 (optional, future use)
  analysisVersion: 2;       // version marker for this metadata shape
  // FAZ-7 / Task 7E: Multi-select metadata extensions
  groupBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  };
  relativeOffsets?: Record<string, { dx: number; dy: number }>;
  perElementDeltas?: Record<string, {
    dx?: number;
    dy?: number;
    dWidth?: number;
    dHeight?: number;
    dRotationDeg?: number;
  }>;
  groupScaleFactor?: number;      // Placeholder (computed in future tasks)
  groupRotationAngle?: number;    // Placeholder (computed in future tasks)
}

/**
 * v2 snapshot metadata type.
 * 
 * Provides rich metadata for transform operations, including deltas, bounding boxes,
 * and multi-select support. All fields beyond required ones are optional.
 */
export interface TransformSnapshotMetaV2 {
  /** Schema version identifier for future migrations */
  version: 'v2';

  /** Unique snapshot ID (for debugging, analytics, correlation) */
  snapshotId: string;

  /** High-level transform type (move/resize/rotate/zOrder/data/etc.) */
  operationType: TransformOperationTypeV2;

  /** Unix timestamp (ms) when this snapshot was created */
  timestamp: number;

  /** All elements affected by this transform */
  affectedElementIds: string[];

  /** Optional group ID for multi-select/group transforms */
  groupId?: string;

  /** Optional group bounding box at the moment of transform */
  groupBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  /** Optional per-transform delta meta (e.g. dx/dy/dScale/dAngle) */
  deltas?: {
    dx?: number;
    dy?: number;
    dWidth?: number;
    dHeight?: number;
    dRotationDeg?: number;
  };

  /** Optional origin point used for rotation/scale transforms */
  origin?: {
    x: number;
    y: number;
  };

  /** Optional free-form metadata for future extensions */
  extra?: Record<string, unknown>;
}

/**
 * Transform action data v2.
 * 
 * FAZ-7 / Task 5B — Transform Snapshot v2
 * 
 * This is a versioned snapshot payload for future undo/redo and multi-select features.
 * It is currently NOT integrated into the runtime history system.
 * 
 * Behavior note:
 * - Existing TransformActionData and history logic remain the source of truth.
 * - This type is additive and will be adopted gradually in future phases.
 */
export interface TransformActionDataV2 {
  /** Optional reference to the previous v1-style payload (for migration / debugging) */
  legacy?: TransformActionData;

  /** Snapshot metadata (v2 schema) */
  meta: TransformSnapshotMetaV2;

  /**
   * Full pre-transform snapshot of affected elements.
   * For multi-select, this can contain multiple elements.
   */
  before: OverlayElement[];

  /**
   * Full post-transform snapshot of affected elements.
   * For multi-select, this can contain multiple elements.
   */
  after: OverlayElement[];
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
 * Move element Z-index up action data.
 * FAZ-4-4P: New action for Move Up button.
 */
export interface MoveElementZUpActionData {
  elementId: string;
  oldZ: number;
  newZ: number;
}

/**
 * Move element Z-index down action data.
 * FAZ-4-4P: New action for Move Down button.
 */
export interface MoveElementZDownActionData {
  elementId: string;
  oldZ: number;
  newZ: number;
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
  | UpdateElementDataActionData
  | TransformActionData
  | SelectActionData
  | ZOrderActionData
  | MoveElementZUpActionData
  | MoveElementZDownActionData
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
  
  /**
   * FAZ-7 / Task 6D: Optional v2 metadata (additive, backward compatible)
   * 
   * This is optional, additive metadata that NEVER participates in execute()/undo() logic.
   * It is used only for UI features (timeline, filtering, smart undo) and is completely
   * optional. Existing actions without v2Meta continue to work perfectly.
   */
  v2Meta?: TransformMetadataV2;
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
 * Create update element data action (for partial data updates only).
 * More efficient than full element update when only data properties change.
 * 
 * FAZ-4-4L: Added for efficient property updates (color, font, text, etc.).
 * 
 * @param elementId - Element ID to update
 * @param oldData - Old element data
 * @param newData - New element data
 * @param state - Current state (to get current element)
 * @returns Update element data action
 */
export function createUpdateElementDataAction(
  elementId: string,
  oldData: MetricElementData | TextElementData | DividerElementData,
  newData: MetricElementData | TextElementData | DividerElementData,
  state: OverlayRuntimeState
): Action {
  const currentElement = elementStore.getElement(state.elements, elementId);
  if (!currentElement) {
    throw new Error(`Cannot create update element data action: element ${elementId} not found`);
  }
  
  const actionId = generateActionId();
  const actionData: UpdateElementDataActionData = {
    elementId,
    oldData,
    newData,
  };
  
  return {
    id: actionId,
    type: 'updateElementData',
    timestamp: Date.now(),
    data: actionData,
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      const newElements = elementStore.updateElement(
        state.elements,
        elementId,
        (element) => ({
          ...element,
          data: newData,
        })
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
        (element) => ({
          ...element,
          data: oldData,
        })
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
 * FAZ-7 / Task 6D-6E: Optional v2 metadata wrapper for transform actions
 * 
 * NOTE: This helper is NOT used anywhere yet. It only prepares the API surface.
 * ZERO behavior change guaranteed until call sites adopt it in a future task.
 * 
 * This is a thin wrapper around createTransformAction that provides an extension point
 * for attaching v2 metadata. When includeV2Meta is true, it computes minimal metadata
 * (opType, affectedIds, analysisVersion) using the operation detector.
 */
export interface CreateTransformActionV2Options {
  /**
   * When true, the caller intends to attach v2 metadata.
   * The helper will compute minimal v2Meta (opType, affectedIds, analysisVersion).
   */
  includeV2Meta?: boolean;
}

/**
 * Create transform action with optional v2 metadata support.
 * 
 * FAZ-7 / Task 6E:
 * This helper prepares a v2Meta-enriched transform action.
 * It is NOT used by any existing code path yet.
 * Behavior remains identical until call sites explicitly adopt it.
 * 
 * @param elementIds - Element IDs affected by the transform
 * @param oldStates - Old element states (Map)
 * @param newStates - New element states (Map)
 * @param options - Optional v2 metadata options
 * @returns Transform action (with optional v2Meta if includeV2Meta is true)
 */
export function createTransformActionWithV2(
  elementIds: string[],
  oldStates: Map<string, OverlayElement>,
  newStates: Map<string, OverlayElement>,
  options?: CreateTransformActionV2Options
): Action {
  const baseAction = createTransformAction(elementIds, oldStates, newStates);

  if (!options?.includeV2Meta) {
    // No metadata requested → return the original action untouched.
    return baseAction;
  }

  try {
    // Build before[] and after[] arrays based on elementIds
    const before: OverlayElement[] = [];
    const after: OverlayElement[] = [];

    for (const id of elementIds) {
      const beforeEl = oldStates.get(id);
      const afterEl = newStates.get(id);

      if (!beforeEl || !afterEl) {
        // Inconsistent snapshot → skip v2Meta entirely for safety.
        return baseAction;
      }

      before.push(beforeEl);
      after.push(afterEl);
    }

    if (before.length === 0 || after.length === 0) {
      // Nothing to analyze → skip v2Meta
      return baseAction;
    }

    const opType = detectOperationTypeV2(before, after);

    // FAZ-7 / Task 7E: Detect multi-select scenario
    const isMulti = elementIds.length > 1;

    // FAZ-7 / Task 7E: Build enhanced v2Meta for multi-select, minimal for single-select
    let v2Meta: TransformMetadataV2;

    if (isMulti) {
      // Multi-select: Compute group metadata
      try {
        // Build UI-level bounding boxes from before[] snapshot
        const elementBoxes: ElementBoundingBox[] = [];
        for (const el of before) {
          const dimensions = calculateElementDimensions(el);
          // Convert element center (x, y) to top-left corner for bounding box
          elementBoxes.push({
            id: el.id,
            x: el.x - dimensions.width / 2,
            y: el.y - dimensions.height / 2,
            width: dimensions.width,
            height: dimensions.height,
          });
        }

        // Compute group bounding box
        const groupBBox = computeGroupBoundingBox(elementBoxes);
        if (!groupBBox) {
          // Group box computation failed → fallback to minimal v2Meta
          v2Meta = {
            opType,
            affectedIds: elementIds.slice(),
            analysisVersion: 2,
          };
        } else {
          // Compute per-element deltas (compare before/after)
          const perElementDeltas: Record<string, {
            dx?: number;
            dy?: number;
            dWidth?: number;
            dHeight?: number;
            dRotationDeg?: number;
          }> = {};

          for (const beforeEl of before) {
            const afterEl = after.find(a => a.id === beforeEl.id);
            if (!afterEl) continue;

            // Compute position deltas
            const dx = afterEl.x - beforeEl.x;
            const dy = afterEl.y - beforeEl.y;

            // Compute size deltas (using element dimensions)
            const beforeDims = calculateElementDimensions(beforeEl);
            const afterDims = calculateElementDimensions(afterEl);
            const dWidth = afterDims.width - beforeDims.width;
            const dHeight = afterDims.height - beforeDims.height;

            // Compute rotation delta
            const beforeAngle = beforeEl.angle ?? 0;
            const afterAngle = afterEl.angle ?? 0;
            let dRotationDeg = afterAngle - beforeAngle;
            // Normalize angle delta to [-180, 180] range
            if (dRotationDeg > 180) dRotationDeg -= 360;
            if (dRotationDeg < -180) dRotationDeg += 360;

            perElementDeltas[beforeEl.id] = {
              dx,
              dy,
              dWidth,
              dHeight,
              dRotationDeg: dRotationDeg !== 0 ? dRotationDeg : undefined,
            };
          }

          // Generate group ID
          const groupId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `group_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

          // Assemble enhanced v2Meta for multi-select
          v2Meta = {
            opType,
            affectedIds: elementIds.slice(),
            analysisVersion: 2,
            groupId,
            groupBoundingBox: {
              x: groupBBox.x,
              y: groupBBox.y,
              width: groupBBox.width,
              height: groupBBox.height,
              centerX: groupBBox.centerX,
              centerY: groupBBox.centerY,
            },
            relativeOffsets: groupBBox.relativeOffsets,
            perElementDeltas,
            groupScaleFactor: 1,         // Placeholder (computed in future tasks)
            groupRotationAngle: 0,      // Placeholder (computed in future tasks)
          };
        }
      } catch (err) {
        // If group metadata computation fails, fallback to minimal v2Meta
        // (Error is silently handled - v2Meta is optional and should not break action creation)
        v2Meta = {
          opType,
          affectedIds: elementIds.slice(),
          analysisVersion: 2,
        };
      }
    } else {
      // Single-select: Use minimal v2Meta (unchanged from Task 6E)
      v2Meta = {
        opType,
        affectedIds: elementIds.slice(),
        analysisVersion: 2,
      };
    }

    // NOTE: v2Meta is optional metadata only and does not affect execution or undo/redo.
    // v1 action payload (oldStates/newStates) remains the source of truth for all runtime behavior.
    return {
      ...baseAction,
      v2Meta,
    };
  } catch {
    // Safety: if anything goes wrong, we completely ignore v2Meta.
    return baseAction;
  }
}

/**
 * Generate unique snapshot ID for v2 snapshots.
 * Uses crypto.randomUUID() if available, otherwise falls back to time-based ID.
 * 
 * @returns Unique snapshot ID string
 */
function generateSnapshotId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: time-based ID with random suffix
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create transform action v2 (for element transformations with rich metadata).
 * 
 * FAZ-7 / Task 5B — Transform Snapshot v2
 * 
 * This is a versioned snapshot payload for future undo/redo and multi-select features.
 * It is currently NOT integrated into the runtime history system.
 * 
 * Behavior note:
 * - Existing TransformActionData and history logic remain the source of truth.
 * - This type is additive and will be adopted gradually in future phases.
 * 
 * @param params - Parameters for creating v2 transform action data
 * @returns Transform action data v2
 */
export function createTransformActionV2(params: {
  operationType: TransformOperationTypeV2;
  before: OverlayElement[];
  after: OverlayElement[];
  affectedElementIds?: string[];
  groupId?: string;
  groupBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  deltas?: {
    dx?: number;
    dy?: number;
    dWidth?: number;
    dHeight?: number;
    dRotationDeg?: number;
  };
  origin?: {
    x: number;
    y: number;
  };
  legacy?: TransformActionData;
  extra?: Record<string, unknown>;
}): TransformActionDataV2 {
  const {
    operationType,
    before,
    after,
    affectedElementIds,
    groupId,
    groupBoundingBox,
    deltas,
    origin,
    legacy,
    extra,
  } = params;

  const primaryIds =
    affectedElementIds && affectedElementIds.length > 0
      ? affectedElementIds
      : after.map((el) => el.id);

  return {
    legacy,
    meta: {
      version: 'v2',
      snapshotId: generateSnapshotId(),
      operationType,
      timestamp: Date.now(),
      affectedElementIds: primaryIds,
      groupId,
      groupBoundingBox,
      deltas,
      origin,
      extra,
    },
    before,
    after,
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
 * Create move element Z-index up action.
 * FAZ-4-4P: Increments element.zIndex by 1 and reorders zOrder array.
 * 
 * @param elementId - Element ID to move up
 * @param state - Current state (to get element and calculate zIndex)
 * @returns Move element Z-index up action
 */
export function createMoveElementZUpAction(
  elementId: string,
  state: OverlayRuntimeState
): Action {
  const element = elementStore.getElement(state.elements, elementId);
  if (!element) {
    throw new Error(`Cannot create moveElementZUp action: element ${elementId} not found`);
  }
  
  // Use zOrder as source of truth - get current position in zOrder array
  const zOrderIndex = zOrder.getZOrderIndex(state.zOrder, elementId);
  if (zOrderIndex === -1) {
    throw new Error(`Cannot create moveElementZUp action: element ${elementId} not in z-order`);
  }
  
  // Check if already at front (last index in zOrder array = front position)
  if (zOrderIndex === state.zOrder.length - 1) {
    // Return no-op action
    const actionId = generateActionId();
    const oldZ = element.zIndex !== undefined ? element.zIndex : zOrderIndex;
    const actionData: MoveElementZUpActionData = {
      elementId,
      oldZ,
      newZ: oldZ,
    };
    
    return {
      id: actionId,
      type: 'moveElementZUp',
      timestamp: Date.now(),
      data: actionData,
      execute: (s) => s, // No-op
      undo: (s) => s, // No-op
    };
  }
  
  const actionId = generateActionId();
  const oldZ = element.zIndex !== undefined ? element.zIndex : zOrderIndex;
  const actionData: MoveElementZUpActionData = {
    elementId,
    oldZ,
    newZ: zOrderIndex + 1, // Will be normalized after zOrder change
  };
  
  return {
    id: actionId,
    type: 'moveElementZUp',
    timestamp: Date.now(),
    data: actionData,
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      // Step 1: Move element forward in zOrder array (swap with next element)
      const newZOrder = zOrder.moveForward(state.zOrder, elementId);
      
      // Step 2: Normalize zIndex values to match zOrder positions (0..N-1)
      let newElements = state.elements;
      for (let i = 0; i < newZOrder.length; i++) {
        const elId = newZOrder[i];
        const el = elementStore.getElement(newElements, elId);
        if (el && el.zIndex !== i) {
          newElements = elementStore.updateElement(
            newElements,
            elId,
            (element) => ({
              ...element,
              zIndex: i,
            })
          );
        }
      }
      
      return {
        ...state,
        elements: newElements,
        zOrder: newZOrder,
      };
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      // Move element backward in zOrder array (opposite of moveForward)
      const newZOrder = zOrder.moveBackward(state.zOrder, elementId);
      
      // Normalize zIndex values to match zOrder positions (0..N-1)
      let newElements = state.elements;
      for (let i = 0; i < newZOrder.length; i++) {
        const elId = newZOrder[i];
        const el = elementStore.getElement(newElements, elId);
        if (el && el.zIndex !== i) {
          newElements = elementStore.updateElement(
            newElements,
            elId,
            (element) => ({
              ...element,
              zIndex: i,
            })
          );
        }
      }
      
      return {
        ...state,
        elements: newElements,
        zOrder: newZOrder,
      };
    },
  };
}

/**
 * Create move element Z-index down action.
 * FAZ-4-4P: Decrements element.zIndex by 1 and reorders zOrder array.
 * 
 * @param elementId - Element ID to move down
 * @param state - Current state (to get element and calculate zIndex)
 * @returns Move element Z-index down action
 */
export function createMoveElementZDownAction(
  elementId: string,
  state: OverlayRuntimeState
): Action {
  const element = elementStore.getElement(state.elements, elementId);
  if (!element) {
    throw new Error(`Cannot create moveElementZDown action: element ${elementId} not found`);
  }
  
  // Use zOrder as source of truth - get current position in zOrder array
  const zOrderIndex = zOrder.getZOrderIndex(state.zOrder, elementId);
  if (zOrderIndex === -1) {
    throw new Error(`Cannot create moveElementZDown action: element ${elementId} not in z-order`);
  }
  
  // Check if already at back (first index in zOrder array = back position)
  if (zOrderIndex === 0) {
    // Return no-op action (already at back)
    const actionId = generateActionId();
    const oldZ = element.zIndex !== undefined ? element.zIndex : zOrderIndex;
    const actionData: MoveElementZDownActionData = {
      elementId,
      oldZ,
      newZ: oldZ,
    };
    
    return {
      id: actionId,
      type: 'moveElementZDown',
      timestamp: Date.now(),
      data: actionData,
      execute: (s) => s, // No-op
      undo: (s) => s, // No-op
    };
  }
  
  const actionId = generateActionId();
  const oldZ = element.zIndex !== undefined ? element.zIndex : zOrderIndex;
  const actionData: MoveElementZDownActionData = {
    elementId,
    oldZ,
    newZ: zOrderIndex - 1, // Will be normalized after zOrder change
  };
  
  return {
    id: actionId,
    type: 'moveElementZDown',
    timestamp: Date.now(),
    data: actionData,
    
    execute(state: OverlayRuntimeState): OverlayRuntimeState {
      // Step 1: Move element backward in zOrder array (swap with previous element)
      const newZOrder = zOrder.moveBackward(state.zOrder, elementId);
      
      // Step 2: Normalize zIndex values to match zOrder positions (0..N-1)
      let newElements = state.elements;
      for (let i = 0; i < newZOrder.length; i++) {
        const elId = newZOrder[i];
        const el = elementStore.getElement(newElements, elId);
        if (el && el.zIndex !== i) {
          newElements = elementStore.updateElement(
            newElements,
            elId,
            (element) => ({
              ...element,
              zIndex: i,
            })
          );
        }
      }
      
      return {
        ...state,
        elements: newElements,
        zOrder: newZOrder,
      };
    },
    
    undo(state: OverlayRuntimeState): OverlayRuntimeState {
      // Move element forward in zOrder array (opposite of moveBackward)
      const newZOrder = zOrder.moveForward(state.zOrder, elementId);
      
      // Normalize zIndex values to match zOrder positions (0..N-1)
      let newElements = state.elements;
      for (let i = 0; i < newZOrder.length; i++) {
        const elId = newZOrder[i];
        const el = elementStore.getElement(newElements, elId);
        if (el && el.zIndex !== i) {
          newElements = elementStore.updateElement(
            newElements,
            elId,
            (element) => ({
              ...element,
              zIndex: i,
            })
          );
        }
      }
      
      return {
        ...state,
        elements: newElements,
        zOrder: newZOrder,
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

