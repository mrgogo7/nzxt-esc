import { useRef, useCallback, useEffect, useState } from 'react';
import { previewToLcd } from '../../../../utils/positioning';
import { DEFAULT_OVERLAY, type CustomReading, type CustomText, type OverlaySettings } from '../../../../types/overlay';
import type { AppSettings } from '../../../../constants/defaults';

/**
 * Hook for handling custom reading and text drag operations.
 * Supports selection and drag for custom mode items.
 */
export function useCustomItemDrag(
  offsetScale: number,
  overlayConfig: OverlaySettings,
  settings: AppSettings,
  setSettings: (settings: Partial<AppSettings>) => void
) {
  const [draggingReadingId, setDraggingReadingId] = useState<string | null>(null);
  const [draggingTextId, setDraggingTextId] = useState<string | null>(null);
  const [selectedReadingId, setSelectedReadingId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const customReadingDragStart = useRef<{ x: number; y: number; readingId: string } | null>(null);
  const customTextDragStart = useRef<{ x: number; y: number; textId: string } | null>(null);
  const settingsRef = useRef(settings);

  // Keep settings ref in sync
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const handleCustomReadingMouseDown = useCallback(
    (e: React.MouseEvent, readingId: string) => {
      e.preventDefault();
      e.stopPropagation();

      // If already selected, start dragging immediately
      if (selectedReadingId === readingId) {
        setDraggingReadingId(readingId);
        customReadingDragStart.current = { x: e.clientX, y: e.clientY, readingId };
      } else {
        // First click: just select, don't start dragging
        setSelectedReadingId(readingId);
        setSelectedTextId(null); // Deselect text if reading is selected
      }
    },
    [selectedReadingId]
  );

  const handleCustomReadingMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!customReadingDragStart.current) return;

      const dx = e.clientX - customReadingDragStart.current.x;
      const dy = e.clientY - customReadingDragStart.current.y;
      customReadingDragStart.current = { ...customReadingDragStart.current, x: e.clientX, y: e.clientY };

      // CRITICAL: Convert preview pixels to LCD pixels
      const lcdDx = previewToLcd(dx, offsetScale);
      const lcdDy = previewToLcd(dy, offsetScale);

      // Use ref to get current settings value
      const currentSettings = settingsRef.current;
      const currentOverlay = currentSettings.overlay || DEFAULT_OVERLAY;
      const currentReadings = currentOverlay.customReadings || [];
      const readingIndex = currentReadings.findIndex(
        (r) => r.id === customReadingDragStart.current!.readingId
      );

      if (readingIndex !== -1) {
        const updatedReadings = [...currentReadings];
        updatedReadings[readingIndex] = {
          ...updatedReadings[readingIndex],
          x: updatedReadings[readingIndex].x + lcdDx,
          y: updatedReadings[readingIndex].y + lcdDy,
        };
        setSettings({
          ...currentSettings,
          overlay: {
            ...currentOverlay,
            customReadings: updatedReadings,
          },
        });
      }
    },
    [offsetScale, setSettings]
  );

  const handleCustomReadingMouseUp = useCallback(() => {
    setDraggingReadingId(null);
    customReadingDragStart.current = null;
    // Keep selected after drag ends - user can click again to drag
  }, []);

  const handleCustomTextMouseDown = useCallback(
    (e: React.MouseEvent, textId: string) => {
      e.preventDefault();
      e.stopPropagation();

      // If already selected, start dragging immediately
      if (selectedTextId === textId) {
        setDraggingTextId(textId);
        customTextDragStart.current = { x: e.clientX, y: e.clientY, textId };
      } else {
        // First click: just select, don't start dragging
        setSelectedTextId(textId);
        setSelectedReadingId(null); // Deselect reading if text is selected
      }
    },
    [selectedTextId]
  );

  const handleCustomTextMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!customTextDragStart.current) return;

      const dx = e.clientX - customTextDragStart.current.x;
      const dy = e.clientY - customTextDragStart.current.y;
      customTextDragStart.current = { ...customTextDragStart.current, x: e.clientX, y: e.clientY };

      const lcdDx = previewToLcd(dx, offsetScale);
      const lcdDy = previewToLcd(dy, offsetScale);

      const currentSettings = settingsRef.current;
      const currentOverlay = currentSettings.overlay || DEFAULT_OVERLAY;
      const currentTexts = currentOverlay.customTexts || [];
      const textIndex = currentTexts.findIndex((t) => t.id === customTextDragStart.current!.textId);

      if (textIndex !== -1) {
        const updatedTexts = [...currentTexts];
        updatedTexts[textIndex] = {
          ...updatedTexts[textIndex],
          x: updatedTexts[textIndex].x + lcdDx,
          y: updatedTexts[textIndex].y + lcdDy,
        };
        setSettings({
          ...currentSettings,
          overlay: {
            ...currentOverlay,
            customTexts: updatedTexts,
          },
        });
      }
    },
    [offsetScale, setSettings]
  );

  const handleCustomTextMouseUp = useCallback(() => {
    setDraggingTextId(null);
    customTextDragStart.current = null;
    // Keep selected after drag ends - user can click again to drag
  }, []);

  // Set up event listeners for reading drag
  useEffect(() => {
    if (draggingReadingId) {
      window.addEventListener('mousemove', handleCustomReadingMouseMove);
      window.addEventListener('mouseup', handleCustomReadingMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleCustomReadingMouseMove);
        window.removeEventListener('mouseup', handleCustomReadingMouseUp);
      };
    }
  }, [draggingReadingId, handleCustomReadingMouseMove, handleCustomReadingMouseUp]);

  // Set up event listeners for text drag
  useEffect(() => {
    if (draggingTextId) {
      window.addEventListener('mousemove', handleCustomTextMouseMove);
      window.addEventListener('mouseup', handleCustomTextMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleCustomTextMouseMove);
        window.removeEventListener('mouseup', handleCustomTextMouseUp);
      };
    }
  }, [draggingTextId, handleCustomTextMouseMove, handleCustomTextMouseUp]);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if click is inside Overlay Options area
      const overlayOptionsArea = target.closest('.overlay-options-area');
      const isReading = target.closest('[data-reading-id]');
      const isText = target.closest('[data-text-id]');

      // If clicking outside Overlay Options area (and not on a reading/text), deselect and stop drag
      if (!overlayOptionsArea && !isReading && !isText) {
        // Stop any active drag
        if (draggingReadingId) {
          setDraggingReadingId(null);
          customReadingDragStart.current = null;
        }
        if (draggingTextId) {
          setDraggingTextId(null);
          customTextDragStart.current = null;
        }

        // Deselect
        setSelectedReadingId(null);
        setSelectedTextId(null);
      }
    };

    if (selectedReadingId || selectedTextId || draggingReadingId || draggingTextId) {
      window.addEventListener('mousedown', handleClickOutside);
      return () => {
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [selectedReadingId, selectedTextId, draggingReadingId, draggingTextId]);

  return {
    draggingReadingId,
    draggingTextId,
    selectedReadingId,
    selectedTextId,
    handleCustomReadingMouseDown,
    handleCustomTextMouseDown,
  };
}

