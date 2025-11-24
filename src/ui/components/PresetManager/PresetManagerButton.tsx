/**
 * Preset Manager Button with Quick Favorites Dropdown
 * 
 * Features:
 * - Button text: "Preset Manager"
 * - Chevron icon (when favorites exist): Shows quick favorites dropdown on click
 * - Click: Opens full Preset Manager
 * - Glow animation on preset apply
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, ChevronDown } from 'lucide-react';
import type { Lang } from '../../../i18n';
import { t } from '../../../i18n';
import type { AppSettings } from '../../../constants/defaults';
import { 
  getPresets, 
  setActivePresetId as setActivePresetIdStorage,
  type StoredPreset 
} from '../../../preset/storage';
import { isFavorite } from '../../../preset/storage';
import { loadPreset } from '@/state/overlayRuntime';

export interface PresetManagerButtonProps {
  lang: Lang;
  onOpenManager: () => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  setMediaUrl: (url: string) => void;
  settings?: AppSettings; // Optional: current settings to preserve overlay mode
  activePresetId: string | null;
}

export default function PresetManagerButton({
  lang,
  onOpenManager,
  setSettings,
  setMediaUrl,
  settings,
  activePresetId,
}: PresetManagerButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get favorite presets
  const favoritePresets = getPresets().filter(p => isFavorite(p));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handlePresetApply = async (preset: StoredPreset) => {
    // CRITICAL: Disable autosave during preset apply to prevent loops
    if (typeof window !== 'undefined') {
      window.__disableAutosave = true;
    }

    // CRITICAL: settings prop null check
    if (!settings) {
      console.error('[PresetManagerButton] CRITICAL: settings prop is null, cannot apply preset');
      alert('Settings not available. Please try again.');
      return;
    }

    // CRITICAL: Preset switch order (deterministic):
    // 1. Set active preset ID (storage + event dispatch)
    // 2. Load overlay elements from preset into runtime Map
    // 3. Load global config from preset (overlay.mode only, elements always empty)
    // 4. Load media URL from preset
    // 5. Re-enable autosave after delay

    // Overlay mode: preset dosyasından gelmeli, yoksa mevcut mode korunmalı
    const overlayModeFromPreset = preset.preset.overlay?.mode;
    const preservedOverlayMode = overlayModeFromPreset || settings.overlay?.mode || 'none';

    // Step 1: Set active preset ID (storage + event dispatch)
    setActivePresetIdStorage(preset.id);

    // Step 2: Load overlay elements from preset into runtime Map
    // CRITICAL: This must happen BEFORE setSettings to ensure useOverlayConfig reads correct elements
    const presetElements = preset.preset.overlay?.elements;
    const loadedCount = loadPreset(preset.id, presetElements);
    
    if (typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true) {
      console.log('[PresetManagerButton] Preset switch:', preset.id, 'elements loaded:', loadedCount, 'media:', preset.preset.background.url);
    }

    // Step 3 & 4: Wait 100ms then load settings and media URL
    // This ensures loadPreset completes and runtime is updated before settings change
    setTimeout(() => {
      // Step 3: Load global config from preset
      setSettings({
        ...preset.preset.background.settings,
        overlay: {
          mode: preservedOverlayMode,
          elements: [], // ALWAYS empty - elements are in runtime state, not in preset files
        },
        showGuide: preset.preset.misc?.showGuide,
      });

      // Step 4: Load media URL from preset
      setMediaUrl(preset.preset.background.url);
    }, 100);

    // Close dropdown
    setIsDropdownOpen(false);

    // Trigger glow animation
    setIsGlowing(true);
    setTimeout(() => {
      setIsGlowing(false);
    }, 500);

    // Step 5: Re-enable autosave after 500ms (allows loadPreset + setSettings to complete)
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.__disableAutosave = false;
      }
    }, 500);
  };

  const handleButtonClick = () => {
    setIsDropdownOpen(false);
    onOpenManager();
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent button click
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <motion.button
        className="preset-profiles-button"
        onClick={handleButtonClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        title={t('presetManager', lang)}
        style={{
          boxShadow: isGlowing 
            ? '0 0 20px rgba(138, 43, 226, 0.6), 0 0 40px rgba(138, 43, 226, 0.4)' 
            : 'none',
          transition: 'box-shadow 0.5s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span>{t('presetManager', lang)}</span>
        {favoritePresets.length > 0 && (
          <ChevronDown
            size={14}
            onClick={handleChevronClick}
            style={{
              cursor: 'pointer',
              flexShrink: 0,
              opacity: 0.7,
              transition: 'opacity 0.15s ease, transform 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && favoritePresets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              minWidth: '200px',
              background: '#1f1f1f',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              overflow: 'hidden',
            }}
          >
            {/* Favorite presets list */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {favoritePresets.map((preset) => {
                const isActive = preset.id === activePresetId;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetApply(preset)}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      borderBottom: '1px solid #2a2a2a',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2a2a2a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      <Star size={14} fill="#fbbf24" color="#fbbf24" style={{ flexShrink: 0 }} />
                      <span style={{ 
                        fontSize: '13px', 
                        color: '#e5e5e5',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {preset.name}
                      </span>
                    </div>
                    {isActive && (
                      <span style={{
                        fontSize: '11px',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flexShrink: 0,
                      }}>
                        <Check size={12} />
                        {t('activeLabel', lang)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Open Preset Manager link */}
            <div
              onClick={handleButtonClick}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderTop: '1px solid #2a2a2a',
                fontSize: '12px',
                color: '#9CA3AF',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2a2a2a';
                e.currentTarget.style.color = '#e5e5e5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
              }}
            >
              {t('openPresetManager', lang)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

