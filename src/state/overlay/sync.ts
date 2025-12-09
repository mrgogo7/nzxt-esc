/**
 * Sync — PART 4: Multi-Tab Sync Compatibility
 * 
 * Runtime Merge Overview (High-Level)
 * - Compares current and incoming runtime state
 * - Deep-compare behavior MUST remain identical
 * - Early-return fast paths added in FAZ-6 Task 4 (micro-optimization)
 * 
 * FROZEN ZONE — DO NOT MODIFY LOGIC
 * 
 * This subsystem is behavior-locked after FAZ-6.
 * Only documentation and type-level improvements allowed.
 * 
 * - Merge logic (areStatesDifferent, mergeStates) MUST remain identical
 * - Sync broadcast decision logic MUST NOT change
 * - Hydration/serialization behavior MUST remain identical
 * 
 * Serialization, deserialization, and sync message handling for multi-tab synchronization.
 * 
 * Design Principles:
 * - Pure serialization/deserialization functions
 * - Message versioning for compatibility
 * - Conflict-free merge strategy
 * - Serializable state only
 * - No DOM/browser APIs (except BroadcastChannel message format)
 */

import type { OverlayRuntimeState } from './types';
import type { OverlayElement } from '../../types/overlay';
import { getSerializableState, deserializeState, sanitizeRuntimeState } from './runtime';
import { IS_DEV } from '../../utils/env';

/**
 * Sync message version.
 * Increment when message format changes.
 */
export const SYNC_MESSAGE_VERSION = 1;

/**
 * Sync message type discriminated union.
 */
export type SyncMessageType = 'state-update' | 'state-sync-request' | 'state-sync-response';

/**
 * Sync message base interface.
 */
export interface SyncMessageBase {
  /** Message version (for compatibility) */
  version: number;
  /** Message type */
  type: SyncMessageType;
  /** Timestamp (for conflict resolution) */
  timestamp: number;
  /** Tab ID (sender identifier) */
  tabId: string;
}

/**
 * State update message (broadcast state changes).
 */
export interface StateUpdateMessage extends SyncMessageBase {
  type: 'state-update';
  /** Serialized state (partial or full) */
  state: ReturnType<typeof getSerializableState>;
}

/**
 * State sync request message (request full state from other tabs).
 */
export interface StateSyncRequestMessage extends SyncMessageBase {
  type: 'state-sync-request';
}

/**
 * State sync response message (respond to sync request).
 */
export interface StateSyncResponseMessage extends SyncMessageBase {
  type: 'state-sync-response';
  /** Full serialized state */
  state: ReturnType<typeof getSerializableState>;
}

/**
 * Sync message union type.
 */
export type SyncMessage = StateUpdateMessage | StateSyncRequestMessage | StateSyncResponseMessage;

/**
 * Generate unique tab ID.
 * 
 * @returns Unique tab identifier
 */
export function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Serialize runtime state for sync.
 * Converts runtime state to JSON-serializable format.
 * 
 * @param state - Runtime state to serialize
 * @returns Serializable state object
 */
export function serializeStateForSync(
  state: OverlayRuntimeState
): ReturnType<typeof getSerializableState> {
  return getSerializableState(state);
}

/**
 * Deserialize runtime state from sync.
 * Reconstructs runtime state from serialized format.
 * 
 * @param serialized - Serialized state from sync
 * @returns Runtime state
 */
export function deserializeStateFromSync(
  serialized: ReturnType<typeof getSerializableState>
): OverlayRuntimeState {
  return deserializeState(serialized);
}

/**
 * Create state update message.
 * 
 * FAZ-4-4H: Enhanced with strict structuredClone validation and error reporting.
 * 
 * @param state - Runtime state to broadcast
 * @param tabId - Tab ID (sender)
 * @returns State update message
 * @throws Error if sanitized state fails structuredClone test
 */
