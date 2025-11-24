import { useState, useEffect, useMemo } from 'react';
import { DEFAULT_OVERLAY, type Overlay } from '../types/overlay';
import type { AppSettings } from '../constants/defaults';
import { getElementsForPreset, subscribeRuntimeChange } from '@/state/overlayRuntime';

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
 * @param settings - Current app settings (only overlay.mode is used)
 * @param activePresetId - Active preset ID (null if no preset is active)
 * @returns Computed overlay configuration (always Overlay type) with runtime elements
 */
export function useOverlayConfig(settings: AppSettings, activePresetId: string | null): Overlay {
  // Get overlay mode from settings (persists across preset switches)
  const overlayMode = settings?.overlay?.mode || 'none';
  const presetOverlayMode = (overlayMode === 'none' || overlayMode === 'custom') ? overlayMode : 'none';
  
  // CRITICAL: Track runtime elements state to force re-render when runtime changes
  const [runtimeElements, setRuntimeElements] = useState(() => {
    return getElementsForPreset(activePresetId);
  });
  
  // Subscribe to runtime overlay changes
  useEffect(() => {
    // Update on mount and when activePresetId changes
    const currentElements = getElementsForPreset(activePresetId);
    setRuntimeElements(currentElements);
    
    // Subscribe to runtime overlay changes
    function handleRuntimeChange(changedPresetId: string | null) {
      // Only update if the change is for the active preset
      if (changedPresetId === activePresetId) {
        const newElements = getElementsForPreset(activePresetId);
        setRuntimeElements(newElements);
      }
    }
    
    const unsubscribe = subscribeRuntimeChange(handleRuntimeChange);
    
    return () => {
      unsubscribe();
    };
  }, [activePresetId]);
  
  // CRITICAL: Always return a valid Overlay object
  // Formula: overlayConfig = { mode: settings.overlay.mode, elements: runtimeOverlay[activePresetId] }
  const overlayConfig = useMemo(() => {
    // DEFENSIVE: Ensure runtimeElements is always an array
    const safeElements = Array.isArray(runtimeElements) ? runtimeElements : [];

    const result: Overlay = {
      mode: presetOverlayMode, // From settings (persists across preset switches)
      elements: safeElements, // ONLY from runtime overlay Map (per-preset)
    };
    
    // DEFENSIVE: Final validation - ensure result is always valid
    if (!result || typeof result !== 'object' || !Array.isArray(result.elements)) {
      console.error('[useOverlayConfig] CRITICAL: Invalid overlay config generated, using DEFAULT_OVERLAY');
      return DEFAULT_OVERLAY;
    }

    // DEBUG: Only log in debug mode
    if (typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true) {
      console.log('[useOverlayConfig] Final result - mode:', result.mode, 'elements count:', result.elements.length);
    }

    return result;
  }, [presetOverlayMode, runtimeElements]);

  // CRITICAL: Final safety check - never return null/undefined
  if (!overlayConfig || typeof overlayConfig !== 'object') {
    console.error('[useOverlayConfig] CRITICAL: overlayConfig is invalid, returning DEFAULT_OVERLAY');
    return DEFAULT_OVERLAY;
  }

  return overlayConfig;
}

