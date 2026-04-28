import type { Vendor, VendorStats } from "@/types/vendor";
import { SaveButton } from "@/components/account/SaveButton";

interface Props {
  vendor: Vendor;
  stats: VendorStats | null;
  isAuthed?: boolean;
  initialSaved?: boolean;
}

export function VendorProfileHero({
  vendor,
  stats,
  isAuthed = false,
  initialSaved = false,
}: Props) {
  return (
    <header
      className="relative overflow-hidden text-cream p-12 md:p-16 min-h-[340px] flex items-end"
      style={
        vendor.coverImage
          ? {
              backgroundImage: `linear-gradient(rgba(26,26,26,0.55), rgba(26,26,26,0.85)), url("${vendor.coverImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {
              backgroundImage: `linear-gradient(135deg, #4a1620 0%, #6b1f2a 60%, #1a1a1a 100%)`,
            }
      }
    >
      <div className="relative flex items-end justify-between gap-6 w-full">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.28em] uppercase text-champagne mb-3">
            {vendor.verified ? "✓ Verified Atelier" : "Featured Vendor"}
          </p>
          <h1 className="font-serif-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            {vendor.name}
          </h1>
          <span className="block w-16 h-px bg-champagne mt-4" />
          <p className="text-sm opacity-80 mt-4 tracking-wide">
            ★ {vendor.rating} · {vendor.reviewCount} reviews · {vendor.city.name} · {vendor.yearsExperience} years
          </p>
        </div>
        <div className="shrink-0">
          <SaveButton
            vendorId={vendor.id}
            initialSaved={initialSaved}
            isAuthed={isAuthed}
            variant="pill"
            className="!bg-white/15 !border-white/30 !text-white hover:!bg-white/25"
          />
        </div>
      </div>
      {stats && (
        <div className="relative grid grid-cols-3 gap-px bg-champagne/30 mt-8">
          <Stat label="Weddings" value={stats.weddingsCompleted.toLocaleString()} />
          <Stat label="Customers" value={stats.customersServed.toLocaleString()} />
          <Stat label="Response" value={stats.responseTime} />
        </div>
      )}
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink/40 backdrop-blur-sm px-5 py-4">
      <div className="font-serif-display text-2xl text-champagne">{value}</div>
      <div className="text-[0.65rem] uppercase tracking-[0.22em] text-cream/70 mt-1">{label}</div>
    </div>
  );
}
