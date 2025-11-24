/**
 * Hook to subscribe to runtime overlay elements for a specific preset.
 * 
 * This hook provides reactive access to runtime overlay elements without
 * causing writes to presets. It subscribes to runtime changes and returns
 * the current elements array for the given preset.
 * 
 * Architecture:
 * - Subscribes to overlayRuntime change notifications
 * - Returns current elements for the active preset
 * - Does NOT trigger preset saves
 * - Does NOT modify runtime state
 * 
 * @param presetId - Active preset ID (null returns empty array)
 * @returns Current overlay elements array for the preset
 */

import { useState, useEffect } from 'react';
import { getElementsForPreset, subscribeRuntimeChange } from '../state/overlayRuntime';
import type { OverlayElement } from '../types/overlay';

/**
 * Hook for reactive runtime overlay elements.
 * 
 * @param presetId - Active preset ID (null returns empty array)
 * @returns Current overlay elements array for the preset
 */
export function useRuntimeOverlayElements(presetId: string | null): OverlayElement[] {
  const [elements, setElements] = useState<OverlayElement[]>(() => {
    return presetId ? getElementsForPreset(presetId) : [];
  });

  useEffect(() => {
    // Update on mount and when presetId changes
    const currentElements = presetId ? getElementsForPreset(presetId) : [];
    setElements(currentElements);

    // Subscribe to runtime changes
    const unsubscribe = subscribeRuntimeChange((changedPresetId) => {
      // Only update if the change is for the active preset
      if (changedPresetId === presetId) {
        const newElements = presetId ? getElementsForPreset(presetId) : [];
        setElements(newElements);
      }
    });

    return unsubscribe;
  }, [presetId]);

  return elements;
}

