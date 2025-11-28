/**
 * React Hook for OverlayStateManager — FAZ-3B-1: UI Integration
 * 
 * Provides React integration for OverlayStateManager.
 * Manages per-preset StateManager instances and reactive state updates.
 * 
 * Design Principles:
 * - Per-preset StateManager instances (Map<presetId, StateManager>)
 * - Reactive state updates via subscribe() (useSyncExternalStore pattern)
 * - Automatic cleanup on unmount
 * - State initialization from existing runtime overlay (backward compatibility)
 * - Framework-agnostic StateManager with React wrapper
 */

import { useSyncExternalStore, useEffect, useMemo, useCallback, useRef } from 'react';
import type { OverlayRuntimeState } from './types';
import { OverlayStateManager } from './stateManager';
import { createStoreFromArray } from './elementStore';
import { createInitialSelectionState } from './selection';
import * as history from './history';
import * as transactions from './transactions';
import { getElementsForPreset } from '../overlayRuntime';
// FAZ-3D: Multi-tab sync integration
import { shouldUseFaz3BRuntime } from '../../utils/featureFlags';
import {
  createStateUpdateMessage,
  mergeStates,
  deserializeStateFromSync,
  generateTabId,
  validateSyncMessage,
  SYNC_MESSAGE_VERSION,
} from './sync';

/**
 * Global cache of StateManager instances per preset.
 * This ensures a single StateManager instance per preset across component re-renders.
 */
const stateManagerCache = new Map<string | null, OverlayStateManager>();

/**
 * Global BroadcastChannel instance for multi-tab sync.
 * Shared across all preset instances.
 */
let broadcastChannel: BroadcastChannel | null = null;

/**
 * Get or create BroadcastChannel for multi-tab sync.
 * 
 * @returns BroadcastChannel instance or null if not available
 */
function getBroadcastChannel(): BroadcastChannel | null {
  // Only create if feature flag is enabled
  if (!shouldUseFaz3BRuntime()) {
    return null;
  }
  
  // Check if BroadcastChannel is available
  if (typeof BroadcastChannel === 'undefined') {
    return null;
  }
  
  // Create singleton channel if not exists
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel('nzxtesc_overlay_runtime_vnext');
    } catch (error) {
      console.warn('[OverlayStateManager] Failed to create BroadcastChannel:', error);
      return null;
    }
  }
  
  return broadcastChannel;
}

/**
 * Generate unique tab ID (singleton).
 */
let currentTabId: string | null = null;

function getCurrentTabId(): string {
  if (!currentTabId) {
    currentTabId = generateTabId();
  }
  return currentTabId;
}

/**
 * Initialize runtime state from existing overlayRuntime.ts data.
 * This is a backward compatibility helper to migrate from old runtime to new state.
 * 
 * @param presetId - Preset ID (null for no preset)
 * @returns Initial runtime state populated from existing runtime overlay
 */
function initializeFromExistingRuntime(presetId: string | null): OverlayRuntimeState {
  // Get existing elements from old runtime system
  const existingElements = getElementsForPreset(presetId);
  
  // Create element store from existing elements
  const elements = createStoreFromArray(existingElements);
  
  // Build z-order from existing elements (preserve order)
  const zOrder = existingElements.map(el => el.id);
  
  // Create initial state
  return {
    elements,
    selection: createInitialSelectionState(),
    zOrder,
    history: history.createInitialHistoryState(),
    transactions: transactions.createInitialTransactionState(),
    meta: {
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      presetId,
    },
  };
}

/**
 * Get or create StateManager instance for a preset.
 * 
 * @param presetId - Preset ID (null for no preset)
 * @returns StateManager instance
 * 
 * @internal - Exported for FAZ-3C preset export/import integration
 */
export function getStateManagerForPreset(presetId: string | null): OverlayStateManager {
  // Check cache
  if (stateManagerCache.has(presetId)) {
    return stateManagerCache.get(presetId)!;
  }
  
  // Initialize state from existing runtime (backward compatibility)
  const initialState = initializeFromExistingRuntime(presetId);
  
  // Create new StateManager
  const stateManager = new OverlayStateManager(initialState);
  
  // Cache it
  stateManagerCache.set(presetId, stateManager);
  
  return stateManager;
}

/**
 * Cleanup StateManager for a preset (when no longer needed).
 * Currently not called automatically - StateManager instances persist.
 * This is intentional for now to maintain state across component unmounts.
 * 
 * @param _presetId - Preset ID to cleanup (unused for now)
 * @internal - Intentionally unused, kept for future cleanup logic
 */
