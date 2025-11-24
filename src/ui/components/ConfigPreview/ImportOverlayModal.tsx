/**
 * Import Overlay Modal
 * 
 * Modal for choosing Replace/Append mode after successful file import.
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import type { OverlayElement } from '../../../types/overlay';
import type { Lang } from '../../../i18n';
import type { AppSettings } from '../../../constants/defaults';
import { t } from '../../../i18n';
import { MAX_OVERLAY_ELEMENTS, canAddElements, getTotalElementCount } from '../../../utils/overlaySettingsHelpers';
import '../PresetManager/PresetManager.css';

export interface ImportOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (elements: OverlayElement[], mode: 'replace' | 'append') => void;
  importedElements: OverlayElement[];
  currentElementCount: number;
  activePresetId: string | null;
  settings: AppSettings;
  lang: Lang;
}

export default function ImportOverlayModal({
  isOpen,
  onClose,
  onImport,
  importedElements,
  currentElementCount,
  activePresetId,
  settings,
  lang,
}: ImportOverlayModalProps) {
  // Handle ESC and ENTER keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      } else if (e.key === 'Enter' && isOpen) {
        // FAZ-10: ENTER triggers primary action (Replace)
        e.preventDefault();
        handleReplace();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Handle Replace button click
  // GLOBAL HARD LIMIT: Replace mode truncates to available slots
  const handleReplace = () => {
    if (importedElements.length === 0) return;
    
    // Truncate to MAX_OVERLAY_ELEMENTS if needed
    const truncatedElements = importedElements.slice(0, MAX_OVERLAY_ELEMENTS);
    if (truncatedElements.length < importedElements.length) {
      const message = t('overlayMaxElementsWarning', lang)
        .replace('{max}', String(MAX_OVERLAY_ELEMENTS))
        .replace('{count}', String(importedElements.length - truncatedElements.length));
      alert(message);
    }
    
    onImport(truncatedElements, 'replace');
    onClose();
  };

  // Handle Append button click
  // GLOBAL HARD LIMIT: Append mode checks total (preset manual + runtime imported)
  const handleAppend = () => {
    if (importedElements.length === 0) return;
    
    // Check global limit: preset manual + runtime imported + new elements
    // Use activePresetId to get current total
    const currentTotal = getTotalElementCount(activePresetId);
    
    // Use deprecated canAddElements for backward compatibility (it uses runtime count internally)
    if (!canAddElements(settings, currentElementCount, importedElements.length)) {
      const availableSlots = MAX_OVERLAY_ELEMENTS - currentTotal;
      const message = t('overlayMaxElementsWarning', lang)
        .replace('{max}', String(MAX_OVERLAY_ELEMENTS))
        .replace('{count}', String(importedElements.length - availableSlots));
      alert(message);
      return; // Don't close modal, just show warning
    }
    
    onImport(importedElements, 'append');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="preset-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="preset-import-conflict-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            tabIndex={-1}
          >
            <div className="preset-modal-header">
              <div className="preset-conflict-header-content">
                <Upload size={20} className="preset-conflict-icon" />
                <h3>{t('overlayImportModalTitle', lang)}</h3>
              </div>
              <button
                className="preset-modal-close"
                onClick={onClose}
                aria-label={t('close', lang)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="preset-modal-content">
              <p className="preset-conflict-message">
                {t('overlayImportModalDescription', lang)}
              </p>
            </div>

            <div className="preset-modal-actions">
              <button
                type="button"
                className="preset-modal-button preset-modal-button-secondary"
                onClick={onClose}
              >
                {t('cancel', lang)}
              </button>
              <button
                type="button"
                className="preset-modal-button preset-modal-button-primary"
                onClick={handleReplace}
              >
                {t('overlayImportReplace', lang)}
              </button>
              <button
                type="button"
                className="preset-modal-button preset-modal-button-primary"
                onClick={handleAppend}
              >
                {t('overlayImportAppend', lang)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

