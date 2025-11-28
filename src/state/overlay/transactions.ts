/**
 * Transactions — PART 3: Transaction System (Batch Updates for Multi-Select)
 * 
 * Transaction management for batch updates (atomic operations, rollback support).
 * 
 * Design Principles:
 * - Atomic updates (all-or-nothing)
 * - Rollback support (transaction cancellation)
 * - Batch undo/redo (transaction becomes single action)
 * - Pure functions only (no mutations)
 * - Transaction state lifecycle management
 */

import type { Action } from './actions';
import type { TransactionState, OverlayRuntimeState } from './types';
import { applyAction } from './history';
import { createBatchAction } from './actions';

/**
 * Create initial transaction state.
 * 
 * @returns Initial transaction state (no active transaction)
 */
export function createInitialTransactionState(): TransactionState {
  return {
    active: false,
    batch: null,
    startState: null,
  };
}

/**
 * Start transaction.
 * Begins a new transaction batch operation.
 * 
 * @param state - Current state
 * @returns New state with transaction started
 */
export function startTransaction(state: OverlayRuntimeState): OverlayRuntimeState {
  // Prevent nested transactions
  if (state.transactions.active) {
    console.warn('Transaction already active, nested transaction prevented');
    return state;
  }
  
  // Save start state for rollback
  // Deep clone necessary parts of state for rollback
  const startState: OverlayRuntimeState = {
    elements: new Map(state.elements),
    selection: {
      selectedIds: new Set(state.selection.selectedIds),
      lastSelectedId: state.selection.lastSelectedId,
    },
    zOrder: [...state.zOrder],
    history: {
      past: [...state.history.past],
      present: state.history.present,
      future: [...state.history.future],
      maxHistorySize: state.history.maxHistorySize,
    },
    transactions: createInitialTransactionState(),
    meta: { ...state.meta },
  };
  
  return {
    ...state,
    transactions: {
      active: true,
      batch: [],
      startState,
    },
  };
}

/**
 * Add action to transaction batch.
 * If no transaction is active, action is executed immediately.
 * 
 * @param state - Current state
 * @param action - Action to add to batch
 * @returns New state with action added to batch (and executed)
 */
export function addToTransaction(
  state: OverlayRuntimeState,
  action: Action
): OverlayRuntimeState {
  if (!state.transactions.active) {
    // No transaction: execute action immediately (and add to history)
    return applyAction(state, action);
  }
  
  // Execute action (affects state immediately for visual feedback)
  const newState = action.execute(state);
  
  // Add to batch
  const newBatch = [...(state.transactions.batch || []), action];
  
  // FAZ-4-4C: Update meta.updatedAt on transaction action
  return {
    ...newState,
    transactions: {
      ...state.transactions,
      batch: newBatch,
    },
    meta: {
      ...newState.meta,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Commit transaction.
 * Commits all actions in batch as a single batch action to history.
 * 
 * @param state - Current state
 * @returns New state with transaction committed
 */
export function commitTransaction(
  state: OverlayRuntimeState
): OverlayRuntimeState {
  if (!state.transactions.active) {
    console.warn('No active transaction to commit');
    return state;
  }
  
  const batch = state.transactions.batch || [];
  
  if (batch.length === 0) {
    // Empty batch: just clear transaction
    return {
      ...state,
      transactions: createInitialTransactionState(),
    };
  }
  
  // Create batch action (single action containing all batch actions)
  const batchAction = createBatchAction(batch);
  
  // Apply batch action (adds to history as single action)
  const newState = applyAction(state, batchAction);
  
  // Clear transaction (meta.updatedAt already updated by applyAction)
  return {
    ...newState,
    transactions: createInitialTransactionState(),
  };
}

/**
 * Rollback transaction.
 * Restores state to transaction start state.
 * 
 * @param state - Current state
 * @returns New state with transaction rolled back
 */
export function rollbackTransaction(
  state: OverlayRuntimeState
): OverlayRuntimeState {
  if (!state.transactions.active) {
    console.warn('No active transaction to rollback');
    return state;
  }
  
  if (!state.transactions.startState) {
    console.error('Cannot rollback: start state missing');
    // Clear transaction anyway
    return {
      ...state,
      transactions: createInitialTransactionState(),
    };
  }
  
  // Restore start state (rollback to before transaction)
  return {
    ...state.transactions.startState,
    transactions: createInitialTransactionState(),
  };
}

/**
 * Check if transaction is active.
 * 
 * @param state - Current state
 * @returns True if transaction is active
 */
export function isTransactionActive(state: OverlayRuntimeState): boolean {
  return state.transactions.active === true;
}

/**
 * Get batch actions (actions in current transaction).
 * 
 * @param state - Current state
 * @returns Array of actions in batch, or empty array if no transaction
 */
export function getBatchActions(state: OverlayRuntimeState): Action[] {
  return state.transactions.batch || [];
}

/**
 * Check if transaction can be rolled back.
 * 
 * @param state - Current state
 * @returns True if transaction can be rolled back
 */
export function canRollbackTransaction(state: OverlayRuntimeState): boolean {
  return state.transactions.active && state.transactions.startState !== null;
}

/**
 * Get transaction batch size (number of actions in batch).
 * 
 * @param state - Current state
 * @returns Number of actions in batch
 */
export function getBatchSize(state: OverlayRuntimeState): number {
  return state.transactions.batch?.length || 0;
}

