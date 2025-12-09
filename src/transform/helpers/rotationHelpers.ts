/**
 * Rotation helper functions for multi-select transforms.
 * 
 * These are pure utility functions for rotating points and normalizing angles.
 * Used in multi-select rotation operations.
 */

/**
 * Rotate a point around the origin (0, 0) by a given angle in degrees.
 * 
 * @param dx - X offset from center
 * @param dy - Y offset from center
 * @param angleDeg - Rotation angle in degrees
 * @returns Rotated point { x, y }
 */
export function rotatePoint(dx: number, dy: number, angleDeg: number): { x: number; y: number } {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  return {
    x: dx * cos - dy * sin,
    y: dx * sin + dy * cos,
  };
}

/**
 * Normalize an angle to the range [0, 360).
 * 
 * @param angle - Angle in degrees (can be any value)
 * @returns Normalized angle in [0, 360) range
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

