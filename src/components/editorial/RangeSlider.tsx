"use client";

interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  ariaLabel?: string;
}

export function RangeSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  ariaLabel,
}: Props) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
      className="editorial-range w-full"
    />
  );
}
