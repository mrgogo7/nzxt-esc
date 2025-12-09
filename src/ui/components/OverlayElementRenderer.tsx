/**
 * OverlayElementRenderer
 * Renders individual overlay elements based on their type.
 * 
 * Simple rendering - visual accuracy is NOT critical.
 * The goal is to display elements on screen with basic features.
 * 
 * Performance optimization with memoization.
 */

import { memo } from 'react';
import type { OverlayElement, OverlayMetrics, MetricElementData, TextElementData, DividerElementData, ClockElementData, DateElementData } from '../../types/overlay';
import { getOverlayLabelAndValue } from '../../types/overlay';
import AnimateNumber from './AnimateNumber';
import ClockElementRenderer from './ClockElementRenderer';
import DateElementRenderer from './DateElementRenderer';
import styles from '../styles/UnifiedOverlay.module.css';

interface OverlayElementRendererProps {
  element: OverlayElement;
  metrics: OverlayMetrics;
  scale?: number;
}

/**
 * Render a metric element.
 */
function renderMetricElement(
  _element: OverlayElement,
  data: MetricElementData,
  metrics: OverlayMetrics,
  scale: number
) {
  const value = metrics[data.metric];
  const info = getOverlayLabelAndValue(data.metric, value);
  
  const numberSize = data.numberSize * scale;
  const unitSize = info.valueUnitType === "temp"
    ? numberSize * 0.49
    : info.valueUnitType === "percent"
    ? numberSize * 0.35
    : numberSize * 0.2;
  
  const isClock = info.valueUnitType === "clock";
  
  // Check if outline should be applied to number
  const hasNumberOutline = data.outlineColor && 
    data.outlineColor !== 'transparent' && 
    (data.outlineThickness ?? 0) > 0;
  const numberOutlineThickness = hasNumberOutline ? (data.outlineThickness ?? 0) * scale : 0;
  
  return (
    <div className={styles.elementContainer}>
      {/* Number + unit */}
      {!isClock ? (
        <div className={styles.numberContainer}>
          <AnimateNumber
            value={value}
            className={styles.number}
            style={{
              fontSize: `${numberSize}px`,
              color: data.numberColor,
              ...(hasNumberOutline && {
                WebkitTextStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                textStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                paintOrder: 'stroke fill',
              }),
            }}
          />
          
          {/* Temperature unit */}
          {info.valueUnit && info.valueUnitType === "temp" && (
            <span className={styles.unitContainer}>
              <span
                className={styles.unit}
                style={{
                  fontSize: `${unitSize}px`,
                  color: data.numberColor,
                  ...(hasNumberOutline && {
                    WebkitTextStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                    textStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                    paintOrder: 'stroke fill',
                  }),
                }}
              >
                {info.valueUnit}
              </span>
            </span>
          )}
          
          {/* Percentage unit */}
          {info.valueUnit && info.valueUnitType === "percent" && (
            <span
              className={styles.unitPercent}
              style={{
                fontSize: `${unitSize}px`,
                color: data.numberColor,
                ...(hasNumberOutline && {
                  WebkitTextStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                  textStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                  paintOrder: 'stroke fill',
                }),
              }}
            >
              {info.valueUnit}
            </span>
          )}
        </div>
      ) : (
        <>
          {/* Clock number */}
          <AnimateNumber
            value={value}
            className={styles.clockNumber}
            style={{
              fontSize: `${numberSize}px`,
              color: data.numberColor,
              ...(hasNumberOutline && {
                WebkitTextStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                textStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                paintOrder: 'stroke fill',
              }),
            }}
            as="div"
          />
          
          {/* MHz label */}
          <div
            className={styles.clockLabel}
            style={{
              fontSize: `${unitSize}px`,
              marginTop: -numberSize * 0.15,
              marginBottom: 6,
              color: data.numberColor,
              ...(hasNumberOutline && {
                WebkitTextStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                textStroke: `${numberOutlineThickness}px ${data.outlineColor}`,
                paintOrder: 'stroke fill',
              }),
            }}
          >
            MHz
          </div>
        </>
      )}
      
      {/* Label */}
      {data.showLabel !== false && data.textSize > 0 && data.textColor !== 'transparent' && (
        <div
          className={styles.label}
          style={{
            fontSize: `${data.textSize * scale}px`,
            color: data.textColor,
            ...(data.outlineColor && 
              data.outlineColor !== 'transparent' && 
              (data.outlineThickness ?? 0) > 0 && {
              WebkitTextStroke: `${(data.outlineThickness ?? 0) * scale}px ${data.outlineColor}`,
              textStroke: `${(data.outlineThickness ?? 0) * scale}px ${data.outlineColor}`,
              paintOrder: 'stroke fill',
            }),
          }}
        >
          {info.label}
        </div>
      )}
    </div>
  );
}

