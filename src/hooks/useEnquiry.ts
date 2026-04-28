"use client";
import { useCallback, useState } from "react";
import type { EnquiryInput } from "@/lib/validators";

const STORAGE_KEY = "shaadisetu.enquiries";

export interface EnquiryRecord extends EnquiryInput {
  id: string;
  submittedAt: string;
}

type Status = "idle" | "submitting" | "success" | "error";

function readHistory(): EnquiryRecord[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeHistory(records: EnquiryRecord[]) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* private mode etc. */
  }
}

export function useEnquiry() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: EnquiryInput) => {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = (await res.json()) as { id: string };
      const record: EnquiryRecord = { ...input, id: data.id, submittedAt: new Date().toISOString() };
      writeHistory([...readHistory(), record]);
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => { setStatus("idle"); setError(null); }, []);

  return { status, error, submit, reset, history: readHistory };
}
