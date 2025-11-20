/**
 * RotateOperation.ts
 * 
 * Rotate operation for TransformEngine v1.
 * 
 * This module handles element rotation with proper coordinate system handling.
 * It fixes Bug #7: coordinate system inconsistency in rotation calculations.
 * 
 * Key Fix: All rotation calculations are done in LCD coordinates (canonical
 * coordinate system), ensuring consistency between preview and LCD displays.
 * 
 * Design Decisions:
 * - Center-origin rotation (element center is rotation pivot)
 * - Soft snap-to-angle (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
 * - Rotation angle stored in degrees (0-360)
 */

import type { OverlayElement } from '../../types/overlay';
import { screenToLcd } from '../engine/CoordinateSystem';

/**
 * Rotate operation result.
 */
export interface RotateResult {
  /** Updated element with new rotation angle */
  element: OverlayElement;
  /** New rotation angle in degrees (0-360) */
  angle: number;
}

/**
 * Rotate operation configuration.
 */
export interface RotateOperationConfig {
  /** Offset scale factor (preview to LCD) */
  offsetScale: number;
  /** Preview container bounding rect */
  previewRect: DOMRect;
  /** Initial mouse position when rotation started (in screen coordinates) */
  startMousePos: { x: number; y: number };
  /** Initial element angle when rotation started (in degrees) */
  initialAngle: number;
  /** Element center position in LCD coordinates */
  elementCenter: { x: number; y: number };
}

/**
 * Snap angles in degrees.
 */
const SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360] as const;

/**
 * Snap threshold in degrees.
 * Elements within this angle will snap to common angles.
 */
const ROTATION_SNAP_THRESHOLD = 3;

/**
 * Rotates an element based on mouse position.
 * 
 * This function calculates the rotation angle from the mouse position relative
 * to the element center, accounting for the initial angle offset to maintain
 * smooth rotation behavior.
 * 
 * Bug #7 Fix: All calculations are done in LCD coordinates (canonical system),
 * ensuring consistency between preview and LCD displays.
 * 
 * @param element - Element to rotate
 * @param currentMousePos - Current mouse position in screen coordinates
 * @param config - Rotate operation configuration
 * @returns Updated element with new rotation angle
 */
export function rotateElement(
  element: OverlayElement,
  currentMousePos: { x: number; y: number },
  config: RotateOperationConfig
): RotateResult {
  // Convert current mouse position to LCD coordinates
  const currentMouseLcd = screenToLcd(
    currentMousePos.x,
    currentMousePos.y,
    config.previewRect,
    config.offsetScale
  );
  
  // Convert start mouse position to LCD coordinates
  const startMouseLcd = screenToLcd(
    config.startMousePos.x,
    config.startMousePos.y,
    config.previewRect,
    config.offsetScale
  );
  
  // Calculate angle from element center to current mouse position
  // WHY: We need the angle between element center and mouse to determine
  // rotation. All calculations are in LCD coordinates (canonical system)
  // to ensure consistency between preview and LCD displays.
  const currentAngle = calculateAngleFromCenter(
    config.elementCenter,
    currentMouseLcd
  );
  
  // Calculate angle from element center to start mouse position
  // WHY: We need the initial mouse angle to calculate the offset.
  // This offset ensures smooth rotation behavior - the element rotates
  // relative to where the user started dragging, not from 0°.
  const startAngle = calculateAngleFromCenter(
    config.elementCenter,
    startMouseLcd
  );
  
  // Calculate angle offset (difference between start and initial)
  // WHY: This offset preserves the relative rotation between mouse and element.
  // Without this, the element would "jump" to match the mouse angle immediately.
  const angleOffset = startAngle - config.initialAngle;
  
  // Calculate new angle: current angle minus offset
  // WHY: This gives us the element's new rotation angle, accounting for
  // the initial offset. The element rotates smoothly as the mouse moves.
  let newAngle = currentAngle - angleOffset;
  
  // Normalize to 0-360 range
  newAngle = normalizeAngle(newAngle);
  
  // Apply soft snapping
  const snappedAngle = applyRotationSnapping(newAngle);
  
  // Round to integer (angle should always be integer)
  const roundedAngle = Math.round(snappedAngle);
  
  // Update element
  const updatedElement: OverlayElement = {
    ...element,
    angle: roundedAngle === 0 ? undefined : roundedAngle, // Omit angle if 0
  };
  
  return {
    element: updatedElement,
    angle: roundedAngle,
  };
}

/**
 * Calculates angle from element center to a point.
 * 
 * Returns angle in degrees (0-360), where 0° points up (standard design tool behavior).
 * 
 * @param center - Element center in LCD coordinates
 * @param point - Point in LCD coordinates
 * @returns Angle in degrees (0-360)
 */
function calculateAngleFromCenter(
  center: { x: number; y: number },
  point: { x: number; y: number }
): number {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  
  // Calculate angle using atan2
  // WHY: atan2(dy, dx) gives us the angle from positive X-axis to the point.
  // atan2 returns: 0° = right, 90° = up, 180° = left, 270° = down
  // But we want: 0° = up (standard design tool behavior)
  // So we add 90° to rotate the coordinate system.
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;
  
  // Convert to 0-360 range with 0° pointing up
  // WHY: Design tools (Figma, Sketch) use 0° = up convention.
  // We add 90° to convert from atan2's coordinate system (0° = right)
  // to our coordinate system (0° = up).
  return normalizeAngle(angleDeg + 90);
}

/**
 * Normalizes an angle to 0-360 range.
 * 
 * @param angle - Angle in degrees
 * @returns Normalized angle (0-360)
 */
function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Applies soft snapping to common angles.
 * 
 * If the angle is within the snap threshold of a common angle,
 * it snaps to that angle. Otherwise, returns the original angle.
 * 
 * @param angle - Current angle in degrees
 * @returns Snapped angle if within threshold, otherwise original angle
 */
function applyRotationSnapping(angle: number): number {
  const normalized = normalizeAngle(angle);
  
  // Check each snap angle
  for (const snapAngle of SNAP_ANGLES) {
    const diff = Math.abs(normalized - snapAngle);
    // Handle wrap-around (e.g., 359° is close to 0°)
    const diffWrapped = Math.min(diff, 360 - diff);
    
    if (diffWrapped <= ROTATION_SNAP_THRESHOLD) {
      // Snap to this angle (normalize 360° to 0°)
      return snapAngle === 360 ? 0 : snapAngle;
    }
  }
  
  return normalized;
}

