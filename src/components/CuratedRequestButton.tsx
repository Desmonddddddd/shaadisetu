"use client";

import { useEffect, useState } from "react";

const TO_EMAIL = "hello@shaadisetu.com";

export default function CuratedRequestButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Curated request from ${name || "ShaadiSetu visitor"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "—"}`,
      "",
      "What I'm looking for:",
      message,
      "",
      "— Sent from shaadisetu.com",
    ].join("\n");

    const href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 mt-2 px-5 py-3 border border-champagne/60 text-champagne hover:bg-champagne hover:text-ink transition-colors group"
      >
        <span className="w-9 h-9 flex items-center justify-center bg-champagne/10 group-hover:bg-ink/10 transition-colors">
          <MailIcon />
        </span>
        <span className="text-[0.72rem] uppercase tracking-[0.22em] font-medium">
          Send us a request
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal
          aria-label="Send a curated request"
          className="fixed inset-0 z-[60] bg-ink/85 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeUp_240ms_ease-out]"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-cream text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-ink text-cream px-6 py-4 flex items-center justify-between">
              <p className="text-[0.62rem] uppercase tracking-[0.24em] text-champagne">
                Curated Request
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-cream/60 hover:text-champagne transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-7 md:p-8 space-y-4">
              <div>
                <h3 className="font-serif-display text-2xl text-ink leading-tight">
                  Tell us what you have in mind.
                </h3>
                <p className="mt-2 text-sm text-ink-soft font-light leading-relaxed">
                  Share a few details and we&rsquo;ll come back with a
                  hand-picked shortlist within 48 hours.
                </p>
              </div>

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

              <Field label="What you&rsquo;re looking for" required>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="A regional cuisine caterer, a heritage venue in Rajasthan, a vintage car for the baraat…"
                  className="w-full bg-transparent border border-ink/15 p-3 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-bordeaux transition-colors resize-none font-light"
                />
              </Field>

              <div className="pt-3 flex items-center justify-between gap-3">
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft">
                  Goes to {TO_EMAIL}
                </p>
                <button
                  type="submit"
                  className="px-6 py-3 bg-bordeaux text-cream text-[0.72rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors"
                >
                  Send Request
                </button>
              </div>
            </form>
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

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
