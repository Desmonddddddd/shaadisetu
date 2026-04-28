"use client";
import { useEffect } from "react";

export default function VendorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[vendors] error boundary caught:", error);
  }, [error]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">Couldn&apos;t load vendors right now</h1>
      <p className="text-slate-600 mt-2">
        We&apos;re having trouble reaching the database. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="inline-block mt-6 bg-shaadi-deep text-white px-5 py-2 rounded-lg"
      >
        Try again
      </button>
    </main>
  );
}
