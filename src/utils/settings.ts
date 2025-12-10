import { DEFAULT_SETTINGS, type AppSettings } from '../constants/defaults';
import { DEFAULT_OVERLAY } from '../types/overlay';

/**
 * Merges saved settings with defaults, ensuring all fields are present.
 * 
 * @param saved - Saved settings object (may be partial)
 * @returns Complete settings object with defaults applied
 */
export function mergeSettings(saved: any): AppSettings {
  // Safely ignore localMediaId if present in saved settings (legacy field, no longer used)
  const { localMediaId, ...savedWithoutLocalMediaId } = saved || {};
  
  // Background settings are preset-specific; ignore them from localStorage merge
  const {
    scale,
    x,
    y,
    fit,
    align,
    loop,
    autoplay,
    mute,
    resolution,
    backgroundColor,
    ...savedWithoutBackgroundFields
  } = savedWithoutLocalMediaId || {};
  
  return {
    ...DEFAULT_SETTINGS,
    ...savedWithoutBackgroundFields,
    overlay: {
      ...DEFAULT_OVERLAY,
      ...(savedWithoutBackgroundFields?.overlay || {}),
    },
  };
}

/**
 * Validates settings object structure.
 * 
 * @param settings - Settings object to validate
 * @returns True if settings are valid
 */
export function validateSettings(settings: any): settings is AppSettings {
  if (!settings || typeof settings !== 'object') return false;
  
  // Basic type checks
  if (typeof settings.scale !== 'number') return false;
  if (typeof settings.x !== 'number') return false;
  if (typeof settings.y !== 'number') return false;
  
  return true;
}

