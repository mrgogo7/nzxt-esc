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
   */
  const handleColorChange = useCallback((color: string) => {
    // Debug: Log what we receive
    console.log('[ColorPicker] onChange called with:', color, 'type:', typeof color);
    
    // Package returns RGBA string or gradient string
    let rgbaString: string;

    if (typeof color === 'string') {
      // Check if it's a gradient string
      if (color.includes('gradient') || color.includes('linear-gradient')) {
        // Extract first rgba from gradient if allowGradient is false
        if (!allowGradient) {
          const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (rgbaMatch) {
            rgbaString = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${rgbaMatch[4] || 1})`;
          } else {
            rgbaString = currentColor;
          }
        } else {
          // If gradient is allowed, use gradient string as is
          rgbaString = color;
        }
      } else {
        // Regular RGBA string - use directly
        rgbaString = color;
      }
    } else {
      console.warn('[ColorPicker] onChange received non-string value:', color);
      rgbaString = currentColor;
    }

    // Only override alpha if allowAlpha is false
    if (!allowAlpha && rgbaString.includes('rgba')) {
      const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        rgbaString = `rgba(${match[1]}, ${match[2]}, ${match[3]}, 1)`;
      }
    }

    console.log('[ColorPicker] Final value to parent onChange:', rgbaString);
    onChange(rgbaString);
  }, [currentColor, allowAlpha, allowGradient, onChange]);

  /**
   * Calculate popup position - positioned relative to trigger button.
   * Fixed to properly calculate relative to wrapper.
   */
  useEffect(() => {
    if (isOpen && triggerRef.current && pickerRef.current) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (!triggerRef.current || !pickerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const wrapperRect = pickerRef.current.getBoundingClientRect();
        const popupWidth = 280;
        const popupHeight = 400;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const spacing = 8;

        const position: { top?: string; bottom?: string; left?: string; right?: string } = {};

        // Calculate relative positions from wrapper
        const triggerLeft = triggerRect.left - wrapperRect.left;
        const triggerTop = triggerRect.top - wrapperRect.top;
        const triggerRight = triggerRect.right - wrapperRect.left;
        const triggerBottom = triggerRect.bottom - wrapperRect.top;

        // Horizontal: prefer left (for NZXT CAM compatibility), fallback to right
        if (triggerRect.left >= popupWidth + spacing) {
          // Enough space on left - position to the left of trigger
          position.right = `${wrapperRect.width - triggerLeft + spacing}px`;
        } else {
          // Not enough space on left, try right
          if (triggerRect.right + popupWidth + spacing <= viewportWidth) {
            // Enough space on right - position to the right of trigger
            position.left = `${triggerRight - wrapperRect.left + spacing}px`;
          } else {
            // Not enough space on either side, open to the left anyway
            position.right = `${wrapperRect.width - triggerLeft + spacing}px`;
          }
        }

        // Vertical: prefer top (for NZXT CAM compatibility), fallback to below
        if (triggerRect.top >= popupHeight + spacing) {
          // Enough space above - position above trigger
          position.bottom = `${wrapperRect.height - triggerTop + spacing}px`;
        } else {
          // Not enough space above, try below
          if (triggerRect.bottom + popupHeight + spacing <= viewportHeight) {
            // Enough space below - position below trigger
            position.top = `${triggerBottom - wrapperRect.top + spacing}px`;
          } else {
            // Not enough space on either side, open above anyway
            position.bottom = `${wrapperRect.height - triggerTop + spacing}px`;
          }
        }

        console.log('[ColorPicker] Popup position calculated:', position, {
          triggerRect: { left: triggerRect.left, top: triggerRect.top, right: triggerRect.right, bottom: triggerRect.bottom },
          wrapperRect: { left: wrapperRect.left, top: wrapperRect.top, width: wrapperRect.width, height: wrapperRect.height },
        });

        setPopupPosition(position);
      }, 0);

      return () => clearTimeout(timeoutId);
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
