import type { AppSettings } from '../../../constants/defaults';

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
 */
export default function BackgroundMediaRenderer({
  mediaUrl,
  settings,
  isVideo,
  objectPosition,
  opacity = 1,
  style = {},
}: BackgroundMediaRendererProps) {
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

