import { DEFAULT_SETTINGS, DEFAULT_OVERLAY } from '../constants/defaults';
import type { AppSettings } from '../types/overlay';

/**
 * Merge saved settings with defaults, ensuring all required fields exist.
 */
export function mergeSettings(saved: Partial<AppSettings>): AppSettings {
  const merged: AppSettings = {
    ...DEFAULT_SETTINGS,
    ...saved,
    overlay: {
      ...DEFAULT_OVERLAY,
      ...saved.overlay,
    },
  };

  return merged;
}
