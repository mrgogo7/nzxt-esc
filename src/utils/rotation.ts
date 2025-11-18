/**
 * Rotation utilities for overlay elements.
 * Handles rotation calculations, snapping, and angle normalization.
 */

/**
 * Common angles for snapping (in degrees).
 */
export const SNAP_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360] as const;

/**
 * Snapping tolerance in degrees.
 * Elements within this angle will snap to common angles.
 */
const ROTATION_SNAP_THRESHOLD = 3; // degrees

/**
 * Normalizes an angle to 0-360 range.
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

/**
 * Calculates rotation angle from mouse position relative to element center.
 * 
 * @param centerX - Element center X in preview coordinates
 * @param centerY - Element center Y in preview coordinates
 * @param mouseX - Mouse X in preview coordinates
 * @param mouseY - Mouse Y in preview coordinates
 * @returns Rotation angle in degrees (0-360)
 */
export function calculateRotationAngle(
  centerX: number,
  centerY: number,
  mouseX: number,
  mouseY: number
): number {
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Convert from atan2 range (-180 to 180) to 0-360
  return normalizeAngle(angle + 90); // +90 to make 0° point up (standard design tool behavior)
}

/**
 * Applies soft snapping to common angles.
 * 
 * @param angle - Current angle in degrees
 * @returns Snapped angle if within threshold, otherwise original angle
 */
export function applyRotationSnapping(angle: number): number {
  const normalized = normalizeAngle(angle);
  
  // Check each snap angle
  for (const snapAngle of SNAP_ANGLES) {
    const diff = Math.abs(normalized - snapAngle);
    const diffWrapped = Math.min(diff, 360 - diff); // Handle wrap-around (e.g., 359° is close to 0°)
    
    if (diffWrapped <= ROTATION_SNAP_THRESHOLD) {
      return snapAngle === 360 ? 0 : snapAngle; // Normalize 360° to 0°
    }
  }
  
  return normalized;
}

/**
 * Calculates rotated bounding box dimensions.
 * Returns the axis-aligned bounding box (AABB) for a rotated rectangle.
 * 
 * @param width - Original width
 * @param height - Original height
 * @param angle - Rotation angle in degrees
 * @returns AABB width and height
 */
export function getRotatedBoundingBox(
  width: number,
  height: number,
  angle: number
): { width: number; height: number } {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  
  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos,
  };
}