/**
 * Render a text element.
 */
function renderTextElement(
  _element: OverlayElement,
  data: TextElementData,
  scale: number
) {
  const hasOutline = data.outlineColor && 
    data.outlineColor !== 'transparent' && 
    (data.outlineThickness ?? 0) > 0;
  const outlineThickness = hasOutline ? (data.outlineThickness ?? 0) * scale : 0;
  
  return (
    <div
      className={styles.textElement}
      style={{
        fontSize: `${data.textSize * scale}px`,
        color: data.textColor,
        fontFamily: 'nzxt-extrabold',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...(hasOutline && {
          WebkitTextStroke: `${outlineThickness}px ${data.outlineColor}`,
          textStroke: `${outlineThickness}px ${data.outlineColor}`,
          paintOrder: 'stroke fill',
        }),
      }}
    >
      {data.text}
    </div>
  );
}

/**
 * Render a divider element.
 * 
 * Divider is a simple rectangle element.
 * - width: Rectangle width in LCD pixels (scaled to preview)
 * - height: Rectangle height in LCD pixels (scaled to preview)
 * 
 * Scale is applied to convert LCD pixels to preview pixels.
 * Minimum 1px is enforced for visibility in preview.
 */
function renderDividerElement(
  _element: OverlayElement,
  data: DividerElementData,
  scale: number
) {
  // Calculate dimensions in preview pixels
  // Direct rectangle rendering - width and height are already in LCD pixels
  const previewWidth = Math.max(1, data.width * scale);
  const previewHeight = Math.max(1, data.height * scale);
  
  // Check if outline should be applied
  const hasOutline = data.outlineColor && 
    data.outlineColor !== 'transparent' && 
    (data.outlineThickness ?? 0) > 0;
  const outlineThickness = hasOutline ? (data.outlineThickness ?? 0) * scale : 0;
  
  // Simple rectangle divider with optional outline
  return (
    <div
      className={styles.dividerElement}
      style={{
        width: `${previewWidth}px`,
        height: `${previewHeight}px`,
        backgroundColor: data.color,
        minWidth: '1px', // Ensure minimum visibility
        minHeight: '1px',
        ...(hasOutline && {
          border: `${outlineThickness}px solid ${data.outlineColor}`,
          boxSizing: 'border-box',
        }),
      }}
    />
  );
}

/**
 * OverlayElementRenderer
 * Renders a single overlay element based on its type.
 */
function OverlayElementRenderer({
  element,
  metrics,
  scale = 1,
}: OverlayElementRendererProps) {
  switch (element.type) {
    case 'metric':
      return renderMetricElement(element, element.data as MetricElementData, metrics, scale);
    
    case 'text':
      return renderTextElement(element, element.data as TextElementData, scale);
    
    case 'divider':
      return renderDividerElement(element, element.data as DividerElementData, scale);
    
    case 'clock':
      return <ClockElementRenderer element={element} data={element.data as ClockElementData} scale={scale} />;
    
    case 'date':
      return <DateElementRenderer element={element} data={element.data as DateElementData} scale={scale} />;
    
    default:
      return null;
  }
}

// Memoize to prevent unnecessary re-renders
export default memo(OverlayElementRenderer);

