/**
 * Hook for managing element resize handlers.
 * 
 * Handles resize for metric and text elements with min/max constraints.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { LCD_FRAME_MS } from '../overlay/helpers/renderLoop';

/**
 * Resize dead zone threshold in screen pixels.
 * 
 * Small movements below this threshold are ignored to reduce jitter.
 * Must be small enough (1-2px) to not block intentional small adjustments.
 */
const RESIZE_DEAD_ZONE_PX = 1.5;

/**
 * Size jitter threshold in LCD pixels.
 * 
 * Changes smaller than this will be ignored to prevent flicker.
 * This filters out rounding jitter that causes frame-to-frame oscillation.
 * 
 * Value is in LCD pixels (same unit as result.newSize from ResizeOperation).
 */
const SIZE_JITTER_THRESHOLD_PX = 0.5;

/**
 * Pointer delta smoothing alpha (EMA - Exponential Moving Average).
 * 
 * Smoothing factor for pointer delta to reduce high-frequency jitter.
 * 
 * Formula: smoothedDelta = alpha * currentDelta + (1 - alpha) * previousSmoothedDelta
 * 
 * Lower values (0.2-0.3) = more smoothing but more lag
 * Higher values (0.5-0.6) = less smoothing but more responsive
 * 0.4 = balanced (40% new, 60% previous)
 */
const POINTER_SMOOTHING_ALPHA = 0.4;
import { canResizeElement } from '../utils/resize';
import { resizeElement, type ResizeOperationConfig } from '../transform/operations/ResizeOperation';
import type { ResizeHandle } from '../transform/engine/HandlePositioning';
import type { AppSettings } from '../constants/defaults';
import type { OverlayStateManager } from '../state/overlay/stateManager';
import type { OverlayRuntimeState } from '../state/overlay/types';
import { createTransformAction, createTransformActionWithV2 } from '../state/overlay/actions';
import { getElement as getElementFromStore } from '../state/overlay/elementStore';
import { shouldUseFaz3BRuntime } from '../utils/featureFlags';
import { IS_DEV } from '../utils/env';
import { devWarn, devDebug } from '../debug/dev';
import { isMetricElementData, isTextElementData, isDividerElementData, isClockElementData, isDateElementData } from '../types/overlay';
import { computeGroupBoundingBox, type ElementBoundingBox } from '../ui/helpers/groupBoundingBox';
import { calculateElementDimensions } from '../transform/engine/BoundingBox';
import type { OverlayElement } from '../types/overlay';
import type { GroupBoundingBox } from '../ui/helpers/groupBoundingBox';

/**
 * Helper function to dispatch unified transform action for a group of elements.
 * 
 * @param afterArray - Array of elements after transformation
 * @param options - Options including useV2, opType, and groupBBox
 */
