import type { AppSettings } from '../../../constants/defaults';
import { getMediaType } from '../../../utils/media';
import { extractYouTubeVideoId, buildYouTubeEmbedUrl } from '../../../utils/youtube';
import YouTubeRenderer from '../BackgroundMedia/YouTubeRenderer';

interface BackgroundMediaRendererProps {
  mediaUrl: string | null;
  settings: AppSettings;
  isVideo: boolean;
  objectPosition: string;
  opacity?: number;
  style?: React.CSSProperties;
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
}: BackgroundMediaRendererProps) {
  // Detect media type
  const mediaType = mediaUrl ? getMediaType(mediaUrl) : 'unknown';

  // YouTube path: Use YouTubeRenderer component
  if (mediaType === 'youtube' && mediaUrl) {
    const videoId = extractYouTubeVideoId(mediaUrl);
    if (videoId) {
      const embedUrl = buildYouTubeEmbedUrl(videoId);
      
      // Container dimensions: Use 100% of parent container
      // Parent container (preview circle or LCD) provides the bounds
      // We use a large default that will be clipped by parent's overflow
      // This matches how image/video elements work (100% width/height)
      // The actual container size is determined by the parent component
      // (BackgroundPreview uses 200px preview, KrakenOverlay uses 640px LCD)
      const containerWidth = 1000; // Large enough to cover any container
      const containerHeight = 1000; // Large enough to cover any container

      return (
        <YouTubeRenderer
          embedUrl={embedUrl}
          width={containerWidth}
          height={containerHeight}
          scale={settings.scale}
          offsetX={settings.x}
          offsetY={settings.y}
        />
      );
    }
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

