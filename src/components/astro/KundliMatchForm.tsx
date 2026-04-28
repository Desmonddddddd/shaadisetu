"use client";

import { useState } from "react";
import { AstroForm, emptyPerson, type PersonForm } from "./AstroForm";
import { CompatibilityRing } from "./CompatibilityRing";
import { EmailGate } from "./EmailGate";
import { kundliMatchInputSchema } from "@/lib/validators";
import type { KundliMatchResult } from "@/lib/prokerala";

type Phase = "form" | "preview" | "unlocked";

export function KundliMatchForm() {
  const [boy, setBoy] = useState<PersonForm>({ ...emptyPerson, gender: "male" });
  const [girl, setGirl] = useState<PersonForm>({ ...emptyPerson, gender: "female" });
  const [phase, setPhase] = useState<Phase>("form");
  const [result, setResult] = useState<KundliMatchResult | null>(null);
  const [narrative, setNarrative] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function compute(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    setErrors({});

    const parsed = kundliMatchInputSchema.safeParse({
      boy: { ...boy, gender: boy.gender || undefined, tob: boy.tob || undefined },
      girl: { ...girl, gender: girl.gender || undefined, tob: girl.tob || undefined },
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fe[issue.path.join(".")] = issue.message;
      }
      setErrors(fe);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/astro/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { ok: boolean; result?: KundliMatchResult; error?: string };
      if (!res.ok || !data.ok || !data.result) {
        throw new Error(data.error ?? "Could not compute compatibility");
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
      const res = await fetch("/api/astro/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boy: { ...boy, gender: boy.gender || undefined, tob: boy.tob || undefined },
          girl: { ...girl, gender: girl.gender || undefined, tob: girl.tob || undefined },
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
            // ignore non-JSON frames
          }
        }
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Stream failed");
    }
  }

  if (phase === "form" || (phase === "preview" && !result)) {
    return (
      <form onSubmit={compute} className="space-y-10 fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-cream-soft border border-ink/10 p-6 md:p-8">
            <AstroForm
              value={boy}
              onChange={setBoy}
              legend="Ladka ki details"
              showGender={false}
              disabled={status === "loading"}
              errors={extractErrors(errors, "boy")}
            />
          </div>
          <div className="bg-cream-soft border border-ink/10 p-6 md:p-8">
            <AstroForm
              value={girl}
              onChange={setGirl}
              legend="Ladki ki details"
              showGender={false}
              disabled={status === "loading"}
              errors={extractErrors(errors, "girl")}
            />
          </div>
        </div>

        {status === "error" && errorMsg && (
          <p className="text-sm text-bordeaux border-l-2 border-bordeaux pl-3 py-1 max-w-md mx-auto">
            {errorMsg}
          </p>
        )}

        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-3 bg-bordeaux text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Computing…" : "Match Kundlis"}
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
    <div className="space-y-10 fade-up">
      <div className="text-center">
        <CompatibilityRing
          obtained={result.totalGuna}
          max={result.maxGuna}
          verdict={result.verdict}
        />
        <p className="mt-4 text-sm text-ink-soft font-light max-w-md mx-auto">
          {verdictBlurb(result.verdict)}
        </p>
      </div>

      {phase === "preview" && (
        <EmailGate
          source="kundli-match"
          defaultName={boy.name}
          leadPayload={{
            dob1: boy.dob,
            place1: boy.place,
            tob1: boy.tob || undefined,
            gender1: boy.gender || undefined,
            dob2: girl.dob,
            place2: girl.place,
            tob2: girl.tob || undefined,
            gender2: girl.gender || undefined,
          }}
          onUnlock={async () => {
            setPhase("unlocked");
            await streamNarrative();
          }}
        />
      )}

      {phase === "unlocked" && (
        <div className="space-y-8">
          <div className="bg-cream-soft border border-ink/10 p-6 md:p-8">
            <h3 className="font-serif-display text-2xl text-ink mb-4">
              Guna breakdown
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {result.breakdown.map((b) => (
                <li
                  key={b.koota}
                  className="flex items-baseline justify-between border-b border-ink/10 pb-2 text-sm"
                >
                  <span className="text-ink">
                    {b.koota}
                    <span className="text-ink-soft text-xs ml-2">{b.description}</span>
                  </span>
                  <span className="font-serif-display text-bordeaux">
                    {b.obtained}/{b.maximum}
                  </span>
                </li>
              ))}
            </ul>
            {(result.manglikBoy || result.manglikGirl) && (
              <p className="mt-5 text-xs text-bordeaux border-l-2 border-bordeaux pl-3">
                Manglik note:{" "}
                {result.manglikBoy && result.manglikGirl
                  ? "Both partners are Manglik — traditionally considered balanced."
                  : result.manglikBoy
                  ? "Boy is Manglik."
                  : "Girl is Manglik."}{" "}
                Discuss with a family astrologer if this matters to you.
              </p>
            )}
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
        </div>
      )}
    </div>
  );
}

function extractErrors(
  errors: Record<string, string>,
  prefix: "boy" | "girl",
): Partial<Record<keyof PersonForm, string>> {
  const out: Partial<Record<keyof PersonForm, string>> = {};
  for (const [k, v] of Object.entries(errors)) {
    if (k.startsWith(`${prefix}.`)) {
      const field = k.slice(prefix.length + 1) as keyof PersonForm;
      out[field] = v;
    }
  }
  return out;
}

function verdictBlurb(v: KundliMatchResult["verdict"]): string {
  switch (v) {
    case "excellent":
      return "Strong compatibility across most fronts. The fundamentals are aligned.";
    case "good":
      return "A workable match. Some areas align well, others need conversation.";
    case "average":
      return "Mixed signals. Worth understanding the breakdown before deciding.";
    case "poor":
      return "Several friction points. Not a verdict — guidance for what to discuss.";
  }
}
