import type { AppSettings } from '../../../constants/defaults';
import { getMediaType } from '../../../utils/media';
import PlaceholderRenderer from '../BackgroundMedia/PlaceholderRenderer';

interface BackgroundMediaRendererProps {
  mediaUrl: string | null;
  settings: AppSettings;
  isVideo: boolean;
  objectPosition: string;
  opacity?: number;
  style?: React.CSSProperties;
  offsetScale?: number; // For YouTube Preview coordinate conversion
}

/**
 * Reusable background media renderer component.
 * Extracted from BackgroundPreview to be shared with OverlayPreview.
 * 
 * Renders video or image media with the same styling and positioning logic
 * as BackgroundPreview, but with configurable opacity and additional styles.
 * 
 * Now supports YouTube videos via iframe embed.
 */
export default function BackgroundMediaRenderer({
  mediaUrl,
  settings,
  isVideo,
  objectPosition,
  opacity = 1,
  style = {},
  offsetScale = 0.3125, // Default: 200/640 (Preview size / LCD size)
}: BackgroundMediaRendererProps) {
  // Detect media type
  const mediaType = mediaUrl ? getMediaType(mediaUrl) : 'unknown';

  // YouTube path: Use PlaceholderRenderer component (Preview mode only)
  // LCD mode uses MediaRenderer which renders YouTubeRenderer directly
  if (mediaType === 'youtube' && mediaUrl) {
    // Container dimensions: Preview circle is 200x200 (from ConfigPreview.css)
    // This matches the actual preview container size
    const containerWidth = 200;
    const containerHeight = 200;

    return (
      <PlaceholderRenderer
        width={containerWidth}
        height={containerHeight}
        scale={settings.scale}
        offsetX={settings.x}
        offsetY={settings.y}
        align={settings.align}
        fit={settings.fit}
        offsetScale={offsetScale}
      />
    );
  }

  // Original video/image paths: Unchanged
  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: settings.fit,
    objectPosition,
    transform: `scale(${settings.scale})`,
    transformOrigin: 'center center',
    opacity,
    ...style,
  };

  if (isVideo) {
    return (
      <video
        src={mediaUrl || undefined}
        autoPlay
        muted
        loop
        playsInline
        style={baseStyle}
      />
    );
  }

  if (mediaUrl) {
    return (
      <img
        src={mediaUrl}
        alt="preview"
        style={baseStyle}
      />
    );
  }

  return null;
}

