import type { MouseEvent } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type { OverlayElement, TextElementData } from '../../../../types/overlay';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import OverlayField from '../OverlayField';
import CombinedTextColorInput from '../CombinedTextColorInput';

interface TextElementInspectorProps {
  element: OverlayElement & { type: 'text'; data: TextElementData };
  textIndex: number;
  isSelected: boolean;
  isCollapsed: boolean;
  unifiedIndex: number;
  totalElements: number;
  activePresetId: string | null;
  lang: Lang;
  textLabels: string[];
  onToggleCollapse: () => void;
  onSelect: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUpdateElement: (updater: (element: OverlayElement) => OverlayElement) => void;
}

/**
 * Text element inspector component.
 * Extracted from OverlaySettings.tsx for structural refactoring.
 * Preserves exact visual appearance and behavior.
 */
export function TextElementInspector({
  element,
  textIndex,
  isSelected,
  isCollapsed,
  unifiedIndex,
  totalElements,
  activePresetId,
  textLabels,
  onToggleCollapse,
  onSelect,
  onRemove,
  onMoveUp,
  onMoveDown,
  onUpdateElement,
}: TextElementInspectorProps) {
  const t = useI18n();
  const data = element.data as TextElementData;

  // Sanitize text input - remove HTML tags and dangerous characters
  const sanitizeText = (input: string): string => {
    let sanitized = input.replace(/<[^>]*>/g, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    sanitized = sanitized.substring(0, 120);
    return sanitized;
  };

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
            {textLabels[textIndex] || `${textIndex + 1}${textIndex === 0 ? 'st' : textIndex === 1 ? 'nd' : textIndex === 2 ? 'rd' : 'th'} ${t('text')}`}
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
          {/* Row 1: Combo text+color input (no label) */}
          <CombinedTextColorInput
            text={data.text}
            onTextChange={(text) => {
              if (!activePresetId) return;
              const sanitized = sanitizeText(text);
              onUpdateElement((el) => ({
                ...el,
                data: { ...(el.data as TextElementData), text: sanitized }
              }));
            }}
            color={data.textColor || '#ffffff'}
            onColorChange={(color) => {
              if (!activePresetId) return;
              onUpdateElement((el) => ({
                ...el,
                data: { ...(el.data as TextElementData), textColor: color }
              }));
            }}
            outlineColor={data.outlineColor}
            onOutlineColorChange={(color) => {
              if (!activePresetId) return;
              onUpdateElement((el) => ({
                ...el,
                data: { ...(el.data as TextElementData), outlineColor: color }
              }));
            }}
            outlineThickness={data.outlineThickness ?? 0}
            onOutlineThicknessChange={(thickness) => {
              if (!activePresetId) return;
              onUpdateElement((el) => ({
                ...el,
                data: { ...(el.data as TextElementData), outlineThickness: thickness }
              }));
            }}
            placeholder={t('textInputPlaceholder')}
            maxLength={120}
            sanitizeText={sanitizeText}
            colorTooltipContent={t('tooltipColor')}
            id={element.id}
          />
          
          {/* Row 2: TextSize + Angle on same row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <OverlayField
              type="number"
              label={t('textSize')}
              value={data.textSize}
              onChange={(value) => {
                if (!activePresetId) return;
                onUpdateElement((el) => ({
                  ...el,
                  data: { ...(el.data as TextElementData), textSize: Math.max(6, value) }
                }));
              }}
              step={1}
              min={6}
              labelTooltipId={`text-size-tooltip-${element.id}`}
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
              labelTooltipId={`text-angle-tooltip-${element.id}`}
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
              labelTooltipId={`text-xoffset-tooltip-${element.id}`}
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
              labelTooltipId={`text-yoffset-tooltip-${element.id}`}
              labelTooltipContent={t('tooltipYOffset')}
            />
          </div>
        </div>
      )}
    </div>
  );
}

