/**
 * Validation — PART 4: Comprehensive State Validation
 * 
 * Validation rules and consistency checks for OverlayRuntimeState.
 * 
 * Design Principles:
 * - Pure functions only
 * - Comprehensive error reporting
 * - Non-destructive validation (does not modify state)
 * - Fix functions return corrected state
 */

import type { OverlayElement } from '../../types/overlay';
import type { OverlayRuntimeState } from './types';
import * as selection from './selection';
import * as transactions from './transactions';
import { IS_DEV } from '../../utils/env';

/**
 * Validation error interface.
 */
export interface ValidationError {
  /** Error code (for programmatic handling) */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Element ID (if error is element-specific) */
  elementId?: string;
}

/**
 * Coordinate range limits (LCD coordinates).
 */
const COORDINATE_RANGE = {
  MIN: -10000,
  MAX: 10000,
};

/**
 * Size range limits (LCD pixels).
 */
const SIZE_RANGE = {
  MIN: 0.1,
  MAX: 10000,
};

/**
 * Rotation range limits (degrees).
 */
const ROTATION_RANGE = {
  MIN: 0,
  MAX: 360,
};

/**
 * Validate element structure.
 * 
 * @param element - Element to validate
 * @returns Validation errors (if any)
 */
function validateElementStructure(element: unknown): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!element || typeof element !== 'object') {
    return [{ code: 'INVALID_ELEMENT', message: 'Element is not an object' }];
  }
  
  const el = element as Partial<OverlayElement>;
  
  // ID validation
  if (!el.id || typeof el.id !== 'string') {
    errors.push({
      code: 'INVALID_ELEMENT_ID',
      message: 'Element ID is missing or invalid',
      elementId: el.id,
    });
  }
  
  // Type validation
  if (!el.type || typeof el.type !== 'string') {
    errors.push({
      code: 'INVALID_ELEMENT_TYPE',
      message: 'Element type is missing or invalid',
      elementId: el.id,
    });
  } else {
    const validTypes = ['metric', 'text', 'divider', 'clock', 'date'];
    if (!validTypes.includes(el.type)) {
      errors.push({
        code: 'UNKNOWN_ELEMENT_TYPE',
        message: `Unknown element type: ${el.type}`,
        elementId: el.id,
      });
    }
  }
  
  // Position validation (x, y)
  if (typeof el.x !== 'number' || isNaN(el.x)) {
    errors.push({
      code: 'INVALID_X_COORDINATE',
      message: 'Element x coordinate is invalid (NaN or missing)',
      elementId: el.id,
    });
  } else if (el.x < COORDINATE_RANGE.MIN || el.x > COORDINATE_RANGE.MAX) {
    errors.push({
      code: 'X_COORDINATE_OUT_OF_RANGE',
      message: `Element x coordinate out of range: ${el.x} (expected ${COORDINATE_RANGE.MIN} to ${COORDINATE_RANGE.MAX})`,
      elementId: el.id,
    });
  }
  
  if (typeof el.y !== 'number' || isNaN(el.y)) {
    errors.push({
      code: 'INVALID_Y_COORDINATE',
      message: 'Element y coordinate is invalid (NaN or missing)',
      elementId: el.id,
    });
  } else if (el.y < COORDINATE_RANGE.MIN || el.y > COORDINATE_RANGE.MAX) {
    errors.push({
      code: 'Y_COORDINATE_OUT_OF_RANGE',
      message: `Element y coordinate out of range: ${el.y} (expected ${COORDINATE_RANGE.MIN} to ${COORDINATE_RANGE.MAX})`,
      elementId: el.id,
    });
  }
  
  // Rotation validation (optional)
  if (el.angle !== undefined) {
    if (typeof el.angle !== 'number' || isNaN(el.angle)) {
      errors.push({
        code: 'INVALID_ROTATION',
        message: 'Element rotation is invalid (NaN or not a number)',
        elementId: el.id,
      });
    } else if (el.angle < ROTATION_RANGE.MIN || el.angle >= ROTATION_RANGE.MAX) {
      // Note: 360 is not included (0-359 range)
      errors.push({
        code: 'ROTATION_OUT_OF_RANGE',
        message: `Element rotation out of range: ${el.angle} (expected ${ROTATION_RANGE.MIN} to < ${ROTATION_RANGE.MAX})`,
        elementId: el.id,
      });
    }
  }
  
  // Data validation (type-specific)
  if (!el.data || typeof el.data !== 'object') {
    errors.push({
      code: 'INVALID_ELEMENT_DATA',
      message: 'Element data is missing or invalid',
      elementId: el.id,
    });
  }
  
  // Type-specific size validation
  if (el.type === 'divider' && el.data) {
    const data = el.data as { width?: number; height?: number };
    if (typeof data.width === 'number') {
      if (isNaN(data.width) || data.width < SIZE_RANGE.MIN || data.width > SIZE_RANGE.MAX) {
        errors.push({
          code: 'INVALID_DIVIDER_WIDTH',
          message: `Divider width out of range: ${data.width}`,
          elementId: el.id,
        });
      }
    }
    if (typeof data.height === 'number') {
      if (isNaN(data.height) || data.height < SIZE_RANGE.MIN || data.height > SIZE_RANGE.MAX) {
        errors.push({
          code: 'INVALID_DIVIDER_HEIGHT',
          message: `Divider height out of range: ${data.height}`,
          elementId: el.id,
        });
      }
    }
  }
  
  return errors;
}

