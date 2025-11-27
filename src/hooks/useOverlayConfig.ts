import { useState, useEffect, useMemo } from 'react';
import { DEFAULT_OVERLAY, type Overlay } from '../types/overlay';
import type { AppSettings } from '../constants/defaults';
import { getElementsForPreset, subscribeRuntimeChange, setElementsForPresetSilent } from '@/state/overlayRuntime';
import { isNZXTCAM } from '../environment';
import { getPresetById, getActivePresetId } from '../preset/storage';
import type { OverlayElement } from '../types/overlay';
import { subscribeRuntimeUpdates } from '@/state/runtimeBroadcast';

/**
 * Hook for computing overlay configuration from settings.
 * 
 * ARCHITECT MODE: overlay.elements are ONLY sourced from runtime overlay Map.
 * - Returns new Overlay model (mode: "none" | "custom", elements[])
 * - Overlay mode comes from settings.overlay.mode
 * - Overlay elements come ONLY from runtime overlay Map (per-preset)
 * - settings.overlay.elements is IGNORED (always empty)
 * - Runtime elements are scoped per preset (each preset has its own overlay state)
 * 
 * FAZ-11.1: In krakenMode (?kraken=1), this hook provides fast-path real-time updates
 * with no debounce or preset sync delays. LCD view subscribes directly to runtime changes.
 * 
 * @param settings - Current app settings (only overlay.mode is used)
 * @param activePresetId - Active preset ID (null if no preset is active)
 * @returns Computed overlay configuration (always Overlay type) with runtime elements
 */
export function useOverlayConfig(settings: AppSettings, activePresetId: string | null): Overlay {
  // FAZ-11.1: Detect kraken mode for fast-path real-time updates
  const krakenMode = isNZXTCAM();
  
  // FAZ-11.4: Determine effective presetId (fallback to getActivePresetId if null)
  const effectivePresetId = activePresetId || getActivePresetId();
  
  // FAZ-11.3 + FAZ-11.4: DIAGNOSTIC DEBUG LOGGING (guarded)
  // Get overlay mode from settings (persists across preset switches)
  const overlayMode = settings?.overlay?.mode || 'none';
  const presetOverlayMode = (overlayMode === 'none' || overlayMode === 'custom') ? overlayMode : 'none';
  
  // CRITICAL: Track runtime elements state to force re-render when runtime changes
  const [runtimeElements, setRuntimeElements] = useState(() => {
    return getElementsForPreset(effectivePresetId);
  });
  
  // Subscribe to runtime overlay changes
  // FAZ-11.1: In krakenMode, this provides immediate real-time updates with no debounce
  // FAZ-11.3: Enhanced subscription - also listens to null presetId changes and forces refresh
  // FAZ-11.5: In krakenMode, also subscribe to BroadcastChannel for cross-tab sync
  useEffect(() => {
    // Update on mount and when effectivePresetId changes
    const currentElements = getElementsForPreset(effectivePresetId);
    setRuntimeElements(currentElements);
    
    // Subscribe to runtime overlay changes (same-tab)
    function handleRuntimeChange(changedPresetId: string | null) {
      // FAZ-11.3: In krakenMode, update for ANY change (not just active preset)
      // This ensures LCD view updates even if presetId changes or is null
      if (krakenMode) {
        const newElements = getElementsForPreset(effectivePresetId);
        setRuntimeElements(newElements);
      } else {
        // Only update if the change is for the active preset (normal mode)
        if (changedPresetId === effectivePresetId) {
          const newElements = getElementsForPreset(effectivePresetId);
          setRuntimeElements(newElements);
        }
      }
    }
    
    const unsubscribeLocal = subscribeRuntimeChange(handleRuntimeChange);
    
    // FAZ-11.5: Subscribe to BroadcastChannel for cross-tab sync (krakenMode only)
    let unsubscribeBroadcast: (() => void) | null = null;
    if (krakenMode) {
      unsubscribeBroadcast = subscribeRuntimeUpdates((presetId: string, elements: OverlayElement[]) => {
        // Only update if the broadcast is for the active preset
        if (presetId === effectivePresetId) {
          // FAZ-11.5: Update local runtime Map silently (no broadcast loop)
          // Use silent update function to prevent triggering notifyRuntimeChange
          // which would cause another broadcast and create a loop
          setElementsForPresetSilent(presetId, elements);
          
          // Update React state to trigger re-render
          setRuntimeElements(elements);
        }
      });
    }
    
    return () => {
      unsubscribeLocal();
      if (unsubscribeBroadcast) {
        unsubscribeBroadcast();
      }
    };
  }, [effectivePresetId, krakenMode]);
  
  // CRITICAL: Always return a valid Overlay object
  // Formula: overlayConfig = { mode: settings.overlay.mode, elements: runtimeOverlay[activePresetId] }
  // FAZ-11.2: In krakenMode, if runtime has elements, force mode to "custom" (never "none")
  // FAZ-11.4: In krakenMode, if runtime is empty, fallback to preset storage overlay.elements
  const overlayConfig = useMemo(() => {
    // DEFENSIVE: Ensure runtimeElements is always an array
    const runtimeElementsArray = Array.isArray(runtimeElements) ? runtimeElements : [];
    
    // FAZ-11.4: Read stored elements from preset storage (fallback for Kraken view)
    let storedElements: OverlayElement[] = [];
    const storedPreset = effectivePresetId ? getPresetById(effectivePresetId) : null;
    
    if (storedPreset?.preset?.overlay?.elements && Array.isArray(storedPreset.preset.overlay.elements)) {
      storedElements = storedPreset.preset.overlay.elements;
    }
    
    // FAZ-11.4: Compute final elements - runtime first, fallback to storage in krakenMode
    let finalElements = runtimeElementsArray;
    if (krakenMode && (!finalElements || finalElements.length === 0) && storedElements.length > 0) {
      // FAZ-11.4: Kraken view fallback to storage overlay
      finalElements = storedElements;
    }

    // FAZ-11.2 + FAZ-11.4: In krakenMode, mode must reflect runtime/storage state
    // If we have elements (from runtime or storage), mode must be "custom" (never "none")
    let finalMode = presetOverlayMode;
    if (krakenMode) {
      if (finalElements && finalElements.length > 0) {
        finalMode = 'custom';
      } else {
        // If no elements, use mode from settings (could be "none")
        finalMode = presetOverlayMode;
      }
    }

    const result: Overlay = {
      mode: finalMode, // From settings (or forced to "custom" in krakenMode if elements exist)
      elements: finalElements, // From runtime (or storage fallback in krakenMode)
    };
    
    // DEFENSIVE: Final validation - ensure result is always valid
    if (!result || typeof result !== 'object' || !Array.isArray(result.elements)) {
      return DEFAULT_OVERLAY;
    }

    return result;
  }, [presetOverlayMode, runtimeElements, krakenMode]);

  // CRITICAL: Final safety check - never return null/undefined
  if (!overlayConfig || typeof overlayConfig !== 'object') {
    return DEFAULT_OVERLAY;
  }

  return overlayConfig;
}

