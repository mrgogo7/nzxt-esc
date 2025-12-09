/**
 * Fingerprint v2 Computation
 * 
 * STATUS: PARKED — NOT ACTIVE
 * 
 * Fingerprint v2 (PARKED)
 * - Fully implemented but NOT active
 * - Activation postponed due to performance ROI analysis
 * - Shadow mode disabled in FAZ-6 / Task 2E
 * 
 * FAZ-6 / Task 2B: Implementation of Fingerprint v2.
 * 
 * This file implements a deterministic, deep hash function for overlay elements
 * using the xxhash64 algorithm. It provides stable fingerprints that are
 * independent of element order through stable sorting.
 * 
 * CRITICAL CONSTRAINTS:
 * - ZERO BEHAVIOR CHANGE (not used in runtime)
 * - NOT imported or used anywhere in existing code
 * - NOT called from runtime, sync, or any live system
 * - Fingerprint v1 (JSON.stringify-based) remains the only active system
 * - Shadow mode disabled via FPV2_SHADOW_ENABLED flag
 * 
 * Implementation Details:
 * - Uses stable sorting by zIndex (ascending) then by id (lexicographic)
 * - Deep hashes all element properties: id, type, zIndex, data, transform
 * - Uses deterministic string serialization with sorted object keys
 * - Computes xxhash64 hash of normalized overlay string
 * - Returns lowercase hexadecimal hash string (16 characters)
 */

import type { OverlayFingerprintInput, HashableOverlayElement } from './types';
import { xxhash64 } from './xxhash64';

/**
 * Normalized element representation for fingerprinting.
 * Contains all properties that contribute to the fingerprint hash.
 */
interface NormalizedElement {
  id: string;
  type: string;
  zIndex: number;
  data: unknown;
  transform: unknown;
}

/**
 * Stable stringify helper.
 * 
 * Serializes a JavaScript value into a deterministic string representation.
 * Object keys are sorted alphabetically to ensure consistent output regardless
 * of property insertion order.
 * 
 * This ensures that the same logical structure always produces the same
 * string representation, which is critical for deterministic hashing.
 * 
 * @param value - Value to serialize
 * @returns Deterministic string representation
 */
function stableStringify(value: unknown): string {
  if (value === null) {
    return 'null';
  }
  
  if (value === undefined) {
    return 'undefined';
  }
  
  const valueType = typeof value;
  
  if (valueType === 'string') {
    return JSON.stringify(value);
  }
  
  if (valueType === 'number' || valueType === 'boolean') {
    return String(value);
  }
  
  if (valueType === 'bigint') {
    return `${value}n`;
  }
  
  if (Array.isArray(value)) {
    const items = value.map(item => stableStringify(item));
    return `[${items.join(',')}]`;
  }
  
  if (valueType === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const pairs = keys.map(key => {
      const keyStr = JSON.stringify(key);
      const valueStr = stableStringify(obj[key]);
      return `${keyStr}:${valueStr}`;
    });
    return `{${pairs.join(',')}}`;
  }
  
  // Fallback for functions, symbols, etc.
  return String(value);
}

/**
 * Normalize an overlay element for fingerprinting.
 * 
 * Creates a normalized representation that includes all properties
 * that should contribute to the fingerprint hash.
 * 
 * @param element - Hashable overlay element
 * @returns Normalized element representation
 */
function normalizeElement(element: HashableOverlayElement): NormalizedElement {
  return {
    id: element.id,
    type: element.type,
    zIndex: element.zIndex,
    data: element.data,
    transform: element.transform,
  };
}

/**
 * Sort elements deterministically for fingerprinting.
 * 
 * Elements are sorted by:
 * 1. zIndex (ascending)
 * 2. id (lexicographic, ascending) - as tiebreaker
 * 
 * This ensures that the same set of elements always produces the same
 * fingerprint regardless of their original order in the array.
 * 
 * @param elements - Array of hashable overlay elements
 * @returns Sorted array (new array, original not mutated)
 */
function sortElementsDeterministically(
  elements: HashableOverlayElement[]
): HashableOverlayElement[] {
  // Create a new array to avoid mutating the original
  const sorted = [...elements];
  
  // Sort by zIndex first, then by id
  sorted.sort((a, b) => {
    // Compare zIndex
    if (a.zIndex !== b.zIndex) {
      return a.zIndex - b.zIndex;
    }
    
    // If zIndex is equal, compare by id (lexicographic)
    return a.id.localeCompare(b.id);
  });
  
  return sorted;
}

/**
 * Compute Fingerprint v2 for overlay elements.
 * 
 * Fingerprint v2 provides a deterministic, deep hash of overlay element structure.
 * It uses stable sorting and deep hashing to ensure that:
 * - Same elements always produce the same fingerprint
 * - Element order does not affect the fingerprint
 * - All element properties (id, type, zIndex, data, transform) are included
 * 
 * Algorithm:
 * 1. Normalize and sort elements deterministically
 * 2. Serialize each element to a canonical string
 * 3. Concatenate element strings with separators
 * 4. Compute xxhash64 hash of the resulting string
 * 
 * Performance:
 * - Optimized for real-time sync operations
 * - Fast computation suitable for frequent updates
 * - Deterministic output ensures consistency across tabs/processes
 * 
 * Current Status:
 * - Fully implemented and functional
 * - NOT integrated into runtime/sync system yet
 * - Fingerprint v1 remains the active system
 * - Integration planned for FAZ-6 / Task 2C / Task 2D
 * 
 * @param input - Overlay fingerprint input containing elements and version
 * @returns Hexadecimal hash string (16 characters, lowercase)
 */
export function computeFingerprintV2(input: OverlayFingerprintInput): string {
  // Step 1: Normalize and sort elements deterministically
  const sortedElements = sortElementsDeterministically(input.elements);
  
  // Step 2: Normalize each element
  const normalizedElements = sortedElements.map(normalizeElement);
  
  // Step 3: Serialize each element to a canonical string
  const elementStrings = normalizedElements.map(element => {
    return stableStringify(element);
  });
  
  // Step 4: Build overlay canonical string
  // Include version in header for future compatibility
  const header = `v=${input.version}\n`;
  const body = elementStrings.join('\n---\n');
  const overlayString = header + body;
  
  // Step 5: Compute xxhash64 hash
  const seed = 0x1a2b3c4d; // Fixed constant for deterministic hashing
  const hash = xxhash64(overlayString, seed);
  
  return hash;
}
