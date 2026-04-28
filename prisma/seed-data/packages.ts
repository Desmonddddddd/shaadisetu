import { sampleVendors, Vendor } from "./vendors";

export interface Package {
  tier: "basic" | "standard" | "premium";
  name: string;
  price: number; // INR
  features: string[];
  popular?: boolean;
}

// Parse the lowest INR amount mentioned in vendor.priceRange (e.g. "₹75K-2 Lakh" -> 75000)
function parseLow(range: string): number {
  const m = range.match(/₹\s*([\d.]+)\s*(K|Lakh|L)?/i);
  if (!m) return 25_000;
  const n = parseFloat(m[1]);
  const unit = (m[2] || "").toLowerCase();
  if (unit.startsWith("l")) return Math.round(n * 100_000);
  if (unit === "k") return Math.round(n * 1000);
  return Math.round(n);
}

const FEATURES: Record<string, string[]> = {
  basic: [
    "Up to 6 hours coverage",
    "Single event",
    "Online gallery",
    "Standard delivery (3 weeks)",
  ],
  standard: [
    "Up to 10 hours coverage",
    "Two events (e.g. haldi + wedding)",
    "Curated highlights film",
    "Premium delivery (2 weeks)",
    "Edited album proofs",
  ],
  premium: [
    "Full day coverage (12+ hours)",
    "All wedding events covered",
    "Cinematic film + drone",
    "Priority delivery (1 week)",
    "Premium hardcover album",
    "Same-day teaser",
    "Dedicated coordinator",
  ],
};

function buildPackages(v: Vendor): Package[] {
  const base = parseLow(v.priceRange);
  return [
    { tier: "basic", name: "Essentials", price: base, features: FEATURES.basic },
    { tier: "standard", name: "Signature", price: Math.round(base * 1.8), features: FEATURES.standard, popular: true },
    { tier: "premium", name: "Luxe", price: Math.round(base * 3), features: FEATURES.premium },
  ];
}

export const packagesByVendor: Record<string, Package[]> = Object.fromEntries(
  sampleVendors.map((v) => [v.id, buildPackages(v)]),
);
