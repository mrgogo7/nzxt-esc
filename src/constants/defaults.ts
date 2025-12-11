import { DEFAULT_OVERLAY, type Overlay } from '../types/overlay';

/**
 * Application settings interface.
 * Note: url is stored separately via useMediaUrl hook, not in settings.
 */
export interface AppSettings {
  scale: number;
  x: number;
  y: number;
  fit: 'cover' | 'contain' | 'fill';
  align: 'center' | 'top' | 'bottom' | 'left' | 'right';
  loop: boolean;
  autoplay: boolean;
  mute: boolean;
  resolution: string;
  showGuide?: boolean;
  overlay?: Overlay; // Migration from legacy OverlaySettings is handled by useOverlayConfig hook
  // Optional: url can be included in saved config for backward compatibility
  url?: string;
  // Optional: backgroundColor for color tab (solid color background)
  backgroundColor?: string;
  /**
   * Background media source type at runtime.
   *
   * NOTE:
   * - This is intentionally coarse-grained: only 'remote' vs 'local'.
   * - YouTube/Pinterest are represented in preset metadata via
   *   background.source.type, not here.
   */
  sourceType?: 'remote' | 'local';
  /**
   * Local media file identifier (metadata only).
   *
   * - When sourceType === 'local', this may contain a file name or
   *   user-defined identifier for the local file.
   * - Binary data is NEVER stored here.
   */
  localFileName?: string;
  /**
   * Local media ID used for IndexedDB lookups.
   *
   * - Typically this will be set to the presetId so that each preset
   *   owns at most one local media record.
   * - This value is NOT exported into .nzxt-esc-preset files; it is
   *   used only at runtime and in local storage.
   */
  localMediaId?: string;
}

/**
 * Default media URL (Pinterest video example).
 */
export const DEFAULT_MEDIA_URL =
  'https://v1.pinimg.com/videos/iht/expMp4/b0/95/18/b09518df640864a0181b5d242ad49c2b_720w.mp4';

/**
 * Default application settings.
 * Used when no saved configuration exists.
 */
export const DEFAULT_SETTINGS: AppSettings = {
  scale: 1,
  x: 0,
  y: 0,
  fit: 'cover',
  align: 'center',
  loop: true,
  autoplay: true,
  mute: true,
  resolution: '640x640',
  showGuide: true,
  overlay: DEFAULT_OVERLAY, // New Overlay model
  backgroundColor: '#000000',
};

/**
 * Default overlay metrics (used before real data arrives).
 */
export const DEFAULT_METRICS = {
  cpuTemp: 0,
  cpuLoad: 0,
  cpuClock: 0,
  liquidTemp: 0,
  gpuTemp: 0,
  gpuLoad: 0,
  gpuClock: 0,
} as const;

