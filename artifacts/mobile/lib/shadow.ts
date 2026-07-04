/**
 * Cross-platform shadow helper.
 *
 * React Native / RN Web now warn that the legacy "shadow*" style props
 * (shadowColor, shadowOffset, shadowOpacity, shadowRadius) are deprecated
 * in favor of a single CSS-style "boxShadow" string, which works
 * consistently on web, iOS, and Android (new architecture).
 *
 * `elevation` is Android-specific and is NOT deprecated, so it is kept
 * separately as a fallback for older Android render paths.
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const int = parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function shadow(opts: {
  color?: string;
  opacity?: number;
  radius?: number;
  offsetX?: number;
  offsetY?: number;
  elevation?: number;
}) {
  const {
    color = "#000",
    opacity = 0.1,
    radius = 8,
    offsetX = 0,
    offsetY = 2,
    elevation,
  } = opts;
  const { r, g, b } = hexToRgb(color);
  return {
    boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(${r}, ${g}, ${b}, ${opacity})`,
    ...(elevation !== undefined ? { elevation } : {}),
  };
}
