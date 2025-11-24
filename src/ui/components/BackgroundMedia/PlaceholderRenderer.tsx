import type { CSSProperties } from 'react';

/**
 * Placeholder Renderer Component for YouTube in Preview Mode
 * 
 * Renders a placeholder box instead of the actual YouTube iframe in Preview mode.
 * Uses the same transform normalization system as mp4/image media.
 * 
 * Transform Engine Compatibility:
 * - Uses 100% container size (same as mp4/image)
 * - Scale: Applied via transform (same as mp4/image)
 * - Position: Uses objectPosition (same as mp4/image)
 * - Maintains 16:9 aspect ratio within normalized coordinate system
 */
interface PlaceholderRendererProps {
  objectPosition: string; // CSS object-position string (same as mp4/image)
  scale: number;
}

export default function PlaceholderRenderer({
  objectPosition,
  scale,
}: PlaceholderRendererProps) {
  // YouTube standard aspect ratio (16:9)
  const youtubeAspectRatio = 16 / 9;

  // Base style: matches mp4/image media exactly
  // Uses 100% width/height to fill container (same as mp4/image)
  // Scale applied via transform (same as mp4/image)
  const baseStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    position: 'relative',
    overflow: 'hidden',
  };

  // Placeholder box style: maintains 16:9 aspect ratio
  // Height: 100% of container (matches mp4/image approach)
  // Width: calculated to maintain 16:9 (height * 16/9)
  // Position: uses objectPosition calculation (same as mp4/image)
  const placeholderStyle: CSSProperties = {
    width: `calc(100% * ${youtubeAspectRatio})`, // Maintain 16:9: width = height * 16/9
    height: '100%',
    backgroundColor: '#FF0000', // YouTube Red
    position: 'absolute',
    left: objectPosition.split(' ')[0] || '50%', // Extract X position from objectPosition
    top: objectPosition.split(' ')[1] || '50%', // Extract Y position from objectPosition
    transform: 'translate(-50%, -50%)', // Center on the position point (same as object-position behavior)
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
    <div className="yt-placeholder-wrapper" style={baseStyle}>
      <div className="yt-placeholder-box" style={placeholderStyle}>
        Preview disabled for YouTube
      </div>
    </div>
  );
}

