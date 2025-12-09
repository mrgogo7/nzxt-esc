/**
 * YouTube URL parsing and embed URL generation utilities.
 * 
 * This module provides functions to:
 * - Detect YouTube URLs in various formats
 * - Extract video IDs from YouTube URLs
 * - Build YouTube embed URLs
 */

/**
 * Checks if a URL is a YouTube URL.
 * 
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * 
 * Does NOT match:
 * - youtube.com (domain only, no video)
 * - youtubekids.com
 * - music.youtube.com
 * - youtube.com/... (other paths without watch/shorts/embed)
 * 
 * @param url - URL to check
 * @returns True if URL is a YouTube video URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const trimmed = url.trim().toLowerCase();
  
  // Check for youtube.com or youtu.be domains
  const hasYoutubeDomain = trimmed.includes('youtube.com') || trimmed.includes('youtu.be');
  if (!hasYoutubeDomain) return false;
  
  // Exclude non-video YouTube domains
  if (trimmed.includes('youtubekids.com') || trimmed.includes('music.youtube.com')) {
    return false;
  }
  
  // Check for video-specific paths
  const hasVideoPath = 
    trimmed.includes('/watch') ||
    trimmed.includes('/shorts/') ||
    trimmed.includes('/embed/') ||
    trimmed.includes('youtu.be/');
  
  // If it's youtube.com but no video path, it's not a video URL
  if (trimmed.includes('youtube.com') && !hasVideoPath) {
    return false;
  }
  
  return hasVideoPath;
}

/**
 * Extracts video ID from various YouTube URL formats.
 * 
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID&t=30s
 * - https://youtu.be/VIDEO_ID
 * - https://youtu.be/VIDEO_ID?t=30
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * 
 * @param url - YouTube URL
 * @returns Video ID (11 characters) or null if not found
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  const trimmed = url.trim();
  
  // Pattern 1: watch?v=VIDEO_ID or watch?vi=VIDEO_ID
  // Matches: youtube.com/watch?v=VIDEO_ID or youtube.com/watch?vi=VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?)(?:.*&)?v(?:i)?=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }
  
  // Pattern 2: youtu.be/VIDEO_ID
  // Matches: youtu.be/VIDEO_ID or youtu.be/VIDEO_ID?t=30
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return youtuBeMatch[1];
  }
  
  // Pattern 3: /shorts/VIDEO_ID
  // Matches: youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }
  
  // Pattern 4: /embed/VIDEO_ID
  // Matches: youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }
  
  return null;
}

/**
 * Builds a YouTube embed URL from a video ID with optimized parameters.
 * 
 * Parameters are optimized for:
 * - NZXT CAM Web Integration (Chromium-based, autoplay requires mute)
 * - Background media playback (no controls, loop enabled)
 * - Clean UI (minimal branding, no annotations)
 * 
 * @param videoId - YouTube video ID (11 characters)
 * @returns YouTube embed URL with all parameters
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  if (!videoId || typeof videoId !== 'string') {
    throw new Error('Video ID is required');
  }
  
  // Basic validation: YouTube video IDs are 11 characters
  if (videoId.length !== 11) {
    throw new Error(`Invalid video ID length: expected 11 characters, got ${videoId.length}`);
  }
  
  // Validate characters (alphanumeric, underscore, hyphen)
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    throw new Error('Invalid video ID format');
  }
  
  // Build URL with parameters using URLSearchParams for proper encoding
  const baseUrl = `https://www.youtube.com/embed/${videoId}`;
  const params = new URLSearchParams();
  
  // Autoplay: Required for background media
  params.set('autoplay', '1');
  
  // Mute: Required for autoplay in modern browsers (especially CAM's Chromium)
  params.set('mute', '1');
  
  // Controls: Hide control bar for clean background media
  params.set('controls', '0');
  
  // Loop: Enable infinite loop
  params.set('loop', '1');
  
  // Playlist: Required for loop to work with single video
  // Must be set to the same video ID
  params.set('playlist', videoId);
  
  // Playsinline: Required for iOS inline playback
  params.set('playsinline', '1');
  
  // Rel: Reduce related videos (doesn't fully disable, but reduces)
  params.set('rel', '0');
  
  // Modestbranding: Reduce YouTube logo size
  params.set('modestbranding', '1');
  
  // Fs: Disable fullscreen button
  params.set('fs', '0');
  
  // Enablejsapi: Disable JavaScript API (not needed for basic playback)
  params.set('enablejsapi', '0');
  
  // Iv_load_policy: Disable video annotations/overlays
  params.set('iv_load_policy', '3');
  
  return `${baseUrl}?${params.toString()}`;
}

