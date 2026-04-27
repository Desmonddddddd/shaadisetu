import { sampleVendors } from "./vendors";

export interface VendorStats {
  weddingsCompleted: number;
  customersServed: number;
  yearsExperience: number;
  responseTime: string;
}

// Deterministic stats derived from each vendor's reviewCount + yearsExperience
function buildStats(reviewCount: number, years: number): Omit<VendorStats, "yearsExperience"> {
  const weddings = Math.max(reviewCount * 2, years * 25);
  const customers = Math.round(weddings * 1.4);
  const responseTime =
    reviewCount > 100 ? "Usually within 1 hour"
    : reviewCount > 50 ? "Usually within 2 hours"
    : "Usually within 24 hours";
  return { weddingsCompleted: weddings, customersServed: customers, responseTime };
}

export const statsByVendor: Record<string, VendorStats> = Object.fromEntries(
  sampleVendors.map((v) => [
    v.id,
    { ...buildStats(v.reviewCount, v.yearsExperience), yearsExperience: v.yearsExperience },
  ]),
);
