import { useState, useRef, useEffect } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import '../styles/ColorPicker.css';

interface ColorPickerProps {
  value: string; // RGBA or HEX color
  onChange: (color: string) => void;
  showInline?: boolean; // If true, show picker inline without trigger button
}

/**
 * ColorPicker component using react-color SketchPicker.
 * Returns color in rgba() format for alpha support.
 * Positioned to avoid viewport overflow, prioritizing top-left for NZXT CAM compatibility.
 * Can be used inline (showInline=true) or as a popup (showInline=false).
 */
export default function ColorPicker({ value, onChange, showInline = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popupPosition, setPopupPosition] = useState<{ top?: string; bottom?: string; left?: string; right?: string }>({});

  // Parse color value to hex for react-color
  const parseColor = (color: string): string => {
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        // Convert to hex (react-color uses hex, alpha is handled separately)
        const hex = `#${[r, g, b].map(x => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('')}`;
        return hex;
      }
    } else if (color.startsWith('#')) {
      return color;
    }
    return '#ffffff';
  };

  const currentColor = parseColor(value);

  // Handle color change from react-color
  const handleColorChange = (color: ColorResult) => {
    const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a || 1})`;
    onChange(rgba);
  };

  // Calculate popup position to avoid viewport overflow
  useEffect(() => {
    if (isOpen && triggerRef.current && pickerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const wrapperRect = pickerRef.current.getBoundingClientRect();
      const popupWidth = 220; // SketchPicker approximate width
      const popupHeight = 320; // SketchPicker approximate height
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const spacing = 8; // gap between trigger and popup

      const position: { top?: string; bottom?: string; left?: string; right?: string } = {};

      // Calculate relative position from wrapper
      const triggerLeft = triggerRect.left - wrapperRect.left;
      const triggerTop = triggerRect.top - wrapperRect.top;
      const triggerBottom = triggerRect.bottom - wrapperRect.top;

      // Horizontal positioning: prefer left (for NZXT CAM compatibility)
      if (triggerRect.left >= popupWidth + spacing) {
        // Enough space on left, open to the left
        position.right = `${wrapperRect.width - triggerLeft}px`;
      } else {
        // Not enough space on left, try right
        if (triggerRect.right + popupWidth + spacing <= viewportWidth) {
          position.left = `${triggerLeft}px`;
        } else {
          // Not enough space on either side, open to the left anyway
          position.right = `${wrapperRect.width - triggerLeft}px`;
        }
      }

      // Vertical positioning: prefer top (for NZXT CAM compatibility)
      // But ensure popup stays within viewport
      const spaceAbove = triggerRect.top;
      const spaceBelow = viewportHeight - triggerRect.bottom;
      
      if (spaceAbove >= popupHeight + spacing) {
        // Enough space above, open above
        position.bottom = `${wrapperRect.height - triggerTop + spacing}px`;
      } else {
        // Not enough space above - open below
        // Calculate where popup would be in viewport
        const popupTopInViewport = triggerRect.bottom + spacing;
        
        // Check if popup would overflow viewport bottom
        if (popupTopInViewport + popupHeight <= viewportHeight) {
          // Fits below - use normal position
          position.top = `${triggerBottom + spacing}px`;
        } else {
          // Would overflow - position to fit in viewport
          // Place popup so its bottom aligns with viewport bottom
          const maxTopInViewport = viewportHeight - popupHeight;
          const maxTopRelative = maxTopInViewport - (triggerRect.top - wrapperRect.top);
          position.top = `${Math.max(triggerBottom + spacing, maxTopRelative)}px`;
        }
      }

      setPopupPosition(position);
    }
  }, [isOpen]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // If showInline is true, show picker directly without trigger button
  if (showInline) {
    return (
      <div className="color-picker-wrapper color-picker-inline" ref={pickerRef}>
        <SketchPicker
          color={currentColor}
          onChange={handleColorChange}
          onChangeComplete={handleColorChange}
          disableAlpha={true}
          presetColors={[
            '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
            '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
            '#ffc0cb', '#a52a2a', '#808080', '#c0c0c0', '#008000',
            '#000080', '#800000', '#808000', '#008080', '#ff6347',
            '#ff1493', '#00ced1', '#ffd700', '#da70d6', '#cd5c5c',
            '#4169e1', '#32cd32', '#ff4500', '#9370db', '#20b2aa',
          ]}
        />
      </div>
    );
  }

  // Default popup behavior
  return (
    <div className="color-picker-wrapper" ref={pickerRef}>
      <button
        ref={triggerRef}
        type="button"
        className="color-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span 
          className="color-picker-preview" 
          style={{
            backgroundColor: value || '#ffffff',
          }}
        />
      </button>

      {isOpen && (
        <div 
          className="color-picker-popup"
          style={popupPosition}
        >
          <SketchPicker
            color={currentColor}
            onChangeComplete={handleColorChange}
            disableAlpha={true}
            presetColors={[
              '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
              '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
              '#ffc0cb', '#a52a2a', '#808080', '#c0c0c0', '#008000',
              '#000080', '#800000', '#808000', '#008080', '#ff6347',
              '#ff1493', '#00ced1', '#ffd700', '#da70d6', '#cd5c5c',
              '#4169e1', '#32cd32', '#ff4500', '#9370db', '#20b2aa',
            ]}
          />
        </div>
      )}
    </div>
  );
}
