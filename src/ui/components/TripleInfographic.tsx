import {
  OverlaySettings,
  OverlayMetrics,
  getOverlayLabelAndValue,
} from "../../types/overlay";

/**
 * TripleInfographic
 * Renders three NZXT-style infographic overlays:
 * - Primary metric (left, large)
 * - Secondary and tertiary metrics (right, stacked vertically)
 * - Vertical divider line between left and right sections
 * Each metric has its own color, size, and label.
 * This component is purely presentational and does not access localStorage or NZXT APIs.
 */
export default function TripleInfographic({
  overlay,
  metrics,
  scale = 1,
}: {
  overlay: OverlaySettings;
  metrics: OverlayMetrics;
  scale?: number; // Scale factor for preview (e.g., 200/640 = 0.3125)
}) {
  if (overlay.mode !== "triple") return null;

  const primaryKey = overlay.primaryMetric;
  const secondaryKey = overlay.secondaryMetric || overlay.primaryMetric;
  const tertiaryKey = overlay.tertiaryMetric || overlay.primaryMetric;

  const primaryValue = metrics[primaryKey];
  const secondaryValue = metrics[secondaryKey];
  const tertiaryValue = metrics[tertiaryKey];

  const primaryInfo = getOverlayLabelAndValue(primaryKey, primaryValue);
  const secondaryInfo = getOverlayLabelAndValue(secondaryKey, secondaryValue);
  const tertiaryInfo = getOverlayLabelAndValue(tertiaryKey, tertiaryValue);

  // Use separate colors for primary, secondary, and tertiary in triple mode
  const primaryNumberColor = overlay.primaryNumberColor || overlay.numberColor;
  const primaryTextColor = overlay.primaryTextColor || overlay.textColor;
  const secondaryNumberColor = overlay.secondaryNumberColor || overlay.numberColor;
  const secondaryTextColor = overlay.secondaryTextColor || overlay.textColor;
  const tertiaryNumberColor = overlay.tertiaryNumberColor || overlay.numberColor;
  const tertiaryTextColor = overlay.tertiaryTextColor || overlay.textColor;

  // Use separate sizes for primary, secondary, and tertiary in triple mode
  const primaryNumberSize = overlay.numberSize * scale;
  const primaryTextSize = overlay.textSize * scale;
  const secondaryNumberSize = (overlay.secondaryNumberSize || overlay.numberSize * 0.6) * scale;
  const secondaryTextSize = (overlay.secondaryTextSize || overlay.textSize * 0.7) * scale;
  const tertiaryNumberSize = (overlay.tertiaryNumberSize || overlay.numberSize * 0.6) * scale;
  const tertiaryTextSize = (overlay.tertiaryTextSize || overlay.textSize * 0.7) * scale;

  // Helper function to render a single metric value
  const renderMetric = (
    info: typeof primaryInfo,
    isClock: boolean,
    unitSize: number,
    numSize: number,
    numColor: string
  ) => {
    if (!isClock) {
      return (
        <div
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            justifyContent: "center",
            lineHeight: 0.9,
          }}
        >
          {/* Main numeric value */}
          <span
            style={{
              fontSize: `${numSize}px`,
              fontWeight: 700,
              color: numColor,
            }}
          >
            {info.valueNumber}
          </span>

          {/* Temperature unit (°) with manual visual offset */}
          {info.valueUnit && info.valueUnitType === "temp" && (
            <span
              style={{
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                paddingLeft: 4,
                transform: "translateY(-65%)",
              }}
            >
              <span
                style={{
                  fontSize: `${unitSize}px`,
                  fontWeight: 700,
                  color: numColor,
                  lineHeight: 1,
                }}
              >
                {info.valueUnit}
              </span>
            </span>
          )}

          {/* Percentage unit (%) baseline-aligned */}
          {info.valueUnit && info.valueUnitType === "percent" && (
            <span
              style={{
                fontSize: `${unitSize}px`,
                fontWeight: 700,
                color: numColor,
                paddingLeft: 4,
                lineHeight: 1,
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
          <div
            style={{
              fontSize: `${numSize}px`,
              fontWeight: 700,
              color: numColor,
              lineHeight: 0.9,
            }}
          >
            {info.valueNumber}
          </div>

          {/* MHz label below */}
          <div
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

  const tertiaryUnitSize =
    tertiaryInfo.valueUnitType === "temp"
      ? tertiaryNumberSize * 0.49
      : tertiaryInfo.valueUnitType === "percent"
      ? tertiaryNumberSize * 0.35
      : tertiaryNumberSize * 0.2;

  const primaryIsClock = primaryInfo.valueUnitType === "clock";
  const secondaryIsClock = secondaryInfo.valueUnitType === "clock";
  const tertiaryIsClock = tertiaryInfo.valueUnitType === "clock";

  // Calculate gapLeftRight - allow negative values for closer positioning
  const gapLeftRightValue = overlay.gapLeftRight !== undefined 
    ? overlay.gapLeftRight * scale 
    : primaryNumberSize * 0.2;

  // Estimate section widths based on font sizes to ensure divider stays visually centered
  // Primary section: number size (with unit) + text size + some padding
  // For clock type, add MHz label height
  const primaryContentWidth = primaryIsClock 
    ? primaryNumberSize * 1.1 
    : primaryNumberSize * 1.15 + (primaryInfo.valueUnit ? primaryUnitSize * 0.5 : 0);
  const estimatedPrimaryWidth = primaryContentWidth + primaryTextSize * 1.0;
  
  // Right section: max of secondary/tertiary content widths + gap between them
  const secondaryContentWidth = secondaryIsClock
    ? secondaryNumberSize * 1.1
    : secondaryNumberSize * 1.15 + (secondaryInfo.valueUnit ? secondaryUnitSize * 0.5 : 0);
  const tertiaryContentWidth = tertiaryIsClock
    ? tertiaryNumberSize * 1.1
    : tertiaryNumberSize * 1.15 + (tertiaryInfo.valueUnit ? tertiaryUnitSize * 0.5 : 0);
  const maxRightContentWidth = Math.max(secondaryContentWidth, tertiaryContentWidth);
  const rightTextSize = Math.max(secondaryTextSize, tertiaryTextSize);
  const estimatedRightWidth = maxRightContentWidth + rightTextSize * 1.0 + 
    (overlay.gapSecondaryTertiary ? overlay.gapSecondaryTertiary * scale : secondaryNumberSize * 0.4);

  // Calculate the offset needed to keep divider visually centered
  // When gap is negative, we want both sections to move towards center equally
  // The offset accounts for the difference in section widths
  const widthDifference = (estimatedPrimaryWidth - estimatedRightWidth) / 2;
  
  // For negative gap: move sections towards center, accounting for width difference
  // For positive gap: use normal gap, but still account for width difference if needed
  const leftTransform = gapLeftRightValue < 0 
    ? `translateX(${(-gapLeftRightValue / 2) - widthDifference}px)` 
    : widthDifference !== 0 ? `translateX(${-widthDifference}px)` : undefined;
  const rightTransform = gapLeftRightValue < 0 
    ? `translateX(${(gapLeftRightValue / 2) + widthDifference}px)` 
    : widthDifference !== 0 ? `translateX(${widthDifference}px)` : undefined;

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 20,
        inset: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: gapLeftRightValue >= 0 ? `${gapLeftRightValue}px` : '0px', // Use gap for positive values, 0 for negative (we'll use transform)
        pointerEvents: "none",
        fontFamily: "nzxt-extrabold",
      }}
    >
      {/* Left section: Primary metric (large) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          transform: leftTransform,
        }}
      >
        {renderMetric(
          primaryInfo,
          primaryIsClock,
          primaryUnitSize,
          primaryNumberSize,
          primaryNumberColor
        )}

        {/* Label */}
        <div
          style={{
            fontSize: `${primaryTextSize}px`,
            color: primaryTextColor,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginTop: primaryIsClock ? 0 : 4,
          }}
        >
          {primaryInfo.label}
        </div>
      </div>

      {/* Vertical divider line (optional) - Always centered */}
      {overlay.showDivider && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${overlay.dividerThickness || 2}px`,
            height: `${overlay.dividerWidth || 60}%`,
            backgroundColor: overlay.dividerColor || primaryNumberColor,
            opacity: overlay.dividerColor ? undefined : 0.3,
            borderRadius: 1,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Right section: Secondary and tertiary metrics (stacked) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: overlay.gapSecondaryTertiary ? `${overlay.gapSecondaryTertiary * scale}px` : `${secondaryNumberSize * 0.4}px`, // Space between secondary and tertiary (configurable)
          flex: 1,
          transform: rightTransform,
        }}
      >
        {/* Secondary metric (top) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderMetric(
            secondaryInfo,
            secondaryIsClock,
            secondaryUnitSize,
            secondaryNumberSize,
            secondaryNumberColor
          )}

          {/* Label */}
          <div
            style={{
              fontSize: `${secondaryTextSize}px`,
              color: secondaryTextColor,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginTop: secondaryIsClock ? 0 : 2,
            }}
          >
            {secondaryInfo.label}
          </div>
        </div>

        {/* Tertiary metric (bottom) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderMetric(
            tertiaryInfo,
            tertiaryIsClock,
            tertiaryUnitSize,
            tertiaryNumberSize,
            tertiaryNumberColor
          )}

          {/* Label */}
          <div
            style={{
              fontSize: `${tertiaryTextSize}px`,
              color: tertiaryTextColor,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginTop: tertiaryIsClock ? 0 : 2,
            }}
          >
            {tertiaryInfo.label}
          </div>
        </div>
      </div>
    </div>
  );
}

