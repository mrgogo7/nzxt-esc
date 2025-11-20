import { useRef, useEffect } from 'react';
import ColorPicker from '../ColorPicker';
import ResetButton from './ResetButton';
import { Tooltip } from 'react-tooltip';
import type { Lang, t as tFunction } from '../../../i18n';

interface OverlayFieldProps {
  field?: string; // Optional, kept for backward compatibility (no longer used for type safety)
  type: 'number' | 'color' | 'select';
  label: string;
  value: any;
  onChange: (value: any) => void;
  onReset?: () => void; // Optional - reset buttons removed from individual fields
  options?: Array<{ value: string; label: string }>;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
  lang?: Lang;
  t?: typeof tFunction;
  hideLabel?: boolean; // If true, don't render the label
  tooltipId?: string; // Optional tooltip ID for color picker
  tooltipContent?: string; // Optional tooltip content
}

/**
 * Generic overlay field component.
 * Handles number inputs, color pickers, and select dropdowns with reset functionality.
 * 
 * This component eliminates ~1500 lines of repetitive code in OverlaySettings.
 * 
 * Supports:
 * - Integer inputs (step=1) with automatic rounding
 * - Mouse wheel scrolling (+1/-1)
 * - Keyboard arrow keys (ArrowUp/ArrowDown for +1/-1)
 */
export default function OverlayField({
  field: _field,
  type,
  label,
  value,
  onChange,
  onReset,
  options,
  step,
  min,
  max,
  className = 'input-narrow',
  lang,
  t,
  hideLabel = false,
  tooltipId,
  tooltipContent,
}: OverlayFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Determine if this is an integer field (step >= 1 or undefined)
  const isIntegerField = !step || step >= 1;
  
  // Handle mouse wheel and arrow keys for numeric inputs
  useEffect(() => {
    if (type !== 'number' || !inputRef.current) return;
    
    const input = inputRef.current;
    
    const handleWheel = (e: WheelEvent) => {
      // Only handle wheel when input is focused
      if (document.activeElement !== input) return;
      
      e.preventDefault();
      const currentValue = typeof value === 'number' ? value : 0;
      const delta = e.deltaY < 0 ? 1 : -1;
      const newValue = isIntegerField 
        ? Math.round(currentValue + delta)
        : currentValue + delta * (step || 1);
      
      // Apply min/max constraints
      let constrainedValue = newValue;
      if (min !== undefined) constrainedValue = Math.max(constrainedValue, min);
      if (max !== undefined) constrainedValue = Math.min(constrainedValue, max);
      
      onChange(constrainedValue);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys when input is focused
      if (document.activeElement !== input) return;
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentValue = typeof value === 'number' ? value : 0;
        const delta = e.key === 'ArrowUp' ? 1 : -1;
        const newValue = isIntegerField 
          ? Math.round(currentValue + delta)
          : currentValue + delta * (step || 1);
        
        // Apply min/max constraints
        let constrainedValue = newValue;
        if (min !== undefined) constrainedValue = Math.max(constrainedValue, min);
        if (max !== undefined) constrainedValue = Math.min(constrainedValue, max);
        
        onChange(constrainedValue);
      }
    };
    
    input.addEventListener('wheel', handleWheel, { passive: false });
    input.addEventListener('keydown', handleKeyDown);
    
    return () => {
      input.removeEventListener('wheel', handleWheel);
      input.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, value, onChange, step, min, max, isIntegerField]);
  
  return (
    <div className="setting-row">
      {!hideLabel && <label>{label}</label>}
      
      {type === 'number' && (
        <input
          ref={inputRef}
          type="number"
          step={step ?? (isIntegerField ? 1 : undefined)}
          min={min}
          max={max}
          value={value ?? ''}
          onChange={(e) => {
            // For integer fields, always use parseInt and round
            // For float fields (step < 1), use parseFloat
            const numValue = isIntegerField
              ? Math.round(parseFloat(e.target.value || '0'))
              : parseFloat(e.target.value || '0');
            onChange(numValue);
          }}
          className={className}
        />
      )}
      
      {type === 'color' && (
        <>
          <div data-tooltip-id={tooltipId} data-tooltip-content={tooltipContent}>
            <ColorPicker
              value={value || '#ffffff'}
              onChange={onChange}
            />
          </div>
          {tooltipId && <Tooltip id={tooltipId} />}
        </>
      )}
      
      {type === 'select' && (
        <select
          className={`url-input ${className}`}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
      
      {/* Reset button removed - now handled at element level */}
    </div>
  );
}

