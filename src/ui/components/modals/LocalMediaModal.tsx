import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import '../PresetManager/PresetManager.css';

const MAX_FILE_SIZE_BYTES = 150 * 1024 * 1024; // 150 MB

interface LocalMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile: (file: File) => Promise<void> | void;
  lang: Lang;
}

export default function LocalMediaModal({
  isOpen,
  onClose,
  onSelectFile,
}: LocalMediaModalProps) {
  const t = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setError(null);
    setSelectedFile(null);

    if (!file) return;

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(t('localMediaFileTooLarge'));
      return;
    }

    // Validate type (basic check by extension + mime)
    const name = file.name.toLowerCase();
    const mime = file.type || '';
    const isSupportedExtension =
      name.endsWith('.jpg') ||
      name.endsWith('.jpeg') ||
      name.endsWith('.png') ||
      name.endsWith('.gif') ||
      name.endsWith('.mp4');

    const isSupportedMime =
      mime.startsWith('image/') || mime === 'video/mp4' || mime.startsWith('video/');

    if (!isSupportedExtension && !isSupportedMime) {
      setError(t('localMediaUnsupportedType'));
      return;
    }

    setSelectedFile(file);
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      setError(t('localMediaNoFileSelected'));
      return;
    }

    try {
      setIsSaving(true);
      await onSelectFile(selectedFile);
      setIsSaving(false);
      setSelectedFile(null);
      setError(null);
      onClose();
    } catch (err) {
      setIsSaving(false);
      setError(
        err instanceof Error
          ? err.message
          : t('localMediaSaveFailed')
      );
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preset-modal-header">
              <h3>{t('localMediaTitle')}</h3>
              <button
                className="preset-modal-close"
                onClick={onClose}
                disabled={isSaving}
                aria-label={t('close')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="preset-modal-content">
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#a0a0a0', lineHeight: '1.5' }}>
                {t('localMediaDescription')}
              </p>
              <p className="local-media-supported" style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#6b6b6b' }}>
                {t('localMediaSupportedFormats')}
              </p>

              <label htmlFor="local-media-file-input" className="preset-modal-label">
                {t('selectFile')}
              </label>
              <input
                id="local-media-file-input"
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.mp4,image/*,video/mp4,video/*"
                onChange={handleFileChange}
                className="preset-modal-input"
                style={{ marginBottom: '12px' }}
              />

              {selectedFile && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: '#2c2c2c',
                  border: '1px solid #3a3a3a',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#a0a0a0'
                }}>
                  <span style={{ color: '#f2f2f2', fontWeight: 500 }}>Selected: </span>
                  <span>{selectedFile.name}</span>
                </div>
              )}

              {error && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#fca5a5'
                }}>
                  {error}
                </div>
              )}
            </div>

            <div className="preset-modal-actions">
              <button
                type="button"
                className="preset-modal-button preset-modal-button-secondary"
                onClick={onClose}
                disabled={isSaving}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                className="preset-modal-button preset-modal-button-primary"
                onClick={handleConfirm}
                disabled={isSaving || !selectedFile}
              >
                {isSaving
                  ? t('saving')
                  : t('useMedia')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