/**
 * Ensure state consistency.
 * Fixes common consistency issues (orphan elements, missing elements, etc.)
 * and returns corrected state.
 * 
 * @param state - State to ensure consistency
 * @returns Corrected state
 */
export function ensureStateConsistency(
  state: OverlayRuntimeState
): OverlayRuntimeState {
  const errors: ValidationError[] = [];
  let correctedState = state;
  
  // 1. Check for duplicate element IDs in store
  const elementIds = new Set<string>();
  const duplicateIds = new Set<string>();
  
  for (const elementId of state.elements.keys()) {
    if (elementIds.has(elementId)) {
      duplicateIds.add(elementId);
      errors.push({
        code: 'DUPLICATE_ELEMENT_ID',
        message: `Duplicate element ID in store: ${elementId}`,
        elementId,
      });
    }
    elementIds.add(elementId);
  }
  
  // Remove duplicates (keep first occurrence)
  if (duplicateIds.size > 0) {
    let newElements = state.elements;
    for (const duplicateId of duplicateIds) {
      // Keep first, remove subsequent (this shouldn't happen with Map, but safety)
      const element = newElements.get(duplicateId);
      if (element) {
        const filtered = new Map<string, OverlayElement>();
        let foundFirst = false;
        for (const [id, el] of newElements.entries()) {
          if (id === duplicateId) {
            if (!foundFirst) {
              filtered.set(id, el);
              foundFirst = true;
            }
          } else {
            filtered.set(id, el);
          }
        }
        newElements = filtered;
      }
    }
    correctedState = { ...correctedState, elements: newElements };
  }
  
  // 2. Check for orphan elements (in zOrder but not in elementStore)
  const orphanIds: string[] = [];
  for (const elementId of correctedState.zOrder) {
    if (!correctedState.elements.has(elementId)) {
      orphanIds.push(elementId);
      errors.push({
        code: 'ORPHAN_ELEMENT_IN_ZORDER',
        message: `Element ID in z-order but not in element store: ${elementId}`,
        elementId,
      });
    }
  }
  
  // Remove orphan IDs from z-order
  if (orphanIds.length > 0) {
    const newZOrder = correctedState.zOrder.filter(id => !orphanIds.includes(id));
    correctedState = { ...correctedState, zOrder: newZOrder };
  }
  
  // 3. Check for missing elements (in elementStore but not in zOrder)
  const missingIds: string[] = [];
  for (const elementId of correctedState.elements.keys()) {
    if (!correctedState.zOrder.includes(elementId)) {
      missingIds.push(elementId);
      errors.push({
        code: 'MISSING_ELEMENT_IN_ZORDER',
        message: `Element ID in element store but not in z-order: ${elementId}`,
        elementId,
      });
    }
  }
  
  // Add missing IDs to end of z-order
  if (missingIds.length > 0) {
    const newZOrder = [...correctedState.zOrder, ...missingIds];
    correctedState = { ...correctedState, zOrder: newZOrder };
  }
  
  // 4. Validate all elements
  for (const element of correctedState.elements.values()) {
    const elementErrors = validateElementStructure(element);
    errors.push(...elementErrors);
  }
  
  // 5. Check for duplicate IDs in z-order
  const zOrderIds = new Set<string>();
  const duplicateZOrderIds: string[] = [];
  for (const elementId of correctedState.zOrder) {
    if (zOrderIds.has(elementId)) {
      duplicateZOrderIds.push(elementId);
      errors.push({
        code: 'DUPLICATE_ID_IN_ZORDER',
        message: `Duplicate element ID in z-order: ${elementId}`,
        elementId,
      });
    }
    zOrderIds.add(elementId);
  }
  
  // Remove duplicate IDs from z-order (keep first occurrence)
  if (duplicateZOrderIds.length > 0) {
    const seen = new Set<string>();
    const newZOrder = correctedState.zOrder.filter(id => {
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
    correctedState = { ...correctedState, zOrder: newZOrder };
  }
  
  // 6. Validate transaction state consistency
  if (correctedState.transactions.active) {
    if (!correctedState.transactions.batch) {
      errors.push({
        code: 'INVALID_TRANSACTION_STATE',
        message: 'Transaction is active but batch is null',
      });
      // Fix: clear transaction
      correctedState = {
        ...correctedState,
        transactions: transactions.createInitialTransactionState(),
      };
    }
  } else {
    if (correctedState.transactions.batch !== null || correctedState.transactions.startState !== null) {
      errors.push({
        code: 'INVALID_TRANSACTION_STATE',
        message: 'Transaction is inactive but has batch or startState',
      });
      // Fix: clear transaction
      correctedState = {
        ...correctedState,
        transactions: transactions.createInitialTransactionState(),
      };
    }
  }
  
  // 7. Validate selection consistency
  const invalidSelectionIds: string[] = [];
  for (const selectedId of correctedState.selection.selectedIds) {
    if (!correctedState.elements.has(selectedId)) {
      invalidSelectionIds.push(selectedId);
      errors.push({
        code: 'INVALID_SELECTION_ID',
        message: `Selected element ID not found in element store: ${selectedId}`,
        elementId: selectedId,
      });
    }
  }
  
  // Remove invalid selection IDs
  if (invalidSelectionIds.length > 0) {
    let newSelection = correctedState.selection;
    for (const invalidId of invalidSelectionIds) {
      newSelection = selection.removeFromSelection(newSelection, invalidId);
    }
    correctedState = { ...correctedState, selection: newSelection };
  }
  
  // Check lastSelectedId
  if (correctedState.selection.lastSelectedId) {
    if (!correctedState.elements.has(correctedState.selection.lastSelectedId)) {
      errors.push({
        code: 'INVALID_LAST_SELECTED_ID',
        message: `Last selected element ID not found in element store: ${correctedState.selection.lastSelectedId}`,
        elementId: correctedState.selection.lastSelectedId,
      });
      // Fix: clear lastSelectedId
      correctedState = {
        ...correctedState,
        selection: {
          ...correctedState.selection,
          lastSelectedId: null,
        },
      };
    }
  }
  
  // FAZ-3E PATCH #2: Log errors in dev mode for diagnostic purposes
  if (IS_DEV && errors.length > 0) {
    console.debug(`[Validation] ensureStateConsistency fixed ${errors.length} issue(s):`, errors);
  }
  
  // Return corrected state (errors are logged but not included in return)
  return correctedState;
}

/**
 * Validate state (non-destructive).
 * Returns validation errors without modifying state.
 * 
 * @param state - State to validate
 * @returns Validation result
 */
export function validateState(
  state: OverlayRuntimeState
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  
  // 1. Check for duplicate element IDs in store
  const elementIds = new Set<string>();
  for (const elementId of state.elements.keys()) {
    if (elementIds.has(elementId)) {
      errors.push({
        code: 'DUPLICATE_ELEMENT_ID',
        message: `Duplicate element ID in store: ${elementId}`,
        elementId,
      });
    }
    elementIds.add(elementId);
  }
  
  // 2. Check for orphan elements (in zOrder but not in elementStore)
  for (const elementId of state.zOrder) {
    if (!state.elements.has(elementId)) {
      errors.push({
        code: 'ORPHAN_ELEMENT_IN_ZORDER',
        message: `Element ID in z-order but not in element store: ${elementId}`,
        elementId,
      });
    }
  }
  
  // 3. Check for missing elements (in elementStore but not in zOrder)
  for (const elementId of state.elements.keys()) {
    if (!state.zOrder.includes(elementId)) {
      errors.push({
        code: 'MISSING_ELEMENT_IN_ZORDER',
        message: `Element ID in element store but not in z-order: ${elementId}`,
        elementId,
      });
    }
  }
  
  // 4. Validate all elements
  for (const element of state.elements.values()) {
    const elementErrors = validateElementStructure(element);
    errors.push(...elementErrors);
  }
  
  // 5. Check for duplicate IDs in z-order
  const zOrderIds = new Set<string>();
  for (const elementId of state.zOrder) {
    if (zOrderIds.has(elementId)) {
      errors.push({
        code: 'DUPLICATE_ID_IN_ZORDER',
        message: `Duplicate element ID in z-order: ${elementId}`,
        elementId,
      });
    }
    zOrderIds.add(elementId);
  }
  
  // 6. Validate transaction state consistency
  if (state.transactions.active) {
    if (!state.transactions.batch) {
      errors.push({
        code: 'INVALID_TRANSACTION_STATE',
        message: 'Transaction is active but batch is null',
      });
    }
  } else {
    if (state.transactions.batch !== null || state.transactions.startState !== null) {
      errors.push({
        code: 'INVALID_TRANSACTION_STATE',
        message: 'Transaction is inactive but has batch or startState',
      });
    }
  }
  
  // 7. Validate selection consistency
  for (const selectedId of state.selection.selectedIds) {
    if (!state.elements.has(selectedId)) {
      errors.push({
        code: 'INVALID_SELECTION_ID',
        message: `Selected element ID not found in element store: ${selectedId}`,
        elementId: selectedId,
      });
    }
  }
  
  if (state.selection.lastSelectedId && !state.elements.has(state.selection.lastSelectedId)) {
    errors.push({
      code: 'INVALID_LAST_SELECTED_ID',
      message: `Last selected element ID not found in element store: ${state.selection.lastSelectedId}`,
      elementId: state.selection.lastSelectedId,
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

