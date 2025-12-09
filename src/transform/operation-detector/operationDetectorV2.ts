/**
 * FAZ-7 / Task 6A — Operation Detector v2
 * 
 * High-accuracy operation type detection for transform snapshots.
 * 
 * Purpose:
 * - Detect transform operation types (move/resize/rotate/zOrder/data/other) from element snapshots
 * - Support single-element and multi-element (group) transforms
 * - Prepare for multi-select support
 * 
 * ZERO Behavior Change Guarantee:
 * - This module is NOT integrated into the runtime
 * - Does NOT modify any existing runtime logic
 * - Does NOT affect undo/redo behavior
 * - Does NOT affect transform engine
 * - Pure helper functions only (no side effects)
 * - Fully tree-shakeable if unused
 * 
 * Multi-Select Readiness:
 * - Supports single-element detection
 * - Supports multi-element (group) detection
 * - Detects group-level operation types
 * - Handles mixed transforms (some elements moved, some resized)
 * 
 * Frozen Zone Protection:
 * - Does NOT import transform engine code
 * - Does NOT import runtime state management
 * - Does NOT import history/undo/redo logic
 * - Operates ONLY on element snapshots (before/after)
 * - Pure arithmetic only (no transform math)
 * 
 * Safety Notes:
 * - Not imported anywhere (development-only helper)
 * - Safe to remove if not needed
 * - No side effects
 * - No mutations
 * - No dependencies on core runtime
 */

import type { OverlayElement } from '../../types/overlay';
import { isMetricElementData, isTextElementData, isDividerElementData } from '../../types/overlay';
import type { TransformOperationTypeV2 } from '../../state/overlay/actions';

/**
 * Element difference result.
 * Contains computed deltas between before and after snapshots.
 */
export interface DiffResult {
  /** Position delta X (LCD pixels) */
  dx: number;
  
  /** Position delta Y (LCD pixels) */
  dy: number;
  
  /** Size delta width (LCD pixels, for resize operations) */
  dWidth: number;
  
  /** Size delta height (LCD pixels, for resize operations) */
  dHeight: number;
  
  /** Rotation delta (degrees) */
  dAngle: number;
}

/**
 * Element snapshot pair.
 * Contains before and after snapshots for a single element.
 */
export interface ElementSnapshotPair {
  /** Element snapshot before transform */
  before: OverlayElement;
  
  /** Element snapshot after transform */
  after: OverlayElement;
}

/**
 * Threshold for significant position change (LCD pixels).
 * Changes smaller than this are considered noise/jitter.
 */
const POSITION_THRESHOLD_PX = 0.5;

/**
 * Threshold for significant size change (LCD pixels).
 * Changes smaller than this are considered noise/jitter.
 */
const SIZE_THRESHOLD_PX = 0.5;

/**
 * Threshold for significant rotation change (degrees).
 * Changes smaller than this are considered noise/jitter.
 */
const ROTATION_THRESHOLD_DEG = 0.5;

/**
 * Compute element difference between before and after snapshots.
 * 
 * Pure function: Only arithmetic, no side effects.
 * 
 * @param before - Element snapshot before transform
 * @param after - Element snapshot after transform
 * @returns Computed difference (dx, dy, dWidth, dHeight, dAngle)
 */
export function computeElementDiff(
  before: OverlayElement,
  after: OverlayElement
): DiffResult {
  // Position deltas
  const dx = after.x - before.x;
  const dy = after.y - before.y;
  
  // Rotation delta (handle undefined angles as 0)
  const beforeAngle = before.angle ?? 0;
  const afterAngle = after.angle ?? 0;
  let dAngle = afterAngle - beforeAngle;
  
  // Normalize angle delta to [-180, 180] range
  while (dAngle > 180) {
    dAngle -= 360;
  }
  while (dAngle < -180) {
    dAngle += 360;
  }
  
  // Size deltas (element type-specific)
  let dWidth = 0;
  let dHeight = 0;
  
  if (before.type === 'metric' && after.type === 'metric' && 
      isMetricElementData(before.data) && isMetricElementData(after.data)) {
    // Metric: numberSize is the main size
    const beforeSize = before.data.numberSize ?? 0;
    const afterSize = after.data.numberSize ?? 0;
    dWidth = afterSize - beforeSize;
    dHeight = afterSize - beforeSize; // Metric is square-like
  } else if (before.type === 'text' && after.type === 'text' &&
             isTextElementData(before.data) && isTextElementData(after.data)) {
    // Text: textSize is the main size
    const beforeSize = before.data.textSize ?? 0;
    const afterSize = after.data.textSize ?? 0;
    dWidth = afterSize - beforeSize;
    dHeight = afterSize - beforeSize; // Text is square-like
  } else if (before.type === 'divider' && after.type === 'divider' &&
             isDividerElementData(before.data) && isDividerElementData(after.data)) {
    // Divider: width (thickness) and height (length) are separate
    const beforeWidth = before.data.width ?? 0;
    const afterWidth = after.data.width ?? 0;
    const beforeHeight = before.data.height ?? 0;
    const afterHeight = after.data.height ?? 0;
    dWidth = afterWidth - beforeWidth;
    dHeight = afterHeight - beforeHeight;
  }
  // If types don't match, dWidth and dHeight remain 0
  
  return {
    dx,
    dy,
    dWidth,
    dHeight,
    dAngle,
  };
}

