/**
 * Overlay Preset Export/Import System
 * 
 * Handles exporting overlay elements to .nzxt-esc-overlay-preset files
 * and importing overlay preset files to restore elements.
 * 
 * This is a separate system from the main preset system to avoid conflicts.
 */

import type { OverlayElement } from '../types/overlay';
import type { OverlayPresetFile, OverlayPresetValidationResult } from './schema';
import { 
  OVERLAY_PRESET_SCHEMA_VERSION,
  isOverlayPresetFile,
  validateOverlayPresetFile 
} from './schema';
import { MAX_OVERLAY_ELEMENTS } from '../utils/overlaySettingsHelpers';

/**
 * Import result structure.
 */
export interface OverlayPresetImportResult {
  /** Whether import was successful */
  success: boolean;
  /** Imported elements (if successful) */
  elements?: OverlayElement[];
  /** Validation result */
  validation?: OverlayPresetValidationResult;
  /** Error message (if failed) */
  error?: string;
}

import { APP_VERSION } from '../version';

/**
 * Exports overlay elements to .nzxt-esc-overlay-preset file.
 * 
 * @param elements - Array of overlay elements to export
 * @param presetName - Name for the preset
 * @param filename - Optional filename (without extension, defaults to presetName)
 * @returns Promise that resolves when export is complete
 */
export async function exportOverlayPreset(
  elements: OverlayElement[],
  presetName: string,
  filename?: string
): Promise<void> {
  try {
    const now = new Date().toISOString();
    const appVersion = APP_VERSION;
    
    // Create overlay preset file structure
    const presetFile: OverlayPresetFile = {
      schemaVersion: OVERLAY_PRESET_SCHEMA_VERSION,
      format: 'overlay-preset',
      appVersion,
      elements: [...elements], // Copy array to avoid mutations
      meta: {
        name: presetName,
        createdAt: now,
      },
    };
    
    // Convert to JSON
    const json = JSON.stringify(presetFile, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download filename (sanitize presetName for filename)
    // Remove invalid characters: / \ : * ? " < > |
    const sanitizedName = (presetName || 'overlay-preset')
      .replace(/[^a-z0-9\s-]/gi, '-')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 100); // Limit length
    const finalFilename = filename || sanitizedName || `overlay-preset-${Date.now()}`;
    
    // Create temporary anchor and trigger download
    const a = document.createElement('a');
    a.href = url;
    // FAZ-10: Use provided filename or generate from presetName
    a.download = `${finalFilename || sanitizedName || `overlay-preset-${Date.now()}`}.nzxt-esc-overlay-preset`;
    a.style.display = 'none'; // Hide the link
    document.body.appendChild(a);
    
    // Trigger download
    a.click();
    
    // Remove link from DOM immediately after click
    document.body.removeChild(a);
    
    // CRITICAL: Delay URL revoke to ensure download completes
    // This fixes the issue where blob URL is revoked before browser can download
    // Works in both HTTP (dev) and HTTPS (prod) environments
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000); // 1 second delay is safe for most browsers
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to export overlay preset file: ${errorMessage}`);
  }
}

/**
 * Imports an overlay preset file.
 * 
 * Pipeline:
 * 1. Validate file type (must be .nzxt-esc-overlay-preset)
 * 2. Read and parse JSON
 * 3. Type guard check (isOverlayPresetFile)
 * 4. Validate structure and elements
 * 5. Return elements or errors
 * 
 * @param file - File object from file input
 * @returns Promise that resolves with import result
 */
export async function importOverlayPreset(
  file: File
): Promise<OverlayPresetImportResult> {
  try {
    // Step 1: Validate file type
    if (!file.name.endsWith('.nzxt-esc-overlay-preset')) {
      return {
        success: false,
        error: 'Invalid file type. Expected .nzxt-esc-overlay-preset file.',
      };
    }
    
    // Step 2: Read and parse JSON
    let parsed: unknown;
    try {
      const text = await file.text();
      parsed = JSON.parse(text);
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse JSON file. Please check the file format.',
      };
    }
    
    // Step 3: Type guard check
    if (!isOverlayPresetFile(parsed)) {
      return {
        success: false,
        error: 'Invalid overlay preset file structure. Missing required fields or incorrect format.',
      };
    }
    
    // Step 4: Validate structure and elements
    const validation = validateOverlayPresetFile(parsed);
    
    if (!validation.valid) {
      const errorMessages = validation.errors.map(err => `${err.field}: ${err.message}`).join('; ');
      return {
        success: false,
        validation,
        error: `Validation failed: ${errorMessages}`,
      };
    }
    
    // Step 5: Extract elements (defensive array check)
    // DEFENSIVE: Ensure elements is always an array
    const parsedElements = Array.isArray(parsed.elements) ? parsed.elements : [];
    const elements = [...parsedElements]; // Copy array to avoid mutations
    
    // File-level limit: Truncate if file contains too many elements
    // (Runtime-level limit check happens in OverlaySettings.tsx)
    let finalElements = elements;
    if (finalElements.length > MAX_OVERLAY_ELEMENTS) {
      finalElements = finalElements.slice(0, MAX_OVERLAY_ELEMENTS);
    }
    
    // Step 6: Return elements
    return {
      success: true,
      elements: finalElements,
      validation,
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred during import',
    };
  }
}

