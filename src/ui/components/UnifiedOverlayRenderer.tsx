/**
 * UnifiedOverlayRenderer
 * 
 * Renders overlay elements from an element array.
 * 
 * This component is responsible for rendering all overlay elements in the correct
 * z-index order with proper transform application.
 * 
 * Transform Order (Bug #3 Fix):
 * - CSS transforms are applied right-to-left
 * - Correct order: translate first, then rotate
 * - This ensures element is positioned correctly before rotation
 * 
 * Enhanced memoization for static overlays.
 * - Caches render results based on element structure (not metric values)
 * - Skips re-render when only metric values change (for static text/divider elements)
 * - Always re-renders when element structure changes or during transforms
 */

import { memo, useMemo } from 'react';
import type { Overlay, OverlayMetrics } from '../../types/overlay';
import OverlayElementRenderer from './OverlayElementRenderer';


interface UnifiedOverlayRendererProps {
  overlay: Overlay;
  metrics: OverlayMetrics;
  scale?: number;
  /**
   * Flag to disable caching during active transforms.
   * When true, forces re-render even if element structure hasn't changed.
   */
  isTransformActive?: boolean;
}

/**
 * Creates a cache key from element structure (excluding metric values).
 * This allows caching static overlays while still updating metric displays.
 */
function createElementCacheKey(elements: Array<{ id: string; type: string; x: number; y: number; angle?: number; zIndex?: number; data?: any }>): string {
  if (!Array.isArray(elements) || elements.length === 0) {
    return 'empty';
  }
  
  // Create key from element structure (id, type, position, size, style) but NOT metric values
  const keyParts = elements.map(el => {
    const base = {
      id: el.id,
      type: el.type,
      x: el.x,
      y: el.y,
      angle: el.angle ?? 0,
      zIndex: el.zIndex ?? 0,
    };
    
    // Include element-specific structure (size, color, etc.) but not metric values
    if (el.type === 'metric') {
      return JSON.stringify({
        ...base,
        metricKey: el.data?.metricKey,
        numberSize: el.data?.numberSize,
        color: el.data?.color,
        // Explicitly exclude metric VALUE - that's in metrics prop
      });
    } else if (el.type === 'text') {
      return JSON.stringify({
        ...base,
        text: el.data?.text,
        textSize: el.data?.textSize,
        color: el.data?.color,
      });
    } else if (el.type === 'divider') {
      return JSON.stringify({
        ...base,
        width: el.data?.width,
        height: el.data?.height,
        color: el.data?.color,
      });
    }
    return JSON.stringify(base);
  });
  
  return JSON.stringify(keyParts.sort((a, b) => a.localeCompare(b)));
}


/**
 * UnifiedOverlayRenderer
 * Renders all overlay elements in the correct z-index order.
 */
function UnifiedOverlayRenderer({
  overlay,
  metrics,
  scale = 1,
  isTransformActive = false,
}: UnifiedOverlayRendererProps) {
  void isTransformActive; // Keep prop for API stability
  // DEFENSIVE: Ensure overlay.elements is always an array
  const safeElements = Array.isArray(overlay.elements) ? overlay.elements : [];
  
  // CRITICAL: All hooks must be called unconditionally before any early returns
  // This ensures React hooks order is stable across all renders
  
  // Sort elements by zIndex (default to array index if not set)
  // Must be called unconditionally - even if we return early
  const sortedElements = useMemo(() => {
    return [...safeElements].sort((a, b) => {
      const aZ = a.zIndex !== undefined ? a.zIndex : safeElements.indexOf(a);
      const bZ = b.zIndex !== undefined ? b.zIndex : safeElements.indexOf(b);
      return aZ - bZ;
    });
  }, [safeElements]);

  // NOW we can do early returns after all hooks are called
  if (overlay.mode === 'none' || safeElements.length === 0) {
    return null;
  }

  // Memoize element list to prevent unnecessary re-renders
  // The cache key ensures we only re-render when structure changes, not metric values
  return (
    <>
      {sortedElements.map((element) => {
        const angle = element.angle ?? 0;
        
        // Transform order: translate → rotate (applied right-to-left in CSS)
        // WHY: We position the element first, then rotate it around its center.
        // This ensures rotated elements appear at the correct position.
        const transform = angle !== 0
          ? `translate(calc(-50% + ${element.x * scale}px), calc(-50% + ${element.y * scale}px)) rotate(${angle}deg)`
          : `translate(calc(-50% + ${element.x * scale}px), calc(-50% + ${element.y * scale}px))`;
        
        return (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: '50%',  // Center of preview circle
              top: '50%',   // Center of preview circle
              transform,    // Position and rotate element
              transformOrigin: 'center center', // Rotate around center
              pointerEvents: 'none', // Elements don't capture mouse events (handled by OverlayPreview)
              zIndex: element.zIndex !== undefined ? element.zIndex : 0,
            }}
          >
            <OverlayElementRenderer
              element={element}
              metrics={metrics}
              scale={scale}
            />
          </div>
        );
      })}
    </>
  );
}

// Enhanced memoization - compare element structure
// Note: We still allow re-renders when metrics change so metric elements can update
// OverlayElementRenderer has its own memoization to handle metric updates efficiently
export default memo(UnifiedOverlayRenderer, (prevProps, nextProps) => {
  // Always re-render if transform is active
  if (nextProps.isTransformActive || prevProps.isTransformActive) {
    return false; // Re-render
  }
  
  // Compare element structure (cache key)
  const prevKey = createElementCacheKey(prevProps.overlay.elements);
  const nextKey = createElementCacheKey(nextProps.overlay.elements);
  
  if (prevKey !== nextKey) {
    return false; // Re-render - structure changed
  }
  
  // Compare scale
  if (prevProps.scale !== nextProps.scale) {
    return false; // Re-render - scale changed
  }
  
  // Compare overlay mode
  if (prevProps.overlay.mode !== nextProps.overlay.mode) {
    return false; // Re-render - mode changed
  }
  
  // Structure is the same - allow re-render to pass new metrics
  // OverlayElementRenderer will handle its own memoization for metric updates
  return false; // Re-render to pass new metrics (OverlayElementRenderer handles its own memoization)
});
