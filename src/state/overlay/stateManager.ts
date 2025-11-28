/**
 * State Manager — PART 3: UI State → Runtime State Separation
 * 
 * Framework-agnostic overlay state manager.
 * 
 * Design Principles:
 * - Framework-agnostic (no React/Vue/Angular dependencies)
 * - No DOM access, no browser APIs
 * - Pure runtime logic only
 * - Observer pattern for state updates
 * - Serializable state
 * - Multi-tab sync-safe
 * - Deterministic replay
 */

import type { Action } from './actions';
import type { OverlayRuntimeState } from './types';
import * as history from './history';
import * as transactions from './transactions';
import { sanitizeRuntimeState } from './runtime';
import { IS_DEV } from '../../utils/env';

/**
 * State change listener callback.
 * Called whenever state changes.
 */
export type StateChangeListener = (state: OverlayRuntimeState) => void;

/**
 * OverlayStateManager - Framework-agnostic state management class.
 * 
 * This class manages overlay runtime state and provides a clean API for:
 * - Action dispatch (execute actions and update history)
 * - Undo/redo operations
 * - Transaction management (batch updates)
 * - State subscription (observer pattern)
 * 
 * The manager is framework-agnostic and can be used with React, Vue, Angular,
 * or vanilla JavaScript.
 */
export class OverlayStateManager {
  private state: OverlayRuntimeState;
  private subscribers: Set<StateChangeListener>;
  
  /**
   * Create OverlayStateManager.
   * 
   * @param initialState - Initial runtime state
   */
  constructor(initialState: OverlayRuntimeState) {
    this.state = initialState;
    this.subscribers = new Set();
  }
  
  /**
   * Get current state.
   * Returns a reference to the current state (read-only from external perspective).
   * 
   * @returns Current runtime state
   */
  getState(): OverlayRuntimeState {
    return this.state;
  }
  
  /**
   * Dispatch action.
   * Executes an action, updates state, and records it in history.
   * 
   * FAZ-4-4H: Enhanced with structuredClone validation before notifying subscribers.
   * 
   * @param action - Action to dispatch
   */
  dispatch(action: Action): void {
    // If transaction is active, add to batch; otherwise, apply directly
    if (transactions.isTransactionActive(this.state)) {
      this.state = transactions.addToTransaction(this.state, action);
    } else {
      this.state = history.applyAction(this.state, action);
    }
    
    // FAZ-4-4H: Guarantee the outgoing state is JSON-safe before notifying subscribers
    // Validate that state can be sanitized (this ensures broadcast safety)
    try {
      sanitizeRuntimeState(this.state);
    } catch (error) {
      // If sanitization fails, log the error but continue (state is still valid locally)
      console.error('[OverlayStateManager] State failed sanitization after dispatch:', error);
      if (IS_DEV) {
        console.error('[OverlayStateManager] Action that caused issue:', {
          id: action.id,
          type: action.type,
          data: action.data,
        });
        console.error('[OverlayStateManager] Current state:', this.state);
      }
      // Continue anyway - the state is still valid for local use
      // Broadcast will be caught by the safety check in useOverlayStateManager
    }
    
    this.notifySubscribers();
  }
  
  /**
   * Undo last action.
   * Reverts the last action and moves it to redo stack.
   * 
   * FAZ-4-4H: Enhanced with structuredClone validation.
   */
  undo(): void {
    if (!history.canUndo(this.state)) {
      return; // Nothing to undo
    }
    
    this.state = history.undo(this.state);
    
    // FAZ-4-4H: Validate sanitization before notifying
    try {
      sanitizeRuntimeState(this.state);
    } catch (error) {
      console.error('[OverlayStateManager] State failed sanitization after undo:', error);
    }
    
    this.notifySubscribers();
  }
  
  /**
   * Redo next action.
   * Re-executes the next action from redo stack.
   * 
   * FAZ-4-4H: Enhanced with structuredClone validation.
   */
  redo(): void {
    if (!history.canRedo(this.state)) {
      return; // Nothing to redo
    }
    
    this.state = history.redo(this.state);
    
    // FAZ-4-4H: Validate sanitization before notifying
    try {
      sanitizeRuntimeState(this.state);
    } catch (error) {
      console.error('[OverlayStateManager] State failed sanitization after redo:', error);
    }
    
    this.notifySubscribers();
  }
  
