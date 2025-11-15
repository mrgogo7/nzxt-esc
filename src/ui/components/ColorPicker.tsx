import { useState, useRef, useEffect, useCallback } from 'react';
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
 * - value: RGBA string (e.g., 'rgba(255,255,255,1)') or gradient string
 * - onChange: (color: string) => void - receives RGBA string or gradient string
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

  // Convert value to RGBA format (package expects RGBA or gradient string)
  // If gradient string, keep it as is (package handles it)
  const currentColor = normalizeToRgba(value);

  /**
   * Handle color change from package.
   * Package returns RGBA string or gradient string directly.
   * Debug logging added for Firefox compatibility check.
   * 
   * Important: If allowGradient is false, always convert gradient strings to RGBA.
   * If allowGradient is true, keep gradient strings as is.
   */
  const handleColorChange = useCallback((color: string) => {
    // Debug: Log what we receive
    console.log('[ColorPicker] onChange called with:', color, 'type:', typeof color, 'allowGradient:', allowGradient);
    
    // Package returns RGBA string or gradient string
    let finalColor: string;

    if (typeof color === 'string') {
      // Check if it's a gradient string
      const isGradient = color.includes('gradient') || color.includes('linear-gradient');
      
      if (isGradient) {
        // If gradient is not allowed, extract first rgba from gradient
        if (!allowGradient) {
          // Extract first rgba from gradient string (case-insensitive)
          const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
          if (rgbaMatch) {
            finalColor = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${rgbaMatch[4] || 1})`;
            console.log('[ColorPicker] Extracted RGBA from gradient:', finalColor);
          } else {
            // Fallback: use current color if extraction fails
            console.warn('[ColorPicker] Failed to extract RGBA from gradient, using currentColor:', currentColor);
            finalColor = currentColor;
          }
        } else {
          // If gradient is allowed, use gradient string as is
          finalColor = color;
        }
      } else {
        // Regular RGBA/HEX string - use directly
        finalColor = color;
      }
    } else {
      console.warn('[ColorPicker] onChange received non-string value:', color);
      finalColor = currentColor;
    }

    // Only override alpha if allowAlpha is false
    // Only process if it's not a gradient string (gradient strings handled above)
    if (!allowAlpha && !finalColor.includes('gradient')) {
      const match = finalColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        finalColor = `rgba(${match[1]}, ${match[2]}, ${match[3]}, 1)`;
      }
    }

    console.log('[ColorPicker] Final value to parent onChange:', finalColor);
    onChange(finalColor);
  }, [currentColor, allowAlpha, allowGradient, onChange]);

  /**
   * Calculate popup position - positioned relative to trigger button.
   * Uses same logic as old ColorPicker: relative to wrapper with calc() values.
   */
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupWidth = 280; // Approximate width of GradientColorPicker
      const popupHeight = 400; // Approximate height of GradientColorPicker
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const spacing = 8; // gap between trigger and popup

      const position: { top?: string; bottom?: string; left?: string; right?: string } = {};

      // Horizontal positioning: prefer left (for NZXT CAM compatibility), fallback to right
      if (triggerRect.left >= popupWidth + spacing) {
        // Enough space on left, open to the left (wrapper's right side)
        position.right = '0';
      } else {
        // Not enough space on left, try right
        if (triggerRect.right + popupWidth + spacing <= viewportWidth) {
          // Enough space on right, open to the right (wrapper's left side)
          position.left = '0';
        } else {
          // Not enough space on either side, open to the left anyway
          position.right = '0';
        }
      }

      // Vertical positioning: prefer top (for NZXT CAM compatibility), fallback to below
      if (triggerRect.top >= popupHeight + spacing) {
        // Enough space above, open above (wrapper's bottom)
        position.bottom = 'calc(100% + 8px)';
      } else {
        // Not enough space above, try below
        if (triggerRect.bottom + popupHeight + spacing <= viewportHeight) {
          // Enough space below, open below (wrapper's top)
          position.top = 'calc(100% + 8px)';
        } else {
          // Not enough space on either side, open above anyway
          position.bottom = 'calc(100% + 8px)';
        }
      }

      console.log('[ColorPicker] Popup position calculated:', position, {
        triggerRect: { left: triggerRect.left, top: triggerRect.top, right: triggerRect.right, bottom: triggerRect.bottom },
        viewport: { width: viewportWidth, height: viewportHeight },
      });

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
