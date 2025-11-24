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
  activePresetId?: string | null
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
    
    const runtimeElements = getElementsForPreset(activePresetId);
    const element = runtimeElements.find(el => el.id === elementId);
    
    if (!element || !canResizeElement(element)) return;
    
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
  }, [activePresetId]);

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
    
    const runtimeElements = getElementsForPreset(activePresetId);
    const element = runtimeElements.find(el => el.id === resizeStart.current!.elementId);
    
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
      
      // ARCHITECT MODE: Update runtime overlay Map, NOT settings
      // Runtime change notification will trigger UI re-render via subscription
      updateElementInRuntime(activePresetId, element.id, () => result.element);
    }
  }, [offsetScale, setSettings, settingsRef, activePresetId]);

  const handleResizeMouseUp = useCallback(() => {
    // Record resize action for undo/redo
    if (resizeStart.current && onResizeComplete && activePresetId) {
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
  }, [onResizeComplete, activePresetId]);

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

