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
import { IS_DEV } from '../../utils/env';
import { devError, devDebug } from '../../debug/dev';
import {
  createStateUpdateMessage,
  createStateSyncRequestMessage,
  createStateSyncResponseMessage,
  mergeStates,
  deserializeStateFromSync,
  generateTabId,
  validateSyncMessage,
  isMessageVersionCompatible,
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
  // FAZ-4 FINAL: Runtime always enabled - check if BroadcastChannel is available
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
 * Check if current route is Kraken view (?kraken=1).
 * 
 * FAZ-4-4M: Helper to detect Kraken view for always-accept-remote rule.
 * 
 * @returns True if in Kraken view
 */
function isKrakenView(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.location.search.includes('kraken=1');
  } catch {
    return false;
  }
}

/**
 * Initialize runtime state (FAZ-4-3: Legacy runtime deleted, returns empty state).
 * State will be populated when presets are imported/applied via importPresetToRuntimeState.
 * 
 * @param presetId - Preset ID (null for no preset)
 * @returns Initial empty runtime state
 */
function initializeFromExistingRuntime(presetId: string | null): OverlayRuntimeState {
  // State will be populated when presets are imported/applied
  return {
    elements: createStoreFromArray([]),
    selection: createInitialSelectionState(),
    zOrder: [],
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
  
  // FAZ-4 FINAL: Runtime is always enabled (legacy removed)
  const isBroadcastingRef = useRef(false); // Prevent broadcast loops
  const hasRequestedInitialSyncRef = useRef(false); // Track if initial sync was requested
  const lastBroadcastStateRef = useRef<string | null>(null); // FAZ-4 FINAL: Prevent duplicate broadcasts
  
  useEffect(() => {
    const channel = getBroadcastChannel();
    if (!channel) {
      return; // BroadcastChannel not available
    }
    
    // FAZ-4-4I: Initial sync - request full state when hook mounts
    // This ensures LCD receives state immediately on open
    if (!hasRequestedInitialSyncRef.current) {
      hasRequestedInitialSyncRef.current = true;
      const currentState = stateManager.getState();
      
      // Only request sync if local state is empty (LCD scenario)
      // Preview/editor tabs with state will respond to requests
      if (currentState.elements.size === 0) {
        const syncRequest = createStateSyncRequestMessage(getCurrentTabId());
        try {
          channel.postMessage(syncRequest);
          if (IS_DEV) {
            devDebug('OverlaySync', 'Initial sync request sent');
          }
        } catch (error) {
          console.warn('[OverlayStateManager] Failed to send initial sync request:', error);
        }
      }
    }
    
    // Subscribe to state changes and broadcast them
    // FAZ-4-4I: Broadcast on EVERY state change, including during transactions
    const unsubscribe = stateManager.subscribe((newState) => {
      // FAZ-3E: Anti-echo loop protection - prevent broadcast if we're applying incoming sync
      if (isBroadcastingRef.current) {
        // FAZ-4 FINAL: Dev mode logging only
        if (IS_DEV) {
          devDebug('OverlaySync', 'Broadcast suppressed (preventing echo loop)');
        }
        return;
      }
      
      // FAZ-4 FINAL: Prevent duplicate broadcasts (same state content)
      const stateFingerprint = JSON.stringify({
        elements: newState.elements.size,
        zOrder: newState.zOrder.join(','),
        selection: Array.from(newState.selection.selectedIds).join(','),
        meta: newState.meta.updatedAt,
      });
      if (lastBroadcastStateRef.current === stateFingerprint) {
        // Same state - skip broadcast
        if (IS_DEV) {
          devDebug('OverlaySync', 'Duplicate state detected, skipping broadcast');
        }
        return;
      }
      lastBroadcastStateRef.current = stateFingerprint;
      
      // FAZ-4-4I: Always broadcast state changes, even during transactions
      // This ensures drag/move/rotate operations broadcast in real-time
      
      // Create state update message
      const message = createStateUpdateMessage(newState, getCurrentTabId());
      
      // FAZ-4-4H: Final structuredClone gate before BroadcastChannel postMessage
      // This is the last safety check - if this fails, log and skip broadcast (don't crash)
      try {
        // Test cloneability of the complete message
        structuredClone(message);
      } catch (cloneError) {
        // If structuredClone fails, log the failing payload and skip broadcast
        console.error('[OverlayStateManager] Final structuredClone gate failed:', cloneError);
        if (IS_DEV) {
          devError('OverlaySync', 'Failing payload', { payload: message, state: message.state });
        }
        // Skip broadcast but DO NOT crash (avoids infinite error loops)
        return;
      }
      
      // Broadcast to other tabs
      try {
        channel.postMessage(message);
        
        // FAZ-4 FINAL: Broadcast logging removed (production cleanup)
      } catch (error) {
        console.warn('[OverlayStateManager] Failed to broadcast state update:', error);
        
        // FAZ-3E: Enhanced error logging for dev mode
        if (IS_DEV) {
          devError('OverlaySync', 'Broadcast error details', {
            error,
            state: {
              elements: newState.elements.size,
              zOrder: newState.zOrder.length,
            },
          });
        }
      }
    });
    
    // Listen for incoming sync messages
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = event.data;
        
        // FAZ-4 FINAL: Sync event logging removed (production cleanup)
        
        // Validate message
        if (!validateSyncMessage(message)) {
          // FAZ-3E: Dev mode logging for invalid messages
          if (IS_DEV) {
            console.warn('[Sync] Invalid message format, ignoring:', message);
          }
          return; // Invalid message, ignore
        }
        
        // Check message version (with enhanced warning)
        if (!isMessageVersionCompatible(message.version)) {
          // Warning already logged in isMessageVersionCompatible for dev mode
          return;
        }
        
        // Ignore messages from self (anti-echo loop protection)
        if (message.tabId === getCurrentTabId()) {
          // FAZ-4 FINAL: Self-message logging removed (production cleanup)
          return;
        }
        
        // FAZ-4-4I: Handle state-sync-request (LCD requests initial state)
        if (message.type === 'state-sync-request') {
          // Respond with current state
          const currentState = stateManager.getState();
          // Only respond if we have state to share (preview/editor tab)
          if (currentState.elements.size > 0) {
            const syncResponse = createStateSyncResponseMessage(currentState, getCurrentTabId());
            try {
              channel.postMessage(syncResponse);
              if (IS_DEV) {
                devDebug('OverlaySync', 'State sync response sent', {
                  elements: currentState.elements.size,
                });
              }
            } catch (error) {
              console.warn('[OverlayStateManager] Failed to send sync response:', error);
            }
          }
          return; // No state change from request
        }
        
        // FAZ-4-4I: Handle state-sync-response (initial state received)
        if (message.type === 'state-sync-response') {
          // Deserialize incoming state
          const incomingState = deserializeStateFromSync(message.state);
          
          // Apply incoming state directly (this is initial sync, no merge needed)
          isBroadcastingRef.current = true;
          try {
            stateManager.replaceState(incomingState);
            if (IS_DEV) {
              devDebug('OverlaySync', 'Initial state received and applied', {
                elements: incomingState.elements.size,
                zOrder: incomingState.zOrder.length,
              });
            }
          } finally {
            setTimeout(() => {
              isBroadcastingRef.current = false;
            }, 50);
          }
          return; // Initial sync complete
        }
        
        // Handle state update message
        if (message.type === 'state-update') {
          // Deserialize incoming state
          const incomingState = deserializeStateFromSync(message.state);
          
          // FAZ-4-4M: Kraken view always accepts remote state as truth (no merge heuristics)
          const krakenView = isKrakenView();
          if (krakenView) {
            if (IS_DEV) {
              devDebug('OverlaySync', 'Applying remote state as canonical source (Kraken view)', {
                tabId: message.tabId,
                timestamp: message.timestamp,
                elements: incomingState.elements.size,
              });
            }
            
            // Replace local runtime state directly (no merge, no equality check)
            isBroadcastingRef.current = true;
            try {
              stateManager.replaceState(incomingState);
            } finally {
              setTimeout(() => {
                isBroadcastingRef.current = false;
              }, 50);
            }
            return; // Kraken view: always accept remote, skip merge logic
          }
          
          // Editor view: Use merge logic with data-aware equality check
          const currentState = stateManager.getState();
          const mergedState = mergeStates(
            currentState,
            incomingState,
            message.timestamp
          );
          
          // FAZ-4-4M: Data-aware state change detection
          // Check if merged state is actually different from current, including element.data
          const stateChanged = 
            mergedState.elements.size !== currentState.elements.size ||
            mergedState.zOrder.length !== currentState.zOrder.length ||
            mergedState.selection.selectedIds.size !== currentState.selection.selectedIds.size ||
            // Deep check: compare element IDs, positions, AND data
            (() => {
              let geometryChanged = false;
              let dataChanged = false;
              
              // Check if any elements differ
              for (const [id, mergedElement] of mergedState.elements) {
                const currentElement = currentState.elements.get(id);
                if (!currentElement) {
                  return true; // New element
                }
                
                // Check geometry (position/transform)
                if (
                  currentElement.x !== mergedElement.x ||
                  currentElement.y !== mergedElement.y ||
                  currentElement.angle !== mergedElement.angle ||
                  currentElement.zIndex !== mergedElement.zIndex
                ) {
                  geometryChanged = true;
                }
                
                // FAZ-4-4M: Check element.data (color, font, text, etc.)
                if (JSON.stringify(currentElement.data) !== JSON.stringify(mergedElement.data)) {
                  dataChanged = true;
                }
              }
              
              // Check if any elements were removed
              for (const id of currentState.elements.keys()) {
                if (!mergedState.elements.has(id)) {
                  return true; // Element removed
                }
              }
              
              // FAZ-4-4M: Log data-only changes for debugging
              if (IS_DEV && !geometryChanged && dataChanged) {
                devDebug('OverlaySync', 'Data-only change detected (element.data). Forcing replaceState.');
              }
              
              return geometryChanged || dataChanged;
            })();
          
          if (!stateChanged) {
            // FAZ-4-4M: States are the same - no need to apply
            if (IS_DEV) {
              devDebug('OverlaySync', 'Merge resulted in no state change, skipping replaceState');
            }
            return; // No change, skip replaceState
          }
          
          // Apply merged state (set flag to prevent broadcast loop)
          isBroadcastingRef.current = true;
          try {
            stateManager.replaceState(mergedState);
            
            // FAZ-4 FINAL: Merge logging removed (production cleanup)
          } finally {
            // Reset flag after a short delay to ensure state update completes
            // FAZ-3E: Increased delay slightly for better loop prevention (10ms -> 50ms)
            setTimeout(() => {
              isBroadcastingRef.current = false;
            }, 50);
          }
        }
      } catch (error) {
        console.error('[OverlayStateManager] Error handling sync message:', error);
        
        // FAZ-3E: Enhanced error logging for dev mode
        if (IS_DEV) {
          devError('OverlaySync', 'Full error details', {
            error,
            message: event.data,
          });
        }
      }
    };
    
    channel.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      unsubscribe();
      channel.removeEventListener('message', handleMessage);
      // Reset initial sync flag on cleanup (allows re-request on remount)
      hasRequestedInitialSyncRef.current = false;
      lastBroadcastStateRef.current = null; // FAZ-4 FINAL: Reset duplicate check
    };
  }, [activePresetId, stateManager]);
  
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

