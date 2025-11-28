/**
 * Migration Index — FAZ-3C: Unified Migration Pipeline
 * 
 * Provides unified migration functions that handle all version migrations
 * to version 3, including version detection and full migration pipeline.
 * 
 * Migration Strategy:
 * - v0 → v3: Use v0→v1→v2→v3 chain
 * - v1 → v3: Use v1→v2→v3 chain
 * - v2 → v3: Direct migration
 * - v3 → v3: Return as-is (already v3)
 */

import type { PresetFile } from '../schema';
import type { PresetFileV3 } from './schema_v3';
import { getSchemaVersion } from '../migration';
import { migrate0To3 } from './migration_v0_to_v3';
import { migrate1To3 } from './migration_v1_to_v3';
import { migrate2To3 } from './migration_v2_to_v3';

/**
 * Schema version 3 constant.
 */
export const SCHEMA_VERSION_V3 = 3;

/**
 * Detect preset file version.
 * Returns 0 if schemaVersion is missing (legacy format).
 * 
 * @param preset - Preset file (unknown version)
 * @returns Schema version number
 */
export function detectVersion(preset: unknown): number {
  return getSchemaVersion(preset);
}

/**
 * Run full migration to version 3.
 * Handles all version migrations (v0, v1, v2, v3) and migrates to v3.
 * 
 * Migration paths:
 * - v0 → v3: Uses v0→v1→v2→v3 chain
 * - v1 → v3: Uses v1→v2→v3 chain
 * - v2 → v3: Direct migration
 * - v3 → v3: Returns as-is (no migration needed)
 * 
 * @param preset - Preset file (any version)
 * @returns Migrated preset file (version 3)
 * @throws Error if migration fails or version is unsupported
 */
export function runFullMigration(preset: unknown): PresetFileV3 {
  const version = detectVersion(preset);
  
  // If already v3, return as-is
  if (version === SCHEMA_VERSION_V3) {
    // Verify it's valid v3 structure
    const v3Preset = preset as PresetFileV3;
    if (v3Preset.schemaVersion !== 3) {
      throw new Error('Invalid v3 preset: schemaVersion mismatch');
    }
    return v3Preset;
  }
  
  // Migrate based on source version
  switch (version) {
    case 0:
      // v0 → v3 (via v0→v1→v2→v3 chain)
      return migrate0To3(preset);
    
    case 1:
      // v1 → v3 (via v1→v2→v3 chain)
      if (!preset || typeof preset !== 'object') {
        throw new Error('Invalid v1 preset: not an object');
      }
      return migrate1To3(preset as PresetFile);
    
    case 2:
      // v2 → v3 (direct migration)
      if (!preset || typeof preset !== 'object') {
        throw new Error('Invalid v2 preset: not an object');
      }
      return migrate2To3(preset as PresetFile);
    
    default:
      // Unsupported version
      if (version > SCHEMA_VERSION_V3) {
        // Future version - try to use as-is if structure matches
        // This provides forward compatibility
        const futurePreset = preset as PresetFile;
        if (futurePreset.schemaVersion && futurePreset.overlay) {
          // Try to validate structure and use as-is
          // Note: This is a best-effort approach for forward compatibility
          return futurePreset as unknown as PresetFileV3;
        }
      }
      throw new Error(
        `Unsupported preset version: ${version}. ` +
        `Supported versions: 0, 1, 2, 3.`
      );
  }
}

/**
 * Finalize preset file (ensure v3 structure and validation).
 * 
 * This function:
 * - Ensures preset is v3 format
 * - Validates structure
 * - Fixes any inconsistencies (orphan elements, missing z-order, etc.)
 * - Returns finalized v3 preset
 * 
 * @param preset - Preset file (may be any version)
 * @returns Finalized preset file (version 3)
 */
export function finalizePreset(preset: unknown): PresetFileV3 {
  // Run full migration first
  const migrated = runFullMigration(preset);
  
  // Ensure z-order consistency
  const overlay = migrated.overlay;
  const elements = overlay.elements || [];
  
  // Build canonical z-order if missing or inconsistent
  if (!overlay.zOrder || overlay.zOrder.length === 0) {
    // Build from element array order
    const zOrder: string[] = [];
    const seenIds = new Set<string>();
    
    for (const element of elements) {
      if (element && typeof element.id === 'string' && element.id && !seenIds.has(element.id)) {
        zOrder.push(element.id);
        seenIds.add(element.id);
      }
    }
    
    overlay.zOrder = zOrder.length > 0 ? zOrder : undefined;
  } else {
    // Validate and fix z-order
    const elementIds = new Set(elements.map(el => el.id));
    const zOrder = overlay.zOrder.filter(id => elementIds.has(id)); // Remove orphans
    const seenIds = new Set<string>();
    const deduplicatedZOrder: string[] = [];
    
    // Remove duplicates
    for (const id of zOrder) {
      if (!seenIds.has(id)) {
        deduplicatedZOrder.push(id);
        seenIds.add(id);
      }
    }
    
    // Add any missing elements
    for (const element of elements) {
      if (!seenIds.has(element.id)) {
        deduplicatedZOrder.push(element.id);
        seenIds.add(element.id);
      }
    }
    
    overlay.zOrder = deduplicatedZOrder.length > 0 ? deduplicatedZOrder : undefined;
  }
  
  return migrated;
}

