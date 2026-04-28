"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setState(JSON.parse(raw) as T);
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(state));
    } catch {
      // ignore quota / disabled storage
    }
  }, [state, hydrated]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) =>
        typeof next === "function" ? (next as (p: T) => T)(prev) : next,
      );
    },
    [],
  );

  return [state, update, hydrated];
}
