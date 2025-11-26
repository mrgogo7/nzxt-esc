import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import type { AppSettings } from '../../../constants/defaults';
import BackgroundMediaRenderer from './BackgroundMediaRenderer';
import { t, getInitialLang, type Lang } from '../../../i18n';

interface BackgroundPreviewProps {
  mediaUrl: string | null;
  settings: AppSettings;
  isVideo: boolean;
  objectPosition: string;
  adjX: number;
  adjY: number;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onScaleChange: (delta: number) => void;
  previewTitle: string;
  offsetScale: number; // For YouTube Preview coordinate conversion
  isLocalLoading?: boolean;
  isLocalMissing?: boolean;
}

/**
 * Background preview component.
 * Displays the media preview with drag support and zoom controls.
 */
export default function BackgroundPreview({
  mediaUrl,
  settings,
  isVideo,
  objectPosition,
  adjX,
  adjY,
  isDragging,
  onMouseDown,
  onScaleChange,
  previewTitle,
  offsetScale,
  isLocalLoading = false,
  isLocalMissing = false,
}: BackgroundPreviewProps) {
  const [lang] = useState<Lang>(getInitialLang());
  const [showScaleLabel, setShowScaleLabel] = useState(false);
  const [showOffsetLabel, setShowOffsetLabel] = useState(false);

  // Show scale label when scale changes, hide after 1 second
  useEffect(() => {
    setShowScaleLabel(true);
    const timer = setTimeout(() => {
      setShowScaleLabel(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [settings.scale]);

  // Show offset label when x or y changes, hide after 1 second
  useEffect(() => {
    setShowOffsetLabel(true);
    const timer = setTimeout(() => {
      setShowOffsetLabel(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [settings.x, settings.y]);

  return (
    <div className="preview-column">
      <div className="preview-title">{previewTitle}</div>
      <div className="nzxt-glow-wrapper">
        {showScaleLabel && (
          <div className="scale-label">Scale: {settings.scale.toFixed(2)}×</div>
        )}
        {showOffsetLabel && (
          <div className="offset-label">X: {settings.x} Y: {settings.y}</div>
        )}
        <div
          className={`preview-circle ${isDragging ? 'dragging' : ''}`}
          onMouseDown={onMouseDown}
          style={{
            backgroundColor: settings.backgroundColor || '#000000',
          }}
        >

        <BackgroundMediaRenderer
          mediaUrl={mediaUrl}
          settings={settings}
          isVideo={isVideo}
          objectPosition={objectPosition}
          offsetScale={offsetScale}
        />

        {/* Local media loading / missing overlays */}
        {isLocalLoading && (
          <div className="local-media-overlay">
            <div className="local-media-overlay-content">
              {t('localMediaLoading', lang)}
            </div>
          </div>
        )}
        {isLocalMissing && !isLocalLoading && (
          <div className="local-media-overlay">
            <div className="local-media-overlay-content">
              {t('localMediaNotFound', lang)}
            </div>
          </div>
        )}

        {/* Overlay guide - only for alignment reference */}
        {settings.showGuide && (
          <div
            className="overlay-guide"
            style={{
              transform: `translate(${adjX}px, ${adjY}px) scale(${settings.scale})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="crosshair horizontal" />
            <div className="crosshair vertical" />
          </div>
        )}

        <div className="zoom-buttons-bottom">
          <motion.button
            onClick={() => onScaleChange(-0.1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            −
          </motion.button>
          <motion.button
            onClick={() => onScaleChange(0.1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            ＋
          </motion.button>
        </div>
        </div>
      </div>
    </div>
  );
}

