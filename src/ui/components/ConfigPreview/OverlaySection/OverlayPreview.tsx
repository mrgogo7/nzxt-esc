import React from 'react';
import { lcdToPreview } from '../../../../utils/positioning';
import type { OverlaySettings } from '../../../../types/overlay';
import type { OverlayMetrics } from '../../../../types/overlay';
import { Lang, t } from '../../../../i18n';
import SingleInfographic from '../../SingleInfographic';
import DualInfographic from '../../DualInfographic';
import TripleInfographic from '../../TripleInfographic';
import CustomModePreview from './CustomMode/CustomModePreview';
import { useOverlayDrag } from './hooks/useOverlayDrag';
import { useCustomItemDrag } from './hooks/useCustomItemDrag';
import '../../../../styles/ConfigPreview.css';
import type { AppSettings } from '../../../../constants/defaults';

interface OverlayPreviewProps {
  overlayConfig: OverlaySettings;
  metrics: OverlayMetrics;
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
  lang: Lang;
  offsetScale: number;
  overlayPreviewScale: number;
  isRealDataReceived: boolean;
}

/**
 * Overlay preview component.
 * Renders overlay preview for all modes (single, dual, triple, custom).
 */
export default function OverlayPreview({
  overlayConfig,
  metrics,
  settings,
  setSettings,
  lang,
  offsetScale,
  overlayPreviewScale,
  isRealDataReceived,
}: OverlayPreviewProps) {
  // Overlay drag handlers
  const { isDraggingOverlay, isDraggingSecondaryTertiary, handleOverlayMouseDown } = useOverlayDrag(
    offsetScale,
    overlayConfig,
    settings,
    setSettings
  );

  // Custom item drag handlers
  const {
    draggingReadingId,
    draggingTextId,
    selectedReadingId,
    selectedTextId,
    handleCustomReadingMouseDown,
    handleCustomTextMouseDown,
  } = useCustomItemDrag(offsetScale, overlayConfig, settings, setSettings);

  // Overlay positioning for preview (only for single mode)
  // Dual and triple modes handle offsets internally
  const overlayAdjX =
    overlayConfig.mode === 'triple' || overlayConfig.mode === 'dual' || overlayConfig.mode === 'custom'
      ? 0
      : lcdToPreview(overlayConfig.x || 0, offsetScale);
  const overlayAdjY =
    overlayConfig.mode === 'triple' || overlayConfig.mode === 'dual' || overlayConfig.mode === 'custom'
      ? 0
      : lcdToPreview(overlayConfig.y || 0, offsetScale);

  if (overlayConfig.mode === 'none') {
    return (
      <div className="preview-column">
        <div className="preview-title" style={{ opacity: 0.5 }}>
          {t('overlayPreviewTitle', lang)} - {t('overlayMode', lang)}: None
        </div>
      </div>
    );
  }

  return (
    <div className="preview-column">
      <div className="preview-title">{t('overlayPreviewTitle', lang)}</div>
      <div
        className={`preview-circle overlay-preview ${
          isDraggingOverlay || isDraggingSecondaryTertiary || draggingReadingId || draggingTextId
            ? 'dragging'
            : ''
        }`}
        onMouseDown={handleOverlayMouseDown}
        style={{ position: 'relative', width: '200px', height: '200px' }}
      >
        {/* Single, Dual, Triple modes */}
        {(overlayConfig.mode === 'single' ||
          overlayConfig.mode === 'dual' ||
          overlayConfig.mode === 'triple') && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translate(${overlayAdjX}px, ${overlayAdjY}px)`,
              pointerEvents: 'none',
            }}
          >
            {overlayConfig.mode === 'single' && (
              <SingleInfographic overlay={overlayConfig} metrics={metrics} scale={overlayPreviewScale} />
            )}
            {overlayConfig.mode === 'dual' && (
              <DualInfographic overlay={overlayConfig} metrics={metrics} scale={overlayPreviewScale} />
            )}
            {overlayConfig.mode === 'triple' && (
              <TripleInfographic overlay={overlayConfig} metrics={metrics} scale={overlayPreviewScale} />
            )}
          </div>
        )}

        {/* Custom mode */}
        {overlayConfig.mode === 'custom' && (
          <CustomModePreview
            overlayConfig={overlayConfig}
            metrics={metrics}
            offsetScale={offsetScale}
            overlayPreviewScale={overlayPreviewScale}
            draggingReadingId={draggingReadingId}
            draggingTextId={draggingTextId}
            selectedReadingId={selectedReadingId}
            selectedTextId={selectedTextId}
            onReadingMouseDown={handleCustomReadingMouseDown}
            onTextMouseDown={handleCustomTextMouseDown}
            lang={lang}
          />
        )}
      </div>

      {/* Mock data warning */}
      {!isRealDataReceived && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: 'rgba(255, 193, 7, 0.15)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '8px',
            color: '#ffc107',
            fontSize: '11px',
            lineHeight: '1.4',
            textAlign: 'center',
            maxWidth: '200px',
          }}
        >
          {t('mockDataWarning', lang)}
        </div>
      )}
    </div>
  );
}

