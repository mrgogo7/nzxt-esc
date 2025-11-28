/**
 * Hook for managing element rotation handlers.
 * 
 * Supports smooth rotation and snapping.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { rotateElement, type RotateOperationConfig } from '../transform/operations/RotateOperation';
import type { AppSettings } from '../constants/defaults';
// FAZ-4-3: Legacy overlayRuntime.ts deleted - only vNext path remains
// FAZ-3B-3: New runtime system imports (feature-flagged)
import type { OverlayStateManager } from '../state/overlay/stateManager';
import type { OverlayRuntimeState } from '../state/overlay/types';
import { createTransformAction } from '../state/overlay/actions';
import { getElement as getElementFromStore } from '../state/overlay/elementStore';
import { shouldUseFaz3BRuntime } from '../utils/featureFlags';
import { IS_DEV } from '../utils/env';

/**
 * Hook for managing element rotation.
 * 
 * Supports undo/redo via onRotateComplete callback.
 */
export function useRotationHandlers(
  _offsetScale: number,
  settingsRef: React.MutableRefObject<AppSettings>,
  setSettings: (settings: AppSettings) => void,
  onRotateComplete?: (elementId: string, oldAngle: number | undefined, newAngle: number | undefined) => void,
  activePresetId?: string | null,
  stateManager?: OverlayStateManager | null,
  runtimeState?: OverlayRuntimeState | null
) {
  const [rotatingElementId, setRotatingElementId] = useState<string | null>(null);
  const rotationStart = useRef<{
    startX: number;
    startY: number;
    centerX: number;
    centerY: number;
    elementId: string;
    initialAngle: number;
  } | null>(null);

  const handleRotationMouseDown = useCallback((
    elementId: string,
    _centerX: number,
    _centerY: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // ARCHITECT MODE: Read from runtime overlay Map, NOT from settings
    if (!activePresetId) {
      return;
    }
    
    // FAZ-3B-3: Get element from new runtime or old runtime
    const useNewRuntime = shouldUseFaz3BRuntime();
    let element;
    if (useNewRuntime && runtimeState) {
      element = getElementFromStore(runtimeState.elements, elementId);
    } else {
      // FAZ-4-3: Legacy overlayRuntime.ts removed - vNext is required
      if (IS_DEV) {
        console.warn('[useRotationHandlers] getElementsForPreset called but vNext not available');
      }
      element = undefined;
    }
    
    if (!element) return;
    
    // FAZ-3B-3: Start transaction for new runtime system
    if (useNewRuntime && stateManager) {
      stateManager.startTransaction();
      // FAZ-4-4C: Dev logging for rotation transaction start
      if (IS_DEV) {
        console.debug('[OverlayRuntime] Rotation transaction started', { elementId });
      }
    }
    
    // Get current element angle
    const currentElementAngle = element.angle ?? 0;
    
    // centerX and centerY are in preview coordinates
    // We need to convert them to LCD coordinates for RotateOperation
    // But actually, RotateOperation expects element center in LCD coordinates
    // So we need to convert preview center to LCD center
    const previewContainer = document.querySelector('.overlay-preview');
    if (!previewContainer) return;
    
    // Element center in LCD coordinates is element.x, element.y
    // But centerX, centerY passed here are in preview coordinates
    // We need to convert preview coordinates to LCD coordinates
    // Actually, let's use element.x, element.y directly as element center
    const elementCenter = { x: element.x, y: element.y };
    
    setRotatingElementId(elementId);
    rotationStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      centerX: elementCenter.x,
      centerY: elementCenter.y,
      elementId,
      initialAngle: currentElementAngle,
    };
  }, [activePresetId, stateManager, runtimeState]);

  const handleRotationMouseMove = useCallback((e: MouseEvent) => {
    if (!rotationStart.current) return;

    // Get preview container for RotateOperation
    const previewContainer = document.querySelector('.overlay-preview');
    if (!previewContainer) return;
    const previewRect = previewContainer.getBoundingClientRect();

    // ARCHITECT MODE: Read from runtime overlay Map, NOT from settings
    if (!activePresetId) {
      return;
    }
    
    // FAZ-3B-3: Get element from new runtime or old runtime
    const useNewRuntime = shouldUseFaz3BRuntime();
    let element;
    if (useNewRuntime && runtimeState) {
      element = getElementFromStore(runtimeState.elements, rotationStart.current!.elementId);
    } else {
      // FAZ-4-3: Legacy overlayRuntime.ts removed - vNext is required
      if (IS_DEV) {
        console.warn('[useRotationHandlers] getElementsForPreset called but vNext not available');
      }
      element = undefined;
    }
    
    if (element) {
      
      // Use new RotateOperation (Bug #7 fix)
      const rotateConfig: RotateOperationConfig = {
        offsetScale: _offsetScale,
        previewRect,
        startMousePos: {
          x: rotationStart.current.startX,
          y: rotationStart.current.startY,
        },
        initialAngle: rotationStart.current.initialAngle,
        elementCenter: {
          x: rotationStart.current.centerX,
          y: rotationStart.current.centerY,
        },
      };
      
      const result = rotateElement(
        element,
        { x: e.clientX, y: e.clientY },
        rotateConfig
      );
      
      // FAZ-3B-3: Use new runtime system if feature flag is enabled
      if (useNewRuntime && stateManager && runtimeState) {
        // Get current element state from runtime
        const currentElement = getElementFromStore(runtimeState.elements, element.id);
        if (!currentElement) return;
        
        // Create transform action and dispatch (will be batched in transaction)
        const oldStates = new Map<string, typeof currentElement>();
        const newStates = new Map<string, typeof result.element>;
        oldStates.set(element.id, currentElement);
        newStates.set(element.id, result.element);
        
        const action = createTransformAction([element.id], oldStates, newStates);
        stateManager.dispatch(action); // This adds to transaction if active
      } else {
        // FAZ-4-3: Legacy overlayRuntime.ts removed - vNext is required
        if (IS_DEV) {
          console.warn('[useRotationHandlers] updateElementInRuntime called but vNext not available');
        }
      }
    }
  }, [_offsetScale, setSettings, settingsRef, activePresetId, stateManager, runtimeState]);

  const handleRotationMouseUp = useCallback(() => {
    // FAZ-3B-3: Commit transaction for new runtime system
    const useNewRuntime = shouldUseFaz3BRuntime();
    if (useNewRuntime && stateManager) {
      // Commit transaction (batches all actions from this rotate into single undo/redo entry)
      stateManager.commitTransaction();
      // FAZ-4-4C: Dev logging for rotation transaction commit
      if (IS_DEV) {
        console.debug('[OverlayRuntime] Rotation transaction committed');
      }
    }
    
    // FAZ-4-3: Legacy overlayRuntime.ts removed - undo/redo handled by stateManager
    
    setRotatingElementId(null);
    rotationStart.current = null;
  }, [onRotateComplete, activePresetId, stateManager]);

  // Event listeners for rotation
  useEffect(() => {
    if (rotatingElementId) {
      window.addEventListener('mousemove', handleRotationMouseMove);
      window.addEventListener('mouseup', handleRotationMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleRotationMouseMove);
        window.removeEventListener('mouseup', handleRotationMouseUp);
      };
    }
  }, [rotatingElementId, handleRotationMouseMove, handleRotationMouseUp]);

  return {
    rotatingElementId,
    handleRotationMouseDown,
  };
}

