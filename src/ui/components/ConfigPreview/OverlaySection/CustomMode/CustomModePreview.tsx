import React from 'react';
import { lcdToPreview } from '../../../../utils/positioning';
import type { CustomReading, CustomText, OverlaySettings } from '../../../../types/overlay';
import type { OverlayMetrics } from '../../../../types/overlay';
import { Lang, t } from '../../../../i18n';
import SingleInfographic from '../../../SingleInfographic';
import '../../../../styles/ConfigPreview.css';

interface CustomModePreviewProps {
  overlayConfig: OverlaySettings;
  metrics: OverlayMetrics;
  offsetScale: number;
  overlayPreviewScale: number;
  draggingReadingId: string | null;
  draggingTextId: string | null;
  selectedReadingId: string | null;
  selectedTextId: string | null;
  onReadingMouseDown: (e: React.MouseEvent, readingId: string) => void;
  onTextMouseDown: (e: React.MouseEvent, textId: string) => void;
  lang: Lang;
}

/**
 * Custom mode preview component.
 * Renders custom readings and texts with drag support.
 */
export default function CustomModePreview({
  overlayConfig,
  metrics,
  offsetScale,
  overlayPreviewScale,
  draggingReadingId,
  draggingTextId,
  selectedReadingId,
  selectedTextId,
  onReadingMouseDown,
  onTextMouseDown,
  lang,
}: CustomModePreviewProps) {
  const customReadings = overlayConfig.customReadings || [];
  const customTexts = overlayConfig.customTexts || [];

  return (
    <>
      {/* Render readings in order (reverse for z-index: higher order = higher z-index) */}
      {customReadings.length > 0 &&
        [...customReadings]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .reverse()
          .map((reading, reverseIndex) => {
            // Use labelIndex for label, not order-based index
            const readingLabelIndex = reading.labelIndex ?? reverseIndex;
            const readingX = lcdToPreview(reading.x, offsetScale);
            const readingY = lcdToPreview(reading.y, offsetScale);
            const isDraggingThis = draggingReadingId === reading.id;
            const zIndex = 10 + (reading.order ?? reverseIndex); // Higher z-index for higher order

            // Calculate hit area size based on numberSize
            const scaledNumberSize = reading.numberSize * overlayPreviewScale;
            const hitAreaWidth = scaledNumberSize * 1.5; // 1.5x multiplier for width (narrower)
            const hitAreaHeight = scaledNumberSize * 0.85; // 0.85x multiplier for height

            // Get reading label based on labelIndex (creation order, not display order)
            const readingLabels = [
              t('firstReading', lang),
              t('secondReading', lang),
              t('thirdReading', lang),
              t('fourthReading', lang),
              t('fifthReading', lang),
              t('sixthReading', lang),
              t('seventhReading', lang),
              t('eighthReading', lang),
            ];
            const readingLabel =
              readingLabels[readingLabelIndex] ||
              `${readingLabelIndex + 1}${
                readingLabelIndex === 0
                  ? 'st'
                  : readingLabelIndex === 1
                    ? 'nd'
                    : readingLabelIndex === 2
                      ? 'rd'
                      : 'th'
              } ${t('reading', lang)}`;

            const isSelected = selectedReadingId === reading.id;

            return (
              <div
                key={reading.id}
                data-reading-id={reading.id}
                onMouseDown={(e) => {
                  // Only handle if clicking on this specific reading's content area
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const clickY = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  // Check if click is within hit area
                  const distanceX = Math.abs(clickX - centerX);
                  const distanceY = Math.abs(clickY - centerY);

                  if (distanceX < hitAreaWidth / 2 && distanceY < hitAreaHeight / 2) {
                    onReadingMouseDown(e, reading.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${hitAreaWidth}px`,
                  height: `${hitAreaHeight}px`,
                  transform: `translate(calc(-50% + ${readingX}px), calc(-50% + ${readingY}px))`,
                  cursor: isDraggingThis ? 'grabbing' : isSelected ? 'move' : 'grab',
                  pointerEvents: 'auto',
                  zIndex: zIndex,
                  // Visual feedback: show outline when dragging or selected
                  outline: isDraggingThis || isSelected ? '2px dashed rgba(255, 255, 255, 0.5)' : 'none',
                  outlineOffset: isDraggingThis || isSelected ? '4px' : '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // Asymmetric padding: less space at bottom (no text), slightly less at top
                  paddingTop: `${scaledNumberSize * 0.05}px`, // Small top padding
                  paddingBottom: `${scaledNumberSize * 0.02}px`, // Minimal bottom padding
                }}
              >
                {/* Label outside bounding box - only visible when dragging or selected */}
                {(isDraggingThis || isSelected) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-18px',
                      left: '-4px',
                      fontSize: '8px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 500,
                      pointerEvents: 'none',
                      userSelect: 'none',
                      zIndex: zIndex + 1,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {readingLabel}
                  </div>
                )}
                <SingleInfographic
                  overlay={{
                    ...overlayConfig,
                    mode: 'single',
                    primaryMetric: reading.metric,
                    numberColor: reading.numberColor,
                    numberSize: reading.numberSize,
                    textColor: 'transparent',
                    textSize: 0,
                  }}
                  metrics={metrics}
                  scale={overlayPreviewScale}
                />
              </div>
            );
          })}

      {/* Render texts in order (reverse for z-index: higher order = higher z-index) */}
      {customTexts.length > 0 &&
        [...customTexts]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .reverse()
          .map((text, reverseIndex) => {
            // Use labelIndex for label, not order-based index
            const textLabelIndex = text.labelIndex ?? reverseIndex;
            const textX = lcdToPreview(text.x, offsetScale);
            const textY = lcdToPreview(text.y, offsetScale);
            const isDraggingThis = draggingTextId === text.id;
            const zIndex = 20 + (text.order ?? reverseIndex); // Higher z-index than readings

            // Calculate hit area size based on textSize
            const scaledTextSize = text.textSize * overlayPreviewScale;
            const hitAreaWidth = Math.max(scaledTextSize * text.text.length * 0.6, scaledTextSize * 2); // Based on text length
            const hitAreaHeight = scaledTextSize * 1.2;

            // Get text label based on labelIndex (creation order, not display order)
            const textLabels = [t('firstText', lang), t('secondText', lang), t('thirdText', lang), t('fourthText', lang)];
            const textLabel =
              textLabels[textLabelIndex] ||
              `${textLabelIndex + 1}${
                textLabelIndex === 0 ? 'st' : textLabelIndex === 1 ? 'nd' : textLabelIndex === 2 ? 'rd' : 'th'
              } ${t('text', lang)}`;
            const isSelected = selectedTextId === text.id;

            return (
              <div
                key={text.id}
                data-text-id={text.id}
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const clickY = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  const distanceX = Math.abs(clickX - centerX);
                  const distanceY = Math.abs(clickY - centerY);

                  if (distanceX < hitAreaWidth / 2 && distanceY < hitAreaHeight / 2) {
                    onTextMouseDown(e, text.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${hitAreaWidth}px`,
                  height: `${hitAreaHeight}px`,
                  transform: `translate(calc(-50% + ${textX}px), calc(-50% + ${textY}px))`,
                  cursor: isDraggingThis ? 'grabbing' : isSelected ? 'move' : 'grab',
                  pointerEvents: 'auto',
                  zIndex: zIndex,
                  outline: isDraggingThis || isSelected ? '2px dashed rgba(255, 255, 255, 0.5)' : 'none',
                  outlineOffset: isDraggingThis || isSelected ? '4px' : '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Label outside bounding box - only visible when dragging or selected */}
                {(isDraggingThis || isSelected) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-18px',
                      left: '-4px',
                      fontSize: '8px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 500,
                      pointerEvents: 'none',
                      userSelect: 'none',
                      zIndex: zIndex + 1,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {textLabel}
                  </div>
                )}
                <div
                  style={{
                    fontSize: `${scaledTextSize}px`,
                    color: text.textColor,
                    fontFamily: 'nzxt-extrabold',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                >
                  {text.text}
                </div>
              </div>
            );
          })}
    </>
  );
}

