import type { MouseEvent } from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Plus, BarChart3, Type, Minus, Layout, Trash2, Clock, Calendar } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import type { AppSettings } from '../../../constants/defaults';
import type { Overlay, OverlayMetricKey, OverlayElement, MetricElementData, TextElementData, DividerElementData, ClockElementData, DateElementData } from '../../../types/overlay';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import { createOverlayElementForAdd, defaultClockElement, defaultDateElement, MAX_OVERLAY_ELEMENTS, canAddElement, getTotalElementCount, resolveElementIdConflict } from '../../../utils/overlaySettingsHelpers';
import ResetConfirmationModal from './ResetConfirmationModal';
import RemoveConfirmationModal from './RemoveConfirmationModal';
import ImportOverlayModal from './ImportOverlayModal';
import OverlayPresetPickerModal from '../modals/OverlayPresetPickerModal';
import OverlayExportNameModal from './OverlayExportNameModal';
import { MetricElementInspector } from './ElementCards/MetricElementInspector';
import { TextElementInspector } from './ElementCards/TextElementInspector';
import { DividerElementInspector } from './ElementCards/DividerElementInspector';
import { ClockElementInspector } from './ElementCards/ClockElementInspector';
import { DateElementInspector } from './ElementCards/DateElementInspector';
import { exportOverlayPreset, importOverlayPreset } from '../../../overlayPreset';
import { getTemplateElements } from '../../../overlayPreset/templates';
import { normalizeZIndexForAppend } from '../../../overlayPreset/utils';
import { useOverlayStateManager } from '@/state/overlay/useOverlayStateManager';
import { createAddElementAction, createRemoveElementAction, createUpdateElementAction, createUpdateElementDataAction, createBatchAction, createZOrderAction, createSelectAction, createMoveElementZUpAction, createMoveElementZDownAction } from '@/state/overlay/actions';
import { getElement as getElementFromStore } from '@/state/overlay/elementStore';
import { bringToFront, sendToBack } from '@/state/overlay/zOrder';
import { getElementsInZOrder } from '@/state/overlay/selectors';
import { IS_DEV } from '@/utils/env';

interface OverlaySettingsProps {
  overlayConfig: Overlay;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  lang: Lang;
  selectedElementId: string | null;
  setSelectedElementId: (elementId: string | null) => void;
  activePresetId: string | null; // Active preset ID for per-preset runtime overlay state
}

/**
 * Overlay settings component.
 * Provides controls for overlay mode and element-based settings.
 * 
 * Modernized UI with improved grouping, spacing, and i18n support.
 * - Uses unified element array (Overlay.elements)
 * - Element-based add/remove/reorder operations
 * - Element-specific settings (metric, text, divider)
 * - Full i18n support (EN/TR)
 * - Reset button restores DEFAULT_OVERLAY
 */
