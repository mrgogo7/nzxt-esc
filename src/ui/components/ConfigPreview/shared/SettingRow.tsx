import React from 'react';
import ResetButton from './ResetButton';

interface SettingRowProps {
  label: string;
  children: React.ReactNode;
  onReset?: () => void;
  resetTooltipId?: string;
  resetTooltipContent?: string;
  className?: string;
}

/**
 * Reusable setting row component with label, input/control, and optional reset button.
 */
export default function SettingRow({
  label,
  children,
  onReset,
  resetTooltipId,
  resetTooltipContent,
  className = 'setting-row',
}: SettingRowProps) {
  return (
    <div className={className}>
      <label>{label}</label>
      {children}
      {onReset && (
        <ResetButton
          onClick={onReset}
          tooltipId={resetTooltipId}
          tooltipContent={resetTooltipContent}
        />
      )}
    </div>
  );
}

