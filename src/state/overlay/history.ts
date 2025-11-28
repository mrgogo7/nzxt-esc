/**
 * History — PART 3: Undo/Redo System (Action-Based, Deterministic Replay)
 * 
 * History management for the action-based undo/redo system.
 * 
 * Design Principles:
 * - Action-based history (not diff model)
 * - Deterministic replay (same input → same output)
 * - Pure functions only (no mutations)
 * - History limit management (memory efficiency)
 * - Replay-safe operations
 */

import type { Action } from './actions';
import type { HistoryState, OverlayRuntimeState } from './types';

/**
 * Default history limit (maximum number of actions in history).
 */
export const DEFAULT_HISTORY_LIMIT = 50;

/**
 * Create initial history state.
 * 
 * @param maxHistorySize - Maximum history size (default: DEFAULT_HISTORY_LIMIT)
 * @returns Initial history state
 */
export function createInitialHistoryState(maxHistorySize: number = DEFAULT_HISTORY_LIMIT): HistoryState {
  return {
    past: [],
    present: null,
    future: [],
    maxHistorySize,
  };
}

/**
 * Apply action to state and update history.
 * This is the primary function for executing actions and recording them in history.
 * 
 * @param state - Current state
 * @param action - Action to apply
 * @returns New state with action applied and history updated
 */
export function applyAction(
  state: OverlayRuntimeState,
  action: Action
): OverlayRuntimeState {
  // Execute action (pure function, deterministic)
  const newState = action.execute(state);
  
  // Update history
  const newHistory: HistoryState = {
    past: [...state.history.past, state.history.present].filter((a): a is Action => a !== null),
    present: action,
    future: [], // Redo stack cleared on new action
    maxHistorySize: state.history.maxHistorySize,
  };
  
  // Limit history size (remove oldest actions if limit exceeded)
  if (newHistory.past.length > newHistory.maxHistorySize) {
    const removeCount = newHistory.past.length - newHistory.maxHistorySize;
    newHistory.past = newHistory.past.slice(removeCount);
  }
  
  // FAZ-4-4C: Update meta.updatedAt on state change
  return {
    ...newState,
    history: newHistory,
    meta: {
      ...newState.meta,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Undo last action.
 * 
 * @param state - Current state
 * @returns New state with last action undone
 */
export function undo(state: OverlayRuntimeState): OverlayRuntimeState {
  if (state.history.past.length === 0) {
    return state; // Nothing to undo
  }
  
  // Get last action from past
  const lastAction = state.history.past[state.history.past.length - 1];
  
  // Undo action (pure function, deterministic)
  const newState = lastAction.undo(state);
  
  // Update history
  const newHistory: HistoryState = {
    past: state.history.past.slice(0, -1), // Remove last action from past
    present: null, // No present action after undo
    future: [lastAction, ...state.history.future], // Add to redo stack
    maxHistorySize: state.history.maxHistorySize,
  };
  
  // FAZ-4-4C: Update meta.updatedAt on undo
  return {
    ...newState,
    history: newHistory,
    meta: {
      ...newState.meta,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Redo next action.
 * 
 * @param state - Current state
 * @returns New state with next action redone
 */
export function redo(state: OverlayRuntimeState): OverlayRuntimeState {
  if (state.history.future.length === 0) {
    return state; // Nothing to redo
  }
  
  // Get next action from future
  const nextAction = state.history.future[0];
  
  // Execute action (pure function, deterministic)
  const newState = nextAction.execute(state);
  
  // Update history
  const newHistory: HistoryState = {
    past: [...state.history.past, state.history.present].filter((a): a is Action => a !== null),
    present: nextAction,
    future: state.history.future.slice(1), // Remove from redo stack
    maxHistorySize: state.history.maxHistorySize,
  };
  
  // FAZ-4-4C: Update meta.updatedAt on redo
  return {
    ...newState,
    history: newHistory,
    meta: {
      ...newState.meta,
      updatedAt: Date.now(),
    },
  };
}

/**
 * Push action to history (alternative interface, same as applyAction).
 * 
 * @param state - Current state
 * @param action - Action to push
 * @returns New state with action pushed to history
 */
export function pushHistory(
  state: OverlayRuntimeState,
  action: Action
): OverlayRuntimeState {
  return applyAction(state, action);
}

/**
 * Check if undo is possible.
 * 
 * @param state - Current state
 * @returns True if undo is possible
 */
export function canUndo(state: OverlayRuntimeState): boolean {
  return state.history.past.length > 0;
}

/**
 * Check if redo is possible.
 * 
 * @param state - Current state
 * @returns True if redo is possible
 */
export function canRedo(state: OverlayRuntimeState): boolean {
  return state.history.future.length > 0;
}

/**
 * Replay actions from initial state.
 * Pure replay model: apply actions sequentially to reach target state.
 * 
 * @param initialState - Initial state
 * @param actions - Array of actions to replay
 * @returns Final state after replaying all actions
 */
export function replayActions(
  initialState: OverlayRuntimeState,
  actions: Action[]
): OverlayRuntimeState {
  return actions.reduce(
    (currentState, action) => action.execute(currentState),
    initialState
  );
}

/**
 * Clear history (remove all past and future actions).
 * 
 * @param state - Current state
 * @returns New state with cleared history
 */
export function clearHistory(state: OverlayRuntimeState): OverlayRuntimeState {
  return {
    ...state,
    history: createInitialHistoryState(state.history.maxHistorySize),
  };
}

/**
 * Get history size (total number of actions).
 * 
 * @param state - Current state
 * @returns Total number of actions in history (past + present + future)
 */
export function getHistorySize(state: OverlayRuntimeState): number {
  const pastCount = state.history.past.length;
  const presentCount = state.history.present ? 1 : 0;
  const futureCount = state.history.future.length;
  
  return pastCount + presentCount + futureCount;
}

/**
 * Set history limit.
 * 
 * @param state - Current state
 * @param maxHistorySize - New maximum history size
 * @returns New state with updated history limit
 */
export function setHistoryLimit(
  state: OverlayRuntimeState,
  maxHistorySize: number
): OverlayRuntimeState {
  const newHistory: HistoryState = {
    ...state.history,
    maxHistorySize,
  };
  
  // Trim past if new limit is smaller
  if (newHistory.past.length > maxHistorySize) {
    const removeCount = newHistory.past.length - maxHistorySize;
    newHistory.past = newHistory.past.slice(removeCount);
  }
  
  return {
    ...state,
    history: newHistory,
  };
}

