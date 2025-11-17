import { useRef, useCallback, useEffect } from 'react';
import { useDragHandler } from '../../shared/hooks/useDragHandlers';
import type { AppSettings } from '../../../../constants/defaults';

/**
 * Hook for handling background drag operations.
 * Converts preview pixels to LCD pixels and updates settings.
 */
export function useBackgroundDrag(
  offsetScale: number,
  settings: AppSettings,
  setSettings: (settings: Partial<AppSettings>) => void
) {
  const settingsRef = useRef(settings);
  
  // Keep settings ref in sync
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const handleDrag = useCallback(
    (lcdDx: number, lcdDy: number) => {
      const currentSettings = settingsRef.current;
      setSettings({
        ...currentSettings,
        x: currentSettings.x + lcdDx,
        y: currentSettings.y + lcdDy,
      });
    },
    [setSettings]
  );

  const { isDragging, handleMouseDown } = useDragHandler(offsetScale, handleDrag);

  return {
    isDragging,
    handleMouseDown,
  };
}

