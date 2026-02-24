import { memo } from "react";

interface CircuitDiagramProps {
  voltage: number;
  current: number;
  resistance: number | null;
  isActive: boolean;
}

export const CircuitDiagram = memo(function CircuitDiagram({
  voltage,
  current,
  resistance,
  isActive,
}: CircuitDiagramProps) {
  const electronSpeed = isActive ? Math.max(1, 8 - current * 1.5) : 0;
  const glowIntensity = isActive ? Math.min(1, current / 5) : 0;

  return (
    <svg viewBox="0 0 400 260" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="strongGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="activeWire" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      {/* Circuit path */}
      <path
        d="M 60 50 L 340 50 L 340 210 L 60 210 Z"
        fill="none"
        stroke={isActive ? "#22d3ee" : "#475569"}
        strokeWidth="3"
        strokeLinejoin="round"
        opacity={isActive ? 0.8 : 0.4}
        filter={isActive ? "url(#glow)" : undefined}
      />

      {/* Electron flow animation dots */}
      {isActive && (
        <>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle key={i} r="3" fill="#67e8f9" filter="url(#glow)" opacity="0.9">
              <animateMotion
                dur={`${electronSpeed}s`}
                repeatCount="indefinite"
                begin={`${(i * electronSpeed) / 8}s`}
                path="M 60 50 L 340 50 L 340 210 L 60 210 Z"
              />
            </circle>
          ))}
        </>
      )}

      {/* Battery */}
      <g transform="translate(60, 105)">
        <rect x="-20" y="-12" width="40" height="24" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        {/* Battery terminals */}
        <line x1="-8" y1="-18" x2="-8" y2="-12" stroke={isActive ? "#f59e0b" : "#64748b"} strokeWidth="2" />
        <line x1="8" y1="-18" x2="8" y2="-12" stroke={isActive ? "#f59e0b" : "#64748b"} strokeWidth="2" />
        <text x="-15" y="-20" fontSize="10" fill="#f59e0b" fontWeight="bold">+</text>
        <text x="6" y="-20" fontSize="10" fill="#64748b" fontWeight="bold">−</text>
        {/* Battery cells */}
        <rect x="-14" y="-6" width="8" height="12" rx="1" fill={isActive ? "#f59e0b" : "#475569"} opacity={isActive ? glowIntensity * 0.5 + 0.5 : 0.4} />
        <rect x="-3" y="-6" width="8" height="12" rx="1" fill={isActive ? "#f59e0b" : "#475569"} opacity={isActive ? glowIntensity * 0.3 + 0.5 : 0.3} />
        <rect x="8" y="-6" width="8" height="12" rx="1" fill={isActive ? "#eab308" : "#475569"} opacity={isActive ? glowIntensity * 0.2 + 0.5 : 0.2} />
        {/* Voltage label */}
        <text x="0" y="32" textAnchor="middle" fontSize="13" fill="#fbbf24" fontWeight="bold">{voltage}V</text>
        {isActive && (
          <rect x="-20" y="-12" width="40" height="24" rx="4" fill="none" stroke="#f59e0b" strokeWidth="1" opacity={0.5}>
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
          </rect>
        )}
      </g>

      {/* Resistor */}
      <g transform="translate(200, 50)">
        {resistance ? (
          <>
            {/* Resistor zigzag */}
            <rect x="-40" y="-14" width="80" height="28" rx="6" fill="#1e293b" stroke={isActive ? "#a855f7" : "#6b21a8"} strokeWidth="2" />
            <path
              d="M -30 0 L -22 -8 L -14 8 L -6 -8 L 2 8 L 10 -8 L 18 8 L 26 0"
              fill="none"
              stroke={isActive ? "#c084fc" : "#7c3aed"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={isActive ? "url(#glow)" : undefined}
            />
            <text x="0" y="30" textAnchor="middle" fontSize="13" fill="#c084fc" fontWeight="bold">{resistance}Ω</text>
            {isActive && (
              <rect x="-40" y="-14" width="80" height="28" rx="6" fill="#a855f7" opacity={glowIntensity * 0.15}>
                <animate attributeName="opacity" values={`${glowIntensity * 0.05};${glowIntensity * 0.2};${glowIntensity * 0.05}`} dur="1.5s" repeatCount="indefinite" />
              </rect>
            )}
          </>
        ) : (
          <>
            <rect x="-40" y="-14" width="80" height="28" rx="6" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="0" y="5" textAnchor="middle" fontSize="11" fill="#64748b">Drop Here</text>
          </>
        )}
      </g>

      {/* Ammeter */}
      <g transform="translate(340, 130)">
        <circle cx="0" cy="0" r="22" fill="#0f172a" stroke={isActive ? "#22c55e" : "#334155"} strokeWidth="2" />
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={isActive ? "#4ade80" : "#64748b"} fontWeight="bold">A</text>
        <text x="0" y="8" textAnchor="middle" fontSize="9" fill={isActive ? "#86efac" : "#64748b"}>{current.toFixed(2)}</text>
        {isActive && (
          <circle cx="0" cy="0" r="22" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.4">
            <animate attributeName="r" values="22;26;22" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </g>

      {/* Voltmeter */}
      <g transform="translate(200, 210)">
        <circle cx="0" cy="0" r="22" fill="#0f172a" stroke={isActive ? "#3b82f6" : "#334155"} strokeWidth="2" />
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={isActive ? "#60a5fa" : "#64748b"} fontWeight="bold">V</text>
        <text x="0" y="8" textAnchor="middle" fontSize="9" fill={isActive ? "#93c5fd" : "#64748b"}>{voltage}</text>
        {isActive && (
          <circle cx="0" cy="0" r="22" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.4">
            <animate attributeName="r" values="22;26;22" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
        )}
      </g>

      {/* Current direction arrow */}
      {isActive && (
        <g transform="translate(200, 38)">
          <polygon points="0,-6 8,0 0,6" fill="#22d3ee" opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          </polygon>
          <text x="0" y="-10" textAnchor="middle" fontSize="9" fill="#67e8f9" opacity="0.7">I →</text>
        </g>
      )}

      {/* Labels */}
      <text x="60" y="240" textAnchor="middle" fontSize="9" fill="#64748b">Battery</text>
      <text x="340" y="240" textAnchor="middle" fontSize="9" fill="#64748b">Ammeter</text>
      <text x="200" y="255" textAnchor="middle" fontSize="9" fill="#64748b">Voltmeter</text>
    </svg>
  );
});
