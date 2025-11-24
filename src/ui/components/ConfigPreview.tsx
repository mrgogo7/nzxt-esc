import { useEffect, useState } from 'react';
import '../styles/ConfigPreview.css';
import { LANG_KEY, Lang, t, getInitialLang } from '../../i18n';
import { Tooltip } from 'react-tooltip';
import { DEFAULT_SETTINGS, type AppSettings } from '../../constants/defaults';
import { useConfig } from '../../hooks/useConfig';
import { useMediaUrl } from '../../hooks/useMediaUrl';
import { useMonitoring, useMonitoringMock } from '../../hooks/useMonitoring';
import { usePreviewScaling } from '../../hooks/usePreviewScaling';
import { useSettingsSync } from '../../hooks/useSettingsSync';
import { useDragHandlers } from '../../hooks/useDragHandlers';
import { useResizeHandlers } from '../../hooks/useResizeHandlers';
import { useRotationHandlers } from '../../hooks/useRotationHandlers';
import type { Overlay } from '../../types/overlay';
import { useUndoRedo } from '../../transform/hooks/useUndoRedo';
import { MoveCommand } from '../../transform/history/commands/MoveCommand';
import { ResizeCommand } from '../../transform/history/commands/ResizeCommand';
import { RotateCommand } from '../../transform/history/commands/RotateCommand';
import { updateElementInRuntime, getElementsForPreset } from '@/state/overlayRuntime';
import { hasRealMonitoring } from '../../environment';
import { lcdToPreview, getBaseAlign } from '../../utils/positioning';
import { isVideoUrl } from '../../utils/media';
import BackgroundPreview from './ConfigPreview/BackgroundPreview';
import BackgroundSettings from './ConfigPreview/BackgroundSettings';
import OverlayPreview from './ConfigPreview/OverlayPreview';
import OverlaySettingsComponent from './ConfigPreview/OverlaySettings';

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
export interface ConfigPreviewProps {
  activePresetId: string | null;
  overlayConfig: Overlay;
}

