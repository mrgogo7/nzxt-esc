/**
 * UnifiedOverlayRenderer
 * Renders overlay elements from an element array.
 * 
 * FAZ1: Simple rendering pipeline - visual accuracy is NOT critical.
 * The goal is to display elements on screen with z-index ordering.
 * 
 * Phase 4.2: Performance optimization with memoization.
 */

import { memo } from 'react';
import type { Overlay, OverlayMetrics } from '../../types/overlay';
import OverlayElementRenderer from './OverlayElementRenderer';

interface UnifiedOverlayRendererProps {
  overlay: Overlay;
  metrics: OverlayMetrics;
  scale?: number;
}

/**
 * UnifiedOverlayRenderer
 * Renders all overlay elements in the correct z-index order.
 */
function UnifiedOverlayRenderer({
  overlay,
  metrics,
  scale = 1,
}: UnifiedOverlayRendererProps) {
  if (overlay.mode === 'none' || !overlay.elements || overlay.elements.length === 0) {
    return null;
  }

  // Sort elements by zIndex (default to array index if not set)
  const sortedElements = [...overlay.elements].sort((a, b) => {
    const aZ = a.zIndex !== undefined ? a.zIndex : overlay.elements.indexOf(a);
    const bZ = b.zIndex !== undefined ? b.zIndex : overlay.elements.indexOf(b);
    return aZ - bZ;
  });

  return (
    <>
      {sortedElements.map((element) => {
        const angle = element.angle ?? 0;
        // Apply rotation before translation (rotate around center, then translate)
        const transform = angle !== 0
          ? `translate(calc(-50% + ${element.x * scale}px), calc(-50% + ${element.y * scale}px)) rotate(${angle}deg)`
          : `translate(calc(-50% + ${element.x * scale}px), calc(-50% + ${element.y * scale}px))`;
        
        return (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform,
              pointerEvents: 'none',
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

// Phase 4.2: Memoize to prevent unnecessary re-renders
export default memo(UnifiedOverlayRenderer);

