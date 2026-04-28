"use client";
import { useState } from "react";
import type { Vendor } from "@/types/vendor";
import { useEnquiry } from "@/hooks/useEnquiry";
import { enquirySchema } from "@/lib/validators";

const EVENT_TYPES = ["haldi", "mehendi", "wedding", "reception", "engagement", "sangeet"] as const;

export function VendorEnquiryRail({ vendor }: { vendor: Vendor }) {
  const { status, error, submit, reset } = useEnquiry();
  const [form, setForm] = useState({
    name: "", phone: "", eventDate: "", eventType: "wedding", requirements: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Local-date today (avoid UTC drift)
  const tnow = new Date();
  const today = `${tnow.getFullYear()}-${String(tnow.getMonth() + 1).padStart(2, "0")}-${String(tnow.getDate()).padStart(2, "0")}`;
  const dateBookedWarning = false;

  if (status === "success") {
    return (
      <aside className="lg:sticky lg:top-20 bg-shaadi-cream border border-shaadi-light rounded-xl p-5">
        <h2 className="font-semibold text-slate-900">We&apos;ve sent your enquiry 🎉</h2>
        <p className="text-sm text-slate-700 mt-2">
          {vendor.name} will reach out within 24 hours. We&apos;ve saved this enquiry to your browser too.
        </p>
        <button onClick={reset} className="text-sm text-shaadi-deep underline mt-3">
          Send another enquiry
        </button>
      </aside>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = enquirySchema.safeParse({ vendorId: vendor.id, ...form });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await submit(parsed.data);
  };

  return (
    <aside className="lg:sticky lg:top-20 bg-shaadi-cream border border-shaadi-light rounded-xl p-5 space-y-3">
      <h2 className="font-semibold text-slate-900">Send Enquiry</h2>
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <Field label="Name" id="name" error={errors.name}>
          <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
        </Field>
        <Field label="Phone" id="phone" error={errors.phone}>
          <input id="phone" inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="10-digit Indian mobile" />
        </Field>
        <Field label="Event date" id="eventDate" error={errors.eventDate}>
          <input id="eventDate" type="date" min={today} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="input" />
          {dateBookedWarning && (
            <p className="text-xs text-amber-700 mt-1">This vendor is booked on this date — we&apos;ll request alternates.</p>
          )}
        </Field>
        <Field label="Event type" id="eventType" error={errors.eventType}>
          <select id="eventType" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="input">
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Requirements" id="requirements" error={errors.requirements}>
          <textarea id="requirements" rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className="input resize-none" />
        </Field>

        <button type="submit" disabled={status === "submitting"} className="w-full bg-shaadi-deep text-white rounded-lg py-2 font-medium disabled:opacity-50">
          {status === "submitting" ? "Sending..." : "Send Enquiry"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-700">Couldn&apos;t send: {error}. Please try again.</p>
        )}
      </form>
      <style jsx>{`
        :global(.input) {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          color: #0f172a;
        }
      `}</style>
    </aside>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-xs font-medium text-slate-700 mb-1">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-700 mt-1">{error}</span>}
    </label>
  );
}
