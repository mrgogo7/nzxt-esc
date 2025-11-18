import UnifiedOverlayRenderer from '../UnifiedOverlayRenderer';
import type { Overlay, OverlayMetrics } from '../../../types/overlay';
import type { Lang, t as tFunction } from '../../../i18n';
import { lcdToPreview } from '../../../utils/positioning';

interface OverlayPreviewProps {
  overlayConfig: Overlay;
  metrics: OverlayMetrics;
  overlayPreviewScale: number;
  offsetScale: number;
  overlayAdjX: number;
  overlayAdjY: number;
  draggingElementId: string | null;
  selectedElementId: string | null;
  onElementMouseDown: (elementId: string, e: React.MouseEvent) => void;
  isRealDataReceived: boolean;
  lang: Lang;
  t: typeof tFunction;
}

/**
 * Overlay preview component.
 * Displays overlay preview with element-based rendering and drag support.
 * 
 * FAZ3: Fully migrated to element-based system.
 * - Uses UnifiedOverlayRenderer for all element types
 * - Unified element drag handlers for all element types
 * - Element-based hit area calculation
 */
export default function OverlayPreview({
  overlayConfig,
  metrics,
  overlayPreviewScale,
  offsetScale,
  overlayAdjX,
  overlayAdjY,
  draggingElementId,
  selectedElementId,
  onElementMouseDown,
  isRealDataReceived,
  lang,
  t,
}: OverlayPreviewProps) {
  return (
    <div className="preview-column">
      {overlayConfig.mode !== 'none' ? (
        <>
          <div className="preview-title">{t('overlayPreviewTitle', lang)}</div>
          <div
            className={`preview-circle overlay-preview ${draggingElementId ? 'dragging' : ''}`}
            style={{ position: 'relative', width: '200px', height: '200px' }}
          >
            {/* Unified overlay renderer for all elements */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translate(${overlayAdjX}px, ${overlayAdjY}px)`,
                pointerEvents: 'none',
              }}
            >
              <UnifiedOverlayRenderer
                overlay={overlayConfig}
                metrics={metrics}
                scale={overlayPreviewScale}
              />
            </div>
            
            {/* Unified element drag handlers for all element types */}
            {overlayConfig.mode === 'custom' && overlayConfig.elements && overlayConfig.elements.length > 0 && (
              <>
                {overlayConfig.elements.map((element) => {
                  const elementX = lcdToPreview(element.x, offsetScale);
                  const elementY = lcdToPreview(element.y, offsetScale);
                  const isDraggingThis = draggingElementId === element.id;
                  const isSelected = selectedElementId === element.id;
                  
                  // Calculate hit area based on element type
                  let hitAreaWidth = 100;
                  let hitAreaHeight = 100;
                  
                  if (element.type === 'metric') {
                    const data = element.data as any;
                    const scaledNumberSize = (data.numberSize || 180) * overlayPreviewScale;
                    hitAreaWidth = scaledNumberSize * 1.5;
                    hitAreaHeight = scaledNumberSize * 0.85;
                  } else if (element.type === 'text') {
                    const data = element.data as any;
                    const scaledTextSize = (data.textSize || 45) * overlayPreviewScale;
                    hitAreaWidth = Math.max(scaledTextSize * (data.text?.length || 0) * 0.6, scaledTextSize * 2);
                    hitAreaHeight = scaledTextSize * 1.2;
                  } else if (element.type === 'divider') {
                    const data = element.data as any;
                    hitAreaWidth = data.thickness || 2;
                    hitAreaHeight = 200; // Full height for vertical divider
                  }
                  
                  return (
                    <div
                      key={element.id}
                      data-element-id={element.id}
                      onMouseDown={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const clickY = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const distanceX = Math.abs(clickX - centerX);
                        const distanceY = Math.abs(clickY - centerY);
                        if (distanceX < hitAreaWidth / 2 && distanceY < hitAreaHeight / 2) {
                          onElementMouseDown(element.id, e);
                        }
                      }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: `${hitAreaWidth}px`,
                        height: `${hitAreaHeight}px`,
                        transform: `translate(calc(-50% + ${elementX}px), calc(-50% + ${elementY}px))`,
                        cursor: isDraggingThis ? 'grabbing' : (isSelected ? 'move' : 'grab'),
                        pointerEvents: 'auto',
                        zIndex: element.zIndex !== undefined ? element.zIndex + 100 : 100,
                        outline: (isDraggingThis || isSelected) ? '2px dashed rgba(255, 255, 255, 0.5)' : 'none',
                        outlineOffset: (isDraggingThis || isSelected) ? '4px' : '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  );
                })}
              </>
            )}
          </div>
          {/* Mock data warning */}
          {!isRealDataReceived && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'rgba(255, 193, 7, 0.15)',
                border: '1px solid rgba(255, 193, 7, 0.3)',
                borderRadius: '8px',
                color: '#ffc107',
                fontSize: '11px',
                lineHeight: '1.4',
                textAlign: 'center',
                maxWidth: '200px',
              }}
            >
              {t('mockDataWarning', lang)}
            </div>
          )}
        </>
      ) : (
        <div className="preview-title" style={{ opacity: 0.5 }}>
          {t('overlayPreviewTitle', lang)} - {t('overlayMode', lang)}: None
        </div>
      )}
    </div>
  );
}

