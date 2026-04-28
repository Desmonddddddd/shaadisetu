"use client";

interface Props {
  obtained: number;
  max?: number;
  verdict: "excellent" | "good" | "average" | "poor";
}

export function CompatibilityRing({ obtained, max = 36, verdict }: Props) {
  const radius = 70;
  const stroke = 8;
  const c = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, obtained / max));
  const dash = c * pct;

  const color =
    verdict === "excellent"
      ? "var(--color-bordeaux, #6b1f2a)"
      : verdict === "good"
      ? "var(--color-champagne, #c9a86a)"
      : verdict === "average"
      ? "var(--color-ink-soft, #3a3a3a)"
      : "var(--color-bordeaux, #6b1f2a)";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-44 h-44">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(26,26,26,0.08)"
            strokeWidth={stroke}
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 800ms cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif-display text-5xl text-ink leading-none">
            {obtained}
          </span>
          <span className="text-[0.62rem] uppercase tracking-[0.24em] text-ink-soft mt-1">
            of {max}
          </span>
        </div>
      </div>
      <p className="text-[0.7rem] uppercase tracking-[0.24em] text-bordeaux">
        {verdict}
      </p>
    </div>
  );
}
