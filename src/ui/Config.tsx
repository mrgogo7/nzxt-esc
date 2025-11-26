import React, { useEffect, useState, useRef } from 'react';
import { LANG_KEY, Lang, t, getInitialLang, setLang } from '../i18n';
import ConfigPreview from './components/ConfigPreview';
import './styles/ConfigPreview.css';
import { DEFAULT_SETTINGS } from '../constants/defaults';
import { useMediaUrl } from '../hooks/useMediaUrl';
import { useConfig } from '../hooks/useConfig';
import { useOverlayConfig } from '../hooks/useOverlayConfig';
import { useAtomicPresetSync } from '../hooks/useAtomicPresetSync';
import ColorPicker from './components/ColorPicker';
import { X, Loader2, Check, FolderOpen } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';
import 'react-tooltip/dist/react-tooltip.css';
import './styles/tooltip.css';
import { normalizePinterestUrl, fetchPinterestMedia } from '../utils/pinterest';
import PresetManager from './components/PresetManager/PresetManager';
import PresetManagerButton from './components/PresetManager/PresetManagerButton';
import ResetConfirmModal from './components/modals/ResetConfirmModal';
import LocalMediaModal from './components/modals/LocalMediaModal';
// YouTubeWarningModal removed - YouTube is now supported
import { getMediaType } from '../utils/media';
import { saveLocalMedia, deleteLocalMedia } from '../storage/localMedia';
import { 
  ensureInitialActivePreset, 
  getActivePresetId, 
  getPresetById, 
  updatePreset,
  DEFAULT_PRESET_FILE 
} from '../preset/storage';
// FAZ-11: Import shared preset application utility
import { applyPresetToRuntimeAndSettings } from './utils/applyPreset';
import { APP_VERSION } from '../version';

