import type { MouseEvent } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import type { OverlayElement, DateElementData } from '../../../../types/overlay';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import OverlayField from '../OverlayField';
import TabbedColorPicker from '../../TabbedColorPicker';

interface DateElementInspectorProps {
  element: OverlayElement & { type: 'date'; data: DateElementData };
  dateIndex: number;
  isSelected: boolean;
  isCollapsed: boolean;
  unifiedIndex: number;
  totalElements: number;
  activePresetId: string | null;
  lang: Lang;
  dateLabels: string[];
  onToggleCollapse: () => void;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdateElement: (updater: (element: OverlayElement) => OverlayElement) => void;
}

/**
 * Date element inspector component.
 * Follows the exact 3-row structure as specified.
 */
export function DateElementInspector({
  element,
  dateIndex,
  isSelected,
  isCollapsed,
  unifiedIndex,
  totalElements,
  activePresetId,
  lang,
  dateLabels,
  onToggleCollapse,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdateElement,
}: DateElementInspectorProps) {
  const t = useI18n();
  const data = element.data as DateElementData;

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
            {dateLabels[dateIndex] || `${dateIndex + 1}${dateIndex === 0 ? 'st' : dateIndex === 1 ? 'nd' : dateIndex === 2 ? 'rd' : 'th'} ${t('date')}`}
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
          {/* Row 1: Format | Color */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="setting-row" style={{ flex: 1 }}>
              <label 
                data-tooltip-id={`date-format-tooltip-${element.id}`}
                data-tooltip-content={t('tooltipDateFormat')}
                style={{ cursor: 'help' }}
              >
                {t('dateFormat')}
              </label>
              <Tooltip id={`date-format-tooltip-${element.id}`} />
              <input
                type="text"
                style={{
                  flex: 1,
                  width: '104px',
                  background: '#2c2c2c',
                  border: '1px solid #3a3a3a',
                  color: '#f2f2f2',
                  padding: '5px 18px 5px 10px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                value={data.format}
                onChange={(e) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as DateElementData), format: e.target.value }
                  }));
                }}
                placeholder={t('dateFormatPlaceholder')}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8a2be2';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3a3a';
                }}
              />
            </div>
            <div style={{ flex: '0 0 auto' }}>
              <TabbedColorPicker
                textColor={data.color || '#ffffff'}
                outlineColor={data.outlineColor}
                outlineThickness={data.outlineThickness ?? 0}
                onTextColorChange={(color) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as DateElementData), color }
                  }));
                }}
                onOutlineColorChange={(color) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as DateElementData), outlineColor: color }
                  }));
                }}
                onOutlineThicknessChange={(thickness) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as DateElementData), outlineThickness: thickness }
                  }));
                }}
              />
            </div>
          </div>
          
          {/* Row 2: Angle | Size */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <OverlayField
              type="number"
              label={t('angle')}
              value={element.angle ?? 0}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  angle: value
                }));
              }}
              step={1}
              min={0}
              max={360}
              labelTooltipId={`date-angle-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipAngle')}
            />
            <OverlayField
              type="number"
              label={t('size')}
              value={data.fontSize}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as DateElementData), fontSize: Math.max(6, value) }
                }));
              }}
              step={1}
              min={6}
              labelTooltipId={`date-size-tooltip-${element.id}`}
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
              labelTooltipId={`date-xoffset-tooltip-${element.id}`}
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
              labelTooltipId={`date-yoffset-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipYOffset')}
            />
          </div>
        </div>
      )}
    </div>
  );
}