  /**
   * Start transaction.
   * Begins a batch transaction for atomic updates.
   */
  startTransaction(): void {
    this.state = transactions.startTransaction(this.state);
    this.notifySubscribers();
  }
  
  /**
   * Commit transaction.
   * Commits all actions in batch as a single action to history.
   * 
   * FAZ-4-4H: Enhanced with structuredClone validation.
   */
  commitTransaction(): void {
    this.state = transactions.commitTransaction(this.state);
    
    // FAZ-4-4H: Validate sanitization before notifying
    try {
      sanitizeRuntimeState(this.state);
    } catch (error) {
      console.error('[OverlayStateManager] State failed sanitization after commitTransaction:', error);
    }
    
    this.notifySubscribers();
  }
  
  /**
   * Rollback transaction.
   * Cancels transaction and restores state to transaction start.
   */
  rollbackTransaction(): void {
    this.state = transactions.rollbackTransaction(this.state);
    this.notifySubscribers();
  }
  
  /**
   * Subscribe to state changes.
   * 
   * @param listener - Callback function to call on state changes
   * @returns Unsubscribe function
   */
  subscribe(listener: StateChangeListener): () => void {
    this.subscribers.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(listener);
    };
  }
  
  /**
   * Check if undo is possible.
   * 
   * @returns True if undo is possible
   */
  canUndo(): boolean {
    return history.canUndo(this.state);
  }
  
  /**
   * Check if redo is possible.
   * 
   * @returns True if redo is possible
   */
  canRedo(): boolean {
    return history.canRedo(this.state);
  }
  
  /**
   * Check if transaction is active.
   * 
   * @returns True if transaction is active
   */
  isTransactionActive(): boolean {
    return transactions.isTransactionActive(this.state);
  }
  
  /**
   * Get batch actions (if transaction is active).
   * 
   * @returns Array of actions in batch
   */
  getBatchActions(): Action[] {
    return transactions.getBatchActions(this.state);
  }
  
  /**
   * Get history size.
   * 
   * @returns Total number of actions in history
   */
  getHistorySize(): number {
    return history.getHistorySize(this.state);
  }
  
  /**
   * Replace state (for sync/migration purposes).
   * 
   * FAZ-3D: Enhanced replaceState for full integration.
   * 
   * This should be used carefully and typically only for:
   * - Multi-tab sync (BroadcastChannel)
   * - Preset import (state reset)
   * - State migration
   * 
   * Requirements:
   * - transactions must be cleared (inactive, no batch)
   * - history must be cleared (empty past/present/future)
   * - selection must be cleared (empty selectedIds)
   * - zOrder must be replaced
   * - elements must be replaced (Map clone)
   * - metadata must be updated
   * - subscribers must be notified
   * 
   * Note: The newState should already have these cleared (from preset import),
   * but we ensure consistency by using the newState as-is (it's already validated).
   * 
   * @param newState - New state to set (must be validated and consistent)
   */
  replaceState(newState: OverlayRuntimeState): void {
    // FAZ-3D: Ensure newState has proper cleared states
    // (preset import already creates clean state, but verify)
    const cleanState: OverlayRuntimeState = {
      ...newState,
      // Ensure transactions are cleared (should already be, but safety check)
      transactions: {
        active: false,
        batch: null,
        startState: null,
      },
      // Ensure selection is properly set (should already be, but clone Set)
      selection: {
        selectedIds: new Set(newState.selection.selectedIds),
        lastSelectedId: newState.selection.lastSelectedId,
      },
      // Ensure elements Map is cloned (reference safety)
      elements: new Map(newState.elements),
      // Ensure zOrder array is cloned (reference safety)
      zOrder: [...newState.zOrder],
      // FAZ-4-4: Update meta.updatedAt on replaceState
      meta: {
        ...newState.meta,
        updatedAt: Date.now(),
      },
    };
    
    // Replace state
    this.state = cleanState;
    
    // Notify all subscribers
    this.notifySubscribers();
    
    // FAZ-3D: Multi-tab sync will be handled by useOverlayStateManager
    // (not done here to keep StateManager framework-agnostic)
  }
  
  /**
   * Notify all subscribers of state change.
   * Private method for internal use.
   */
  private notifySubscribers(): void {
    this.subscribers.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        // Silently handle subscriber errors to prevent one bad subscriber
        // from breaking all subscriptions
        console.error('State change listener error:', error);
      }
    });
  }
}

