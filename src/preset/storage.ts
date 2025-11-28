/**
 * Preset Storage System
 * 
 * Manages preset list persistence in localStorage.
 * Handles default presets and user-created presets.
 */

import type { PresetFile } from './schema';
import { CURRENT_SCHEMA_VERSION } from './constants';
import { mergePresetFields } from './utils/atomicMerge';
// FAZ-3C: vNext migration system
import { shouldUseFaz3BRuntime } from '../utils/featureFlags';
import { runFullMigration } from './vNext/migrationIndex';

export interface StoredPreset {
  id: string;
  name: string;
  preset: PresetFile;
  isDefault: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'nzxtPresets';
const ACTIVE_PRESET_KEY = 'nzxtActivePresetId';

/**
 * Default preset ID (system-managed, cannot be deleted).
 */
export const DEFAULT_PRESET_ID = 'default-preset';

/**
 * Default preset baseline (empty black background, no overlay).
 */
export const DEFAULT_PRESET_FILE: PresetFile = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  exportedAt: new Date().toISOString(),
  appVersion: '0.0.1',
  presetName: 'Default',
  background: {
    url: '',
    settings: {
      scale: 1,
      x: 0,
      y: 0,
      fit: 'cover',
      align: 'center',
      loop: true,
      autoplay: true,
      mute: true,
      resolution: '640x640',
      backgroundColor: '#000000',
    },
  },
  overlay: {
    mode: 'none',
    elements: [],
  },
  misc: {},
};

/**
 * Default presets (built-in, cannot be deleted).
 */
export const DEFAULT_PRESETS: Omit<StoredPreset, 'preset'>[] = [
  {
    id: 'default-minimal',
    name: 'Minimal',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'default-balanced',
    name: 'Balanced',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Creates the default preset as a StoredPreset.
 */
export function createDefaultPreset(): StoredPreset {
  const now = new Date().toISOString();
  return {
    id: DEFAULT_PRESET_ID,
    name: 'Default',
    preset: DEFAULT_PRESET_FILE,
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Get all presets from localStorage.
 * Ensures default preset always exists.
 */
export function getPresets(): StoredPreset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let presets: StoredPreset[] = [];
    
    if (stored) {
      presets = JSON.parse(stored);
    }
    
    // FAZ-3C: Migrate presets to v3 if feature flag is enabled
    const useNewRuntime = shouldUseFaz3BRuntime();
    if (useNewRuntime) {
      // Migrate each preset to v3
      presets = presets.map(preset => {
        try {
          const migratedPreset = runFullMigration(preset.preset);
          return {
            ...preset,
            preset: migratedPreset,
          };
        } catch (error) {
          console.warn(`[PresetStorage] Failed to migrate preset ${preset.id} to v3:`, error);
          // Return original preset if migration fails
          return preset;
        }
      });
      
      // Save migrated presets back to storage (lazy migration on load)
      // Only save if any preset was migrated
      const needsSave = presets.some((p, i) => {
        const original = JSON.parse(stored || '[]');
        return original[i]?.preset?.schemaVersion !== p.preset?.schemaVersion;
      });
      
      if (needsSave) {
        savePresets(presets);
      }
    }
    
    // Ensure default preset exists
    const hasDefaultPreset = presets.some(p => p.id === DEFAULT_PRESET_ID);
    if (!hasDefaultPreset) {
      const defaultPreset = createDefaultPreset();
      presets.push(defaultPreset);
      savePresets(presets);
    }
    
    return presets;
  } catch (error) {
    console.error('[PresetStorage] Failed to get presets:', error);
    // Return default preset even on error
    return [createDefaultPreset()];
  }
}

/**
 * Save presets to localStorage.
 */
export function savePresets(presets: StoredPreset[]): void {
  try {
    const jsonString = JSON.stringify(presets);
    
    // DEBUG: Log full JSON for verification (only in debug mode)
    const isDebugMode = typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true;
    if (isDebugMode) {
      console.log('[PresetStorage] Saving presets - JSON length:', jsonString.length);
      // Log overlay elements for each preset
      presets.forEach(preset => {
        const overlayElements = preset.preset?.overlay?.elements;
        const elementCount = Array.isArray(overlayElements) ? overlayElements.length : 0;
        console.log(`[PresetStorage] Preset ${preset.id} (${preset.name}) - overlay.elements count: ${elementCount}`);
        if (elementCount > 0 && isDebugMode) {
          console.log(`[PresetStorage] Preset ${preset.id} overlay.elements:`, overlayElements);
        }
      });
    }
    
    localStorage.setItem(STORAGE_KEY, jsonString);
    // Dispatch storage event for cross-tab sync
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: jsonString,
      })
    );
  } catch (error) {
    console.error('[PresetStorage] Failed to save presets:', error);
  }
}

/**
 * Add a new preset.
 */
export function addPreset(preset: StoredPreset): void {
  const presets = getPresets();
  presets.push(preset);
  savePresets(presets);
}

/**
 * Update an existing preset.
 * Supports atomic merge for PresetFile updates.
 */
