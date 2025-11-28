/**
 * Preset Manager Component
 * 
 * Main component for managing presets (drawer/modal).
 * Provides full preset management interface.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, Settings, Plus } from 'lucide-react';
import { 
  getPresets, 
  getPresetById,
  addPreset, 
  updatePreset, 
  deletePreset, 
  duplicatePreset,
  setActivePresetId as setActivePresetIdStorage,
  presetNameExists,
  generateUniquePresetName,
  type StoredPreset
} from '../../../preset/storage';
import { exportPreset, importPreset, type ImportResult } from '../../../preset';
import type { AppSettings } from '../../../constants/defaults';
import type { Lang } from '../../../i18n';
import { t } from '../../../i18n';
import PresetList from './PresetList';
import ExportNameModal from './ExportNameModal';
import ImportConflictModal from './ImportConflictModal';
// FAZ-4-3: Legacy loadPreset deleted - using applyPresetToRuntimeAndSettings instead
import { applyPresetToRuntimeAndSettings } from '../../utils/applyPreset';
import './PresetManager.css';

export interface PresetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
  mediaUrl: string;
  setMediaUrl: (url: string) => void;
  activePresetId: string | null;
}

export default function PresetManager({
  isOpen,
  onClose,
  lang,
  settings,
  setSettings,
  mediaUrl,
  setMediaUrl,
  activePresetId,
}: PresetManagerProps) {
  const [presets, setPresets] = useState<StoredPreset[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [conflictPresetName, setConflictPresetName] = useState('');
  const [conflictPreset, setConflictPreset] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load presets
  useEffect(() => {
    if (isOpen) {
      loadPresets();
    }
  }, [isOpen]);

  // Listen to storage changes for presets list (cross-tab sync)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'nzxtPresets') {
        loadPresets();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loadPresets = () => {
    setPresets(getPresets());
  };

  const handleApply = (preset: StoredPreset) => {
    // CRITICAL: Disable autosave during preset apply to prevent loops
    if (typeof window !== 'undefined') {
      window.__disableAutosave = true;
    }

    // CRITICAL: Preset switch order (deterministic):
    // 1. Set active preset ID (storage + event dispatch)
    // 2. Load overlay elements from preset into runtime Map
    // 3. Load global config from preset (overlay.mode only, elements always empty)
    // 4. Load media URL from preset
    // 5. Re-enable autosave after delay

    // Overlay mode: preset dosyasından gelmeli, yoksa mevcut mode korunmalı
    // Note: preservedOverlayMode is handled by applyPresetToRuntimeAndSettings

    // FAZ-4-3: Legacy loadPreset removed - use applyPresetToRuntimeAndSettings instead
    // Step 1: Set active preset ID (storage + event dispatch)
    setActivePresetIdStorage(preset.id);
    
    // Step 2: Apply preset using vNext system
    applyPresetToRuntimeAndSettings(preset, setSettings, setMediaUrl, { autosaveDelayMs: 700 });
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleExportConfirm = async (presetName: string) => {
    try {
      // FAZ 9: Pass activePresetId to read overlay elements from storage/runtime
      await exportPreset(settings, mediaUrl, presetName, undefined, activePresetId);
      
      // Add to preset list
      const { createPresetFromState } = await import('../../../preset/index');
      // FAZ 9: Read elements from storage/runtime for createPresetFromState
      let overlayElements: any[] = [];
      if (activePresetId) {
        const storedPreset = getPresetById(activePresetId);
        if (storedPreset?.preset?.overlay?.elements) {
          overlayElements = storedPreset.preset.overlay.elements;
        } else {
          // FAZ-4-3: Legacy getElementsForPreset removed - elements come from vNext state
          // For export, use vNext export system instead
          overlayElements = [];
        }
      }
      const presetFile = createPresetFromState(settings, mediaUrl, presetName, overlayElements);
      
      const newPreset: StoredPreset = {
        id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: presetName,
        preset: presetFile,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addPreset(newPreset);
      loadPresets();
    } catch (error) {
      alert(t('presetExportError', lang));
    }
  };

  const handleNewPreset = async () => {
    // FAZ-10: Create completely empty preset
    const { DEFAULT_PRESET_FILE } = await import('../../../preset/storage');
    const now = new Date().toISOString();
    
    const newPreset: StoredPreset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: generateUniquePresetName('New Preset'),
      preset: {
        ...DEFAULT_PRESET_FILE,
        presetName: 'New Preset',
      },
      isDefault: false,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };
    
    addPreset(newPreset);
    loadPresets();
    
    // Apply the new preset immediately
    handleApply(newPreset);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result: ImportResult = await importPreset(file, lang);
      
      // Check if import was successful
      if (!result.success) {
        // Build error message from errors
        const errorMessages = result.errors?.map(err => err.userMessage || err.message).join('\n') || t('presetImportError', lang);
        alert(errorMessages);
        return;
      }

      // Check if we have required data
      // NOTE: mediaUrl can be an empty string ('') for local/no-media presets.
      if (!result.preset || !result.settings || typeof result.mediaUrl !== 'string') {
        alert(t('presetImportError', lang));
        return;
      }

      // Non-blocking warning for presets that use local media
      const usesLocalMedia =
        result.settings.sourceType === 'local' ||
        (result.preset.background as any)?.source?.type === 'local';
      if (usesLocalMedia) {
        alert(t('localMediaImportWarning', lang));
      }

      const presetName = result.preset.presetName || `Preset ${new Date().toISOString().slice(0, 10)}`;
      
      // Show warnings if any
      if (result.warnings && result.warnings.length > 0) {
        // Optionally show warnings to user (non-blocking)
        // Could show a toast or modal here
      }

      // Show normalization changes if any
      if (result.normalizationChanges && result.normalizationChanges.length > 0) {
        const changeMessages = result.normalizationChanges.map(c => 
          `${c.field}: ${c.oldValue} → ${c.newValue}`
        ).join('\n');
        console.info('[PresetManager] Normalization changes:', changeMessages);
        // Optionally inform user about changes
      }
      
      // Check for conflict
      if (presetNameExists(presetName)) {
        setConflictPresetName(presetName);
        setConflictPreset(result.preset);
        setIsConflictModalOpen(true);
      } else {
        // No conflict, add directly
        const newPreset: StoredPreset = {
          id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: presetName,
          preset: result.preset,
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addPreset(newPreset);
        loadPresets();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : t('presetImportError', lang));
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConflictOverwrite = () => {
    if (!conflictPreset) return;
    
    const existingPresets = getPresets();
    const existing = existingPresets.find(p => p.name === conflictPresetName);
    
    if (existing) {
      updatePreset(existing.id, {
        preset: conflictPreset,
        updatedAt: new Date().toISOString(),
      });
      loadPresets();
    }
    
    setIsConflictModalOpen(false);
    setConflictPreset(null);
    setConflictPresetName('');
  };

  const handleConflictDuplicate = () => {
    if (!conflictPreset) return;
    
    const uniqueName = generateUniquePresetName(conflictPresetName);
    const newPreset: StoredPreset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: uniqueName,
      preset: conflictPreset,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    addPreset(newPreset);
    loadPresets();
    
    setIsConflictModalOpen(false);
    setConflictPreset(null);
    setConflictPresetName('');
  };

  const handleRename = (preset: StoredPreset) => {
    // Rename is now handled inline in PresetList component
    const trimmed = preset.name.trim();
    if (trimmed && !presetNameExists(trimmed, preset.id)) {
      updatePreset(preset.id, { name: trimmed });
      loadPresets();
    }
  };

  const handleDuplicate = (preset: StoredPreset) => {
    duplicatePreset(preset.id);
    loadPresets();
  };

  const handleDelete = (preset: StoredPreset) => {
    if (window.confirm(t('presetDeleteConfirm', lang).replace('{name}', preset.name))) {
      deletePreset(preset.id);
      loadPresets();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };

  return (
    <>
      {/* Modals - rendered outside drawer to appear in center of viewport */}
      <ExportNameModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExportConfirm}
        lang={lang}
      />

      <ImportConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => {
          setIsConflictModalOpen(false);
          setConflictPreset(null);
          setConflictPresetName('');
        }}
        onOverwrite={handleConflictOverwrite}
        onDuplicate={handleConflictDuplicate}
        presetName={conflictPresetName}
        lang={lang}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="preset-manager-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            {/* Drawer */}
            <motion.div
              className="preset-manager-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onKeyDown={handleKeyDown}
            >
              <div className="preset-manager-header">
                <div className="preset-manager-title">
                  <Settings size={20} />
                  <h2>{t('presetManager', lang)}</h2>
                </div>
                <button
                  className="preset-manager-close"
                  onClick={onClose}
                  aria-label={t('close', lang)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="preset-manager-actions">
                {/* FAZ-10: New Preset button */}
                <button
                  className="preset-manager-action-btn"
                  onClick={handleNewPreset}
                >
                  <Plus size={16} />
                  <span>{t('createPreset', lang) || 'Create Preset'}</span>
                </button>
                <button
                  className="preset-manager-action-btn"
                  onClick={handleExport}
                >
                  <Download size={16} />
                  <span>{t('presetExport', lang)}</span>
                </button>
                <button
                  className="preset-manager-action-btn"
                  onClick={handleImport}
                >
                  <Upload size={16} />
                  <span>{t('presetImport', lang)}</span>
                </button>
              </div>

              <div className="preset-manager-content">
                <PresetList
                  presets={presets}
                  activePresetId={activePresetId}
                  onApply={handleApply}
                  onRename={handleRename}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  lang={lang}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept=".nzxt-esc-preset"
        onChange={handleImportFile}
        style={{ display: 'none' }}
        aria-label={t('presetImport', lang)}
      />

    </>
  );
}

