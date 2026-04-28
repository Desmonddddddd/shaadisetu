"use client";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { sampleVendors } from "@/data/vendors";
import { packagesByVendor } from "@/data/packages";
import { statsByVendor } from "@/data/stats";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function ComparisonTable() {
  const { ids, remove } = useCompare();
  const vendors = ids
    .map((id) => sampleVendors.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  if (vendors.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-600 mb-4">No vendors selected.</p>
        <Link href="/vendors" className="text-shaadi-deep underline">Browse vendors</Link>
      </div>
    );
  }

  const cols = `200px repeat(${vendors.length}, minmax(220px, 1fr))`;

  const Row = ({ label, render }: { label: string; render: (v: typeof vendors[number]) => React.ReactNode }) => (
    <div className="grid items-start gap-3 py-3 border-b border-gray-100" style={{ gridTemplateColumns: cols }}>
      <div className="text-xs uppercase text-slate-500">{label}</div>
      {vendors.map((v) => <div key={v.id} className="text-sm text-slate-800">{render(v)}</div>)}
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="grid items-end gap-3 pb-3 border-b border-gray-200 sticky top-0 bg-white" style={{ gridTemplateColumns: cols }}>
        <div />
        {vendors.map((v) => (
          <div key={v.id} className="space-y-1">
            <div className="aspect-[4/3] bg-gradient-to-br from-shaadi-light to-shaadi-rose rounded-lg" aria-hidden />
            <h3 className="font-semibold text-slate-900 truncate">{v.name}</h3>
            <button onClick={() => remove(v.id)} className="text-xs text-slate-500 hover:text-red-700">Remove</button>
          </div>
        ))}
      </div>

      <Row label="Rating" render={(v) => <>⭐ {v.rating} ({v.reviewCount})</>} />
      <Row label="Starting price" render={(v) => formatINR((packagesByVendor[v.id] ?? [])[0]?.price ?? 0)} />
      <Row label="City" render={(v) => v.city} />
      <Row label="Experience" render={(v) => `${v.yearsExperience} yrs`} />
      <Row label="Verified" render={(v) => (v.verified ? "✓ Yes" : "—")} />
      <Row label="Response time" render={(v) => statsByVendor[v.id]?.responseTime ?? "—"} />
      <Row label="Tags" render={(v) => v.tags.join(", ")} />

      <div className="grid items-stretch gap-3 pt-4" style={{ gridTemplateColumns: cols }}>
        <div />
        {vendors.map((v) => (
          <Link key={v.id} href={`/vendors/v/${v.id}`} className="text-center bg-shaadi-deep text-white py-2 rounded-lg text-sm">
            View profile & enquire
          </Link>
        ))}
      </div>
    </div>
  );
}
