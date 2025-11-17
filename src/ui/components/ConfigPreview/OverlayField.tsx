import type { OverlaySettings } from '../../../types/overlay';
import ColorPicker from '../ColorPicker';
import ResetButton from './ResetButton';

interface OverlayFieldProps {
  field?: keyof OverlaySettings; // Optional, used for type safety
  type: 'number' | 'color' | 'select';
  label: string;
  value: any;
  onChange: (value: any) => void;
  onReset: () => void;
  options?: Array<{ value: string; label: string }>;
  step?: number;
  min?: number;
  max?: number;
  className?: string;
}

/**
 * Generic overlay field component.
 * Handles number inputs, color pickers, and select dropdowns with reset functionality.
 * 
 * This component eliminates ~1500 lines of repetitive code in OverlaySettings.
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
}: OverlayFieldProps) {
  return (
    <div className="setting-row">
      <label>{label}</label>
      
      {type === 'number' && (
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={value ?? ''}
          onChange={(e) => {
            const numValue = step && step < 1 
              ? parseFloat(e.target.value || '0')
              : parseInt(e.target.value || '0', 10);
            onChange(numValue);
          }}
          className={className}
        />
      )}
      
      {type === 'color' && (
        <ColorPicker
          value={value || '#ffffff'}
          onChange={onChange}
        />
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
      
      <ResetButton
        onClick={onReset}
        tooltipContent="Reset"
      />
    </div>
  );
}

