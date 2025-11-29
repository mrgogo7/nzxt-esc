import type { MouseEvent } from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronUp, ChevronDown, Plus, X, BarChart3, Type, Minus, Layout, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import type { AppSettings } from '../../../constants/defaults';
import type { Overlay, OverlayMetricKey, OverlayElement, MetricElementData, TextElementData, DividerElementData } from '../../../types/overlay';
import type { Lang, t as tFunction } from '../../../i18n';
// FAZ-4-3: Legacy reorderOverlayElements deleted - only vNext path remains
import { createOverlayElementForAdd, MAX_OVERLAY_ELEMENTS, canAddElement, getTotalElementCount, resolveElementIdConflict } from '../../../utils/overlaySettingsHelpers';
import OverlayField from './OverlayField';
import ResetConfirmationModal from './ResetConfirmationModal';
import RemoveConfirmationModal from './RemoveConfirmationModal';
import ImportOverlayModal from './ImportOverlayModal';
import OverlayPresetPickerModal from '../modals/OverlayPresetPickerModal';
import OverlayExportNameModal from './OverlayExportNameModal';
import ColorPicker from '../ColorPicker';
import CombinedTextColorInput from './CombinedTextColorInput';
import { exportOverlayPreset, importOverlayPreset } from '../../../overlayPreset';
import { getTemplateElements } from '../../../overlayPreset/templates';
import { normalizeZIndexForAppend } from '../../../overlayPreset/utils';
import { useOverlayStateManager } from '@/state/overlay/useOverlayStateManager';
import { createAddElementAction, createRemoveElementAction, createUpdateElementAction, createUpdateElementDataAction, createBatchAction, createZOrderAction, createSelectAction, createMoveElementZUpAction, createMoveElementZDownAction } from '@/state/overlay/actions';
import { getElement as getElementFromStore } from '@/state/overlay/elementStore';
import { bringToFront, sendToBack } from '@/state/overlay/zOrder';
import { getElementsInZOrder } from '@/state/overlay/selectors';
// FAZ-4 FINAL: Runtime always enabled (legacy removed)
import { IS_DEV } from '@/utils/env';

