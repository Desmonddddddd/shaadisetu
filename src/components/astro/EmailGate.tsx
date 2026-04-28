"use client";

import { useState } from "react";

interface Props {
  onUnlock: (data: { email: string; name: string }) => void | Promise<void>;
  defaultName?: string;
  source: "kundli-match" | "astro-reading";
  // payload sent with the lead so we can persist context
  leadPayload: Record<string, string | undefined>;
}

export function EmailGate({ onUnlock, defaultName = "", source, leadPayload }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(defaultName);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/astro/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...leadPayload, email, name, source }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Could not save. Try again.");
        return;
      }
      await onUnlock({ email, name });
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Check your connection and try again.");
    }
  }

  return (
    <div className="bg-cream-soft border border-ink/10 p-7 md:p-9">
      <div className="text-center mb-6">
        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-bordeaux mb-3">
          One last step
        </p>
        <h3 className="font-serif-display text-2xl md:text-3xl text-ink leading-tight">
          Drop your email to unlock the full reading.
        </h3>
        <p className="mt-3 text-sm text-ink-soft font-light max-w-md mx-auto">
          We&rsquo;ll save your reading so you can come back to it. No spam — promise.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 max-w-md mx-auto">
        <label className="block">
          <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mb-1">
            Your name <span className="text-bordeaux ml-1">*</span>
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b border-ink/20 px-0 py-2 text-sm text-ink focus:outline-none focus:border-bordeaux transition-colors"
          />
        </label>
        <label className="block">
          <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mb-1">
            Email <span className="text-bordeaux ml-1">*</span>
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-ink/20 px-0 py-2 text-sm text-ink focus:outline-none focus:border-bordeaux transition-colors"
          />
        </label>

        {status === "error" && errorMsg && (
          <p className="text-sm text-bordeaux border-l-2 border-bordeaux pl-3 py-1">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full px-6 py-3 bg-bordeaux text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors disabled:opacity-60"
        >
          {status === "submitting" ? "Unlocking…" : "Unlock full reading"}
        </button>
      </form>
    </div>
  );
}
