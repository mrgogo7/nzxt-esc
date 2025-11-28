/**
 * Hook for managing element resize handlers.
 * 
 * Handles resize for metric and text elements with min/max constraints.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { canResizeElement } from '../utils/resize';
import { resizeElement, type ResizeOperationConfig } from '../transform/operations/ResizeOperation';
import type { ResizeHandle } from '../transform/engine/HandlePositioning';
import type { AppSettings } from '../constants/defaults';
import { getElementsForPreset, updateElementInRuntime } from '../state/overlayRuntime';
// FAZ-3B-3: New runtime system imports (feature-flagged)
import type { OverlayStateManager } from '../state/overlay/stateManager';
import type { OverlayRuntimeState } from '../state/overlay/types';
import { createTransformAction } from '../state/overlay/actions';
import { getElement as getElementFromStore } from '../state/overlay/elementStore';
import { shouldUseFaz3BRuntime } from '../utils/featureFlags';

/**
 * Hook for managing element resize.
 * 
 * Supports undo/redo via onResizeComplete callback.
 */
export function useResizeHandlers(
  offsetScale: number,
  settingsRef: React.MutableRefObject<AppSettings>,
  setSettings: (settings: AppSettings) => void,
  onResizeComplete?: (elementId: string, oldSize: number, newSize: number) => void,
  activePresetId?: string | null,
  stateManager?: OverlayStateManager | null,
  runtimeState?: OverlayRuntimeState | null
) {
  const [resizingElementId, setResizingElementId] = useState<string | null>(null);
  const resizeStart = useRef<{ 
    startX: number; 
    startY: number; 
    elementId: string;
    handle: ResizeHandle;
    initialSize: number;
  } | null>(null);

  const handleResizeMouseDown = useCallback((
    elementId: string,
    handle: ResizeHandle,
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
      const runtimeElements = getElementsForPreset(activePresetId);
      element = runtimeElements.find(el => el.id === elementId);
    }
    
    if (!element || !canResizeElement(element)) return;
    
    // FAZ-3B-3: Start transaction for new runtime system
    if (useNewRuntime && stateManager) {
      stateManager.startTransaction();
    }
    
    // Get initial size
    let initialSize = 0;
    if (element.type === 'metric') {
      initialSize = (element.data as any).numberSize || 180;
    } else if (element.type === 'text') {
      initialSize = (element.data as any).textSize || 45;
    } else if (element.type === 'divider') {
      initialSize = (element.data as any).width || 2; // Divider width (thickness) in pixels
    }
    
    setResizingElementId(elementId);
    resizeStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      elementId,
      handle,
      initialSize,
    };
  }, [activePresetId, stateManager, runtimeState]);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeStart.current) return;

    // Get preview container for ResizeOperation
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
      element = getElementFromStore(runtimeState.elements, resizeStart.current!.elementId);
    } else {
      const runtimeElements = getElementsForPreset(activePresetId);
      element = runtimeElements.find(el => el.id === resizeStart.current!.elementId);
    }
    
    if (element) {
      
      // Use new ResizeOperation (Bug #2 fix)
      const resizeConfig: ResizeOperationConfig = {
        offsetScale,
        previewRect,
        startMousePos: {
          x: resizeStart.current.startX,
          y: resizeStart.current.startY,
        },
        initialSize: resizeStart.current.initialSize,
      };
      
      const result = resizeElement(
        element,
        resizeStart.current.handle,
        { x: e.clientX, y: e.clientY },
        resizeConfig
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
        // Old system: Update runtime overlay Map, NOT settings
        // Runtime change notification will trigger UI re-render via subscription
        updateElementInRuntime(activePresetId, element.id, () => result.element);
      }
    }
  }, [offsetScale, setSettings, settingsRef, activePresetId, stateManager, runtimeState]);

  const handleResizeMouseUp = useCallback(() => {
    // FAZ-3B-3: Commit transaction for new runtime system
    const useNewRuntime = shouldUseFaz3BRuntime();
    if (useNewRuntime && stateManager) {
      // Commit transaction (batches all actions from this resize into single undo/redo entry)
      stateManager.commitTransaction();
    }
    
    // Record resize action for undo/redo (old system only)
    if (!useNewRuntime && resizeStart.current && onResizeComplete && activePresetId) {
      const runtimeElements = getElementsForPreset(activePresetId);
      const element = runtimeElements.find(el => el.id === resizeStart.current!.elementId);
      if (element) {
        let currentSize = 0;
        if (element.type === 'metric') {
          currentSize = (element.data as any).numberSize || 180;
        } else if (element.type === 'text') {
          currentSize = (element.data as any).textSize || 45;
        } else if (element.type === 'divider') {
          currentSize = (element.data as any).width || 2; // Divider width (thickness) in pixels
        }
        
        // Only record if size actually changed
        if (currentSize !== resizeStart.current.initialSize) {
          onResizeComplete(
            resizeStart.current.elementId,
            resizeStart.current.initialSize,
            currentSize
          );
        }
      }
    }
    
    setResizingElementId(null);
    resizeStart.current = null;
  }, [onResizeComplete, activePresetId, stateManager]);

  // Event listeners for resize
  useEffect(() => {
    if (resizingElementId) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleResizeMouseMove);
        window.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [resizingElementId, handleResizeMouseMove, handleResizeMouseUp]);

  return {
    resizingElementId,
    handleResizeMouseDown,
  };
}

