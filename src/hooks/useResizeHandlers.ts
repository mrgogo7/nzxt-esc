/**
 * Hook for managing element resize handlers.
 * 
 * Phase 4.2: Resize UX improvements.
 * Handles resize for metric and text elements with min/max constraints.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  resizeMetricElement, 
  resizeTextElement, 
  canResizeElement, 
  calculateResizeDelta,
  type ResizeHandle 
} from '../utils/resize';
import type { Overlay } from '../types/overlay';
import type { AppSettings } from '../constants/defaults';

/**
 * Hook for managing element resize.
 */
export function useResizeHandlers(
  offsetScale: number,
  settingsRef: React.MutableRefObject<AppSettings>,
  setSettings: (settings: AppSettings) => void
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

    const currentSettings = settingsRef.current;
    const currentOverlay = currentSettings.overlay;
    
    if (!currentOverlay || typeof currentOverlay !== 'object' || !('elements' in currentOverlay)) {
      return;
    }
    
    const overlay = currentOverlay as Overlay;
    const element = overlay.elements.find(el => el.id === elementId);
    
    if (!element || !canResizeElement(element)) return;
    
    // Get initial size
    let initialSize = 0;
    if (element.type === 'metric') {
      initialSize = (element.data as any).numberSize || 180;
    } else if (element.type === 'text') {
      initialSize = (element.data as any).textSize || 45;
    }
    
    setResizingElementId(elementId);
    resizeStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      elementId,
      handle,
      initialSize,
    };
  }, [settingsRef]);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeStart.current) return;

    // Calculate total movement from start position
    const totalDx = e.clientX - resizeStart.current.startX;
    const totalDy = e.clientY - resizeStart.current.startY;
    
    // Phase 4.2: Calculate normalized resize delta based on handle direction
    // Use total movement from start for consistent behavior
    const totalSizeDelta = calculateResizeDelta(
      resizeStart.current.handle,
      totalDx,
      totalDy,
      offsetScale
    );
    
    const currentSettings = settingsRef.current;
    const currentOverlay = currentSettings.overlay;
    
    if (!currentOverlay || typeof currentOverlay !== 'object' || !('elements' in currentOverlay)) {
      return;
    }
    
    const overlay = currentOverlay as Overlay;
    const elementIndex = overlay.elements.findIndex(el => el.id === resizeStart.current!.elementId);
    
    if (elementIndex !== -1) {
      const element = overlay.elements[elementIndex];
      
      // Get current size
      let currentSize = 0;
      if (element.type === 'metric') {
        currentSize = (element.data as any).numberSize || 180;
      } else if (element.type === 'text') {
        currentSize = (element.data as any).textSize || 45;
      } else {
        return;
      }
      
      // Target size = initial size + total movement converted to size
      // Apply directly without smoothing for immediate, proportional response
      const targetSize = resizeStart.current.initialSize + totalSizeDelta;
      
      // Calculate final delta for resize function (direct application)
      const finalDelta = targetSize - currentSize;
      
      let updatedElement;
      if (element.type === 'metric') {
        updatedElement = resizeMetricElement(element, finalDelta, false);
      } else if (element.type === 'text') {
        updatedElement = resizeTextElement(element, finalDelta, false);
      } else {
        return;
      }
      
      
      const updatedElements = [...overlay.elements];
      updatedElements[elementIndex] = updatedElement;
      
      setSettings({
        ...currentSettings,
        overlay: {
          ...overlay,
          elements: updatedElements,
        },
      });
    }
  }, [offsetScale, setSettings, settingsRef]);

  const handleResizeMouseUp = useCallback(() => {
    setResizingElementId(null);
    resizeStart.current = null;
  }, []);

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