export default function ConfigPreview({ activePresetId, overlayConfig: overlayConfigProp }: ConfigPreviewProps) {
  const [lang, setLang] = useState<Lang>(getInitialLang());
  const { settings, setSettings } = useConfig();
  const { mediaUrl } = useMediaUrl();
  
  // Local state for overlay preview background controls (not persisted)
  const [showBackgroundInOverlayPreview, setShowBackgroundInOverlayPreview] = useState(false);
  const [overlayBackgroundOpacity, setOverlayBackgroundOpacity] = useState(1.0);
  
  // Use centralized environment detection to determine if real monitoring is available
  const hasRealMonitoringAPI = hasRealMonitoring();
  
  const realMetrics = useMonitoring();
  const mockMetrics = useMonitoringMock();
  
  // Use real data if API is available and metrics have been received (non-zero values)
  // Use mock data otherwise (for browser testing)
  const isRealDataReceived = !!(hasRealMonitoringAPI && (
    realMetrics.cpuTemp > 0 || 
    realMetrics.gpuTemp > 0 || 
    realMetrics.cpuLoad > 0 || 
    realMetrics.gpuLoad > 0
  ));
  
  const metrics = isRealDataReceived ? realMetrics : mockMetrics;

  // CRITICAL: offsetScale formula - must be preserved
  const { offsetScale, overlayPreviewScale } = usePreviewScaling(200);

  // Settings sync with throttling
  const { settingsRef } = useSettingsSync(settings, setSettings, mediaUrl);

  // CRITICAL: activePresetId and overlayConfig now come from props (Config.tsx)
  // This ensures single source of truth and prevents state synchronization issues
  // activePresetId is managed in Config.tsx and passed down as prop
  // overlayConfig is computed in Config.tsx using useOverlayConfig and passed down as prop
  // DEBUG: Only log in debug mode
  if (typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true) {
    console.log(`[ConfigPreview] Render - activePresetId: ${activePresetId || 'NULL'}, overlayConfig.mode: ${overlayConfigProp.mode}, elements: ${overlayConfigProp.elements?.length || 0}`);
  }

  // Undo/Redo system
  // WHY: Command pattern-based undo/redo for all transform operations.
  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y / Ctrl+Shift+Z (redo)
  const undoRedo = useUndoRedo({ maxHistorySize: 50, enableKeyboardShortcuts: true });

  /**
   * Updates element in runtime overlay Map (for undo/redo commands).
   * ARCHITECT MODE: Updates element in runtime, NOT in settings.overlay.elements.
   * 
   * This helper function is used by command objects to update element state.
   * It ensures proper state management and triggers React re-renders via setSettings({ ...settings }).
   */
  const updateElement = (elementId: string, updater: (element: any) => any) => {
    // CRITICAL: activePresetId must be valid
    if (!activePresetId) {
      console.error('[ConfigPreview] CRITICAL: Cannot update element - activePresetId is null');
      return;
    }
    
    // ARCHITECT MODE: Update element in runtime overlay Map, NOT in settings
    const success = updateElementInRuntime(activePresetId, elementId, updater);
    
    if (!success) {
      console.warn(`[ConfigPreview] Element ${elementId} not found in runtime for preset ${activePresetId}`);
      return;
    }
    
    // Force re-render by updating settings (useOverlayConfig will pick up runtime changes)
    // CRITICAL: Do NOT modify settings.overlay.elements - useOverlayConfig reads from runtime
    setSettings({ ...settingsRef.current });
  };

  // Callbacks for undo/redo
  // WHY: These callbacks are called when transform operations complete (mouseup).
  // They create command objects and record them in the action history.
  const handleMoveComplete = (elementId: string, oldPos: { x: number; y: number }, newPos: { x: number; y: number }) => {
    // ARCHITECT MODE: Get element from runtime overlay Map, NOT from settings
    if (!activePresetId) {
      console.error('[ConfigPreview] CRITICAL: Cannot handle move - activePresetId is null');
      return;
    }
    
    const runtimeElements = getElementsForPreset(activePresetId);
    const element = runtimeElements.find(el => el.id === elementId);
    if (!element) {
      console.warn(`[ConfigPreview] Element ${elementId} not found in runtime for preset ${activePresetId}`);
      return;
    }
    
    const command = new MoveCommand(
      element,
      oldPos,
      newPos,
      (updatedElement) => updateElement(elementId, () => updatedElement)
    );
    
    undoRedo.record(command);
  };

  const handleResizeComplete = (elementId: string, oldSize: number, newSize: number) => {
    // ARCHITECT MODE: Get element from runtime overlay Map, NOT from settings
    if (!activePresetId) {
      console.error('[ConfigPreview] CRITICAL: Cannot handle resize - activePresetId is null');
      return;
    }
    
    const runtimeElements = getElementsForPreset(activePresetId);
    const element = runtimeElements.find(el => el.id === elementId);
    if (!element) {
      console.warn(`[ConfigPreview] Element ${elementId} not found in runtime for preset ${activePresetId}`);
      return;
    }
    
    const command = new ResizeCommand(
      element,
      oldSize,
      newSize,
      (updatedElement) => updateElement(elementId, () => updatedElement)
    );
    
    undoRedo.record(command);
  };

  const handleRotateComplete = (elementId: string, oldAngle: number | undefined, newAngle: number | undefined) => {
    // ARCHITECT MODE: Get element from runtime overlay Map, NOT from settings
    if (!activePresetId) {
      console.error('[ConfigPreview] CRITICAL: Cannot handle rotate - activePresetId is null');
      return;
    }
    
    const runtimeElements = getElementsForPreset(activePresetId);
    const element = runtimeElements.find(el => el.id === elementId);
    if (!element) {
      console.warn(`[ConfigPreview] Element ${elementId} not found in runtime for preset ${activePresetId}`);
      return;
    }
    
    const command = new RotateCommand(
      element,
      oldAngle,
      newAngle,
      (updatedElement) => updateElement(elementId, () => updatedElement)
    );
    
    undoRedo.record(command);
  };

  // Drag handlers
  const {
    isDragging,
    handleBackgroundMouseDown,
    draggingElementId,
    selectedElementId,
    setSelectedElementId,
    handleElementMouseDown,
    activeGuides,
  } = useDragHandlers(offsetScale, settingsRef, setSettings, handleMoveComplete, activePresetId);

  // Resize handlers
  const { resizingElementId, handleResizeMouseDown } = useResizeHandlers(
    offsetScale, 
    settingsRef, 
    setSettings,
    handleResizeComplete,
    activePresetId
  );
  
  // Rotation handlers
  const { rotatingElementId, handleRotationMouseDown } = useRotationHandlers(
    offsetScale, 
    settingsRef, 
    setSettings,
    handleRotateComplete,
    activePresetId
  );

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

  // FAZ-10: Delete key handler for selected overlay element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Delete key (not Backspace)
      if (e.key === 'Delete' && selectedElementId && activePresetId) {
        // Prevent default browser behavior
        e.preventDefault();
        
        // Get element type from runtime
        const runtimeElements = getElementsForPreset(activePresetId);
        const element = runtimeElements.find(el => el.id === selectedElementId);
        
        if (element) {
          // Trigger remove modal via custom event
          // OverlaySettings will listen to this event
          window.dispatchEvent(
            new CustomEvent('deleteOverlayElement', {
              detail: { elementId: selectedElementId, elementType: element.type },
            })
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, activePresetId]);

  // Video detection
  const isVideo = isVideoUrl(mediaUrl);

  // Background positioning - CRITICAL: offsetScale must be used
  const base = getBaseAlign(settings.align);
  const adjX = lcdToPreview(settings.x, offsetScale);
  const adjY = lcdToPreview(settings.y, offsetScale);
  const objectPosition = `calc(${base.x}% + ${adjX}px) calc(${base.y}% + ${adjY}px)`;

  // Zoom handler for background
  useEffect(() => {
    const circle = document.querySelector('.preview-circle');
    if (!circle) return;

    const onWheel = (e: WheelEvent) => {
      if (!circle.contains(e.target as Node)) return;

      e.preventDefault();
      const step = e.ctrlKey ? 0.2 : 0.1;
      const delta = e.deltaY < 0 ? step : -step;

      setSettings({
        ...settings,
        scale: Math.min(
          Math.max(parseFloat((settings.scale + delta).toFixed(2)), 0.1),
          5
        ),
      });
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [settings, setSettings]);

  // Helper functions
  const adjustScale = (d: number) =>
    setSettings({
      ...settings,
      scale: Math.min(
        Math.max(parseFloat((settings.scale + d).toFixed(2)), 0.1),
        5
      ),
    });

  const resetField = (field: keyof AppSettings) => {
    const defaultValue = DEFAULT_SETTINGS[field];
    setSettings({
      ...settings,
      [field]: defaultValue,
    });
  };


  // Overlay positioning for preview
  // Element-based overlay: no global offset needed (elements have their own positions)
  const overlayAdjX = 0;
  const overlayAdjY = 0;

  return (
    <div className="config-wrapper-vertical">
      {/* Background Section */}
      <div className="section-group">
        <div className="section-content">
          {/* Background Preview */}
          <BackgroundPreview
            mediaUrl={mediaUrl}
            settings={settings}
            isVideo={isVideo}
            objectPosition={objectPosition}
            adjX={adjX}
            adjY={adjY}
            isDragging={isDragging}
            onMouseDown={handleBackgroundMouseDown}
            onScaleChange={adjustScale}
            previewTitle={t('previewTitle', lang)}
          />

          {/* Background Settings */}
          <BackgroundSettings
            settings={settings}
            setSettings={setSettings}
            lang={lang}
            t={t}
            resetField={resetField}
          />
        </div>
      </div>

      {/* Overlay Section */}
      <div className="section-group">
        <h2 className="section-title">{t('overlaySectionTitle', lang)}</h2>
        <div className="section-content">
          {/* Overlay Preview */}
          <OverlayPreview
            overlayConfig={overlayConfigProp}
            metrics={metrics}
            overlayPreviewScale={overlayPreviewScale}
            offsetScale={offsetScale}
            overlayAdjX={overlayAdjX}
            overlayAdjY={overlayAdjY}
            draggingElementId={draggingElementId}
            selectedElementId={selectedElementId}
            onElementMouseDown={handleElementMouseDown}
            activeGuides={activeGuides}
            resizingElementId={resizingElementId}
            onResizeMouseDown={handleResizeMouseDown}
            rotatingElementId={rotatingElementId}
            onRotationMouseDown={handleRotationMouseDown}
            isRealDataReceived={isRealDataReceived}
            lang={lang}
            t={t}
            settings={settings}
            mediaUrl={mediaUrl}
            isVideo={isVideo}
            objectPosition={objectPosition}
            showBackgroundInOverlayPreview={showBackgroundInOverlayPreview}
            setShowBackgroundInOverlayPreview={setShowBackgroundInOverlayPreview}
            overlayBackgroundOpacity={overlayBackgroundOpacity}
            setOverlayBackgroundOpacity={setOverlayBackgroundOpacity}
          />

          {/* Overlay Options */}
          <OverlaySettingsComponent
            overlayConfig={overlayConfigProp}
            settings={settings}
            setSettings={setSettings}
            lang={lang}
            t={t}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
            activePresetId={activePresetId}
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
