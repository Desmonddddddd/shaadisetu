"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface City {
  id: string;
  name: string;
  state: string;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  cities: City[];
  categories: Category[];
  priceRanges: string[];
  current: {
    city?: string;
    category?: string;
    rating?: string;
    price?: string;
  };
}

const RATINGS = [
  { v: "4.5", label: "4.5+" },
  { v: "4", label: "4+" },
  { v: "3.5", label: "3.5+" },
];

export function SearchFacets({ cities, categories, priceRanges, current }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  function setFacet(key: string, value: string | undefined) {
    const next = new URLSearchParams(params.toString());
    if (value === undefined || value === "") next.delete(key);
    else next.set(key, value);
    router.push(`/search?${next.toString()}`);
  }

  function clearAll() {
    const next = new URLSearchParams();
    const q = params.get("q");
    if (q) next.set("q", q);
    router.push(`/search?${next.toString()}`);
  }

  const hasFilters = current.city || current.category || current.rating || current.price;

  return (
    <aside className="space-y-5 text-sm">
      {hasFilters && (
        <button onClick={clearAll} className="text-xs text-shaadi-deep underline">
          Clear filters
        </button>
      )}

      <Section title="Category">
        <Select
          value={current.category ?? ""}
          onChange={(v) => setFacet("category", v || undefined)}
          options={[{ value: "", label: "Any" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
        />
      </Section>

      <Section title="City">
        <Select
          value={current.city ?? ""}
          onChange={(v) => setFacet("city", v || undefined)}
          options={[
            { value: "", label: "Any" },
            ...cities.map((c) => ({ value: c.id, label: `${c.name}, ${c.state}` })),
          ]}
        />
      </Section>

      <Section title="Rating">
        <div className="space-y-1">
          {RATINGS.map((r) => (
            <label key={r.v} className="flex items-center gap-2">
              <input
                type="radio"
                name="rating"
                checked={current.rating === r.v}
                onChange={() => setFacet("rating", r.v)}
              />
              {r.label} stars
            </label>
          ))}
          {current.rating && (
            <button
              onClick={() => setFacet("rating", undefined)}
              className="text-xs text-slate-500 underline"
            >
              clear
            </button>
          )}
        </div>
      </Section>

      <Section title="Price range">
        <div className="space-y-1">
          {priceRanges.map((p) => (
            <label key={p} className="flex items-center gap-2">
              <input
                type="radio"
                name="price"
                checked={current.price === p}
                onChange={() => setFacet("price", p)}
              />
              {p}
            </label>
          ))}
          {current.price && (
            <button
              onClick={() => setFacet("price", undefined)}
              className="text-xs text-slate-500 underline"
            >
              clear
            </button>
          )}
        </div>
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase text-slate-500 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm bg-white"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
