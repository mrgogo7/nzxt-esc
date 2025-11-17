import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lang, t } from '../../../../i18n';
import { isVideoUrl } from '../../../../utils/media';
import type { AppSettings } from '../../../../constants/defaults';
import { useBackgroundDrag } from './hooks/useBackgroundDrag';
import { useBackgroundPosition } from './hooks/useBackgroundPosition';
import '../../styles/ConfigPreview.css';

interface BackgroundPreviewProps {
  mediaUrl: string;
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
  lang: Lang;
  offsetScale: number;
  onScaleChange: (delta: number) => void;
}

/**
 * Background preview component with drag & drop and zoom functionality.
 */
export default function BackgroundPreview({
  mediaUrl,
  settings,
  setSettings,
  lang,
  offsetScale,
  onScaleChange,
}: BackgroundPreviewProps) {
  const isVideo = isVideoUrl(mediaUrl);
  const { objectPosition, adjX, adjY } = useBackgroundPosition(settings, offsetScale);
  const { isDragging, handleMouseDown } = useBackgroundDrag(
    offsetScale,
    settings,
    setSettings
  );

  // Zoom handler with wheel support
  useEffect(() => {
    const circle = document.querySelector('.preview-circle');
    if (!circle) return;

    const onWheel = (e: WheelEvent) => {
      if (!circle.contains(e.target as Node)) return;

      e.preventDefault();
      const step = e.ctrlKey ? 0.2 : 0.1;
      const delta = e.deltaY < 0 ? step : -step;
      onScaleChange(delta);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [onScaleChange]);

  return (
    <div className="preview-column">
      <div className="preview-title">{t('previewTitle', lang)}</div>
      <div
        className={`preview-circle ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        style={{
          backgroundColor: settings.backgroundColor || '#000000',
        }}
      >
        <div className="scale-label">Scale: {settings.scale.toFixed(2)}×</div>

        {isVideo ? (
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: settings.fit,
              objectPosition,
              transform: `scale(${settings.scale})`,
              transformOrigin: 'center center',
            }}
          />
        ) : (
          mediaUrl && (
            <img
              src={mediaUrl}
              alt="preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: settings.fit,
                objectPosition,
                transform: `scale(${settings.scale})`,
                transformOrigin: 'center center',
              }}
            />
          )
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
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            −
          </motion.button>
          <motion.button
            onClick={() => onScaleChange(0.1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            ＋
          </motion.button>
        </div>
      </div>
    </div>
  );
}

