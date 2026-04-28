"use client";

interface Slice {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface Props {
  slices: Slice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  slices,
  size = 240,
  thickness = 28,
  centerLabel,
  centerValue,
}: Props) {
  const total = slices.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const segments = slices
    .filter((s) => s.value > 0 && total > 0)
    .map((s) => {
      const fraction = s.value / total;
      const length = fraction * circumference;
      const seg = {
        ...s,
        dasharray: `${length} ${circumference - length}`,
        dashoffset: -offset,
      };
      offset += length;
      return seg;
    });

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="transparent"
          stroke="rgba(26,26,26,0.08)"
          strokeWidth={thickness}
        />
        {segments.map((seg) => (
          <circle
            key={seg.id}
            cx={cx}
            cy={cy}
            r={radius}
            fill="transparent"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeDasharray={seg.dasharray}
            strokeDashoffset={seg.dashoffset}
            style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1), stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)" }}
          />
        ))}
      </svg>
      {(centerValue || centerLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && (
            <p className="font-serif-display text-3xl text-ink">{centerValue}</p>
          )}
          {centerLabel && (
            <p className="text-[0.6rem] uppercase tracking-[0.24em] text-ink-soft mt-1">
              {centerLabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
