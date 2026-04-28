"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "shaadisetu.compare";
const MAX = 3;

interface Ctx {
  ids: string[];
  add: (id: string) => boolean;     // true if added; false if rejected (overflow or duplicate)
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const CompareCtx = createContext<Ctx | null>(null);

function safeRead(): string[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function safeWrite(ids: string[]) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* private mode etc. */
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(safeRead());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) safeWrite(ids);
  }, [ids, hydrated]);

  const add = useCallback((id: string): boolean => {
    let added = false;
    setIds((curr) => {
      if (curr.includes(id) || curr.length >= MAX) return curr;
      added = true;
      return [...curr, id];
    });
    return added;
  }, []);

  const remove = useCallback(
    (id: string) => setIds((curr) => curr.filter((x) => x !== id)),
    [],
  );
  const clear = useCallback(() => setIds([]), []);
  const has = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <CompareCtx.Provider value={{ ids, add, remove, clear, has }}>{children}</CompareCtx.Provider>
  );
}

export function useCompare(): Ctx {
  const ctx = useContext(CompareCtx);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
