/**
 * Boundary control utilities for overlay elements.
 * Soft boundary - only element center must stay within circle.
 * Element bounding box is allowed to overflow beyond the circle mask.
 */

import { NZXT_DEFAULTS } from '../constants/nzxt';
import type { OverlayElement } from '../types/overlay';
import { calculateElementDimensions } from '../transform/engine/BoundingBox';

/**
 * LCD circle radius in pixels (640px diameter = 320px radius).
 */
const LCD_RADIUS = NZXT_DEFAULTS.LCD_WIDTH / 2;

/**
 * Calculates the bounding box of an element in LCD coordinates.
 * Returns the element's approximate bounds for boundary checking.
 */
export function getElementBounds(
  element: OverlayElement,
  _offsetScale: number
): { left: number; right: number; top: number; bottom: number; width: number; height: number } {
  // Use centralized dimension calculation from BoundingBox.ts
  const { width, height } = calculateElementDimensions(element);

  // Element position is centered, so bounds are relative to center
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return {
    left: element.x - halfWidth,
    right: element.x + halfWidth,
    top: element.y - halfHeight,
    bottom: element.y + halfHeight,
    width,
    height,
  };
}

/**
 * Checks if a point (x, y) in LCD coordinates is within the LCD circle.
 */
export function isWithinCircle(x: number, y: number): boolean {
  const distance = Math.sqrt(x * x + y * y);
  return distance <= LCD_RADIUS;
}

/**
 * Constrains an element position (no constraint - free movement).
 * No boundary limits - elements can move anywhere.
 * The circle mask will naturally clip the visual overflow.
 * 
 * @param _element - The element being dragged (not used)
 * @param newX - New X position of element center
 * @param newY - New Y position of element center
 * @param _offsetScale - Scale factor (not used)
 * @returns Unconstrained x, y coordinates (free movement)
 */
export function constrainToCircle(
  _element: OverlayElement,
  newX: number,
  newY: number,
  _offsetScale: number
): { x: number; y: number } {
  // No boundary constraint - allow free movement anywhere
  // Circle mask will handle visual clipping
  // Ensure integer values for position
  return { x: Math.round(newX), y: Math.round(newY) };
}

/**
 * Calculates the distance from center for a given position.
 */
export function getDistanceFromCenter(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

