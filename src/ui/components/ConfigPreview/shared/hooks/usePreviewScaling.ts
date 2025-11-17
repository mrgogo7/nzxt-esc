import { useMemo } from 'react';
import { NZXT_DEFAULTS } from '../../../../constants/nzxt';
import { calculateOffsetScale } from '../../../../utils/positioning';

/**
 * Hook for calculating preview scaling values.
 * 
 * CRITICAL: offsetScale formula must be preserved (previewSize / lcdResolution)
 * 
 * @param previewSize - Size of the preview in pixels (default: 200)
 * @returns Object containing offsetScale and overlayPreviewScale
 */
export function usePreviewScaling(previewSize: number = 200) {
  const lcdResolution =
    typeof window !== 'undefined' && window.nzxt?.v1?.width
      ? window.nzxt.v1.width
      : NZXT_DEFAULTS.LCD_WIDTH;

  const offsetScale = useMemo(
    () => calculateOffsetScale(previewSize, lcdResolution),
    [previewSize, lcdResolution]
  );

  const overlayPreviewScale = useMemo(
    () => previewSize / lcdResolution,
    [previewSize, lcdResolution]
  );

  return {
    lcdResolution,
    offsetScale,
    overlayPreviewScale,
    previewSize,
  };
}

