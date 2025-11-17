import type { AppSettings } from '../constants/defaults';
import type { OverlaySettings } from '../types/overlay';

/**
 * Updates a single overlay field in settings.
 * This helper centralizes the state update pattern used throughout OverlaySettings.
 * 
 * @param settings - Current app settings
 * @param overlayConfig - Current overlay configuration
 * @param field - Field name to update
 * @param value - New value for the field
 * @returns Updated app settings
 */
export function updateOverlayField(
  settings: AppSettings,
  overlayConfig: OverlaySettings,
  field: keyof OverlaySettings,
  value: any
): AppSettings {
  return {
    ...settings,
    overlay: {
      ...overlayConfig,
      [field]: value,
    },
  };
}

/**
 * Resets a single overlay field to its default value.
 * 
 * @param settings - Current app settings
 * @param overlayConfig - Current overlay configuration
 * @param field - Field name to reset
 * @param defaultValue - Default value for the field
 * @returns Updated app settings
 */
export function resetOverlayFieldValue(
  settings: AppSettings,
  overlayConfig: OverlaySettings,
  field: keyof OverlaySettings,
  defaultValue: any
): AppSettings {
  return updateOverlayField(settings, overlayConfig, field, defaultValue);
}

/**
 * Updates multiple overlay fields at once.
 * Useful for mode switching or bulk updates.
 * 
 * @param settings - Current app settings
 * @param overlayConfig - Current overlay configuration
 * @param updates - Object with field-value pairs to update
 * @returns Updated app settings
 */
export function updateOverlayFields(
  settings: AppSettings,
  overlayConfig: OverlaySettings,
  updates: Partial<OverlaySettings>
): AppSettings {
  return {
    ...settings,
    overlay: {
      ...overlayConfig,
      ...updates,
    },
  };
}

/**
 * Updates a custom reading in the overlay settings.
 * 
 * @param settings - Current app settings
 * @param overlayConfig - Current overlay configuration
 * @param readingId - ID of the reading to update
 * @param updates - Partial reading object with fields to update
 * @returns Updated app settings
 */
export function updateCustomReading(
  settings: AppSettings,
  overlayConfig: OverlaySettings,
  readingId: string,
  updates: Partial<{ metric: any; numberColor: string; numberSize: number; x: number; y: number }>
): AppSettings {
  const currentReadings = [...(overlayConfig.customReadings || [])];
  const readingIndex = currentReadings.findIndex(r => r.id === readingId);
  
  if (readingIndex !== -1) {
    currentReadings[readingIndex] = {
      ...currentReadings[readingIndex],
      ...updates,
    };
  }
  
  return updateOverlayField(settings, overlayConfig, 'customReadings', currentReadings);
}

/**
 * Updates a custom text in the overlay settings.
 * 
 * @param settings - Current app settings
 * @param overlayConfig - Current overlay configuration
 * @param textId - ID of the text to update
 * @param updates - Partial text object with fields to update
 * @returns Updated app settings
 */
export function updateCustomText(
  settings: AppSettings,
  overlayConfig: OverlaySettings,
  textId: string,
  updates: Partial<{ text: string; textColor: string; textSize: number; x: number; y: number }>
): AppSettings {
  const currentTexts = [...(overlayConfig.customTexts || [])];
  const textIndex = currentTexts.findIndex(t => t.id === textId);
  
  if (textIndex !== -1) {
    currentTexts[textIndex] = {
      ...currentTexts[textIndex],
      ...updates,
    };
  }
  
  return updateOverlayField(settings, overlayConfig, 'customTexts', currentTexts);
}

