import type { MouseEvent } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import type { OverlayElement, ClockElementData } from '../../../../types/overlay';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import OverlayField from '../OverlayField';
import TabbedColorPicker from '../../TabbedColorPicker';

interface ClockElementInspectorProps {
  element: OverlayElement & { type: 'clock'; data: ClockElementData };
  clockIndex: number;
  isSelected: boolean;
  isCollapsed: boolean;
  unifiedIndex: number;
  totalElements: number;
  activePresetId: string | null;
  lang: Lang;
  clockLabels: string[];
  onToggleCollapse: () => void;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdateElement: (updater: (element: OverlayElement) => OverlayElement) => void;
}

/**
 * Clock element inspector component.
 * Follows the exact 3-row structure as specified.
 */
export function ClockElementInspector({
  element,
  clockIndex,
  isSelected,
  isCollapsed,
  unifiedIndex,
  totalElements,
  activePresetId,
  clockLabels,
  onToggleCollapse,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdateElement,
}: ClockElementInspectorProps) {
  const t = useI18n();
  const data = element.data as ClockElementData;

  return (
    <div
      style={{
        background: isSelected ? '#2c2c2c' : '#242424',
        border: isSelected ? '1px solid #8a2be2' : '1px solid rgba(255, 255, 255, 0.04)',
        borderRadius: '6px',
        padding: '8px',
        marginBottom: '8px',
      }}
      onClick={onSelect}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isCollapsed ? '0' : '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a0a0a0',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronDown size={14} style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
          </button>
          <span style={{ color: '#f2f2f2', fontSize: '13px', fontWeight: 500 }}>
            {clockLabels[clockIndex] || `${clockIndex + 1}${clockIndex === 0 ? 'st' : clockIndex === 1 ? 'nd' : clockIndex === 2 ? 'rd' : 'th'} ${t('digitalClock')}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{
              width: '24px',
              height: '24px',
              background: 'transparent',
              border: '1px solid #3a3a3a',
              color: '#ff6b6b',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
            }}
          >
            <X size={12} />
          </button>
          <button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              if (unifiedIndex < totalElements - 1) {
                onMoveDown();
              }
            }}
            disabled={unifiedIndex === totalElements - 1}
            style={{
              width: '24px',
              height: '24px',
              background: unifiedIndex === totalElements - 1 ? '#252525' : '#2c2c2c',
              border: '1px solid #3a3a3a',
              color: unifiedIndex === totalElements - 1 ? '#a0a0a0' : '#f2f2f2',
              borderRadius: '4px',
              cursor: unifiedIndex === totalElements - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
            }}
          >
            <ChevronDown size={12} />
          </button>
          <button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              if (unifiedIndex > 0) {
                onMoveUp();
              }
            }}
            disabled={unifiedIndex === 0}
            style={{
              width: '24px',
              height: '24px',
              background: unifiedIndex === 0 ? '#252525' : '#2c2c2c',
              border: '1px solid #3a3a3a',
              color: unifiedIndex === 0 ? '#a0a0a0' : '#f2f2f2',
              borderRadius: '4px',
              cursor: unifiedIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0',
            }}
          >
            <ChevronUp size={12} />
          </button>
        </div>
      </div>
      
      {/* Content */}
      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Row 1: Format | Mode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="setting-row">
              <label 
                data-tooltip-id={`clock-format-tooltip-${element.id}`}
                data-tooltip-content={t('tooltipClockFormat')}
                style={{ cursor: 'help' }}
              >
                {t('clockFormat')}
              </label>
              <Tooltip id={`clock-format-tooltip-${element.id}`} />
              <select
                className="url-input"
                style={{ flex: 1 }}
                value={data.format}
                onChange={(e) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as ClockElementData), format: e.target.value as "HH:mm" | "HH:mm:ss" }
                  }));
                }}
              >
                <option value="HH:mm">{t('HH:mm')}</option>
                <option value="HH:mm:ss">{t('HH:mm:ss')}</option>
              </select>
            </div>
            <div className="setting-row">
              <label 
                data-tooltip-id={`clock-mode-tooltip-${element.id}`}
                data-tooltip-content={t('tooltipClockMode')}
                style={{ cursor: 'help' }}
              >
                {t('clockMode')}
              </label>
              <Tooltip id={`clock-mode-tooltip-${element.id}`} />
              <select
                className="url-input"
                style={{ flex: 1 }}
                value={data.mode}
                onChange={(e) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as ClockElementData), mode: e.target.value as "24h" | "12h" }
                  }));
                }}
              >
                <option value="24h">{t('24h')}</option>
                <option value="12h">{t('12h')}</option>
              </select>
            </div>
          </div>
          
          {/* Row 2: Color | Size */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="setting-row">
              <label>{t('color')}</label>
              <TabbedColorPicker
                textColor={data.color || '#ffffff'}
                outlineColor={data.outlineColor}
                outlineThickness={data.outlineThickness ?? 0}
                onTextColorChange={(color) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as ClockElementData), color }
                  }));
                }}
                onOutlineColorChange={(color) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as ClockElementData), outlineColor: color }
                  }));
                }}
                onOutlineThicknessChange={(thickness) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as ClockElementData), outlineThickness: thickness }
                  }));
                }}
              />
            </div>
            <OverlayField
              type="number"
              label={t('size')}
              value={data.fontSize}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as ClockElementData), fontSize: Math.max(6, value) }
                }));
              }}
              step={1}
              min={6}
              labelTooltipId={`clock-size-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipSize')}
            />
          </div>
          
          {/* Row 3: X Offset | Y Offset */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <OverlayField
              type="number"
              label={t('customXOffset')}
              value={element.x}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  x: value
                }));
              }}
              step={1}
              labelTooltipId={`clock-xoffset-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipXOffset')}
            />
            <OverlayField
              type="number"
              label={t('customYOffset')}
              value={element.y}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  y: value
                }));
              }}
              step={1}
              labelTooltipId={`clock-yoffset-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipYOffset')}
            />
          </div>
        </div>
      )}
    </div>
  );
}

