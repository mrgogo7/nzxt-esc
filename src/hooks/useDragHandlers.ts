import { useState, useRef, useCallback, useEffect } from 'react';
import { previewToLcd } from '../utils/positioning';
import { constrainToCircle } from '../utils/boundaries';
import { detectAlignment, applySnapping, type AlignmentGuide, type SnappingState } from '../utils/snapping';
import type { AppSettings } from '../constants/defaults';
import { moveElement, type MoveOperationConfig } from '../transform/operations/MoveOperation';
import { getElementsForPreset, updateElementInRuntime } from '../state/overlayRuntime';
// FAZ-3B-3: New runtime system imports (feature-flagged)
import type { OverlayStateManager } from '../state/overlay/stateManager';
import type { OverlayRuntimeState } from '../state/overlay/types';
import { createTransformAction, createSelectAction } from '../state/overlay/actions';
import { getElement as getElementFromStore } from '../state/overlay/elementStore';
import { shouldUseFaz3BRuntime } from '../utils/featureFlags';

/**
 * Hook for managing all drag handlers in ConfigPreview.
 * 
 * Handles:
 * - Background drag (media positioning)
 * - Element drag (unified for all element types: metric, text, divider)
 * 
 * Supports undo/redo via onMoveComplete callback.
 * 
 * @param offsetScale - Scale factor for converting preview to LCD pixels
 * @param settingsRef - Ref to current settings (to avoid stale closures)
 * @param setSettings - Settings setter function
 * @param onMoveComplete - Optional callback when move completes (for undo/redo)
 */