export default function Config() {
  const [lang, setLangState] = useState<Lang>(getInitialLang());
  const { mediaUrl, setMediaUrl } = useMediaUrl();
  const { settings, setSettings } = useConfig();
  
  // CRITICAL: activePresetId single source of truth
  // Managed only in Config.tsx, passed as props to child components
  const [activePresetId, setActivePresetId] = useState<string | null>(() => {
    return getActivePresetId();
  });
  
  // Listen to activePresetId changes from localStorage (preset switches)
  // This ensures cross-tab sync and same-tab reactivity
  useEffect(() => {
    // Update on mount
    const currentId = getActivePresetId();
    setActivePresetId(currentId);
    
    // FAZ 7.1: Load ALL preset data on mount (F5 refresh)
    // CRITICAL: Disable autosave during initial load to prevent loops
    if (typeof window !== 'undefined') {
      window.__disableAutosave = true;
    }
    
    if (currentId) {
      const preset = getPresetById(currentId);
      if (preset) {
        // FAZ 8.1: Use helper function to apply preset (consolidates initial load and preset switch logic)
        const presetElements = preset.preset.overlay?.elements;
        if (typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true) {
          console.log('[Config] F5 refresh - loading preset:', currentId, 'elements:', presetElements?.length || 0, 'media:', preset.preset.background.url);
        }
        
        applyPresetToRuntimeAndSettings(preset, setSettings, setMediaUrl, { autosaveDelayMs: 700 });
      } else {
        // No preset found, re-enable autosave immediately
        if (typeof window !== 'undefined') {
          window.__disableAutosave = false;
        }
      }
    } else {
      // No active preset, re-enable autosave immediately
      if (typeof window !== 'undefined') {
        window.__disableAutosave = false;
      }
    }
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nzxtActivePresetId') {
        setActivePresetId(e.newValue);
        // FAZ 8.1: Load ALL preset data when preset changes via storage event
        if (e.newValue) {
          const preset = getPresetById(e.newValue);
          if (preset) {
            const presetElements = preset.preset.overlay?.elements;
            if (typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true) {
              console.log('[Config] Storage event - preset switch:', e.newValue, 'elements:', presetElements?.length || 0);
            }
            
            // Use helper function (700ms delay for preset switch)
            applyPresetToRuntimeAndSettings(preset, setSettings, setMediaUrl, { autosaveDelayMs: 700 });
          }
        }
      }
    };
    
    // CRITICAL: Also listen to custom event for same-tab changes
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ newValue: string | null; oldValue: string | null }>;
      const newId = customEvent.detail?.newValue;
      setActivePresetId(newId);
      // FAZ 8.1: Load ALL preset data when preset changes via custom event
      if (newId) {
        const preset = getPresetById(newId);
        if (preset) {
          const presetElements = preset.preset.overlay?.elements;
          if (typeof window !== 'undefined' && (window as any).__NZXT_ESC_DEBUG_RUNTIME === true) {
            console.log('[Config] Custom event - preset switch:', newId, 'elements:', presetElements?.length || 0);
          }
          
          // Use helper function (700ms delay for preset switch)
          applyPresetToRuntimeAndSettings(preset, setSettings, setMediaUrl, { autosaveDelayMs: 700 });
        }
      }
    };
    
    // Listen to storage events (cross-tab sync)
    window.addEventListener('storage', handleStorageChange);
    // Listen to custom events (same-tab changes)
    window.addEventListener('activePresetIdChanged', handleCustomChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activePresetIdChanged', handleCustomChange);
    };
  }, []);
  
  const overlayConfig = useOverlayConfig(settings, activePresetId);
  const [urlInput, setUrlInput] = useState<string>(mediaUrl);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveMessage, setResolveMessage] = useState<string | null>(null);
  const [isPresetManagerOpen, setIsPresetManagerOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLocalMediaModalOpen, setIsLocalMediaModalOpen] = useState(false);
  // isYouTubeWarningOpen removed - YouTube is now supported
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [autosaveState, setAutosaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const urlInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Sync urlInput with mediaUrl changes
  // CRITICAL: Preserve "Local: filename" display when in local mode
  useEffect(() => {
    // In local mode, urlInput must always show "Local: filename" (i18n)
    if (settings.sourceType === 'local' && settings.localFileName) {
      const prefix = t('localFileIndicator', lang).replace('{fileName}', settings.localFileName);
      setUrlInput(prefix);
      return; // Do not fall through to remote sync
    }

    // Remote mode / no local media: sync with mediaUrl
    setUrlInput(mediaUrl);
  }, [mediaUrl, settings.sourceType, settings.localFileName, lang]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node) &&
        urlInputRef.current &&
        !urlInputRef.current.contains(event.target as Node)
      ) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu]);

  // language sync listener
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_KEY && e.newValue) {
        setLangState(e.newValue as Lang);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // First-run: ensure default preset is active
  useEffect(() => {
    ensureInitialActivePreset();
  }, []);

  // Atomic preset sync: automatically save config state to active preset
  // CRITICAL: Pass only overlayMode, not full overlay config (prevents infinite loops)
  useAtomicPresetSync({
    settings,
    mediaUrl,
    overlayMode: overlayConfig.mode,
    activePresetId,
  });

  // Autosave feedback: show spinner → check → fade out
  const autosaveTimerRef = useRef<number | null>(null);
  const autosaveCheckTimerRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clean up any existing timers
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    if (autosaveCheckTimerRef.current) clearTimeout(autosaveCheckTimerRef.current);
    
    if (autosaveState === 'saving') {
      // Show check after 500ms
      autosaveTimerRef.current = setTimeout(() => {
        setAutosaveState('saved');
        // Fade out after 1.2 seconds
        autosaveCheckTimerRef.current = setTimeout(() => {
          setAutosaveState('idle');
        }, 1200);
      }, 500);
    }

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      if (autosaveCheckTimerRef.current) clearTimeout(autosaveCheckTimerRef.current);
    };
  }, [autosaveState]);

  // Show saving state when settings change (visual feedback only)
  const prevSettingsRef = useRef(settings);
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Skip first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSettingsRef.current = settings;
      return;
    }
    
    // Check if settings actually changed
    const hasChanged = JSON.stringify(prevSettingsRef.current) !== JSON.stringify(settings);
    if (hasChanged) {
      setAutosaveState('saving');
    }
    
    prevSettingsRef.current = settings;
  }, [settings]);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Lang;
    setLangState(newLang);
    setLang(newLang);
  };

  /**
   * Checks if URL is a direct media URL (ends with .mp4, .jpg, .gif, etc.)
   */
  const isDirectMediaUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim().toLowerCase();
    return /\.(mp4|webm|jpg|jpeg|png|gif|webp)($|\?)/i.test(trimmed);
  };

  /**
   * Validates if URL is a valid remote media URL.
   * Only accepts: jpg/jpeg/png/gif/mp4, YouTube, Pinterest.
   * Rejects: .webp, streaming URLs, and other formats.
   */
  const isValidRemoteMediaUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed) return false;

    // Check for direct media URLs (jpg, jpeg, png, gif, mp4 only - NO webp)
    const isDirectMedia = /\.(jpg|jpeg|png|gif|mp4)($|\?)/i.test(trimmed);
    if (isDirectMedia) return true;

    // Check for YouTube URLs
    if (getMediaType(trimmed) === 'youtube') return true;

    // Check for Pinterest URLs
    if (normalizePinterestUrl(trimmed)) return true;

    return false;
  };

  // Note: isYouTubeUrl function removed - now using isYouTubeUrl from utils/youtube.ts via getMediaType

  const handleSave = async () => {
    const trimmedUrl = urlInput.trim();
    
    // CRITICAL: Guard against saving when in local mode with "Local:" prefix
    // When sourceType === 'local', urlInput shows "Local: filename" or "Yerel: filename" for user visibility
    // We must not interpret this as a remote URL and switch modes
    if (settings.sourceType === 'local') {
      // Check if input starts with localized "Local:" prefix (en: "Local:", tr: "Yerel:")
      const localPrefix = t('localFileIndicator', lang).split('{fileName}')[0].trim();
      if (trimmedUrl.startsWith(localPrefix)) {
        // User is in local mode - Save button should not do anything
        // URL input shows "Local: filename" as read-only indicator
        return;
      }

      // Local mode but user typed a URL → validate and switch to remote mode
      if (isValidRemoteMediaUrl(trimmedUrl)) {
        // Delete IndexedDB local media record
        const presetId = settings.localMediaId || activePresetId || getActivePresetId();
        if (presetId) {
          deleteLocalMedia(presetId).catch((err) => {
            console.error('[Config] Failed to delete local media during remote switch:', err);
          });
        }

        // Reset settings to remote mode (transform will be reset in remote URL processing below)
        setSettings({
          ...settings,
          sourceType: 'remote',
          localFileName: undefined,
          localMediaId: undefined,
        });

        // Continue with remote URL processing below (will set mediaUrl and transform settings)
        // Fall through to normal remote URL handling
      } else {
        // Invalid URL in local mode - do nothing
        return;
      }
    }
    
    // If empty, clear and return (no reset needed for empty URL)
    if (!trimmedUrl) {
      // Empty URL input always means "no remote media"
      setMediaUrl('');
      // Do not touch local mode here; Update button is remote-only
      return;
    }

    // If it's a direct media URL (ends with .mp4, .jpg, .gif, etc.), save directly
    if (isDirectMediaUrl(trimmedUrl)) {
      setMediaUrl(trimmedUrl);
      // Reset background transforms after URL change
      const mediaType = getMediaType(trimmedUrl);
      setSettings({
        ...settings,
        sourceType: 'remote',
        localFileName: undefined,
        localMediaId: undefined,
        scale: 1,
        x: 0,
        y: 0,
        align: 'center',
        fit: mediaType === 'youtube' ? 'contain' : 'cover',
      });
      return;
    }

    // YouTube URLs are now accepted - save directly
    // YouTube detection and rendering is handled by getMediaType() and YouTubeRenderer
    // No special handling needed here - YouTube URLs are saved as-is like other URLs

    // Check if it's a Pinterest URL
    const normalizedPinterestUrl = normalizePinterestUrl(trimmedUrl);
    if (normalizedPinterestUrl) {
      // It's a Pinterest URL, resolve it
      setIsResolving(true);
      setResolveMessage(t('resolvingUrl', lang));

      // Timeout protection (25 seconds)
      const timeoutId = setTimeout(() => {
        setIsResolving(false);
        setResolveMessage(t('urlResolveTimeout', lang));
        setTimeout(() => setResolveMessage(null), 5000);
      }, 25000);

      try {
        const resolvedUrl = await fetchPinterestMedia(trimmedUrl);
        clearTimeout(timeoutId);

        if (resolvedUrl) {
          setMediaUrl(resolvedUrl);
          // Reset background transforms after Pinterest resolve
          const mediaType = getMediaType(resolvedUrl);
          setSettings({
            ...settings,
            sourceType: 'remote',
            localFileName: undefined,
            localMediaId: undefined,
            scale: 1,
            x: 0,
            y: 0,
            align: 'center',
            fit: mediaType === 'youtube' ? 'contain' : 'cover',
          });
          setResolveMessage(t('urlResolved', lang));
          setTimeout(() => {
            setIsResolving(false);
            setResolveMessage(null);
          }, 2000);
        } else {
          setIsResolving(false);
          setResolveMessage(t('urlResolveError', lang));
          setTimeout(() => setResolveMessage(null), 5000);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        setIsResolving(false);
        setResolveMessage(t('urlResolveError', lang));
        console.error('[Config] Pinterest URL resolution error:', error);
        setTimeout(() => setResolveMessage(null), 5000);
      }
    } else {
      // Not a Pinterest URL and not a direct media URL, save as-is (YouTube, etc.)
      setMediaUrl(trimmedUrl);
      // Reset background transforms after URL change
      const mediaType = getMediaType(trimmedUrl);
      setSettings({
        ...settings,
        sourceType: 'remote',
        localFileName: undefined,
        localMediaId: undefined,
        scale: 1,
        x: 0,
        y: 0,
        align: 'center',
        fit: mediaType === 'youtube' ? 'contain' : 'cover',
      });
    }
  };

  const handleClear = () => {
    // Local mode: delete local media record and reset to remote/empty
    if (settings.sourceType === 'local') {
      const presetId = settings.localMediaId || activePresetId || getActivePresetId();
      if (presetId) {
        // Fire and forget deletion; errors will surface via local media hook if needed
        deleteLocalMedia(presetId).catch((err) => {
          console.error('[Config] Failed to delete local media:', err);
        });
      }

      setSettings({
        ...settings,
        sourceType: 'remote',
        localFileName: undefined,
        localMediaId: undefined,
      });
      setMediaUrl('');
      setUrlInput('');
    } else {
      // Remote mode: keep existing behavior
      setMediaUrl('');
      setUrlInput('');
    }
    setIsResolving(false);
    setResolveMessage(null);
  };

  const handleBackgroundColorChange = (color: string) => {
    // Update background color in settings
    setSettings({ backgroundColor: color });
  };

  const handleReset = () => {
    // Open reset confirmation modal
    setIsResetModalOpen(true);
  };

  const handleResetConfirm = () => {
    // Get active preset ID
    const activePresetId = getActivePresetId();

    if (activePresetId) {
      // Reset active preset to baseline
      const baselinePreset = {
        ...DEFAULT_PRESET_FILE,
      };
      updatePreset(activePresetId, { preset: baselinePreset });
    }

    // Apply baseline to current state
    setMediaUrl('');
    setUrlInput('');
    
    // Reset settings to baseline (empty overlay, black background)
    setSettings({
      ...DEFAULT_SETTINGS,
      backgroundColor: '#000000',
      overlay: { mode: 'none', elements: [] },
    });
  };

  const handleLocalMediaSelect = async (file: File) => {
    const presetId = activePresetId || getActivePresetId();
    if (!presetId) {
      throw new Error('No active preset available for local media.');
    }

    // Save binary to IndexedDB (silent overwrite)
    await saveLocalMedia(file, presetId);

    // Switch to local source mode and clear remote URL
    setSettings({
      ...settings,
      sourceType: 'local',
      localFileName: file.name,
      localMediaId: presetId,
    });
    setMediaUrl('');
    // Show file name in input for user visibility (read-only indicator) with i18n
    const indicatorText = t('localFileIndicator', lang).replace('{fileName}', file.name);
    setUrlInput(indicatorText);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const menuWidth = 140;
    const menuHeight = 120;
    let x = e.clientX;
    let y = e.clientY;
    
    // Adjust position if menu would overflow viewport
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }
    
    setContextMenu({ x, y });
  };

  const handleCopy = () => {
    if (urlInputRef.current) {
      try {
        const textToCopy = urlInputRef.current.value;
        if (!textToCopy) {
          setContextMenu(null);
          return;
        }

        // Select the text first
        urlInputRef.current.select();
        urlInputRef.current.setSelectionRange(0, textToCopy.length);
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            setContextMenu(null);
          }).catch((err) => {
            console.error('Clipboard API failed, trying fallback:', err);
            // Fallback to execCommand
            try {
              const success = document.execCommand('copy');
              if (success) {
                setContextMenu(null);
              } else {
                console.error('execCommand copy failed');
                setContextMenu(null);
              }
            } catch (execErr) {
              console.error('execCommand copy error:', execErr);
              setContextMenu(null);
            }
          });
        } else {
          // Fallback to execCommand for older browsers
          try {
            const success = document.execCommand('copy');
            if (success) {
              setContextMenu(null);
            } else {
              console.error('execCommand copy failed');
              setContextMenu(null);
            }
          } catch (execErr) {
            console.error('execCommand copy error:', execErr);
            setContextMenu(null);
          }
        }
      } catch (err) {
        console.error('Failed to copy:', err);
        setContextMenu(null);
      }
    }
  };

  const handlePaste = () => {
    if (urlInputRef.current) {
      try {
        // Focus the input first
        urlInputRef.current.focus();
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then((text) => {
            setUrlInput(text);
            // Move cursor to end
            setTimeout(() => {
              urlInputRef.current?.setSelectionRange(text.length, text.length);
            }, 0);
            setContextMenu(null);
          }).catch((err) => {
            console.error('Clipboard API read failed, trying fallback:', err);
            // Fallback: try execCommand paste
            try {
              const success = document.execCommand('paste');
              if (!success) {
                // If execCommand fails, just keep focus for manual paste
                console.log('execCommand paste not available, input focused for manual paste');
              }
              setContextMenu(null);
            } catch (execErr) {
              console.error('execCommand paste error:', execErr);
              // Input is already focused, user can paste manually
              setContextMenu(null);
            }
          });
        } else {
          // Fallback: try execCommand paste
          try {
            const success = document.execCommand('paste');
            if (!success) {
              // If execCommand fails, just keep focus for manual paste
              console.log('execCommand paste not available, input focused for manual paste');
            }
            setContextMenu(null);
          } catch (execErr) {
            console.error('execCommand paste error:', execErr);
            // Input is already focused, user can paste manually
            setContextMenu(null);
          }
        }
      } catch (err) {
        console.error('Failed to paste:', err);
        // Input is already focused, user can paste manually
        urlInputRef.current?.focus();
        setContextMenu(null);
      }
    }
  };

  const handleSelectAll = () => {
    if (urlInputRef.current) {
      urlInputRef.current.select();
      setContextMenu(null);
    }
  };


  return (
    <div className="config-page">
      {/* top header */}
      <header className="config-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h1 className="config-title" style={{ margin: 0, fontSize: '20px', fontWeight: 700, lineHeight: '1.2' }}>
              NZXT Elite Screen Customizer v{APP_VERSION}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label className="lang-label" htmlFor="lang-select">
                {t("language", lang)}
              </label>
              <select
                id="lang-select"
                className="lang-select"
                value={lang}
                onChange={handleLangChange}
              >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="pt-BR">Português</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ fontSize: '12px', color: '#9aa3ad', fontWeight: 400, lineHeight: '1.2' }}>
              by Gokhan AKGUL (mRGogo)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <motion.button 
                className="reset-btn" 
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {t("reset", lang)}
              </motion.button>
              <PresetManagerButton
                lang={lang}
                onOpenManager={() => setIsPresetManagerOpen(true)}
                setSettings={setSettings}
                setMediaUrl={setMediaUrl}
                settings={settings}
                activePresetId={activePresetId}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a
                href="https://github.com/mrgogo7"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#bfc6d4', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#bfc6d4'}
                title={t('tooltipGitHub', lang)}
              >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23 1.957-.544 4.06-.544 6.13.205 2.12-1.552 3.168-1.23 3.168-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/mrgogo_/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#bfc6d4', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#bfc6d4'}
              title={t('tooltipInstagram', lang)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/gokhanakgul/?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3BI91N3P7USemf6aEYxYSnjA%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#bfc6d4', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#bfc6d4'}
              title={t('tooltipLinkedIn', lang)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://github.com/sponsors/mrgogo7"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#bfc6d4', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ea4aaa'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#bfc6d4'}
              title={t('tooltipSponsor', lang)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                <path d="M17.625 1.499c-2.32 0-4.354 1.203-5.625 3.03-1.271-1.827-3.305-3.03-5.625-3.03C3.129 1.499 0 4.253 0 8.249c0 4.275 3.068 7.847 5.828 10.227a33.14 33.14 0 0 0 5.616 3.876l.028.017.008.003-.001.003c.163.085.342.128.521.128.179 0 .358-.043.521-.128l-.001-.003.008-.003.028-.017a33.14 33.14 0 0 0 5.616-3.876C20.932 16.096 24 12.524 24 8.249c0-3.996-3.129-6.75-6.375-6.75zm-.919 15.275a30.766 30.766 0 0 1-4.703 3.316l-.004-.002-.004.002a30.955 30.955 0 0 1-4.703-3.316c-2.677-2.307-5.047-5.049-5.047-8.525 0-2.754 2.121-4.5 4.125-4.5 2.06 0 3.914 1.567 4.544 3.684.143.495.596.795 1.086.795.49 0 .943-.3 1.086-.795.63-2.117 2.484-3.684 4.544-3.684 2.004 0 4.125 1.746 4.125 4.5 0 3.476-2.37 6.218-5.048 8.525z"/>
              </svg>
            </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Active Preset Display */}
              {(() => {
                const activePresetId = getActivePresetId();
                const activePreset = activePresetId ? getPresetById(activePresetId) : null;
                const presetName = activePreset?.name || 'Default';
                return (
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#9CA3AF', 
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    Active preset: {presetName}
                    {/* Autosave Feedback */}
                    {autosaveState === 'saving' && (
                      <Loader2 size={12} className="spinner" style={{ opacity: 0.7 }} />
                    )}
                    {autosaveState === 'saved' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check size={12} style={{ color: '#10b981', opacity: 0.9 }} />
                      </motion.div>
                    )}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      </header>

      {/* URL + Save */}
      <section className="url-section">
        <h2 className="section-title">{t("backgroundSectionTitle", lang)}</h2>
        <p className="section-description">{t("backgroundSectionDescription", lang)}</p>
        <div className="url-row">
          <div className="background-color-section-inline">
            <label 
              className="background-color-label"
              data-tooltip-id="background-color-tooltip"
              data-tooltip-content={t("colorPickerTooltip", lang)}
            >
              {t("colorPickerTitle", lang)}
            </label>
            <Tooltip id="background-color-tooltip" />
            <ColorPicker
              value={settings.backgroundColor || '#000000'}
              onChange={handleBackgroundColorChange}
              showInline={false}
              enableAlpha={false}
              popupPosition="bottom-right"
            />
          </div>
          <label className="url-label-inline" htmlFor="mediaUrl">
            {t("backgroundMediaUrlLabel", lang)}
          </label>
          <div className="url-input-wrapper">
            <input
              ref={urlInputRef}
              id="mediaUrl"
              type="text"
              className="url-input"
              placeholder={t("urlPlaceholder", lang)}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onFocus={(e) => e.target.select()}
              onContextMenu={handleContextMenu}
            />
            <motion.button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClear();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="clear-btn-inline"
              data-tooltip-id="clear-btn-tooltip"
              data-tooltip-content={t("clear", lang)}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <X size={16} />
            </motion.button>
            <Tooltip id="clear-btn-tooltip" />
            {/* Context Menu */}
            {contextMenu && (
              <div
                ref={contextMenuRef}
                style={{
                  position: 'fixed',
                  top: `${contextMenu.y}px`,
                  left: `${contextMenu.x}px`,
                  background: '#2c2c2c',
                  border: '1px solid #3a3a3a',
                  borderRadius: '6px',
                  padding: '4px 0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                  zIndex: 1000,
                  minWidth: '70px',
                }}
              >
                <button
                  onClick={handleCopy}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f2f2f2',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {t('copy', lang) || 'Copy'}
                </button>
                <button
                  onClick={handlePaste}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f2f2f2',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {t('paste', lang) || 'Paste'}
                </button>
                <button
                  onClick={handleSelectAll}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: 'none',
                    color: '#f2f2f2',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {t('selectAll', lang) || 'Select All'}
                </button>
              </div>
            )}
          </div>
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLocalMediaModalOpen(true);
            }}
            className="preset-modal-button preset-modal-button-secondary"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FolderOpen size={16} />
            {t('browse', lang)}
          </motion.button>
          <motion.button 
            onClick={handleSave} 
            className="save-btn"
            disabled={isResolving}
            whileHover={!isResolving ? { scale: 1.02 } : {}}
            whileTap={!isResolving ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isResolving ? (
              <>
                <Loader2 size={16} className="spinner" style={{ marginRight: '6px' }} />
                {t("save", lang)}
              </>
            ) : (
              t("save", lang)
            )}
          </motion.button>
        </div>
        
        {/* Resolve message */}
        {resolveMessage && (
          <div className={`resolve-message ${isResolving ? 'resolving' : resolveMessage.includes('success') || resolveMessage.includes('başarıyla') ? 'success' : 'error'}`}>
            {isResolving && <Loader2 size={14} className="spinner" style={{ marginRight: '6px' }} />}
            {resolveMessage}
          </div>
        )}
      </section>

      {/* Preview + Settings */}
      <ConfigPreview 
        activePresetId={activePresetId}
        overlayConfig={overlayConfig}
      />

      {/* Preset Manager */}
      <PresetManager
        isOpen={isPresetManagerOpen}
        onClose={() => setIsPresetManagerOpen(false)}
        lang={lang}
        settings={settings}
        setSettings={setSettings}
        mediaUrl={mediaUrl}
        setMediaUrl={setMediaUrl}
        activePresetId={activePresetId}
      />

      {/* Reset Confirm Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        presetName={(() => {
          const activePresetId = getActivePresetId();
          if (!activePresetId) return 'Default';
          const preset = getPresetById(activePresetId);
          return preset?.name || 'Default';
        })()}
        lang={lang}
      />

      <LocalMediaModal
        isOpen={isLocalMediaModalOpen}
        onClose={() => setIsLocalMediaModalOpen(false)}
        onSelectFile={handleLocalMediaSelect}
        lang={lang}
      />

      {/* YouTube Warning Modal removed - YouTube is now supported */}
    </div>
  );
}
