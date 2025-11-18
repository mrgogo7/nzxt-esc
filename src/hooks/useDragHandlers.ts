import { useState, useRef, useCallback, useEffect } from 'react';
import { previewToLcd } from '../utils/positioning';
import { constrainToCircle } from '../utils/boundaries';
import { detectAlignment, applySnapping, type AlignmentGuide, type SnappingState } from '../utils/snapping';
import type { Overlay } from '../types/overlay';
import type { AppSettings } from '../constants/defaults';

/**
 * Hook for managing all drag handlers in ConfigPreview.
 * 
 * FAZ3: Fully migrated to element-based drag handlers.
 * Handles:
 * - Background drag (media positioning)
 * - Element drag (unified for all element types: metric, text, divider)
 * 
 * @param offsetScale - Scale factor for converting preview to LCD pixels
 * @param settingsRef - Ref to current settings (to avoid stale closures)
 * @param setSettings - Settings setter function
 */
export function useDragHandlers(
  offsetScale: number,
  settingsRef: React.MutableRefObject<AppSettings>,
  setSettings: (settings: AppSettings) => void
) {
  // Background drag state
  const [isDragging, setIsDragging] = useState(false);
  
  // Element drag state (unified for all element types)
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Phase 4.2: Snapping guides state
  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);
  
  // Phase 4.2: Snapping state for escape tolerance
  const snappingState = useRef<SnappingState>({
    lastSnappedX: null,
    lastSnappedY: null,
    escapeVelocityX: 0,
    escapeVelocityY: 0,
  });

  // Drag refs
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const elementDragStart = useRef<{ x: number; y: number; elementId: string } | null>(null);
  const selectedItemMousePos = useRef<{ x: number; y: number } | null>(null);
  
  // Phase 4.2: Previous position for velocity calculation
  const lastPosition = useRef<{ x: number; y: number } | null>(null);

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
    setSettings({
      ...currentSettings,
      x: currentSettings.x + lcdDx,
      y: currentSettings.y + lcdDy,
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
    } else {
      // First click: just select, don't start dragging
      setSelectedElementId(elementId);
      selectedItemMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [selectedElementId]);

  const handleElementMouseMove = useCallback((e: MouseEvent) => {
    if (!elementDragStart.current) return;

    const dx = e.clientX - elementDragStart.current.x;
    const dy = e.clientY - elementDragStart.current.y;
    elementDragStart.current = { ...elementDragStart.current, x: e.clientX, y: e.clientY };

    // CRITICAL: Convert preview pixels to LCD pixels
    const lcdDx = previewToLcd(dx, offsetScale);
    const lcdDy = previewToLcd(dy, offsetScale);

    // Use ref to get current settings value
    const currentSettings = settingsRef.current;
    const currentOverlay = currentSettings.overlay;
    
    // Ensure overlay is in new format (should always be after migration)
    if (!currentOverlay || typeof currentOverlay !== 'object' || !('elements' in currentOverlay)) {
      return;
    }
    
    const overlay = currentOverlay as Overlay;
    const elementIndex = overlay.elements.findIndex(el => el.id === elementDragStart.current!.elementId);
    
    if (elementIndex !== -1) {
      const element = overlay.elements[elementIndex];
      const newX = element.x + lcdDx;
      const newY = element.y + lcdDy;
      
      // Phase 4.2: Calculate velocity for escape detection
      if (lastPosition.current) {
        snappingState.current.escapeVelocityX = newX - lastPosition.current.x;
        snappingState.current.escapeVelocityY = newY - lastPosition.current.y;
      }
      lastPosition.current = { x: newX, y: newY };
      
      // Phase 4.2: Snapping - detect alignment guides (only show when within threshold)
      const otherElements = overlay.elements.filter(el => el.id !== element.id);
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
      
      // Phase 4.2: Boundary control - constrain element to stay within circle
      const constrained = constrainToCircle(element, snapped.x, snapped.y, offsetScale);
      
      const updatedElements = [...overlay.elements];
      updatedElements[elementIndex] = {
        ...updatedElements[elementIndex],
        x: constrained.x,
        y: constrained.y,
      };
      
      setSettings({
        ...currentSettings,
        overlay: {
          ...overlay,
          elements: updatedElements,
        },
      });
    }
  }, [offsetScale, setSettings, settingsRef]);

  const handleElementMouseUp = useCallback(() => {
    setDraggingElementId(null);
    elementDragStart.current = null;
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
  }, []);

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
        setSelectedElementId(null);
        selectedItemMousePos.current = null;
      }
    };

    if (selectedElementId || draggingElementId) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [selectedElementId, draggingElementId]);

  return {
    // Background drag
    isDragging,
    handleBackgroundMouseDown,
    
    // Element drag (unified)
    draggingElementId,
    selectedElementId,
    handleElementMouseDown,
    
    // Phase 4.2: Snapping guides
    activeGuides,
  };
}
