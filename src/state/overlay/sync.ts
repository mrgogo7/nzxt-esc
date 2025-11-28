/**
 * Sync — PART 4: Multi-Tab Sync Compatibility
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
import { getSerializableState, deserializeState } from './runtime';

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
 * @param state - Runtime state to broadcast
 * @param tabId - Tab ID (sender)
 * @returns State update message
 */
export function createStateUpdateMessage(
  state: OverlayRuntimeState,
  tabId: string
): StateUpdateMessage {
  return {
    version: SYNC_MESSAGE_VERSION,
    type: 'state-update',
    timestamp: Date.now(),
    tabId,
    state: serializeStateForSync(state),
  };
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
 * @param state - Runtime state to send
 * @param tabId - Tab ID (responder)
 * @returns State sync response message
 */
export function createStateSyncResponseMessage(
  state: OverlayRuntimeState,
  tabId: string
): StateSyncResponseMessage {
  return {
    version: SYNC_MESSAGE_VERSION,
    type: 'state-sync-response',
    timestamp: Date.now(),
    tabId,
    state: serializeStateForSync(state),
  };
}

/**
 * Merge states using conflict-free merge strategy.
 * 
 * Strategy: Latest timestamp wins (simple last-write-wins).
 * For more sophisticated merging, use timestamp + operation-based merging.
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
  // Simple merge strategy: latest timestamp wins
  // More sophisticated strategies (operation-based merging) can be added later
  
  const currentTimestamp = currentState.meta.updatedAt;
  
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
 * @param message - Message to validate
 * @returns True if message is valid
 */
export function validateSyncMessage(message: unknown): message is SyncMessage {
  if (!message || typeof message !== 'object') {
    return false;
  }
  
  const msg = message as Partial<SyncMessage>;
  
  // Check required fields
  if (typeof msg.version !== 'number') {
    return false;
  }
  
  if (typeof msg.type !== 'string') {
    return false;
  }
  
  if (!['state-update', 'state-sync-request', 'state-sync-response'].includes(msg.type)) {
    return false;
  }
  
  if (typeof msg.timestamp !== 'number') {
    return false;
  }
  
  if (typeof msg.tabId !== 'string') {
    return false;
  }
  
  // Type-specific validation
  if (msg.type === 'state-update' || msg.type === 'state-sync-response') {
    if (!msg.state || typeof msg.state !== 'object') {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if message version is compatible.
 * 
 * @param messageVersion - Message version
 * @returns True if version is compatible
 */
export function isMessageVersionCompatible(messageVersion: number): boolean {
  // For now, only exact version match is compatible
  // Future: support version ranges or migration
  return messageVersion === SYNC_MESSAGE_VERSION;
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
    return null;
  }
  
  // Check version compatibility
  if (!isMessageVersionCompatible(message.version)) {
    // Incompatible version: ignore message
    // Future: attempt migration or request sync
    return null;
  }
  
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
      return null;
  }
}

