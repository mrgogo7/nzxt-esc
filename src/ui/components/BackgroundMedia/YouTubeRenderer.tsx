import type { CSSProperties } from 'react';

/**
 * YouTube Renderer Component
 * 
 * Renders YouTube videos as background media using iframe embed.
 * Uses the same transform normalization system as mp4/image media.
 * 
 * Transform Engine Compatibility:
 * - Uses 100% container size (same as mp4/image)
 * - Scale: Applied via transform (same as mp4/image)
 * - Position: Uses objectPosition (same as mp4/image)
 * - Maintains 16:9 aspect ratio within normalized coordinate system
 */
interface YouTubeRendererProps {
  embedUrl: string;
  objectPosition: string; // CSS object-position string (same as mp4/image)
  scale: number;
}

export default function YouTubeRenderer({
  embedUrl,
  objectPosition,
  scale,
}: YouTubeRendererProps) {
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

  // iframe style: maintains 16:9 aspect ratio
  // Height: 100% of container (matches mp4/image approach)
  // Width: calculated to maintain 16:9 (height * 16/9)
  // Position: uses objectPosition calculation (same as mp4/image)
  // Since iframe doesn't support object-position, we use the calc() string directly in left/top
  const iframeStyle: CSSProperties = {
    width: `calc(100% * ${youtubeAspectRatio})`, // Maintain 16:9: width = height * 16/9
    height: '100%',
    border: 'none',
    pointerEvents: 'none', // Prevent user interaction (background media)
    position: 'absolute',
    left: objectPosition.split(' ')[0] || '50%', // Extract X position from objectPosition
    top: objectPosition.split(' ')[1] || '50%', // Extract Y position from objectPosition
    transform: 'translate(-50%, -50%)', // Center on the position point (same as object-position behavior)
    transformOrigin: 'center center',
  };

  return (
    <div className="yt-wrapper" style={baseStyle}>
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

