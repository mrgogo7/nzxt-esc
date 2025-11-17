import React from 'react';
import { motion } from 'framer-motion';
import {
  AlignStartHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignEndVertical,
  AlignVerticalSpaceAround,
  Move,
  MoveDiagonal,
  MoveHorizontal,
} from 'lucide-react';
import { Lang, t } from '../../../../i18n';
import { DEFAULT_SETTINGS, type AppSettings } from '../../../../constants/defaults';
import SettingRow from '../shared/SettingRow';
import ResetButton from '../shared/ResetButton';
import '../../styles/ConfigPreview.css';

interface BackgroundSettingsProps {
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
  lang: Lang;
}

/**
 * Background settings panel component.
 */
export default function BackgroundSettings({
  settings,
  setSettings,
  lang,
}: BackgroundSettingsProps) {
  const resetField = (field: keyof AppSettings) => {
    const defaultValue = DEFAULT_SETTINGS[field];
    setSettings({
      ...settings,
      [field]: defaultValue,
    });
  };

  const alignIcons = [
    { key: 'center', icon: <AlignVerticalSpaceAround size={16} /> },
    { key: 'top', icon: <AlignStartHorizontal size={16} /> },
    { key: 'bottom', icon: <AlignEndHorizontal size={16} /> },
    { key: 'left', icon: <AlignStartVertical size={16} /> },
    { key: 'right', icon: <AlignEndVertical size={16} /> },
  ];

  const fitIcons = [
    { key: 'cover', icon: <Move size={16} /> },
    { key: 'contain', icon: <MoveDiagonal size={16} /> },
    { key: 'fill', icon: <MoveHorizontal size={16} /> },
  ];

  return (
    <div className="settings-column">
      <div className="panel">
        <div className="panel-header">
          <h3>{t('settingsTitle', lang)}</h3>

          <div className="overlay-toggle-compact">
            <span>{t('overlayGuide', lang)}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={!!settings.showGuide}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    showGuide: e.target.checked,
                  })
                }
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="settings-grid-modern">
          {/* SCALE / X / Y */}
          {[
            { field: 'scale', label: t('scale', lang), step: 0.1 },
            { field: 'x', label: t('xOffset', lang) },
            { field: 'y', label: t('yOffset', lang) },
          ].map(({ field, label, step }) => (
            <SettingRow
              key={field}
              label={label}
              onReset={() => resetField(field as keyof AppSettings)}
              resetTooltipContent={t('reset', lang)}
            >
              <input
                type="number"
                step={step || 1}
                value={(settings as any)[field]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [field]: parseFloat(e.target.value || '0'),
                  })
                }
              />
            </SettingRow>
          ))}

          {/* ALIGN */}
          <SettingRow
            label={t('align', lang)}
            onReset={() => resetField('align')}
            resetTooltipContent={t('reset', lang)}
          >
            <div className="icon-group">
              {alignIcons.map(({ key, icon }) => (
                <motion.button
                  key={key}
                  className={`icon-btn ${settings.align === key ? 'active' : ''}`}
                  data-tooltip-id={`align-${key}-tooltip`}
                  data-tooltip-content={t(`align${key[0].toUpperCase() + key.slice(1)}`, lang)}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      align: key as AppSettings['align'],
                    })
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </SettingRow>

          {/* FIT */}
          <SettingRow
            label={t('fit', lang)}
            onReset={() => resetField('fit')}
            resetTooltipContent={t('reset', lang)}
          >
            <div className="icon-group">
              {fitIcons.map(({ key, icon }) => (
                <motion.button
                  key={key}
                  className={`icon-btn ${settings.fit === key ? 'active' : ''}`}
                  data-tooltip-id={`fit-${key}-tooltip`}
                  data-tooltip-content={t(`fit${key[0].toUpperCase() + key.slice(1)}`, lang)}
                  onClick={() =>
                    setSettings({
                      ...settings,
                      fit: key as AppSettings['fit'],
                    })
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </SettingRow>
        </div>
      </div>
    </div>
  );
}

