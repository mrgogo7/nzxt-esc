import { useRef, useCallback, useEffect, useState } from 'react';
import { previewToLcd } from '../../../../utils/positioning';
import { DEFAULT_OVERLAY, type OverlaySettings } from '../../../../types/overlay';
import type { AppSettings } from '../../../../constants/defaults';

/**
 * Hook for handling overlay drag operations.
 * Supports single, dual, and triple modes with different drag behaviors.
 */
export function useOverlayDrag(
  offsetScale: number,
  overlayConfig: OverlaySettings,
  settings: AppSettings,
  setSettings: (settings: Partial<AppSettings>) => void
) {
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
  const [isDraggingSecondaryTertiary, setIsDraggingSecondaryTertiary] = useState(false);
  
  const overlayDragStart = useRef<{ x: number; y: number } | null>(null);
  const secondaryTertiaryDragStart = useRef<{ x: number; y: number } | null>(null);
  const settingsRef = useRef(settings);

  // Keep settings ref in sync
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Don't handle drag for custom mode - each reading has its own drag handler
      if (overlayConfig.mode === 'custom') {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // For triple and dual modes, determine which section to drag based on click position
      if (overlayConfig.mode === 'triple' || overlayConfig.mode === 'dual') {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const centerX = rect.width / 2;

        // If clicked on right half, drag secondary (dual) or secondary/tertiary (triple)
        if (clickX > centerX) {
          secondaryTertiaryDragStart.current = { x: e.clientX, y: e.clientY };
          setIsDraggingSecondaryTertiary(true);
        } else {
          // Left half or center: drag primary/divider
          overlayDragStart.current = { x: e.clientX, y: e.clientY };
          setIsDraggingOverlay(true);
        }
      } else {
        // For single mode, drag entire overlay
        overlayDragStart.current = { x: e.clientX, y: e.clientY };
        setIsDraggingOverlay(true);
      }
    },
    [overlayConfig.mode]
  );

  const handleOverlayMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!overlayDragStart.current) return;

      const dx = e.clientX - overlayDragStart.current.x;
      const dy = e.clientY - overlayDragStart.current.y;
      overlayDragStart.current = { x: e.clientX, y: e.clientY };

      // CRITICAL: Convert preview pixels to LCD pixels for overlay (same as background)
      const lcdDx = previewToLcd(dx, offsetScale);
      const lcdDy = previewToLcd(dy, offsetScale);

      // Use ref to get current settings value
      const currentSettings = settingsRef.current;
      const currentOverlay = currentSettings.overlay || DEFAULT_OVERLAY;
      setSettings({
        ...currentSettings,
        overlay: {
          ...currentOverlay,
          x: (currentOverlay.x || 0) + lcdDx,
          y: (currentOverlay.y || 0) + lcdDy,
        },
      });
    },
    [offsetScale, setSettings]
  );

  const handleSecondaryTertiaryMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!secondaryTertiaryDragStart.current) return;

      const dx = e.clientX - secondaryTertiaryDragStart.current.x;
      const dy = e.clientY - secondaryTertiaryDragStart.current.y;
      secondaryTertiaryDragStart.current = { x: e.clientX, y: e.clientY };

      // CRITICAL: Convert preview pixels to LCD pixels
      const lcdDx = previewToLcd(dx, offsetScale);
      const lcdDy = previewToLcd(dy, offsetScale);

      // Use ref to get current settings value
      const currentSettings = settingsRef.current;
      const currentOverlay = currentSettings.overlay || DEFAULT_OVERLAY;

      // For dual mode, update secondaryOffsetX/Y; for triple mode, update dualReadersOffsetX/Y
      if (currentOverlay.mode === 'dual') {
        setSettings({
          ...currentSettings,
          overlay: {
            ...currentOverlay,
            secondaryOffsetX: (currentOverlay.secondaryOffsetX || 0) + lcdDx,
            secondaryOffsetY: (currentOverlay.secondaryOffsetY || 0) + lcdDy,
          },
        });
      } else if (currentOverlay.mode === 'triple') {
        setSettings({
          ...currentSettings,
          overlay: {
            ...currentOverlay,
            dualReadersOffsetX: (currentOverlay.dualReadersOffsetX || 0) + lcdDx,
            dualReadersOffsetY: (currentOverlay.dualReadersOffsetY || 0) + lcdDy,
          },
        });
      }
    },
    [offsetScale, setSettings]
  );

  const handleOverlayMouseUp = useCallback(() => {
    setIsDraggingOverlay(false);
    overlayDragStart.current = null;
  }, []);

  const handleSecondaryTertiaryMouseUp = useCallback(() => {
    setIsDraggingSecondaryTertiary(false);
    secondaryTertiaryDragStart.current = null;
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (isDraggingOverlay) {
      window.addEventListener('mousemove', handleOverlayMouseMove);
      window.addEventListener('mouseup', handleOverlayMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleOverlayMouseMove);
        window.removeEventListener('mouseup', handleOverlayMouseUp);
      };
    }
  }, [isDraggingOverlay, handleOverlayMouseMove, handleOverlayMouseUp]);

  useEffect(() => {
    if (isDraggingSecondaryTertiary) {
      window.addEventListener('mousemove', handleSecondaryTertiaryMouseMove);
      window.addEventListener('mouseup', handleSecondaryTertiaryMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleSecondaryTertiaryMouseMove);
        window.removeEventListener('mouseup', handleSecondaryTertiaryMouseUp);
      };
    }
  }, [isDraggingSecondaryTertiary, handleSecondaryTertiaryMouseMove, handleSecondaryTertiaryMouseUp]);

  return {
    isDraggingOverlay,
    isDraggingSecondaryTertiary,
    handleOverlayMouseDown,
  };
}

