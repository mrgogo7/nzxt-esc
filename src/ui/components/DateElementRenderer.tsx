import { useState, useEffect, useRef } from 'react';
import type { OverlayElement, DateElementData } from '../../types/overlay';
import { getInitialLang } from '../../i18n';
import styles from '../styles/UnifiedOverlay.module.css';

interface DateElementRendererProps {
  element: OverlayElement;
  data: DateElementData;
  scale?: number;
}

/**
 * Format date according to user-provided format string.
 * Supports common format tokens:
 * - YYYY: 4-digit year
 * - YY: 2-digit year
 * - MM: 2-digit month (01-12)
 * - M: month (1-12)
 * - DD: 2-digit day (01-31)
 * - D: day (1-31)
 * - MMM: Short month name (Jan, Feb, etc.)
 * - MMMM: Full month name (January, February, etc.)
 * - dddd: Full weekday name (Monday, Tuesday, etc.) - uses browser locale
 * - ddd: Short weekday name (Mon, Tue, etc.) - uses browser locale
 * - dd: 2-digit day of week (01-07, where 01=Sunday)
 * - d: Day of week (0-6, where 0=Sunday)
 * All other characters are treated as literals.
 */
function formatDate(format: string, date: Date, locale: string = 'en'): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-11 -> 1-12
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0-6, where 0=Sunday
  
  // Map app language codes to browser locale codes
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'tr': 'tr-TR',
    'es': 'es-ES',
    'de': 'de-DE',
    'pt': 'pt-PT',
    'fr': 'fr-FR',
    'it': 'it-IT',
    'jp': 'ja-JP',
  };
  const browserLocale = localeMap[locale] || 'en-US';
  
  // Get localized month and weekday names using Intl API
  const monthNames = new Intl.DateTimeFormat(browserLocale, { month: 'long' }).formatToParts(date).find(p => p.type === 'month')?.value || '';
  const monthNamesShort = new Intl.DateTimeFormat(browserLocale, { month: 'short' }).formatToParts(date).find(p => p.type === 'month')?.value || '';
  const weekdayNames = new Intl.DateTimeFormat(browserLocale, { weekday: 'long' }).formatToParts(date).find(p => p.type === 'weekday')?.value || '';
  const weekdayNamesShort = new Intl.DateTimeFormat(browserLocale, { weekday: 'short' }).formatToParts(date).find(p => p.type === 'weekday')?.value || '';
  
  // Use a simpler approach: build result character by character to avoid token conflicts
  let result = '';
  let i = 0;
  
  while (i < format.length) {
    // Check for longest tokens first (order matters)
    if (format.substring(i, i + 4) === 'YYYY') {
      result += year.toString();
      i += 4;
    } else if (format.substring(i, i + 4) === 'MMMM') {
      result += monthNames;
      i += 4;
    } else if (format.substring(i, i + 4) === 'dddd') {
      result += weekdayNames;
      i += 4;
    } else if (format.substring(i, i + 3) === 'MMM') {
      result += monthNamesShort;
      i += 3;
    } else if (format.substring(i, i + 3) === 'ddd') {
      result += weekdayNamesShort;
      i += 3;
    } else if (format.substring(i, i + 2) === 'YY') {
      result += year.toString().slice(-2);
      i += 2;
    } else if (format.substring(i, i + 2) === 'MM') {
      result += month.toString().padStart(2, '0');
      i += 2;
    } else if (format.substring(i, i + 2) === 'DD') {
      result += day.toString().padStart(2, '0');
      i += 2;
    } else if (format.substring(i, i + 2) === 'dd') {
      result += (dayOfWeek + 1).toString().padStart(2, '0');
      i += 2;
    } else if (format[i] === 'M') {
      result += month.toString();
      i += 1;
    } else if (format[i] === 'D') {
      result += day.toString();
      i += 1;
    } else if (format[i] === 'd') {
      result += dayOfWeek.toString();
      i += 1;
    } else {
      // Literal character
      result += format[i];
      i += 1;
    }
  }
  
  return result;
}

/**
 * Date element renderer.
 * Updates once per day and formats date according to user's format string.
 */
export default function DateElementRenderer({
  element: _element,
  data,
  scale = 1,
}: DateElementRendererProps) {
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [currentLang, setCurrentLang] = useState<string>(getInitialLang());

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = () => {
      setCurrentLang(getInitialLang());
    };
    
    window.addEventListener('languagechange', handleLanguageChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'nzxtLang') {
        setCurrentLang(getInitialLang());
      }
    });
    
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    // Update once per day (at midnight)
    const updateDate = () => {
      setNow(Date.now());
    };
    
    // Update immediately
    updateDate();
    
    // Calculate milliseconds until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    // Set timeout for next midnight
    const timeoutId = setTimeout(() => {
      updateDate();
      // Then update every 24 hours
      intervalRef.current = setInterval(updateDate, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
    
    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formattedDate = formatDate(data.format, new Date(now), currentLang);
  
  // Check if outline should be applied (same as text element)
  const hasOutline = data.outlineColor && 
    data.outlineColor !== 'transparent' && 
    (data.outlineThickness ?? 0) > 0;
  const outlineThickness = hasOutline ? (data.outlineThickness ?? 0) * scale : 0;
  
  return (
    <div
      className={styles.textElement}
      style={{
        fontSize: `${data.fontSize * scale}px`,
        color: data.color,
        fontFamily: 'nzxt-extrabold',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...(hasOutline && {
          WebkitTextStroke: `${outlineThickness}px ${data.outlineColor}`,
          textStroke: `${outlineThickness}px ${data.outlineColor}`,
          paintOrder: 'stroke fill',
        }),
      }}
    >
      {formattedDate}
    </div>
  );
}

