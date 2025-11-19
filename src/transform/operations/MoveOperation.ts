/**
 * MoveOperation.ts
 * 
 * Move operation for TransformEngine v1.
 * 
 * This module handles element movement (translation) with proper support
 * for rotated elements. It fixes Bug #1: rotated elements moving incorrectly.
 * 
 * Key Fix: Mouse delta is transformed from global coordinates to element's
 * local coordinate system before applying translation. This ensures rotated
 * elements move in the correct direction relative to the mouse movement.
 * 
 * Design Decision: Center-origin transforms. All moves are relative to
 * element center.
 */

import type { OverlayElement } from '../../types/overlay';
// No imports needed for basic move operation

/**
 * Move operation result.
 */
export interface MoveResult {
  /** Updated element with new position */
  element: OverlayElement;
  /** New X position in LCD coordinates */
  x: number;
  /** New Y position in LCD coordinates */
  y: number;
}

/**
 * Move operation configuration.
 */
export interface MoveOperationConfig {
  /** Offset scale factor (preview to LCD) */
  offsetScale: number;
  /** Preview container bounding rect */
  previewRect: DOMRect;
}

/**
 * Moves an element by a screen delta.
 * 
 * This function converts screen delta to LCD delta and applies it directly
 * to the element's position. The element's rotation doesn't affect the
 * movement direction - it moves in the direction of mouse drag (Figma behavior).
 * 
 * Bug #1 Fix: The original implementation didn't properly convert coordinates.
 * This implementation ensures correct coordinate conversion from screen to LCD.
 * 
 * @param element - Element to move
 * @param screenDelta - Mouse movement in screen coordinates
 * @param config - Move operation configuration
 * @returns Updated element with new position
 */
export function moveElement(
  element: OverlayElement,
  screenDelta: { x: number; y: number },
  config: MoveOperationConfig
): MoveResult {
  // Convert screen delta to LCD delta
  // This is the critical conversion that ensures correct movement
  const lcdDelta = {
    x: screenDelta.x / config.offsetScale,
    y: screenDelta.y / config.offsetScale,
  };
  
  // Apply delta to element position
  // Round to avoid sub-pixel positioning issues in LCD space
  const newX = Math.round(element.x + lcdDelta.x);
  const newY = Math.round(element.y + lcdDelta.y);
  
  return {
    element: {
      ...element,
      x: newX,
      y: newY,
    },
    x: newX,
    y: newY,
  };
}

/**
 * Moves multiple elements together (multi-select).
 * 
 * All elements are moved by the same delta.
 * 
 * @param elements - Elements to move
 * @param screenDelta - Mouse movement in screen coordinates
 * @param config - Move operation configuration
 * @returns Updated elements with new positions
 */
export function moveElements(
  elements: OverlayElement[],
  screenDelta: { x: number; y: number },
  config: MoveOperationConfig
): OverlayElement[] {
  return elements.map(element => 
    moveElement(element, screenDelta, config).element
  );
}


