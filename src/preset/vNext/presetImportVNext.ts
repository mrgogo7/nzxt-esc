/**
 * Preset Import vNext — FAZ-3C: PresetFile → OverlayRuntimeState
 * 
 * Converts PresetFile (v0–v3) to Unified OverlayRuntimeState.
 * 
 * Key Principles:
 * - Runtime-only fields are NEVER imported (selection, hover, history, transactions)
 * - Derived fields are NEVER imported (AABB, RBox, combinedBox) - computed on-demand
 * - Only STATIC FIELDS are imported (position, size, rotation, style, type, metadata)
 * - Z-order consistency is enforced
 * - Missing elements result in safe fallback + warning
 * - Invalid elements are filtered out with warnings
 */

import type { PresetFileV3 } from './schema_v3';
import type { OverlayRuntimeState, StateMetadata } from '../../state/overlay/types';
import type { OverlayElement } from '../../types/overlay';
import * as elementStore from '../../state/overlay/elementStore';
import * as selection from '../../state/overlay/selection';
import * as zOrder from '../../state/overlay/zOrder';
import * as history from '../../state/overlay/history';
import * as transactions from '../../state/overlay/transactions';
import { ensureStateConsistency } from '../../state/overlay/validation';
import { runFullMigration } from './migrationIndex';
import { IS_DEV } from '../../utils/env';

/**
 * Import warnings interface.
 */
export interface ImportWarning {
  /** Warning code */
  code: string;
  /** Warning message */
  message: string;
  /** Element ID (if warning is element-specific) */
  elementId?: string;
}

/**
 * Preset import result.
 */
export interface PresetImportResult {
  /** Imported runtime state */
  state: OverlayRuntimeState;
  /** Import warnings (if any) */
  warnings: ImportWarning[];
}

/**
 * Convert PresetFile (v0–v3) to OverlayRuntimeState.
 * 
 * This function:
 * 1. Migrates preset to v3 (if needed)
 * 2. Extracts elements from preset overlay
 * 3. Builds element store (Map<string, OverlayElement>)
 * 4. Builds z-order array (from canonical zOrder or element array order)
 * 5. Initializes selection, history, transactions to empty state
 * 6. Ensures state consistency
 * 
 * @param preset - Preset file (any version, will be migrated to v3)
 * @param presetId - Optional preset ID for state metadata
 * @param maxHistorySize - Optional maximum history size (default: 50)
 * @returns Import result with runtime state and warnings
 */
