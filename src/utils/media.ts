/**
 * Media utility functions for detecting and handling media types.
 */

import { isYouTubeUrl } from './youtube';

/**
 * Checks if a URL points to a video file.
 * 
 * @param url - Media URL to check
 * @returns True if URL is a video (MP4)
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  return /\.mp4($|\?)/i.test(url) || url.toLowerCase().includes('mp4');
}

/**
 * Determines the media type from URL.
 * 
 * @param url - Media URL to analyze
 * @returns Media type: 'video', 'image', 'youtube', or 'unknown'
 */
export function getMediaType(url: string): 'video' | 'image' | 'youtube' | 'unknown' {
  if (!url) return 'unknown';
  
  // Check YouTube URLs first (before video/image checks)
  // This ensures YouTube URLs are classified correctly
  if (isYouTubeUrl(url)) return 'youtube';
  
  // Check for direct video files (MP4)
  if (isVideoUrl(url)) return 'video';
  
  // Check for image files
  if (/\.(jpg|jpeg|png|gif|webp)($|\?)/i.test(url)) return 'image';
  
  return 'unknown';
}

