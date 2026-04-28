"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

interface Props {
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  allowAll?: boolean;
  allLabel?: string;
}

/**
 * Editorial type-ahead select. Single value, keyboard-friendly,
 * styled to match the bordeaux/champagne palette.
 */
export function SearchSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  allowAll = true,
  allLabel = "All",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectedLabel = useMemo(() => {
    if (!value) return null;
    return options.find((o) => o.value === value)?.label ?? null;
  }, [value, options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.group ?? "").toLowerCase().includes(q),
    );
  }, [options, query]);

  const items: { value: string; label: string; group?: string }[] = useMemo(() => {
    const list: { value: string; label: string; group?: string }[] = [];
    if (allowAll && (!query.trim() || allLabel.toLowerCase().includes(query.trim().toLowerCase()))) {
      list.push({ value: "", label: allLabel });
    }
    list.push(...filtered);
    return list;
  }, [allowAll, allLabel, filtered, query]);

  // Reset active index when items change.
  useEffect(() => {
    setActiveIdx(0);
  }, [items.length]);

  function handleSelect(v: string) {
    onChange(v);
    setOpen(false);
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = items[activeIdx];
      if (it) handleSelect(it.value);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={ref} className="relative">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-ink-soft/70 mb-2">
        {label}
      </p>

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={`editorial-input w-full text-left flex items-center justify-between gap-3 ${
          open ? "ring-2 ring-champagne/40 border-champagne" : ""
        }`}
      >
        <span className={selectedLabel ? "text-ink" : "text-ink-soft/60 italic"}>
          {selectedLabel ?? placeholder ?? `Select ${label.toLowerCase()}`}
        </span>
        <svg
          className={`w-3 h-3 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 left-0 right-0 mt-2 bg-cream border border-ink/12 shadow-xl fade-in">
          <div className="p-2 border-b border-ink/8">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="editorial-input w-full text-sm"
            />
          </div>
          <ul className="max-h-72 overflow-y-auto py-1">
            {items.length === 0 ? (
              <li className="px-4 py-3 text-sm text-ink-soft/70 italic">
                No matches.
              </li>
            ) : (
              items.map((it, i) => {
                const isActive = i === activeIdx;
                const isSelected = value === it.value;
                return (
                  <li
                    key={it.value || "__all__"}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => handleSelect(it.value)}
                    className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                      isActive ? "bg-champagne/15" : ""
                    } ${isSelected ? "text-bordeaux font-medium" : "text-ink"}`}
                  >
                    <span>{it.label}</span>
                    {isSelected && <span className="text-champagne">✓</span>}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
