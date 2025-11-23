/**
 * Reset Confirm Modal
 * 
 * Modal for confirming reset operation before resetting preset to baseline.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import type { Lang } from '../../../i18n';
import { t } from '../../../i18n';
import '../PresetManager/PresetManager.css';

export interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  presetName: string;
  lang: Lang;
}

export default function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  presetName,
  lang,
}: ResetConfirmModalProps) {
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
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
            className="preset-export-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preset-modal-header">
              <div className="preset-conflict-header-content">
                <AlertTriangle size={20} className="preset-conflict-icon" />
                <h3>{t('resetConfirmTitle', lang)}</h3>
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
                {t('resetConfirmDescription', lang).replace('{name}', presetName)}
              </p>
            </div>

            <div className="preset-modal-actions">
              <button
                className="preset-modal-button preset-modal-button-secondary"
                onClick={onClose}
              >
                {t('resetCancelButton', lang)}
              </button>
              <button
                className="preset-modal-button preset-modal-button-primary"
                onClick={handleConfirm}
              >
                {t('resetConfirmButton', lang)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

