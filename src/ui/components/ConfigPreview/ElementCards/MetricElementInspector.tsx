import type { MouseEvent } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { OverlayElement, MetricElementData, OverlayMetricKey } from '../../../../types/overlay';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import OverlayField from '../OverlayField';
import TabbedColorPicker from '../../TabbedColorPicker';

interface MetricElementInspectorProps {
  element: OverlayElement & { type: 'metric'; data: MetricElementData };
  metricIndex: number;
  isSelected: boolean;
  isCollapsed: boolean;
  unifiedIndex: number;
  totalElements: number;
  activePresetId: string | null;
  lang: Lang;
  metricLabels: string[];
  metricOptions: Array<{ value: OverlayMetricKey; label: string }>;
  onToggleCollapse: () => void;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdateElement: (updater: (element: OverlayElement) => OverlayElement) => void;
}

/**
 * Metric element inspector component.
 * Extracted from OverlaySettings.tsx for structural refactoring.
 * Preserves exact visual appearance and behavior.
 */
export function MetricElementInspector({
  element,
  metricIndex,
  isSelected,
  isCollapsed,
  unifiedIndex,
  totalElements,
  activePresetId,
  lang,
  metricLabels,
  metricOptions,
  onToggleCollapse,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdateElement,
}: MetricElementInspectorProps) {
  const t = useI18n();
  const data = element.data as MetricElementData;

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
            {metricLabels[metricIndex] || `${metricIndex + 1}${metricIndex === 0 ? 'st' : metricIndex === 1 ? 'nd' : metricIndex === 2 ? 'rd' : 'th'} ${t('metric')}`}
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
          {/* Row 1: Sensor label | Metric Select (flex-grow) | TabbedColorPicker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <OverlayField
              type="select"
              label={t('sensor') || t('metric')}
              hideLabel={false}
              value={data.metric}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as MetricElementData), metric: value as OverlayMetricKey }
                }));
              }}
              options={metricOptions}
              className=""
              labelTooltipId={`sensor-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipSensor')}
            />
            <TabbedColorPicker
              textColor={data.numberColor || '#ffffff'}
              outlineColor={data.outlineColor}
              outlineThickness={data.outlineThickness ?? 0}
              onTextColorChange={(color) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as MetricElementData), numberColor: color }
                }));
              }}
              onOutlineColorChange={(color) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as MetricElementData), outlineColor: color }
                }));
              }}
              onOutlineThicknessChange={(thickness) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as MetricElementData), outlineThickness: thickness }
                }));
              }}
            />
          </div>
          
          {/* Row 2: numberSize label + input | Angle label + input */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <OverlayField
              type="number"
              label={t('size')}
              value={data.numberSize}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as MetricElementData), numberSize: value }
                }));
              }}
              step={1}
              labelTooltipId={`number-size-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipSize')}
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
              labelTooltipId={`angle-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipAngle')}
            />
          </div>
          
          {/* Row 3: X Offset + Y Offset */}
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
              labelTooltipId={`xoffset-tooltip-${element.id}`}
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
              labelTooltipId={`yoffset-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipYOffset')}
            />
          </div>
        </div>
      )}
    </div>
  );
}

