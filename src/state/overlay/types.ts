/**
 * Overlay Runtime State Types — PART 3: Type Definitions
 * 
 * Type definitions for PART 3 (History, Transactions, State Manager).
 * These types are minimal and focused on PART 3 requirements.
 * 
 * Note: This file provides minimal type definitions to support PART 3.
 * Full OverlayRuntimeState will be defined in PART 1.
 */

import type { ElementStore } from './elementStore';
import type { SelectionState } from './selection';
import type { ZOrder } from './zOrder';
import type { Action } from './actions';

/**
 * History state interface.
 */
export interface HistoryState {
  /** Past actions (undo stack) */
  past: Action[];
  
  /** Present action (current state's action, or null if no action) */
  present: Action | null;
  
  /** Future actions (redo stack) */
  future: Action[];
  
  /** Maximum history size (memory management) */
  maxHistorySize: number;
}

/**
 * Transaction state interface.
 */
export interface TransactionState {
  /** Active transaction flag */
  active: boolean;
  
  /** Batch actions (actions in current transaction) */
  batch: Action[] | null;
  
  /** Transaction start state (for rollback) */
  startState: OverlayRuntimeState | null;
}

/**
 * State metadata interface.
 */
export interface StateMetadata {
  /** Version tracking (for schema migration) */
  version: number;
  
  /** Creation timestamp */
  createdAt: number;
  
  /** Last update timestamp */
  updatedAt: number;
  
  /** Preset ID (scope for runtime state) */
  presetId: string | null;
}

/**
 * Overlay runtime state interface.
 * 
 * This is the unified runtime state tree for overlay elements.
 * 
 * Note: This is a minimal definition for PART 3. Full definition will be in PART 1.
 */
export interface OverlayRuntimeState {
  /** Element store (Map-based) */
  elements: ElementStore;
  
  /** Selection state */
  selection: SelectionState;
  
  /** Z-order array (canonical layer stack) */
  zOrder: ZOrder;
  
  /** History state (undo/redo) */
  history: HistoryState;
  
  /** Transaction state (batch updates) */
  transactions: TransactionState;
  
  /** State metadata */
  meta: StateMetadata;
}

