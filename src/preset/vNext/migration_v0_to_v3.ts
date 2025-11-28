/**
 * Migration v0 → v3 — FAZ-3C: Legacy Format to v3 Migration
 * 
 * Migrates preset files from version 0 (no schemaVersion) directly to version 3.
 * This is a reversible migration that preserves all element data.
 * 
 * Migration Strategy:
 * 1. Use existing v0→v1→v2 migration chain
 * 2. Then apply v2→v3 migration
 * 3. Preserve all element data
 * 4. Add canonical z-order from element array order
 */

import type { PresetFile } from '../schema';
import type { PresetFileV3, OverlayV3 } from './schema_v3';
import { migratePreset, getSchemaVersion } from '../migration';

/**
 * Migrates from version 0 (no schemaVersion) to version 3.
 * 
 * This function:
 * - First migrates v0→v1→v2 using existing migration chain
 * - Then adds v3 features (canonical z-order)
 * - Preserves all element data
 * - Adds safe defaults for missing fields
 * 
 * @param file - Preset file (version 0 or unknown)
 * @returns Migrated preset file (version 3)
 */
export function migrate0To3(file: unknown): PresetFileV3 {
  // First, migrate to v2 using existing chain (v0→v1→v2)
  const v2File = migratePreset(file);
  
  // Verify we have v2
  if (getSchemaVersion(v2File) !== 2) {
    throw new Error(`Migration v0→v3 failed: expected v2 intermediate, got version ${getSchemaVersion(v2File)}`);
  }
  
  // Now migrate v2→v3
  return migrate2To3(v2File);
}

/**
 * Helper: Migrate v2 to v3 (called from v0→v3 and v1→v3).
 * 
 * Exported for reuse in migration_v2_to_v3.ts
 */
export function migrate2To3(file: PresetFile): PresetFileV3 {
  const overlay = file.overlay;
  const elements = Array.isArray(overlay?.elements) ? overlay.elements : [];
  
  // Build canonical z-order from element array order
  // Element array order is the source of truth for v0/v1/v2 presets
  const zOrder: string[] = [];
  const seenIds = new Set<string>();
  
  for (const element of elements) {
    if (element && typeof element.id === 'string' && element.id && !seenIds.has(element.id)) {
      zOrder.push(element.id);
      seenIds.add(element.id);
    }
  }
  
  // Add any missing elements (safety check)
  for (const element of elements) {
    if (element && typeof element.id === 'string' && element.id && !seenIds.has(element.id)) {
      zOrder.push(element.id);
    }
  }
  
  // Create v3 overlay with canonical z-order
  const overlayV3: OverlayV3 = {
    mode: overlay?.mode === 'custom' ? 'custom' : 'none',
    elements: elements,
    zOrder: zOrder.length > 0 ? zOrder : undefined, // Only include if non-empty
  };
  
  // Create v3 preset file
  const result: PresetFileV3 = {
    ...file,
    schemaVersion: 3,
    overlay: overlayV3,
  };
  
  return result;
}

