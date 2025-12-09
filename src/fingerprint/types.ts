/**
 * Fingerprint v2 Type Definitions
 * 
 * STATUS: PARKED — NOT ACTIVE
 * 
 * Fingerprint v2 (PARKED)
 * - Fully implemented but NOT active
 * - Type definitions preserved for future activation
 * 
 * FAZ-6 / Task 2A: Design skeleton for Fingerprint v2 system.
 * 
 * This file contains type definitions ONLY for the Fingerprint v2 design stage.
 * - NO runtime logic
 * - NO behavior changes
 * - NO imports or usage in existing code
 * - Used ONLY for architectural design and planning
 * 
 * Fingerprint v2 Goals:
 * - Stable, deterministic hashing of overlay elements
 * - Fast computation suitable for real-time sync
 * - Deep comparison of element structure and properties
 * - Independent of element order (stable sorting)
 */

/**
 * Hashable overlay element representation.
 * 
 * This type represents an overlay element in a format suitable for fingerprinting.
 * It includes all properties that should contribute to the fingerprint hash.
 * 
 * Note: This is a design-time type. The actual structure may evolve during implementation.
 */
export interface HashableOverlayElement {
  /** Element unique identifier */
  id: string;
  
  /** Element type: "metric" | "text" | "divider" */
  type: string;
  
  /** Z-index for rendering order */
  zIndex: number;
  
  /** Element data (type-specific) */
  data: unknown;
  
  /** Transform properties (position, rotation, etc.) */
  transform: unknown;
}

/**
 * Element fingerprint input.
 * 
 * Represents the input data for computing a fingerprint for a single element.
 * Used internally within the fingerprint computation process.
 */
export interface ElementFingerprintInput {
  /** Element ID */
  id: string;
  
  /** Element type */
  type: string;
  
  /** Element properties to hash */
  properties: Record<string, unknown>;
}

/**
 * Overlay fingerprint input.
 * 
 * Complete input structure for computing Fingerprint v2.
 * Contains all elements and metadata needed for fingerprint generation.
 */
export interface OverlayFingerprintInput {
  /** Array of hashable overlay elements */
  elements: HashableOverlayElement[];
  
  /** Fingerprint algorithm version */
  version: number;
}

/**
 * Fingerprint context.
 * 
 * Metadata about the fingerprint computation context.
 * Used for versioning and tracking fingerprint generation.
 */
export interface FingerprintContext {
  /** Project version (from version.ts) */
  projectVersion: string;
  
  /** Timestamp when fingerprint was created */
  createdAt: number;
}