export function updatePreset(id: string, updates: Partial<StoredPreset>): void {
  const presets = getPresets();
  const index = presets.findIndex(p => p.id === id);
  if (index !== -1) {
    const existingPreset = presets[index];
    
    // If preset field is being updated, use atomic merge
    if (updates.preset && typeof updates.preset === 'object') {
      const mergedPreset = mergePresetFields(
        existingPreset.preset,
        updates.preset as Partial<PresetFile>
      );
      
      presets[index] = {
        ...existingPreset,
        ...updates,
        preset: mergedPreset,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Regular update (name, isDefault, etc.)
      presets[index] = {
        ...existingPreset,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    
    savePresets(presets);
  }
}

/**
 * Delete a preset (cannot delete default preset).
 */
export function deletePreset(id: string): boolean {
  // Cannot delete default preset
  if (id === DEFAULT_PRESET_ID) {
    return false;
  }
  
  const presets = getPresets();
  const preset = presets.find(p => p.id === id);
  
  if (preset?.isDefault) {
    return false; // Cannot delete default presets
  }
  
  const filtered = presets.filter(p => p.id !== id);
  savePresets(filtered);
  
  // If deleted preset was active, clear active preset
  const activeId = getActivePresetId();
  if (activeId === id) {
    setActivePresetId(null);
  }
  
  return true;
}

/**
 * Get preset by ID.
 */
export function getPresetById(id: string): StoredPreset | null {
  const presets = getPresets();
  return presets.find(p => p.id === id) || null;
}

/**
 * Check if preset name exists.
 */
export function presetNameExists(name: string, excludeId?: string): boolean {
  const presets = getPresets();
  return presets.some(p => p.name === name && p.id !== excludeId);
}

/**
 * Generate unique preset name (e.g., "Preset Name (2)").
 */
export function generateUniquePresetName(baseName: string): string {
  let name = baseName;
  let counter = 1;
  
  while (presetNameExists(name)) {
    counter++;
    name = `${baseName} (${counter})`;
  }
  
  return name;
}

/**
 * Get active preset ID.
 */
export function getActivePresetId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PRESET_KEY);
  } catch {
    return null;
  }
}

/**
 * Set active preset ID.
 */
export function setActivePresetId(id: string | null): void {
  try {
    const oldValue = localStorage.getItem(ACTIVE_PRESET_KEY);
    
    if (id) {
      localStorage.setItem(ACTIVE_PRESET_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_PRESET_KEY);
    }
    
    console.log(`[PresetStorage] setActivePresetId: ${oldValue || 'null'} -> ${id || 'null'}`);
    
    // CRITICAL: Dispatch storage event for cross-tab sync
    // Also dispatch custom event for same-tab listeners
    // StorageEvent constructor may not work in all browsers for same-tab events
    const storageEvent = new StorageEvent('storage', {
      key: ACTIVE_PRESET_KEY,
      newValue: id,
      oldValue: oldValue,
      storageArea: localStorage,
    });
    window.dispatchEvent(storageEvent);
    
    // Also dispatch custom event for same-tab listeners (more reliable)
    window.dispatchEvent(
      new CustomEvent('activePresetIdChanged', {
        detail: { newValue: id, oldValue: oldValue },
      })
    );
  } catch (error) {
    console.error('[PresetStorage] Failed to set active preset:', error);
  }
}

/**
 * Duplicate a preset with a new name.
 */
export function duplicatePreset(id: string, newName?: string): StoredPreset | null {
  const preset = getPresetById(id);
  if (!preset) return null;
  
  const baseName = newName || preset.name;
  const uniqueName = generateUniquePresetName(baseName);
  
  const duplicated: StoredPreset = {
    ...preset,
    id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: uniqueName,
    isDefault: false,
    isFavorite: false, // Duplicated presets are not favorited by default
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  addPreset(duplicated);
  return duplicated;
}

/**
 * FAZ 9.2 HOTFIX: Migration function removed.
 * overlay.elements MUST be preserved in preset files for persistence.
 * Elements are stored in preset files and loaded into runtime on preset switch/F5.
 */

/**
 * Ensures initial active preset is set to default preset on first run.
 * Should be called once on app initialization.
 * 
 * FAZ 9.2 HOTFIX: Migration removed - overlay.elements are now preserved.
 */
export function ensureInitialActivePreset(): void {
  const activeId = getActivePresetId();
  if (!activeId) {
    // Ensure default preset exists
    getPresets(); // This will create default preset if it doesn't exist
    // Set default preset as active
    setActivePresetId(DEFAULT_PRESET_ID);
  }
}

/**
 * Maximum number of favorite presets allowed.
 */
const FAVORITE_LIMIT = 10;

/**
 * Counts the number of favorite presets.
 */
export function countFavorites(): number {
  const presets = getPresets();
  return presets.filter(p => p.isFavorite === true).length;
}

/**
 * Checks if a preset is favorited.
 */
export function isFavorite(preset: StoredPreset): boolean {
  return preset.isFavorite === true;
}

/**
 * Toggles favorite status of a preset.
 * 
 * @param presetId - ID of the preset to toggle
 * @returns true if toggle was successful, false if favorite limit reached
 */
export function toggleFavorite(presetId: string): boolean {
  const presets = getPresets();
  const preset = presets.find(p => p.id === presetId);
  
  if (!preset) {
    return false;
  }

  const currentFavoriteCount = countFavorites();
  const willBeFavorite = !preset.isFavorite;

  // Check favorite limit (only when adding a favorite, not removing)
  if (willBeFavorite && currentFavoriteCount >= FAVORITE_LIMIT) {
    return false; // Limit reached
  }

  // Toggle favorite status
  const index = presets.findIndex(p => p.id === presetId);
  if (index !== -1) {
    presets[index] = {
      ...presets[index],
      isFavorite: willBeFavorite,
      updatedAt: new Date().toISOString(),
    };
    savePresets(presets);
    return true;
  }

  return false;
}

