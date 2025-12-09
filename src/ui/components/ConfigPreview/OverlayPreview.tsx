import UnifiedOverlayRenderer from '../UnifiedOverlayRenderer';
import type { Overlay, OverlayMetrics } from '../../../types/overlay';
import type { Lang } from '@/i18n';
import { useI18n } from '@/i18n/useI18n';
import type { AppSettings } from '../../../constants/defaults';
import { lcdToPreview } from '../../../utils/positioning';
import { screenToLcd } from '../../../transform/engine/CoordinateSystem';
import type { AlignmentGuide } from '../../../utils/snapping';
import { canResizeElement } from '../../../utils/resize';
import { RotateCw } from 'lucide-react';
import BackgroundMediaRenderer from './BackgroundMediaRenderer';
import { 
  calculateAABB,
  isPointInRotatedBoundingBox,
  calculateElementDimensions,
} from '../../../transform/engine/BoundingBox';
import { 
  type ResizeHandle,
} from '../../../transform/engine/HandlePositioning';
import '../../styles/TransformHandles.css';
import '../../styles/BoundingBox.css';

/**
 * Hitbox v2 Phase 1 constants.
 * 
 * Consistent padding and minimum size for all element types to improve clickability.
 */
const HITBOX_PADDING_PX = 6;     // Consistent padding for ALL element types (preview pixels)
const MIN_HIT_AREA_PX = 16;      // Minimum clickable area (preview pixels)

interface OverlayPreviewProps {
  overlayConfig: Overlay;
  metrics: OverlayMetrics;
  overlayPreviewScale: number;
  offsetScale: number;
  overlayAdjX: number;
  overlayAdjY: number;
  draggingElementId: string | null;
  selectedElementId: string | null;
  selectedIds?: string[];
  onElementMouseDown: (elementId: string, e: React.MouseEvent) => void;
  activeGuides: AlignmentGuide[];
  resizingElementId: string | null;
  onResizeMouseDown: (elementId: string, handle: ResizeHandle, e: React.MouseEvent) => void;
  rotatingElementId: string | null;
  onRotationMouseDown: (elementId: string, centerX: number, centerY: number, e: React.MouseEvent) => void;
  isRealDataReceived: boolean;
  lang: Lang;
  settings: AppSettings;
  mediaUrl: string | null;
  isVideo: boolean;
  objectPosition: string;
  showBackgroundInOverlayPreview: boolean;
  setShowBackgroundInOverlayPreview: (value: boolean) => void;
  overlayBackgroundOpacity: number;
  setOverlayBackgroundOpacity: (value: number) => void;
}

