"use client";

import { useState } from "react";

interface Option {
  value: string;
  label: string;
  count?: number;
}

interface Props {
  label: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  allowAll?: boolean;
  allLabel?: string;
}

/**
 * Editorial filter pills with quiet entrance + gold-pulse on activation.
 * Used by city + category filters on /vendors.
 */
export function FilterPills({
  label,
  options,
  value,
  onChange,
  allowAll = true,
  allLabel = "All",
}: Props) {
  const [pulseKey, setPulseKey] = useState<string | null>(null);

  function handleClick(v: string) {
    onChange(v);
    setPulseKey(v);
    setTimeout(() => setPulseKey(null), 700);
  }

  return (
    <div>
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-ink-soft/70 mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {allowAll && (
          <button
            type="button"
            data-active={value === ""}
            onClick={() => handleClick("")}
            className={`filter-pill ${pulseKey === "" ? "pill-pulse" : ""}`}
          >
            {allLabel}
          </button>
        )}
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            data-active={value === o.value}
            onClick={() => handleClick(o.value)}
            className={`filter-pill ${pulseKey === o.value ? "pill-pulse" : ""}`}
          >
            {o.label}
            {typeof o.count === "number" && (
              <span className="text-[0.6rem] font-normal opacity-70">·{o.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
