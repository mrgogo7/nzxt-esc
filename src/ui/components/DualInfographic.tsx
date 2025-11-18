import {
  Overlay,
  OverlayMetrics,
  getOverlayLabelAndValue,
} from "../../types/overlay";
import AnimateNumber from "./AnimateNumber";
import styles from "../styles/DualInfographic.module.css";

/**
 * DualInfographic
 * Renders two NZXT-style infographic overlays side by side.
 * Each metric has its own color, size, and label.
 * This component is purely presentational and does not access localStorage or NZXT APIs.
 * 
 * @deprecated This component is deprecated. Use UnifiedOverlayRenderer instead.
 */
export default function DualInfographic({
  overlay,
  metrics,
  scale = 1,
}: {
  overlay: Overlay;
  metrics: OverlayMetrics;
  scale?: number; // Scale factor for preview (e.g., 200/640 = 0.3125)
}) {
  // This component is deprecated - new Overlay type doesn't support "dual" mode
  // Return null to prevent type errors
  return null;

  // Unreachable code - kept for reference but will never execute
  const _overlay = overlay as any;
  const _metrics = metrics as any;
  const primaryKey = _overlay.primaryMetric;
  const secondaryKey = _overlay.secondaryMetric || _overlay.primaryMetric;

  const primaryValue = _metrics[primaryKey];
  const secondaryValue = _metrics[secondaryKey];

  const primaryInfo = getOverlayLabelAndValue(primaryKey, primaryValue);
  const secondaryInfo = getOverlayLabelAndValue(secondaryKey, secondaryValue);

  // Use separate colors for primary and secondary in dual mode
  const primaryNumberColor = _overlay.primaryNumberColor || _overlay.numberColor;
  const primaryTextColor = _overlay.primaryTextColor || _overlay.textColor;
  const secondaryNumberColor = _overlay.secondaryNumberColor || _overlay.numberColor;
  const secondaryTextColor = _overlay.secondaryTextColor || _overlay.textColor;

  // Use separate sizes for primary and secondary in dual mode
  const primaryNumberSize = _overlay.numberSize * scale;
  const primaryTextSize = _overlay.textSize * scale;
  const secondaryNumberSize = (_overlay.secondaryNumberSize || _overlay.numberSize) * scale;
  const secondaryTextSize = (_overlay.secondaryTextSize || _overlay.textSize) * scale;

  // Helper function to render a single metric value
  const renderMetric = (
    info: typeof primaryInfo,
    rawValue: number,
    isClock: boolean,
    unitSize: number,
    numSize: number,
    numColor: string
  ) => {
    if (!isClock) {
      return (
        <div className={styles.numberContainer}>
          {/* Main numeric value */}
          <AnimateNumber
            value={rawValue}
            className={styles.number}
            style={{
              fontSize: `${numSize}px`,
              color: numColor,
            }}
          />

          {/* Temperature unit (°) with manual visual offset */}
          {info.valueUnit && info.valueUnitType === "temp" && (
            <span className={styles.unitContainer}>
              <span
                className={styles.unit}
                style={{
                  fontSize: `${unitSize}px`,
                  color: numColor,
                }}
              >
                {info.valueUnit}
              </span>
            </span>
          )}

          {/* Percentage unit (%) baseline-aligned */}
          {info.valueUnit && info.valueUnitType === "percent" && (
            <span
              className={styles.unitPercent}
              style={{
                fontSize: `${unitSize}px`,
                color: numColor,
              }}
            >
              {info.valueUnit}
            </span>
          )}
        </div>
      );
    } else {
      return (
        <>
          {/* Clock number */}
          <AnimateNumber
            value={rawValue}
            className={styles.clockNumber}
            style={{
              fontSize: `${numSize}px`,
              color: numColor,
            }}
            as="div"
          />

          {/* MHz label below */}
          <div
            className={styles.clockLabel}
            style={{
              fontSize: `${unitSize}px`,
              marginTop: -numSize * 0.15,
              marginBottom: 6,
              color: numColor,
            }}
          >
            MHz
          </div>
        </>
      );
    }
  };

  const primaryUnitSize =
    primaryInfo.valueUnitType === "temp"
      ? primaryNumberSize * 0.49
      : primaryInfo.valueUnitType === "percent"
      ? primaryNumberSize * 0.35
      : primaryNumberSize * 0.2;

  const secondaryUnitSize =
    secondaryInfo.valueUnitType === "temp"
      ? secondaryNumberSize * 0.49
      : secondaryInfo.valueUnitType === "percent"
      ? secondaryNumberSize * 0.35
      : secondaryNumberSize * 0.2;

  const primaryIsClock = primaryInfo.valueUnitType === "clock";
  const secondaryIsClock = secondaryInfo.valueUnitType === "clock";

  // Primary/Divider offset (overlay.x and overlay.y)
  const primaryOffsetX = (_overlay.x || 0) * scale;
  const primaryOffsetY = (_overlay.y || 0) * scale;
  
  // Secondary offset (secondaryOffsetX and secondaryOffsetY)
  const secondaryOffsetX = (_overlay.secondaryOffsetX || 0) * scale;
  const secondaryOffsetY = (_overlay.secondaryOffsetY || 0) * scale;
  
  // Divider gap - space between primary and divider
  const dividerGap = (_overlay.dividerGap || 27) * scale;

  return (
    <div className={styles.container}>
      {/* Vertical divider line - Always centered, moves with primary offset */}
      {_overlay.showDivider && (
        <div
          className={styles.divider}
          style={{
            transform: `translate(calc(-50% + ${primaryOffsetX}px), calc(-50% + ${primaryOffsetY}px))`,
            width: `${_overlay.dividerThickness || 2}px`,
            height: `${_overlay.dividerWidth || 60}%`,
            backgroundColor: _overlay.dividerColor || primaryNumberColor,
            opacity: _overlay.dividerColor ? undefined : 0.3,
          }}
        />
      )}

      {/* Left section: Primary metric - Attached to divider with gap */}
      <div
        className={styles.primarySection}
        style={{
          transform: `translate(calc(-100% - ${dividerGap}px + ${primaryOffsetX}px), calc(-50% + ${primaryOffsetY}px))`,
        }}
      >
        {renderMetric(primaryInfo, primaryValue, primaryIsClock, primaryUnitSize, primaryNumberSize, primaryNumberColor)}

        {/* Label */}
        <div
          className={styles.label}
          style={{
            fontSize: `${primaryTextSize}px`,
            color: primaryTextColor,
            marginTop: primaryIsClock ? 0 : 4,
          }}
        >
          {primaryInfo.label}
        </div>
      </div>

      {/* Right section: Secondary metric - Independent offset */}
      <div
        className={styles.secondarySection}
        style={{
          transform: `translate(${secondaryOffsetX}px, calc(-50% + ${secondaryOffsetY}px))`,
        }}
      >
        {renderMetric(secondaryInfo, secondaryValue, secondaryIsClock, secondaryUnitSize, secondaryNumberSize, secondaryNumberColor)}

        {/* Label */}
        <div
          className={styles.label}
          style={{
            fontSize: `${secondaryTextSize}px`,
            color: secondaryTextColor,
            marginTop: secondaryIsClock ? 0 : 4,
          }}
        >
          {secondaryInfo.label}
        </div>
      </div>
    </div>
  );
}

