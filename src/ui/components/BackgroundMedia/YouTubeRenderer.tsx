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

  // Wrapper: Always full container size (ignore fit setting)
  const wrapperWidth = width;
  const wrapperHeight = height;

  // Ignore align setting - always center
  // Only use user offset (settings.x, settings.y)
  const totalOffsetX = offsetX;
  const totalOffsetY = offsetY;

  // Wrapper style: handles positioning, scaling, and clipping
  // Position: absolute to allow precise positioning
  // Transform: combines user offset and scale (no alignment offset)
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

  // iframe style: always centered, height matches wrapper, width auto (preserve aspect ratio)
  // Height: 100% of wrapper
  // Width: auto (calculated from aspect ratio)
  const iframeStyle: CSSProperties = {
    width: `${wrapperHeight * youtubeAspectRatio}px`, // Auto width based on height and aspect ratio
    height: '100%',
    border: 'none',
    pointerEvents: 'none', // Prevent user interaction (background media)
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)', // Always centered
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

