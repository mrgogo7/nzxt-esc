/**
 * Transform Request Helpers — FAZ-3B-3: Transform API Integration
 * 
 * Helper functions to create TransformRequest objects from UI events.
 * These helpers convert UI interactions (mouse events, handles) into
 * TransformRequest format compatible with FAZ-3A Transform API.
 * 
 * Design Principles:
 * - UI → LCD coordinate conversion happens here
 * - Pure functions (no side effects)
 * - Multi-select ready (supports single and multi-select)
 */

import type { OverlayElement } from '../../../../types/overlay';
import type { ResizeHandle } from '../../../../transform/engine/HandlePositioning';

/**
 * Transform request types (conceptual, based on FAZ-3A design).
 * 
 * Note: This is a simplified version for FAZ-3B-3 integration.
 * Full Transform API implementation will be in FAZ-3B-4.
 */
export interface MoveRequest {
  type: 'move';
  elementIds: string[];
  deltaX: number; // LCD delta
  deltaY: number; // LCD delta
}

export interface ResizeRequest {
  type: 'resize';
  elementIds: string[];
  handle: ResizeHandle;
  deltaWidth: number; // LCD delta
  deltaHeight: number; // LCD delta
  preserveAspect?: boolean;
}

export interface RotateRequest {
  type: 'rotate';
  elementIds: string[];
  deltaAngle: number; // Degrees
  pivot?: { x: number; y: number }; // LCD coordinates (optional, defaults to center)
}

export type TransformRequest = MoveRequest | ResizeRequest | RotateRequest;

/**
 * Create MoveRequest from mouse delta.
 * Converts preview delta to LCD delta.
 * 
 * @param elementIds - Element IDs to move (single or multi-select)
 * @param previewDeltaX - Mouse delta X in preview pixels
 * @param previewDeltaY - Mouse delta Y in preview pixels
 * @param offsetScale - Scale factor (previewSize / lcdResolution)
 * @returns MoveRequest in LCD coordinates
 */
export function createMoveRequest(
  elementIds: string[],
  previewDeltaX: number,
  previewDeltaY: number,
  offsetScale: number
): MoveRequest {
  // Convert preview delta to LCD delta
  const lcdDeltaX = previewDeltaX / offsetScale;
  const lcdDeltaY = previewDeltaY / offsetScale;
  
  return {
    type: 'move',
    elementIds,
    deltaX: lcdDeltaX,
    deltaY: lcdDeltaY,
  };
}

/**
 * Create ResizeRequest from mouse delta and handle.
 * Converts preview delta to LCD delta.
 * 
 * @param elementIds - Element IDs to resize (single or multi-select)
 * @param handle - Resize handle (e.g., 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w')
 * @param previewDeltaX - Mouse delta X in preview pixels
 * @param previewDeltaY - Mouse delta Y in preview pixels
 * @param offsetScale - Scale factor (previewSize / lcdResolution)
 * @param preserveAspect - Whether to preserve aspect ratio (optional)
 * @returns ResizeRequest in LCD coordinates
 */
export function createResizeRequest(
  elementIds: string[],
  handle: ResizeHandle,
  previewDeltaX: number,
  previewDeltaY: number,
  offsetScale: number,
  preserveAspect?: boolean
): ResizeRequest {
  // Convert preview delta to LCD delta
  const lcdDeltaX = previewDeltaX / offsetScale;
  const lcdDeltaY = previewDeltaY / offsetScale;
  
  // Note: For now, we pass delta directly. Actual resize logic
  // will calculate width/height changes based on handle.
  // This is a simplified version - full implementation in FAZ-3B-4.
  return {
    type: 'resize',
    elementIds,
    handle,
    deltaWidth: lcdDeltaX,
    deltaHeight: lcdDeltaY,
    preserveAspect,
  };
}

/**
 * Create RotateRequest from mouse delta.
 * Calculates angle delta from mouse movement around pivot.
 * 
 * @param elementIds - Element IDs to rotate (single or multi-select)
 * @param startMousePos - Start mouse position (screen coordinates)
 * @param currentMousePos - Current mouse position (screen coordinates)
 * @param pivotX - Pivot point X in LCD coordinates
 * @param pivotY - Pivot point Y in LCD coordinates
 * @param offsetScale - Scale factor (previewSize / lcdResolution)
 * @param initialAngle - Initial angle (degrees)
 * @returns RotateRequest with angle delta
 */
export function createRotateRequest(
  elementIds: string[],
  startMousePos: { x: number; y: number },
  currentMousePos: { x: number; y: number },
  pivotX: number,
  pivotY: number,
  offsetScale: number,
  initialAngle: number
): RotateRequest {
  // Convert pivot from LCD to screen coordinates for angle calculation
  const pivotScreenX = pivotX * offsetScale;
  const pivotScreenY = pivotY * offsetScale;
  
  // Calculate angles
  const startAngle = Math.atan2(
    startMousePos.y - pivotScreenY,
    startMousePos.x - pivotScreenX
  ) * (180 / Math.PI);
  
  const currentAngle = Math.atan2(
    currentMousePos.y - pivotScreenY,
    currentMousePos.x - pivotScreenX
  ) * (180 / Math.PI);
  
  // Calculate delta angle
  let deltaAngle = currentAngle - startAngle;
  
  // Normalize to -180 to 180 range
  while (deltaAngle > 180) deltaAngle -= 360;
  while (deltaAngle < -180) deltaAngle += 360;
  
  // Add to initial angle
  const newAngle = initialAngle + deltaAngle;
  
  // Normalize new angle to 0-360
  const normalizedAngle = ((newAngle % 360) + 360) % 360;
  
  // Return delta angle
  return {
    type: 'rotate',
    elementIds,
    deltaAngle: normalizedAngle - initialAngle,
    pivot: { x: pivotX, y: pivotY },
  };
}

/**
 * Get combined AABB center for multi-select pivot.
 * 
 * @param elements - Elements to calculate pivot for
 * @returns Pivot point in LCD coordinates
 */
export function getCombinedAABBCenter(elements: OverlayElement[]): { x: number; y: number } {
  if (elements.length === 0) {
    return { x: 0, y: 0 };
  }
  
  if (elements.length === 1) {
    return { x: elements[0].x, y: elements[0].y };
  }
  
  // Calculate combined bounding box
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (const element of elements) {
    // For now, use element center as bounds (simplified)
    // Full AABB calculation should use element dimensions
    minX = Math.min(minX, element.x);
    minY = Math.min(minY, element.y);
    maxX = Math.max(maxX, element.x);
    maxY = Math.max(maxY, element.y);
  }
  
  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
  };
}

