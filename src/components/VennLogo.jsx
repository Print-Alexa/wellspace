// The WellSpace mark: two overlapping circles (Venn) with a four-point star in
// the overlap — a meeting of self and space, with a quiet spark in between.
import { C } from "../constants";

export default function VennLogo({
  size = 32,
  color = C.clay,
  starColor = C.gold,
  secondaryOpacity = 0.42,
  strokeWidth = 2.4,
  style,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      style={{ display: "block", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <circle
        cx="38"
        cy="50"
        r="22"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity="0.95"
      />
      <circle
        cx="62"
        cy="50"
        r="22"
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={secondaryOpacity}
      />
      <path
        d="M50,43 L51.9,47.9 L56.8,49 L51.9,50.1 L50,55 L48.1,50.1 L43.2,49 L48.1,47.9 Z"
        fill={starColor || color}
      />
    </svg>
  );
}
