/**
 * YouTube Warning Modal
 * 
 * Modal for warning users that YouTube URLs are not supported.
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import type { Lang } from '../../../i18n';
import { t } from '../../../i18n';
import '../PresetManager/PresetManager.css';

export interface YouTubeWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}

export default function YouTubeWarningModal({
  isOpen,
  onClose,
  lang,
}: YouTubeWarningModalProps) {
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
                <h3>{t('youtubeNotSupportedTitle', lang)}</h3>
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
              <p className="preset-conflict-message" style={{ whiteSpace: 'pre-line' }}>
                {(() => {
                  const message = t('youtubeNotSupportedMessage', lang);
                  // Split message by "Pinterest" and render it as a link
                  const parts = message.split(/(Pinterest)/i);
                  return parts.map((part, index) => {
                    if (part.toLowerCase() === 'pinterest') {
                      return (
                        <a
                          key={index}
                          href="https://www.pinterest.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#8a2be2',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {part}
                        </a>
                      );
                    }
                    return <span key={index}>{part}</span>;
                  });
                })()}
              </p>
            </div>

            <div className="preset-modal-actions">
              <button
                className="preset-modal-button preset-modal-button-primary"
                onClick={onClose}
                style={{ width: '100%' }}
              >
                {t('youtubeNotSupportedOk', lang)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