export function useDragHandlers(
  offsetScale: number,
  settingsRef: React.MutableRefObject<AppSettings>,
  setSettings: (settings: AppSettings) => void,
  onMoveComplete?: (elementId: string, oldPos: { x: number; y: number }, newPos: { x: number; y: number }) => void,
  activePresetId?: string | null,
  stateManager?: OverlayStateManager | null,
  runtimeState?: OverlayRuntimeState | null
) {
  // Background drag state
  const [isDragging, setIsDragging] = useState(false);
  
  // Element drag state (unified for all element types)
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
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

  const handleBackgroundMouseUp = useCallback(() => {
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
    
    // If already selected, start dragging immediately
    if (selectedElementId === elementId) {
      setDraggingElementId(elementId);
      elementDragStart.current = { x: e.clientX, y: e.clientY, elementId };
      
      // FAZ-3B-3: Start transaction for new runtime system
      const useNewRuntime = shouldUseFaz3BRuntime();
      if (useNewRuntime && stateManager && runtimeState) {
        stateManager.startTransaction();
      }
      
      // Store initial position for undo/redo
      // ARCHITECT MODE: Read from runtime overlay Map, NOT from settings
      if (activePresetId) {
        // FAZ-3B-3: Get initial state from runtime state if available
        if (useNewRuntime && runtimeState) {
          const element = getElementFromStore(runtimeState.elements, elementId);
          if (element) {
            moveInitialPosition.current = { x: element.x, y: element.y };
          }
        } else {
          const runtimeElements = getElementsForPreset(activePresetId);
          const element = runtimeElements.find(el => el.id === elementId);
          if (element) {
            moveInitialPosition.current = { x: element.x, y: element.y };
          }
        }
      }
    } else {
      // First click: just select, don't start dragging
      // FAZ-3B-4: Wire selection to runtime state if feature flag enabled
      const useNewRuntime = shouldUseFaz3BRuntime();
      if (useNewRuntime && stateManager && runtimeState) {
        // Dispatch selection action to runtime
        const oldSelectedIds = Array.from(runtimeState.selection.selectedIds);
        const oldLastSelectedId = runtimeState.selection.lastSelectedId;
        const newSelectedIds = [elementId];
        const newLastSelectedId = elementId;
        
        const action = createSelectAction(
          oldSelectedIds,
          newSelectedIds,
          oldLastSelectedId,
          newLastSelectedId
        );
        stateManager.dispatch(action);
      } else {
        // Old system: Use local state
        setSelectedElementId(elementId);
      }
    }
  }, [selectedElementId, activePresetId, stateManager, runtimeState, setSelectedElementId]);

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

    // ARCHITECT MODE: Read from runtime overlay Map, NOT from settings
    if (!activePresetId) {
      return;
    }
    
    const runtimeElements = getElementsForPreset(activePresetId);
    const element = runtimeElements.find(el => el.id === elementDragStart.current!.elementId);
    
    if (element) {
      
      // Use new MoveOperation (Bug #1 fix)
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
      const otherElements = runtimeElements.filter(el => el.id !== element.id);
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
      
      // FAZ-3B-3: Use new runtime system if feature flag is enabled
      const useNewRuntime = shouldUseFaz3BRuntime();
      if (useNewRuntime && stateManager && runtimeState) {
        // Get current element state from runtime
        const currentElement = getElementFromStore(runtimeState.elements, element.id);
        if (!currentElement) return;
        
        // Create new element state
        const newElement = {
          ...currentElement,
          x: constrained.x,
          y: constrained.y,
        };
        
        // Create transform action and dispatch (will be batched in transaction)
        const oldStates = new Map<string, typeof currentElement>();
        const newStates = new Map<string, typeof newElement>();
        oldStates.set(element.id, currentElement);
        newStates.set(element.id, newElement);
        
        const action = createTransformAction([element.id], oldStates, newStates);
        stateManager.dispatch(action); // This adds to transaction if active
      } else {
        // Old system: Update runtime overlay Map, NOT settings
        // Runtime change notification will trigger UI re-render via subscription
        updateElementInRuntime(activePresetId, element.id, (el) => ({
          ...el,
          x: constrained.x,
          y: constrained.y,
        }));
      }
      
      // Update drag start position for next frame
      elementDragStart.current = { ...elementDragStart.current, x: e.clientX, y: e.clientY };
    }
  }, [offsetScale, setSettings, settingsRef, activePresetId, stateManager, runtimeState]);

  const handleElementMouseUp = useCallback(() => {
    // FAZ-3B-3: Commit transaction for new runtime system
    const useNewRuntime = shouldUseFaz3BRuntime();
    if (useNewRuntime && stateManager) {
      // Commit transaction (batches all actions from this drag into single undo/redo entry)
      stateManager.commitTransaction();
    }
    
    // Record move action for undo/redo (old system only)
    if (!useNewRuntime && elementDragStart.current && moveInitialPosition.current && onMoveComplete && activePresetId) {
      // ARCHITECT MODE: Read from runtime overlay Map, NOT from settings
      const runtimeElements = getElementsForPreset(activePresetId);
      const element = runtimeElements.find(el => el.id === elementDragStart.current!.elementId);
      if (element && (element.x !== moveInitialPosition.current.x || element.y !== moveInitialPosition.current.y)) {
        // Only record if position actually changed
        onMoveComplete(
          elementDragStart.current.elementId,
          moveInitialPosition.current,
          { x: element.x, y: element.y }
        );
      }
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
    // Keep selected after drag ends - user can click again to drag
  }, [onMoveComplete, activePresetId, stateManager]);

  // Event listeners for drag handlers
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleBackgroundMouseMove);
      window.addEventListener('mouseup', handleBackgroundMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleBackgroundMouseMove);
        window.removeEventListener('mouseup', handleBackgroundMouseUp);
      };
    }
  }, [isDragging, handleBackgroundMouseMove, handleBackgroundMouseUp]);

  useEffect(() => {
    if (draggingElementId) {
      window.addEventListener('mousemove', handleElementMouseMove);
      window.addEventListener('mouseup', handleElementMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleElementMouseMove);
        window.removeEventListener('mouseup', handleElementMouseUp);
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
        
        // Deselect
        // FAZ-3B-4: Wire deselection to runtime state if feature flag enabled
        const useNewRuntime = shouldUseFaz3BRuntime();
        if (useNewRuntime && stateManager && runtimeState) {
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
        } else {
          // Old system: Use local state
          setSelectedElementId(null);
        }
      }
    };

    if (selectedElementId || draggingElementId) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [selectedElementId, draggingElementId]);

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

      // ARCHITECT MODE: Read from runtime overlay Map, NOT from settings
      if (!activePresetId) {
        return;
      }

      const runtimeElements = getElementsForPreset(activePresetId);
      const element = runtimeElements.find(el => el.id === selectedElementId);

      if (!element) {
        return;
      }

      // Store initial position for undo/redo
      const oldPos = { x: element.x, y: element.y };

      // Calculate new position (LCD coordinates: direct addition)
      const newX = element.x + dx;
      const newY = element.y + dy;

      // Apply boundary constraint (constrainToCircle)
      const constrained = constrainToCircle(element, newX, newY, offsetScale);

      // ARCHITECT MODE: Update runtime overlay Map, NOT settings
      // Runtime change notification will trigger UI re-render via subscription
      updateElementInRuntime(activePresetId, element.id, (el) => ({
        ...el,
        x: constrained.x,
        y: constrained.y,
      }));

      // Record move action for undo/redo (only if position actually changed)
      if (onMoveComplete && (constrained.x !== oldPos.x || constrained.y !== oldPos.y)) {
        onMoveComplete(selectedElementId, oldPos, { x: constrained.x, y: constrained.y });
      }
    };

    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElementId, draggingElementId, offsetScale, onMoveComplete, activePresetId]);

  return {
    // Background drag
    isDragging,
    handleBackgroundMouseDown,
    
    // Element drag (unified)
    draggingElementId,
    selectedElementId,
    setSelectedElementId,
    handleElementMouseDown,
    
    // Snapping guides
    activeGuides,
  };
}
