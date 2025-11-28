/**
 * Migration v1 → v3 — FAZ-3C: Direct v1 to v3 Migration
 * 
 * Migrates preset files from version 1 directly to version 3.
 * This is a reversible migration that preserves all element data.
 * 
 * Migration Strategy:
 * 1. Use existing v1→v2 migration chain
 * 2. Then apply v2→v3 migration
 * 3. Preserve all element data
 * 4. Add canonical z-order from element array order
 */

import type { PresetFile } from '../schema';
import type { PresetFileV3 } from './schema_v3';
import { migratePreset, getSchemaVersion } from '../migration';
import { migrate2To3 } from './migration_v0_to_v3';

/**
 * Migrates from version 1 to version 3.
 * 
 * This function:
 * - First migrates v1→v2 using existing migration chain
 * - Then adds v3 features (canonical z-order)
 * - Preserves all element data
 * - Adds safe defaults for missing fields
 * 
 * @param file - Preset file (version 1)
 * @returns Migrated preset file (version 3)
 */
export function migrate1To3(file: PresetFile): PresetFileV3 {
  // Verify input is v1
  if (getSchemaVersion(file) !== 1) {
    throw new Error(`Migration v1→v3 failed: expected v1 input, got version ${getSchemaVersion(file)}`);
  }
  
  // First, migrate to v2 using existing chain (v1→v2)
  const v2File = migratePreset(file);
  
  // Verify we have v2
  if (getSchemaVersion(v2File) !== 2) {
    throw new Error(`Migration v1→v3 failed: expected v2 intermediate, got version ${getSchemaVersion(v2File)}`);
  }
  
  // Now migrate v2→v3
  return migrate2To3(v2File);
}