function updateElementGroup(
  afterArray: OverlayElement[],
  options: {
    useV2: boolean;
    opType: 'move' | 'rotate' | 'resize';
    groupBBox: GroupBoundingBox | null;
  },
  current: OverlayRuntimeState,
  stateManager: OverlayStateManager
) {
  const beforeMap = new Map<string, OverlayElement>();
  const afterMap = new Map<string, OverlayElement>();

  afterArray.forEach(el => {
    const beforeEl = getElementFromStore(current.elements, el.id);
    if (beforeEl) {
      beforeMap.set(el.id, beforeEl);
      afterMap.set(el.id, el);
    }
  });

  if (beforeMap.size === 0 || afterMap.size === 0) {
    return;
  }

  const action = createTransformActionWithV2(
    Array.from(beforeMap.keys()),
    beforeMap,
    afterMap,
    { includeV2Meta: options.useV2 }
  );

  stateManager.dispatch(action);
}

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
  runtimeState?: OverlayRuntimeState | null,
  onResizeCompleteSimple?: () => void
) {
  const [resizingElementId, setResizingElementId] = useState<string | null>(null);
  const resizeStart = useRef<{ 
    startX: number; 
    startY: number; 
    elementId: string;
    handle: ResizeHandle;
    initialSize: number;
  } | null>(null);
  
  /**
   * Last applied pointer position (for dead zone calculation).
   * 
   * Tracks the last mouse position where a resize was actually applied.
   * Used to compute incremental movement delta for dead zone filtering.
   */
  const lastAppliedPointerRef = useRef<{ x: number; y: number } | null>(null);
  
  /**
   * Last applied size (for size jitter smoothing).
   * 
   * Tracks the last size value where a resize was actually applied.
   * Used to filter out tiny size changes that cause frame-to-frame oscillation.
   */
  const lastAppliedSizeRef = useRef<number | null>(null);
  
  /**
   * Smoothed pointer delta (for EMA smoothing).
   * 
   * Tracks smoothed delta values using exponential moving average.
   * Used to reduce high-frequency jitter in pointer movement before ResizeOperation.
   */
  const smoothedDeltaRef = useRef<{ dx: number; dy: number } | null>(null);
  
  const lastTransformDispatchTime = useRef<number>(0);
  
  const MULTI_SELECT_TRANSFORM_EXPERIMENT = true;

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
    
    // Get element from new runtime or old runtime
    const useNewRuntime = shouldUseFaz3BRuntime();
    let element;
    if (useNewRuntime && runtimeState) {
      element = getElementFromStore(runtimeState.elements, elementId);
    } else {
      if (IS_DEV) {
        devWarn('useResizeHandlers', 'getElementsForPreset called but vNext not available');
      }
      element = undefined;
    }
    
    if (!element || !canResizeElement(element)) return;
    
    // Start transaction for new runtime system
    if (useNewRuntime && stateManager) {
      stateManager.startTransaction();
      if (IS_DEV) {
        devDebug('OverlayRuntime', 'Resize transaction started', { elementId });
      }
    }
    
    // Get initial size
    let initialSize = 0;
    if (element.type === 'metric' && isMetricElementData(element.data)) {
      initialSize = element.data.numberSize || 180;
    } else if (element.type === 'text' && isTextElementData(element.data)) {
      initialSize = element.data.textSize || 45;
    } else if (element.type === 'divider' && isDividerElementData(element.data)) {
      initialSize = element.data.width || 2; // Divider width (thickness) in pixels
    } else if (element.type === 'clock' && isClockElementData(element.data)) {
      initialSize = element.data.fontSize || 45; // Clock font size (same as text)
    } else if (element.type === 'date' && isDateElementData(element.data)) {
      initialSize = element.data.fontSize || 45; // Date font size (same as text)
    }
    
    setResizingElementId(elementId);
    resizeStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      elementId,
      handle,
      initialSize,
    };
    
    // Initialize last applied pointer to drag start position
    lastAppliedPointerRef.current = { x: e.clientX, y: e.clientY };
    
    // Initialize last applied size to initial element size
    lastAppliedSizeRef.current = initialSize;
    
    // Initialize smoothed delta to zero (fresh start for each resize)
    smoothedDeltaRef.current = { dx: 0, dy: 0 };
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
    
    // Dead zone check - skip tiny movements to reduce jitter
    if (lastAppliedPointerRef.current) {
      const rawDx = e.clientX - lastAppliedPointerRef.current.x;
      const rawDy = e.clientY - lastAppliedPointerRef.current.y;
      
      const isWithinDeadZone =
        Math.abs(rawDx) < RESIZE_DEAD_ZONE_PX &&
        Math.abs(rawDy) < RESIZE_DEAD_ZONE_PX;
      
      if (isWithinDeadZone) {
        // Skip this tiny movement - do not apply resize
        return;
      }
      
      // EMA smoothing for pointer delta (after dead zone check)
      let mousePosForResize = { x: e.clientX, y: e.clientY };
      
      if (smoothedDeltaRef.current) {
        const prev = smoothedDeltaRef.current;
        
        const smoothDx = (POINTER_SMOOTHING_ALPHA * rawDx) + ((1 - POINTER_SMOOTHING_ALPHA) * prev.dx);
        const smoothDy = (POINTER_SMOOTHING_ALPHA * rawDy) + ((1 - POINTER_SMOOTHING_ALPHA) * prev.dy);
        
        smoothedDeltaRef.current = { dx: smoothDx, dy: smoothDy };
        
        // Calculate adjusted mouse position using smoothed delta
        mousePosForResize = {
          x: lastAppliedPointerRef.current.x + smoothDx,
          y: lastAppliedPointerRef.current.y + smoothDy,
        };
      }
      
      // Get element from new runtime or old runtime
      const useNewRuntime = shouldUseFaz3BRuntime();
      let element;
      if (useNewRuntime && runtimeState) {
        element = getElementFromStore(runtimeState.elements, resizeStart.current!.elementId);
      } else {
        if (IS_DEV) {
          devWarn('useResizeHandlers', 'getElementsForPreset called but vNext not available');
        }
        element = undefined;
      }
      
      if (element) {
        // Multi-select transform detection
        const selectedIds = runtimeState ? Array.from(runtimeState.selection.selectedIds) : [];
        const elementId = resizeStart.current!.elementId;
        const isMulti = MULTI_SELECT_TRANSFORM_EXPERIMENT && selectedIds.length > 1 && selectedIds.includes(elementId);
        
        if (isMulti && runtimeState && stateManager) {
          // Build per-element bounding boxes (UI layer)
          const beforeElements: OverlayElement[] = [];
          const elementBoxes: ElementBoundingBox[] = [];
          
          for (const selectedId of selectedIds) {
            const selectedElement = getElementFromStore(runtimeState.elements, selectedId);
            if (!selectedElement) continue;
            
            beforeElements.push(selectedElement);
            
            const dimensions = calculateElementDimensions(selectedElement);
            elementBoxes.push({
              id: selectedElement.id,
              x: selectedElement.x - dimensions.width / 2, // Convert center to top-left
              y: selectedElement.y - dimensions.height / 2,
              width: dimensions.width,
              height: dimensions.height,
            });
          }
          
          // Compute group bounding box
          const groupBBox = computeGroupBoundingBox(elementBoxes);
          if (!groupBBox) {
            // Fallback to single-element behavior if group box computation fails
            // Fall through to single-element logic below
          } else {
            // Multi-select transform (resize) activated
            try {
              // Compute resize for the primary element (the one being resized) to get scale factor
              const primaryElement = element;
              const resizeConfig: ResizeOperationConfig = {
                offsetScale,
                previewRect,
                startMousePos: {
                  x: resizeStart.current.startX,
                  y: resizeStart.current.startY,
                },
                initialSize: resizeStart.current.initialSize,
              };
              
              const primaryResult = resizeElement(
                primaryElement,
                resizeStart.current.handle,
                mousePosForResize,
                resizeConfig
              );
              
              // Calculate scale factor from primary element's size change
              const primaryOldDims = calculateElementDimensions(primaryElement);
              const primaryNewDims = calculateElementDimensions(primaryResult.element);
              const originalGroupWidth = groupBBox.width;
              const originalGroupHeight = groupBBox.height;
              
              // Calculate new group dimensions (approximate from primary element scale)
              const newGroupWidth = originalGroupWidth * (primaryOldDims.width > 0 ? primaryNewDims.width / primaryOldDims.width : 1.0);
              const newGroupHeight = originalGroupHeight * (primaryOldDims.height > 0 ? primaryNewDims.height / primaryOldDims.height : 1.0);
              
              // Uniform scaling (use minimum scale to maintain aspect ratio)
              const scaleX = newGroupWidth / originalGroupWidth;
              const scaleY = newGroupHeight / originalGroupHeight;
              const scale = Math.min(scaleX, scaleY);
              
              // Apply size jitter smoothing check for primary element
              if (typeof primaryResult.newSize === 'number' && lastAppliedSizeRef.current !== null) {
                const sizeDelta = Math.abs(primaryResult.newSize - lastAppliedSizeRef.current);
                if (sizeDelta < SIZE_JITTER_THRESHOLD_PX) {
                  // Skip this jittery update
                  lastAppliedPointerRef.current = { x: e.clientX, y: e.clientY };
                  return;
                }
                lastAppliedSizeRef.current = primaryResult.newSize;
              }
              
              // Build after elements array with scaled dimensions and positions
              const after = beforeElements.map(el => {
                const dx = el.x - groupBBox.centerX;
                const dy = el.y - groupBBox.centerY;
                
                // Scale position relative to group center
                const newX = groupBBox.centerX + dx * scale;
                const newY = groupBBox.centerY + dy * scale;
                
                // Scale element dimensions
                let newElement = { ...el, x: newX, y: newY };
                
                if (el.type === 'metric' && isMetricElementData(el.data)) {
                  const oldSize = el.data.numberSize || 180;
                  const newSize = Math.max(6, Math.round(oldSize * scale));
                  newElement = {
                    ...newElement,
                    data: {
                      ...el.data,
                      numberSize: newSize,
                    },
                  };
                } else if (el.type === 'text' && isTextElementData(el.data)) {
                  const oldSize = el.data.textSize || 45;
                  const newSize = Math.max(6, Math.round(oldSize * scale));
                  newElement = {
                    ...newElement,
                    data: {
                      ...el.data,
                      textSize: newSize,
                    },
                  };
                } else if (el.type === 'divider' && isDividerElementData(el.data)) {
                  const oldWidth = el.data.width || 2;
                  const oldHeight = el.data.height || 100;
                  const newWidthScaled = Math.max(1, Math.min(400, Math.round(oldWidth * scale)));
                  const newHeightScaled = Math.max(10, Math.min(640, Math.round(oldHeight * scale)));
                  newElement = {
                    ...newElement,
                    data: {
                      ...el.data,
                      width: newWidthScaled,
                      height: newHeightScaled,
                    },
                  };
                }
                
                return newElement;
              });
              
              // Throttle multi-select transform dispatch to 60Hz
              const now = performance.now();
              const timeSinceLastDispatch = now - lastTransformDispatchTime.current;
              
              if (timeSinceLastDispatch >= LCD_FRAME_MS) {
              // Dispatch unified transform action
              updateElementGroup(after, {
                useV2: true,
                opType: 'resize',
                groupBBox,
              }, runtimeState, stateManager);
                
                lastTransformDispatchTime.current = now;
              }
              
              // Update last applied pointer after successful resize
              lastAppliedPointerRef.current = { x: e.clientX, y: e.clientY };
              return; // Multi-select handled, don't fall through to single-element logic
            } catch (err) {
              // Safety guard: fallback to single-element behavior on error
              if (IS_DEV) {
                devWarn('useResizeHandlers', 'Multi-select resize failed, falling back to single-element', err);
              }
              // Fall through to single-element logic below
            }
          }
        }
        
        // Existing single-element transform logic (unchanged)
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
          mousePosForResize, // Use smoothed mouse position if smoothing is active
          resizeConfig
        );
        
        // Simple size jitter smoothing - filter tiny size changes
        if (typeof result.newSize === 'number') {
          if (lastAppliedSizeRef.current !== null) {
            const sizeDelta = Math.abs(result.newSize - lastAppliedSizeRef.current);
            if (sizeDelta < SIZE_JITTER_THRESHOLD_PX) {
              // This change is too small; likely rounding jitter → skip dispatch
              // Note: We still update lastAppliedPointerRef to maintain dead zone behavior
              lastAppliedPointerRef.current = { x: e.clientX, y: e.clientY };
              return;
            }
          }
          
          // Accept this size as the new stable size
          lastAppliedSizeRef.current = result.newSize;
        }
        
        // Use new runtime system if feature flag is enabled
        if (useNewRuntime && stateManager && runtimeState) {
          // Get current element state from runtime
          const currentElement = getElementFromStore(runtimeState.elements, element.id);
          if (!currentElement) return;
          
          // Throttle transform dispatch to 60Hz
          const now = performance.now();
          const timeSinceLastDispatch = now - lastTransformDispatchTime.current;
          
          if (timeSinceLastDispatch >= LCD_FRAME_MS) {
          // Create transform action and dispatch (will be batched in transaction)
          const oldStates = new Map<string, typeof currentElement>();
          const newStates = new Map<string, typeof result.element>;
          oldStates.set(element.id, currentElement);
          newStates.set(element.id, result.element);
          
          const action = createTransformAction([element.id], oldStates, newStates);
          stateManager.dispatch(action); // This adds to transaction if active
            
            lastTransformDispatchTime.current = now;
          }
        } else {
          if (IS_DEV) {
            devWarn('useResizeHandlers', 'updateElementInRuntime called but vNext not available');
          }
        }
        
        // Update last applied pointer after successful resize
        // Use actual mouse position (not smoothed) for dead zone tracking
        lastAppliedPointerRef.current = { x: e.clientX, y: e.clientY };
      }
    }
  }, [offsetScale, setSettings, settingsRef, activePresetId, stateManager, runtimeState]);

  const handleResizeMouseUp = useCallback((e?: MouseEvent) => {
    // Commit transaction for new runtime system
    const useNewRuntime = shouldUseFaz3BRuntime();
    if (useNewRuntime && stateManager) {
      // Commit transaction (batches all actions from this resize into single undo/redo entry)
      stateManager.commitTransaction();
      if (IS_DEV) {
        devDebug('OverlayRuntime', 'Resize transaction committed');
      }
    }
    
    // Call simple complete callback
    if (onResizeCompleteSimple) {
      onResizeCompleteSimple();
    }
    
    setResizingElementId(null);
    resizeStart.current = null;
    
    // Clear last applied pointer on resize end
    lastAppliedPointerRef.current = null;
    
    // Clear last applied size on resize end
    lastAppliedSizeRef.current = null;
    
    // Clear smoothed delta on resize end
    smoothedDeltaRef.current = null;
    
    // Clear throttling state
    lastTransformDispatchTime.current = 0;
  }, [onResizeComplete, onResizeCompleteSimple, activePresetId, stateManager]);

  // Event listeners for resize
  useEffect(() => {
    if (resizingElementId) {
      // Wrap mouseup handler to pass event for color picker detection
      const wrappedMouseUp = (e: MouseEvent) => handleResizeMouseUp(e);
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', wrappedMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleResizeMouseMove);
        window.removeEventListener('mouseup', wrappedMouseUp);
      };
    }
  }, [resizingElementId, handleResizeMouseMove, handleResizeMouseUp]);

  return {
    resizingElementId,
    handleResizeMouseDown,
  };
}

