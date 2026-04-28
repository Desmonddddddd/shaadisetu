"use client";

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
}

export function PrimitiveCheckbox({ checked, onChange, ariaLabel, size = "md" }: Props) {
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`${dim} shrink-0 inline-flex items-center justify-center border transition-all duration-200 ${
        checked
          ? "bg-bordeaux border-bordeaux text-cream"
          : "bg-cream border-ink/25 hover:border-champagne"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
