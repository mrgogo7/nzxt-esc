import { useEffect, useState, useMemo } from 'react';
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
import { useLocalMedia } from '../../hooks/useLocalMedia';
import type { Overlay } from '../../types/overlay';
import { useUndoRedo } from '../../transform/hooks/useUndoRedo';
// FAZ-4-3: Legacy overlayRuntime.ts deleted - only vNext path remains
// FAZ-4-4D: Always use runtime state (no feature flag gating)
import { useOverlayStateManager } from '@/state/overlay/useOverlayStateManager';
import { getElementsInZOrder } from '@/state/overlay/selectors';
// FAZ-3B-4: Selection runtime wiring imports
import { getSingleSelectedId } from './ConfigPreview/helpers/selectionHelpers';
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

export default function ConfigPreview({ activePresetId, overlayConfig: _overlayConfigProp }: ConfigPreviewProps) {
  const [lang, setLang] = useState<Lang>(getInitialLang());
  const { settings, setSettings } = useConfig();
  const { mediaUrl } = useMediaUrl();
  const localMedia = useLocalMedia({ settings, activePresetId });
  
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
  
  // FAZ-4-4D: CRITICAL FIX - Always use runtime state, no feature flag gating
  // Runtime state is the ONLY canonical source for overlay elements
  const stateManagerHook = useOverlayStateManager(activePresetId);
  const stateManager = stateManagerHook?.stateManager ?? null;
  const runtimeState = stateManagerHook?.state ?? null;

  // FAZ-4-4D: Build effective overlay config from runtime state ONLY
  // Remove all fallback logic - runtime state is the single source of truth
  const effectiveOverlayConfig = useMemo(() => {
    if (runtimeState) {
      // Runtime state is canonical source - build overlay from it
      const elementsInZOrder = getElementsInZOrder(runtimeState.elements, runtimeState.zOrder);
      return {
        mode: elementsInZOrder.length > 0 ? 'custom' : (settings.overlay?.mode || 'none'),
        elements: elementsInZOrder,
      };
    } else {
      // No runtime state available - return empty overlay
      // This should only happen if no preset is selected
      return {
        mode: settings.overlay?.mode || 'none',
        elements: [],
      };
    }
  }, [runtimeState, settings.overlay?.mode]);

  // Undo/Redo system
  // WHY: Command pattern-based undo/redo for all transform operations.
  // Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y / Ctrl+Shift+Z (redo)
  // FAZ-4-4D: Disable old undo/redo system - always use stateManager
  useUndoRedo({ 
    maxHistorySize: 50, 
    enableKeyboardShortcuts: false // Always disabled - use stateManager instead
  });
  
  // FAZ-4-4D: Wire keyboard shortcuts to stateManager (always active, no feature flag)
  useEffect(() => {
    if (!stateManager) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        stateManager.undo();
      }
      // Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z for redo
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        stateManager.redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stateManager]);

  /**
   * Updates element in runtime overlay Map (for undo/redo commands).
   * ARCHITECT MODE: Updates element in runtime, NOT in settings.overlay.elements.
   * 
   * This helper function is used by command objects to update element state.
   * It ensures proper state management and triggers React re-renders via setSettings({ ...settings }).
   */
  // FAZ-4-3: Legacy updateElement removed - vNext handles updates via stateManager
  // Element updates are now handled directly by transform handlers via stateManager.dispatch()

  // Callbacks for undo/redo
  // WHY: These callbacks are called when transform operations complete (mouseup).
  // They create command objects and record them in the action history.
  // FAZ-3B-3: With new runtime, actions are dispatched during transform, so this only runs for old system
  // FAZ-4-4D: These callbacks are no longer needed - transactions are handled in handlers
  const handleMoveComplete = (_elementId: string, _oldPos: { x: number; y: number }, _newPos: { x: number; y: number }) => {
    // Transaction is already committed in useDragHandlers, no action needed here
  };

  const handleResizeComplete = (_elementId: string, _oldSize: number, _newSize: number) => {
    // Transaction is already committed in useResizeHandlers, no action needed here
  };

  const handleRotateComplete = (_elementId: string, _oldAngle: number | undefined, _newAngle: number | undefined) => {
    // Transaction is already committed in useRotationHandlers, no action needed here
  };

  // Drag handlers
  // FAZ-4-4D: Always pass stateManager and runtimeState (no feature flag gating)
  const {
    isDragging,
    handleBackgroundMouseDown,
    draggingElementId,
    selectedElementId: dragHandlerSelectedId,
    setSelectedElementId,
    handleElementMouseDown,
    activeGuides,
  } = useDragHandlers(
    offsetScale, 
    settingsRef, 
    setSettings, 
    handleMoveComplete, 
    activePresetId,
    stateManager,
    runtimeState
  );
  
  // FAZ-4-4D: Always derive selectedElementId from runtime state (canonical source)
  const effectiveSelectedElementId = useMemo(() => {
    if (runtimeState) {
      // Get single selected ID from runtime state
      return getSingleSelectedId(runtimeState);
    }
    // Fallback to drag handler's local state only if no runtime state
    return dragHandlerSelectedId;
  }, [runtimeState, dragHandlerSelectedId]);
  
  // Use effective selected ID throughout component
  const selectedElementId = effectiveSelectedElementId;

  // Resize handlers
  // FAZ-4-4D: Always pass stateManager and runtimeState (no feature flag gating)
  const { resizingElementId, handleResizeMouseDown } = useResizeHandlers(
    offsetScale, 
    settingsRef, 
    setSettings,
    handleResizeComplete,
    activePresetId,
    stateManager,
    runtimeState
  );
  
  // Rotation handlers
  // FAZ-4-4D: Always pass stateManager and runtimeState (no feature flag gating)
  const { rotatingElementId, handleRotationMouseDown } = useRotationHandlers(
    offsetScale, 
    settingsRef, 
    setSettings,
    handleRotateComplete,
    activePresetId,
    stateManager,
    runtimeState
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
        
        // FAZ-4-4D: Always use runtime state (no feature flag gating)
        if (runtimeState) {
          const element = runtimeState.elements.get(selectedElementId);
          
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, activePresetId]);

  // Effective media URL: prefer local blob when in local mode
  const effectiveMediaUrl =
    settings.sourceType === 'local' && localMedia.blobUrl
      ? localMedia.blobUrl
      : mediaUrl;

  // Video detection: local mode uses MIME kind, remote uses URL-based detection
  const isVideo =
    settings.sourceType === 'local'
      ? localMedia.kind === 'video'
      : isVideoUrl(mediaUrl);

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
            mediaUrl={effectiveMediaUrl}
            settings={settings}
            isVideo={isVideo}
            objectPosition={objectPosition}
            adjX={adjX}
            adjY={adjY}
            isDragging={isDragging}
            onMouseDown={handleBackgroundMouseDown}
            onScaleChange={adjustScale}
            previewTitle={t('previewTitle', lang)}
            offsetScale={offsetScale}
            isLocalLoading={settings.sourceType === 'local' && localMedia.isLoading}
            isLocalMissing={settings.sourceType === 'local' && localMedia.isMissing}
          />

          {/* Background Settings */}
          <BackgroundSettings
            settings={settings}
            setSettings={setSettings}
            lang={lang}
            t={t}
            resetField={resetField}
            mediaUrl={mediaUrl}
          />
        </div>
      </div>

      {/* Overlay Section */}
      <div className="section-group">
        <h2 className="section-title">{t('overlaySectionTitle', lang)}</h2>
        <div className="section-content">
          {/* Overlay Preview */}
          <OverlayPreview
            overlayConfig={effectiveOverlayConfig}
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
            mediaUrl={effectiveMediaUrl}
            isVideo={isVideo}
            objectPosition={objectPosition}
            showBackgroundInOverlayPreview={showBackgroundInOverlayPreview}
            setShowBackgroundInOverlayPreview={setShowBackgroundInOverlayPreview}
            overlayBackgroundOpacity={overlayBackgroundOpacity}
            setOverlayBackgroundOpacity={setOverlayBackgroundOpacity}
          />

          {/* Overlay Options */}
          <OverlaySettingsComponent
            overlayConfig={effectiveOverlayConfig}
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
