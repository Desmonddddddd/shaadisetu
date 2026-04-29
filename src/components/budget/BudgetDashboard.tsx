"use client";

import { useMemo, useState } from "react";
import { CEREMONY_OPTIONS } from "@/lib/validators";

type Ceremony = (typeof CEREMONY_OPTIONS)[number];

interface BudgetItem {
  id: string;
  ceremony: string;
  category: string;
  label: string;
  plannedAmount: number;
  actualAmount: number | null;
  vendorId: string | null;
  paid: boolean;
  notes: string | null;
}

interface Props {
  initialItems: BudgetItem[];
}

const CEREMONY_LABEL: Record<string, string> = {
  haldi: "Haldi",
  mehendi: "Mehendi",
  sangeet: "Sangeet",
  wedding: "Wedding",
  reception: "Reception",
  engagement: "Engagement",
  general: "General",
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function BudgetDashboard({ initialItems }: Props) {
  const [items, setItems] = useState<BudgetItem[]>(initialItems);
  const [ceremonyFilter, setCeremonyFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BudgetItem | null>(null);

  const summary = useMemo(() => {
    const planned = items.reduce((s, i) => s + i.plannedAmount, 0);
    const actual = items.reduce((s, i) => s + (i.actualAmount ?? 0), 0);
    return { planned, actual, remaining: planned - actual };
  }, [items]);

  const visible = useMemo(() => {
    if (ceremonyFilter === "all") return items;
    return items.filter((i) => i.ceremony === ceremonyFilter);
  }, [items, ceremonyFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, BudgetItem[]>();
    for (const it of visible) {
      const arr = map.get(it.ceremony) ?? [];
      arr.push(it);
      map.set(it.ceremony, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [visible]);

  async function handleCreate(input: Omit<BudgetItem, "id">) {
    const res = await fetch("/api/budget/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (data.ok) setItems((prev) => [...prev, data.item]);
    setShowForm(false);
  }

  async function handleUpdate(id: string, patch: Partial<BudgetItem>) {
    const res = await fetch(`/api/budget/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (data.ok) {
      setItems((prev) => prev.map((i) => (i.id === id ? data.item : i)));
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/budget/items/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryTile label="Total Planned" value={inr.format(summary.planned)} />
        <SummaryTile label="Spent so far" value={inr.format(summary.actual)} />
        <SummaryTile
          label="Remaining"
          value={inr.format(summary.remaining)}
          accent={summary.remaining < 0}
        />
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap gap-1.5">
          <FilterPill
            active={ceremonyFilter === "all"}
            onClick={() => setCeremonyFilter("all")}
          >
            All ({items.length})
          </FilterPill>
          {CEREMONY_OPTIONS.map((c) => {
            const count = items.filter((i) => i.ceremony === c).length;
            if (count === 0) return null;
            return (
              <FilterPill
                key={c}
                active={ceremonyFilter === c}
                onClick={() => setCeremonyFilter(c)}
              >
                {CEREMONY_LABEL[c]} ({count})
              </FilterPill>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-bordeaux text-cream text-[0.65rem] uppercase tracking-[0.2em] font-medium hover:bg-ink transition-colors"
        >
          + Add item
        </button>
      </div>

      {/* GROUPED ITEMS */}
      <div className="space-y-8">
        {grouped.length === 0 ? (
          <div className="bg-cream-soft border border-ink/10 p-8 text-center">
            <p className="text-sm text-ink-soft font-light">
              No items in this view. Add one to get started.
            </p>
          </div>
        ) : (
          grouped.map(([ceremony, list]) => (
            <div key={ceremony}>
              <h2 className="text-[0.7rem] uppercase tracking-[0.24em] text-bordeaux mb-3">
                {CEREMONY_LABEL[ceremony] ?? ceremony}
              </h2>
              <ul className="space-y-2">
                {list.map((item) => (
                  <BudgetRow
                    key={item.id}
                    item={item}
                    onEdit={() => setEditing(item)}
                    onDelete={() => handleDelete(item.id)}
                    onTogglePaid={() =>
                      handleUpdate(item.id, { paid: !item.paid })
                    }
                  />
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* FORM MODAL */}
      {(showForm || editing) && (
        <ItemForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSubmit={(data) => {
            if (editing) handleUpdate(editing.id, data);
            else handleCreate({ ...data, vendorId: null, notes: null } as Omit<BudgetItem, "id">);
          }}
        />
      )}
    </div>
  );
}

function SummaryTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-cream-soft border border-ink/10 p-5">
      <p className="text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft mb-2">
        {label}
      </p>
      <p
        className={`font-serif-display text-2xl md:text-3xl ${
          accent ? "text-bordeaux" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.2em] border transition-colors ${
        active
          ? "bg-ink text-cream border-ink"
          : "bg-transparent text-ink-soft border-ink/15 hover:border-bordeaux hover:text-bordeaux"
      }`}
    >
      {children}
    </button>
  );
}

function BudgetRow({
  item,
  onEdit,
  onDelete,
  onTogglePaid,
}: {
  item: BudgetItem;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePaid: () => void;
}) {
  const variance =
    item.actualAmount != null ? item.actualAmount - item.plannedAmount : null;

  return (
    <li className="bg-cream border border-ink/10 p-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 md:items-center hover:border-ink/20 transition-colors">
      <div className="min-w-0">
        <p className="text-sm text-ink font-medium">{item.label}</p>
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-ink-soft mt-0.5">
          {item.category}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft">Planned</p>
        <p className="text-sm text-ink">{inr.format(item.plannedAmount)}</p>
      </div>

      <div className="text-right">
        <p className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft">Actual</p>
        <p className={`text-sm ${variance && variance > 0 ? "text-bordeaux" : "text-ink"}`}>
          {item.actualAmount != null ? inr.format(item.actualAmount) : "—"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTogglePaid}
          className={`text-[0.6rem] uppercase tracking-[0.18em] px-2 py-1 border transition-colors ${
            item.paid
              ? "bg-ink text-cream border-ink"
              : "border-ink/15 text-ink-soft hover:border-bordeaux hover:text-bordeaux"
          }`}
        >
          {item.paid ? "Paid" : "Unpaid"}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="text-[0.6rem] uppercase tracking-[0.18em] px-2 py-1 text-ink-soft hover:text-bordeaux transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-[0.6rem] uppercase tracking-[0.18em] px-2 py-1 text-ink-soft hover:text-bordeaux transition-colors"
          aria-label="Delete"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

interface FormData {
  ceremony: Ceremony;
  category: string;
  label: string;
  plannedAmount: number;
  actualAmount: number | null;
  paid: boolean;
}

function ItemForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: BudgetItem | null;
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
}) {
  const [data, setData] = useState<FormData>({
    ceremony: (initial?.ceremony ?? "wedding") as Ceremony,
    category: initial?.category ?? "",
    label: initial?.label ?? "",
    plannedAmount: initial?.plannedAmount ?? 0,
    actualAmount: initial?.actualAmount ?? null,
    paid: initial?.paid ?? false,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(data);
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-cream p-7 md:p-8 space-y-4 fade-up"
      >
        <h3 className="font-serif-display text-2xl text-ink">
          {initial ? "Edit item" : "Add item"}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ceremony">
            <select
              value={data.ceremony}
              onChange={(e) => setData({ ...data, ceremony: e.target.value as Ceremony })}
              className="editorial-input w-full"
            >
              {CEREMONY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {CEREMONY_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <input
              required
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
              placeholder="Photography, Decor…"
              className="editorial-input w-full"
            />
          </Field>
        </div>
        <Field label="Description">
          <input
            required
            value={data.label}
            onChange={(e) => setData({ ...data, label: e.target.value })}
            className="editorial-input w-full"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Planned (₹)">
            <input
              required
              type="number"
              min={0}
              value={data.plannedAmount}
              onChange={(e) => setData({ ...data, plannedAmount: Number(e.target.value) })}
              className="editorial-input w-full"
            />
          </Field>
          <Field label="Actual (₹)">
            <input
              type="number"
              min={0}
              value={data.actualAmount ?? ""}
              onChange={(e) =>
                setData({
                  ...data,
                  actualAmount: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="editorial-input w-full"
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={data.paid}
            onChange={(e) => setData({ ...data, paid: e.target.checked })}
          />
          Paid
        </label>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-bordeaux text-cream text-[0.65rem] uppercase tracking-[0.22em] font-medium hover:bg-ink transition-colors"
          >
            {initial ? "Save" : "Add item"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
