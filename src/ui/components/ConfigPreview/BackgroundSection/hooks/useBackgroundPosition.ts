import { useMemo } from 'react';
import { getBaseAlign, lcdToPreview } from '../../../../utils/positioning';
import type { AppSettings } from '../../../../constants/defaults';

/**
 * Hook for calculating background position and object position CSS.
 * 
 * CRITICAL: offsetScale must be used for LCD pixel conversion
 */
export function useBackgroundPosition(
  settings: AppSettings,
  offsetScale: number
) {
  const base = useMemo(() => getBaseAlign(settings.align), [settings.align]);
  
  const adjX = useMemo(
    () => lcdToPreview(settings.x, offsetScale),
    [settings.x, offsetScale]
  );
  
  const adjY = useMemo(
    () => lcdToPreview(settings.y, offsetScale),
    [settings.y, offsetScale]
  );

  const objectPosition = useMemo(
    () => `calc(${base.x}% + ${adjX}px) calc(${base.y}% + ${adjY}px)`,
    [base.x, base.y, adjX, adjY]
  );

  return {
    base,
    adjX,
    adjY,
    objectPosition,
  };
}

