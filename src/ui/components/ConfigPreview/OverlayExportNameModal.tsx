/**
 * Overlay Export Name Modal
 * 
 * Modal for entering overlay preset name before export.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import '../PresetManager/PresetManager.css';

export interface OverlayExportNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  lang: Lang;
  initialName?: string;
}

export default function OverlayExportNameModal({
  isOpen,
  onClose,
  onConfirm,
  lang,
  initialName = '',
}: OverlayExportNameModalProps) {
  const t = useI18n();
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      // Focus input after animation
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      onConfirm(trimmedName);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && name.trim()) {
      handleSubmit(e);
    }
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
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <div className="preset-modal-header">
              <h3>{t('overlayExportTitle')}</h3>
              <button
                className="preset-modal-close"
                onClick={onClose}
                aria-label={t('close')}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="preset-modal-content">
                <label htmlFor="overlay-export-name-input" className="preset-modal-label">
                  {t('overlayExportNameLabel')}
                </label>
                <input
                  id="overlay-export-name-input"
                  ref={inputRef}
                  type="text"
                  className="preset-modal-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('overlayExportNamePlaceholder')}
                  maxLength={50}
                  autoFocus
                />
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
                  type="submit"
                  className="preset-modal-button preset-modal-button-primary"
                  disabled={!name.trim()}
                >
                  {t('export')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

