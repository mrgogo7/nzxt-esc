/**
 * Runtime Overlay Broadcast Channel
 * 
 * FAZ-11.5: Cross-tab real-time sync for overlay runtime changes.
 * 
 * Uses BroadcastChannel API to synchronize overlay element changes across browser tabs.
 * This allows the Kraken LCD view (?kraken=1) to see real-time overlay updates
 * from the editor tab without requiring autosave or preset reloads.
 * 
 * Architecture:
 * - Editor tab: broadcasts runtime changes after mutations
 * - Kraken tab: receives broadcasts and updates local runtime Map
 * - No writes to storage, no autosave triggers
 * - Pure read-only sync for Kraken view
 */

import type { OverlayElement } from '../types/overlay';

/**
 * BroadcastChannel instance for overlay runtime sync.
 * Channel name must be consistent across all tabs.
 */
let broadcastChannel: BroadcastChannel | null = null;

/**
 * Initialize BroadcastChannel if available.
 * Falls back gracefully if BroadcastChannel is not supported.
 */
function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') {
    return null; // SSR safety
  }

  if (!broadcastChannel) {
    try {
      // Check if BroadcastChannel is available
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('nzxtesc_overlay_runtime');
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  return broadcastChannel;
}

/**
 * Message format for runtime updates.
 */
interface RuntimeUpdateMessage {
  type: 'runtime_update';
  presetId: string;
  elements: OverlayElement[];
  timestamp: number;
}

/**
 * Send runtime update to all other tabs.
 * 
 * @param presetId - Preset ID that was modified
 * @param elements - Current overlay elements for the preset (deep cloned)
 */
export function sendRuntimeUpdate(presetId: string, elements: OverlayElement[]): void {
  const channel = getBroadcastChannel();
  if (!channel) {
    return; // BroadcastChannel not available
  }

  try {
    // Deep clone elements to prevent mutations
    const clonedElements = elements.map(el => ({
      ...el,
      data: { ...el.data }, // Shallow clone data object
    }));

    const message: RuntimeUpdateMessage = {
      type: 'runtime_update',
      presetId,
      elements: clonedElements,
      timestamp: Date.now(),
    };

    channel.postMessage(message);
  } catch {
    // Silently handle send errors
  }
}

/**
 * Callback type for runtime update messages.
 */
export type RuntimeUpdateCallback = (presetId: string, elements: OverlayElement[]) => void;

/**
 * Subscribe to runtime updates from other tabs.
 * 
 * @param callback - Function called when runtime update is received
 * @returns Unsubscribe function
 */
export function subscribeRuntimeUpdates(callback: RuntimeUpdateCallback): () => void {
  const channel = getBroadcastChannel();
  if (!channel) {
    // Return no-op unsubscribe if BroadcastChannel not available
    return () => {};
  }

  const handleMessage = (event: MessageEvent) => {
    try {
      const message = event.data as RuntimeUpdateMessage;
      
      // Validate message format
      if (message && message.type === 'runtime_update' && message.presetId && Array.isArray(message.elements)) {
        callback(message.presetId, message.elements);
      }
    } catch {
      // Silently handle message errors
    }
  };

  channel.addEventListener('message', handleMessage);

  // Return unsubscribe function
  return () => {
    channel.removeEventListener('message', handleMessage);
  };
}

/**
 * Close BroadcastChannel (cleanup).
 * Should be called when app unmounts (optional, browser handles cleanup).
 */
export function closeBroadcastChannel(): void {
  if (broadcastChannel) {
    try {
      broadcastChannel.close();
      broadcastChannel = null;
    } catch {
      // Silently handle close errors
    }
  }
}

