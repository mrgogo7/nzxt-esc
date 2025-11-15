import { useState, useRef, useEffect } from 'react';
import '../styles/ColorPicker.css';
import { normalizeToRgba } from '../../utils/color';
import GradientColorPicker from 'react-best-gradient-color-picker';

/**
 * ColorPicker component props.
 * Follows react-best-gradient-color-picker package API.
 */
interface ColorPickerProps {
  /** Current color value in RGBA or HEX format */
  value: string;
  /** Callback when color changes, receives RGBA string */
  onChange: (color: string) => void;
  /** If true, show picker inline without trigger button */
  showInline?: boolean;
  /** If true, allow alpha channel (default: false) */
  allowAlpha?: boolean;
  /** If true, allow gradient selection (default: false for text colors, true for background) */
  allowGradient?: boolean;
}

/**
 * ColorPicker component using react-best-gradient-color-picker.
 * 
 * Package API:
 * - value: RGBA string (e.g., 'rgba(255,255,255,1)')
 * - onChange: (color: string) => void - receives RGBA string
 * - hideAlpha: boolean - hides alpha control
 * - hideGradient: boolean - hides gradient control
 * 
 * This component adapts the project to the package, not vice versa.
 */
export default function ColorPicker({ 
  value, 
  onChange, 
  showInline = false,
  allowAlpha = false,
  allowGradient = false,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popupPosition, setPopupPosition] = useState<{ 
    top?: string; 
    bottom?: string; 
    left?: string; 
    right?: string 
  }>({});

  // Convert value to RGBA format (package expects RGBA)
  const currentColor = normalizeToRgba(value);

  /**
   * Handle color change from package.
   * Package returns RGBA string directly.
   */
  const handleColorChange = (color: string) => {
    // Package returns RGBA string or gradient string
    let rgbaString: string;

    if (typeof color === 'string') {
      if (color.includes('gradient') || color.includes('linear-gradient')) {
        // Extract first rgba from gradient
        const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbaMatch) {
          rgbaString = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${rgbaMatch[4] || 1})`;
        } else {
          rgbaString = currentColor;
        }
      } else {
        // Regular RGBA string - use directly
        rgbaString = color;
      }
    } else {
      rgbaString = currentColor;
    }

    // Only override alpha if allowAlpha is false
    if (!allowAlpha && rgbaString.includes('rgba')) {
      const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        rgbaString = `rgba(${match[1]}, ${match[2]}, ${match[3]}, 1)`;
      }
    }

    onChange(rgbaString);
  };

  /**
   * Calculate popup position - simple relative positioning like old ColorPicker.
   */
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupWidth = 280;
      const popupHeight = 400;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const spacing = 8;

      const position: { top?: string; bottom?: string; left?: string; right?: string } = {};

      // Horizontal: prefer left (like old ColorPicker), fallback to right
      if (triggerRect.left >= popupWidth + spacing) {
        // Enough space on left
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

      // Vertical: prefer top (like old ColorPicker), fallback to below
      if (triggerRect.top >= popupHeight + spacing) {
        // Enough space above
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

  /**
   * Close picker when clicking outside.
   */
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

  // Inline mode
  if (showInline) {
    return (
      <div className="color-picker-wrapper color-picker-inline" ref={pickerRef}>
        <GradientColorPicker
          value={currentColor}
          onChange={handleColorChange}
          hideAlpha={!allowAlpha}
          hideGradient={!allowGradient}
        />
      </div>
    );
  }

  // Popup mode
  return (
    <div className="color-picker-wrapper" ref={pickerRef}>
      <button
        ref={triggerRef}
        type="button"
        className="color-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open color picker"
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
          <GradientColorPicker
            value={currentColor}
            onChange={handleColorChange}
            hideAlpha={!allowAlpha}
            hideGradient={!allowGradient}
          />
        </div>
      )}
    </div>
  );
}
