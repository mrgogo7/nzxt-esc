import { useState, useEffect } from 'react';
import type { OverlayElement, ClockElementData } from '../../types/overlay';
import styles from '../styles/UnifiedOverlay.module.css';
import { measureClockTextWidth } from '../../utils/textMeasurement';

interface ClockElementRendererProps {
  element: OverlayElement;
  data: ClockElementData;
  scale?: number;
}

/**
 * Clock element renderer.
 * Updates once per second and formats time according to format and mode settings.
 */
export default function ClockElementRenderer({
  element: _element,
  data,
  scale = 1,
}: ClockElementRendererProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Format time according to format and mode
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    let ampm = '';
    if (data.mode === '12h') {
      ampm = hours >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }
    
    // For 12h mode, don't pad hours with leading zero (e.g., "1:30 PM" not "01:30 PM")
    // For 24h mode, always pad hours with leading zero (e.g., "07:10" not "7:10")
    const hoursStr = data.mode === '12h' ? hours.toString() : hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    
    if (data.format === 'HH:mm:ss') {
      return `${hoursStr}:${minutesStr}:${secondsStr}${ampm}`;
    } else {
      return `${hoursStr}:${minutesStr}${ampm}`;
    }
  };

  const formattedTime = formatTime(now);
  
  // Check if outline should be applied (same as text element)
  const hasOutline = data.outlineColor && 
    data.outlineColor !== 'transparent' && 
    (data.outlineThickness ?? 0) > 0;
  const outlineThickness = hasOutline ? (data.outlineThickness ?? 0) * scale : 0;
  
  // Determine font family based on font selection
  let fontFamily = 'nzxt-extrabold'; // default
  if (data.font === 'digital') {
    fontFamily = 'digital-clock-font';
  } else if (data.font === 'digit') {
    fontFamily = 'digit-font';
  } else if (data.font === 'digital-font') {
    fontFamily = 'digital-font';
  }
  
  // Calculate fixed container width to prevent text width flicker
  // This matches the calculation in BoundingBox.ts to ensure consistency
  // Uses real text measurement for accurate width
  const fontSize = data.fontSize * scale;
  const format = data.format || 'HH:mm';
  const mode = data.mode || '24h';
  const font = data.font || 'default';
  
  // Measure at LCD scale (fontSize, not fontSize * scale), then convert to preview scale
  // This ensures container width matches bounding box width calculation
  const lcdWidth = measureClockTextWidth(font, data.fontSize, format, mode, data.outlineThickness || 0);
  const containerWidth = lcdWidth * scale;
  
  return (
    <div
      style={{
        width: `${containerWidth}px`,
        textAlign: 'left',
      }}
    >
      <div
        className={styles.textElement}
        style={{
          fontSize: `${fontSize}px`,
          color: data.color,
          fontFamily,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          ...(hasOutline && {
            WebkitTextStroke: `${outlineThickness}px ${data.outlineColor}`,
            textStroke: `${outlineThickness}px ${data.outlineColor}`,
            paintOrder: 'stroke fill',
          }),
        }}
      >
        {formattedTime}
      </div>
    </div>
  );
}

