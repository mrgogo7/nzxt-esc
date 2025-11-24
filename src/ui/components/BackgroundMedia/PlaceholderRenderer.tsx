import type { CSSProperties } from 'react';

/**
 * Placeholder Renderer Component for YouTube in Preview Mode
 * 
 * Renders a placeholder box instead of the actual YouTube iframe in Preview mode.
 * The placeholder maintains 16:9 aspect ratio and participates in the transform engine.
 * 
 * Transform Engine Compatibility:
 * - Scale: Applied via wrapper transform
 * - Offset: Applied via wrapper translate
 * - Always centered (no align/fit)
 * 
 * Architecture: Single wrapper div
 * - Wrapper handles all transforms (scale, translate)
 * - Placeholder box maintains 16:9 aspect ratio
 * - Height matches wrapper, width calculated from aspect ratio
 */
interface PlaceholderRendererProps {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export default function PlaceholderRenderer({
  width,
  height,
  scale,
  offsetX,
  offsetY,
}: PlaceholderRendererProps) {
  // YouTube standard aspect ratio (16:9)
  const youtubeAspectRatio = 16 / 9;

  // Wrapper: Always full container size
  const wrapperWidth = width;
  const wrapperHeight = height;

  // Only use user offset (settings.x, settings.y)
  const totalOffsetX = offsetX;
  const totalOffsetY = offsetY;

  // Wrapper style: handles positioning, scaling, and clipping
  // Position: absolute to allow precise positioning
  // Transform: combines user offset and scale
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

  // Placeholder box style: always centered, height matches wrapper, width auto (preserve aspect ratio)
  // Height: 100% of wrapper
  // Width: auto (calculated from aspect ratio)
  const placeholderWidth = wrapperHeight * youtubeAspectRatio;
  const placeholderStyle: CSSProperties = {
    width: `${placeholderWidth}px`,
    height: '100%',
    backgroundColor: '#FF0000', // YouTube Red
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)', // Always centered
    transformOrigin: 'center center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: '14px',
    textAlign: 'center',
    padding: '8px',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
  };

  return (
    <div className="yt-placeholder-wrapper" style={wrapperStyle}>
      <div className="yt-placeholder-box" style={placeholderStyle}>
        Preview disabled for YouTube
      </div>
    </div>
  );
}

