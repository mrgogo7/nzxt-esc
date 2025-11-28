/**
 * Migration v2 → v3 — FAZ-3C: v2 to v3 Migration
 * 
 * Migrates preset files from version 2 to version 3.
 * This is a reversible migration that preserves all element data.
 * 
 * Migration Strategy:
 * 1. Preserve all v2 fields (background, overlay, misc)
 * 2. Add canonical z-order to overlay (from element array order)
 * 3. Ensure z-order consistency (all elements in zOrder, no orphans)
 * 4. Preserve all element data (position, size, rotation, style)
 */

import type { PresetFile } from '../schema';
import type { PresetFileV3 } from './schema_v3';
import { getSchemaVersion } from '../migration';
import { migrate2To3 as migrate2To3Helper } from './migration_v0_to_v3';

/**
 * Migrates from version 2 to version 3.
 * 
 * This function:
 * - Adds canonical z-order to overlay
 * - Builds z-order from element array order (preserves existing order)
 * - Ensures z-order consistency (all elements included, no duplicates)
 * - Preserves all element data
 * 
 * @param file - Preset file (version 2)
 * @returns Migrated preset file (version 3)
 */
export function migrate2To3(file: PresetFile): PresetFileV3 {
  // Verify input is v2
  if (getSchemaVersion(file) !== 2) {
    throw new Error(`Migration v2→v3 failed: expected v2 input, got version ${getSchemaVersion(file)}`);
  }
  
  // Use shared helper function from migration_v0_to_v3.ts
  return migrate2To3Helper(file);
}

