import type { CSSProperties } from 'react';
import type { AppSettings } from '../../../constants/defaults';
import { getBaseAlign } from '../../../utils/positioning';

/**
 * YouTube Renderer Component
 * 
 * Renders YouTube videos as background media using iframe embed.
 * Uses wrapper div approach to simulate objectFit/objectPosition behavior
 * since iframe elements don't support CSS object-fit properties.
 * 
 * Transform Engine Compatibility:
 * - Scale: Applied via wrapper transform
 * - Offset: Applied via wrapper translate (LCD coordinates, direkt)
 * - Align: Base alignment + user offset (MP4 pipeline ile aynı)
 * - Fit: Wrapper size calculated based on fit mode (cover/contain/fill)
 * 
 * Architecture: Single wrapper div
 * - Wrapper handles all transforms (scale, translate, align)
 * - iframe maintains 16:9 aspect ratio within wrapper
 * - objectFit simulation via wrapper size calculations
 */
interface YouTubeRendererProps {
  embedUrl: string;
  width: number; // LCD container width (640px default)
  height: number; // LCD container height (640px default)
  scale: number;
  offsetX: number; // LCD coordinates (direkt kullanılacak)
  offsetY: number; // LCD coordinates (direkt kullanılacak)
  align: AppSettings['align'];
  fit: AppSettings['fit'];
}

export default function YouTubeRenderer({
  embedUrl,
  width,
  height,
  scale,
  offsetX,
  offsetY,
  align,
  fit,
}: YouTubeRendererProps) {
  // YouTube standard aspect ratio (16:9)
  const youtubeAspectRatio = 16 / 9;

  // Calculate base alignment (MP4 pipeline ile aynı)
  const baseAlign = getBaseAlign(align);
  const baseAlignX = (baseAlign.x / 100) * width;  // % → px
  const baseAlignY = (baseAlign.y / 100) * height; // % → px

  // Calculate total offset (base align + user offset) - LCD coordinates direkt
  const totalOffsetX = baseAlignX + offsetX;
  const totalOffsetY = baseAlignY + offsetY;

  // Calculate wrapper size based on fit mode (MP4 objectFit mantığı)
  let wrapperWidth: number;
  let wrapperHeight: number;
  let iframeWidth: number;
  let iframeHeight: number;

  if (fit === 'fill') {
    // Fill: Wrapper fills container, iframe stretches (distorts 16:9)
    wrapperWidth = width;
    wrapperHeight = height;
    iframeWidth = width;
    iframeHeight = height;
  } else if (fit === 'contain') {
    // Contain: iframe fits within container, maintains 16:9
    const containerAspectRatio = width / height;
    if (containerAspectRatio > youtubeAspectRatio) {
      // Container is wider, fit by height
      wrapperHeight = height;
      wrapperWidth = height * youtubeAspectRatio;
    } else {
      // Container is taller, fit by width
      wrapperWidth = width;
      wrapperHeight = width / youtubeAspectRatio;
    }
    iframeWidth = wrapperWidth;
    iframeHeight = wrapperHeight;
  } else {
    // Cover: iframe covers container, maintains 16:9, clipped
    const containerAspectRatio = width / height;
    if (containerAspectRatio > youtubeAspectRatio) {
      // Container is wider, cover by width
      wrapperWidth = width;
      wrapperHeight = width / youtubeAspectRatio;
    } else {
      // Container is taller, cover by height
      wrapperHeight = height;
      wrapperWidth = height * youtubeAspectRatio;
    }
    iframeWidth = wrapperWidth;
    iframeHeight = wrapperHeight;
  }

  // Wrapper style: handles positioning, scaling, and clipping
  // Position: absolute to allow precise positioning
  // Transform: combines base align + user offset + scale
  const wrapperStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${wrapperWidth}px`,
    height: `${wrapperHeight}px`,
    overflow: 'hidden',
    transform: `translate(${totalOffsetX}px, ${totalOffsetY}px) scale(${scale})`,
    transformOrigin: 'center center',
  };

  // iframe style: 16:9 aspect ratio, centered in wrapper
  const iframeStyle: CSSProperties = {
    width: `${iframeWidth}px`,
    height: `${iframeHeight}px`,
    border: 'none',
    pointerEvents: 'none', // Prevent user interaction (background media)
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)', // Always centered in wrapper
    transformOrigin: 'center center',
  };

  return (
    <div className="yt-wrapper" style={wrapperStyle}>
      <iframe
        src={embedUrl}
        className="yt-frame"
        style={iframeStyle}
        allow="autoplay; encrypted-media"
        allowFullScreen={false}
        title="YouTube background video"
      />
    </div>
  );
}