// @ts-ignore TS6133 - Intentionally unused, kept for future cleanup logic
function cleanupStateManagerForPreset(_presetId: string | null): void {
  // For now, we keep StateManager instances in cache.
  // This ensures state persistence across component unmounts.
  // Future: Could implement cleanup logic if needed (e.g., LRU cache)
}

/**
 * Hook return type.
 */
export interface UseOverlayStateManagerReturn {
  /** StateManager instance (for dispatching actions) */
  stateManager: OverlayStateManager;
  
  /** Current runtime state (reactive, updates on state changes) */
  state: OverlayRuntimeState;
  
  /** Check if state manager is available */
  isReady: boolean;
}

/**
 * React hook for OverlayStateManager.
 * 
 * Provides reactive access to overlay runtime state via OverlayStateManager.
 * State updates trigger React re-renders automatically.
 * 
 * @param activePresetId - Active preset ID (null if no preset)
 * @returns StateManager instance, current state, and ready flag
 */
export function useOverlayStateManager(
  activePresetId: string | null
): UseOverlayStateManagerReturn {
  // Get StateManager instance for this preset
  const stateManager = useMemo(
    () => getStateManagerForPreset(activePresetId),
    [activePresetId]
  );
  
  // Subscribe to state changes using useSyncExternalStore (React 18+)
  // This ensures React re-renders when state changes
  const subscribe = useCallback(
    (callback: () => void) => {
      return stateManager.subscribe(() => {
        callback();
      });
    },
    [stateManager]
  );
  
  const getSnapshot = useCallback(() => {
    return stateManager.getState();
  }, [stateManager]);
  
  const getServerSnapshot = useCallback(() => {
    // For SSR compatibility (not used in this app, but required by useSyncExternalStore)
    return stateManager.getState();
  }, [stateManager]);
  
  // Use useSyncExternalStore for reactive state
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  // FAZ-3D: Multi-tab sync integration
  const useNewRuntime = shouldUseFaz3BRuntime();
  const isBroadcastingRef = useRef(false); // Prevent broadcast loops
  
  useEffect(() => {
    if (!useNewRuntime) {
      return; // Skip sync if feature flag is disabled
    }
    
    const channel = getBroadcastChannel();
    if (!channel) {
      return; // BroadcastChannel not available
    }
    
    // Subscribe to state changes and broadcast them
    const unsubscribe = stateManager.subscribe((newState) => {
      // Prevent broadcast loops (don't broadcast if we're applying incoming sync)
      if (isBroadcastingRef.current) {
        return;
      }
      
      // Create state update message
      const message = createStateUpdateMessage(newState, getCurrentTabId());
      
      // Broadcast to other tabs
      try {
        channel.postMessage(message);
      } catch (error) {
        console.warn('[OverlayStateManager] Failed to broadcast state update:', error);
      }
    });
    
    // Listen for incoming sync messages
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = event.data;
        
        // Validate message
        if (!validateSyncMessage(message)) {
          return; // Invalid message, ignore
        }
        
        // Check message version
        if (message.version !== SYNC_MESSAGE_VERSION) {
          console.warn('[OverlayStateManager] Unsupported sync message version:', message.version);
          return;
        }
        
        // Ignore messages from self
        if (message.tabId === getCurrentTabId()) {
          return;
        }
        
        // Handle state update message
        if (message.type === 'state-update') {
          // Deserialize incoming state
          const incomingState = deserializeStateFromSync(message.state);
          
          // Merge states (conflict resolution)
          const currentState = stateManager.getState();
          const mergedState = mergeStates(
            currentState,
            incomingState,
            message.timestamp
          );
          
          // Apply merged state (set flag to prevent broadcast loop)
          isBroadcastingRef.current = true;
          try {
            stateManager.replaceState(mergedState);
          } finally {
            // Reset flag after a short delay to ensure state update completes
            setTimeout(() => {
              isBroadcastingRef.current = false;
            }, 10);
          }
        }
        
        // TODO: Handle state-sync-request and state-sync-response if needed
        // For now, we only handle state-update messages (push-based sync)
      } catch (error) {
        console.error('[OverlayStateManager] Error handling sync message:', error);
      }
    };
    
    channel.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      unsubscribe();
      channel.removeEventListener('message', handleMessage);
    };
  }, [activePresetId, stateManager, useNewRuntime]);
  
  // Cleanup on unmount (optional - we keep StateManager in cache for persistence)
  useEffect(() => {
    // For now, no cleanup (StateManager persists across unmounts)
    // This ensures state persistence when component unmounts/remounts
    // Future: Could call cleanupStateManagerForPreset() here if needed
    return () => {
      // No cleanup for now
    };
  }, [activePresetId, stateManager]);
  
  return {
    stateManager,
    state,
    isReady: true, // Always ready (StateManager is synchronous)
  };
}

