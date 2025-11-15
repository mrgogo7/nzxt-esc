import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/ColorPicker.css';
import { normalizeToRgba, parseColorToRgba, rgbaObjectToString } from '../../utils/color';
import GradientColorPicker from 'react-best-gradient-color-picker';

/**
 * ColorPicker component props.
 * Wraps react-best-gradient-color-picker with project-specific functionality.
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
 * Uses internal state to handle color changes properly, especially for pointer/slider interactions.
 * The package may return colors in different formats, so we normalize everything to RGBA.
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

  // Internal state for the picker - allows controlled updates
  const [internalColor, setInternalColor] = useState(() => normalizeToRgba(value));

  // Sync internal state when external value changes
  useEffect(() => {
    const normalized = normalizeToRgba(value);
    setInternalColor(normalized);
  }, [value]);

  /**
   * Handle color change from the picker.
   * Package may return different formats - handle all cases aggressively.
   */
  const handleColorChange = useCallback((color: any) => {
    // Debug: Log what we receive
    console.log('[ColorPicker] onChange received:', color, 'type:', typeof color);
    
    let rgbaString: string;

    // Handle different input types aggressively
    if (typeof color === 'string') {
      // String input - could be RGBA, HEX, or gradient
      console.log('[ColorPicker] Processing string:', color);
      
      // Check if it's a gradient
      if (color.includes('gradient') || color.includes('linear-gradient')) {
        // Extract first rgba from gradient
        const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbaMatch) {
          rgbaString = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${rgbaMatch[4] || 1})`;
        } else {
          // If no rgba found, try to parse as HEX in gradient
          const hexMatch = color.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
          if (hexMatch) {
            rgbaString = normalizeToRgba(hexMatch[0]);
          } else {
            // Fallback to current internal color
            rgbaString = internalColor;
          }
        }
      } else {
        // Regular color string - try to normalize
        // First check if it's already valid RGBA
        if (color.startsWith('rgba(') || color.startsWith('rgb(')) {
          rgbaString = color;
        } else if (color.startsWith('#')) {
          // HEX format
          rgbaString = normalizeToRgba(color);
        } else {
          // Unknown format - try to parse anyway
          rgbaString = normalizeToRgba(color);
        }
      }
    } else if (typeof color === 'object' && color !== null) {
      // Object input - could be {r, g, b, a} or similar
      console.log('[ColorPicker] Processing object:', color);
      
      if ('r' in color && 'g' in color && 'b' in color) {
        rgbaString = rgbaObjectToString({
          r: Number(color.r),
          g: Number(color.g),
          b: Number(color.b),
          a: allowAlpha ? (Number(color.a) || 1) : 1,
        });
      } else {
        // Unknown object format - fallback
        rgbaString = internalColor;
      }
    } else {
      // Unknown type - fallback to current color
      console.warn('[ColorPicker] Unknown color format:', color);
      rgbaString = internalColor;
    }

    // Ensure alpha is correct
    if (!allowAlpha) {
      const parsed = parseColorToRgba(rgbaString);
      rgbaString = rgbaObjectToString({
        r: parsed.r,
        g: parsed.g,
        b: parsed.b,
        a: 1,
      });
    }

    // Validate the result
    const parsed = parseColorToRgba(rgbaString);
    if (isNaN(parsed.r) || isNaN(parsed.g) || isNaN(parsed.b)) {
      console.error('[ColorPicker] Invalid color after processing:', rgbaString);
      rgbaString = internalColor; // Fallback to current
    }

    console.log('[ColorPicker] Final RGBA:', rgbaString);
    
    // Update internal state immediately
    setInternalColor(rgbaString);
    
    // Call parent onChange
    onChange(rgbaString);
  }, [internalColor, allowAlpha, onChange]);

  /**
   * Calculate popup position to avoid viewport overflow.
   */
  useEffect(() => {
    if (isOpen && triggerRef.current && pickerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const wrapperRect = pickerRef.current.getBoundingClientRect();
      const popupWidth = 280;
      const popupHeight = 400;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const spacing = 8;

      const position: { top?: string; bottom?: string; left?: string; right?: string } = {};

      const triggerLeft = triggerRect.left - wrapperRect.left;
      const triggerTop = triggerRect.top - wrapperRect.top;
      const triggerBottom = triggerRect.bottom - wrapperRect.top;

      // Horizontal positioning
      if (triggerRect.left >= popupWidth + spacing) {
        position.right = `${wrapperRect.width - triggerLeft}px`;
      } else {
        if (triggerRect.right + popupWidth + spacing <= viewportWidth) {
          position.left = `${triggerLeft}px`;
        } else {
          position.right = `${wrapperRect.width - triggerLeft}px`;
        }
      }

      // Vertical positioning
      const spaceAbove = triggerRect.top;
      
      if (spaceAbove >= popupHeight + spacing) {
        position.bottom = `${wrapperRect.height - triggerTop + spacing}px`;
      } else {
        const popupTopInViewport = triggerRect.bottom + spacing;
        
        if (popupTopInViewport + popupHeight <= viewportHeight) {
          position.top = `${triggerBottom + spacing}px`;
        } else {
          const maxTopInViewport = viewportHeight - popupHeight;
          const maxTopRelative = maxTopInViewport - (triggerRect.top - wrapperRect.top);
          position.top = `${Math.max(triggerBottom + spacing, maxTopRelative)}px`;
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
          value={internalColor}
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
            value={internalColor}
            onChange={handleColorChange}
            hideAlpha={!allowAlpha}
            hideGradient={!allowGradient}
          />
        </div>
      )}
    </div>
  );
}
