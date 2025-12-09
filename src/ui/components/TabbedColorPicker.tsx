import { useState, useRef, useEffect, useCallback } from 'react';
import { RgbaColorPicker, HexColorInput } from 'react-colorful';
import type { RgbaColor } from 'react-colorful';
import { Copy, ClipboardPaste } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Tooltip } from 'react-tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/TabbedColorPicker.css';
import '../styles/tooltip.css';

type TabType = 'text' | 'outline';

interface TabbedColorPickerProps {
  textColor: string;
  outlineColor?: string;
  outlineThickness?: number;
  onTextColorChange: (color: string) => void;
  onOutlineColorChange: (color: string | undefined) => void;
  onOutlineThicknessChange?: (thickness: number) => void;
  popupPosition?: 'auto' | 'bottom-right';
}

// Preset color swatches (similar to screenshots)
const PRESET_COLORS = [
  '#FF0000', // Red
  '#FF00FF', // Magenta
  '#FF8000', // Orange
  '#FF4000', // Red-Orange
  '#8000FF', // Purple
  '#FFFFFF', // White
  '#000000', // Black
  '#808080', // Gray
  '#FF0080', // Pink
  '#FF8040', // Light Orange
  '#FFFF00', // Yellow
  '#80FF00', // Lime Green
  '#00FF00', // Green
  '#00FF80', // Aqua Green
  '#00FFFF', // Cyan
  '#0080FF', // Blue
  '#8000FF', // Purple
  '#FF00FF', // Magenta
];

// Special "no outline" swatch (transparent/checkered pattern)
const NO_OUTLINE_COLOR = 'transparent';



/**
 * TabbedColorPicker component for text and outline color selection.
 * Features:
 * - Text/Outline tabs
 * - Preset color swatch grid
 * - Custom color view with gradient/hue/hex/rgb inputs
 * - Outline thickness control (Outline tab only)
 * 
 * ARCHITECTURE: Single Source of Truth (Parent-Owned)
 * - Props (textColor, outlineColor, outlineThickness) are the ONLY source of truth
 * - No local color state (pendingTextColor, etc.)
 * - All color changes immediately call parent callbacks
 * - Hex input syncs from props (unless user is typing)
 */