export function createStateUpdateMessage(
  state: OverlayRuntimeState,
  tabId: string
): StateUpdateMessage {
  // FAZ-4-4H: Use sanitizeRuntimeState() directly (it includes structuredClone validation)
  const safeState = sanitizeRuntimeState(state);
  
  // FAZ-4-4H: Verify the entire message is structuredClone-safe
  const message: StateUpdateMessage = {
    version: SYNC_MESSAGE_VERSION,
    type: 'state-update',
    timestamp: Date.now(),
    tabId,
    state: safeState,
  };
  
  // FAZ-4-4H: Final structuredClone test on the complete message
  try {
    structuredClone(message);
  } catch (error) {
    // If structuredClone fails, log the offending object and throw
    console.error('[Sync] Message failed structuredClone test:', error);
    console.error('[Sync] Offending message:', message);
    console.error('[Sync] Offending state:', safeState);
    throw new Error(
      `State update message is not structuredClone-safe: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  
  return message;
}

/**
 * Create state sync request message.
 * 
 * @param tabId - Tab ID (requester)
 * @returns State sync request message
 */
export function createStateSyncRequestMessage(
  tabId: string
): StateSyncRequestMessage {
  return {
    version: SYNC_MESSAGE_VERSION,
    type: 'state-sync-request',
    timestamp: Date.now(),
    tabId,
  };
}

/**
 * Create state sync response message.
 * 
 * FAZ-4-4H: Enhanced with structuredClone validation.
 * 
 * @param state - Runtime state to send
 * @param tabId - Tab ID (responder)
 * @returns State sync response message
 * @throws Error if sanitized state fails structuredClone test
 */
export function createStateSyncResponseMessage(
  state: OverlayRuntimeState,
  tabId: string
): StateSyncResponseMessage {
  // FAZ-4-4H: Use sanitizeRuntimeState() directly (it includes structuredClone validation)
  const safeState = sanitizeRuntimeState(state);
  
  const message: StateSyncResponseMessage = {
    version: SYNC_MESSAGE_VERSION,
    type: 'state-sync-response',
    timestamp: Date.now(),
    tabId,
    state: safeState,
  };
  
  // FAZ-4-4H: Final structuredClone test on the complete message
  try {
    structuredClone(message);
  } catch (error) {
    console.error('[Sync] Sync response message failed structuredClone test:', error);
    console.error('[Sync] Offending message:', message);
    throw new Error(
      `State sync response message is not structuredClone-safe: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  
  return message;
}

/**
 * Check if element data is equal (deep comparison).
 * 
 * FAZ-4-4M: Helper to detect data-only changes.
 * 
 * @param a - First element
 * @param b - Second element
 * @returns True if element data is equal
 */
function areElementsDataEqual(a: OverlayElement, b: OverlayElement): boolean {
  if (a.type !== b.type) {
    return false;
  }
  // Safe simple approach: JSON comparison
  return JSON.stringify(a.data) === JSON.stringify(b.data);
}

/**
 * FAZ-4-POST-FIX-Z-ORDER: Helper to check if two zOrder arrays are different.
 * Handles null/undefined cases and performs element-by-element comparison.
 * 
 * @param a - First zOrder array
 * @param b - Second zOrder array
 * @returns true if arrays are different, false if identical
 */
function areZOrdersDifferent(a?: string[], b?: string[]): boolean {
  if (!a && !b) return false;
  if (!a || !b) return true;
  if (a.length !== b.length) return true;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return true;
  }
  return false;
}

/**
 * Check if two states are actually different (deep comparison of key fields).
 * 
 * FAZ-4-4M: Enhanced to explicitly check element.data for data-only changes.
 * FAZ-4-POST-FIX-Z-ORDER: Improved zOrder diff detection using areZOrdersDifferent.
 * 
 * @param currentState - Current state
 * @param incomingState - Incoming state
 * @returns True if states are different
 */
function areStatesDifferent(
  currentState: OverlayRuntimeState,
  incomingState: OverlayRuntimeState
): boolean {
  // Check element count mismatch
  if (currentState.elements.size !== incomingState.elements.size) {
    return true;
  }
  
  // Check if any elements are different (by ID, properties, or data)
  for (const [id, incomingElement] of incomingState.elements) {
    const currentElement = currentState.elements.get(id);
    if (!currentElement) {
      return true; // Element exists in incoming but not in current
    }
    
    // Compare element properties (x, y, angle, zIndex)
    if (
      currentElement.x !== incomingElement.x ||
      currentElement.y !== incomingElement.y ||
      currentElement.angle !== incomingElement.angle ||
      currentElement.zIndex !== incomingElement.zIndex
    ) {
      return true; // Element geometry/transform differs
    }
    
    // FAZ-4-4M: Explicitly check element.data (color, font, text, etc.)
    if (!areElementsDataEqual(currentElement, incomingElement)) {
      return true; // Element data differs
    }
  }
  
  // Check if any elements exist in current but not in incoming
  for (const id of currentState.elements.keys()) {
    if (!incomingState.elements.has(id)) {
      return true; // Element exists in current but not in incoming
    }
  }
  
  // Check selectedIds mismatch
  if (currentState.selection.selectedIds.size !== incomingState.selection.selectedIds.size) {
    return true;
  }
  for (const id of currentState.selection.selectedIds) {
    if (!incomingState.selection.selectedIds.has(id)) {
      return true;
    }
  }
  
  // FAZ-4-POST-FIX-Z-ORDER: Improved zOrder diff detection
  if (areZOrdersDifferent(currentState.zOrder, incomingState.zOrder)) {
    return true;
  }
  
  // States are the same
  return false;
}

/**
 * Merge states using conflict-free merge strategy.
 * 
 * FAZ-4-4I: Enhanced to always detect and apply state differences.
 * 
 * Strategy: Latest timestamp wins, but ALWAYS apply if states are different.
 * 
 * @param currentState - Current local state
 * @param incomingState - Incoming state from sync
 * @param incomingTimestamp - Timestamp of incoming state
 * @returns Merged state
 */
export function mergeStates(
  currentState: OverlayRuntimeState,
  incomingState: OverlayRuntimeState,
  incomingTimestamp: number
): OverlayRuntimeState {
  // FAZ-4-4I PATCH #2: Validate incoming state has valid meta
  if (!incomingState.meta || typeof incomingState.meta.updatedAt !== 'number') {
    if (IS_DEV) {
      console.warn('[Sync] Incoming state has invalid meta, using current state', incomingState);
    }
    return currentState;
  }
  
  // FAZ-6 / Task 4: Reference-based early return (micro-optimization)
  // If both states are the same reference, they are by definition equal
  if (currentState === incomingState) {
    return currentState;
  }
  
  // FAZ-6 / Task 4: Shallow structural fast path (micro-optimization)
  // Check if all core fields are reference-identical before expensive deep comparison
  // This covers the common case where state object identity is preserved
  if (
    currentState.elements === incomingState.elements &&
    currentState.selection === incomingState.selection &&
    currentState.zOrder === incomingState.zOrder
  ) {
    // All core structural fields are reference-identical → structural content is same
    // Still need timestamp-based merge logic for meta.updatedAt differences
    const currentTimestamp = currentState.meta?.updatedAt ?? 0;
    if (incomingTimestamp > currentTimestamp) {
      // Incoming timestamp is newer: return incoming state with updated timestamp
      return {
        ...incomingState,
        meta: {
          ...incomingState.meta,
          updatedAt: incomingTimestamp,
        },
      };
    }
    // Current state is newer or equal: keep current state (no clone needed)
    return currentState;
  }
  
  // FAZ-4-4I: Check if states are actually different (expensive deep comparison)
  const statesAreDifferent = areStatesDifferent(currentState, incomingState);
  
  // FAZ-3E PATCH #2: Defensive check for missing meta.updatedAt
  const currentTimestamp = currentState.meta?.updatedAt ?? 0;
  
  // FAZ-4-4I: ALWAYS apply incoming state if it's different, regardless of timestamp
  // This fixes the issue where LCD has empty state but incoming has elements
  if (statesAreDifferent) {
    // Always use incoming state if it's different
    return {
      ...incomingState,
      meta: {
        ...incomingState.meta,
        updatedAt: incomingTimestamp,
      },
    };
  }
  
    // States are the same - use timestamp-based merge
    if (incomingTimestamp > currentTimestamp) {
      // Incoming state is newer: use incoming state
      return {
      ...incomingState,
      meta: {
        ...incomingState.meta,
        updatedAt: incomingTimestamp,
      },
    };
  }
  
  // Current state is newer or equal: keep current state
  return currentState;
}

/**
 * Validate sync message.
 * 
 * FAZ-3E PATCH #2: Enhanced validation with better error reporting.
 * 
 * @param message - Message to validate
 * @returns True if message is valid
 */
export function validateSyncMessage(message: unknown): message is SyncMessage {
  if (!message || typeof message !== 'object') {
    if (IS_DEV) {
      console.warn('[Sync] Invalid message: not an object', message);
    }
    return false;
  }
  
  const msg = message as Partial<SyncMessage>;
  
  // Check required fields
  if (typeof msg.version !== 'number') {
    if (IS_DEV) {
      console.warn('[Sync] Invalid message: missing or invalid version field', msg);
    }
    return false;
  }
  
  if (typeof msg.type !== 'string') {
    if (IS_DEV) {
      console.warn('[Sync] Invalid message: missing or invalid type field', msg);
    }
    return false;
  }
  
  if (!['state-update', 'state-sync-request', 'state-sync-response'].includes(msg.type)) {
    if (IS_DEV) {
      console.warn('[Sync] Invalid message: unknown type', msg.type);
    }
    return false;
  }
  
  if (typeof msg.timestamp !== 'number' || isNaN(msg.timestamp)) {
    if (IS_DEV) {
      console.warn('[Sync] Invalid message: missing or invalid timestamp', msg);
    }
    return false;
  }
  
  if (typeof msg.tabId !== 'string' || !msg.tabId) {
    if (IS_DEV) {
      console.warn('[Sync] Invalid message: missing or invalid tabId', msg);
    }
    return false;
  }
  
  // Type-specific validation
  if (msg.type === 'state-update' || msg.type === 'state-sync-response') {
    if (!msg.state || typeof msg.state !== 'object') {
      if (IS_DEV) {
        console.warn('[Sync] Invalid message: missing or invalid state field', msg);
      }
      return false;
    }
  }
  
  return true;
}

/**
 * Check if message version is compatible.
 * 
 * FAZ-3E: Enhanced with version mismatch warning for dev mode.
 * 
 * @param messageVersion - Message version
 * @returns True if version is compatible
 */
export function isMessageVersionCompatible(messageVersion: number): boolean {
  const isCompatible = messageVersion === SYNC_MESSAGE_VERSION;
  
  // FAZ-3E: Dev mode warning for version mismatch
  if (!isCompatible && IS_DEV) {
    console.warn(
      `[Sync] Message version mismatch: received v${messageVersion}, expected v${SYNC_MESSAGE_VERSION}. ` +
      `Message will be ignored. This may indicate a deployment mismatch between tabs.`
    );
  }
  
  // For now, only exact version match is compatible
  // Future: support version ranges or migration
  return isCompatible;
}

/**
 * Handle sync message (pure function, no side effects).
 * Returns updated state if message should be applied, or null if ignored.
 * 
 * @param currentState - Current local state
 * @param message - Sync message to handle
 * @param localTabId - Local tab ID (to ignore own messages)
 * @returns Updated state or null if message should be ignored
 */
export function handleSyncMessage(
  currentState: OverlayRuntimeState,
  message: SyncMessage,
  localTabId: string
): OverlayRuntimeState | null {
  // Ignore own messages
  if (message.tabId === localTabId) {
    if (IS_DEV) {
      console.debug('[Sync] Ignoring own message (tabId match)');
    }
    return null;
  }
  
  // Check version compatibility
  if (!isMessageVersionCompatible(message.version)) {
    // Incompatible version: ignore message
    // Warning already logged in isMessageVersionCompatible for dev mode
    // Future: attempt migration or request sync
    return null;
  }
  
  try {
    switch (message.type) {
      case 'state-update':
        // Merge incoming state update
        const incomingState = deserializeStateFromSync(message.state);
        return mergeStates(currentState, incomingState, message.timestamp);
      
      case 'state-sync-request':
        // Request received: respond with current state
        // (Response is handled by sync coordinator, not here)
        return null; // No state change, just a request
      
      case 'state-sync-response':
        // Sync response received: merge if newer
        const responseState = deserializeStateFromSync(message.state);
        return mergeStates(currentState, responseState, message.timestamp);
      
      default:
        if (IS_DEV) {
          const unknownMessage = message as { type?: unknown };
          console.warn('[Sync] Unknown message type:', unknownMessage.type);
        }
        return null;
    }
  } catch (error) {
    // FAZ-3E PATCH #2: Better error handling for deserialization failures
    if (IS_DEV) {
      console.error('[Sync] Error handling sync message:', error, message);
    }
    return null; // Fail safe: ignore message on error
  }
}