/**
 * Detect operation type for a single element pair.
 * 
 * Determines the primary operation type based on which property changed significantly.
 * 
 * @param diff - Computed difference result
 * @returns Detected operation type
 */
export function detectOperationTypeForPair(diff: DiffResult): TransformOperationTypeV2 {
  const moved = Math.abs(diff.dx) >= POSITION_THRESHOLD_PX || Math.abs(diff.dy) >= POSITION_THRESHOLD_PX;
  const resized = Math.abs(diff.dWidth) >= SIZE_THRESHOLD_PX || Math.abs(diff.dHeight) >= SIZE_THRESHOLD_PX;
  const rotated = Math.abs(diff.dAngle) >= ROTATION_THRESHOLD_DEG;
  
  // Priority: rotate > resize > move
  // This ensures that if multiple properties changed, we detect the "most significant" change
  
  if (rotated) {
    return 'rotate';
  }
  
  if (resized) {
    return 'resize';
  }
  
  if (moved) {
    return 'move';
  }
  
  // No significant change detected
  return 'other';
}

/**
 * Detect operation type for a group of elements.
 * 
 * Analyzes multiple element pairs to determine group-level operation type.
 * 
 * Logic:
 * - If ANY element rotated → 'rotate'
 * - If ANY element resized → 'resize'
 * - If ALL elements moved with same delta → 'move' (group move)
 * - If mixed changes or no changes → 'other'
 * 
 * @param pairs - Array of element snapshot pairs
 * @returns Detected group operation type
 */
export function detectOperationTypeForGroup(
  pairs: ElementSnapshotPair[]
): TransformOperationTypeV2 {
  if (pairs.length === 0) {
    return 'other';
  }
  
  // Compute diffs for all pairs
  const diffs = pairs.map(pair => computeElementDiff(pair.before, pair.after));
  
  // Check for rotation (highest priority)
  const hasRotation = diffs.some(diff => Math.abs(diff.dAngle) >= ROTATION_THRESHOLD_DEG);
  if (hasRotation) {
    return 'rotate';
  }
  
  // Check for resize
  const hasResize = diffs.some(
    diff => Math.abs(diff.dWidth) >= SIZE_THRESHOLD_PX || Math.abs(diff.dHeight) >= SIZE_THRESHOLD_PX
  );
  if (hasResize) {
    return 'resize';
  }
  
  // Check for group move (all elements moved with same delta)
  const hasMove = diffs.some(
    diff => Math.abs(diff.dx) >= POSITION_THRESHOLD_PX || Math.abs(diff.dy) >= POSITION_THRESHOLD_PX
  );
  
  if (hasMove) {
    // Check if all elements moved with approximately the same delta (group move)
    const firstDiff = diffs[0];
    const allMovedTogether = diffs.every(diff => {
      const dxMatch = Math.abs(diff.dx - firstDiff.dx) < POSITION_THRESHOLD_PX;
      const dyMatch = Math.abs(diff.dy - firstDiff.dy) < POSITION_THRESHOLD_PX;
      return dxMatch && dyMatch;
    });
    
    if (allMovedTogether) {
      return 'move'; // Group move
    }
    
    // Mixed moves (different deltas) → other
    return 'other';
  }
  
  // No significant changes
  return 'other';
}

/**
 * Main API: Detect operation type from before/after element arrays.
 * 
 * This is the primary entry point for operation type detection.
 * Supports both single-element and multi-element (group) transforms.
 * 
 * @param before - Array of element snapshots before transform
 * @param after - Array of element snapshots after transform
 * @returns Detected operation type
 */
export function detectOperationTypeV2(
  before: OverlayElement[],
  after: OverlayElement[]
): TransformOperationTypeV2 {
  // Validate input
  if (before.length === 0 || after.length === 0) {
    return 'other';
  }
  
  if (before.length !== after.length) {
    // Mismatched arrays (shouldn't happen, but handle gracefully)
    return 'other';
  }
  
  // Create snapshot pairs
  const pairs: ElementSnapshotPair[] = [];
  for (let i = 0; i < before.length; i++) {
    const beforeElement = before[i];
    const afterElement = after[i];
    
    // Skip if IDs don't match (safety check)
    if (beforeElement.id !== afterElement.id) {
      continue;
    }
    
    pairs.push({
      before: beforeElement,
      after: afterElement,
    });
  }
  
  if (pairs.length === 0) {
    return 'other';
  }
  
  // Single element: use pair detection
  if (pairs.length === 1) {
    const diff = computeElementDiff(pairs[0].before, pairs[0].after);
    return detectOperationTypeForPair(diff);
  }
  
  // Multiple elements: use group detection
  return detectOperationTypeForGroup(pairs);
}

/**
 * Safety Notes:
 * 
 * - This module is NOT imported anywhere (development-only helper)
 * - Does NOT affect undo/redo behavior
 * - Does NOT affect transform engine
 * - Does NOT modify runtime state
 * - Pure functions only (no side effects)
 * - Safe to remove if not needed
 * - Fully tree-shakeable if unused
 * - No dependencies on core runtime logic
 * - Operates only on element snapshots (before/after)
 * - Uses only simple arithmetic (no transform math)
 */

