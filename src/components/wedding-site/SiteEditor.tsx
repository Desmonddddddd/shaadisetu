"use client";

import { useState } from "react";
import type { SitePayload, WeddingEvent } from "@/lib/queries/wedding-site";

interface Props {
  initial: SitePayload | null;
}

const DEFAULT_EVENT: WeddingEvent = {
  name: "Wedding ceremony",
  date: "",
  venue: "",
  dressCode: "",
};

export function SiteEditor({ initial }: Props) {
  const [data, setData] = useState<SitePayload>(
    initial ?? {
      slug: "",
      headline: "Save the date",
      coupleNames: "",
      heroImage: "",
      events: [{ ...DEFAULT_EVENT }],
      isPublic: false,
    },
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function setEvent(idx: number, patch: Partial<WeddingEvent>) {
    setData({
      ...data,
      events: data.events.map((e, i) => (i === idx ? { ...e, ...patch } : e)),
    });
  }

  function addEvent() {
    setData({ ...data, events: [...data.events, { ...DEFAULT_EVENT }] });
  }

  function removeEvent(idx: number) {
    setData({ ...data, events: data.events.filter((_, i) => i !== idx) });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/wedding-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          heroImage: data.heroImage || null,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setStatus("error");
        setErrorMsg(json.error ?? "Save failed");
        return;
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Network error");
    }
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <div className="bg-cream-soft border border-ink/10 p-6 md:p-7 space-y-4">
        <h2 className="font-serif-display text-xl text-ink">Basics</h2>
        <Field label="Couple names" hint="e.g. Riya & Arjun">
          <input
            required
            value={data.coupleNames}
            onChange={(e) => setData({ ...data, coupleNames: e.target.value })}
            className="editorial-input w-full"
          />
        </Field>
        <Field label="Headline" hint="Shows on the hero">
          <input
            required
            value={data.headline}
            onChange={(e) => setData({ ...data, headline: e.target.value })}
            className="editorial-input w-full"
          />
        </Field>
        <Field
          label="Microsite URL"
          hint="The public link to share with guests"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-soft">/wedding/</span>
            <input
              required
              value={data.slug}
              onChange={(e) =>
                setData({ ...data, slug: e.target.value.toLowerCase() })
              }
              placeholder="riya-and-arjun"
              className="editorial-input flex-1"
            />
          </div>
        </Field>
        <Field label="Hero image URL" hint="Optional. Use a hosted image link">
          <input
            type="url"
            value={data.heroImage ?? ""}
            onChange={(e) => setData({ ...data, heroImage: e.target.value })}
            className="editorial-input w-full"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={data.isPublic}
            onChange={(e) => setData({ ...data, isPublic: e.target.checked })}
          />
          Make microsite public (anyone with the URL can view)
        </label>
      </div>

      <div className="bg-cream-soft border border-ink/10 p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-display text-xl text-ink">Events</h2>
          <button
            type="button"
            onClick={addEvent}
            disabled={data.events.length >= 8}
            className="text-[0.62rem] uppercase tracking-[0.2em] px-3 py-1.5 border border-ink/15 text-ink-soft hover:border-bordeaux hover:text-bordeaux transition-colors disabled:opacity-50"
          >
            + Add event
          </button>
        </div>

        <ul className="space-y-4">
          {data.events.map((ev, i) => (
            <li key={i} className="bg-cream border border-ink/10 p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Name">
                  <input
                    required
                    value={ev.name}
                    onChange={(e) => setEvent(i, { name: e.target.value })}
                    className="editorial-input w-full"
                  />
                </Field>
                <Field label="Date">
                  <input
                    required
                    type="date"
                    value={ev.date}
                    onChange={(e) => setEvent(i, { date: e.target.value })}
                    className="editorial-input w-full"
                  />
                </Field>
                <Field label="Dress code">
                  <input
                    value={ev.dressCode ?? ""}
                    onChange={(e) => setEvent(i, { dressCode: e.target.value })}
                    placeholder="Indian formal"
                    className="editorial-input w-full"
                  />
                </Field>
              </div>
              <Field label="Venue">
                <input
                  required
                  value={ev.venue}
                  onChange={(e) => setEvent(i, { venue: e.target.value })}
                  placeholder="The Leela Palace, New Delhi"
                  className="editorial-input w-full"
                />
              </Field>
              {data.events.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEvent(i)}
                  className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft hover:text-bordeaux transition-colors"
                >
                  Remove this event
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {status === "error" && errorMsg && (
        <p className="text-sm text-bordeaux border-l-2 border-bordeaux pl-3 py-1">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        {data.slug && data.isPublic ? (
          <a
            href={`/wedding/${data.slug}`}
            target="_blank"
            className="text-[0.65rem] uppercase tracking-[0.22em] text-bordeaux hover:text-ink transition-colors"
          >
            Preview public page →
          </a>
        ) : (
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft">
            Save first, then mark public to share
          </span>
        )}
        <button
          type="submit"
          disabled={status === "saving"}
          className="px-6 py-2.5 bg-bordeaux text-cream text-[0.65rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft mb-1.5">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block text-[0.6rem] text-ink-soft/70 mt-1 italic">
          {hint}
        </span>
      )}
    </label>
  );
}
