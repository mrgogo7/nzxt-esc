/**
 * Preset Export/Import System
 * 
 * Handles exporting current configuration to .nzxt-esc-preset files
 * and importing preset files to restore configuration.
 * 
 * Uses the new import pipeline for robust import handling with
 * migration, validation, and normalization.
 */

import type { PresetFile } from './schema';
import type { Lang } from '../i18n';
import { CURRENT_SCHEMA_VERSION } from './constants';
import { importPresetPipeline, type ImportResult } from './importPipeline';
import type { AppSettings } from '../constants/defaults';
import { deriveBackgroundSourceFromUrl } from './utils/mediaSource';
// FAZ-3C: vNext preset system imports
import { exportRuntimeStateToPreset } from './vNext/presetExportVNext';
import { shouldUseFaz3BRuntime } from '../utils/featureFlags';

// Re-export types and functions for convenience
export type { ImportResult } from './importPipeline';
export type { ValidationResult, ValidationIssue } from './validation';
export type { NormalizationResult, NormalizationChange } from './normalization';
export { ERROR_CODES, PresetError, getUserFriendlyErrorMessage } from './errors';

import { APP_VERSION } from '../version';

/**
 * Utility function to create preset file background/misc sections.
 * 
 * FAZ-4-3: This is a utility function (not legacy) - used to merge background settings
 * with vNext overlay export. Does not use legacy runtime.
 * 
 * Creates a preset file background/misc sections from settings.
 * 
 * @param settings - Current app settings
 * @param mediaUrl - Current media URL
 * @param presetName - Preset name (unused, kept for API compatibility)
 * @param overlayElements - Overlay elements (unused, kept for API compatibility)
 * @returns Preset file object with background and misc sections
 */
export function createPresetFromState(
  settings: AppSettings,
  mediaUrl: string,
  presetName: string,
  overlayElements?: Array<any> // OverlayElement[] but avoiding circular import
): PresetFile {
  const now = new Date().toISOString();
  const appVersion = APP_VERSION;

  // CRITICAL: overlay.elements should come from runtime/storage, NOT from settings
  // settings.overlay.elements should always be empty/undefined
  const elements = Array.isArray(overlayElements) ? overlayElements : [];

  // Determine background.source model (v2)
  const isLocalSource =
    settings.sourceType === 'local' && typeof settings.localFileName === 'string';

  let backgroundUrl: string;
  let backgroundSource:
    | { type: 'local'; localFileName: string }
    | ReturnType<typeof deriveBackgroundSourceFromUrl>;
  let usesLocalMedia = false;

  if (isLocalSource) {
    // Local media: metadata only, no URL in preset
    backgroundUrl = '';
    backgroundSource = {
      type: 'local',
      localFileName: settings.localFileName as string,
    };
    usesLocalMedia = true;
  } else {
    // Remote / YouTube / Pinterest / no-media (empty string)
    backgroundUrl = mediaUrl;
    backgroundSource = deriveBackgroundSourceFromUrl(mediaUrl);
  }

  const misc: PresetFile['misc'] = {};
  if (settings.showGuide !== undefined) {
    misc.showGuide = settings.showGuide;
  }
  if (usesLocalMedia) {
    misc.localMediaWarning =
      'This preset uses a local media file. The media itself is not included in this export.'; // NOTE: This is metadata-only, not shown to user, kept in English for consistency
  }

  const miscOrUndefined = Object.keys(misc).length > 0 ? misc : undefined;

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: now,
    appVersion,
    presetName,
    background: {
      url: backgroundUrl,
      settings: {
        scale: settings.scale,
        x: settings.x,
        y: settings.y,
        fit: settings.fit,
        align: settings.align,
        loop: settings.loop,
        autoplay: settings.autoplay,
        mute: settings.mute,
        resolution: settings.resolution,
        backgroundColor: settings.backgroundColor || '#000000',
      },
      source: backgroundSource,
    },
    overlay: {
      mode: settings.overlay?.mode || 'none',
      elements: elements, // FAZ 9: Always use provided elements, never from settings
    },
    misc: miscOrUndefined,
  };
}

/**
 * Exports current configuration to .nzxt-esc-preset file.
 * 
 * FAZ 9: Reads overlay.elements from storage first, falls back to runtime.
 * 
 * @param settings - Current app settings
 * @param mediaUrl - Current media URL
 * @param presetName - Preset name
 * @param filename - Optional filename (without extension, defaults to presetName)
 * @param activePresetId - Optional active preset ID to read overlay elements from storage/runtime
 * @returns Promise that resolves when export is complete
 */
export async function exportPreset(
  settings: AppSettings,
  mediaUrl: string,
  presetName: string,
  filename?: string,
  activePresetId?: string | null
): Promise<void> {
  try {
    const useNewRuntime = shouldUseFaz3BRuntime();
    let preset: PresetFile | null = null;
    
    // FAZ-3C: Use vNext export system when feature flag is enabled
    if (useNewRuntime && activePresetId) {
      try {
        // Get StateManager instance (cached or created)
        const { getStateManagerForPreset } = await import('../state/overlay/useOverlayStateManager');
        const stateManager = getStateManagerForPreset(activePresetId);
        const runtimeState = stateManager.getState();
        
        // Export runtime state to v3 preset
        const exportedPreset = exportRuntimeStateToPreset(runtimeState, presetName);
        
        // Merge background settings from current settings (background is not part of runtime state)
        const backgroundFromSettings = createPresetFromState(settings, mediaUrl, presetName);
        preset = {
          ...exportedPreset,
          background: backgroundFromSettings.background,
          misc: backgroundFromSettings.misc,
        };
      } catch (error) {
        // Fallback to old system if vNext export fails
        console.warn('[PresetExport] vNext export failed, falling back to old system:', error);
        preset = null; // Force old system path
      }
    }
    
    // FAZ-4-3: Legacy path removed - vNext is required
    if (!preset) {
      throw new Error('Preset export failed: vNext export is required');
    }
    
    const json = JSON.stringify(preset, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create download filename (sanitize presetName for filename)
    const sanitizedName = presetName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const finalFilename = filename || sanitizedName || `nzxt-esc-preset-${Date.now()}`;

    // Create temporary anchor and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${finalFilename}.nzxt-esc-preset`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error('Failed to export preset file');
  }
}

/**
 * Imports a preset file using the new pipeline.
 * 
 * This is the main import function that uses the complete pipeline:
 * - File validation
 * - JSON parsing
 * - Migration
 * - Validation
 * - Normalization
 * 
 * @param file - File object from file input
 * @param lang - Language for user-friendly error messages (default: 'en')
 * @returns Promise that resolves with import result
 */
export async function importPreset(
  file: File,
  lang: Lang = 'en'
): Promise<ImportResult> {
  return importPresetPipeline(file, lang);
}

// FAZ-4-3: importPresetLegacy deleted - use importPreset() instead

