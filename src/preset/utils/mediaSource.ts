/**
 * Background media source model for presets (v2).
 *
 * This layer is PRESET-ONLY metadata. Runtime media loading still uses
 * mediaUrl/background.url as the primary source of truth.
 */

import { isYouTubeUrl } from '../../utils/youtube';

/**
 * Full background source types stored in preset metadata.
 *
 * NOTE:
 * - Runtime AppSettings will only distinguish between 'remote' and 'local'.
 * - 'youtube' and 'pinterest' are kept here for richer preset metadata
 *   and potential future UI (labels, filters, etc.).
 */
export type BackgroundSourceType = 'remote' | 'youtube' | 'pinterest' | 'local';

/**
 * Background source descriptor stored in PresetFile.background.source.
 *
 * IMPORTANT:
 * - For type: 'local' we NEVER store binary data, only metadata.
 *   localFileName is expected to be a user- or system-provided identifier.
 * - For all non-local types, url should mirror background.url.
 */
export interface BackgroundSource {
  type: BackgroundSourceType;
  url?: string;
  localFileName?: string;
}

/**
 * Derives background source information from a URL.
 *
 * Rules:
 * - Empty / falsy URL  → { type: 'remote', url: '' }  (explicit "no media")
 * - YouTube URLs       → { type: 'youtube',   url }
 * - Pinterest CDN/URLs → { type: 'pinterest', url }
 * - Everything else    → { type: 'remote',    url }
 *
 * This function is PURE and should not access DOM or network.
 */
export function deriveBackgroundSourceFromUrl(rawUrl: unknown): BackgroundSource {
  const url = typeof rawUrl === 'string' ? rawUrl : '';
  const trimmed = url.trim();

  // No media: always explicit remote:'' as requested
  if (!trimmed) {
    return {
      type: 'remote',
      url: '',
    };
  }

  // YouTube detection (centralized util)
  if (isYouTubeUrl(trimmed)) {
    return {
      type: 'youtube',
      url: trimmed,
    };
  }

  const lower = trimmed.toLowerCase();

  // Pinterest: resolved media URLs or pinterest domain
  if (lower.includes('pinimg.com') || lower.includes('pinterest.com')) {
    return {
      type: 'pinterest',
      url: trimmed,
    };
  }

  // Fallback: generic remote
  return {
    type: 'remote',
    url: trimmed,
  };
}

/**
 * Sanitizes an existing BackgroundSource object.
 *
 * - If the shape is invalid, returns null (caller should treat as "no source")
 * - Does NOT throw; logs a warning for forward compatibility.
 */
export function sanitizeBackgroundSource(
  source: any,
  context: string = 'PresetFile.background.source'
): BackgroundSource | null {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const type = (source as { type?: unknown }).type;

  if (
    type !== 'remote' &&
    type !== 'youtube' &&
    type !== 'pinterest' &&
    type !== 'local'
  ) {
    // Invalid type – ignore source entirely
    return null;
  }

  const sanitized: BackgroundSource = { type };

  if (typeof (source as any).url === 'string') {
    sanitized.url = (source as any).url;
  }

  if (typeof (source as any).localFileName === 'string') {
    sanitized.localFileName = (source as any).localFileName;
  }

  return sanitized;
}


