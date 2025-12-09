import type { CSSProperties } from 'react';
import type { AppSettings } from '../../../constants/defaults';
import { getBaseAlign } from '../../../utils/positioning';
import { lcdToPreview } from '../../../utils/positioning';
import { useI18n } from '@/i18n/useI18n';

/**
 * Placeholder Renderer Component for YouTube in Preview Mode
 * 
 * Renders a placeholder box instead of the actual YouTube iframe in Preview mode.
 * The placeholder maintains 16:9 aspect ratio and participates in the transform engine.
 * 
 * Transform Engine Compatibility:
 * - Scale: Applied via wrapper transform
 * - Offset: Applied via wrapper translate (Preview coordinates)
 * - Align: Base alignment + user offset (MP4 pipeline ile aynı)
 * - Fit: Wrapper size calculated based on fit mode (cover/contain/fill)
 * 
 * Architecture: Single wrapper div
 * - Wrapper handles all transforms (scale, translate, align)
 * - Placeholder box maintains 16:9 aspect ratio
 * - Wrapper size calculated based on fit mode
 */
interface PlaceholderRendererProps {
  width: number; // Container width (200px for Preview)
  height: number; // Container height (200px for Preview)
  scale: number;
  offsetX: number; // LCD coordinates (will be converted to Preview)
  offsetY: number; // LCD coordinates (will be converted to Preview)
  align: AppSettings['align'];
  fit: AppSettings['fit'];
  offsetScale: number; // For converting LCD to Preview coordinates
}

export default function PlaceholderRenderer({
  width,
  height,
  scale,
  offsetX,
  offsetY,
  align,
  fit,
  offsetScale,
}: PlaceholderRendererProps) {
  const t = useI18n();
  // YouTube standard aspect ratio (16:9)
  const youtubeAspectRatio = 16 / 9;

  // Convert LCD coordinates to Preview coordinates (MP4 pipeline ile aynı)
  const previewOffsetX = lcdToPreview(offsetX, offsetScale);
  const previewOffsetY = lcdToPreview(offsetY, offsetScale);

  // Calculate wrapper size based on fit mode (MP4 objectFit mantığı)
  // Bu hesaplama önce yapılmalı çünkü wrapper boyutuna ihtiyacımız var
  let wrapperWidth: number;
  let wrapperHeight: number;
  let contentWidth: number;
  let contentHeight: number;

  if (fit === 'fill') {
    // Fill: Wrapper fills container, content stretches (distorts 16:9)
    wrapperWidth = width;
    wrapperHeight = height;
    contentWidth = width;
    contentHeight = height;
  } else if (fit === 'contain') {
    // Contain: Content fits within container, maintains 16:9
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
    contentWidth = wrapperWidth;
    contentHeight = wrapperHeight;
  } else {
    // Cover: Content covers container, maintains 16:9, clipped
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
    contentWidth = wrapperWidth;
    contentHeight = wrapperHeight;
  }

  // Calculate base alignment (MP4 pipeline ile aynı - getBaseAlign kullanarak)
  const baseAlign = getBaseAlign(align);
  // Base align container içindeki referans noktasını belirler (% olarak)
  const baseAlignX = (baseAlign.x / 100) * width;  // % → px (container koordinatlarında)
  const baseAlignY = (baseAlign.y / 100) * height; // % → px (container koordinatlarında)

  // Wrapper'ın merkezini container'ın base align noktasına hizala
  // Formül: wrapper merkezi = container referans noktası - wrapper boyutu/2 + user offset
  // Bu formül MP4 pipeline'daki objectPosition davranışını simüle eder
  const totalOffsetX = baseAlignX - (wrapperWidth / 2) + previewOffsetX;
  const totalOffsetY = baseAlignY - (wrapperHeight / 2) + previewOffsetY;

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

  // Placeholder box style: 16:9 aspect ratio, centered in wrapper
  const placeholderStyle: CSSProperties = {
    width: `${contentWidth}px`,
    height: `${contentHeight}px`,
    backgroundColor: '#FF0000', // YouTube Red
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)', // Always centered in wrapper
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
        {t('previewDisabledForYouTube')}
      </div>
    </div>
  );
}

