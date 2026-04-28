import type { Vendor } from "@/data/vendors";
import { statsByVendor } from "@/data/stats";

export function VendorProfileHero({ vendor }: { vendor: Vendor }) {
  const stats = statsByVendor[vendor.id];
  return (
    <header className="bg-gradient-to-br from-shaadi-light via-shaadi-rose to-shaadi-deep text-white p-6 rounded-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {vendor.name}{" "}
            {vendor.verified && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">✓ Verified</span>
            )}
          </h1>
          <p className="text-sm opacity-90">
            ⭐ {vendor.rating} ({vendor.reviewCount}) · {vendor.city} · {vendor.yearsExperience} yrs
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <Stat label="Weddings" value={stats.weddingsCompleted.toLocaleString()} />
        <Stat label="Customers" value={stats.customersServed.toLocaleString()} />
        <Stat label="Response" value={stats.responseTime} />
      </div>
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 rounded-lg px-3 py-2">
      <div className="text-xs uppercase opacity-80">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
