import {
  Overlay,
  OverlayMetrics,
  getOverlayLabelAndValue,
} from "../../types/overlay";
import AnimateNumber from "./AnimateNumber";
import styles from "../styles/SingleInfographic.module.css";

/**
 * SingleInfographic
 * Renders a single NZXT-style infographic overlay on top of the LCD media.
 * This component is purely presentational and does not access localStorage or NZXT APIs.
 * 
 * @deprecated This component is deprecated. Use UnifiedOverlayRenderer instead.
 */
export default function SingleInfographic({
  overlay,
  metrics,
  scale = 1,
}: {
  overlay: Overlay;
  metrics: OverlayMetrics;
  scale?: number; // Scale factor for preview (e.g., 200/640 = 0.3125)
}) {
  // This component is deprecated - new Overlay type doesn't support "single" mode
  // Return null to prevent type errors
  return null;

  // Unreachable code - kept for reference but will never execute
  const _overlay = overlay as any;
  const _metrics = metrics as any;
  const key = _overlay.primaryMetric;
  const value = _metrics[key];

  const {
    label,
    valueUnit,
    valueUnitType,
  } = getOverlayLabelAndValue(key, value);

  const numberColor = _overlay.numberColor;
  const textColor = _overlay.textColor;

  const numberSize = _overlay.numberSize * scale;
  const unitSize =
    valueUnitType === "temp"
      ? numberSize * 0.49
      : valueUnitType === "percent"
      ? numberSize * 0.35
      : numberSize * 0.2;

  const isClock = valueUnitType === "clock";

  return (
    <div className={styles.container}>
      {/* Number + unit */}
      {!isClock ? (
        <div className={styles.numberContainer}>
          {/* Main numeric value */}
          <AnimateNumber
            value={value}
            className={styles.number}
            style={{
              fontSize: `${numberSize}px`,
              color: numberColor,
            }}
          />

          {/* Temperature unit (°) with manual visual offset */}
          {valueUnit && valueUnitType === "temp" && (
            <span className={styles.unitContainer}>
              <span
                className={styles.unit}
                style={{
                  fontSize: `${unitSize}px`,
                  color: numberColor,
                }}
              >
                {valueUnit}
              </span>
            </span>
          )}

          {/* Percentage unit (%) baseline-aligned */}
          {valueUnit && valueUnitType === "percent" && (
            <span
              className={styles.unitPercent}
              style={{
                fontSize: `${unitSize}px`,
                color: numberColor,
              }}
            >
              {valueUnit}
            </span>
          )}
        </div>
      ) : (
        <>
          {/* Clock number */}
          <AnimateNumber
            value={value}
            className={styles.clockNumber}
            style={{
              fontSize: `${numberSize}px`,
              color: numberColor,
            }}
            as="div"
          />

          {/* MHz label below */}
          <div
            className={styles.clockLabel}
            style={{
              fontSize: `${unitSize}px`,
              marginTop: -numberSize * 0.15,
              marginBottom: 6,
              color: numberColor,
            }}
          >
            MHz
          </div>
        </>
      )}

      {/* Label (CPU / GPU / Liquid) - Hide if textSize is 0 or textColor is transparent */}
      {(_overlay.textSize > 0 && textColor !== 'transparent') && (
        <div
          className={styles.label}
          style={{
            fontSize: `${_overlay.textSize * scale}px`,
            color: textColor,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
