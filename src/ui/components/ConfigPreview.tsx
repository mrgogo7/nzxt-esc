import { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/ConfigPreview.css';
import { LANG_KEY, Lang, t, getInitialLang } from '../../i18n';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Move,
  MoveDiagonal,
  MoveHorizontal,
  AlignStartHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignEndVertical,
  AlignVerticalSpaceAround,
  ChevronUp,
  ChevronDown,
  Plus,
  X,
} from 'lucide-react';
import { DEFAULT_SETTINGS, type AppSettings } from '../../constants/defaults';
import { DEFAULT_OVERLAY, type OverlayMode, type OverlayMetricKey, type OverlaySettings, type CustomReading, type CustomText } from '../../types/overlay';
import { NZXT_DEFAULTS } from '../../constants/nzxt';
import { useConfig } from '../../hooks/useConfig';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import { useMonitoring, useMonitoringMock } from '../../hooks/useMonitoring';
import ColorPicker from './ColorPicker';
import BackgroundSection from './ConfigPreview/BackgroundSection';
import OverlayPreview from './ConfigPreview/OverlaySection/OverlayPreview';
import OverlaySettings from './ConfigPreview/OverlaySection/OverlaySettings';
import { usePreviewScaling } from './ConfigPreview/shared/hooks/usePreviewScaling';

/**
 * ConfigPreview component.
 * Provides interactive preview and settings panel for media configuration.
 * 
 * CRITICAL: offsetScale formula must be preserved (previewSize / lcdResolution)
 * 
 * Structure:
 * - Background Section: Main title + 2 columns (Preview | Settings)
 * - Overlay Section: Main title + 2 columns (Preview | Options)
 */
