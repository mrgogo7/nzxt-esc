/**
 * Overlay State — PART 2, PART 3 & PART 4: Unified Runtime State System
 * 
 * Main entry point for overlay state subsystems.
 * 
 * PART 2 exports:
 * - Element Store functions (elementStore.ts)
 * - Selection State functions (selection.ts)
 * - Z-Order functions (zOrder.ts)
 * - Selector functions (selectors.ts)
 * 
 * PART 3 exports:
 * - Action model (actions.ts)
 * - History system (history.ts)
 * - Transaction system (transactions.ts)
 * - State manager (stateManager.ts)
 * 
 * PART 4 exports:
 * - Runtime integration (runtime.ts)
 * - Validation system (validation.ts)
 * - Multi-tab sync (sync.ts)
 * - Development tools (devtools.ts)
 * 
 * Design Principles:
 * - Pure functions only (no mutations, no side effects)
 * - Immutable updates (return new state)
 * - Derived values NOT stored (computed on-demand via selectors)
 * - Framework-agnostic (no React dependencies)
 * - Undo/redo compatible (deterministic, replay-safe)
 * - Serializable state (multi-tab sync compatible)
 */

// Element Store exports
export {
  type ElementStore,
  addElement,
  updateElement,
  removeElement,
  replaceMany,
  getElement as getElementFromStore,
  hasElement,
  getElementIds,
  getAllElements as getAllElementsFromStore,
  getElementCount,
  createEmptyStore,
  createStoreFromArray,
} from './elementStore';

// Selection State exports
export {
  type SelectionState,
  type ModifierKeys,
  createInitialSelectionState,
  selectElement,
  deselectAll,
  addToSelection,
  removeFromSelection,
  toggleSelection,
  selectElements,
  selectRange,
  handleSelection,
  isSelected,
  isSingleSelection,
  isMultiSelection,
  isEmptySelection,
  getSelectionCount,
} from './selection';

// Z-Order exports
export {
  type ZOrder,
  createInitialZOrder,
  addToZOrder,
  removeFromZOrder,
  removeManyFromZOrder,
  bringToFront,
  sendToBack,
  moveForward,
  moveBackward,
  reorder,
  bringToFrontMulti,
  sendToBackMulti,
  getZOrderIndex,
  validateZOrder,
  filterValidZOrder,
} from './zOrder';

// Selector exports
export {
  getElement,
  isSelected as isElementSelected,
  getSelectedElements,
  getCombinedAABB,
  getElementAABB,
  getElementDimensions,
  getAllElements,
  getElementsInZOrder,
  getSelectedElement,
} from './selectors';

// Type exports (PART 3)
export type {
  HistoryState,
  TransactionState,
  StateMetadata,
  OverlayRuntimeState,
} from './types';

// Action exports (PART 3)
export {
  type Action,
  type ActionType,
  type ActionData,
  type AddElementActionData,
  type RemoveElementActionData,
  type UpdateElementActionData,
  type TransformActionData,
  type SelectActionData,
  type ZOrderActionData,
  type BatchActionData,
  generateActionId,
  createAddElementAction,
  createRemoveElementAction,
  createUpdateElementAction,
  createTransformAction,
  createSelectAction,
  createZOrderAction,
  createBatchAction,
  validateAction,
} from './actions';

// History exports (PART 3)
export {
  DEFAULT_HISTORY_LIMIT,
  createInitialHistoryState,
  applyAction,
  undo,
  redo,
  pushHistory,
  canUndo,
  canRedo,
  replayActions,
  clearHistory,
  getHistorySize,
  setHistoryLimit,
} from './history';

// Transaction exports (PART 3)
export {
  createInitialTransactionState,
  startTransaction,
  addToTransaction,
  commitTransaction,
  rollbackTransaction,
  isTransactionActive,
  getBatchActions,
  canRollbackTransaction,
  getBatchSize,
} from './transactions';

// State Manager exports (PART 3)
export {
  OverlayStateManager,
  type StateChangeListener,
} from './stateManager';

// Runtime exports (PART 4)
export {
  initializeRuntimeState,
  resetState,
  applyPresetImport,
  exportPresetFromState,
  getSerializableState,
  deserializeState,
} from './runtime';

// Validation exports (PART 4)
export {
  type ValidationError,
  validateState,
  ensureStateConsistency,
} from './validation';

// Sync exports (PART 4)
export {
  SYNC_MESSAGE_VERSION,
  type SyncMessage,
  type SyncMessageType,
  type StateUpdateMessage,
  type StateSyncRequestMessage,
  type StateSyncResponseMessage,
  generateTabId,
  serializeStateForSync,
  deserializeStateFromSync,
  createStateUpdateMessage,
  createStateSyncRequestMessage,
  createStateSyncResponseMessage,
  mergeStates,
  validateSyncMessage,
  isMessageVersionCompatible,
  handleSyncMessage,
} from './sync';

// DevTools exports (PART 4 - Development Only)
export {
  type StateReport,
  generateStateReport,
  diagnoseState,
  prettyPrintState,
  diffState,
} from './devtools';

