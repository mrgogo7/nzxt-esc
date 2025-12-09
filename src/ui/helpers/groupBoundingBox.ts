/**
 * Group Bounding Box (UI Layer)
 *
 * This helper computes a group-level bounding box for multi-select.
 *
 * WARNING:
 * - Do NOT import transform engine modules.
 * - Do NOT modify bounding box math in Frozen Zone.
 * - This is UI-only geometry, not runtime data.
 *
 * Used later in:
 * - Task 7D (Group transform handlers)
 * - Task 7E (v2Meta group metadata)
 */

/**
 * Group bounding box result.
 * 
 * Contains the computed bounding box for a group of elements,
 * including center coordinates and relative offsets for each element.
 */
export interface GroupBoundingBox {
  /** Left edge of the group bounding box */
  x: number;
  /** Top edge of the group bounding box */
  y: number;
  /** Width of the group bounding box */
  width: number;
  /** Height of the group bounding box */
  height: number;
  /** Center X coordinate of the group */
  centerX: number;
  /** Center Y coordinate of the group */
  centerY: number;
  /** Minimum X coordinate (same as x) */
  minX: number;
  /** Maximum X coordinate (x + width) */
  maxX: number;
  /** Minimum Y coordinate (same as y) */
  minY: number;
  /** Maximum Y coordinate (y + height) */
  maxY: number;
  /** 
   * Relative offsets for each element from the group center.
   * Key: element ID, Value: { dx, dy } offset from center
   */
  relativeOffsets: Record<string, { dx: number; dy: number }>;
}

/**
 * Element bounding box input (UI layer).
 * 
 * This represents a simplified bounding box from the UI layer,
 * NOT from the core transform engine (Frozen Zone).
 * 
 * These boxes come from OverlayPreview (UI layer), NOT from core runtime.
 * This is intentional to stay OUTSIDE the Frozen Zone.
 */
export interface ElementBoundingBox {
  /** Element ID */
  id: string;
  /** Left edge X coordinate */
  x: number;
  /** Top edge Y coordinate */
  y: number;
  /** Width of the element */
  width: number;
  /** Height of the element */
  height: number;
}

/**
 * Compute group bounding box for multiple elements.
 * 
 * This is a pure, UI-only function that computes the union bounding box
 * of multiple elements and calculates relative offsets from the group center.
 * 
 * @param elements - Array of element bounding boxes (UI layer)
 * @returns Group bounding box with center and relative offsets, or null if empty
 * 
 * @example
 * ```ts
 * const boxes = [
 *   { id: 'elem1', x: 10, y: 20, width: 100, height: 50 },
 *   { id: 'elem2', x: 150, y: 30, width: 80, height: 60 },
 * ];
 * const groupBox = computeGroupBoundingBox(boxes);
 * // Returns: { x: 10, y: 20, width: 220, height: 70, centerX: 120, centerY: 55, ... }
 * ```
 */
export function computeGroupBoundingBox(
  elements: ElementBoundingBox[]
): GroupBoundingBox | null {
  // Empty array → return null
  if (elements.length === 0) {
    return null;
  }

  // Compute min/max bounds across all elements
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const element of elements) {
    // Element bounds
    const elementLeft = element.x;
    const elementTop = element.y;
    const elementRight = element.x + element.width;
    const elementBottom = element.y + element.height;

    // Update group bounds
    minX = Math.min(minX, elementLeft);
    minY = Math.min(minY, elementTop);
    maxX = Math.max(maxX, elementRight);
    maxY = Math.max(maxY, elementBottom);
  }

  // Compute group bounding box dimensions
  const width = maxX - minX;
  const height = maxY - minY;

  // Compute group center
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;

  // Compute relative offsets for each element
  // Offset is from element center to group center
  const relativeOffsets: Record<string, { dx: number; dy: number }> = {};

  for (const element of elements) {
    // Element center coordinates
    const elementCenterX = element.x + element.width / 2;
    const elementCenterY = element.y + element.height / 2;

    // Relative offset from group center
    const dx = elementCenterX - centerX;
    const dy = elementCenterY - centerY;

    relativeOffsets[element.id] = { dx, dy };
  }

  // Build and return result
  return {
    x: minX,
    y: minY,
    width,
    height,
    centerX,
    centerY,
    minX,
    maxX,
    minY,
    maxY,
    relativeOffsets,
  };
}

