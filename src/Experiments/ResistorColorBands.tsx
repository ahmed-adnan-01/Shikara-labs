import { memo } from "react";

const COLOR_MAP: Record<number, string> = {
  0: "#000000",
  1: "#8B4513",
  2: "#DC2626",
  3: "#F97316",
  4: "#EAB308",
  5: "#22C55E",
  6: "#3B82F6",
  7: "#7C3AED",
  8: "#6B7280",
  9: "#F8FAFC",
};

const TOLERANCE_GOLD = "#D4A017";

function getColorBands(value: number): string[] {
  if (value < 10) {
    return [COLOR_MAP[0], COLOR_MAP[value], COLOR_MAP[0]];
  }
  const str = value.toString();
  const first = parseInt(str[0]);
  const second = parseInt(str[1] || "0");
  const multiplier = str.length - 2;
  return [COLOR_MAP[first], COLOR_MAP[second], COLOR_MAP[multiplier]];
}

interface ResistorColorBandsProps {
  value: number;
  size?: "sm" | "md";
}

export const ResistorColorBands = memo(function ResistorColorBands({
  value,
  size = "md",
}: ResistorColorBandsProps) {
  const bands = getColorBands(value);
  const w = size === "sm" ? 60 : 80;
  const h = size === "sm" ? 24 : 32;

  return (
    <svg width={w} height={h} viewBox="0 0 80 32" className="mx-auto">
      {/* Lead wires */}
      <line x1="0" y1="16" x2="12" y2="16" stroke="#94a3b8" strokeWidth="2" />
      <line x1="68" y1="16" x2="80" y2="16" stroke="#94a3b8" strokeWidth="2" />
      {/* Resistor body */}
      <rect x="12" y="4" width="56" height="24" rx="6" fill="#d2b48c" stroke="#a0855b" strokeWidth="1" />
      {/* Color bands */}
      <rect x="20" y="4" width="6" height="24" rx="1" fill={bands[0]} opacity="0.9" />
      <rect x="30" y="4" width="6" height="24" rx="1" fill={bands[1]} opacity="0.9" />
      <rect x="40" y="4" width="6" height="24" rx="1" fill={bands[2]} opacity="0.9" />
      {/* Tolerance band */}
      <rect x="54" y="4" width="6" height="24" rx="1" fill={TOLERANCE_GOLD} opacity="0.9" />
    </svg>
  );
});
