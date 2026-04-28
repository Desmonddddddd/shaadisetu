"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPackage, updatePackage, deletePackage } from "@/lib/actions/packages";

interface PackageRow {
  id: string;
  tier: string;
  name: string;
  price: number;
  features: string[];
  popular: boolean;
}

const EMPTY: Omit<PackageRow, "id"> = {
  tier: "basic",
  name: "",
  price: 0,
  features: [],
  popular: false,
};

export function PackagesEditor({ initial }: { initial: PackageRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [draft, setDraft] = useState<Omit<PackageRow, "id">>(EMPTY);
  const [draftFeature, setDraftFeature] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function addFeature() {
    const f = draftFeature.trim();
    if (!f || draft.features.includes(f)) return;
    setDraft({ ...draft, features: [...draft.features, f] });
    setDraftFeature("");
  }

  function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createPackage(draft);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDraft(EMPTY);
      router.refresh();
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deletePackage(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setRows(rows.filter((r) => r.id !== id));
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {rows.length > 0 && (
        <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {rows.map((p) => (
            <li key={p.id} className="px-4 py-3">
              <ExistingRow row={p} onDelete={() => onDelete(p.id)} disabled={isPending} />
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onCreate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="font-medium text-slate-900">Add a package</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Tier">
            <select
              value={draft.tier}
              onChange={(e) => setDraft({ ...draft, tier: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="basic">basic</option>
              <option value="standard">standard</option>
              <option value="premium">premium</option>
            </select>
          </Field>
          <Field label="Name">
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </Field>
          <Field label="Price (₹)">
            <input
              type="number"
              value={draft.price || ""}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </Field>
        </div>
        <Field label="Features">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {draft.features.map((f) => (
              <span key={f} className="text-xs bg-shaadi-light text-shaadi-deep px-2 py-1 rounded-full">
                {f}
                <button
                  type="button"
                  onClick={() =>
                    setDraft({ ...draft, features: draft.features.filter((x) => x !== f) })
                  }
                  className="ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={draftFeature}
              onChange={(e) => setDraftFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="Feature (Enter)"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-3 py-2 bg-shaadi-light text-shaadi-deep text-sm rounded-lg"
            >
              Add
            </button>
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.popular}
            onChange={(e) => setDraft({ ...draft, popular: e.target.checked })}
          />
          Mark as popular
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-shaadi-deep text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Add package"}
        </button>
      </form>
    </div>
  );
}

function ExistingRow({
  row,
  onDelete,
  disabled,
}: {
  row: PackageRow;
  onDelete: () => void;
  disabled: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...row });
  const [draftFeature, setDraftFeature] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-900">
            {row.name} <span className="text-xs text-slate-500 ml-2 capitalize">{row.tier}</span>
          </div>
          <div className="text-sm text-slate-700">₹ {row.price.toLocaleString("en-IN")}</div>
          <div className="text-xs text-slate-500">{row.features.join(" · ")}</div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-shaadi-deep hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="text-xs text-red-700 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  function addF() {
    const f = draftFeature.trim();
    if (!f || draft.features.includes(f)) return;
    setDraft({ ...draft, features: [...draft.features, f] });
    setDraftFeature("");
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await updatePackage(row.id, draft);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSave} className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={draft.tier}
          onChange={(e) => setDraft({ ...draft, tier: e.target.value })}
          className="px-2 py-1 border border-gray-200 rounded text-sm"
        >
          <option value="basic">basic</option>
          <option value="standard">standard</option>
          <option value="premium">premium</option>
        </select>
        <input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className="px-2 py-1 border border-gray-200 rounded text-sm"
        />
        <input
          type="number"
          value={draft.price}
          onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
          className="px-2 py-1 border border-gray-200 rounded text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {draft.features.map((f) => (
          <span key={f} className="text-xs bg-shaadi-light text-shaadi-deep px-2 py-0.5 rounded-full">
            {f}
            <button
              type="button"
              onClick={() => setDraft({ ...draft, features: draft.features.filter((x) => x !== f) })}
              className="ml-1"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draftFeature}
          onChange={(e) => setDraftFeature(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addF();
            }
          }}
          placeholder="Feature"
          className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
        />
        <button
          type="button"
          onClick={addF}
          className="px-2 py-1 bg-shaadi-light text-shaadi-deep text-xs rounded"
        >
          +
        </button>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={draft.popular}
          onChange={(e) => setDraft({ ...draft, popular: e.target.checked })}
        />
        Popular
      </label>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-shaadi-deep text-white px-3 py-1 rounded text-xs disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-xs text-slate-500 hover:underline"
        >
          Cancel
        </button>
      </div>
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
