import { useCallback } from 'react';
import { DEFAULT_OVERLAY, type OverlayMode, type OverlaySettings } from '../../../../types/overlay';
import type { AppSettings } from '../../../../constants/defaults';

/**
 * Hook for managing overlay configuration and mode switching.
 * Handles mode changes and default value setting.
 */
export function useOverlayConfig(
  overlayConfig: OverlaySettings,
  settings: AppSettings,
  setSettings: (settings: Partial<AppSettings>) => void
) {
  const handleModeChange = useCallback(
    (newMode: OverlayMode) => {
      const updates: Partial<OverlaySettings> = { mode: newMode };

      // Set default values when switching to dual mode
      if (newMode === 'dual') {
        updates.numberSize = 120;
        updates.textSize = 35;
        updates.secondaryNumberSize = 120;
        updates.secondaryTextSize = 35;
        updates.dividerGap = 32;
        updates.x = 0; // Primary X Offset
        updates.y = 0; // Primary Y Offset
        updates.secondaryOffsetX = 50; // Secondary X Offset
        updates.secondaryOffsetY = 0; // Secondary Y Offset
        updates.primaryNumberColor =
          overlayConfig.primaryNumberColor || overlayConfig.numberColor || DEFAULT_OVERLAY.numberColor;
        updates.primaryTextColor =
          overlayConfig.primaryTextColor || overlayConfig.textColor || DEFAULT_OVERLAY.textColor;
        updates.secondaryNumberColor =
          overlayConfig.secondaryNumberColor || overlayConfig.numberColor || DEFAULT_OVERLAY.numberColor;
        updates.secondaryTextColor =
          overlayConfig.secondaryTextColor || overlayConfig.textColor || DEFAULT_OVERLAY.textColor;
      }

      // Set default values when switching to triple mode
      if (newMode === 'triple') {
        updates.numberSize = 155; // Primary Number Size
        updates.textSize = 35; // Primary Text Size
        updates.secondaryNumberSize = 80;
        updates.secondaryTextSize = 20;
        updates.tertiaryNumberSize = 80;
        updates.tertiaryTextSize = 20;
        updates.gapSecondaryTertiary = 20;
        updates.dividerGap = 27;
        updates.x = 18; // Primary X Offset
        updates.y = 0; // Primary Y Offset
        updates.dualReadersOffsetX = 60; // Dual Readers X Offset
        updates.dualReadersOffsetY = 0; // Dual Readers Y Offset
        updates.primaryNumberColor =
          overlayConfig.primaryNumberColor || overlayConfig.numberColor || DEFAULT_OVERLAY.numberColor;
        updates.primaryTextColor =
          overlayConfig.primaryTextColor || overlayConfig.textColor || DEFAULT_OVERLAY.textColor;
        updates.secondaryNumberColor =
          overlayConfig.secondaryNumberColor || overlayConfig.numberColor || DEFAULT_OVERLAY.numberColor;
        updates.secondaryTextColor =
          overlayConfig.secondaryTextColor || overlayConfig.textColor || DEFAULT_OVERLAY.textColor;
        updates.tertiaryNumberColor =
          overlayConfig.tertiaryNumberColor || overlayConfig.numberColor || DEFAULT_OVERLAY.numberColor;
        updates.tertiaryTextColor =
          overlayConfig.tertiaryTextColor || overlayConfig.textColor || DEFAULT_OVERLAY.textColor;
      }

      // Set default values when switching to custom mode
      if (newMode === 'custom') {
        updates.customReadings = overlayConfig.customReadings || [];
      }

      setSettings({
        ...settings,
        overlay: {
          ...overlayConfig,
          ...updates,
        },
      });
    },
    [overlayConfig, settings, setSettings]
  );

  const handleRevertToDefaults = useCallback(() => {
    const mode = overlayConfig.mode;

    if (mode === 'custom') {
      // Custom mode: only reset reading and text options, keep items
      const currentReadings = overlayConfig.customReadings || [];
      const currentTexts = overlayConfig.customTexts || [];
      const resetReadings = currentReadings.map((reading) => ({
        ...reading,
        metric: 'cpuTemp' as const,
        numberColor: DEFAULT_OVERLAY.numberColor,
        numberSize: 180,
        x: 0,
        y: 0,
      }));
      const resetTexts = currentTexts.map((text) => ({
        ...text,
        text: '',
        textColor: DEFAULT_OVERLAY.textColor,
        textSize: 45,
        x: 0,
        y: 0,
      }));
      setSettings({
        ...settings,
        overlay: {
          ...overlayConfig,
          customReadings: resetReadings,
          customTexts: resetTexts,
        },
      });
    } else {
      // Other modes: full reset
      const defaults = { ...DEFAULT_OVERLAY };

      // Set mode-specific defaults
      if (mode === 'dual') {
        defaults.numberSize = 120;
        defaults.textSize = 35;
        defaults.secondaryNumberSize = 120;
        defaults.secondaryTextSize = 35;
        defaults.dividerGap = 32;
        defaults.x = 0;
        defaults.y = 0;
        defaults.secondaryOffsetX = 50;
        defaults.secondaryOffsetY = 0;
      } else if (mode === 'triple') {
        defaults.numberSize = 155;
        defaults.textSize = 35;
        defaults.secondaryNumberSize = 80;
        defaults.secondaryTextSize = 20;
        defaults.tertiaryNumberSize = 80;
        defaults.tertiaryTextSize = 20;
        defaults.gapSecondaryTertiary = 20;
        defaults.dividerGap = 27;
        defaults.x = 18;
        defaults.y = 0;
        defaults.dualReadersOffsetX = 60;
        defaults.dualReadersOffsetY = 0;
      }

      setSettings({
        ...settings,
        overlay: {
          ...defaults,
          mode: overlayConfig.mode,
          primaryMetric: overlayConfig.primaryMetric,
          secondaryMetric: overlayConfig.secondaryMetric || defaults.secondaryMetric,
          tertiaryMetric: overlayConfig.tertiaryMetric || defaults.tertiaryMetric,
        },
      });
    }
  }, [overlayConfig, settings, setSettings]);

  return {
    handleModeChange,
    handleRevertToDefaults,
  };
}

