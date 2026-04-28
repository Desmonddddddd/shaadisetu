"use client";

import { useEffect, useState, useTransition } from "react";

const TO_EMAIL = "hello@shaadisetu.com";

type Status = "idle" | "submitting" | "sent" | "error";

interface Props {
  topic: string;
  cta: string;
  variant?: "filled" | "outline";
  className?: string;
}

export default function FinanceLeadButton({
  topic,
  cta,
  variant = "filled",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "submitting") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, status]);

  function reset() {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setStatus("idle");
    setErrorMsg(null);
  }

  function close() {
    if (status === "submitting") return;
    setOpen(false);
    if (status === "sent") setTimeout(reset, 300);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg(null);

    const body = `[${topic}] ${message}`;

    startTransition(async () => {
      try {
        const res = await fetch("/api/curated", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, message: body }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          setStatus("error");
          setErrorMsg(data.error ?? "Something went wrong. Try again.");
          return;
        }
        setStatus("sent");
      } catch {
        setStatus("error");
        setErrorMsg("Network error. Check your connection and try again.");
      }
    });
  }

  const buttonClass =
    variant === "filled"
      ? "px-6 py-3 bg-bordeaux text-cream hover:bg-ink"
      : "px-6 py-3 border border-cream/30 text-cream hover:border-champagne hover:text-champagne";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`text-[0.72rem] uppercase tracking-[0.22em] font-medium transition-colors ${buttonClass} ${className}`}
      >
        {cta}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal
          aria-label={topic}
          className="fixed inset-0 z-[60] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeUp_240ms_ease-out]"
          onClick={close}
        >
          <div
            className="relative w-full max-w-lg bg-cream text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-ink text-cream px-6 py-4 flex items-center justify-between">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-champagne">
                {status === "sent" ? "Request Received" : topic}
              </p>
              <button
                type="button"
                onClick={close}
                disabled={status === "submitting"}
                aria-label="Close"
                className="text-cream/60 hover:text-champagne transition-colors text-lg leading-none disabled:opacity-30"
              >
                ✕
              </button>
            </div>

            {status === "sent" ? (
              <div className="p-7 md:p-10 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-champagne/20 flex items-center justify-center mb-5">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-bordeaux"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-serif-display text-2xl text-ink leading-tight">
                  Request submitted.
                </h3>
                <p className="mt-3 text-sm text-ink-soft font-light leading-relaxed max-w-sm mx-auto">
                  Thanks. A planner will reach out within 48 hours from{" "}
                  <span className="text-ink">{TO_EMAIL}</span>.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 px-6 py-3 bg-bordeaux text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-7 md:p-8 space-y-4">
                <div>
                  <h3 className="font-serif-display text-2xl text-ink leading-tight">
                    Talk to a planner.
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft font-light leading-relaxed">
                    Drop your details. We&rsquo;ll come back with options
                    matched to your event size and timeline — no obligation.
                  </p>
                </div>

                <fieldset
                  disabled={status === "submitting" || isPending}
                  className="space-y-4 disabled:opacity-60 disabled:pointer-events-none"
                >
                  <Field label="Your name" required>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-ink/20 px-0 py-2 text-sm text-ink focus:outline-none focus:border-bordeaux transition-colors"
                    />
                  </Field>

                  <Field label="Email" required>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-ink/20 px-0 py-2 text-sm text-ink focus:outline-none focus:border-bordeaux transition-colors"
                    />
                  </Field>

                  <Field label="Phone (optional)">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-ink/20 px-0 py-2 text-sm text-ink focus:outline-none focus:border-bordeaux transition-colors"
                    />
                  </Field>

                  <Field label="A few details" required>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Approximate budget, wedding date, city, and what you'd like guidance on…"
                      className="w-full bg-transparent border border-ink/15 p-3 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-bordeaux transition-colors resize-none font-light"
                    />
                  </Field>
                </fieldset>

                {status === "error" && errorMsg && (
                  <p className="text-sm text-bordeaux border-l-2 border-bordeaux pl-3 py-1">
                    {errorMsg}
                  </p>
                )}

                <div className="pt-3 flex items-center justify-between gap-3">
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft">
                    Topic: {topic}
                  </p>
                  <button
                    type="submit"
                    disabled={status === "submitting" || isPending}
                    className="px-6 py-3 bg-bordeaux text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" || isPending
                      ? "Sending…"
                      : "Send Enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-ink-soft mb-1">
        {label}
        {required && <span className="text-bordeaux ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
