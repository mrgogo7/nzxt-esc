import { useEffect } from 'react';
import { useConfig } from '../../hooks/useConfig';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import { useMonitoring } from '../../hooks/useMonitoring';
import { useOverlayConfig } from '../../hooks/useOverlayConfig';
import { getActivePresetId } from '../../preset/storage';
import { getLCDDimensions } from '../../environment';
import { getElementsForPreset } from '../../state/overlayRuntime';
import MediaRenderer from './MediaRenderer';
import UnifiedOverlayRenderer from './UnifiedOverlayRenderer';
import styles from '../styles/KrakenOverlay.module.css';

/**
 * KrakenOverlay component.
 * LCD render surface for NZXT Kraken Elite.
 * 
 * FAZ-11.1: Pure viewer component - reads directly from runtime and settings.
 * - Uses UnifiedOverlayRenderer for all element types
 * - Reads media URL + settings from hooks (real-time updates)
 * - Subscribes to runtime overlay changes via useOverlayConfig
 * - Mirrors the LCD transform logic (scale, offset, align, fit)
 * - Registers window.nzxt.v1.onMonitoringDataUpdate for real monitoring data
 * - Does NOT require any props (safe for ?kraken=1 entry)
 * 
 * CRITICAL: This component does NOT load presets or modify settings.
 * It is a READ-ONLY viewer that reflects runtime state in real-time.
 */
export default function KrakenOverlay() {
  const { settings } = useConfig();
  const { mediaUrl } = useMediaUrl();
  const metrics = useMonitoring();
  const activePresetId = getActivePresetId();
  const overlayConfig = useOverlayConfig(settings, activePresetId);

  // FAZ-11.3 + FAZ-11.4: DIAGNOSTIC DEBUG LOGGING (guarded)
  useEffect(() => {
    const isDebug = typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true;
    if (isDebug) {
      console.log(`[KrakenOverlay] activePresetId=${activePresetId}`);
      console.log(`[KrakenOverlay] overlayConfig.mode=${overlayConfig.mode} elements=${overlayConfig.elements?.length ?? 0}`);
      console.log(`[KrakenOverlay] settings.overlayMode=${settings?.overlay?.mode}`);
      const runtimeElements = getElementsForPreset(activePresetId);
      console.log(`[KrakenOverlay] RUNTIME elements for preset=${activePresetId}`, runtimeElements);
      console.log(`[KrakenOverlay] Render condition check: mode !== 'none' = ${overlayConfig.mode !== 'none'}, elements.length > 0 = ${(overlayConfig.elements?.length ?? 0) > 0}`);
      console.log(`[KrakenOverlay] Will render overlay: ${overlayConfig.mode !== 'none' || (overlayConfig.elements?.length ?? 0) > 0}`);
    }
  }, [activePresetId, overlayConfig.mode, overlayConfig.elements?.length, settings?.overlay?.mode]);

  // Get LCD resolution using centralized environment detection
  const { width: lcdResolution } = getLCDDimensions();
  const lcdSize = lcdResolution;

  // Get background color from settings, default to #000000
  const backgroundColor = settings.backgroundColor || '#000000';

  return (
    <div
      className={styles.krakenOverlay}
      style={{
        width: `${lcdSize}px`,
        height: `${lcdSize}px`,
        background: backgroundColor,
      }}
    >
      <MediaRenderer url={mediaUrl} settings={settings} />
      {/* FAZ-11.2 + FAZ-11.3: Always render overlay if elements exist, regardless of mode */}
      {/* In krakenMode, useOverlayConfig forces mode to "custom" when elements exist */}
      {/* CRITICAL: Check both mode AND elements.length to ensure overlay renders */}
      {(() => {
        const shouldRender = overlayConfig.mode !== 'none' || (overlayConfig.elements?.length ?? 0) > 0;
        const isDebug = typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true;
        if (isDebug) {
          console.log(`[KrakenOverlay] Render decision - shouldRender=${shouldRender}, mode=${overlayConfig.mode}, elements=${overlayConfig.elements?.length ?? 0}`);
        }
        
        if (!shouldRender) {
          return null;
        }
        
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            <UnifiedOverlayRenderer
              overlay={overlayConfig}
              metrics={metrics}
            />
          </div>
        );
      })()}
    </div>
  );
}
