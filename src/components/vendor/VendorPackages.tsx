import type { Package } from "@/types/vendor";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export function VendorPackages({ packages }: { packages: Package[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {packages.map((p) => (
          <div
            key={p.tier}
            className={`relative p-4 rounded-xl border-2 ${
              p.popular ? "border-shaadi-deep bg-shaadi-light" : "border-gray-200 bg-white"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-2 left-4 text-[10px] bg-shaadi-deep text-white px-2 py-0.5 rounded-full uppercase">
                Most Popular
              </span>
            )}
            <h3 className="text-sm uppercase text-slate-500">{p.tier}</h3>
            <div className="text-xl font-semibold text-slate-900 mt-1">{p.name}</div>
            <div className="text-2xl font-bold text-shaadi-deep mt-2">{formatINR(p.price)}</div>
            <ul className="text-sm text-slate-700 space-y-1.5 mt-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-shaadi-deep">✓</span> {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