export default function TabbedColorPicker({
  textColor,
  outlineColor,
  outlineThickness = 0,
  onTextColorChange,
  onOutlineColorChange,
  onOutlineThicknessChange,
  popupPosition = 'auto',
}: TabbedColorPickerProps) {
  const t = useI18n();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [view, setView] = useState<'swatch' | 'custom'>('swatch');
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [popupStyle, setPopupStyle] = useState<{ top?: string; bottom?: string; left?: string; right?: string }>({});
  
  // UI-only state: hex input display value
  const [colorInput, setColorInput] = useState<string>('');
  
  // Flags for preventing sync during user interaction
  const [isUserTyping, setIsUserTyping] = useState(false);
  const inputFocusedRef = useRef(false);
  const inputChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Compute current color from props (single source of truth)
  const currentColor = activeTab === 'text' 
    ? textColor 
    : (outlineColor && outlineColor !== NO_OUTLINE_COLOR ? outlineColor : NO_OUTLINE_COLOR);
  const isNoOutline = activeTab === 'outline' && (!outlineColor || outlineColor === NO_OUTLINE_COLOR);
  
  // Parse color value to RGBA object or hex string
  const parseColor = (color: string): RgbaColor | string => {
    if (color === 'transparent' || !color) {
      return { r: 255, g: 255, b: 255, a: 0 };
    }
    if (color.startsWith('rgba')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const a = match[4] ? parseFloat(match[4]) : 1;
        return { r, g, b, a };
      }
    } else if (color.startsWith('#')) {
      const cleanHex = color.replace('#', '');
      if (cleanHex.length === 6) {
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        return { r, g, b, a: 1 };
      } else if (cleanHex.length === 8) {
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        const a = parseInt(cleanHex.substring(6, 8), 16) / 255;
        return { r, g, b, a };
      }
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };

  // Picker color state - initialized from currentColor, updated during drag
  const [pickerColor, setPickerColor] = useState<RgbaColor>(() => {
    const parsed = parseColor(currentColor);
    return typeof parsed === 'object' ? parsed : { r: 255, g: 255, b: 255, a: 1 };
  });

  // Sync pickerColor from currentColor props (when user not typing)
  useEffect(() => {
    // Don't sync while user is typing in hex input
    if (inputFocusedRef.current || isUserTyping) return;
    
    const parsed = parseColor(currentColor);
    if (typeof parsed === 'object') {
      setPickerColor(prev => {
        // Simple equality guard to avoid unnecessary updates
        if (
          prev.r === parsed.r &&
          prev.g === parsed.g &&
          prev.b === parsed.b &&
          prev.a === parsed.a
        ) {
          return prev;
        }
        return parsed;
      });
    }
  }, [currentColor, isUserTyping]);

  // Convert RGBA object to rgba() string
  const rgbaToString = (rgba: RgbaColor): string => {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  };

  // Convert RGBA to hex string
  const rgbaToHex = (rgba: RgbaColor, includeAlpha: boolean): string => {
    const r = rgba.r.toString(16).padStart(2, '0');
    const g = rgba.g.toString(16).padStart(2, '0');
    const b = rgba.b.toString(16).padStart(2, '0');
    if (includeAlpha && rgba.a < 1) {
      const a = Math.round(rgba.a * 255).toString(16).padStart(2, '0');
      return `#${r}${g}${b}${a}`;
    }
    return `#${r}${g}${b}`;
  };

  // Convert hex to rgba string
  const hexToRgba = (hex: string): string => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  // Call parent callback with color string
  const callParentCallback = useCallback((colorStr: string) => {
    if (activeTab === 'text') {
      onTextColorChange(colorStr);
    } else {
      onOutlineColorChange(colorStr);
    }
  }, [activeTab, onTextColorChange, onOutlineColorChange]);

  // Sync hex input from props (unless user is typing or input is focused)
  // CRITICAL: Must NOT override user input - check both flags aggressively
  useEffect(() => {
    // CRITICAL: Only sync if user is NOT interacting with input
    // Check both isUserTyping state AND inputFocusedRef
    if (inputFocusedRef.current || isUserTyping) {
      return; // Don't override user input
    }
    
    if (isNoOutline) {
      setColorInput('');
    } else {
      const parsed = parseColor(currentColor);
      if (typeof parsed === 'object') {
        const newInput = rgbaToHex(parsed, true);
        setColorInput(prev => {
          const normalizedPrev = prev.toLowerCase().trim();
          const normalizedNew = newInput.toLowerCase().trim();
          if (normalizedPrev !== normalizedNew) {
            return newInput;
          }
          return prev;
        });
      } else if (typeof parsed === 'string' && parsed.startsWith('#')) {
        setColorInput(prev => {
          const normalizedPrev = prev.toLowerCase().trim();
          const normalizedNew = parsed.toLowerCase().trim();
          if (normalizedPrev !== normalizedNew) {
            return parsed;
          }
          return prev;
        });
      }
    }
  }, [currentColor, isNoOutline, isUserTyping, colorInput]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (inputChangeTimeoutRef.current) {
        clearTimeout(inputChangeTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle color change from react-colorful picker
  // Use useCallback to prevent recreation on every render
  // React-colorful needs a stable onChange reference to maintain drag state
  const handlePickerChange = useCallback(
    (color: RgbaColor) => {
      // Update pickerColor state so white circle moves
      setPickerColor(color);

      const colorStr = rgbaToString(color);

      // Update hex input display (if not typing)
      if (!inputFocusedRef.current && !isUserTyping) {
        const hex = rgbaToHex(color, true);
        setColorInput(hex);
      }

      // Call parent callback immediately
      callParentCallback(colorStr);

      // Set default outline thickness if needed
      if (activeTab === 'outline' && (outlineThickness ?? 0) === 0 && onOutlineThicknessChange) {
        onOutlineThicknessChange(10);
      }
    },
    [activeTab, outlineThickness, onOutlineThicknessChange, isUserTyping, callParentCallback]
  );

  // Handle color input change (hex field)
  // CRITICAL: Apply color on valid hex input, matching paste behavior
  const handleInputChange = (inputValue: string) => {
    setIsUserTyping(true);
    setColorInput(inputValue);
    
    // Clear any existing timeout
    if (inputChangeTimeoutRef.current) {
      clearTimeout(inputChangeTimeoutRef.current);
      inputChangeTimeoutRef.current = null;
    }
    
    // Normalize input: add # prefix if missing
    let normalizedInput = inputValue.trim();
    if (normalizedInput && !normalizedInput.startsWith('#') && /^[0-9A-Fa-f]{6,8}$/i.test(normalizedInput)) {
      normalizedInput = '#' + normalizedInput;
    }
    
    // Validate and apply color
    const applyColor = (valueToApply: string) => {
      if (valueToApply.startsWith('#')) {
        const cleanHex = valueToApply.replace('#', '');
        // Only apply if valid hex (6 or 8 digits)
        if (/^[0-9A-Fa-f]{6}$/.test(cleanHex) || /^[0-9A-Fa-f]{8}$/.test(cleanHex)) {
          const r = parseInt(cleanHex.substring(0, 2), 16);
          const g = parseInt(cleanHex.substring(2, 4), 16);
          const b = parseInt(cleanHex.substring(4, 6), 16);
          const a = cleanHex.length === 8 ? parseInt(cleanHex.substring(6, 8), 16) / 255 : 1;
          const colorStr = `rgba(${r}, ${g}, ${b}, ${a})`;
          
          // Call parent callback directly (not throttled, not dragging) - same as paste
          if (activeTab === 'text') {
            onTextColorChange(colorStr);
          } else {
            onOutlineColorChange(colorStr);
            if ((outlineThickness ?? 0) === 0 && onOutlineThicknessChange) {
              onOutlineThicknessChange(10);
            }
          }
          
          // CRITICAL: Clear typing flag AFTER callback with delay to prevent sync override
          setTimeout(() => {
            setIsUserTyping(false);
          }, 100);
        }
      } else if (valueToApply.startsWith('rgba')) {
        const rgbaMatch = valueToApply.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbaMatch) {
          // Call parent callback directly (not throttled, not dragging)
          if (activeTab === 'text') {
            onTextColorChange(valueToApply);
          } else {
            onOutlineColorChange(valueToApply);
            if ((outlineThickness ?? 0) === 0 && onOutlineThicknessChange) {
              onOutlineThicknessChange(10);
            }
          }
          
          // CRITICAL: Clear typing flag AFTER callback with delay
          setTimeout(() => {
            setIsUserTyping(false);
          }, 100);
        }
      }
    };

    // Apply immediately for valid complete hex, otherwise debounce
    if (normalizedInput.startsWith('#') && /^#[0-9A-Fa-f]{6,8}$/i.test(normalizedInput)) {
      // Valid complete hex - apply immediately (same as paste)
      applyColor(normalizedInput);
    } else {
      // Incomplete or invalid - debounce and try to apply
      inputChangeTimeoutRef.current = setTimeout(() => {
        applyColor(normalizedInput);
      }, 500);
    }
  };
  
  // Handle hex input blur - apply color if valid
  // CRITICAL: Clear flags AFTER applying color to prevent sync override
  const handleInputBlur = useCallback(() => {
    // If user was typing, try to apply the current input value
    if (colorInput) {
      let normalizedInput = colorInput.trim();
      if (normalizedInput && !normalizedInput.startsWith('#') && /^[0-9A-Fa-f]{6,8}$/i.test(normalizedInput)) {
        normalizedInput = '#' + normalizedInput;
      }
      
      if (normalizedInput.startsWith('#') && /^#[0-9A-Fa-f]{6,8}$/i.test(normalizedInput)) {
        const cleanHex = normalizedInput.replace('#', '');
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        const a = cleanHex.length === 8 ? parseInt(cleanHex.substring(6, 8), 16) / 255 : 1;
        const colorStr = `rgba(${r}, ${g}, ${b}, ${a})`;
        
        if (activeTab === 'text') {
          onTextColorChange(colorStr);
        } else {
          onOutlineColorChange(colorStr);
          if ((outlineThickness ?? 0) === 0 && onOutlineThicknessChange) {
            onOutlineThicknessChange(10);
          }
        }
      }
    }
    
    // CRITICAL: Clear flags AFTER applying color, with delay to prevent sync override
    setTimeout(() => {
      inputFocusedRef.current = false;
      setIsUserTyping(false);
    }, 100);
  }, [colorInput, activeTab, onTextColorChange, onOutlineColorChange, onOutlineThicknessChange, outlineThickness]);
  
  // Handle hex input key press - apply on Enter
  // CRITICAL: Clear flags AFTER applying color
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Apply color if valid
      if (colorInput) {
        let normalizedInput = colorInput.trim();
        if (normalizedInput && !normalizedInput.startsWith('#') && /^[0-9A-Fa-f]{6,8}$/i.test(normalizedInput)) {
          normalizedInput = '#' + normalizedInput;
        }
        
        if (normalizedInput.startsWith('#') && /^#[0-9A-Fa-f]{6,8}$/i.test(normalizedInput)) {
          const cleanHex = normalizedInput.replace('#', '');
          const r = parseInt(cleanHex.substring(0, 2), 16);
          const g = parseInt(cleanHex.substring(2, 4), 16);
          const b = parseInt(cleanHex.substring(4, 6), 16);
          const a = cleanHex.length === 8 ? parseInt(cleanHex.substring(6, 8), 16) / 255 : 1;
          const colorStr = `rgba(${r}, ${g}, ${b}, ${a})`;
          
          if (activeTab === 'text') {
            onTextColorChange(colorStr);
          } else {
            onOutlineColorChange(colorStr);
            if ((outlineThickness ?? 0) === 0 && onOutlineThicknessChange) {
              onOutlineThicknessChange(10);
            }
          }
          
          // CRITICAL: Clear flags AFTER applying color, with delay
          setTimeout(() => {
            setIsUserTyping(false);
            inputFocusedRef.current = false;
            e.currentTarget.blur(); // Blur to trigger sync
          }, 100);
        }
      }
    }
  }, [colorInput, activeTab, onTextColorChange, onOutlineColorChange, onOutlineThicknessChange, outlineThickness]);

  // Handle swatch selection
  const handleSwatchSelect = (color: string) => {
    if (activeTab === 'text') {
      const colorStr = color.startsWith('#') ? hexToRgba(color) : color;
      const hex = color.startsWith('#') ? color : rgbaToHex(parseColor(colorStr) as RgbaColor, true);
      
      // Update hex input display
      if (!inputFocusedRef.current && !isUserTyping) {
        setColorInput(hex);
      }
      
      // Apply immediately to parent
      onTextColorChange(colorStr);
    } else {
      if (color === NO_OUTLINE_COLOR) {
        // Update hex input
        if (!inputFocusedRef.current && !isUserTyping) {
          setColorInput('');
        }
        // Disable outline
        onOutlineColorChange(undefined);
        if (onOutlineThicknessChange) {
          onOutlineThicknessChange(0);
        }
      } else {
        const colorStr = color.startsWith('#') ? hexToRgba(color) : color;
        const hex = color.startsWith('#') ? color : rgbaToHex(parseColor(colorStr) as RgbaColor, true);
        
        // Update hex input
        if (!inputFocusedRef.current && !isUserTyping) {
          setColorInput(hex);
        }
        
        // Apply immediately to parent
        onOutlineColorChange(colorStr);
        
        // Set default thickness if needed
        if ((outlineThickness ?? 0) === 0 && onOutlineThicknessChange) {
          onOutlineThicknessChange(10);
        }
      }
    }
  };

  // Calculate popup position
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupWidth = 280;
      const popupHeight = 400;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const spacing = 8;

      const position: { top?: string; bottom?: string; left?: string; right?: string } = {};

      if (popupPosition === 'bottom-right') {
        position.top = 'calc(100% + 8px)';
        position.left = '0';
      } else {
        if (triggerRect.left >= popupWidth + spacing) {
          position.right = '0';
        } else {
          if (triggerRect.right + popupWidth + spacing <= viewportWidth) {
            position.left = '0';
          } else {
            position.right = '0';
          }
        }

        if (triggerRect.top >= popupHeight + spacing) {
          position.bottom = 'calc(100% + 8px)';
        } else {
          if (triggerRect.bottom + popupHeight + spacing <= viewportHeight) {
            position.top = 'calc(100% + 8px)';
          } else {
            position.bottom = 'calc(100% + 8px)';
          }
        }
      }

      setPopupStyle(position);
    }
  }, [isOpen, popupPosition]);

  // Close picker when clicking outside
  // Use 'click' event (not 'mousedown') to avoid interfering with react-colorful's drag
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      
      const pickerEl = pickerRef.current;
      const clickInsidePicker = pickerEl && pickerEl.contains(target);
      
      // Only close if click is truly outside the picker
      if (!clickInsidePicker) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use 'click' event only - fires after mouseup, so drag completes first
      document.addEventListener('click', handleClickOutside, true); // Use capture phase
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isOpen]);

  // Color input component for custom view
  const ColorInput = () => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      inputFocusedRef.current = true;
      setIsUserTyping(true);
      // CRITICAL: Prevent useEffect sync while focused
      requestAnimationFrame(() => {
        e.target.select();
      });
    };

    const handleBlur = () => {
      inputFocusedRef.current = false;
      // Call the blur handler to apply color if valid
      handleInputBlur();
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
      inputFocusedRef.current = true;
      setIsUserTyping(true);
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
    };

    const handleWrapperMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.tabbed-color-picker-input-group')) {
        e.stopPropagation();
      }
    };

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      try {
        let valueToCopy = '';
        
        // Prefer colorInput if valid
        if (colorInput && colorInput.trim() !== '' && /^#[0-9A-Fa-f]{6,8}$/i.test(colorInput.trim())) {
          valueToCopy = colorInput.trim().toUpperCase();
        } else {
          // Fallback: derive from props
          const current = activeTab === 'text' ? textColor : outlineColor;
          if (current && current !== NO_OUTLINE_COLOR) {
            const parsed = parseColor(current);
            if (typeof parsed === 'object') {
              valueToCopy = rgbaToHex(parsed, true).toUpperCase();
            } else if (typeof parsed === 'string' && parsed.startsWith('#')) {
              valueToCopy = parsed.toUpperCase();
            }
          }
        }
        
        if (valueToCopy) {
          // Try Clipboard API first
          if (navigator && 'clipboard' in navigator && navigator.clipboard?.writeText) {
            try {
              await navigator.clipboard.writeText(valueToCopy);
            } catch (err) {
              console.error('[handleCopy] Clipboard API failed, trying fallback:', err);
              // Fall through to fallback
            }
          } else {
            // Fallback: use document.execCommand
            try {
              const textarea = document.createElement('textarea');
              textarea.value = valueToCopy;
              textarea.style.position = 'fixed';
              textarea.style.left = '-9999px';
              textarea.style.top = '-9999px';
              document.body.appendChild(textarea);
              textarea.select();
              textarea.setSelectionRange(0, valueToCopy.length);
              const success = document.execCommand('copy');
              document.body.removeChild(textarea);
              if (!success) {
                console.error('[handleCopy] execCommand failed');
              }
            } catch (err) {
              console.error('[handleCopy] Fallback ERROR:', err);
            }
          }
        }
      } catch (err) {
        console.error('[handleCopy] ERROR:', err);
      }
    };

    const handlePaste = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      
      let text: string | null = null;
      
      // Try Clipboard API first
      if (navigator && 'clipboard' in navigator && navigator.clipboard?.readText) {
        try {
          text = await navigator.clipboard.readText();
        } catch (err) {
          console.error('[handlePaste] Clipboard API failed, trying fallback:', err);
          // Fall through to fallback
        }
      }
      
      // Fallback: use window.prompt
      if (!text) {
        try {
          const promptValue = window.prompt('Paste HEX value:');
          if (promptValue) {
            text = promptValue.trim();
          } else {
            return;
          }
        } catch (err) {
          console.error('[handlePaste] Fallback ERROR:', err);
          return;
        }
      }
      
      if (text) {
        try {
          let normalizedText = text.trim();
          
          // Handle hex without # prefix
          if (/^[0-9A-Fa-f]{6,8}$/.test(normalizedText)) {
            normalizedText = '#' + normalizedText.toUpperCase();
          }
          // Handle hex with # prefix
          else if (/^#[0-9A-Fa-f]{6,8}$/i.test(normalizedText)) {
            normalizedText = normalizedText.toUpperCase();
          }
          
          // Set input value
          setColorInput(normalizedText);
          setIsUserTyping(false);
          
          // Apply color immediately if valid
          if (normalizedText.startsWith('#')) {
            const cleanHex = normalizedText.replace('#', '');
            if (/^[0-9A-Fa-f]{6}$/.test(cleanHex) || /^[0-9A-Fa-f]{8}$/.test(cleanHex)) {
              const r = parseInt(cleanHex.substring(0, 2), 16);
              const g = parseInt(cleanHex.substring(2, 4), 16);
              const b = parseInt(cleanHex.substring(4, 6), 16);
              const a = cleanHex.length === 8 ? parseInt(cleanHex.substring(6, 8), 16) / 255 : 1;
              const colorStr = `rgba(${r}, ${g}, ${b}, ${a})`;
              
              // Call parent callback directly (not throttled, not dragging)
              if (activeTab === 'text') {
                onTextColorChange(colorStr);
              } else {
                onOutlineColorChange(colorStr);
                if ((outlineThickness ?? 0) === 0 && onOutlineThicknessChange) {
                  onOutlineThicknessChange(10);
                }
              }
            }
          } else if (normalizedText.startsWith('rgba')) {
            const rgbaMatch = normalizedText.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (rgbaMatch) {
              // Call parent callback directly (not throttled, not dragging)
              if (activeTab === 'text') {
                onTextColorChange(normalizedText);
              } else {
                onOutlineColorChange(normalizedText);
                if ((outlineThickness ?? 0) === 0 && onOutlineThicknessChange) {
                  onOutlineThicknessChange(10);
                }
              }
            }
          }
        } catch (err) {
          console.error('[handlePaste] ERROR:', err);
        }
      }
    };

    if (isNoOutline) {
      return null;
    }

    return (
      <div className="tabbed-color-picker-input-wrapper" onMouseDown={handleWrapperMouseDown}>
        <div className="tabbed-color-picker-input-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#d0d0d0', minWidth: '40px' }}>Hex</label>
            <HexColorInput
              color={colorInput}
              onChange={handleInputChange}
              alpha={true}
              prefixed
              className="tabbed-color-picker-input"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleInputKeyDown}
              onMouseDown={handleMouseDown}
              onClick={handleClick}
            />
            <div className="tabbed-color-picker-input-actions">
              <button
                type="button"
                className="tabbed-color-picker-action-btn"
                onClick={handleCopy}
                onMouseDown={(e) => e.stopPropagation()}
                data-tooltip-id="tabbed-color-picker-copy-tooltip"
                data-tooltip-content={t('copy')}
              >
                <Copy size={14} />
              </button>
              <Tooltip id="tabbed-color-picker-copy-tooltip" />
              <button
                type="button"
                className="tabbed-color-picker-action-btn"
                onClick={handlePaste}
                onMouseDown={(e) => e.stopPropagation()}
                data-tooltip-id="tabbed-color-picker-paste-tooltip"
                data-tooltip-content={t('paste')}
              >
                <ClipboardPaste size={14} />
              </button>
              <Tooltip id="tabbed-color-picker-paste-tooltip" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render swatch grid
  const SwatchGrid = () => {
    const outlineColors = PRESET_COLORS.slice(0, PRESET_COLORS.length - 1);
    const swatches = activeTab === 'outline' ? [NO_OUTLINE_COLOR, ...outlineColors] : PRESET_COLORS;
    const currentSwatchColor = activeTab === 'text' 
      ? textColor 
      : (outlineColor && outlineColor !== NO_OUTLINE_COLOR ? outlineColor : NO_OUTLINE_COLOR);

    return (
      <div 
        className="tabbed-color-picker-swatch-grid"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {swatches.map((color, index) => {
          const isNoOutlineSwatch = color === NO_OUTLINE_COLOR;
          const isSelected = activeTab === 'outline' && isNoOutlineSwatch
            ? isNoOutline
            : (color === currentSwatchColor || 
               (isNoOutlineSwatch && isNoOutline));

          return (
            <button
              key={index}
              type="button"
              className={`tabbed-color-picker-swatch ${isSelected ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSwatchSelect(color);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                backgroundColor: isNoOutlineSwatch ? 'transparent' : color,
                ...(isNoOutlineSwatch && {
                  backgroundImage: `
                    linear-gradient(45deg, #888 25%, transparent 25%),
                    linear-gradient(-45deg, #888 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #888 75%),
                    linear-gradient(-45deg, transparent 75%, #888 75%)
                  `,
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                }),
              }}
            />
          );
        })}
      </div>
    );
  };

  // Render custom view
  const CustomView = () => {
    if (isNoOutline) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', color: '#a0a0a0' }}>
          {t('noOutlineSelected') || 'No outline'}
        </div>
      );
    }

    return (
      <div 
        className="tabbed-color-picker-custom-view"
        style={{ pointerEvents: 'auto' }}
      >
        <div
          style={{
            marginBottom: '12px',
            minHeight: '200px',
            position: 'relative',
          }}
        >
          <RgbaColorPicker
            color={pickerColor}
            onChange={handlePickerChange}
          />
        </div>
        <ColorInput />
      </div>
    );
  };

  return (
    <div className="tabbed-color-picker-wrapper" ref={pickerRef}>
      <button
        ref={triggerRef}
        type="button"
        className="tabbed-color-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span 
          className="tabbed-color-picker-preview" 
          style={{
            backgroundColor: textColor || '#ffffff',
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="tabbed-color-picker-popup"
            style={{ ...popupStyle, pointerEvents: 'auto' }}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            // CRITICAL: Remove onPointerDown - it can interfere with react-colorful's drag
            // motion.div should not capture pointer events
          >
            <div className="tabbed-color-picker-container">
              {/* Tabs */}
              <div 
                className="tabbed-color-picker-tabs"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={`tabbed-color-picker-tab ${activeTab === 'text' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('text');
                    setView('swatch');
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {t('colorPickerTextTab') || 'Text'}
                </button>
                <button
                  type="button"
                  className={`tabbed-color-picker-tab ${activeTab === 'outline' ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('outline');
                    setView('swatch');
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {t('colorPickerOutlineTab') || 'Outline'}
                </button>
              </div>

              {/* Outline thickness control (Outline tab only) */}
              {activeTab === 'outline' && onOutlineThicknessChange && (
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end',
                    gap: '8px',
                    padding: '0 16px 8px',
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <label style={{ fontSize: '12px', color: '#d0d0d0' }}>
                    {t('thickness') || 'Thickness'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={outlineThickness ?? 0}
                    onChange={(e) => {
                      e.stopPropagation();
                      const newThickness = Math.max(0, Math.min(20, parseInt(e.target.value) || 0));
                      if (onOutlineThicknessChange) {
                        onOutlineThicknessChange(newThickness);
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className="tabbed-color-picker-thickness-input"
                  />
                </div>
              )}

              {/* Content */}
              <div className="tabbed-color-picker-content">
                {view === 'swatch' ? <SwatchGrid /> : <CustomView />}
              </div>

              {/* Buttons */}
              <div 
                className="tabbed-color-picker-buttons"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {view === 'swatch' ? (
                  <>
                    <button
                      type="button"
                      className="tabbed-color-picker-btn tabbed-color-picker-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView('custom');
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {t('colorPickerCustom') || 'Custom'}
                    </button>
                    <button
                      type="button"
                      className="tabbed-color-picker-btn tabbed-color-picker-btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {t('presetApply') || t('apply') || 'Apply'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="tabbed-color-picker-btn tabbed-color-picker-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView('swatch');
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {t('swatch') || 'Swatch'}
                    </button>
                    <button
                      type="button"
                      className="tabbed-color-picker-btn tabbed-color-picker-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {t('cancel') || t('resetCancelButton') || 'Cancel'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