/**
 * Overlay preview component.
 * Displays overlay preview with element-based rendering and drag support.
 * 
 * Fully migrated to element-based system:
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
  selectedIds: selectedIdsProp,
  onElementMouseDown,
  activeGuides,
  resizingElementId,
  onResizeMouseDown,
  rotatingElementId,
  onRotationMouseDown,
  isRealDataReceived,
  lang,
  settings,
  mediaUrl,
  isVideo,
  objectPosition,
  showBackgroundInOverlayPreview,
  setShowBackgroundInOverlayPreview,
  overlayBackgroundOpacity,
  setOverlayBackgroundOpacity,
}: OverlayPreviewProps) {
  const t = useI18n();
  return (
    <div className="preview-column">
      {overlayConfig.mode !== 'none' ? (
        <>
          {/* Header row: title on left, switch on right */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%',
            marginBottom: '8px',
            position: 'relative'
          }}>
            <div className="preview-title" style={{ margin: 0, position: 'relative', left: 'auto' }}>
              {t('overlayPreviewTitle')}
            </div>
            <div className="overlay-toggle-compact">
              <span>{t('showBackground')}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={showBackgroundInOverlayPreview}
                  onChange={(e) => setShowBackgroundInOverlayPreview(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>
          </div>
          
          {/* Background Opacity slider - below title, independent from switch */}
          {/* Fixed height container to prevent layout jump */}
          <div className="overlay-opacity-row" style={{ 
            width: '100%', 
            marginBottom: '-12px',
            minHeight: '36px',
            display: 'flex',
            alignItems: 'center'
          }}>
            {showBackgroundInOverlayPreview && (
              <div className="setting-row" style={{ margin: 0, width: '100%' }}>
                <label style={{ fontSize: '12px', color: '#a0a0a0', whiteSpace: 'nowrap' }}>{t('backgroundOpacity')}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={overlayBackgroundOpacity}
                  onChange={(e) => setOverlayBackgroundOpacity(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '4px',
                    background: '#2c2c2c',
                    borderRadius: '2px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: '12px', color: '#a0a0a0', minWidth: '40px', textAlign: 'right' }}>
                  {(overlayBackgroundOpacity * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
          
          {/* Preview circle */}
          <div className="nzxt-glow-wrapper">
            <div
              className={`preview-circle overlay-preview ${draggingElementId ? 'dragging' : ''}`}
              style={{ 
                position: 'relative', 
                width: '200px', 
                height: '200px',
                backgroundColor: settings.backgroundColor || '#000000',
              }}
            >
            {/* Background media - rendered behind overlay when enabled */}
            {showBackgroundInOverlayPreview && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              >
                <BackgroundMediaRenderer
                  mediaUrl={mediaUrl}
                  settings={settings}
                  isVideo={isVideo}
                  objectPosition={objectPosition}
                  opacity={overlayBackgroundOpacity}
                  offsetScale={offsetScale}
                />
              </div>
            )}
            
            {/* Alignment guides */}
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
                zIndex: 1,
                opacity: 1,
              }}
            >
              <UnifiedOverlayRenderer
                overlay={overlayConfig}
                metrics={metrics}
                scale={overlayPreviewScale}
                isTransformActive={!!(draggingElementId || resizingElementId || rotatingElementId)}
              />
            </div>
            
            {/* Unified element drag handlers for all element types */}
            {overlayConfig.mode === 'custom' && Array.isArray(overlayConfig.elements) && overlayConfig.elements.length > 0 && (
              <>
                {overlayConfig.elements.map((element) => {
                  const elementX = lcdToPreview(element.x, offsetScale);
                  const elementY = lcdToPreview(element.y, offsetScale);
                  const isDraggingThis = draggingElementId === element.id;
                  // Support multi-select visual feedback
                  // Use selectedIds if provided, otherwise fallback to selectedElementId for backward compatibility
                  const selectedIds = selectedIdsProp ?? (selectedElementId ? [selectedElementId] : []);
                  const isSelected = selectedIds.includes(element.id);
                  const isResizingThis = resizingElementId === element.id;
                  const isRotatingThis = rotatingElementId === element.id;
                  const canResize = canResizeElement(element);
                  
                  // Calculate AABB (Axis-Aligned Bounding Box) for element
                  // WHY: AABB is used for visual bounding box (Figma-style).
                  // Even when elements are rotated, the bounding box remains axis-aligned.
                  const aabb = calculateAABB(element);
                  
                  // Convert AABB to preview coordinates for rendering
                  const aabbAtPosition = {
                    left: elementX + lcdToPreview(aabb.left, offsetScale),
                    right: elementX + lcdToPreview(aabb.right, offsetScale),
                    top: elementY + lcdToPreview(aabb.top, offsetScale),
                    bottom: elementY + lcdToPreview(aabb.bottom, offsetScale),
                    width: lcdToPreview(aabb.width, offsetScale),
                    height: lcdToPreview(aabb.height, offsetScale),
                  };
                  
                  // Calculate hit area based on AABB (for selection)
                  // WHY: AABB is used for hit detection (Figma-style). This ensures consistent
                  // selection behavior regardless of element rotation.
                  // 
                  // Apply consistent padding to all element types and enforce minimum clickable area
                  const paddedWidth = aabbAtPosition.width + (HITBOX_PADDING_PX * 2);
                  const paddedHeight = aabbAtPosition.height + (HITBOX_PADDING_PX * 2);
                  const hitAreaWidth = Math.max(paddedWidth, MIN_HIT_AREA_PX);
                  const hitAreaHeight = Math.max(paddedHeight, MIN_HIT_AREA_PX);
                  
                  // Get element label (same as OverlaySettings)
                  const getElementLabel = (): string => {
                    if (element.type === 'metric') {
                      const metricElements = overlayConfig.elements.filter(el => el.type === 'metric');
                      const metricIndex = metricElements.findIndex(el => el.id === element.id);
                      const metricLabels = [
                        t('firstMetric'),
                        t('secondMetric'),
                        t('thirdMetric'),
                        t('fourthMetric'),
                        t('fifthMetric'),
                        t('sixthMetric'),
                        t('seventhMetric'),
                        t('eighthMetric'),
                      ];
                      return metricLabels[metricIndex] || `${metricIndex + 1}${metricIndex === 0 ? 'st' : metricIndex === 1 ? 'nd' : metricIndex === 2 ? 'rd' : 'th'} ${t('metric')}`;
                    } else if (element.type === 'text') {
                      const textElements = overlayConfig.elements.filter(el => el.type === 'text');
                      const textIndex = textElements.findIndex(el => el.id === element.id);
                      const textLabels = [
                        t('firstText'),
                        t('secondText'),
                        t('thirdText'),
                        t('fourthText'),
                      ];
                      return textLabels[textIndex] || `${textIndex + 1}${textIndex === 0 ? 'st' : textIndex === 1 ? 'nd' : textIndex === 2 ? 'rd' : 'th'} ${t('text')}`;
                    } else if (element.type === 'divider') {
                      return t('divider');
                    } else if (element.type === 'clock') {
                      const clockElements = overlayConfig.elements.filter(el => el.type === 'clock');
                      const clockIndex = clockElements.findIndex(el => el.id === element.id);
                      const clockLabels = [
                        t('firstClock'),
                        t('secondClock'),
                        t('thirdClock'),
                        t('fourthClock'),
                      ];
                      return clockLabels[clockIndex] || `${clockIndex + 1}${clockIndex === 0 ? 'st' : clockIndex === 1 ? 'nd' : clockIndex === 2 ? 'rd' : 'th'} ${t('clock')}`;
                    } else if (element.type === 'date') {
                      const dateElements = overlayConfig.elements.filter(el => el.type === 'date');
                      const dateIndex = dateElements.findIndex(el => el.id === element.id);
                      const dateLabels = [
                        t('firstDate'),
                        t('secondDate'),
                        t('thirdDate'),
                        t('fourthDate'),
                      ];
                      return dateLabels[dateIndex] || `${dateIndex + 1}${dateIndex === 0 ? 'st' : dateIndex === 1 ? 'nd' : dateIndex === 2 ? 'rd' : 'th'} ${t('date')}`;
                    }
                    return element.type;
                  };

                  return (
                    <div key={element.id}>
                      {/* Element hit area - using AABB (Figma-style) */}
                      {/* Hitbox v2 Phase 1 — consistent padding for all element types */}
                      {(() => {
                        const hitAreaLeft = aabbAtPosition.left - HITBOX_PADDING_PX;
                        const hitAreaTop = aabbAtPosition.top - HITBOX_PADDING_PX;
                        
                        return (
                          <div
                            data-element-id={element.id}
                            onMouseDown={(e) => {
                              // Hitbox v2 Phase 2 — rotation-aware hit test
                              // For rotated elements, verify click is actually inside rotated shape
                              const elementAngle = element.angle ?? 0;
                              if (elementAngle !== 0) {
                                // Get preview container for coordinate conversion
                                const previewContainer = document.querySelector('.overlay-preview');
                                if (previewContainer) {
                                  const previewRect = previewContainer.getBoundingClientRect();
                                  
                                  // Convert mouse position to LCD coordinates
                                  const clickPointLcd = screenToLcd(
                                    e.clientX,
                                    e.clientY,
                                    previewRect,
                                    offsetScale
                                  );
                                  
                                  // Test if click is inside rotated bounding box
                                  // Note: isPointInRotatedBoundingBox uses actual element dimensions
                                  // Padding is already applied to hit area div size, but for accuracy
                                  // we test against the actual rotated shape
                                  const isInsideRotatedShape = isPointInRotatedBoundingBox(
                                    clickPointLcd,
                                    element
                                  );
                                  
                                  // If click is outside rotated shape, don't select
                                  if (!isInsideRotatedShape) {
                                    e.stopPropagation();
                                    return;
                                  }
                                }
                              }
                              
                              // Normal selection (non-rotated or inside rotated shape)
                              onElementMouseDown(element.id, e);
                            }}
                            style={{
                              position: 'absolute',
                              // Use AABB for hit area (axis-aligned, not rotated)
                              // Hitbox v2 Phase 1 — consistent padding + minimum size applied
                              left: `calc(50% + ${hitAreaLeft}px)`,
                              top: `calc(50% + ${hitAreaTop}px)`,
                              width: `${hitAreaWidth}px`,
                              height: `${hitAreaHeight}px`,
                              cursor: isDraggingThis ? 'grabbing' : (isSelected ? 'move' : 'grab'),
                              pointerEvents: 'auto',
                              zIndex: element.zIndex !== undefined ? element.zIndex + 100 : 100,
                              // Bounding box outline is shown separately (see below)
                            }}
                          />
                        );
                      })()}
                      
                      {/* Transform Overlay Container - Figma-style: bounding box + handles in unified transform */}
                      {/* Uses same transform as UnifiedOverlayRenderer for perfect alignment */}
                      {isSelected && (() => {
                        // Get element rotation angle (default to 0 if not set)
                        const elementAngle = element.angle ?? 0;
                        
                        // Use same transform as UnifiedOverlayRenderer
                        // Transform: translate(calc(-50% + element.x * scale), calc(-50% + element.y * scale)) rotate(angle)
                        // This ensures bounding box and handles move/rotate exactly with element
                        const elementTransform = elementAngle !== 0
                          ? `translate(calc(-50% + ${element.x * overlayPreviewScale}px), calc(-50% + ${element.y * overlayPreviewScale}px)) rotate(${elementAngle}deg)`
                          : `translate(calc(-50% + ${element.x * overlayPreviewScale}px), calc(-50% + ${element.y * overlayPreviewScale}px))`;
                        
                        // Calculate bounding box dimensions using element's actual dimensions
                        const elementDimensions = calculateElementDimensions(element);
                        const elementWidth = lcdToPreview(elementDimensions.width, offsetScale);
                        const elementHeight = lcdToPreview(elementDimensions.height, offsetScale);
                        
                        // Add padding for visual feedback
                        const outlineWidth = Math.max(elementWidth + (HITBOX_PADDING_PX * 2), MIN_HIT_AREA_PX);
                        const outlineHeight = Math.max(elementHeight + (HITBOX_PADDING_PX * 2), MIN_HIT_AREA_PX);
                        
                        // Local corner positions (relative to element center, no rotation - parent container rotates)
                        // These are in preview coordinates (already scaled)
                        const halfWidth = outlineWidth / 2;
                        const halfHeight = outlineHeight / 2;
                        const localCorners = {
                          nw: { x: -halfWidth, y: -halfHeight }, // top-left
                          ne: { x: halfWidth, y: -halfHeight },  // top-right
                          sw: { x: -halfWidth, y: halfHeight },  // bottom-left
                          se: { x: halfWidth, y: halfHeight },    // bottom-right
                        };
                        
                        // Handle size (for centering handles on corners)
                        const HANDLE_SIZE = 8; // Preview pixels
                        const HANDLE_HALF = HANDLE_SIZE / 2;
                        
                        return (
                          <div
                            key={`transform-overlay-${element.id}`}
                            style={{
                              position: 'absolute',
                              left: '50%',  // Preview circle center (same as UnifiedOverlayRenderer)
                              top: '50%',   // Preview circle center (same as UnifiedOverlayRenderer)
                              transform: elementTransform, // Same transform as element
                              transformOrigin: 'center center', // Rotate around center (same as element)
                              pointerEvents: 'none', // Container doesn't capture events, children do
                              zIndex: (element.zIndex !== undefined ? element.zIndex : 0) + 150,
                            }}
                          >
                            {/* Bounding Box - centered on element, rotates with element */}
                            <div
                              className={`bounding-box ${isDraggingThis ? 'dragging' : ''} ${isResizingThis ? 'resizing' : ''}`}
                              style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                width: `${outlineWidth}px`,
                                height: `${outlineHeight}px`,
                                transform: 'translate(-50%, -50%)', // Center the box on element center
                                transformOrigin: 'center center',
                                pointerEvents: 'none',
                              }}
                            />
                            
                            {/* Resize handles - positioned relative to corners (no rotation matrix, parent rotates) */}
                            {canResize && (
                              <>
                                {(['nw', 'ne', 'sw', 'se'] as const).map((handle) => {
                                  const isActive = resizingElementId === element.id;
                                  const corner = localCorners[handle];
                                  
                                  return (
                                    <div
                                      key={handle}
                                      onMouseDown={(e) => {
                                        e.stopPropagation();
                                        onResizeMouseDown(element.id, handle, e);
                                      }}
                                      className="resize-handle-wrapper"
                                      style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: '50%',
                                        // Position handle at corner, centered on corner point
                                        transform: `translate(calc(-50% + ${corner.x}px), calc(-50% + ${corner.y}px)) translate(-${HANDLE_HALF}px, -${HANDLE_HALF}px)`,
                                        pointerEvents: 'auto',
                                        cursor: `${handle}-resize`,
                                      }}
                                    >
                                      <div
                                        className={`resize-handle resize-handle--${handle} ${isActive ? 'active' : ''} ${isResizingThis ? 'resizing' : ''}`}
                                      />
                                    </div>
                                  );
                                })}
                              </>
                            )}
                            
                            {/* Rotation handle - positioned relative to top-right corner + offset */}
                            {(() => {
                              const isActive = rotatingElementId === element.id;
                              const topRightCorner = localCorners.ne;
                              
                              // Offset from top-right corner (20px right, -20px up) in preview coordinates
                              const offsetX = 20;
                              const offsetY = -20;
                              
                              return (
                                <div
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    onRotationMouseDown(element.id, element.x, element.y, e);
                                  }}
                                  className="rotation-handle-wrapper"
                                  style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    // Position at top-right corner + offset, centered on handle
                                    transform: `translate(calc(-50% + ${topRightCorner.x + offsetX}px), calc(-50% + ${topRightCorner.y + offsetY}px)) translate(-${HANDLE_HALF}px, -${HANDLE_HALF}px)`,
                                    cursor: rotatingElementId === element.id ? 'grabbing' : 'grab',
                                    pointerEvents: 'auto',
                                  }}
                                >
                                  <div className={`rotation-handle ${isActive ? 'active' : ''} ${isRotatingThis ? 'rotating' : ''}`}>
                                    <div
                                      className="rotation-handle__icon"
                                      style={{
                                        // Counter-rotate icon to keep it upright (parent container already rotates)
                                        transform: `rotate(${-elementAngle}deg)`,
                                      }}
                                    >
                                      <RotateCw size={14} strokeWidth={2} color="rgba(0, 200, 255, 1)" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            {/* Element label - positioned relative to bounding box */}
                            <div
                              style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: `translate(calc(-50% + ${-outlineWidth / 2 - 7}px), calc(-50% - ${outlineHeight / 2 + 5}px))`,
                                pointerEvents: 'none',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'rgba(255, 255, 255, 0.5)',
                                  fontFamily: 'system-ui, -apple-system, sans-serif',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap',
                                  userSelect: 'none',
                                }}
                              >
                                {getElementLabel()}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </>
            )}
            </div>
          </div>
          {/* Mock data warning */}
          {!isRealDataReceived && (
            <div
              style={{
                marginTop: '45px',
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
              {t('mockDataWarning')}
            </div>
          )}
        </>
      ) : (
        <div className="preview-title" style={{ opacity: 0.5 }}>
          {t('overlayPreviewTitle')} - {t('overlayMode')}: None
        </div>
      )}
    </div>
  );
}

