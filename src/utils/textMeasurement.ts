/**
 * Text measurement utilities.
 * Uses Canvas API to measure actual rendered text width.
 * 
 * This module provides accurate text width measurement for Clock elements,
 * accounting for font-specific character widths, outline thickness, and formatting.
 */

/**
 * Maps Clock font selection to CSS font-family name.
 */
function getFontFamily(font: string | undefined): string {
  switch (font) {
    case 'digital':
      return 'digital-clock-font';
    case 'digit':
      return 'digit-font';
    case 'digital-font':
      return 'digital-font';
    case 'default':
    default:
      return 'nzxt-extrabold';
  }
}

/**
 * Formats the maximum-width clock text for a given format and mode.
 * This ensures the bounding box is always large enough for any time value.
 * 
 * @param format - Clock format: "HH:mm" | "HH:mm:ss"
 * @param mode - Clock mode: "24h" | "12h"
 * @returns Maximum-width time string
 */
function getMaxWidthClockText(format: "HH:mm" | "HH:mm:ss", mode: "24h" | "12h"): string {
  if (mode === '12h') {
    // 12h mode: "12:59:59 PM" is widest (11 chars)
    // For HH:mm: "12:59 PM" (8 chars)
    if (format === 'HH:mm:ss') {
      return '12:59:59 PM';
    } else {
      return '12:59 PM';
    }
  } else {
    // 24h mode: "23:59:59" is widest (8 chars)
    // For HH:mm: "23:59" (5 chars)
    if (format === 'HH:mm:ss') {
      return '23:59:59';
    } else {
      return '23:59';
    }
  }
}

/**
 * Singleton canvas context for text measurement.
 * Reused across all measurements for performance.
 */
let measurementCanvas: HTMLCanvasElement | null = null;
let measurementContext: CanvasRenderingContext2D | null = null;

/**
 * Gets or creates the measurement canvas context.
 * 
 * @returns Canvas 2D context for text measurement
 */
function getMeasurementContext(): CanvasRenderingContext2D | null {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') {
    return null;
  }
  
  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas');
    measurementContext = measurementCanvas.getContext('2d', { willReadFrequently: false });
    if (!measurementContext) {
      return null;
    }
  }
  return measurementContext;
}

/**
 * Cache for measured text widths.
 * Key: `${fontFamily}-${fontSize}-${format}-${mode}-${outlineThickness}`
 * Value: measured width in pixels
 */
const widthCache = new Map<string, number>();

/**
 * Measures the actual rendered width of clock text.
 * 
 * Uses Canvas API to measure text with the exact font, size, and styling.
 * Caches results based on font/size/format/mode/outline combination.
 * 
 * @param font - Font selection: "default" | "digital" | "digit" | "digital-font"
 * @param fontSize - Font size in pixels (LCD coordinates)
 * @param format - Clock format: "HH:mm" | "HH:mm:ss"
 * @param mode - Clock mode: "24h" | "12h"
 * @param outlineThickness - Outline thickness in pixels (default: 0)
 * @returns Measured text width in LCD coordinates
 */
export function measureClockTextWidth(
  font: string | undefined,
  fontSize: number,
  format: "HH:mm" | "HH:mm:ss",
  mode: "24h" | "12h",
  outlineThickness: number = 0
): number {
  // Create cache key
  const fontFamily = getFontFamily(font);
  const cacheKey = `${fontFamily}-${fontSize}-${format}-${mode}-${outlineThickness}`;
  
  // Check cache
  if (widthCache.has(cacheKey)) {
    return widthCache.get(cacheKey)!;
  }
  
  try {
    const context = getMeasurementContext();
    
    // Fallback if canvas is not available (SSR or browser issue)
    if (!context) {
      throw new Error('Canvas context not available');
    }
    
    // Set font properties to match renderer
    const fontFamilyName = getFontFamily(font);
    context.font = `${fontSize}px ${fontFamilyName}`;
    context.textBaseline = 'alphabetic';
    context.textAlign = 'left';
    
    // Get maximum-width text for this format/mode
    const maxText = getMaxWidthClockText(format, mode);
    
    // Measure text width
    const metrics = context.measureText(maxText);
    let measuredWidth = metrics.width;
    
    // Add outline thickness (outline extends on both sides)
    if (outlineThickness > 0) {
      measuredWidth += outlineThickness * 2;
    }
    
    // Ensure minimum width (same as heuristic fallback)
    const minWidth = fontSize * 2;
    const finalWidth = Math.max(measuredWidth, minWidth);
    
    // Cache result
    widthCache.set(cacheKey, finalWidth);
    
    return finalWidth;
  } catch (error) {
    // Fallback to heuristic if measurement fails
    // This handles cases where canvas API is unavailable or font hasn't loaded
    let clockLength = 5; // Minimum: "HH:mm" = 5 chars
    if (format === 'HH:mm:ss') {
      clockLength = 8; // "HH:mm:ss" = 8 chars
    }
    if (mode === '12h') {
      clockLength += 4; // Add " AM" or " PM" = 4 chars
    }
    
    // Use conservative multiplier as fallback
    const fallbackWidth = Math.max(fontSize * clockLength * 0.6, fontSize * 2);
    return fallbackWidth;
  }
}

/**
 * Clears the measurement cache.
 * Useful when fonts are loaded dynamically or when cache needs to be reset.
 */
export function clearTextMeasurementCache(): void {
  widthCache.clear();
}

