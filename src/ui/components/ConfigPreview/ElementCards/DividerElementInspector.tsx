import type { MouseEvent } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { OverlayElement, DividerElementData } from '../../../../types/overlay';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import OverlayField from '../OverlayField';
import TabbedColorPicker from '../../TabbedColorPicker';

interface DividerElementInspectorProps {
  element: OverlayElement & { type: 'divider'; data: DividerElementData };
  dividerIndex: number;
  isSelected: boolean;
  isCollapsed: boolean;
  unifiedIndex: number;
  totalElements: number;
  activePresetId: string | null;
  lang: Lang;
  dividerLabels: string[];
  onToggleCollapse: () => void;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdateElement: (updater: (element: OverlayElement) => OverlayElement) => void;
}

/**
 * Divider element inspector component.
 * Extracted from OverlaySettings.tsx for structural refactoring.
 * Preserves exact visual appearance and behavior.
 */
export function DividerElementInspector({
  element,
  dividerIndex,
  isSelected,
  isCollapsed,
  unifiedIndex,
  totalElements,
  activePresetId,
  dividerLabels,
  onToggleCollapse,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdateElement,
}: DividerElementInspectorProps) {
  const t = useI18n();
  const data = element.data as DividerElementData;

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
            {dividerLabels[dividerIndex] || `${dividerIndex + 1}${dividerIndex === 0 ? 'st' : dividerIndex === 1 ? 'nd' : dividerIndex === 2 ? 'rd' : 'th'} ${t('divider')}`}
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
          {/* Row 1: Thickness + Color */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <OverlayField
              type="number"
              label={t('thickness')}
              value={data.width}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as DividerElementData), width: Math.max(1, Math.min(400, value)) }
                }));
              }}
              step={1}
              min={1}
              max={400}
              labelTooltipId={`thickness-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipThickness')}
            />
            <div className="setting-row">
              <label>
                {t('color')}
              </label>
              <TabbedColorPicker
                textColor={data.color || '#ffffff'}
                outlineColor={data.outlineColor}
                outlineThickness={data.outlineThickness ?? 0}
                onTextColorChange={(color) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as DividerElementData), color }
                  }));
                }}
                onOutlineColorChange={(color) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as DividerElementData), outlineColor: color }
                  }));
                }}
                onOutlineThicknessChange={(thickness) => {
                  if (!activePresetId) return;
                  onUpdateElement((el) => ({
                    ...el,
                    data: { ...(el.data as DividerElementData), outlineThickness: thickness }
                  }));
                }}
              />
            </div>
          </div>
          
          {/* Row 2: Length + Angle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <OverlayField
              type="number"
              label={t('dividerLength')}
              value={data.height}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as DividerElementData), height: Math.max(10, Math.min(640, value)) }
                }));
              }}
              step={1}
              min={10}
              max={640}
              labelTooltipId={`divider-length-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipDividerLength')}
            />
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
              labelTooltipId={`divider-angle-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipAngle')}
            />
          </div>
          
          {/* Row 3: X/Y Offset */}
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
              labelTooltipId={`divider-xoffset-tooltip-${element.id}`}
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
              labelTooltipId={`divider-yoffset-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipYOffset')}
            />
          </div>
        </div>
      )}
    </div>
  );
}

