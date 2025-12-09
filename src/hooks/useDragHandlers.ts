import { useState, useRef, useCallback, useEffect } from 'react';
import { previewToLcd } from '../utils/positioning';
import { constrainToCircle } from '../utils/boundaries';
import { detectAlignment, applySnapping, type AlignmentGuide, type SnappingState } from '../utils/snapping';
import type { AppSettings } from '../constants/defaults';
import { moveElement, type MoveOperationConfig } from '../transform/operations/MoveOperation';
import type { OverlayStateManager } from '../state/overlay/stateManager';
import type { OverlayRuntimeState } from '../state/overlay/types';
import { createTransformAction, createSelectAction, createTransformActionWithV2 } from '../state/overlay/actions';
import { getElement as getElementFromStore } from '../state/overlay/elementStore';
import { IS_DEV } from '../utils/env';
import { devWarn } from '../debug/dev';
import { selectSingle, toggleSelect } from '../ui/components/ConfigPreview/helpers/selectionHelpers';
import { computeGroupBoundingBox, type ElementBoundingBox } from '../ui/helpers/groupBoundingBox';
import { calculateElementDimensions } from '../transform/engine/BoundingBox';
import type { OverlayElement } from '../types/overlay';
import type { GroupBoundingBox } from '../ui/helpers/groupBoundingBox';
import { LCD_FRAME_MS } from '../overlay/helpers/renderLoop';

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
 * Hook for managing all drag handlers in ConfigPreview.
 * 
 * Handles:
 * - Background drag (media positioning)
 * - Element drag (unified for all element types: metric, text, divider)
 * 
 * Supports undo/redo via transaction system.
 * 
 * @param offsetScale - Scale factor for converting preview to LCD pixels
 * @param settingsRef - Ref to current settings (to avoid stale closures)
 * @param setSettings - Settings setter function
 * @param _onResizeComplete - Optional callback when resize completes
 * @param _onRotateComplete - Optional callback when rotate completes
 * @param _onTransformComplete - Optional callback when transform completes
 */
