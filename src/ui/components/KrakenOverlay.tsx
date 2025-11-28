// FAZ-4-3: Legacy useOverlayConfig deleted - only vNext path remains
import { useConfig } from '../../hooks/useConfig';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import { useMonitoring } from '../../hooks/useMonitoring';
import { getActivePresetId, getPresetById } from '../../preset/storage';
import { getLCDDimensions } from '../../environment';
import { useLocalMedia } from '../../hooks/useLocalMedia';
import MediaRenderer from './MediaRenderer';
import UnifiedOverlayRenderer from './UnifiedOverlayRenderer';
import styles from '../styles/KrakenOverlay.module.css';
// FAZ-3B-4: New runtime system imports
import { useOverlayStateManager } from '../../state/overlay/useOverlayStateManager';
import { getElementsInZOrder } from '../../state/overlay/selectors';
import type { Overlay, OverlayElement } from '../../types/overlay';
import type { OverlayRuntimeState } from '../../state/overlay/types';
import { IS_DEV } from '../../utils/env';
import { importPresetToRuntimeState } from '../../preset/vNext/presetImportVNext';
import { useState, useEffect, useRef } from 'react';

/**
 * Check if current route is Kraken view (?kraken=1).
 * 
 * FAZ-4-4K: Helper to detect Kraken view for initial hydration.
 * 
 * @returns True if in Kraken view
 */
function isKrakenView(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('kraken') === '1';
  } catch {
    return false;
  }
}

/**
 * KrakenOverlay component.
 * LCD render surface for NZXT Kraken Elite.
 * 
 * FAZ-11.1: Pure viewer component - reads directly from runtime and settings.
 * - Uses UnifiedOverlayRenderer for all element types
 * - Reads media URL + settings from hooks (real-time updates)
 * - Subscribes to runtime overlay changes via useOverlayConfig
 * - Mirrors the LCD transform logic (scale, offset, align, fit)
 * - Registers window.nzxt.v1.onMonitoringDataUpdate for real monitoring data
 * - Does NOT require any props (safe for ?kraken=1 entry)
 * 
 * FAZ-4-4K: Initial hydration - loads preset into runtime state on first mount.
 * 
 * CRITICAL: This component does NOT load presets or modify settings.
 * It is a READ-ONLY viewer that reflects runtime state in real-time.
 */
