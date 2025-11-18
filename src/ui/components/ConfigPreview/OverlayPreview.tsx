import UnifiedOverlayRenderer from '../UnifiedOverlayRenderer';
import type { Overlay, OverlayMetrics } from '../../../types/overlay';
import type { Lang, t as tFunction } from '../../../i18n';
import { lcdToPreview } from '../../../utils/positioning';
import type { AlignmentGuide } from '../../../utils/snapping';
import { canResizeElement } from '../../../utils/resize';
import type { ResizeHandle } from '../../../utils/resize';
import { UndoDot } from 'lucide-react';

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
  activeGuides: AlignmentGuide[];
  resizingElementId: string | null;
  onResizeMouseDown: (elementId: string, handle: ResizeHandle, e: React.MouseEvent) => void;
  rotatingElementId: string | null;
  onRotationMouseDown: (elementId: string, centerX: number, centerY: number, e: React.MouseEvent) => void;
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
  activeGuides,
  onResizeMouseDown,
  rotatingElementId,
  onRotationMouseDown,
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
            {/* Phase 4.2: Alignment guides */}
            {activeGuides.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 1000,
                }}
              >
                {activeGuides.map((guide, index) => {
                  if (guide.type === 'center-x' || guide.type === 'edge-left' || guide.type === 'edge-right') {
                    const x = lcdToPreview(guide.x, offsetScale);
                    return (
                      <div
                        key={`guide-x-${index}`}
                        style={{
                          position: 'absolute',
                          left: `calc(50% + ${x}px)`,
                          top: 0,
                          bottom: 0,
                          width: '1px',
                          background: 'rgba(0, 200, 255, 0.8)',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    );
                  } else if (guide.type === 'center-y' || guide.type === 'edge-top' || guide.type === 'edge-bottom') {
                    const y = lcdToPreview(guide.y, offsetScale);
                    return (
                      <div
                        key={`guide-y-${index}`}
                        style={{
                          position: 'absolute',
                          top: `calc(50% + ${y}px)`,
                          left: 0,
                          right: 0,
                          height: '1px',
                          background: 'rgba(0, 200, 255, 0.8)',
                          transform: 'translateY(-50%)',
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}

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
                  const canResize = canResizeElement(element);
                  const elementAngle = element.angle ?? 0;
                  
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
                  
                  // Resize handle size
                  const handleSize = 8;
                  const handleOffset = handleSize / 2;
                  
                  // Calculate rotated bounding box corners (RBox)
                  // Element center in preview coordinates
                  const centerX = elementX;
                  const centerY = elementY;
                  
                  // Half dimensions
                  const halfWidth = hitAreaWidth / 2;
                  const halfHeight = hitAreaHeight / 2;
                  
                  // Rotation matrix
                  const radians = (elementAngle * Math.PI) / 180;
                  const cos = Math.cos(radians);
                  const sin = Math.sin(radians);
                  
                  // Rotate corner points around origin (0,0), then translate to center
                  const rotatePoint = (x: number, y: number) => {
                    const rotatedX = x * cos - y * sin;
                    const rotatedY = x * sin + y * cos;
                    return {
                      x: centerX + rotatedX,
                      y: centerY + rotatedY,
                    };
                  };
                  
                  // Calculate rotated bounding box corners
                  const rBoxTopLeft = rotatePoint(-halfWidth, -halfHeight);
                  const rBoxTopRight = rotatePoint(halfWidth, -halfHeight);
                  const rBoxBottomRight = rotatePoint(halfWidth, halfHeight);
                  const rBoxBottomLeft = rotatePoint(-halfWidth, halfHeight);
                  
                  // Get element label (same as OverlaySettings)
                  const getElementLabel = (): string => {
                    if (element.type === 'metric') {
                      const metricElements = overlayConfig.elements.filter(el => el.type === 'metric');
                      const metricIndex = metricElements.findIndex(el => el.id === element.id);
                      const readingLabels = [
                        t('firstReading', lang),
                        t('secondReading', lang),
                        t('thirdReading', lang),
                        t('fourthReading', lang),
                        t('fifthReading', lang),
                        t('sixthReading', lang),
                        t('seventhReading', lang),
                        t('eighthReading', lang),
                      ];
                      return readingLabels[metricIndex] || `${metricIndex + 1}${metricIndex === 0 ? 'st' : metricIndex === 1 ? 'nd' : metricIndex === 2 ? 'rd' : 'th'} ${t('reading', lang)}`;
                    } else if (element.type === 'text') {
                      const textElements = overlayConfig.elements.filter(el => el.type === 'text');
                      const textIndex = textElements.findIndex(el => el.id === element.id);
                      const textLabels = [
                        t('firstText', lang),
                        t('secondText', lang),
                        t('thirdText', lang),
                        t('fourthText', lang),
                      ];
                      return textLabels[textIndex] || `${textIndex + 1}${textIndex === 0 ? 'st' : textIndex === 1 ? 'nd' : textIndex === 2 ? 'rd' : 'th'} ${t('text', lang)}`;
                    } else if (element.type === 'divider') {
                      return t('divider', lang) || 'Divider';
                    }
                    return element.type;
                  };

                  return (
                    <div key={element.id}>
                      {/* Element hit area */}
                      <div
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
                          transform: `translate(calc(-50% + ${elementX}px), calc(-50% + ${elementY}px))${elementAngle !== 0 ? ` rotate(${elementAngle}deg)` : ''}`,
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
                      
                      {/* Phase 4.2: Element label - shown when selected */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            // Label positioned at rotated top-left corner
                            // Use absolute coordinates from RBox calculation
                            left: `calc(50% + ${rBoxTopLeft.x}px)`,
                            top: `calc(50% + ${rBoxTopLeft.y}px)`,
                            pointerEvents: 'none',
                            zIndex: (element.zIndex !== undefined ? element.zIndex : 0) + 300,
                            // Parent wrapper: first translate to position, then rotate with bounding box
                            // Transform order: translate (position) -> rotate (orientation)
                            transform: `translate(-7px, calc(-100% - 5px))${elementAngle !== 0 ? ` rotate(${elementAngle}deg)` : ''}`,
                          }}
                        >
                          {/* Child content counter-rotates to keep text upright */}
                          <div
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.5)', // Same color as bounding box outline
                              fontFamily: 'system-ui, -apple-system, sans-serif',
                              fontWeight: 500,
                              whiteSpace: 'nowrap',
                              userSelect: 'none',
                              // Counter-rotate to keep text upright
                              transform: elementAngle !== 0 ? `rotate(${-elementAngle}deg)` : 'none',
                            }}
                          >
                            {getElementLabel()}
                          </div>
                        </div>
                      )}
                      
                      {/* Phase 4.2: Rotation handle - positioned at top-right corner of bounding box */}
                      {isSelected && (
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            // Calculate element center in preview coordinates
                            onRotationMouseDown(element.id, centerX, centerY, e);
                          }}
                          style={{
                            position: 'absolute',
                            // Position at rotated top-right corner + offset
                            // Use absolute coordinates from RBox calculation
                            left: `calc(50% + ${rBoxTopRight.x}px)`,
                            top: `calc(50% + ${rBoxTopRight.y}px)`,
                            transform: (() => {
                              // Offset to place handle outside bounding box
                              const rotationHandleOffset = 10; // 10px outside
                              // For top-right, offset diagonally up-right
                              const offsetX = rotationHandleOffset * (rBoxTopRight.x > centerX ? 1 : -1);
                              const offsetY = rotationHandleOffset * (rBoxTopRight.y < centerY ? -1 : 1);
                              // Parent wrapper rotates with bounding box
                              return `translate(${offsetX}px, ${offsetY}px) translate(-50%, -50%)${elementAngle !== 0 ? ` rotate(${elementAngle}deg)` : ''}`;
                            })(),
                            cursor: rotatingElementId === element.id ? 'grabbing' : 'grab',
                            pointerEvents: 'auto',
                            zIndex: (element.zIndex !== undefined ? element.zIndex : 0) + 250,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {/* Child icon counter-rotates to stay upright */}
                          <div
                            style={{
                              transform: elementAngle !== 0 ? `rotate(${-elementAngle}deg)` : 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <UndoDot size={16} strokeWidth={2.5} color="rgba(0, 200, 255, 0.9)" />
                          </div>
                        </div>
                      )}
                      
                      {/* Phase 4.2: Resize handles */}
                      {isSelected && canResize && (
                        <>
                          {/* Corner handles - exclude top-right (ne) as rotation handle replaces it */}
                          {(['nw', 'sw', 'se'] as ResizeHandle[]).map((handle) => {
                            // Get rotated corner position from RBox
                            let cornerPos: { x: number; y: number };
                            
                            if (handle === 'nw') {
                              cornerPos = rBoxTopLeft;
                            } else if (handle === 'sw') {
                              cornerPos = rBoxBottomLeft;
                            } else if (handle === 'se') {
                              cornerPos = rBoxBottomRight;
                            } else {
                              cornerPos = { x: 0, y: 0 }; // Should not happen
                            }
                            
                            // Calculate offset direction (perpendicular to edge, pointing outward)
                            // For corners, offset diagonally
                            const offsetX = handleOffset * (cornerPos.x > centerX ? 1 : -1);
                            const offsetY = handleOffset * (cornerPos.y > centerY ? 1 : -1);
                            
                            return (
                              <div
                                key={handle}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  onResizeMouseDown(element.id, handle, e);
                                }}
                                style={{
                                  position: 'absolute',
                                  // Position at rotated corner + offset
                                  left: `calc(50% + ${cornerPos.x}px)`,
                                  top: `calc(50% + ${cornerPos.y}px)`,
                                  pointerEvents: 'auto',
                                  zIndex: (element.zIndex !== undefined ? element.zIndex : 0) + 200,
                                  // Parent wrapper rotates with bounding box
                                  transform: `translate(${offsetX}px, ${offsetY}px) translate(-50%, -50%)${elementAngle !== 0 ? ` rotate(${elementAngle}deg)` : ''}`,
                                }}
                              >
                                {/* Child handle box - visual appearance stays consistent */}
                                <div
                                  style={{
                                    width: `${handleSize}px`,
                                    height: `${handleSize}px`,
                                    background: 'rgba(0, 200, 255, 0.9)',
                                    border: '1px solid rgba(255, 255, 255, 0.8)',
                                    borderRadius: '2px',
                                    cursor: `${handle}-resize`,
                                    // Handle box itself doesn't need counter-rotation (it's just a square)
                                    // But we could add it if needed for visual consistency
                                  }}
                                />
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
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

