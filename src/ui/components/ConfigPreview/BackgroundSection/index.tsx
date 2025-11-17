import React from 'react';
import { Lang, t } from '../../../../i18n';
import type { AppSettings } from '../../../../constants/defaults';
import BackgroundPreview from './BackgroundPreview';
import BackgroundSettings from './BackgroundSettings';
import '../../styles/ConfigPreview.css';

interface BackgroundSectionProps {
  mediaUrl: string;
  settings: AppSettings;
  setSettings: (settings: Partial<AppSettings>) => void;
  lang: Lang;
  offsetScale: number;
  onScaleChange: (delta: number) => void;
}

/**
 * Background section component combining preview and settings.
 */
export default function BackgroundSection({
  mediaUrl,
  settings,
  setSettings,
  lang,
  offsetScale,
  onScaleChange,
}: BackgroundSectionProps) {
  return (
    <div className="section-group">
      <h2 className="section-title">{t('backgroundSectionTitle', lang)}</h2>
      <div className="section-content">
        <BackgroundPreview
          mediaUrl={mediaUrl}
          settings={settings}
          setSettings={setSettings}
          lang={lang}
          offsetScale={offsetScale}
          onScaleChange={onScaleChange}
        />
        <BackgroundSettings
          settings={settings}
          setSettings={setSettings}
          lang={lang}
        />
      </div>
    </div>
  );
}

