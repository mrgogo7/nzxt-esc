import type { CSSProperties } from 'react';

/**
 * YouTube Renderer Component
 * 
 * Renders YouTube videos as background media using iframe embed.
 * Uses wrapper div approach to simulate objectFit/objectPosition behavior
 * since iframe elements don't support CSS object-fit properties.
 * 
 * Transform Engine Compatibility:
 * - Scale: Applied via wrapper transform
 * - Offset: Applied via wrapper translate
 * - Align: Applied via wrapper positioning
 * - Fit: Simulated via wrapper size calculations
 * 
 * Architecture: Single wrapper div (Option A)
 * - Wrapper handles all transforms (scale, translate, align)
 * - iframe fills wrapper at 100% width/height
 * - objectFit simulation via wrapper size calculations
 */
interface YouTubeRendererProps {
  embedUrl: string;
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  fit: 'cover' | 'contain' | 'fill';
  align: { x: number; y: number }; // 0-1 range (0 = left/top, 1 = right/bottom, 0.5 = center)
}

export default function YouTubeRenderer({
  embedUrl,
  width,
  height,
  scale,
  offsetX,
  offsetY,
  fit,
  align,
}: YouTubeRendererProps) {
  // YouTube standard aspect ratio (16:9)
  const youtubeAspectRatio = 16 / 9;
  const containerAspectRatio = width / height;

  // Calculate wrapper dimensions based on fit mode
  // Since iframe doesn't support objectFit, we simulate it via wrapper size
  let wrapperWidth: number;
  let wrapperHeight: number;
  let iframeScale = 1;

  if (fit === 'cover') {
    // Cover: Fill container, may crop (similar to object-fit: cover)
    // Wrapper should be sized to cover the entire container
    if (containerAspectRatio > youtubeAspectRatio) {
      // Container is wider than video, fit to height and scale width
      wrapperHeight = height;
      wrapperWidth = height * youtubeAspectRatio;
      iframeScale = width / wrapperWidth; // Scale to cover width
    } else {
      // Container is taller than video, fit to width and scale height
      wrapperWidth = width;
      wrapperHeight = width / youtubeAspectRatio;
      iframeScale = height / wrapperHeight; // Scale to cover height
    }
  } else if (fit === 'contain') {
    // Contain: Fit within container, may have letterboxing (similar to object-fit: contain)
    // Wrapper maintains aspect ratio, fits within container
    if (containerAspectRatio > youtubeAspectRatio) {
      // Container is wider, fit to height
      wrapperHeight = height;
      wrapperWidth = height * youtubeAspectRatio;
    } else {
      // Container is taller, fit to width
      wrapperWidth = width;
      wrapperHeight = width / youtubeAspectRatio;
    }
  } else {
    // Fill: Stretch to fill (similar to object-fit: fill)
    wrapperWidth = width;
    wrapperHeight = height;
  }

  // Calculate alignment offset
  // align.x and align.y are 0-1 range (0 = left/top, 1 = right/bottom, 0.5 = center)
  // This simulates object-position behavior
  const alignOffsetX = (align.x - 0.5) * (width - wrapperWidth);
  const alignOffsetY = (align.y - 0.5) * (height - wrapperHeight);

  // Combine alignment offset with user offset (settings.x, settings.y)
  const totalOffsetX = alignOffsetX + offsetX;
  const totalOffsetY = alignOffsetY + offsetY;

  // Wrapper style: handles positioning, scaling, and clipping
  // Position: absolute to allow precise positioning
  // Transform: combines alignment offset, user offset, and scale
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

  // iframe style: fills wrapper, no pointer events
  // For 'cover' mode, iframe is scaled up to fill wrapper
  const iframeStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
    pointerEvents: 'none', // Prevent user interaction (background media)
    transform: fit === 'cover' && iframeScale > 1 ? `scale(${iframeScale})` : 'none',
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