export default function OverlaySettingsComponent({
  overlayConfig,
  settings,
  setSettings,
  lang,
  selectedElementId,
  setSelectedElementId,
  activePresetId,
}: OverlaySettingsProps) {
  const t = useI18n();
  const stateManagerHook = activePresetId
    ? useOverlayStateManager(activePresetId)
    : null;
  const stateManager = stateManagerHook?.stateManager ?? null;
  const runtimeState = stateManagerHook?.state ?? null;
  
  const safeElements = useMemo(() => {
    if (runtimeState) {
      // Runtime: Get elements from runtime state (canonical source)
      return getElementsInZOrder(runtimeState.elements, runtimeState.zOrder);
    } else {
      return Array.isArray(overlayConfig.elements) ? overlayConfig.elements : [];
    }
  }, [runtimeState, overlayConfig.elements]);
  
  const effectiveMode = useMemo(() => {
    if (runtimeState) {
      // Runtime: Mode is 'custom' if elements exist, otherwise use settings
      return safeElements.length > 0 ? 'custom' : (settings.overlay?.mode || 'none');
    } else {
      // Fallback: Use overlayConfig mode
      return overlayConfig.mode || 'none';
    }
  }, [runtimeState, safeElements.length, settings.overlay?.mode]);
  
  const metricElements = safeElements.filter(el => el?.type === 'metric');
  const textElements = safeElements.filter(el => el?.type === 'text');
  const dividerElements = safeElements.filter(el => el?.type === 'divider');
  const clockElements = safeElements.filter(el => el?.type === 'clock');
  const dateElements = safeElements.filter(el => el?.type === 'date');
  const metricCount = metricElements.length;
  const textCount = textElements.length;
  const dividerCount = dividerElements.length;
  const clockCount = clockElements.length;
  const dateCount = dateElements.length;
  
  // GLOBAL HARD LIMIT: Get total count from runtime overlay only (ARCHITECT MODE)
  // CRITICAL: Use activePresetId to get runtime count for the specific preset
  const totalCount = getTotalElementCount(activePresetId);
  
  const updateElement = useCallback((elementId: string, updater: (element: OverlayElement) => OverlayElement) => {
    if (!activePresetId) return;
    
    if (stateManager && runtimeState) {
      // New system: Get current element, apply updater, create update action
      const currentElement = getElementFromStore(runtimeState.elements, elementId);
      if (!currentElement) return;
      
      const newElement = updater(currentElement);
      
      const onlyDataChanged = 
        currentElement.id === newElement.id &&
        currentElement.type === newElement.type &&
        currentElement.x === newElement.x &&
        currentElement.y === newElement.y &&
        currentElement.angle === newElement.angle &&
        currentElement.zIndex === newElement.zIndex &&
        JSON.stringify(currentElement.data) !== JSON.stringify(newElement.data);
      
      if (onlyDataChanged) {
        // Use efficient updateElementData action for data-only changes
        const action = createUpdateElementDataAction(
          elementId,
          currentElement.data,
          newElement.data,
          runtimeState
        );
        stateManager.dispatch(action);
      } else {
        // Use full updateElement action for position/transform changes
        const action = createUpdateElementAction(elementId, currentElement, newElement);
        stateManager.dispatch(action);
      }
    }
  }, [activePresetId, stateManager, runtimeState]);
  
  const handleZOrderChange = useCallback((elementId: string, direction: 'forward' | 'backward' | 'front' | 'back') => {
    if (!activePresetId) {
      return;
    }
    
    if (stateManager && runtimeState) {
      let action;
      
      switch (direction) {
        case 'forward':
          // Move Up button calls 'forward' = should move element up (toward front)
          // 'forward' in zOrder means move towards end (front/top position)
          action = createMoveElementZUpAction(elementId, runtimeState);
          break;
        case 'backward':
          // Move Down button calls 'backward' = should move element down (toward back)
          // 'backward' in zOrder means move towards beginning (back/bottom position)
          action = createMoveElementZDownAction(elementId, runtimeState);
          break;
        case 'front':
          // Legacy: Use zOrder array manipulation for bring to front
          const currentZOrder = runtimeState.zOrder;
          const newZOrder = bringToFront(currentZOrder, elementId);
          if (newZOrder !== currentZOrder && JSON.stringify(newZOrder) !== JSON.stringify(currentZOrder)) {
            action = createZOrderAction(currentZOrder, newZOrder);
          } else {
            return; // No change
          }
          break;
        case 'back':
          // Legacy: Use zOrder array manipulation for send to back
          const currentZOrderBack = runtimeState.zOrder;
          const newZOrderBack = sendToBack(currentZOrderBack, elementId);
          if (newZOrderBack !== currentZOrderBack && JSON.stringify(newZOrderBack) !== JSON.stringify(currentZOrderBack)) {
            action = createZOrderAction(currentZOrderBack, newZOrderBack);
          } else {
            return; // No change
          }
          break;
        default:
          return;
      }
      
      if (action) {
        stateManager.dispatch(action);
      }
    }
  }, [activePresetId, stateManager, runtimeState]);
  
  const handleSelectionChange = useCallback((elementId: string | null) => {
    // Always call parent setter for UI backward compatibility
    setSelectedElementId(elementId);
    
    // Also update runtime state
    if (stateManager && runtimeState) {
      const oldSelectedIds = Array.from(runtimeState.selection.selectedIds);
      const oldLastSelectedId = runtimeState.selection.lastSelectedId;
      
      let newSelectedIds: string[];
      let newLastSelectedId: string | null;
      
      if (elementId === null) {
        // Deselect all
        newSelectedIds = [];
        newLastSelectedId = null;
      } else {
        // Single select (UI currently only supports single selection)
        newSelectedIds = [elementId];
        newLastSelectedId = elementId;
      }
      
      // Only dispatch if selection actually changed
      if (JSON.stringify(oldSelectedIds.sort()) !== JSON.stringify(newSelectedIds.sort()) ||
          oldLastSelectedId !== newLastSelectedId) {
        const action = createSelectAction(
          oldSelectedIds,
          newSelectedIds,
          oldLastSelectedId,
          newLastSelectedId
        );
        stateManager.dispatch(action);
      }
    }
  }, [stateManager, runtimeState, setSelectedElementId]);
  
  const effectiveSelectedElementId = useMemo(() => {
    if (runtimeState) {
      // Get single selected ID from runtime state (UI only supports single selection for now)
      if (runtimeState.selection.selectedIds.size === 1) {
        return Array.from(runtimeState.selection.selectedIds)[0];
      } else if (runtimeState.selection.selectedIds.size === 0) {
        return null;
      } else {
        // Multi-select case: use lastSelectedId for UI (single-selection UI)
        return runtimeState.selection.lastSelectedId;
      }
    }
    // Fallback to prop (when runtime not active)
    return selectedElementId;
  }, [runtimeState, selectedElementId]);

  // State for Floating Add Menu
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right?: number; left?: number } | null>(null);
  const floatingMenuRef = useRef<HTMLDivElement>(null);
  const floatingButtonRef = useRef<HTMLButtonElement>(null);

  // State for Remove Confirmation Modal
  const [removeModalState, setRemoveModalState] = useState<{ isOpen: boolean; elementId: string | null; elementType: 'metric' | 'text' | 'divider' | 'clock' | 'date' | null }>({
    isOpen: false,
    elementId: null,
    elementType: null,
  });

  // State for Import Overlay Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedElements, setImportedElements] = useState<OverlayElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Overlay Preset Picker Modal
  const [isOverlayPresetModalOpen, setIsOverlayPresetModalOpen] = useState(false);

  // State for Overlay Export Name Modal
  const [isOverlayExportModalOpen, setIsOverlayExportModalOpen] = useState(false);

  // State for Clear All Confirmation Modal
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // State for collapsible elements (default: all open)
  const [collapsedElements, setCollapsedElements] = useState<Set<string>>(new Set());
  
  const toggleCollapse = (elementId: string) => {
    setCollapsedElements(prev => {
      const next = new Set(prev);
      if (next.has(elementId)) {
        next.delete(elementId);
      } else {
        next.add(elementId);
      }
      return next;
    });
  };
  
  useEffect(() => {
    const handleDeleteElement = (e: Event) => {
      const customEvent = e as CustomEvent<{ elementId: string; elementType: 'metric' | 'text' | 'divider' | 'clock' | 'date' }>;
      const { elementId, elementType } = customEvent.detail;
      
      // Open remove confirmation modal
      setRemoveModalState({
        isOpen: true,
        elementId,
        elementType,
      });
    };

    window.addEventListener('deleteOverlayElement', handleDeleteElement as EventListener);
    return () => window.removeEventListener('deleteOverlayElement', handleDeleteElement as EventListener);
  }, []);

  // Calculate menu position based on button position
  useEffect(() => {
    if (isFloatingMenuOpen && floatingButtonRef.current) {
      // Use requestAnimationFrame to ensure menu is rendered before calculating position
      requestAnimationFrame(() => {
        if (!floatingButtonRef.current) return;
        
        const buttonRect = floatingButtonRef.current.getBoundingClientRect();
        const panelRect = floatingButtonRef.current.closest('.panel')?.getBoundingClientRect();
        if (panelRect) {
          // Menu dimensions
          const menuWidth = 180;
          // Dynamically calculate menu height from ref, fallback to 170px
          const menuHeight = floatingMenuRef.current?.offsetHeight ?? 170;
          const gap = 4;

          // Check if button is in empty state (centered)
          const emptyStateContainer = floatingButtonRef.current.closest('div[style*="textAlign: center"]');
          
          if (emptyStateContainer) {
            // Center the menu
            const buttonCenterX = buttonRect.left - panelRect.left + (buttonRect.width / 2);
            const relativeLeft = buttonCenterX - (menuWidth / 2);
            
            // Check if menu would overflow viewport bottom
            const menuBottom = buttonRect.bottom + gap + menuHeight;
            const wouldOverflow = menuBottom > window.innerHeight;
            
            if (wouldOverflow) {
              // Open menu upward
              const relativeTop = buttonRect.top - panelRect.top - menuHeight - gap;
              setMenuPosition({ top: relativeTop, left: relativeLeft });
            } else {
              // Open menu downward
              const relativeTop = buttonRect.bottom - panelRect.top + gap;
              setMenuPosition({ top: relativeTop, left: relativeLeft });
            }
          } else {
            // Align menu to the right of the button
            const relativeRight = panelRect.right - buttonRect.right;
            
            // Check if menu would overflow viewport bottom
            const menuBottom = buttonRect.bottom + gap + menuHeight;
            const wouldOverflow = menuBottom > window.innerHeight;
            
            if (wouldOverflow) {
              // Open menu upward
              const relativeTop = buttonRect.top - panelRect.top - menuHeight - gap;
              setMenuPosition({ top: relativeTop, right: relativeRight });
            } else {
              // Open menu downward
              const relativeTop = buttonRect.bottom - panelRect.top + gap;
              setMenuPosition({ top: relativeTop, right: relativeRight });
            }
          }
        }
      });
    }
  }, [isFloatingMenuOpen]);

  // Handle outside click and ESC key to close menu
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
      if (
        floatingMenuRef.current &&
        floatingButtonRef.current &&
        !floatingMenuRef.current.contains(event.target as Node) &&
        !floatingButtonRef.current.contains(event.target as Node)
      ) {
        setIsFloatingMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFloatingMenuOpen) {
        setIsFloatingMenuOpen(false);
      }
    };

    if (isFloatingMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside as any);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFloatingMenuOpen]);

  // Helper: Get metric option labels with i18n
  const getMetricOptions = (): Array<{ value: OverlayMetricKey; label: string }> => [
    { value: 'cpuTemp' as OverlayMetricKey, label: t('metricCpuTemp') },
    { value: 'cpuLoad' as OverlayMetricKey, label: t('metricCpuLoad') },
    { value: 'cpuClock' as OverlayMetricKey, label: t('metricCpuClock') },
    { value: 'liquidTemp' as OverlayMetricKey, label: t('metricLiquidTemp') },
    { value: 'gpuTemp' as OverlayMetricKey, label: t('metricGpuTemp') },
    { value: 'gpuLoad' as OverlayMetricKey, label: t('metricGpuLoad') },
    { value: 'gpuClock' as OverlayMetricKey, label: t('metricGpuClock') },
  ];

  // Handler: Open overlay export modal
  const handleExportOverlay = () => {
    // CRITICAL: activePresetId must be valid
    if (!activePresetId) {
      alert(t('alertSelectPresetFirst'));
      return;
    }
    
    if (stateManager && runtimeState) {
      const safeElements = Array.from(runtimeState.elements.values());
      
      if (safeElements.length === 0) {
        alert(t('alertNoElementsToExport'));
        return;
      }
      
      // Open export name modal
      setIsOverlayExportModalOpen(true);
    } else {
      // vNext not available
      alert(t('alertNoElementsToExport'));
    }
  };

  // Handler: Confirm overlay export with name
  const handleExportOverlayConfirm = async (presetName: string) => {
    if (!activePresetId) {
      return;
    }
    
    try {
      if (stateManager && runtimeState) {
        const safeElements = Array.from(runtimeState.elements.values());
        
        if (safeElements.length === 0) {
          alert(t('alertNoElementsToExport'));
          return;
        }
        
        await exportOverlayPreset(safeElements, presetName);
      } else {
        alert(t('alertNoElementsToExport'));
      }
    } catch (error) {
      const errorMessage = t('overlayExportError');
      alert(errorMessage);
    }
  };

  // Handler: File input change - triggers import and opens modal if valid
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      // Reset input if no file selected
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      const result = await importOverlayPreset(file);
      
      if (!result.success || !result.elements || result.elements.length === 0) {
        // Reset input on import failure
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Show error notification
        const errorMessage = t('overlayImportError')
          .replace('{error}', result.error || t('unknownError'));
        alert(errorMessage);
        return;
      }

      // Store imported elements and open modal
      setImportedElements(result.elements);
      setIsImportModalOpen(true);
    } catch (error) {
      // Reset input on any error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Show error notification
        const errorMessage = t('overlayImportError')
        .replace('{error}', error instanceof Error ? error.message : t('unknownError'));
      alert(errorMessage);
    }
  };

  // Handler: Apply imported elements (Replace or Append)
  // IMPORTANT: This writes to runtime state, NOT to settings.overlay.elements
  // GLOBAL HARD LIMIT: Enforces total (preset manual + runtime imported) <= 20
  const handleImportOverlay = async (elements: OverlayElement[], mode: 'replace' | 'append') => {
    // CRITICAL: activePresetId must be valid for per-preset runtime state
    if (!activePresetId) {
      alert(t('alertNoActivePreset'));
      return;
    }
    
    if (elements.length === 0) {
      return;
    }

    // DEFENSIVE: Ensure elements is always an array
    const safeElements = Array.isArray(elements) ? elements : [];
    if (safeElements.length === 0) {
      return;
    }

    if (mode === 'replace') {
      if (stateManager && runtimeState) {
        // Replace all elements using vNext
        const currentElementIds = Array.from(runtimeState.elements.keys());
        // Remove all existing elements
        if (currentElementIds.length > 0) {
          const removeActions = currentElementIds.map(id => createRemoveElementAction(id, runtimeState));
          const removeBatch = createBatchAction(removeActions);
          stateManager.dispatch(removeBatch);
        }
        // Add new elements
        const addActions = safeElements.map(element => createAddElementAction(element));
        const addBatch = createBatchAction(addActions);
        stateManager.dispatch(addBatch);
      } else {
      }
    } else {
      // Append: runtimeOverlay[activePresetId] = [...current, ...imported]
      // Normalize zIndex before appending
      const normalizedElements = normalizeZIndexForAppend([], safeElements);
      
      if (stateManager && runtimeState) {
        // Check limit using vNext state
        const currentCount = runtimeState.elements.size;
        if (currentCount + normalizedElements.length > MAX_OVERLAY_ELEMENTS) {
          const message = t('overlayMaxElementsWarning')
            .replace('{max}', String(MAX_OVERLAY_ELEMENTS))
            .replace('{count}', String(normalizedElements.length));
          const appendError = t('alertCannotAppendOverlayElements')
            .replace('{currentCount}', String(currentCount))
            .replace('{max}', String(MAX_OVERLAY_ELEMENTS))
            .replace('{count}', String(normalizedElements.length));
          alert(message + '\n\n' + appendError);
          return;
        }
        
        // Get existing element IDs from current state
        const existingElementIds = new Set(runtimeState.elements.keys());
        
        // Resolve conflicts: clone elements with new IDs if ID already exists
        const resolvedElements = normalizedElements.map(element => 
          resolveElementIdConflict(element, existingElementIds)
        );
        
        // Dispatch add actions for each resolved element
        resolvedElements.forEach(element => {
          const action = createAddElementAction(element);
          stateManager.dispatch(action);
        });
      } else {
      }
    }

    // Reset state
    setImportedElements([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handler: Open Clear All confirmation modal
  const handleClearAllClick = () => {
    if (!activePresetId) {
      alert(t('alertSelectPresetFirst'));
      return;
    }
    setIsClearAllModalOpen(true);
  };

  // Handler: Confirm Clear All - clears all runtime elements
  const handleClearAllConfirm = () => {
    if (!activePresetId) {
      return;
    }
    
    if (stateManager && runtimeState) {
      // Create batch remove actions for all elements
      const elementIds = Array.from(runtimeState.elements.keys());
      if (elementIds.length > 0) {
        const removeActions = elementIds.map(id => createRemoveElementAction(id, runtimeState));
        const batchAction = createBatchAction(removeActions);
        stateManager.dispatch(batchAction);
      }
    } else {
    }
  };

  // Handler: Overlay preset template selection
  const handleOverlayPresetSelect = (templateId: string) => {
    // CRITICAL: activePresetId must be valid for per-preset runtime state
    if (!activePresetId) {
      alert(t('alertNoActivePreset'));
      return;
    }
    
    try {
      // Get template elements with assigned IDs
      const templateElements = getTemplateElements(templateId);
      
      if (templateElements.length === 0) {
        alert(t('alertTemplateEmpty').replace('{templateId}', templateId));
        return;
      }
      
      // Store in importedElements state
      setImportedElements(templateElements);
      
      setIsImportModalOpen(true);
    } catch (error) {
      alert(t('overlayImportError').replace('{error}', error instanceof Error ? error.message : t('unknownError')));
    }
  };

  return (
    <div className="settings-column overlay-options-area">
      <div className="panel" style={{ position: 'relative' }}>
        {/* Header with Mode Switch */}
        <div className="panel-header">
          <h3>{effectiveMode === 'custom' ? t('overlaySettingsTitle') : t('overlayTitle')}</h3>
          <div className="overlay-toggle-compact">
            <span>{effectiveMode === 'custom' ? t('overlayStatusActive') : t('overlayStatusOff')}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={effectiveMode === 'custom'}
                aria-label={effectiveMode === 'custom' ? t('overlayStatusActive') : t('overlayStatusOff')}
                onChange={(e) => {
                  const newMode = e.target.checked ? 'custom' : 'none';
                  
                  // ARCHITECT MODE: ON/OFF toggle = ONLY change mode
                  // - Runtime overlay elements are NEVER deleted (preserved in runtimeOverlay Map)
                  // - When OFF (mode='none'): overlay is hidden but elements remain in runtime
                  // - When ON (mode='custom'): overlay is shown with same elements from runtime
                  // - settings.overlay.elements is IGNORED (elements are in runtime, not in settings)
                  
                  // CRITICAL: Only change mode, do NOT touch elements
                  // Elements are in runtime overlay Map, not in settings
                  setSettings({
                    ...settings,
                    overlay: {
                      ...settings.overlay || { mode: 'none', elements: [] },
                      mode: newMode,
                      // CRITICAL: elements: [] is only for TypeScript type safety
                      // useOverlayConfig will IGNORE this and read elements from runtime overlay Map
                      elements: [],
                    },
                  });
                }}
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '16px' }}>
          {effectiveMode === 'custom' && safeElements.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#a0a0a0', fontSize: '12px', lineHeight: '1.5' }}>
                  {t('overlayOptionsDescription')}
                </p>
                {safeElements.map(el => (
                  <Tooltip key={`delete-tooltip-${el.id}`} id={`delete-element-${el.id}`} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <button
                  ref={floatingButtonRef}
                  onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
                  aria-label={t('addElement')}
                  title={t('addElement')}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#2c2c2c',
                    border: '1px solid #8a2be2',
                    color: '#8a2be2',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 500,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = 'rgba(138, 43, 226, 0.15)';
                    e.currentTarget.style.borderColor = '#9d4edd';
                    e.currentTarget.style.color = '#9d4edd';
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = '#2c2c2c';
                    e.currentTarget.style.borderColor = '#8a2be2';
                    e.currentTarget.style.color = '#8a2be2';
                  }}
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={() => setIsClearAllModalOpen(true)}
                  aria-label={t('clearAllOverlayElements')}
                  title={t('clearAllOverlayElements')}
                  data-tooltip-id="clear-all-elements-tooltip"
                  data-tooltip-content={t('clearAllOverlayElements')}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#2c2c2c',
                    border: '1px solid #3a3a3a',
                    color: '#ff6b6b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = '#3a1f1f';
                    e.currentTarget.style.borderColor = '#ff6b6b';
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = '#2c2c2c';
                    e.currentTarget.style.borderColor = '#3a3a3a';
                  }}
                >
                  <Trash2 size={14} />
                </button>
                <Tooltip id="clear-all-elements-tooltip" />
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, color: '#a0a0a0', fontSize: '12px', lineHeight: '1.5' }}>
              {effectiveMode === 'none' 
                ? t('overlayActivateFirst') + t('overlayOptionsDescription')
                : t('overlayOptionsDescription')}
            </p>
          )}
        </div>

        {/* Custom Mode Content */}
        {effectiveMode === 'custom' && (
          <>
            {/* Ultra Minimal Floating Add Menu */}
            {isFloatingMenuOpen && menuPosition && (
              <div
                ref={floatingMenuRef}
                style={{
                  position: 'absolute',
                  top: `${menuPosition.top}px`,
                  ...(menuPosition.left !== undefined 
                    ? { left: `${menuPosition.left}px` }
                    : { right: `${menuPosition.right}px` }
                  ),
                  width: '180px',
                  background: '#2c2c2c',
                  border: '1px solid #3a3a3a',
                  borderRadius: '8px',
                  padding: '4px 0',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 1000,
                }}
              >
                {/* Add Metric */}
                <button
                  onClick={() => {
                    // ARCHITECT MODE: Manual Add → runtime overlay Map
                    // CRITICAL: activePresetId must be valid
                    if (!activePresetId) {
                      alert(t('alertSelectPresetFirst'));
                      return;
                    }
                    
                    // GLOBAL HARD LIMIT CHECK: Can we add 1 more element? (ARCHITECT MODE: runtime-only)
                    if (!canAddElement(activePresetId, 1)) {
                      alert(t('overlayMaxElementsWarning').replace('{max}', String(MAX_OVERLAY_ELEMENTS)).replace('{count}', '1'));
                      return;
                    }
                    
                    // 1) Create new element (helper function)
                    const newElement = createOverlayElementForAdd(settings, overlayConfig, {
                      type: 'metric',
                      x: 0,
                      y: 0,
                      zIndex: safeElements.length,
                      data: {
                        metric: 'cpuTemp' as OverlayMetricKey,
                        numberColor: 'rgba(255, 255, 255, 1)',
                        numberSize: 180,
                        textColor: 'transparent',
                        textSize: 0,
                        showLabel: false,
                      } as MetricElementData,
                    });
                    
                    if (stateManager) {
                      const action = createAddElementAction(newElement);
                      stateManager.dispatch(action);
                    } else {
                    }
                    setIsFloatingMenuOpen(false);
                  }}
                  disabled={!canAddElement(activePresetId, 1)}
                  style={{
                    height: '34px',
                    background: 'transparent',
                    border: 'none',
                    color: metricCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? '#a0a0a0' : '#f2f2f2',
                    cursor: metricCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    padding: '0 12px',
                    transition: 'background 0.15s ease',
                  }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = '#3a3a3a';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                >
                  <div style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={16} />
                  </div>
                  <span>{t('addMetric')}</span>
                </button>

                {/* Add Text */}
                <button
                  onClick={() => {
                    // ARCHITECT MODE: Manual Add → runtime overlay Map
                    // CRITICAL: activePresetId must be valid
                    if (!activePresetId) {
                      alert(t('alertSelectPresetFirst'));
                      return;
                    }
                    
                    // GLOBAL HARD LIMIT CHECK: Can we add 1 more element? (ARCHITECT MODE: runtime-only)
                    if (!canAddElement(activePresetId, 1)) {
                      alert(t('overlayMaxElementsWarning').replace('{max}', String(MAX_OVERLAY_ELEMENTS)).replace('{count}', '1'));
                      return;
                    }
                    
                    // 1) Create new element (helper function)
                    const newElement = createOverlayElementForAdd(settings, overlayConfig, {
                      type: 'text',
                      x: 0,
                      y: 0,
                      zIndex: safeElements.length,
                      data: {
                        text: t('text'),
                        textColor: 'rgba(255, 255, 255, 1)',
                        textSize: 45,
                      } as TextElementData,
                    });
                    
                    if (stateManager) {
                      const action = createAddElementAction(newElement);
                      stateManager.dispatch(action);
                    } else {
                    }
                    setIsFloatingMenuOpen(false);
                  }}
                  disabled={!canAddElement(activePresetId, 1)}
                  style={{
                    height: '34px',
                    background: 'transparent',
                    border: 'none',
                    color: textCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? '#a0a0a0' : '#f2f2f2',
                    cursor: textCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    padding: '0 12px',
                    transition: 'background 0.15s ease',
                  }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = '#3a3a3a';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                >
                  <div style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Type size={16} />
                  </div>
                  <span>{t('addText')}</span>
                </button>

                {/* Add Divider */}
                <button
                  onClick={() => {
                    // ARCHITECT MODE: Manual Add → runtime overlay Map
                    // CRITICAL: activePresetId must be valid
                    if (!activePresetId) {
                      alert(t('alertSelectPresetFirst'));
                      return;
                    }
                    
                    // GLOBAL HARD LIMIT CHECK: Can we add 1 more element? (ARCHITECT MODE: runtime-only)
                    if (!canAddElement(activePresetId, 1)) {
                      alert(t('overlayMaxElementsWarning').replace('{max}', String(MAX_OVERLAY_ELEMENTS)).replace('{count}', '1'));
                      return;
                    }
                    
                    // 1) Create new element (helper function)
                    const newElement = createOverlayElementForAdd(settings, overlayConfig, {
                      type: 'divider',
                      x: 0,
                      y: 0,
                      zIndex: safeElements.length,
                      data: {
                        width: 2,
                        height: 384,
                        color: 'rgba(255, 255, 255, 0.3)',
                      } as DividerElementData,
                    });
                    
                    if (stateManager) {
                      const action = createAddElementAction(newElement);
                      stateManager.dispatch(action);
                    } else {
                    }
                    setIsFloatingMenuOpen(false);
                  }}
                  disabled={!canAddElement(activePresetId, 1)}
                  style={{
                    height: '34px',
                    background: 'transparent',
                    border: 'none',
                    color: dividerCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? '#a0a0a0' : '#f2f2f2',
                    cursor: dividerCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    padding: '0 12px',
                    transition: 'background 0.15s ease',
                  }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = '#3a3a3a';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                >
                  <div style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={16} />
                  </div>
                  <span>{t('addDivider')}</span>
                </button>

                {/* Add Clock */}
                <button
                  onClick={() => {
                    // ARCHITECT MODE: Manual Add → runtime overlay Map
                    // CRITICAL: activePresetId must be valid
                    if (!activePresetId) {
                      alert(t('alertSelectPresetFirst'));
                      return;
                    }
                    
                    // GLOBAL HARD LIMIT CHECK: Can we add 1 more element? (ARCHITECT MODE: runtime-only)
                    if (!canAddElement(activePresetId, 1)) {
                      alert(t('overlayMaxElementsWarning').replace('{max}', String(MAX_OVERLAY_ELEMENTS)).replace('{count}', '1'));
                      return;
                    }
                    
                    // 1) Create new element (helper function)
                    const newElement = defaultClockElement(0, 0, safeElements.length);
                    
                    if (stateManager) {
                      const action = createAddElementAction(newElement);
                      stateManager.dispatch(action);
                    } else {
                    }
                    setIsFloatingMenuOpen(false);
                  }}
                  disabled={!canAddElement(activePresetId, 1)}
                  style={{
                    height: '34px',
                    background: 'transparent',
                    border: 'none',
                    color: clockCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? '#a0a0a0' : '#f2f2f2',
                    cursor: clockCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    padding: '0 12px',
                    transition: 'background 0.15s ease',
                  }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = '#3a3a3a';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                >
                  <div style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={16} />
                  </div>
                  <span>{t('addDigitalClock')}</span>
                </button>

                {/* Add Date */}
                <button
                  onClick={() => {
                    // ARCHITECT MODE: Manual Add → runtime overlay Map
                    // CRITICAL: activePresetId must be valid
                    if (!activePresetId) {
                      alert(t('alertSelectPresetFirst'));
                      return;
                    }
                    
                    // GLOBAL HARD LIMIT CHECK: Can we add 1 more element? (ARCHITECT MODE: runtime-only)
                    if (!canAddElement(activePresetId, 1)) {
                      alert(t('overlayMaxElementsWarning').replace('{max}', String(MAX_OVERLAY_ELEMENTS)).replace('{count}', '1'));
                      return;
                    }
                    
                    // 1) Create new element (helper function)
                    const newElement = defaultDateElement(0, 0, safeElements.length);
                    
                    if (stateManager) {
                      const action = createAddElementAction(newElement);
                      stateManager.dispatch(action);
                    } else {
                    }
                    setIsFloatingMenuOpen(false);
                  }}
                  disabled={!canAddElement(activePresetId, 1)}
                  style={{
                    height: '34px',
                    background: 'transparent',
                    border: 'none',
                    color: dateCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? '#a0a0a0' : '#f2f2f2',
                    cursor: dateCount >= MAX_OVERLAY_ELEMENTS || totalCount >= MAX_OVERLAY_ELEMENTS ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    padding: '0 12px',
                    transition: 'background 0.15s ease',
                  }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = '#3a3a3a';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      if (canAddElement(activePresetId, 1)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                >
                  <div style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={16} />
                  </div>
                  <span>{t('addDate')}</span>
                </button>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  margin: '4px 0',
                }} />

                {/* Add Overlay Presets */}
                <button
                  onClick={() => {
                    setIsOverlayPresetModalOpen(true);
                    setIsFloatingMenuOpen(false);
                  }}
                  style={{
                    height: '34px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f2f2f2',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    padding: '0 12px',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layout size={16} />
                  </div>
                  <span>{t('overlayPresetsButton')}</span>
                </button>
              </div>
            )}


            {/* Empty State */}
            {safeElements.length === 0 && (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                color: '#a0a0a0',
                fontSize: '13px',
                background: '#242424',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                position: 'relative',
              }}>
                <p style={{ margin: 0 }}>{t('noElements')}</p>
                <button
                  ref={floatingButtonRef}
                  onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
                  aria-label={t('addElement')}
                  title={t('addElement')}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#2c2c2c',
                    border: '1px solid #3a3a3a',
                    color: '#f2f2f2',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 500,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = '#2c2c2c';
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>
            )}

            {/* Elements List */}
            {safeElements.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {safeElements
                  .map((element, index) => ({ element, index }))
                  .sort((a, b) => (b.element.zIndex ?? b.index) - (a.element.zIndex ?? a.index))
                  .map(({ element }) => {
                    const sortedElements = [...safeElements].sort((a, b) => (b.zIndex ?? safeElements.indexOf(b)) - (a.zIndex ?? safeElements.indexOf(a)));
                    const unifiedIndex = sortedElements.findIndex(el => el.id === element.id);
                    const zOrderIndex = runtimeState ? runtimeState.zOrder.indexOf(element.id) : -1;

                    if (element.type === 'metric') {
                      const metricIndex = metricElements.findIndex(el => el.id === element.id);
                      
                      const metricLabels = [
                        t('firstMetric'),
                        t('secondMetric'),
                        t('thirdMetric'),
                        t('fourthMetric'),
                        t('fifthMetric'),
                        t('sixthMetric'),
                        t('seventhMetric'),
                        t('eighthMetric'),
                      ];

                      const isCollapsed = collapsedElements.has(element.id);
                      const isSelected = effectiveSelectedElementId === element.id;
                      
                      return (
                        <MetricElementInspector
                          key={element.id}
                          element={element as OverlayElement & { type: 'metric'; data: MetricElementData }}
                          metricIndex={metricIndex}
                          isSelected={isSelected}
                          isCollapsed={isCollapsed}
                          unifiedIndex={unifiedIndex}
                          totalElements={sortedElements.length}
                          activePresetId={activePresetId}
                          lang={lang}
                          metricLabels={metricLabels}
                          metricOptions={getMetricOptions()}
                          onToggleCollapse={() => toggleCollapse(element.id)}
                          onSelect={() => handleSelectionChange(element.id)}
                          onRemove={() => setRemoveModalState({ isOpen: true, elementId: element.id, elementType: 'metric' })}
                          onMoveUp={() => handleZOrderChange(element.id, 'forward')}
                          onMoveDown={() => handleZOrderChange(element.id, 'backward')}
                          onUpdateElement={(updater) => updateElement(element.id, updater)}
                        />
                      );
                    } else if (element.type === 'text') {
                      const textIndex = textElements.findIndex(el => el.id === element.id);
                      
                      const textLabels = [
                        t('firstText'),
                        t('secondText'),
                        t('thirdText'),
                        t('fourthText'),
                      ];

                      const isCollapsed = collapsedElements.has(element.id);
                      const isSelected = effectiveSelectedElementId === element.id;
                      
                      return (
                        <TextElementInspector
                          key={element.id}
                          element={element as OverlayElement & { type: 'text'; data: TextElementData }}
                          textIndex={textIndex}
                          isSelected={isSelected}
                          isCollapsed={isCollapsed}
                          unifiedIndex={unifiedIndex}
                          totalElements={sortedElements.length}
                          activePresetId={activePresetId}
                          lang={lang}
                          textLabels={textLabels}
                          onToggleCollapse={() => toggleCollapse(element.id)}
                          onSelect={() => handleSelectionChange(element.id)}
                          onRemove={() => setRemoveModalState({ isOpen: true, elementId: element.id, elementType: 'text' })}
                          onMoveUp={() => handleZOrderChange(element.id, 'forward')}
                          onMoveDown={() => handleZOrderChange(element.id, 'backward')}
                          onUpdateElement={(updater) => updateElement(element.id, updater)}
                        />
                      );
                    } else if (element.type === 'divider') {
                      const dividerIndex = dividerElements.findIndex(el => el.id === element.id);
                      
                      const dividerLabels = [
                        t('firstDivider'),
                        t('secondDivider'),
                        t('thirdDivider'),
                        t('fourthDivider'),
                      ];

                      const isCollapsed = collapsedElements.has(element.id);
                      const isSelected = effectiveSelectedElementId === element.id;
                      
                      return (
                        <DividerElementInspector
                          key={element.id}
                          element={element as OverlayElement & { type: 'divider'; data: DividerElementData }}
                          dividerIndex={dividerIndex}
                          isSelected={isSelected}
                          isCollapsed={isCollapsed}
                          unifiedIndex={unifiedIndex}
                          totalElements={sortedElements.length}
                          activePresetId={activePresetId}
                          lang={lang}
                          dividerLabels={dividerLabels}
                          onToggleCollapse={() => toggleCollapse(element.id)}
                          onSelect={() => handleSelectionChange(element.id)}
                          onRemove={() => setRemoveModalState({ isOpen: true, elementId: element.id, elementType: 'divider' })}
                          onMoveUp={() => handleZOrderChange(element.id, 'forward')}
                          onMoveDown={() => handleZOrderChange(element.id, 'backward')}
                          onUpdateElement={(updater) => updateElement(element.id, updater)}
                        />
                      );
                    } else if (element.type === 'clock') {
                      const clockIndex = clockElements.findIndex(el => el.id === element.id);
                      
                      const clockLabels = [
                        t('firstClock'),
                        t('secondClock'),
                        t('thirdClock'),
                        t('fourthClock'),
                      ];

                      const isCollapsed = collapsedElements.has(element.id);
                      const isSelected = effectiveSelectedElementId === element.id;
                      
                      return (
                        <ClockElementInspector
                          key={element.id}
                          element={element as OverlayElement & { type: 'clock'; data: ClockElementData }}
                          clockIndex={clockIndex}
                          isSelected={isSelected}
                          isCollapsed={isCollapsed}
                          unifiedIndex={unifiedIndex}
                          totalElements={sortedElements.length}
                          activePresetId={activePresetId}
                          lang={lang}
                          clockLabels={clockLabels}
                          onToggleCollapse={() => toggleCollapse(element.id)}
                          onSelect={() => handleSelectionChange(element.id)}
                          onRemove={() => setRemoveModalState({ isOpen: true, elementId: element.id, elementType: 'clock' })}
                          onMoveUp={() => handleZOrderChange(element.id, 'forward')}
                          onMoveDown={() => handleZOrderChange(element.id, 'backward')}
                          onUpdateElement={(updater) => updateElement(element.id, updater)}
                        />
                      );
                    } else if (element.type === 'date') {
                      const dateIndex = dateElements.findIndex(el => el.id === element.id);
                      
                      const dateLabels = [
                        t('firstDate'),
                        t('secondDate'),
                        t('thirdDate'),
                        t('fourthDate'),
                      ];

                      const isCollapsed = collapsedElements.has(element.id);
                      const isSelected = effectiveSelectedElementId === element.id;
                      
                      return (
                        <DateElementInspector
                          key={element.id}
                          element={element as OverlayElement & { type: 'date'; data: DateElementData }}
                          dateIndex={dateIndex}
                          isSelected={isSelected}
                          isCollapsed={isCollapsed}
                          unifiedIndex={unifiedIndex}
                          totalElements={sortedElements.length}
                          activePresetId={activePresetId}
                          lang={lang}
                          dateLabels={dateLabels}
                          onToggleCollapse={() => toggleCollapse(element.id)}
                          onSelect={() => handleSelectionChange(element.id)}
                          onRemove={() => setRemoveModalState({ isOpen: true, elementId: element.id, elementType: 'date' })}
                          onMoveUp={() => handleZOrderChange(element.id, 'forward')}
                          onMoveDown={() => handleZOrderChange(element.id, 'backward')}
                          onUpdateElement={(updater) => updateElement(element.id, updater)}
                        />
                      );
                    }
                    return null;
                  })}
              </div>
            )}

            {/* Overlay Preset Footer */}
            {effectiveMode === 'custom' && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#242424',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".nzxt-esc-overlay-preset"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                }}>
                  <button
                    onClick={handleExportOverlay}
                    disabled={safeElements.length === 0}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      background: safeElements.length === 0 ? '#252525' : '#2c2c2c',
                      border: '1px solid #3a3a3a',
                      color: safeElements.length === 0 ? '#a0a0a0' : '#f2f2f2',
                      borderRadius: '6px',
                      cursor: safeElements.length === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      if (safeElements.length > 0) {
                        e.currentTarget.style.background = '#3a3a3a';
                        e.currentTarget.style.borderColor = '#8a2be2';
                      }
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      if (safeElements.length > 0) {
                        e.currentTarget.style.background = '#2c2c2c';
                        e.currentTarget.style.borderColor = '#3a3a3a';
                      }
                    }}
                  >
                    {t('overlayExportButton')}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      background: '#2c2c2c',
                      border: '1px solid #3a3a3a',
                      color: '#f2f2f2',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.background = '#3a3a3a';
                      e.currentTarget.style.borderColor = '#8a2be2';
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.background = '#2c2c2c';
                      e.currentTarget.style.borderColor = '#3a3a3a';
                    }}
                  >
                    {t('overlayImportButton')}
                  </button>
                </div>
                {/* Clear Runtime Elements Button */}
                {runtimeState && runtimeState.elements.size > 0 && (
                  <button
                    onClick={handleClearAllClick}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      background: '#2c2c2c',
                      border: '1px solid #3a3a3a',
                      color: '#f2f2f2',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 500,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.background = '#3a3a3a';
                      e.currentTarget.style.borderColor = '#ff4444';
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.background = '#2c2c2c';
                      e.currentTarget.style.borderColor = '#3a3a3a';
                    }}
                  >
                    {t('clearAllOverlayElements')}
                  </button>
                )}
                {/* Element Count Indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  marginTop: '4px',
                }}>
                  <span style={{
                    color: totalCount >= MAX_OVERLAY_ELEMENTS ? '#ff4444' : totalCount >= MAX_OVERLAY_ELEMENTS * 0.8 ? '#ffaa00' : '#a0a0a0',
                    fontSize: '11px',
                    fontWeight: totalCount >= MAX_OVERLAY_ELEMENTS ? 600 : 400,
                  }}>
                    {totalCount} / {MAX_OVERLAY_ELEMENTS}
                  </span>
                  <span style={{
                    color: '#666',
                    fontSize: '10px',
                  }}>
                    elements
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  color: '#a0a0a0',
                  fontSize: '11px',
                  lineHeight: '1.5',
                  textAlign: 'center',
                }}>
                  {t('overlayFooterDescription')}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Clear All Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={handleClearAllConfirm}
        lang={lang}
        titleKey="clearAllOverlayElementsConfirmTitle"
        descriptionKey="clearAllOverlayElementsConfirm"
        confirmButtonKey="clearAllOverlayElements"
      />

      {/* Overlay Export Name Modal */}
      <OverlayExportNameModal
        isOpen={isOverlayExportModalOpen}
        onClose={() => setIsOverlayExportModalOpen(false)}
        onConfirm={handleExportOverlayConfirm}
        lang={lang}
        initialName=""
      />

      {/* Remove Confirmation Modal */}
      {removeModalState.elementId && removeModalState.elementType && (
        <RemoveConfirmationModal
          isOpen={removeModalState.isOpen}
          onClose={() => setRemoveModalState({ isOpen: false, elementId: null, elementType: null })}
          onConfirm={() => {
            if (removeModalState.elementId) {
                // ARCHITECT MODE: Remove element from runtime, NOT from settings
              if (activePresetId && removeModalState.elementId) {
                if (stateManager && runtimeState) {
                  const action = createRemoveElementAction(removeModalState.elementId, runtimeState);
                  stateManager.dispatch(action);
                  if (IS_DEV) {
                  }
                } else {
                }
              }
            }
          }}
          lang={lang}
          elementType={removeModalState.elementType}
        />
      )}

      {/* Import Overlay Modal */}
      <ImportOverlayModal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportedElements([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        onImport={handleImportOverlay}
        importedElements={importedElements}
        currentElementCount={runtimeState ? runtimeState.elements.size : 0}
        activePresetId={activePresetId}
        settings={settings}
        lang={lang}
      />

      {/* Overlay Preset Picker Modal */}
      <OverlayPresetPickerModal
        isOpen={isOverlayPresetModalOpen}
        onClose={() => setIsOverlayPresetModalOpen(false)}
        onSelect={handleOverlayPresetSelect}
        lang={lang}
      />
    </div>
  );
}
