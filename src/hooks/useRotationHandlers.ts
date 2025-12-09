/**
 * Hook for managing element rotation handlers.
 * 
 * Supports smooth rotation and snapping.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { LCD_FRAME_MS } from '../overlay/helpers/renderLoop';

/**
 * Rotation smoothing threshold in degrees.
 * 
 * Small angle changes below this threshold are filtered to reduce jitter.
 * Must be subtle (0.5-1.0°) to not block intentional small rotations.
 */
const ROTATION_SMOOTHING_THRESHOLD_DEG = 0.75;
import { rotateElement, type RotateOperationConfig } from '../transform/operations/RotateOperation';
import type { AppSettings } from '../constants/defaults';
import type { OverlayStateManager } from '../state/overlay/stateManager';
import type { OverlayRuntimeState } from '../state/overlay/types';
import { createTransformAction, createTransformActionWithV2 } from '../state/overlay/actions';
import { getElement as getElementFromStore } from '../state/overlay/elementStore';
import { shouldUseFaz3BRuntime } from '../utils/featureFlags';
import { IS_DEV } from '../utils/env';
import { devWarn, devDebug } from '../debug/dev';
import { computeGroupBoundingBox, type ElementBoundingBox } from '../ui/helpers/groupBoundingBox';
import { calculateElementDimensions } from '../transform/engine/BoundingBox';
import type { OverlayElement } from '../types/overlay';
import type { GroupBoundingBox } from '../ui/helpers/groupBoundingBox';
import { rotatePoint, normalizeAngle } from '../transform/helpers/rotationHelpers';

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
  runtimeState?: OverlayRuntimeState | null,
  onRotateCompleteSimple?: () => void
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
  
  /**
   * Last applied rotation angle (for smoothing calculation).
   * 
   * Tracks the last angle where a rotation update was actually applied.
   * Used to filter out jittery small angle changes.
   */
  const lastAppliedAngleRef = useRef<number | null>(null);
  
  const lastTransformDispatchTime = useRef<number>(0);
  
  const MULTI_SELECT_TRANSFORM_EXPERIMENT = true;

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
    
    // Get element from new runtime or old runtime
    const useNewRuntime = shouldUseFaz3BRuntime();
    let element;
    if (useNewRuntime && runtimeState) {
      element = getElementFromStore(runtimeState.elements, elementId);
    } else {
      if (IS_DEV) {
        devWarn('useRotationHandlers', 'getElementsForPreset called but vNext not available');
      }
      element = undefined;
    }
    
    if (!element) return;
    
    if (useNewRuntime && stateManager) {
      stateManager.startTransaction();
      if (IS_DEV) {
        devDebug('OverlayRuntime', 'Rotation transaction started', { elementId });
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
    
    lastAppliedAngleRef.current = currentElementAngle;
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
    
    // Get element from new runtime or old runtime
    const useNewRuntime = shouldUseFaz3BRuntime();
    let element;
    if (useNewRuntime && runtimeState) {
      element = getElementFromStore(runtimeState.elements, rotationStart.current!.elementId);
    } else {
      if (IS_DEV) {
        devWarn('useRotationHandlers', 'getElementsForPreset called but vNext not available');
      }
      element = undefined;
    }
    
    if (element) {
      const selectedIds = runtimeState ? Array.from(runtimeState.selection.selectedIds) : [];
      const elementId = rotationStart.current!.elementId;
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
          try {
            // Compute rotation for the primary element (the one being rotated) to get angle delta
            const primaryElement = element;
            const rotateConfig: RotateOperationConfig = {
              offsetScale: _offsetScale,
              previewRect,
              startMousePos: {
                x: rotationStart.current.startX,
                y: rotationStart.current.startY,
              },
              initialAngle: rotationStart.current.initialAngle,
              elementCenter: {
                x: groupBBox.centerX,
                y: groupBBox.centerY,
              },
            };
            
            // Compute angle delta from primary element rotation (around group center)
            const primaryResult = rotateElement(
              primaryElement,
              { x: e.clientX, y: e.clientY },
              rotateConfig
            );
            
            // Calculate angle delta
            const startAngle = rotationStart.current.initialAngle;
            const currentComputedAngle = primaryResult.angle;
            let angleDelta = currentComputedAngle - startAngle;
            // Normalize angle delta to [-180, 180] range
            if (angleDelta > 180) angleDelta -= 360;
            if (angleDelta < -180) angleDelta += 360;
            
            if (lastAppliedAngleRef.current !== null) {
              const angleDeltaAbs = Math.abs(angleDelta);
              const normalizedDelta = Math.min(angleDeltaAbs, 360 - angleDeltaAbs);
              if (normalizedDelta < ROTATION_SMOOTHING_THRESHOLD_DEG) {
                // Skip this jittery update
                return;
              }
            }
            
            // Build after elements array with rotated positions and angles
            const after = beforeElements.map(el => {
              const dx = el.x - groupBBox.centerX;
              const dy = el.y - groupBBox.centerY;
              
              // Rotate point around group center
              const rotated = rotatePoint(dx, dy, angleDelta);
              
              return {
                ...el,
                angle: normalizeAngle((el.angle ?? 0) + angleDelta),
                x: groupBBox.centerX + rotated.x,
                y: groupBBox.centerY + rotated.y,
              };
            });
            
            const now = performance.now();
            const timeSinceLastDispatch = now - lastTransformDispatchTime.current;
            
            if (timeSinceLastDispatch >= LCD_FRAME_MS) {
            // Dispatch unified transform action
            updateElementGroup(after, {
              useV2: true,
              opType: 'rotate',
              groupBBox,
            }, runtimeState, stateManager);
              
              lastTransformDispatchTime.current = now;
            }
            
            // Update last applied angle after successful rotation
            lastAppliedAngleRef.current = primaryResult.angle;
            return; // Multi-select handled, don't fall through to single-element logic
          } catch (err) {
            // Safety guard: fallback to single-element behavior on error
            if (IS_DEV) {
              devWarn('useRotationHandlers', 'Multi-select rotate failed, falling back to single-element', err);
            }
            // Fall through to single-element logic below
          }
        }
      }
      
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
      
      if (lastAppliedAngleRef.current !== null) {
        const rawAngle = result.angle;
        const angleDelta = Math.abs(rawAngle - lastAppliedAngleRef.current);
        
        // Handle wrap-around (e.g., 359° to 1° = 2° delta, not 358°)
        const normalizedDelta = Math.min(angleDelta, 360 - angleDelta);
        
        if (normalizedDelta < ROTATION_SMOOTHING_THRESHOLD_DEG) {
          // Skip this jittery update - do not dispatch rotation action
          return;
        }
      }
      
      if (useNewRuntime && stateManager && runtimeState) {
        // Get current element state from runtime
        const currentElement = getElementFromStore(runtimeState.elements, element.id);
        if (!currentElement) return;
        
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
          devWarn('useRotationHandlers', 'updateElementInRuntime called but vNext not available');
        }
      }
      
      lastAppliedAngleRef.current = result.angle;
    }
  }, [_offsetScale, setSettings, settingsRef, activePresetId, stateManager, runtimeState]);

  const handleRotationMouseUp = useCallback((e?: MouseEvent) => {
    const useNewRuntime = shouldUseFaz3BRuntime();
    if (useNewRuntime && stateManager) {
      stateManager.commitTransaction();
      if (IS_DEV) {
        devDebug('OverlayRuntime', 'Rotation transaction committed');
      }
    }
    
    if (onRotateCompleteSimple) {
      onRotateCompleteSimple();
    }
    
    setRotatingElementId(null);
    rotationStart.current = null;
    
    lastAppliedAngleRef.current = null;
    
    lastTransformDispatchTime.current = 0;
  }, [onRotateComplete, onRotateCompleteSimple, activePresetId, stateManager]);

  // Event listeners for rotation
  useEffect(() => {
    if (rotatingElementId) {
      // Wrap mouseup handler to pass event for color picker detection
      const wrappedMouseUp = (e: MouseEvent) => handleRotationMouseUp(e);
      window.addEventListener('mousemove', handleRotationMouseMove);
      window.addEventListener('mouseup', wrappedMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleRotationMouseMove);
        window.removeEventListener('mouseup', wrappedMouseUp);
      };
    }
  }, [rotatingElementId, handleRotationMouseMove, handleRotationMouseUp]);

  return {
    rotatingElementId,
    handleRotationMouseDown,
  };
}

