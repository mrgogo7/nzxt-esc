/**
 * Hook for managing element rotation handlers.
 * 
 * Phase 4.2: Rotation support with smooth rotation and snapping.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { calculateRotationAngle, applyRotationSnapping, normalizeAngle } from '../utils/rotation';
import type { Overlay } from '../types/overlay';
import type { AppSettings } from '../constants/defaults';

/**
 * Hook for managing element rotation.
 */
export function useRotationHandlers(
  _offsetScale: number,
  settingsRef: React.MutableRefObject<AppSettings>,
  setSettings: (settings: AppSettings) => void
) {
  const [rotatingElementId, setRotatingElementId] = useState<string | null>(null);
  const rotationStart = useRef<{
    startX: number;
    startY: number;
    centerX: number;
    centerY: number;
    elementId: string;
    initialAngle: number;
    angleOffset: number;
  } | null>(null);

  const handleRotationMouseDown = useCallback((
    elementId: string,
    centerX: number,
    centerY: number,
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
    
    if (!element) return;
    
    // Get preview container to convert mouse position
    const previewContainer = document.querySelector('.overlay-preview');
    if (!previewContainer) return;
    
    const rect = previewContainer.getBoundingClientRect();
    const previewCenterX = rect.left + rect.width / 2;
    const previewCenterY = rect.top + rect.height / 2;
    
    // Convert initial mouse position to preview coordinates
    const startMouseX = e.clientX - previewCenterX;
    const startMouseY = e.clientY - previewCenterY;
    
    // Calculate initial angle from mouse position
    const startAngle = calculateRotationAngle(centerX, centerY, startMouseX, startMouseY);
    
    // Get current element angle
    const currentElementAngle = element.angle ?? 0;
    
    // Calculate offset between mouse angle and element angle
    const angleOffset = startAngle - currentElementAngle;
    
    setRotatingElementId(elementId);
    rotationStart.current = {
      startX: e.clientX,
      startY: e.clientY,
      centerX,
      centerY,
      elementId,
      initialAngle: currentElementAngle,
      angleOffset, // Store offset to maintain relative rotation
    };
  }, [settingsRef]);

  const handleRotationMouseMove = useCallback((e: MouseEvent) => {
    if (!rotationStart.current) return;

    // Get element center in preview coordinates (already in preview space)
    const centerX = rotationStart.current.centerX;
    const centerY = rotationStart.current.centerY;
    
    // Get current mouse position in preview coordinates
    // Find the overlay preview container to get its position
    const previewContainer = document.querySelector('.overlay-preview');
    if (!previewContainer) return;
    
    const rect = previewContainer.getBoundingClientRect();
    // Preview circle is 200px, centered in container
    // Preview coordinates: (0,0) is at preview center
    const previewCenterX = rect.left + rect.width / 2;
    const previewCenterY = rect.top + rect.height / 2;
    
    // Convert mouse position to preview coordinates (relative to preview center)
    const mouseX = e.clientX - previewCenterX;
    const mouseY = e.clientY - previewCenterY;
    
    // Calculate rotation angle from current mouse position
    const currentAngle = calculateRotationAngle(centerX, centerY, mouseX, mouseY);
    
    // Calculate new angle: current mouse angle minus the offset
    const angleOffset = rotationStart.current.angleOffset;
    let newAngle = currentAngle - angleOffset;
    
    // Normalize to 0-360 range
    newAngle = normalizeAngle(newAngle);
    
    // Apply soft snapping
    const snappedAngle = applyRotationSnapping(newAngle);
    
    const currentSettings = settingsRef.current;
    const currentOverlay = currentSettings.overlay;
    
    if (!currentOverlay || typeof currentOverlay !== 'object' || !('elements' in currentOverlay)) {
      return;
    }
    
    const overlay = currentOverlay as Overlay;
    const elementIndex = overlay.elements.findIndex(el => el.id === rotationStart.current!.elementId);
    
    if (elementIndex !== -1) {
      const updatedElements = [...overlay.elements];
      updatedElements[elementIndex] = {
        ...updatedElements[elementIndex],
        angle: snappedAngle === 0 ? undefined : snappedAngle, // Omit angle if 0 for cleaner data
      };
      
      setSettings({
        ...currentSettings,
        overlay: {
          ...overlay,
          elements: updatedElements,
        },
      });
    }
  }, [setSettings, settingsRef]);

  const handleRotationMouseUp = useCallback(() => {
    setRotatingElementId(null);
    rotationStart.current = null;
  }, []);

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