export default function KrakenOverlay() {
  const { settings } = useConfig();
  const { mediaUrl } = useMediaUrl();
  const metrics = useMonitoring();
  const activePresetId = getActivePresetId();
  const localMedia = useLocalMedia({ settings, activePresetId });
  
  // FAZ-4-4D: CRITICAL FIX - Always subscribe to runtime state with stable subscription
  // Use useOverlayStateManager for reactive updates (useSyncExternalStore)
  const stateManagerHook = useOverlayStateManager(activePresetId);
  const stateManager = stateManagerHook?.stateManager ?? null;
  const reactiveState = stateManagerHook?.state ?? null;
  
  // FAZ-4-4D: Additional direct subscription for immediate updates
  // This ensures we always have the latest state even if useSyncExternalStore has timing issues
  const [overlayState, setOverlayState] = useState<OverlayRuntimeState | null>(reactiveState);
  const subscriptionRef = useRef<(() => void) | null>(null);
  
  // FAZ-4-4K: Initial hydration effect - load preset into runtime state on first mount
  // This ensures LCD shows overlays even when opened alone (without editor tab)
  const hasHydratedRef = useRef<string | null>(null); // Track which preset was hydrated
  useEffect(() => {
    // Only run in Kraken view
    if (!isKrakenView()) {
      return;
    }
    
    // Only run if we have required dependencies
    if (!activePresetId || !stateManager) {
      return;
    }
    
    // Reset hydration flag if preset changed
    if (hasHydratedRef.current !== activePresetId) {
      hasHydratedRef.current = null;
    }
    
    // Only run once per preset (idempotent)
    if (hasHydratedRef.current === activePresetId) {
      return;
    }
    
    // Get current state
    const currentState = stateManager.getState();
    
    // Only hydrate if runtime state is empty (elements.size === 0)
    // If elements already exist, state was likely initialized by editor tab or sync
    if (currentState.elements.size > 0) {
      if (IS_DEV) {
        console.debug('[KrakenOverlay] Runtime state already initialized, skipping hydration');
      }
      hasHydratedRef.current = activePresetId; // Mark as hydrated to prevent re-running
      return;
    }
    
    // Get active preset
    const preset = getPresetById(activePresetId);
    if (!preset) {
      if (IS_DEV) {
        console.debug('[KrakenOverlay] No preset found for activePresetId:', activePresetId);
      }
      hasHydratedRef.current = activePresetId; // Mark as hydrated even if no preset (prevents retries)
      return;
    }
    
    // Check if preset has overlay elements
    const presetElements = preset.preset.overlay?.elements;
    if (!presetElements || !Array.isArray(presetElements) || presetElements.length === 0) {
      if (IS_DEV) {
        console.debug('[KrakenOverlay] Preset has no overlay elements, skipping hydration');
      }
      hasHydratedRef.current = activePresetId; // Mark as hydrated (no elements to load)
      return;
    }
    
    // FAZ-4-4K: Import preset to runtime state using existing pipeline
    try {
      const importResult = importPresetToRuntimeState(preset.preset, preset.id);
      
      // Apply imported state to StateManager
      stateManager.replaceState(importResult.state);
      
      // Mark as hydrated for this preset
      hasHydratedRef.current = activePresetId;
      
      if (IS_DEV) {
        console.debug('[KrakenOverlay] Initialized runtime from preset on first mount (FAZ-4-4K)', {
          presetId: preset.id,
          elementCount: importResult.state.elements.size,
          warnings: importResult.warnings.length,
        });
        
        if (importResult.warnings.length > 0) {
          console.warn('[KrakenOverlay] Import warnings:', importResult.warnings);
        }
      }
    } catch (error) {
      // FAZ-4-4K: Graceful error handling - LCD should not crash
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('[FAZ-4-4K] Initial hydrate failed:', errorMessage);
      
      if (IS_DEV) {
        console.error('[KrakenOverlay] Full error details:', error);
      }
      
      // Mark as hydrated even on error (prevents infinite retries)
      hasHydratedRef.current = activePresetId;
    }
  }, [activePresetId, stateManager]); // Re-run if preset or manager changes
  
  // FAZ-4-4D: Stable subscription effect - always active, not gated by feature flags
  useEffect(() => {
    if (!activePresetId || !stateManager) {
      setOverlayState(null);
      return;
    }
    
    // Get initial state
    const initialState = stateManager.getState();
    setOverlayState(initialState);
    
    // Subscribe to state changes
    const unsubscribe = stateManager.subscribe((newState) => {
      setOverlayState(newState);
      // FAZ-4 FINAL: Subscription logging removed (production cleanup)
    });
    
    subscriptionRef.current = unsubscribe;
    
    // Cleanup on unmount or preset change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [activePresetId, stateManager]); // Only re-subscribe if preset or manager changes
  
  // FAZ-4-4D: Use subscribed state (overlayState) as canonical source
  // Fallback to reactiveState if subscription hasn't fired yet
  const runtimeState = overlayState ?? reactiveState;
  
  // FAZ-4-4K: Simplified fallback logic - runtime state is now canonical
  // Initial hydration effect ensures runtime state is populated from preset
  // This fallback is only for render-time safety (should rarely be needed)
  const finalElements = (() => {
    // Priority 1: Runtime state (canonical source)
    if (runtimeState && runtimeState.elements.size > 0) {
      return runtimeState.elements;
    }
    
    // Priority 2: Last resort fallback to settings.overlay.elements (render-only, doesn't modify state)
    // This should rarely be needed now that initial hydration is in place
    if (settings.overlay?.elements && Array.isArray(settings.overlay.elements) && settings.overlay.elements.length > 0) {
      // FAZ-4-4K: Convert array to Map with JSON-safe element copies (no functions)
      // This is render-only fallback, does NOT modify runtime state
      const elementsMap = new Map<string, OverlayElement>();
      for (const element of settings.overlay.elements) {
        // Create a plain object copy (removes any potential function references)
        const cleanElement: OverlayElement = {
          id: element.id,
          type: element.type,
          x: element.x,
          y: element.y,
          zIndex: element.zIndex,
          angle: element.angle,
          data: { ...element.data }, // Shallow copy of data (should be plain objects)
        };
        elementsMap.set(cleanElement.id, cleanElement);
      }
      return elementsMap;
    }
    
    // Priority 3: Empty Map
    return new Map<string, OverlayElement>();
  })();
  
  // Build overlay config from finalElements
  const overlayConfig: Overlay = (() => {
    // Use finalElements (runtime state or fallback)
    const elementsInZOrder = getElementsInZOrder(finalElements, runtimeState?.zOrder ?? []);
    return {
      mode: elementsInZOrder.length > 0 ? 'custom' : (settings.overlay?.mode || 'none'),
      elements: elementsInZOrder,
    };
  })();
  
  // FAZ-4 FINAL: Render logging removed (production cleanup)

  // Get LCD resolution using centralized environment detection
  const { width: lcdResolution } = getLCDDimensions();
  const lcdSize = lcdResolution;

  // Get background color from settings, default to #000000
  const backgroundColor = settings.backgroundColor || '#000000';

  // Effective media URL: prefer local blob when in local mode
  const effectiveMediaUrl =
    settings.sourceType === 'local' && localMedia.blobUrl
      ? localMedia.blobUrl
      : mediaUrl;

  return (
    <div
      className={styles.krakenOverlay}
      style={{
        width: `${lcdSize}px`,
        height: `${lcdSize}px`,
        background: backgroundColor,
      }}
    >
      <MediaRenderer
        url={effectiveMediaUrl}
        settings={settings}
        sourceType={settings.sourceType}
        localKind={localMedia.kind}
      />
      {/* FAZ-11.2 + FAZ-11.3: Always render overlay if elements exist, regardless of mode */}
      {/* In krakenMode, useOverlayConfig forces mode to "custom" when elements exist */}
      {/* CRITICAL: Check both mode AND elements.length to ensure overlay renders */}
      {(() => {
        const shouldRender = overlayConfig.mode !== 'none' || (overlayConfig.elements?.length ?? 0) > 0;
        
        if (!shouldRender) {
          return null;
        }
        
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            <UnifiedOverlayRenderer
              overlay={overlayConfig}
              metrics={metrics}
            />
          </div>
        );
      })()}
    </div>
  );
}