export default function ConfigPreview() {
  const [lang, setLang] = useState<Lang>(getInitialLang());
  const { settings, setSettings } = useConfig();
  const { mediaUrl } = useMediaUrl();
  // Use real monitoring data if NZXT API is available, otherwise use mock data
  // Check if NZXT API exists and has monitoring capability
  const hasNzxtApi = typeof window !== 'undefined' && 
    window.nzxt?.v1 && 
    typeof window.nzxt.v1.onMonitoringDataUpdate === 'function';
  
  const realMetrics = useMonitoring();
  const mockMetrics = useMonitoringMock();
  
  // Use mock data if API is not available or if real metrics are still at defaults (no data received)
  const isRealDataReceived = hasNzxtApi && (
    realMetrics.cpuTemp > 0 || 
    realMetrics.gpuTemp > 0 || 
    realMetrics.cpuLoad > 0 || 
    realMetrics.gpuLoad > 0
  );
  
  const metrics = isRealDataReceived ? realMetrics : mockMetrics;
  const hasLoadedRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const lastSync = useRef(0);
  const settingsRef = useRef(settings);

  // CRITICAL: offsetScale formula - must be preserved
  const { offsetScale, overlayPreviewScale } = usePreviewScaling(200);

  // Keep settings ref in sync
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Overlay config
  const overlayConfig = {
    ...DEFAULT_OVERLAY,
    ...(settings.overlay || {}),
  };

  // Language sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY && e.newValue) {
        setLang(e.newValue as Lang);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Enable realtime after first user action
  useEffect(() => {
    const enableRealtime = () => (hasInteractedRef.current = true);
    window.addEventListener('mousedown', enableRealtime, { once: true });
    window.addEventListener('wheel', enableRealtime, { once: true });
    window.addEventListener('keydown', enableRealtime, { once: true });

    return () => {
      window.removeEventListener('mousedown', enableRealtime);
      window.removeEventListener('wheel', enableRealtime);
      window.removeEventListener('keydown', enableRealtime);
    };
  }, []);

  // Mark as loaded after initial render
  useEffect(() => {
    hasLoadedRef.current = true;
  }, []);

  // Throttled save (100ms) - CRITICAL for real-time sync
  useEffect(() => {
    if (!hasLoadedRef.current || !hasInteractedRef.current) return;

    const now = Date.now();
    if (now - lastSync.current < 100) return;
    lastSync.current = now;

    // Save settings with URL for backward compatibility
    const save: AppSettings & { url?: string } = {
      ...settings,
      url: mediaUrl, // Include URL in config for backward compatibility
    };

    setSettings(save);
  }, [mediaUrl, settings, setSettings]);

  // Video detection
  const isVideo = isVideoUrl(mediaUrl);

  // Background positioning - CRITICAL: offsetScale must be used
  const base = getBaseAlign(settings.align);
  const adjX = lcdToPreview(settings.x, offsetScale);
  const adjY = lcdToPreview(settings.y, offsetScale);
  const objectPosition = `calc(${base.x}% + ${adjX}px) calc(${base.y}% + ${adjY}px)`;

  // Background drag handler - CRITICAL: LCD pixel conversion
  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStart.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  // Use useCallback to memoize handlers and prevent stale closures
  const handleBackgroundMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStart.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    // CRITICAL: Convert preview pixels to LCD pixels
    const lcdDx = previewToLcd(dx, offsetScale);
    const lcdDy = previewToLcd(dy, offsetScale);

    // Use ref to get current settings value
    const currentSettings = settingsRef.current;
    setSettings({
      ...currentSettings,
      x: currentSettings.x + lcdDx,
      y: currentSettings.y + lcdDy,
    });
  }, [offsetScale, setSettings]);

  const handleBackgroundMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);



  // Helper functions
  const adjustScale = (d: number) => {
    setSettings({
      ...settings,
      scale: Math.min(
        Math.max(parseFloat((settings.scale + d).toFixed(2)), 0.1),
        5
      ),
    });
  };

  const resetField = (field: keyof AppSettings) => {
    const defaultValue = DEFAULT_SETTINGS[field];
    setSettings({
      ...settings,
      [field]: defaultValue,
    });
  };

  const resetOverlayField = (field: keyof typeof DEFAULT_OVERLAY) => {
    const defaultValue = DEFAULT_OVERLAY[field];
    setSettings({
      ...settings,
      overlay: {
        ...overlayConfig,
        [field]: defaultValue,
      },
    });
  };



  return (
    <div className="config-wrapper-vertical">
      {/* Background Section */}
      <BackgroundSection
        mediaUrl={mediaUrl}
        settings={settings}
        setSettings={setSettings}
        lang={lang}
        offsetScale={offsetScale}
        onScaleChange={adjustScale}
      />

      {/* Overlay Section */}
      <div className="section-group">
        <h2 className="section-title">{t('overlaySectionTitle', lang)}</h2>
        <div className="section-content">
          {/* Overlay Preview */}
          <OverlayPreview
            overlayConfig={overlayConfig}
            metrics={metrics}
            settings={settings}
            setSettings={setSettings}
            lang={lang}
            offsetScale={offsetScale}
            overlayPreviewScale={overlayPreviewScale}
            isRealDataReceived={isRealDataReceived}
          />

          {/* Overlay Options */}
          <OverlaySettings
            overlayConfig={overlayConfig}
            settings={settings}
            setSettings={setSettings}
            lang={lang}
          />
        </div>
      </div>
      <Tooltip id="reset-tooltip" />
      <Tooltip id="align-center-tooltip" />
      <Tooltip id="align-top-tooltip" />
      <Tooltip id="align-bottom-tooltip" />
      <Tooltip id="align-left-tooltip" />
      <Tooltip id="align-right-tooltip" />
      <Tooltip id="fit-cover-tooltip" />
      <Tooltip id="fit-contain-tooltip" />
      <Tooltip id="fit-fill-tooltip" />
      <Tooltip id="move-up-tooltip" />
      <Tooltip id="move-down-tooltip" />
      <Tooltip id="remove-reading-tooltip" />
      <Tooltip id="move-text-up-tooltip" />
      <Tooltip id="move-text-down-tooltip" />
      <Tooltip id="remove-text-tooltip" />
      <Tooltip id="revert-to-defaults-tooltip" />
    </div>
  );
}
