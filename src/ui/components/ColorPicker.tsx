import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import '../styles/ColorPicker.css';

interface ColorPickerProps {
  value: string; // RGBA or HEX color
  onChange: (color: string) => void;
  showInline?: boolean; // If true, show picker inline without trigger button
}

// Preset colors
const PRESET_COLORS = [
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
  '#ffc0cb', '#a52a2a', '#808080', '#c0c0c0', '#008000',
  '#000080', '#800000', '#808000', '#008080', '#ff6347',
  '#ff1493', '#00ced1', '#ffd700', '#da70d6', '#cd5c5c',
  '#4169e1', '#32cd32', '#ff4500', '#9370db', '#20b2aa',
];

/**
 * ColorPicker component using react-colorful HexColorPicker.
 * Returns color in rgba() format for alpha support.
 * Positioned to avoid viewport overflow, prioritizing top-left for NZXT CAM compatibility.
 * Can be used inline (showInline=true) or as a popup (showInline=false).
 */
export default function ColorPicker({ value, onChange, showInline = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popupPosition, setPopupPosition] = useState<{ top?: string; bottom?: string; left?: string; right?: string }>({});

  // Parse color value to hex for react-colorful
  const parseColor = (color: string): string => {
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        // Convert to hex
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

  // Convert hex to rgba
  const hexToRgba = (hex: string): string => {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  const currentColor = parseColor(value);

  // Handle color change from react-colorful
  const handleColorChange = (hex: string) => {
    const rgba = hexToRgba(hex);
    onChange(rgba);
  };

  // Calculate popup position to avoid viewport overflow
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupWidth = 220; // Color picker approximate width
      const popupHeight = 280; // Color picker approximate height (with presets)
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const spacing = 8; // gap between trigger and popup

      const position: { top?: string; bottom?: string; left?: string; right?: string } = {};

      // Horizontal positioning: prefer left (for NZXT CAM compatibility)
      if (triggerRect.left >= popupWidth + spacing) {
        // Enough space on left, open to the left
        position.right = '0';
      } else {
        // Not enough space on left, try right
        if (triggerRect.right + popupWidth + spacing <= viewportWidth) {
          position.left = '0';
        } else {
          // Not enough space on either side, open to the left anyway
          position.right = '0';
        }
      }

      // Vertical positioning: prefer top (for NZXT CAM compatibility)
      if (triggerRect.top >= popupHeight + spacing) {
        // Enough space above, open above
        position.bottom = 'calc(100% + 8px)';
      } else {
        // Not enough space above, try below
        if (triggerRect.bottom + popupHeight + spacing <= viewportHeight) {
          position.top = 'calc(100% + 8px)';
        } else {
          // Not enough space on either side, open above anyway
          position.bottom = 'calc(100% + 8px)';
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

  // Preset colors component
  const PresetColors = ({ onSelect }: { onSelect: (color: string) => void }) => (
    <div className="color-picker-presets">
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className="color-picker-preset"
          style={{ backgroundColor: color }}
          onClick={() => onSelect(color)}
          title={color}
        />
      ))}
    </div>
  );

  // If showInline is true, show picker directly without trigger button
  if (showInline) {
    return (
      <div className="color-picker-wrapper color-picker-inline" ref={pickerRef}>
        <div className="color-picker-container">
          <HexColorPicker
            color={currentColor}
            onChange={handleColorChange}
          />
          <PresetColors onSelect={handleColorChange} />
        </div>
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
          <div className="color-picker-container">
            <HexColorPicker
              color={currentColor}
              onChange={handleColorChange}
            />
            <PresetColors onSelect={handleColorChange} />
          </div>
        </div>
      )}
    </div>
  );
}
