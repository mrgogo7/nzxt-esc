/**
 * Reset Confirmation Modal
 * 
 * Modal for confirming reset of all element values to defaults.
 */

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import '../PresetManager/PresetManager.css';

export interface ResetConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lang: Lang;
  titleKey?: string;
  descriptionKey?: string;
  confirmButtonKey?: string;
}

export default function ResetConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  titleKey = 'resetElementsConfirmTitle',
  descriptionKey = 'resetElementsConfirm',
  confirmButtonKey = 'reset',
}: ResetConfirmationModalProps) {
  const t = useI18n();
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  }, [onClose, handleConfirm]);

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
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <div className="preset-modal-header">
              <div className="preset-conflict-header-content">
                <AlertTriangle size={20} className="preset-conflict-icon" />
                <h3>{t(titleKey)}</h3>
              </div>
              <button
                className="preset-modal-close"
                onClick={onClose}
                aria-label={t('close')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="preset-modal-content">
              <p className="preset-conflict-message">
                {t(descriptionKey)}
              </p>
            </div>

            <div className="preset-modal-actions">
              <button
                type="button"
                className="preset-modal-button preset-modal-button-secondary"
                onClick={onClose}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                className="preset-modal-button preset-modal-button-warning"
                onClick={handleConfirm}
              >
                {t(confirmButtonKey)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