export function useDragHandlers(
  offsetScale: number,
  settingsRef: React.MutableRefObject<AppSettings>,
  setSettings: (settings: AppSettings) => void,
  _onResizeComplete?: () => void,
  activePresetId?: string | null,
  stateManager?: OverlayStateManager | null,
  runtimeState?: OverlayRuntimeState | null,
  _onRotateComplete?: () => void,
  _onTransformComplete?: () => void
) {
  // Background drag state
  const [isDragging, setIsDragging] = useState(false);
  
  // Element drag state (unified for all element types)
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  
  const MULTI_SELECT_TRANSFORM_EXPERIMENT = true;
  
  // Snapping guides state
  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);
  
  // Snapping state for escape tolerance
  const snappingState = useRef<SnappingState>({
    lastSnappedX: null,
    lastSnappedY: null,
    escapeVelocityX: 0,
    escapeVelocityY: 0,
  });

  // Drag refs
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const elementDragStart = useRef<{ x: number; y: number; elementId: string } | null>(null);
  
  // Previous position for velocity calculation
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  
  // Store initial position for undo/redo
  const moveInitialPosition = useRef<{ x: number; y: number } | null>(null);
  
  const lastTransformDispatchTime = useRef<number>(0);
  const pendingTransformRef = useRef<{
    element: OverlayElement;
    newElement: OverlayElement;
    guides: AlignmentGuide[];
  } | null>(null);

  // Background drag handlers
  const handleBackgroundMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  }, []);

  const handleBackgroundMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStart.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    // CRITICAL: Convert preview pixels to LCD pixels
    const lcdDx = previewToLcd(dx, offsetScale);
    const lcdDy = previewToLcd(dy, offsetScale);

    // Use ref to get current settings value
    const currentSettings = settingsRef.current;
    // Ensure integer values for x and y
    setSettings({
      ...currentSettings,
      x: Math.round(currentSettings.x + lcdDx),
      y: Math.round(currentSettings.y + lcdDy),
    });
  }, [offsetScale, setSettings, settingsRef]);

  const handleBackgroundMouseUp = useCallback((e?: MouseEvent) => {
    void e; // Keep parameter for API stability
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  // Unified element drag handlers
  // Mevcut custom drag davranışını koruyoruz: 
  // - İlk tıklama: sadece seç (drag başlatma)
  // - Seçili element'e tekrar tıklama: drag başlat
  const handleElementMouseDown = useCallback((elementId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!stateManager || !runtimeState || !activePresetId) {
      if (IS_DEV) {
        devWarn('useDragHandlers', 'handleElementMouseDown called but runtime not available', {
          hasStateManager: !!stateManager,
          hasRuntimeState: !!runtimeState,
          hasActivePresetId: !!activePresetId,
        });
      }
      return;
    }
    
    // Check if element is already selected (from runtime state)
    const isSelected = runtimeState.selection.selectedIds.has(elementId);
    const isLastSelected = runtimeState.selection.lastSelectedId === elementId;
    
    // If already selected, start dragging immediately
    if (isSelected && isLastSelected) {
      setDraggingElementId(elementId);
      elementDragStart.current = { x: e.clientX, y: e.clientY, elementId };
      
      lastTransformDispatchTime.current = performance.now();
      
      stateManager.startTransaction();
      
      // Store initial position for undo/redo
      const element = getElementFromStore(runtimeState.elements, elementId);
      if (element) {
        moveInitialPosition.current = { x: element.x, y: element.y };
      }
    } else {
      // First click: just select, don't start dragging
      const isMultiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
      
      if (isMultiSelect) {
        // Multi-select: toggle selection
        const action = toggleSelect(runtimeState, elementId);
        stateManager.dispatch(action);
      } else {
        // Single select: clear existing selection, select only this element
        const action = selectSingle(runtimeState, elementId);
        stateManager.dispatch(action);
      }
    }
  }, [activePresetId, stateManager, runtimeState]);

  const handleElementMouseMove = useCallback((e: MouseEvent) => {
    if (!elementDragStart.current) return;

    // Get preview container for MoveOperation
    const previewContainer = document.querySelector('.overlay-preview');
    if (!previewContainer) return;
    const previewRect = previewContainer.getBoundingClientRect();

    // Calculate screen delta
    const screenDelta = {
      x: e.clientX - elementDragStart.current.x,
      y: e.clientY - elementDragStart.current.y,
    };

    if (!activePresetId || !stateManager || !runtimeState) {
      if (IS_DEV) {
        devWarn('useDragHandlers', 'handleElementMouseMove called but runtime not available');
      }
      return;
    }
    
    // Get current element state from runtime
    const element = getElementFromStore(runtimeState.elements, elementDragStart.current!.elementId);
    if (!element) {
      if (IS_DEV) {
        devWarn('useDragHandlers', 'handleElementMouseMove: element not found', {
          elementId: elementDragStart.current!.elementId,
        });
      }
      return;
    }
    
    const selectedIds = Array.from(runtimeState.selection.selectedIds);
    const elementId = elementDragStart.current!.elementId;
    const isMulti = MULTI_SELECT_TRANSFORM_EXPERIMENT && selectedIds.length > 1 && selectedIds.includes(elementId);
    
    if (isMulti) {
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
          // Convert screen delta to LCD delta using previewToLcd
          const lcdDx = previewToLcd(screenDelta.x, offsetScale);
          const lcdDy = previewToLcd(screenDelta.y, offsetScale);
          
          // Build after elements array
          const after = beforeElements.map(el => {
            const rel = groupBBox.relativeOffsets[el.id];
            if (!rel) return el;
            
            // Compute new position based on group center + relative offset + delta
            const newGroupCenterX = groupBBox.centerX + lcdDx;
            const newGroupCenterY = groupBBox.centerY + lcdDy;
            const newElementCenterX = newGroupCenterX + rel.dx;
            const newElementCenterY = newGroupCenterY + rel.dy;
            
            // Apply boundary constraint (constrainToCircle)
            const constrained = constrainToCircle(el, newElementCenterX, newElementCenterY, offsetScale);
            
            return {
              ...el,
              x: constrained.x,
              y: constrained.y,
            };
          });
          
          const now = performance.now();
          const timeSinceLastDispatch = now - lastTransformDispatchTime.current;
          
          if (timeSinceLastDispatch >= LCD_FRAME_MS) {
          // Dispatch unified transform action
          updateElementGroup(after, {
            useV2: true,
            opType: 'move',
            groupBBox,
          }, runtimeState, stateManager);
            
            lastTransformDispatchTime.current = now;
            
            // CRITICAL: Only update drag start position AFTER successful dispatch
            // This prevents delta accumulation issues when transforms are throttled
            elementDragStart.current = { ...elementDragStart.current, x: e.clientX, y: e.clientY };
          }
          // If throttled, do NOT update elementDragStart.current - wait for next successful dispatch
          
          return; // Multi-select handled, don't fall through to single-element logic
        } catch (err) {
          // Safety guard: fallback to single-element behavior on error
          if (IS_DEV) {
            devWarn('useDragHandlers', 'Multi-select move failed, falling back to single-element', err);
          }
          // Fall through to single-element logic below
        }
      }
    }
    
    // Existing single-element transform logic (unchanged)
    // Use MoveOperation to calculate new position
    const moveConfig: MoveOperationConfig = {
      offsetScale,
      previewRect,
    };
    
    const moveResult = moveElement(element, screenDelta, moveConfig);
    const newX = moveResult.x;
    const newY = moveResult.y;
    
    // Calculate velocity for escape detection
    if (lastPosition.current) {
      snappingState.current.escapeVelocityX = newX - lastPosition.current.x;
      snappingState.current.escapeVelocityY = newY - lastPosition.current.y;
    }
    lastPosition.current = { x: newX, y: newY };
    
    // Snapping - detect alignment guides (only show when within threshold)
    const otherElements = Array.from(runtimeState.elements.values()).filter(el => el.id !== element.id);
    const guides = detectAlignment(
      { ...element, x: newX, y: newY },
      otherElements,
      offsetScale
    );
    
    // Only show guides when within threshold
    setActiveGuides(guides);
    
    // Apply soft, magnetic snapping
    const snapped = applySnapping(newX, newY, guides, snappingState.current);
    
    // Update snapping state
    if (snapped.isSnapped) {
      // Find which guide we snapped to
      const xGuide = guides.find(g => g.type === 'center-x');
      const yGuide = guides.find(g => g.type === 'center-y');
      if (xGuide) snappingState.current.lastSnappedX = xGuide.x;
      if (yGuide) snappingState.current.lastSnappedY = yGuide.y;
    } else {
      // Clear snapping state if we've escaped
      const escapedX = snappingState.current.lastSnappedX !== null && 
        Math.abs(newX - snappingState.current.lastSnappedX) > 15;
      const escapedY = snappingState.current.lastSnappedY !== null && 
        Math.abs(newY - snappingState.current.lastSnappedY) > 15;
      
      if (escapedX) snappingState.current.lastSnappedX = null;
      if (escapedY) snappingState.current.lastSnappedY = null;
    }
    
    // Boundary control - constrain element to stay within circle
    const constrained = constrainToCircle(element, snapped.x, snapped.y, offsetScale);
    
    // Create new element state
    const newElement = {
      ...element,
      x: constrained.x,
      y: constrained.y,
    };
    
    // Store pending transform for immediate UI feedback
    pendingTransformRef.current = {
      element,
      newElement,
      guides,
    };
    
    // Only dispatch transform if enough time has passed (60Hz = 16.67ms)
    const now = performance.now();
    const timeSinceLastDispatch = now - lastTransformDispatchTime.current;
    
    if (timeSinceLastDispatch >= LCD_FRAME_MS) {
      // Dispatch transform action (will be batched in transaction)
    const oldStates = new Map<string, typeof element>();
    const newStates = new Map<string, typeof newElement>();
    oldStates.set(element.id, element);
    newStates.set(element.id, newElement);
    
    const action = createTransformAction([element.id], oldStates, newStates);
    stateManager.dispatch(action); // This adds to transaction if active
      
      lastTransformDispatchTime.current = now;
      pendingTransformRef.current = null; // Clear pending after dispatch
      
      // CRITICAL: Only update drag start position AFTER successful dispatch
      // This prevents delta accumulation issues when transforms are throttled
      elementDragStart.current = { ...elementDragStart.current, x: e.clientX, y: e.clientY };
    }
    // If throttled, pendingTransformRef will be dispatched on next eligible frame
    // Do NOT update elementDragStart.current here - wait for next successful dispatch
  }, [offsetScale, setSettings, settingsRef, activePresetId, stateManager, runtimeState]);

  const handleElementMouseUp = useCallback((e?: MouseEvent) => {
    void e; // Keep parameter for API stability
    if (pendingTransformRef.current && stateManager && runtimeState) {
      const { element, newElement } = pendingTransformRef.current;
      const oldStates = new Map<string, typeof element>();
      const newStates = new Map<string, typeof newElement>();
      oldStates.set(element.id, element);
      newStates.set(element.id, newElement);
      
      const action = createTransformAction([element.id], oldStates, newStates);
      stateManager.dispatch(action);
      pendingTransformRef.current = null;
    }
    
    if (stateManager) {
      stateManager.commitTransaction();
    }
    
    setDraggingElementId(null);
    elementDragStart.current = null;
    moveInitialPosition.current = null;
    setActiveGuides([]); // Clear guides when drag ends
    lastPosition.current = null; // Reset position tracking
    // Reset snapping state
    snappingState.current = {
      lastSnappedX: null,
      lastSnappedY: null,
      escapeVelocityX: 0,
      escapeVelocityY: 0,
    };
    lastTransformDispatchTime.current = 0;
    pendingTransformRef.current = null;
    // Keep selected after drag ends - user can click again to drag
  }, [stateManager, runtimeState]);

  // Event listeners for drag handlers
  useEffect(() => {
    if (isDragging) {
      // Wrap mouseup handler to pass event for color picker detection
      const wrappedMouseUp = (e: MouseEvent) => handleBackgroundMouseUp(e);
      window.addEventListener('mousemove', handleBackgroundMouseMove);
      window.addEventListener('mouseup', wrappedMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleBackgroundMouseMove);
        window.removeEventListener('mouseup', wrappedMouseUp);
      };
    }
  }, [isDragging, handleBackgroundMouseMove, handleBackgroundMouseUp]);

  useEffect(() => {
    if (draggingElementId) {
      // Wrap mouseup handler to pass event for color picker detection
      const wrappedMouseUp = (e: MouseEvent) => handleElementMouseUp(e);
      window.addEventListener('mousemove', handleElementMouseMove);
      window.addEventListener('mouseup', wrappedMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleElementMouseMove);
        window.removeEventListener('mouseup', wrappedMouseUp);
      };
    }
  }, [draggingElementId, handleElementMouseMove, handleElementMouseUp]);

  // Handle click outside to deselect and stop drag
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if click is inside Overlay Options area
      const overlayOptionsArea = target.closest('.overlay-options-area');
      const isElement = target.closest('[data-element-id]');
      
      // If clicking outside Overlay Options area (and not on an element), deselect and stop drag
      if (!overlayOptionsArea && !isElement) {
        // Stop any active drag
        if (draggingElementId) {
          setDraggingElementId(null);
          elementDragStart.current = null;
        }
        
        if (stateManager && runtimeState) {
          // Dispatch clear selection action to runtime
          const oldSelectedIds = Array.from(runtimeState.selection.selectedIds);
          const oldLastSelectedId = runtimeState.selection.lastSelectedId;
          const newSelectedIds: string[] = [];
          const newLastSelectedId: string | null = null;
          
          // Only dispatch if there was a selection
          if (oldSelectedIds.length > 0) {
            const action = createSelectAction(
              oldSelectedIds,
              newSelectedIds,
              oldLastSelectedId,
              newLastSelectedId
            );
            stateManager.dispatch(action);
          }
        }
      }
    };

    const hasSelection = runtimeState?.selection.selectedIds.size ?? 0 > 0;
    if (hasSelection || draggingElementId) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [draggingElementId, stateManager, runtimeState]);

  const selectedElementId = runtimeState?.selection.lastSelectedId ?? null;
  
  // Keyboard arrow key movement for selected element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys when an element is selected and not dragging/resizing/rotating
      if (!selectedElementId || draggingElementId) {
        return;
      }

      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Determine movement direction (LCD coordinates: 1 unit per arrow key press)
      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowUp':
          dy = -1; // Move up (negative Y in LCD coordinates)
          break;
        case 'ArrowDown':
          dy = 1; // Move down (positive Y in LCD coordinates)
          break;
        case 'ArrowLeft':
          dx = -1; // Move left (negative X in LCD coordinates)
          break;
        case 'ArrowRight':
          dx = 1; // Move right (positive X in LCD coordinates)
          break;
        default:
          return; // Not an arrow key, ignore
      }

      // Prevent default scrolling behavior
      e.preventDefault();

      if (stateManager && runtimeState && activePresetId) {
        // Get selected element ID from runtime state
        const selectedId = runtimeState.selection.lastSelectedId;
        if (!selectedId) return;
        
        // Get current element state from runtime
        const element = getElementFromStore(runtimeState.elements, selectedId);
        if (!element) return;

        // Calculate new position (LCD coordinates: direct addition)
        const newX = element.x + dx;
        const newY = element.y + dy;

        // Apply boundary constraint (constrainToCircle)
        const constrained = constrainToCircle(element, newX, newY, offsetScale);

        // Create new element state
        const newElement = {
          ...element,
          x: constrained.x,
          y: constrained.y,
        };

        // Create transform action and dispatch
        const oldStates = new Map<string, typeof element>();
        const newStates = new Map<string, typeof newElement>();
        oldStates.set(element.id, element);
        newStates.set(element.id, newElement);

        const action = createTransformAction([element.id], oldStates, newStates);
        stateManager.dispatch(action);
      } else {
        if (IS_DEV) {
          devWarn('useDragHandlers', 'Keyboard move called but runtime not available');
        }
      }
    };

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [draggingElementId, offsetScale, activePresetId, stateManager, runtimeState]);

  return {
    // Background drag
    isDragging,
    handleBackgroundMouseDown,
    
    // Element drag (unified)
    draggingElementId,
    selectedElementId, // Now derived from runtime state
    setSelectedElementId: () => {}, // No-op - selection is managed by runtime state
    handleElementMouseDown,
    
    // Snapping guides
    activeGuides,
  };
}
