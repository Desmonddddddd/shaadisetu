"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { VendorPreview } from "@/types/vendor";

const STORAGE_KEY = "shaadisetu.compare";
const MAX = 3;

interface Ctx {
  items: VendorPreview[];
  ids: string[];
  add: (preview: VendorPreview) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const CompareCtx = createContext<Ctx | null>(null);

function safeRead(): VendorPreview[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x): VendorPreview | null => {
        if (typeof x === "string") return { id: x, name: x };
        if (x && typeof x === "object" && typeof x.id === "string" && typeof x.name === "string") {
          return { id: x.id, name: x.name };
        }
        return null;
      })
      .filter((x): x is VendorPreview => x !== null);
  } catch {
    return [];
  }
}

function safeWrite(items: VendorPreview[]) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* private mode etc. */
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<VendorPreview[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(safeRead());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) safeWrite(items);
  }, [items, hydrated]);

  const add = useCallback((preview: VendorPreview): boolean => {
    let added = false;
    setItems((curr) => {
      if (curr.some((x) => x.id === preview.id) || curr.length >= MAX) return curr;
      added = true;
      return [...curr, preview];
    });
    return added;
  }, []);

  const remove = useCallback(
    (id: string) => setItems((curr) => curr.filter((x) => x.id !== id)),
    [],
  );
  const clear = useCallback(() => setItems([]), []);
  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);
  const ids = useMemo(() => items.map((x) => x.id), [items]);

  return (
    <CompareCtx.Provider value={{ items, ids, add, remove, clear, has }}>{children}</CompareCtx.Provider>
  );
}

export function useCompare(): Ctx {
  const ctx = useContext(CompareCtx);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
