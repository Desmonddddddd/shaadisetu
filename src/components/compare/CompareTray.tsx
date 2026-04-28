"use client";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";

export function CompareTray() {
  const { items, ids, remove, clear } = useCompare();
  if (items.length === 0) return null;

  const href = `/compare?ids=${ids.join(",")}`;

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white border border-shaadi-light rounded-xl shadow-lg p-3 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-shaadi-deep">Compare ({items.length}/3)</span>
        <button onClick={clear} className="text-xs text-slate-500 hover:underline">Clear</button>
      </div>
      <ul className="space-y-1 mb-2">
        {items.map((v) => (
          <li key={v.id} className="flex items-center justify-between text-xs">
            <span className="truncate">{v.name}</span>
            <button onClick={() => remove(v.id)} className="text-slate-400 hover:text-red-700 ml-2" aria-label={`Remove ${v.name}`}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="block w-full text-center bg-shaadi-deep text-white text-sm py-1.5 rounded-lg"
      >
        Compare →
      </Link>
    </div>
  );
}
