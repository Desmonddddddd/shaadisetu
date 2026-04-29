"use client";

import Link from "next/link";
import { useState } from "react";

interface Pick {
  id: string;
  name: string;
  description: string;
  rating: number;
  priceRange: string;
  tags: string[];
  cityName?: string;
  categoryName?: string;
}

const SAMPLE_PROMPTS = [
  "Royal Jaipur palace, marigold and emerald, intimate guest list",
  "Modern minimalist Bangalore wedding, clean lines, palm and white",
  "Beachside Goa sundowner, candid photography, live band",
  "Big fat Punjabi wedding in Delhi, gold and red, full baraat energy",
];

export function DiscoverFlow() {
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [rationale, setRationale] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (!data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Could not match");
        return;
      }
      setPicks(data.picks);
      setRationale(data.rationale);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Network error");
    }
  }

  return (
    <div className="space-y-10">
      {/* INPUT */}
      <form onSubmit={submit} className="space-y-4 max-w-2xl mx-auto fade-up">
        <label className="block">
          <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mb-2">
            Describe your wedding vibe
          </span>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Royal Jaipur palace, marigold and emerald, intimate guest list…"
            className="w-full bg-cream border border-ink/15 p-4 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-bordeaux transition-colors resize-none font-light"
            disabled={status === "loading"}
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-soft self-center mr-2">
            Try:
          </span>
          {SAMPLE_PROMPTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setDescription(s)}
              className="text-[0.65rem] px-3 py-1.5 border border-ink/15 text-ink-soft hover:border-bordeaux hover:text-bordeaux transition-colors"
            >
              {s.slice(0, 30)}…
            </button>
          ))}
        </div>

        {status === "error" && errorMsg && (
          <p className="text-sm text-bordeaux border-l-2 border-bordeaux pl-3 py-1">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || description.trim().length < 10}
          className="w-full px-6 py-3 bg-bordeaux text-cream text-[0.7rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Matching…" : "Find my matches"}
        </button>
      </form>

      {/* RESULTS */}
      {picks.length > 0 && (
        <div className="space-y-8 fade-up">
          {rationale && (
            <div className="max-w-2xl mx-auto bg-cream-soft border border-ink/10 p-6 md:p-7">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-bordeaux mb-3">
                Why these picks
              </p>
              <p className="text-sm text-ink-soft font-light leading-relaxed whitespace-pre-wrap">
                {rationale}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {picks.map((p, i) => (
              <Link
                key={p.id}
                href={`/vendors/v/${p.id}`}
                className={`block group bg-cream border border-ink/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_10px_24px_-16px_rgba(0,0,0,0.25)] fade-up stagger-${Math.min(i + 1, 8)}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.22em] text-bordeaux">
                    Match #{i + 1}
                  </p>
                  <span className="text-[0.65rem] tracking-[0.1em] text-ink-soft">
                    ★ {p.rating.toFixed(1)}
                  </span>
                </div>
                <h3 className="font-serif-display text-xl text-ink leading-tight group-hover:text-bordeaux transition-colors">
                  {p.name}
                </h3>
                <span className="block w-6 h-px bg-champagne my-2" />
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft/70">
                  {p.categoryName ?? "?"} · {p.cityName ?? "?"}
                </p>
                <p className="text-xs text-ink-soft mt-3 line-clamp-3 font-light">
                  {p.description}
                </p>
                <p className="mt-3 text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft/70">
                  {p.priceRange}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