interface OverlaySettingsProps {
  overlayConfig: Overlay;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  lang: Lang;
  t: typeof tFunction;
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
  t,
  selectedElementId,
  setSelectedElementId,
  activePresetId,
}: OverlaySettingsProps) {
  // FAZ-4 FINAL: Runtime always enabled - get StateManager
  const stateManagerHook = activePresetId
    ? useOverlayStateManager(activePresetId)
    : null;
  const stateManager = stateManagerHook?.stateManager ?? null;
  const runtimeState = stateManagerHook?.state ?? null;
  
  // FAZ-4-4 HOTFIX: Use runtime state as canonical source for elements
  // overlayConfig prop may be stale, so we use runtime state when available
  const safeElements = useMemo(() => {
    if (runtimeState) {
      // Runtime: Get elements from runtime state (canonical source)
      return getElementsInZOrder(runtimeState.elements, runtimeState.zOrder);
    } else {
      // Fallback: Use overlayConfig prop (should not happen after FAZ-4-4)
      return Array.isArray(overlayConfig.elements) ? overlayConfig.elements : [];
    }
  }, [runtimeState, overlayConfig.elements]);
  
  // FAZ-4-4: Derive effective mode from runtime state
  const effectiveMode = useMemo(() => {
    if (runtimeState) {
      // Runtime: Mode is 'custom' if elements exist, otherwise use settings
      return safeElements.length > 0 ? 'custom' : (settings.overlay?.mode || 'none');
    } else {
      // Fallback: Use overlayConfig mode
      return overlayConfig.mode || 'none';
    }
  }, [runtimeState, safeElements.length, settings.overlay?.mode]);
  
  // Helper: Get metric, text, and divider element counts
  const metricElements = safeElements.filter(el => el?.type === 'metric');
  const textElements = safeElements.filter(el => el?.type === 'text');
  const dividerElements = safeElements.filter(el => el?.type === 'divider');
  const metricCount = metricElements.length;
  const textCount = textElements.length;
  const dividerCount = dividerElements.length;
  
  // GLOBAL HARD LIMIT: Get total count from runtime overlay only (ARCHITECT MODE)
  // CRITICAL: Use activePresetId to get runtime count for the specific preset
  const totalCount = getTotalElementCount(activePresetId);
  
  // FAZ-4 FINAL: Helper function to update element
  // FAZ-4-4L: Enhanced to use updateElementData action for data-only changes (more efficient)
  const updateElement = useCallback((elementId: string, updater: (element: OverlayElement) => OverlayElement) => {
    if (!activePresetId) return;
    
    if (stateManager && runtimeState) {
      // New system: Get current element, apply updater, create update action
      const currentElement = getElementFromStore(runtimeState.elements, elementId);
      if (!currentElement) return;
      
      const newElement = updater(currentElement);
      
      // FAZ-4-4L: Check if only data changed (more efficient action)
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
    // FAZ-4 FINAL: Runtime always enabled - no legacy fallback
  }, [activePresetId, stateManager, runtimeState]);
  
  // FAZ-4 FINAL: Helper function for z-order operations
  // FAZ-4-4P: Updated to use new moveElementZUp/moveElementZDown actions
  const handleZOrderChange = useCallback((elementId: string, direction: 'forward' | 'backward' | 'front' | 'back') => {
    if (!activePresetId) return;
    
    if (stateManager && runtimeState) {
      // FAZ-4-4P: Use new z-index based actions for move up/down
      let action;
      
      switch (direction) {
        case 'forward':
          // Move Down button calls 'forward' = should decrement zIndex (send down)
          // But 'forward' in zOrder means move towards end (higher zIndex)
          // So we need to swap: 'forward' -> decrement (moveElementZDown)
          action = createMoveElementZDownAction(elementId, runtimeState);
          break;
        case 'backward':
          // Move Up button calls 'backward' = should increment zIndex (bring up)
          // But 'backward' in zOrder means move towards beginning (lower zIndex)
          // So we need to swap: 'backward' -> increment (moveElementZUp)
          action = createMoveElementZUpAction(elementId, runtimeState);
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
    // FAZ-4 FINAL: Runtime always enabled - no legacy fallback
  }, [activePresetId, stateManager, runtimeState]);
  
  // FAZ-4 FINAL: Wrapper for setSelectedElementId that also updates runtime state
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
  
  // FAZ-3B-2: Derive selectedElementId from runtime state if new runtime is active
  // This ensures UI stays in sync with runtime state
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
  const [removeModalState, setRemoveModalState] = useState<{ isOpen: boolean; elementId: string | null; elementType: 'metric' | 'text' | 'divider' | null }>({
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

  // FAZ-10: Listen for Delete key event from ConfigPreview
  useEffect(() => {
    const handleDeleteElement = (e: Event) => {
      const customEvent = e as CustomEvent<{ elementId: string; elementType: 'metric' | 'text' | 'divider' }>;
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
  const getMetricOptions = () => [
    { value: 'cpuTemp', label: t('metricCpuTemp', lang) },
    { value: 'cpuLoad', label: t('metricCpuLoad', lang) },
    { value: 'cpuClock', label: t('metricCpuClock', lang) },
    { value: 'liquidTemp', label: t('metricLiquidTemp', lang) },
    { value: 'gpuTemp', label: t('metricGpuTemp', lang) },
    { value: 'gpuLoad', label: t('metricGpuLoad', lang) },
    { value: 'gpuClock', label: t('metricGpuClock', lang) },
  ];

  // Handler: Open overlay export modal
  const handleExportOverlay = () => {
    // CRITICAL: activePresetId must be valid
    if (!activePresetId) {
      alert('Please select a preset first.');
      return;
    }
    
    // FAZ-4 FINAL: Get elements from runtime state
    if (stateManager && runtimeState) {
      const safeElements = Array.from(runtimeState.elements.values());
      
      if (safeElements.length === 0) {
        alert('No overlay elements to export. Add some elements first.');
        return;
      }
      
      // Open export name modal
      setIsOverlayExportModalOpen(true);
    } else {
      if (IS_DEV) {
        console.warn('[OverlaySettings] Export called but vNext not available');
      }
      alert('No overlay elements to export. Add some elements first.');
    }
  };

  // Handler: Confirm overlay export with name
  const handleExportOverlayConfirm = async (presetName: string) => {
    if (!activePresetId) {
      return;
    }
    
    try {
      // FAZ-4 FINAL: Get elements from runtime state
      if (stateManager && runtimeState) {
        const safeElements = Array.from(runtimeState.elements.values());
        
        if (safeElements.length === 0) {
          alert('No overlay elements to export. Add some elements first.');
          return;
        }
        
        await exportOverlayPreset(safeElements, presetName);
      } else {
        if (IS_DEV) {
          console.warn('[OverlaySettings] Export confirm called but vNext not available');
        }
        alert('No overlay elements to export. Add some elements first.');
      }
    } catch (error) {
      const errorMessage = t('overlayExportError', lang);
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
        const errorMessage = t('overlayImportError', lang)
          .replace('{error}', result.error || 'Unknown error');
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
      const errorMessage = t('overlayImportError', lang)
        .replace('{error}', error instanceof Error ? error.message : 'Unknown error');
      alert(errorMessage);
    }
  };

  // Handler: Apply imported elements (Replace or Append)
  // IMPORTANT: This writes to runtime state, NOT to settings.overlay.elements
  // GLOBAL HARD LIMIT: Enforces total (preset manual + runtime imported) <= 20
  const handleImportOverlay = async (elements: OverlayElement[], mode: 'replace' | 'append') => {
    // CRITICAL: activePresetId must be valid for per-preset runtime state
    if (!activePresetId) {
      alert(t('overlayImportError', lang).replace('{error}', 'No active preset selected. Please select a preset first.'));
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
      // FAZ-4 FINAL: Use runtime system
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
        if (IS_DEV) {
          console.warn('[OverlaySettings] Replace called but vNext not available');
        }
      }
    } else {
      // Append: runtimeOverlay[activePresetId] = [...current, ...imported]
      // Normalize zIndex before appending
      const normalizedElements = normalizeZIndexForAppend([], safeElements);
      
      // FAZ-4 FINAL: Use runtime system
      if (stateManager && runtimeState) {
        // Check limit using vNext state
        const currentCount = runtimeState.elements.size;
        if (currentCount + normalizedElements.length > MAX_OVERLAY_ELEMENTS) {
          const message = t('overlayMaxElementsWarning', lang)
            .replace('{max}', String(MAX_OVERLAY_ELEMENTS))
            .replace('{count}', String(normalizedElements.length));
          alert(message + `\n\nCannot append overlay elements. Current runtime count is ${currentCount}/${MAX_OVERLAY_ELEMENTS}. Adding ${normalizedElements.length} elements would exceed the limit of ${MAX_OVERLAY_ELEMENTS}.`);
          return; // Import iptal, runtime değişmedi
        }
        
        // FAZ-4-4N: Resolve ID conflicts before appending
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
        if (IS_DEV) {
          console.warn('[OverlaySettings] Append called but vNext not available');
        }
      }
    }

    // Force re-render only if using old system (new system uses subscribe callback)
    // FAZ-4 FINAL: Runtime always enabled - no fallback needed

    // Reset state
    setImportedElements([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handler: Open Clear All confirmation modal
  const handleClearAllClick = () => {
    if (!activePresetId) {
      alert('Please select a preset first.');
      return;
    }
    setIsClearAllModalOpen(true);
  };

  // Handler: Confirm Clear All - clears all runtime elements
  const handleClearAllConfirm = () => {
    if (!activePresetId) {
      return;
    }
    
    // FAZ-4 FINAL: Use runtime system
    if (stateManager && runtimeState) {
      // Create batch remove actions for all elements
      const elementIds = Array.from(runtimeState.elements.keys());
      if (elementIds.length > 0) {
        const removeActions = elementIds.map(id => createRemoveElementAction(id, runtimeState));
        const batchAction = createBatchAction(removeActions);
        stateManager.dispatch(batchAction);
      }
    } else {
      if (IS_DEV) {
        console.warn('[OverlaySettings] ClearAll called but vNext not available');
      }
    }
  };

  // Handler: Overlay preset template selection
  const handleOverlayPresetSelect = (templateId: string) => {
    // CRITICAL: activePresetId must be valid for per-preset runtime state
    if (!activePresetId) {
      alert(t('overlayImportError', lang).replace('{error}', 'No active preset selected. Please select a preset first.'));
      return;
    }
    
    try {
      // Get template elements with assigned IDs
      const templateElements = getTemplateElements(templateId);
      
      if (templateElements.length === 0) {
        alert(t('overlayImportError', lang).replace('{error}', `Template ${templateId} is empty.`));
        return;
      }
      
      // Store in importedElements state
      setImportedElements(templateElements);
      
      // Open import modal (FAZ 1 modal - Replace/Append)
      setIsImportModalOpen(true);
    } catch (error) {
      alert(t('overlayImportError', lang).replace('{error}', error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="settings-column overlay-options-area">
      <div className="panel" style={{ position: 'relative' }}>
        {/* Header with Mode Switch */}
        <div className="panel-header">
          <h3>{effectiveMode === 'custom' ? t('overlaySettingsTitle', lang) : t('overlayTitle', lang)}</h3>
          <div className="overlay-toggle-compact">
            <span>{effectiveMode === 'custom' ? t('overlayStatusActive', lang) : t('overlayStatusOff', lang)}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={effectiveMode === 'custom'}
                aria-label={effectiveMode === 'custom' ? t('overlayStatusActive', lang) : t('overlayStatusOff', lang)}
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
                  {t('overlayOptionsDescription', lang)}
                </p>
                {/* FAZ-4-POST-FIX-Z-ORDER-AND-TOOLTIP: Tooltips moved outside <p> to fix DOM nesting */}
                {safeElements.map(el => (
                  <Tooltip key={`delete-tooltip-${el.id}`} id={`delete-element-${el.id}`} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                <button
                  ref={floatingButtonRef}
                  onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
                  aria-label={t('addElement', lang) || 'Add Element'}
                  title={t('addElement', lang) || 'Add Element'}
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
                  aria-label={t('clearAllOverlayElements', lang) || 'Clear All Overlay Elements'}
                  title={t('clearAllOverlayElements', lang) || 'Clear All Overlay Elements'}
                  data-tooltip-id="clear-all-elements-tooltip"
                  data-tooltip-content={t('clearAllOverlayElements', lang)}
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
                ? t('overlayActivateFirst', lang) + t('overlayOptionsDescription', lang)
                : t('overlayOptionsDescription', lang)}
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
                {/* Add Reading */}
                <button
                  onClick={() => {
                    // ARCHITECT MODE: Manual Add → runtime overlay Map
                    // CRITICAL: activePresetId must be valid
                    if (!activePresetId) {
                      alert('Please select a preset first.');
                      return;
                    }
                    
                    // GLOBAL HARD LIMIT CHECK: Can we add 1 more element? (ARCHITECT MODE: runtime-only)
                    if (!canAddElement(activePresetId, 1)) {
                      alert(t('overlayMaxElementsWarning', lang).replace('{max}', String(MAX_OVERLAY_ELEMENTS)).replace('{count}', '1'));
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
                    
                    // FAZ-3B-1: Use new runtime system if feature flag is enabled
                    if (stateManager) {
                      const action = createAddElementAction(newElement);
                      stateManager.dispatch(action);
                      // FAZ-4-4C: Dev logging for add operation
                      if (IS_DEV) {
                        console.debug('[OverlayRuntime] Added element', { id: newElement.id, type: newElement.type });
                      }
                    } else {
                      if (IS_DEV) {
                        console.warn('[OverlaySettings] Add metric called but vNext not available');
                      }
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
                  <span>{t('addReading', lang)}</span>
                </button>

                {/* Add Text */}
                <button
                  onClick={() => {
                    // ARCHITECT MODE: Manual Add → runtime overlay Map
                    // CRITICAL: activePresetId must be valid
                    if (!activePresetId) {
                      alert('Please select a preset first.');
                      return;
                    }
                    
                    // GLOBAL HARD LIMIT CHECK: Can we add 1 more element? (ARCHITECT MODE: runtime-only)
                    if (!canAddElement(activePresetId, 1)) {
                      alert(t('overlayMaxElementsWarning', lang).replace('{max}', String(MAX_OVERLAY_ELEMENTS)).replace('{count}', '1'));
                      return;
                    }
                    
                    // 1) Create new element (helper function)
                    const newElement = createOverlayElementForAdd(settings, overlayConfig, {
                      type: 'text',
                      x: 0,
                      y: 0,
                      zIndex: safeElements.length,
                      data: {
                        text: 'Text',
                        textColor: 'rgba(255, 255, 255, 1)',
                        textSize: 45,
                      } as TextElementData,
                    });
                    
                    // FAZ-3B-1: Use new runtime system if feature flag is enabled
                    if (stateManager) {
                      const action = createAddElementAction(newElement);
                      stateManager.dispatch(action);
                      // FAZ-4-4C: Dev logging for add operation
                      if (IS_DEV) {
                        console.debug('[OverlayRuntime] Added element', { id: newElement.id, type: newElement.type });
                      }
                    } else {
                      if (IS_DEV) {
                        console.warn('[OverlaySettings] Add text called but vNext not available');
                      }
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
                  <span>{t('addText', lang)}</span>
                </button>

                {/* Add Divider */}
                <button
                  onClick={() => {
                    // ARCHITECT MODE: Manual Add → runtime overlay Map
                    // CRITICAL: activePresetId must be valid
                    if (!activePresetId) {
                      alert('Please select a preset first.');
                      return;
                    }
                    
                    // GLOBAL HARD LIMIT CHECK: Can we add 1 more element? (ARCHITECT MODE: runtime-only)
                    if (!canAddElement(activePresetId, 1)) {
                      alert(t('overlayMaxElementsWarning', lang).replace('{max}', String(MAX_OVERLAY_ELEMENTS)).replace('{count}', '1'));
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
                    
                    // FAZ-3B-1: Use new runtime system if feature flag is enabled
                    if (stateManager) {
                      const action = createAddElementAction(newElement);
                      stateManager.dispatch(action);
                      // FAZ-4-4C: Dev logging for add operation
                      if (IS_DEV) {
                        console.debug('[OverlayRuntime] Added element', { id: newElement.id, type: newElement.type });
                      }
                    } else {
                      if (IS_DEV) {
                        console.warn('[OverlaySettings] Add divider called but vNext not available');
                      }
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
                  <span>{t('addDivider', lang)}</span>
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
                  <span>{t('overlayPresetsButton', lang)}</span>
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
                <p style={{ margin: 0 }}>{t('noElements', lang)}</p>
                <button
                  ref={floatingButtonRef}
                  onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
                  aria-label={t('addElement', lang) || 'Add Element'}
                  title={t('addElement', lang) || 'Add Element'}
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
                  .sort((a, b) => (a.element.zIndex ?? a.index) - (b.element.zIndex ?? b.index))
                  .map(({ element }) => {
                    const sortedElements = [...safeElements].sort((a, b) => (a.zIndex ?? safeElements.indexOf(a)) - (b.zIndex ?? safeElements.indexOf(b)));
                    const unifiedIndex = sortedElements.findIndex(el => el.id === element.id);

                    if (element.type === 'metric') {
                      const data = element.data as MetricElementData;
                      const metricIndex = metricElements.findIndex(el => el.id === element.id);
                      
                      const readingLabels = [
                        t('firstReading', lang),
                        t('secondReading', lang),
                        t('thirdReading', lang),
                        t('fourthReading', lang),
                        t('fifthReading', lang),
                        t('sixthReading', lang),
                        t('seventhReading', lang),
                        t('eighthReading', lang),
                      ];

                      const isCollapsed = collapsedElements.has(element.id);
                      const isSelected = effectiveSelectedElementId === element.id;
                      
                      return (
                        <div 
                          key={element.id} 
                          className={isSelected ? 'overlay-element-item selected' : 'overlay-element-item'}
                          onClick={() => setSelectedElementId(element.id)}
                          style={{ 
                            padding: '8px',
                            background: '#242424',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Compact Element Header */}
                          <div
                            onClick={() => handleSelectionChange(element.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              height: '36px',
                              marginBottom: isCollapsed ? '0' : '8px',
                              paddingBottom: isCollapsed ? '0' : '8px',
                              borderBottom: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                              background: '#262626',
                              borderRadius: '4px',
                              padding: '0 4px',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCollapse(element.id);
                                }}
                                aria-label={isCollapsed ? t('expand', lang) || 'Expand' : t('collapse', lang) || 'Collapse'}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#a0a0a0',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '2px',
                                  transition: 'transform 0.15s ease',
                                  transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                                }}
                              >
                                <ChevronDown size={14} />
                              </button>
                              <span style={{ color: '#f2f2f2', fontSize: '13px', fontWeight: 600 }}>
                                {readingLabels[metricIndex] || `${metricIndex + 1}${metricIndex === 0 ? 'st' : metricIndex === 1 ? 'nd' : metricIndex === 2 ? 'rd' : 'th'} ${t('reading', lang)}`}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {/* Remove Button - Outline Style with Red Icon */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  setRemoveModalState({
                                    isOpen: true,
                                    elementId: element.id,
                                    elementType: element.type,
                                  });
                                }}
                                data-tooltip-id={`delete-element-${element.id}`}
                                data-tooltip-content={t('deleteElement', lang)}
                                aria-label={t('deleteElement', lang)}
                                title={t('deleteElement', lang)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: 'transparent',
                                  border: '1px solid #3a3a3a',
                                  color: '#ff6b6b',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.currentTarget.style.borderColor = '#ff6b6b';
                                  e.currentTarget.style.background = '#3a1f1f';
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.currentTarget.style.borderColor = '#3a3a3a';
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <X size={12} />
                              </button>
                              {/* Move Down Button - Icon Only */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    handleZOrderChange(element.id, 'forward');
                                  }
                                }}
                                disabled={unifiedIndex === sortedElements.length - 1}
                                aria-label={t('moveReadingDown', lang) || t('moveTextDown', lang) || t('moveDividerDown', lang) || 'Move Down'}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: unifiedIndex === sortedElements.length - 1 ? '#252525' : '#2c2c2c',
                                  border: '1px solid #3a3a3a',
                                  color: unifiedIndex === sortedElements.length - 1 ? '#a0a0a0' : '#f2f2f2',
                                  borderRadius: '4px',
                                  cursor: unifiedIndex === sortedElements.length - 1 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                data-tooltip-id="move-down-tooltip"
                                data-tooltip-content={t('moveReadingDown', lang)}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    e.currentTarget.style.background = '#3a3a3a';
                                    e.currentTarget.style.borderColor = '#8a2be2';
                                  }
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    e.currentTarget.style.background = '#2c2c2c';
                                    e.currentTarget.style.borderColor = '#3a3a3a';
                                  }
                                }}
                              >
                                <ChevronDown size={12} />
                              </button>
                              {/* Move Up Button - Icon Only */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (unifiedIndex > 0) {
                                    handleZOrderChange(element.id, 'backward');
                                  }
                                }}
                                disabled={unifiedIndex === 0}
                                aria-label={t('moveReadingUp', lang) || 'Move Up'}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: unifiedIndex === 0 ? '#252525' : '#2c2c2c',
                                  border: '1px solid #3a3a3a',
                                  color: unifiedIndex === 0 ? '#a0a0a0' : '#f2f2f2',
                                  borderRadius: '4px',
                                  cursor: unifiedIndex === 0 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                data-tooltip-id="move-up-tooltip"
                                data-tooltip-content={t('moveReadingUp', lang)}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex > 0) {
                                    e.currentTarget.style.background = '#3a3a3a';
                                    e.currentTarget.style.borderColor = '#8a2be2';
                                  }
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex > 0) {
                                    e.currentTarget.style.background = '#2c2c2c';
                                    e.currentTarget.style.borderColor = '#3a3a3a';
                                  }
                                }}
                              >
                                <ChevronUp size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Compact 2-Column Element Settings */}
                          {!isCollapsed && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {/* Sensor with Color on the right */}
                              <div className="setting-row">
                                <label 
                                  style={{ fontSize: '11px', cursor: 'help' }}
                                  data-tooltip-id={`sensor-tooltip-${element.id}`}
                                  data-tooltip-content={t('tooltipSensor', lang)}
                                >
                                  {t('sensor', lang) || t('reading', lang)}
                                </label>
                                <Tooltip id={`sensor-tooltip-${element.id}`} />
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                                  <select
                                    className="url-input"
                                    value={data.metric}
                                    onChange={(e) => {
                                      if (!activePresetId) return;
                                      const newMetric = e.target.value as OverlayMetricKey;
                                      updateElement(element.id, (el) => ({
                                        ...el,
                                        data: { ...(el.data as MetricElementData), metric: newMetric }
                                      }));
                                    }}
                                    aria-label={t('sensor', lang) || t('reading', lang)}
                                    style={{ width: '134px' }}
                                  >
                                    {getMetricOptions().map(opt => (
                                      <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                  <div data-tooltip-id={`color-tooltip-${element.id}`} data-tooltip-content={t('tooltipColor', lang)}>
                                    <ColorPicker
                                      value={data.numberColor || '#ffffff'}
                                      onChange={(color) => {
                                        if (!activePresetId) return;
                                        updateElement(element.id, (el) => ({
                                          ...el,
                                          data: { ...(el.data as MetricElementData), numberColor: color }
                                        }));
                                      }}
                                    />
                                  </div>
                                  <Tooltip id={`color-tooltip-${element.id}`} />
                                </div>
                              </div>

                              {/* 2-Column Grid for other fields */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {/* Row 1: Size | Angle */}
                              <OverlayField
                                type="number"
                                label={t('size', lang)}
                                value={data.numberSize}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    data: { ...(el.data as MetricElementData), numberSize: value }
                                  }));
                                }}
                                step={1}
                                labelTooltipId={`size-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipSize', lang)}
                              />
                              <OverlayField
                                type="number"
                                label={t('angle', lang)}
                                value={element.angle ?? 0}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    angle: value
                                  }));
                                }}
                                step={1}
                                min={0}
                                max={360}
                                labelTooltipId={`angle-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipAngle', lang)}
                              />

                              {/* Row 2: X Off | Y Off */}
                              <OverlayField
                                type="number"
                                label={t('customXOffset', lang)}
                                value={element.x}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    x: value
                                  }));
                                }}
                                step={1}
                                labelTooltipId={`xoffset-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipXOffset', lang)}
                              />
                              <OverlayField
                                type="number"
                                label={t('customYOffset', lang)}
                                value={element.y}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    y: value
                                  }));
                                }}
                                step={1}
                                labelTooltipId={`yoffset-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipYOffset', lang)}
                              />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } else if (element.type === 'text') {
                      const data = element.data as TextElementData;
                      const textIndex = textElements.findIndex(el => el.id === element.id);
                      
                      const textLabels = [
                        t('firstText', lang),
                        t('secondText', lang),
                        t('thirdText', lang),
                        t('fourthText', lang),
                      ];

                      // Sanitize text input - remove HTML tags and dangerous characters
                      const sanitizeText = (input: string): string => {
                        let sanitized = input.replace(/<[^>]*>/g, '');
                        sanitized = sanitized.replace(/javascript:/gi, '');
                        sanitized = sanitized.replace(/on\w+\s*=/gi, '');
                        sanitized = sanitized.substring(0, 120);
                        return sanitized;
                      };

                      const isCollapsed = collapsedElements.has(element.id);
                      const isSelected = effectiveSelectedElementId === element.id;
                      
                      return (
                        <div 
                          key={element.id} 
                          className={isSelected ? 'overlay-element-item selected' : 'overlay-element-item'}
                          onClick={() => setSelectedElementId(element.id)}
                          style={{ 
                            padding: '8px',
                            background: '#242424',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Compact Element Header */}
                          <div
                            onClick={() => handleSelectionChange(element.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              height: '36px',
                              marginBottom: isCollapsed ? '0' : '8px',
                              paddingBottom: isCollapsed ? '0' : '8px',
                              borderBottom: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                              background: '#262626',
                              borderRadius: '4px',
                              padding: '0 4px',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCollapse(element.id);
                                }}
                                aria-label={isCollapsed ? t('expand', lang) || 'Expand' : t('collapse', lang) || 'Collapse'}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#a0a0a0',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '2px',
                                  transition: 'transform 0.15s ease',
                                  transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                                }}
                              >
                                <ChevronDown size={14} />
                              </button>
                              <span style={{ color: '#f2f2f2', fontSize: '13px', fontWeight: 600 }}>
                                {textLabels[textIndex] || `${textIndex + 1}${textIndex === 0 ? 'st' : textIndex === 1 ? 'nd' : textIndex === 2 ? 'rd' : 'th'} ${t('text', lang)}`}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {/* Remove Button - Outline Style with Red Icon */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  setRemoveModalState({
                                    isOpen: true,
                                    elementId: element.id,
                                    elementType: element.type,
                                  });
                                }}
                                data-tooltip-id={`delete-element-${element.id}`}
                                data-tooltip-content={t('deleteElement', lang)}
                                aria-label={t('deleteElement', lang)}
                                title={t('deleteElement', lang)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: 'transparent',
                                  border: '1px solid #3a3a3a',
                                  color: '#ff6b6b',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.currentTarget.style.borderColor = '#ff6b6b';
                                  e.currentTarget.style.background = '#3a1f1f';
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.currentTarget.style.borderColor = '#3a3a3a';
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <X size={12} />
                              </button>
                              {/* Move Down Button - Icon Only */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    handleZOrderChange(element.id, 'forward');
                                  }
                                }}
                                disabled={unifiedIndex === sortedElements.length - 1}
                                aria-label={t('moveReadingDown', lang) || t('moveTextDown', lang) || t('moveDividerDown', lang) || 'Move Down'}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: unifiedIndex === sortedElements.length - 1 ? '#252525' : '#2c2c2c',
                                  border: '1px solid #3a3a3a',
                                  color: unifiedIndex === sortedElements.length - 1 ? '#a0a0a0' : '#f2f2f2',
                                  borderRadius: '4px',
                                  cursor: unifiedIndex === sortedElements.length - 1 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                data-tooltip-id="move-text-down-tooltip"
                                data-tooltip-content={t('moveTextDown', lang)}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    e.currentTarget.style.background = '#3a3a3a';
                                    e.currentTarget.style.borderColor = '#8a2be2';
                                  }
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    e.currentTarget.style.background = '#2c2c2c';
                                    e.currentTarget.style.borderColor = '#3a3a3a';
                                  }
                                }}
                              >
                                <ChevronDown size={12} />
                              </button>
                              {/* Move Up Button - Icon Only */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (unifiedIndex > 0) {
                                    handleZOrderChange(element.id, 'backward');
                                  }
                                }}
                                disabled={unifiedIndex === 0}
                                aria-label={t('moveReadingUp', lang) || 'Move Up'}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: unifiedIndex === 0 ? '#252525' : '#2c2c2c',
                                  border: '1px solid #3a3a3a',
                                  color: unifiedIndex === 0 ? '#a0a0a0' : '#f2f2f2',
                                  borderRadius: '4px',
                                  cursor: unifiedIndex === 0 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                data-tooltip-id="move-text-up-tooltip"
                                data-tooltip-content={t('moveTextUp', lang)}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex > 0) {
                                    e.currentTarget.style.background = '#3a3a3a';
                                    e.currentTarget.style.borderColor = '#8a2be2';
                                  }
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex > 0) {
                                    e.currentTarget.style.background = '#2c2c2c';
                                    e.currentTarget.style.borderColor = '#3a3a3a';
                                  }
                                }}
                              >
                                <ChevronUp size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Compact 2-Column Element Settings */}
                          {!isCollapsed && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {/* Combined Text + Color Input */}
                              <div className="setting-row">
                                <label 
                                  htmlFor={`text-input-${element.id}`} 
                                  style={{ fontSize: '11px', cursor: 'help' }}
                                  data-tooltip-id={`text-tooltip-${element.id}`}
                                  data-tooltip-content={t('tooltipText', lang)}
                                >
                                  {t('text', lang)}
                                </label>
                                <Tooltip id={`text-tooltip-${element.id}`} />
                                <CombinedTextColorInput
                                  id={`text-input-${element.id}`}
                                  text={data.text}
                                  onTextChange={(text) => {
                                    if (!activePresetId) return;
                                    const sanitized = sanitizeText(text);
                                    updateElement(element.id, (el) => ({
                                      ...el,
                                      data: { ...(el.data as TextElementData), text: sanitized }
                                    }));
                                  }}
                                  color={data.textColor || '#ffffff'}
                                  onColorChange={(color) => {
                                    if (!activePresetId) return;
                                    updateElement(element.id, (el) => ({
                                      ...el,
                                      data: { ...(el.data as TextElementData), textColor: color }
                                    }));
                                  }}
                                  placeholder={t('textInputPlaceholder', lang)}
                                  maxLength={120}
                                  sanitizeText={sanitizeText}
                                  colorTooltipContent={t('tooltipColor', lang)}
                                />
                              </div>

                              {/* 2-Column Grid for other fields */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {/* Row 1: Size | Angle */}
                                <OverlayField
                                  type="number"
                                  label={t('size', lang)}
                                  value={data.textSize}
                                  onChange={(value) => {
                                    if (!activePresetId) return;
                                    updateElement(element.id, (el) => ({
                                      ...el,
                                      data: { ...(el.data as TextElementData), textSize: Math.max(6, value) }
                                    }));
                                  }}
                                  step={1}
                                  min={6}
                                  labelTooltipId={`text-size-tooltip-${element.id}`}
                                  labelTooltipContent={t('tooltipSize', lang)}
                                />
                                <OverlayField
                                  type="number"
                                  label={t('angle', lang)}
                                  value={element.angle ?? 0}
                                  onChange={(value) => {
                                    if (!activePresetId) return;
                                    updateElement(element.id, (el) => ({
                                      ...el,
                                      angle: value
                                    }));
                                  }}
                                  step={1}
                                  min={0}
                                  max={360}
                                  labelTooltipId={`text-angle-tooltip-${element.id}`}
                                  labelTooltipContent={t('tooltipAngle', lang)}
                                />

                                {/* Row 2: X Off | Y Off */}
                                <OverlayField
                                  type="number"
                                  label={t('customXOffset', lang)}
                                  value={element.x}
                                  onChange={(value) => {
                                    if (!activePresetId) return;
                                    updateElement(element.id, (el) => ({
                                      ...el,
                                      x: value
                                    }));
                                  }}
                                step={1}
                                labelTooltipId={`text-xoffset-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipXOffset', lang)}
                              />
                              <OverlayField
                                type="number"
                                label={t('customYOffset', lang)}
                                value={element.y}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    y: value
                                  }));
                                }}
                                  step={1}
                                  labelTooltipId={`text-yoffset-tooltip-${element.id}`}
                                  labelTooltipContent={t('tooltipYOffset', lang)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } else if (element.type === 'divider') {
                      const data = element.data as DividerElementData;
                      const dividerIndex = dividerElements.findIndex(el => el.id === element.id);
                      
                      const dividerLabels = [
                        t('firstDivider', lang),
                        t('secondDivider', lang),
                        t('thirdDivider', lang),
                        t('fourthDivider', lang),
                      ];

                      const isCollapsed = collapsedElements.has(element.id);
                      const isSelected = effectiveSelectedElementId === element.id;
                      
                      return (
                        <div 
                          key={element.id} 
                          className={isSelected ? 'overlay-element-item selected' : 'overlay-element-item'}
                          onClick={() => setSelectedElementId(element.id)}
                          style={{ 
                            padding: '8px',
                            background: '#242424',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.6)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Compact Element Header */}
                          <div
                            onClick={() => handleSelectionChange(element.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              height: '36px',
                              marginBottom: isCollapsed ? '0' : '8px',
                              paddingBottom: isCollapsed ? '0' : '8px',
                              borderBottom: isCollapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                              background: '#262626',
                              borderRadius: '4px',
                              padding: '0 4px',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCollapse(element.id);
                                }}
                                aria-label={isCollapsed ? t('expand', lang) || 'Expand' : t('collapse', lang) || 'Collapse'}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#a0a0a0',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '2px',
                                  transition: 'transform 0.15s ease',
                                  transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                                }}
                              >
                                <ChevronDown size={14} />
                              </button>
                              <span style={{ color: '#f2f2f2', fontSize: '13px', fontWeight: 600 }}>
                                {dividerLabels[dividerIndex] || `${dividerIndex + 1}${dividerIndex === 0 ? 'st' : dividerIndex === 1 ? 'nd' : dividerIndex === 2 ? 'rd' : 'th'} ${t('divider', lang)}`}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {/* Remove Button - Outline Style with Red Icon */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  setRemoveModalState({
                                    isOpen: true,
                                    elementId: element.id,
                                    elementType: element.type,
                                  });
                                }}
                                data-tooltip-id={`delete-element-${element.id}`}
                                data-tooltip-content={t('deleteElement', lang)}
                                aria-label={t('deleteElement', lang)}
                                title={t('deleteElement', lang)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: 'transparent',
                                  border: '1px solid #3a3a3a',
                                  color: '#ff6b6b',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.currentTarget.style.borderColor = '#ff6b6b';
                                  e.currentTarget.style.background = '#3a1f1f';
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.currentTarget.style.borderColor = '#3a3a3a';
                                  e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                <X size={12} />
                              </button>
                              {/* Move Down Button - Icon Only */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    handleZOrderChange(element.id, 'forward');
                                  }
                                }}
                                disabled={unifiedIndex === sortedElements.length - 1}
                                aria-label={t('moveReadingDown', lang) || t('moveTextDown', lang) || t('moveDividerDown', lang) || 'Move Down'}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: unifiedIndex === sortedElements.length - 1 ? '#252525' : '#2c2c2c',
                                  border: '1px solid #3a3a3a',
                                  color: unifiedIndex === sortedElements.length - 1 ? '#a0a0a0' : '#f2f2f2',
                                  borderRadius: '4px',
                                  cursor: unifiedIndex === sortedElements.length - 1 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                data-tooltip-id="move-divider-down-tooltip"
                                data-tooltip-content={t('moveDividerDown', lang)}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    e.currentTarget.style.background = '#3a3a3a';
                                    e.currentTarget.style.borderColor = '#8a2be2';
                                  }
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex < sortedElements.length - 1) {
                                    e.currentTarget.style.background = '#2c2c2c';
                                    e.currentTarget.style.borderColor = '#3a3a3a';
                                  }
                                }}
                              >
                                <ChevronDown size={12} />
                              </button>
                              {/* Move Up Button - Icon Only */}
                              <button
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (unifiedIndex > 0) {
                                    handleZOrderChange(element.id, 'backward');
                                  }
                                }}
                                disabled={unifiedIndex === 0}
                                aria-label={t('moveReadingUp', lang) || 'Move Up'}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  background: unifiedIndex === 0 ? '#252525' : '#2c2c2c',
                                  border: '1px solid #3a3a3a',
                                  color: unifiedIndex === 0 ? '#a0a0a0' : '#f2f2f2',
                                  borderRadius: '4px',
                                  cursor: unifiedIndex === 0 ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease',
                                  padding: '0',
                                }}
                                data-tooltip-id="move-divider-up-tooltip"
                                data-tooltip-content={t('moveDividerUp', lang)}
                                onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex > 0) {
                                    e.currentTarget.style.background = '#3a3a3a';
                                    e.currentTarget.style.borderColor = '#8a2be2';
                                  }
                                }}
                                onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                                  if (unifiedIndex > 0) {
                                    e.currentTarget.style.background = '#2c2c2c';
                                    e.currentTarget.style.borderColor = '#3a3a3a';
                                  }
                                }}
                              >
                                <ChevronUp size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Compact 2-Column Element Settings */}
                          {!isCollapsed && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              {/* Row 1: Color | Width */}
                              <OverlayField
                                type="color"
                                label={t('color', lang)}
                                value={data.color}
                                onChange={(color) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    data: { ...(el.data as DividerElementData), color }
                                  }));
                                }}
                                labelTooltipId={`divider-color-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipColor', lang)}
                              />
                              <OverlayField
                                type="number"
                                label={t('thickness', lang) || 'Width'}
                                value={data.width}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    data: { ...(el.data as DividerElementData), width: Math.max(1, Math.min(400, value)) }
                                  }));
                                }}
                                step={1}
                                min={1}
                                max={400}
                                labelTooltipId={`thickness-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipThickness', lang)}
                              />

                              {/* Row 2: Height | Angle */}
                              <OverlayField
                                type="number"
                                label={t('dividerLength', lang) || 'Length'}
                                value={data.height}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    data: { ...(el.data as DividerElementData), height: Math.max(10, Math.min(640, value)) }
                                  }));
                                }}
                                step={1}
                                min={10}
                                max={640}
                                labelTooltipId={`divider-length-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipDividerLength', lang)}
                              />
                              <OverlayField
                                type="number"
                                label={t('angle', lang)}
                                value={element.angle ?? 0}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    angle: value
                                  }));
                                }}
                                  step={1}
                                  min={0}
                                  max={360}
                                  labelTooltipId={`divider-angle-tooltip-${element.id}`}
                                  labelTooltipContent={t('tooltipAngle', lang)}
                                />

                                {/* Row 3: X Off | Y Off */}
                                <OverlayField
                                  type="number"
                                  label={t('customXOffset', lang)}
                                  value={element.x}
                                  onChange={(value) => {
                                    if (!activePresetId) return;
                                    updateElement(element.id, (el) => ({
                                      ...el,
                                      x: value
                                    }));
                                  }}
                                step={1}
                                labelTooltipId={`divider-xoffset-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipXOffset', lang)}
                              />
                              <OverlayField
                                type="number"
                                label={t('customYOffset', lang)}
                                value={element.y}
                                onChange={(value) => {
                                  if (!activePresetId) return;
                                  updateElement(element.id, (el) => ({
                                    ...el,
                                    y: value
                                  }));
                                }}
                                step={1}
                                labelTooltipId={`divider-yoffset-tooltip-${element.id}`}
                                labelTooltipContent={t('tooltipYOffset', lang)}
                              />
                            </div>
                          )}
                        </div>
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
                    {t('overlayExportButton', lang)}
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
                    {t('overlayImportButton', lang)}
                  </button>
                </div>
                {/* Clear Runtime Elements Button */}
                {/* FAZ-4-3 HOTFIX: Legacy getElementCountForPreset removed - using vNext state */}
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
                    {t('clearAllOverlayElements', lang) || 'Clear All Overlay Elements'}
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
                  {t('overlayFooterDescription', lang)}
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
                // FAZ-3B-1: Use new runtime system if feature flag is enabled
                if (stateManager && runtimeState) {
                  const action = createRemoveElementAction(removeModalState.elementId, runtimeState);
                  stateManager.dispatch(action);
                  // FAZ-4-4C: Dev logging for remove operation
                  if (IS_DEV) {
                    // FAZ-4 FINAL: Element removal logging removed (production cleanup)
                  }
                } else {
                  if (IS_DEV) {
                    console.warn('[OverlaySettings] Remove element called but vNext not available');
                  }
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