export function importPresetToRuntimeState(
  preset: unknown,
  presetId: string | null = null,
  maxHistorySize: number = history.DEFAULT_HISTORY_LIMIT
): PresetImportResult {
  const warnings: ImportWarning[] = [];
  
  // Step 1: Migrate preset to v3
  let v3Preset: PresetFileV3;
  try {
    v3Preset = runFullMigration(preset);
    
    // FAZ-3E PATCH #2: Log migration in dev mode
    if (IS_DEV) {
      const sourceVersion = (preset as any)?.schemaVersion ?? 0;
      if (sourceVersion !== 3) {
        console.log(`[PresetImport] Migrated preset from v${sourceVersion} to v3`);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (IS_DEV) {
      console.error('[PresetImport] Migration failed:', error);
    }
    throw new Error(`Preset migration failed: ${errorMessage}`);
  }
  
  // Step 2: Extract elements from preset overlay
  const overlay = v3Preset.overlay;
  const presetElements: OverlayElement[] = Array.isArray(overlay?.elements)
    ? overlay.elements
    : [];
  
  // Step 3: Validate and filter elements
  const validElements: OverlayElement[] = [];
  const elementIdSet = new Set<string>();
  
  for (const element of presetElements) {
    // Validate element structure
    if (!element || typeof element !== 'object') {
      warnings.push({
        code: 'INVALID_ELEMENT',
        message: 'Skipping invalid element: not an object',
      });
      continue;
    }
    
    if (typeof element.id !== 'string' || !element.id) {
      warnings.push({
        code: 'INVALID_ELEMENT_ID',
        message: 'Skipping element with invalid ID',
      });
      continue;
    }
    
    // Check for duplicate IDs
    if (elementIdSet.has(element.id)) {
      warnings.push({
        code: 'DUPLICATE_ELEMENT_ID',
        message: `Skipping duplicate element ID: ${element.id}`,
        elementId: element.id,
      });
      continue;
    }
    
    // Validate element type
    if (!['metric', 'text', 'divider', 'clock', 'date'].includes(element.type)) {
      warnings.push({
        code: 'INVALID_ELEMENT_TYPE',
        message: `Skipping element with invalid type: ${element.type}`,
        elementId: element.id,
      });
      continue;
    }
    
    // Validate element data
    if (!element.data || typeof element.data !== 'object') {
      warnings.push({
        code: 'INVALID_ELEMENT_DATA',
        message: `Skipping element with invalid data: ${element.id}`,
        elementId: element.id,
      });
      continue;
    }
    
    // Add to valid elements
    validElements.push(element as OverlayElement);
    elementIdSet.add(element.id);
  }
  
  // Step 4: Build element store
  const elements = elementStore.createStoreFromArray(validElements);
  
  // Step 5: Build z-order array
  let newZOrder: string[] = [];
  
  // Priority 1: Use canonical zOrder from v3 preset (if present)
  if (overlay.zOrder && Array.isArray(overlay.zOrder)) {
    const zOrderFromPreset = overlay.zOrder;
    const validZOrderIds: string[] = [];
    const seenZOrderIds = new Set<string>();
    
    for (const id of zOrderFromPreset) {
      if (typeof id === 'string' && id && elementIdSet.has(id)) {
        if (!seenZOrderIds.has(id)) {
          validZOrderIds.push(id);
          seenZOrderIds.add(id);
        }
      }
    }
    
    // Add any missing elements (elements not in zOrder)
    for (const elementId of elementIdSet) {
      if (!seenZOrderIds.has(elementId)) {
        validZOrderIds.push(elementId);
        warnings.push({
          code: 'ELEMENT_MISSING_FROM_ZORDER',
          message: `Element ${elementId} missing from z-order, added at end`,
          elementId,
        });
      }
    }
    
    newZOrder = validZOrderIds;
  } else {
    // Priority 2: Use element array order (v0/v1/v2 presets)
    newZOrder = validElements.map(el => el.id);
  }
  
  // Ensure z-order consistency (filter orphans, remove duplicates)
  const validElementIds = new Set(elementIdSet);
  newZOrder = zOrder.filterValidZOrder(newZOrder, validElementIds);
  
  // Step 6: Initialize selection (always empty on import)
  const newSelection = selection.createInitialSelectionState();
  
  // Step 7: Initialize history (always empty on import)
  const newHistory = history.createInitialHistoryState(maxHistorySize);
  
  // Step 8: Initialize transactions (always inactive on import)
  const newTransactions = transactions.createInitialTransactionState();
  
  // Step 9: Create state metadata
  const newMeta: StateMetadata = {
    version: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    presetId: presetId || v3Preset.presetName || null,
  };
  
  // Step 10: Build runtime state
  const newState: OverlayRuntimeState = {
    elements,
    selection: newSelection,
    zOrder: newZOrder,
    history: newHistory,
    transactions: newTransactions,
    meta: newMeta,
  };
  
  // Step 11: Ensure state consistency (fix any remaining issues)
  const finalState = ensureStateConsistency(newState);
  
  // FAZ-3E PATCH #2: Log warnings in dev mode
  if (IS_DEV && warnings.length > 0) {
    console.warn(`[PresetImport] Import completed with ${warnings.length} warning(s):`, warnings);
  }
  
  // FAZ-3E PATCH #2: Log successful import in dev mode
  if (IS_DEV) {
    console.log(
      `[PresetImport] Import successful: ${finalState.elements.size} elements, ` +
      `z-order length: ${finalState.zOrder.length}`
    );
  }
  
  return {
    state: finalState,
    warnings,
  };
}

