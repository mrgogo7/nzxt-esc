import { useCallback, useRef, useState, useEffect } from 'react';
import { previewToLcd } from '../../../../utils/positioning';

/**
 * Common drag handler utilities for preview elements.
 * Handles mouse down, move, and up events with LCD pixel conversion.
 */

export interface DragState {
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
}

/**
 * Creates a drag handler that converts preview pixels to LCD pixels.
 * 
 * @param offsetScale - Scale factor for converting preview to LCD coordinates
 * @param onDrag - Callback called on each drag movement with LCD delta values
 * @returns Object with drag state and handlers
 */
export function useDragHandler(
  offsetScale: number,
  onDrag: (lcdDx: number, lcdDy: number) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStart.current) return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragStart.current = { x: e.clientX, y: e.clientY };

      // CRITICAL: Convert preview pixels to LCD pixels
      const lcdDx = previewToLcd(dx, offsetScale);
      const lcdDy = previewToLcd(dy, offsetScale);

      onDrag(lcdDx, lcdDy);
    },
    [offsetScale, onDrag]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    handleMouseDown,
  };
}

/**
 * Creates a drag handler for custom items (readings/texts) with selection support.
 * 
 * @param offsetScale - Scale factor for converting preview to LCD coordinates
 * @param itemId - ID of the item being dragged
 * @param isSelected - Whether the item is currently selected
 * @param onSelect - Callback when item is first clicked (selection)
 * @param onDrag - Callback called on each drag movement with LCD delta values
 * @returns Object with drag state and handlers
 */
export function useCustomItemDragHandler(
  offsetScale: number,
  itemId: string,
  isSelected: boolean,
  onSelect: () => void,
  onDrag: (lcdDx: number, lcdDy: number) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // If already selected, start dragging immediately
      if (isSelected) {
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
      } else {
        // First click: just select, don't start dragging
        onSelect();
      }
    },
    [isSelected, onSelect]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStart.current) return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      dragStart.current = { x: e.clientX, y: e.clientY };

      // CRITICAL: Convert preview pixels to LCD pixels
      const lcdDx = previewToLcd(dx, offsetScale);
      const lcdDy = previewToLcd(dy, offsetScale);

      onDrag(lcdDx, lcdDy);
    },
    [offsetScale, onDrag]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
    // Keep selected after drag ends - user can click again to drag
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    handleMouseDown,
  };
}

