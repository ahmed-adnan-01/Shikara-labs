import { memo } from "react";

interface GaugeMeterProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  glowColor: string;
}

export const GaugeMeter = memo(function GaugeMeter({
  value,
  max,
  label,
  unit,
  color,
  glowColor,
}: GaugeMeterProps) {
  const clampedValue = Math.min(value, max);
  const angle = -135 + (clampedValue / max) * 270;
  const percentage = (clampedValue / max) * 100;

  const radius = 42;
  const circumference = 2 * Math.PI * radius * (270 / 360);
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="100" viewBox="0 0 120 100">
        <defs>
          <filter id={`gaugeGlow-${label}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d="M 15 75 A 42 42 0 1 1 105 75"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Value arc */}
        <path
          d="M 15 75 A 42 42 0 1 1 105 75"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={dashOffset}
          filter={`url(#gaugeGlow-${label})`}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />

        {/* Needle */}
        <g transform={`translate(60, 58)`} style={{ transition: "transform 0.5s ease-out" }}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-32"
            stroke={glowColor}
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${angle})`}
            style={{ transition: "transform 0.5s ease-out" }}
          />
          <circle r="4" fill={color} />
        </g>

        {/* Value text */}
        <text x="60" y="85" textAnchor="middle" fontSize="13" fill={glowColor} fontWeight="bold">
          {value.toFixed(value >= 100 ? 0 : 2)}
        </text>
        <text x="60" y="96" textAnchor="middle" fontSize="9" fill="#64748b">
          {unit}
        </text>

        {/* Scale markers */}
        <text x="12" y="85" textAnchor="middle" fontSize="7" fill="#475569">0</text>
        <text x="108" y="85" textAnchor="middle" fontSize="7" fill="#475569">{max}</text>
      </svg>
      <span className="text-xs font-semibold mt-0.5" style={{ color: glowColor }}>
        {label}
      </span>
    </div>
  );
});
