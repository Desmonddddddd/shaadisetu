"use client";

import { useState, useTransition } from "react";
import { updateVendorProfile, type ProfileInput } from "@/lib/actions/profile";

interface Props {
  initial: ProfileInput;
  cities: { id: string; name: string; state: string }[];
}

export function ProfileForm({ initial, cities }: Props) {
  const [form, setForm] = useState(initial);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function addTag() {
    const t = tagInput.trim();
    if (!t || form.tags.includes(t) || form.tags.length >= 10) return;
    setForm({ ...form, tags: [...form.tags, t] });
    setTagInput("");
  }

  function removeTag(t: string) {
    setForm({ ...form, tags: form.tags.filter((x) => x !== t) });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updateVendorProfile(form);
      if (!result.ok) setError(result.error);
      else setSavedAt(Date.now());
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-white border border-gray-200 rounded-xl p-5">
      <Field label="Business name">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
        />
      </Field>
      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
        />
      </Field>
      <Field label="Price range">
        <input
          value={form.priceRange}
          onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
          placeholder="e.g. ₹50K-₹1L"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
        />
      </Field>
      <Field label="City">
        <select
          value={form.cityId}
          onChange={(e) => setForm({ ...form, cityId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}, {c.state}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tags">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-xs bg-shaadi-light text-shaadi-deep px-2 py-1 rounded-full"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="text-shaadi-deep/70 hover:text-shaadi-deep"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag (Enter)"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 bg-shaadi-light text-shaadi-deep text-sm rounded-lg"
          >
            Add
          </button>
        </div>
      </Field>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {savedAt && <p className="text-sm text-emerald-700">Saved.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-shaadi-deep text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-slate-700 mb-1">{label}</span>
      {children}
    </label>
  );
}
