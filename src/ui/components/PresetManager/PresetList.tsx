/**
 * Preset List Component
 * 
 * Displays list of presets with actions (Apply, Rename, Duplicate, Delete).
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Edit2, 
  Copy, 
  Trash2, 
  Check,
  ChevronDown,
  ChevronRight,
  Star
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import type { StoredPreset } from '../../../preset/storage';
import { presetNameExists, DEFAULT_PRESET_ID, toggleFavorite, isFavorite, getPresets } from '../../../preset/storage';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import './PresetManager.css';

export interface PresetListProps {
  presets: StoredPreset[];
  activePresetId: string | null;
  onApply: (preset: StoredPreset) => void;
  onRename: (preset: StoredPreset) => void;
  onDuplicate: (preset: StoredPreset) => void;
  onDelete: (preset: StoredPreset) => void;
  lang: Lang;
}

export default function PresetList({
  presets,
  activePresetId,
  onApply,
  onRename,
  onDuplicate,
  onDelete,
  lang,
}: PresetListProps) {
  const t = useI18n();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [presetsList, setPresetsList] = useState<StoredPreset[]>(presets);
  
  // Accordion state: both sections open by default
  const [isDefaultPresetsOpen, setIsDefaultPresetsOpen] = useState(true);
  const [isUserPresetsOpen, setIsUserPresetsOpen] = useState(true);

  // Sync presets list when presets prop changes
  useEffect(() => {
    setPresetsList(presets);
  }, [presets]);

  const handleToggleFavorite = (presetId: string) => {
    const success = toggleFavorite(presetId);
    if (!success) {
      // Favorite limit reached
      alert(t('favoriteLimitMessage'));
    } else {
      // Reload presets from storage to reflect changes
      // Parent (PresetManager) will also reload via storage event listener
      const updatedPresets = getPresets();
      setPresetsList(updatedPresets);
    }
  };

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const handleRenameStart = (preset: StoredPreset, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(preset.id);
    setRenameValue(preset.name);
  };

  const handleRenameConfirm = (presetId: string) => {
    const trimmed = renameValue.trim();
    const preset = presets.find(p => p.id === presetId);
    if (trimmed && preset && trimmed !== preset.name) {
      // Check if name already exists (excluding current preset)
      if (!presetNameExists(trimmed, presetId)) {
        // Update preset name via parent
        onRename({ ...preset, name: trimmed });
      }
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const handleRenameCancel = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  // Separate default preset from other default presets
  const defaultPreset = presetsList.find(p => p.id === DEFAULT_PRESET_ID);
  const otherDefaultPresets = presetsList.filter(p => p.isDefault && p.id !== DEFAULT_PRESET_ID);
  const otherUserPresets = presetsList.filter(p => !p.isDefault);
  
  // Default preset should appear in "Your Presets" section at the top
  const userPresets = defaultPreset 
    ? [defaultPreset, ...otherUserPresets]
    : otherUserPresets;
  
  // "NZXT-ESC Default Presets" section only shows other default presets (not the system default)
  const defaultPresets = otherDefaultPresets;

  const renderPresetItem = (preset: StoredPreset) => {
    const isActive = preset.id === activePresetId;
    const isRenaming = renamingId === preset.id;
    const presetId = `preset-${preset.id}`;
    const favorited = isFavorite(preset);

    return (
      <div
        key={preset.id}
        className={`preset-list-item ${isActive ? 'active' : ''}`}
        onDoubleClick={(e) => {
          // Don't trigger on double-clicking action buttons
          if ((e.target as HTMLElement).closest('.preset-action-btn')) {
            return;
          }
          onApply(preset);
        }}
      >
        <div className="preset-item-main">
          <div className="preset-item-info">
            {isRenaming ? (
              <input
                ref={renameInputRef}
                type="text"
                className="preset-item-name-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRenameConfirm(preset.id);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    handleRenameCancel();
                  }
                }}
                onBlur={() => handleRenameConfirm(preset.id)}
                onClick={(e) => e.stopPropagation()}
                aria-label={t('presetRename')}
                title={t('presetRename')}
                placeholder={preset.name}
              />
            ) : (
              <div className="preset-item-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{preset.name}</span>
                {preset.id === DEFAULT_PRESET_ID && (
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#9CA3AF', 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '6px' }}>●</span>
                    Default
                  </span>
                )}
                {isActive && (
                  <span className="preset-active-badge">
                    <Check size={12} />
                    {t('presetActive')}
                  </span>
                )}
              </div>
            )}
            {preset.isDefault && preset.id !== DEFAULT_PRESET_ID && (
              <span className="preset-default-badge">{t('presetDefault')}</span>
            )}
          </div>
          
          <div className="preset-item-actions">
            {!preset.isDefault && preset.id !== DEFAULT_PRESET_ID && (
              <button
                className="preset-action-btn preset-action-delete"
                onClick={(e) => handleActionClick(e, () => onDelete(preset))}
                data-tooltip-id={`${presetId}-delete`}
                data-tooltip-content={t('presetDelete')}
                aria-label={t('presetDelete')}
                title={t('presetDelete')}
              >
                <Trash2 size={14} />
              </button>
            )}
            {/* Favorite Star */}
            <button
              className="preset-action-btn preset-action-favorite"
              onClick={(e) => handleActionClick(e, () => handleToggleFavorite(preset.id))}
              data-tooltip-id={`${presetId}-favorite`}
              data-tooltip-content={favorited ? t('removeFromFavorites') : t('addToFavorites')}
              aria-label={favorited ? t('removeFromFavorites') : t('addToFavorites')}
              title={favorited ? t('removeFromFavorites') : t('addToFavorites')}
              style={{
                color: favorited ? '#fbbf24' : '#9CA3AF',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!favorited) {
                  e.currentTarget.style.color = '#fbbf24';
                }
              }}
              onMouseLeave={(e) => {
                if (!favorited) {
                  e.currentTarget.style.color = '#9CA3AF';
                }
              }}
            >
              <Star size={14} fill={favorited ? 'currentColor' : 'none'} />
            </button>
            <button
              className="preset-action-btn preset-action-duplicate"
              onClick={(e) => handleActionClick(e, () => onDuplicate(preset))}
              data-tooltip-id={`${presetId}-duplicate`}
              data-tooltip-content={t('presetDuplicate')}
              aria-label={t('presetDuplicate')}
              title={t('presetDuplicate')}
            >
              <Copy size={14} />
            </button>
            <button
              className="preset-action-btn preset-action-rename"
              onClick={(e) => handleRenameStart(preset, e)}
              data-tooltip-id={`${presetId}-rename`}
              data-tooltip-content={t('presetRename')}
              aria-label={t('presetRename')}
              title={t('presetRename')}
            >
              <Edit2 size={14} />
            </button>
            <button
              className="preset-action-btn preset-action-apply"
              onClick={(e) => handleActionClick(e, () => onApply(preset))}
              data-tooltip-id={`${presetId}-apply`}
              data-tooltip-content={t('presetApply')}
              aria-label={t('presetApply')}
              title={t('presetApply')}
            >
              <Play size={14} />
            </button>
            
            {/* Tooltips */}
            {!preset.isDefault && preset.id !== DEFAULT_PRESET_ID && <Tooltip id={`${presetId}-delete`} />}
            <Tooltip id={`${presetId}-favorite`} />
            <Tooltip id={`${presetId}-duplicate`} />
            <Tooltip id={`${presetId}-rename`} />
            <Tooltip id={`${presetId}-apply`} />
          </div>
        </div>
      </div>
    );
  };

  if (presets.length === 0) {
    return (
      <div className="preset-list-empty">
        <p>{t('presetListEmpty')}</p>
      </div>
    );
  }

  return (
    <div className="preset-list">
      {defaultPresets.length > 0 && (
        <div className="preset-list-section">
          <button
            className="preset-list-section-header"
            onClick={() => setIsDefaultPresetsOpen(!isDefaultPresetsOpen)}
            title={isDefaultPresetsOpen ? t('collapseSection') : t('expandSection')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: '12px 0',
              cursor: 'pointer',
              color: 'inherit',
            }}
          >
            {isDefaultPresetsOpen ? (
              <ChevronDown size={16} style={{ opacity: 0.7 }} />
            ) : (
              <ChevronRight size={16} style={{ opacity: 0.7 }} />
            )}
            <h4 className="preset-list-section-title" style={{ margin: 0 }}>
              {t('presetDefaultPresets')}
            </h4>
          </button>
          {isDefaultPresetsOpen && (
            <div className="preset-list-items">
              {defaultPresets.map(renderPresetItem)}
            </div>
          )}
        </div>
      )}
      
      {userPresets.length > 0 && (
        <div className="preset-list-section">
          <button
            className="preset-list-section-header"
            onClick={() => setIsUserPresetsOpen(!isUserPresetsOpen)}
            title={isUserPresetsOpen ? t('collapseSection') : t('expandSection')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: '12px 0',
              cursor: 'pointer',
              color: 'inherit',
            }}
          >
            {isUserPresetsOpen ? (
              <ChevronDown size={16} style={{ opacity: 0.7 }} />
            ) : (
              <ChevronRight size={16} style={{ opacity: 0.7 }} />
            )}
            <h4 className="preset-list-section-title" style={{ margin: 0 }}>
              {t('presetUserPresets')}
            </h4>
          </button>
          {isUserPresetsOpen && (
            <div className="preset-list-items">
              {userPresets.map(renderPresetItem)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


