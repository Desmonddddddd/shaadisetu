"use client";

import { useState } from "react";
import { AstroForm, emptyPerson, type PersonForm } from "./AstroForm";
import { EmailGate } from "./EmailGate";
import { astroReadingInputSchema } from "@/lib/validators";
import type { KundliReadingResult } from "@/lib/prokerala";

type Phase = "form" | "preview" | "unlocked";
type Focus = "general" | "career" | "relationships";

export function AstroReadingForm() {
  const [person, setPerson] = useState<PersonForm>(emptyPerson);
  const [focus, setFocus] = useState<Focus>("general");
  const [phase, setPhase] = useState<Phase>("form");
  const [result, setResult] = useState<KundliReadingResult | null>(null);
  const [narrative, setNarrative] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonForm, string>>>({});

  async function compute(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    setErrors({});

    const parsed = astroReadingInputSchema.safeParse({
      person: { ...person, gender: person.gender || undefined, tob: person.tob || undefined },
      focus,
    });
    if (!parsed.success) {
      const fe: Partial<Record<keyof PersonForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (path.startsWith("person.")) {
          fe[path.slice(7) as keyof PersonForm] = issue.message;
        }
      }
      setErrors(fe);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/astro/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { ok: boolean; result?: KundliReadingResult; error?: string };
      if (!res.ok || !data.ok || !data.result) {
        throw new Error(data.error ?? "Could not compute the chart");
      }
      setResult(data.result);
      setPhase("preview");
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function streamNarrative() {
    if (!result) return;
    setNarrative("");
    try {
      const res = await fetch("/api/astro/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person: { ...person, gender: person.gender || undefined, tob: person.tob || undefined },
          focus,
          narrative: true,
        }),
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const frames = buf.split("\n\n");
        buf = frames.pop() ?? "";
        for (const frame of frames) {
          const line = frame.replace(/^data: /, "").trim();
          if (!line) continue;
          try {
            const parsed = JSON.parse(line) as { type: string; text?: string; message?: string };
            if (parsed.type === "text" && parsed.text) {
              setNarrative((n) => n + parsed.text);
            } else if (parsed.type === "error" && parsed.message) {
              setErrorMsg(parsed.message);
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Stream failed");
    }
  }

  if (phase === "form") {
    return (
      <form onSubmit={compute} className="space-y-8 fade-up max-w-xl mx-auto">
        <div className="bg-cream-soft border border-ink/10 p-6 md:p-8">
          <AstroForm
            value={person}
            onChange={setPerson}
            errors={errors}
            disabled={status === "loading"}
            legend="Your details"
          />

          <label className="block mt-6">
            <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mb-2">
              Focus area
            </span>
            <div className="flex flex-wrap gap-2">
              {(["general", "career", "relationships"] as const).map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFocus(f)}
                  className={`px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em] border transition-colors ${
                    focus === f
                      ? "bg-ink text-cream border-ink"
                      : "bg-transparent text-ink border-ink/20 hover:border-bordeaux hover:text-bordeaux"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </label>
        </div>

        {status === "error" && errorMsg && (
          <p className="text-sm text-bordeaux border-l-2 border-bordeaux pl-3 py-1">
            {errorMsg}
          </p>
        )}

        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-3 bg-bordeaux text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Reading the stars…" : "Read my chart"}
          </button>
          <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft text-center max-w-md">
            Used only to compute your reading. Stored only if you choose to save.
          </p>
        </div>
      </form>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-10 fade-up max-w-2xl mx-auto">
      <div className="bg-cream-soft border border-ink/10 p-6 md:p-8 text-center">
        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-bordeaux mb-3">
          Your chart at a glance
        </p>
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Sun" value={result.sun.sign} sub={result.sun.nakshatra} />
          <Stat label="Moon" value={result.moon.sign} sub={result.moon.nakshatra} />
          <Stat label="Lagna" value={result.ascendant.sign} sub={`${result.ascendant.degree.toFixed(1)}°`} />
        </div>
      </div>

      {phase === "preview" && (
        <EmailGate
          source="astro-reading"
          defaultName={person.name}
          leadPayload={{
            dob1: person.dob,
            place1: person.place,
            tob1: person.tob || undefined,
            gender1: person.gender || undefined,
          }}
          onUnlock={async () => {
            setPhase("unlocked");
            await streamNarrative();
          }}
        />
      )}

      {phase === "unlocked" && (
        <>
          <div className="bg-cream-soft border border-ink/10 p-6 md:p-8">
            <h3 className="font-serif-display text-2xl text-ink mb-4">
              Planet positions
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {result.planets.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center justify-between border-b border-ink/10 py-1.5"
                >
                  <span className="text-ink">{p.name}</span>
                  <span className="text-ink-soft">
                    {p.sign} · House {p.house}
                    {p.retrograde && (
                      <span className="ml-2 text-bordeaux text-xs">℞</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-ink-soft">
              Current Mahadasha:{" "}
              <span className="text-ink">{result.currentDasha.mahadasha}</span> /{" "}
              <span className="text-ink">{result.currentDasha.antardasha}</span>{" "}
              until {result.currentDasha.until}
            </p>
          </div>

          <div className="bg-cream border border-ink/10 p-6 md:p-8">
            <h3 className="font-serif-display text-2xl text-ink mb-4">
              Reading
            </h3>
            {narrative ? (
              <p className="text-sm text-ink-soft font-light leading-relaxed whitespace-pre-wrap">
                {narrative}
              </p>
            ) : (
              <p className="text-sm text-ink-soft font-light italic">
                Generating your reading…
              </p>
            )}
          </div>

          <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft text-center">
            For guidance, not prediction. Astrological readings are interpretive.
          </p>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft">
        {label}
      </span>
      <span className="font-serif-display text-2xl text-ink mt-1">{value}</span>
      <span className="text-xs text-ink-soft mt-1">{sub}</span>
    </div>
  );
}
