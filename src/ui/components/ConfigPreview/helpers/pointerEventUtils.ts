/**
 * Pointer Event Utilities
 * 
 * Utility functions for handling pointer/mouse events in ConfigPreview.
 * These helpers extract relevant data from mouse events for transform operations.
 * 
 * Design Principles:
 * - Pure functions (no side effects)
 * - Coordinate conversion utilities
 * - Event data extraction
 */

/**
 * Extract mouse delta from two mouse positions.
 * 
 * @param startPos - Start mouse position (clientX, clientY)
 * @param currentPos - Current mouse position (clientX, clientY)
 * @returns Mouse delta in screen pixels
 */
export function getMouseDelta(
  startPos: { x: number; y: number },
  currentPos: { x: number; y: number }
): { x: number; y: number } {
  return {
    x: currentPos.x - startPos.x,
    y: currentPos.y - startPos.y,
  };
}

/**
 * Convert preview coordinates to LCD coordinates.
 * 
 * @param previewValue - Value in preview pixels
 * @param offsetScale - Scale factor (previewSize / lcdResolution)
 * @returns Value in LCD pixels
 */
export function previewToLcd(previewValue: number, offsetScale: number): number {
  return previewValue / offsetScale;
}

/**
 * Convert LCD coordinates to preview coordinates.
 * 
 * @param lcdValue - Value in LCD pixels
 * @param offsetScale - Scale factor (previewSize / lcdResolution)
 * @returns Value in preview pixels
 */
export function lcdToPreview(lcdValue: number, offsetScale: number): number {
  return lcdValue * offsetScale;
}

/**
 * Get preview container bounding rect.
 * 
 * @returns Preview container DOMRect or null if not found
 */
export function getPreviewContainerRect(): DOMRect | null {
  const previewContainer = document.querySelector('.overlay-preview');
  if (!previewContainer) {
    return null;
  }
  return previewContainer.getBoundingClientRect();
}

/**
 * Convert screen coordinates to preview coordinates relative to preview container.
 * 
 * @param screenX - Screen X coordinate (clientX)
 * @param screenY - Screen Y coordinate (clientY)
 * @param previewRect - Preview container bounding rect
 * @returns Coordinates relative to preview container
 */
export function screenToPreview(
  screenX: number,
  screenY: number,
  previewRect: DOMRect
): { x: number; y: number } {
  return {
    x: screenX - previewRect.left,
    y: screenY - previewRect.top,
  };
}

