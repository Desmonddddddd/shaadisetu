// Parse free-form Indian price strings (e.g. "₹5-15 Lakh", "₹25K-1 Lakh",
// "Under ₹1 Lakh", "₹500-3000/piece") into rupee min/max bounds.

export interface PriceBand {
  min: number;
  max: number;
  perPlate: boolean;
  perPiece: boolean;
}

const LAKH = 100_000;
const CRORE = 10_000_000;

function parseToken(raw: string): number | null {
  const t = raw.trim().toLowerCase().replace(/[₹,\s]/g, "");
  if (!t) return null;

  // Match number + optional suffix
  const m = t.match(/^([\d.]+)(k|lakh|cr|crore)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (Number.isNaN(n)) return null;
  const suffix = m[2];
  if (suffix === "k") return n * 1_000;
  if (suffix === "lakh") return n * LAKH;
  if (suffix === "cr" || suffix === "crore") return n * CRORE;
  return n;
}

export function parsePriceBand(raw: string | null | undefined): PriceBand | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  const perPlate = /\/plate/.test(lower);
  const perPiece = /\/piece/.test(lower);

  // "Under ₹X Y" → 0 to X
  const under = lower.match(/under\s+₹?\s*([\d.]+\s*(k|lakh|cr|crore)?)/);
  if (under) {
    const top = parseToken(under[1]);
    if (top !== null) return { min: 0, max: top, perPlate, perPiece };
  }

  // Strip /plate, /piece suffixes
  const cleaned = raw.replace(/\/plate|\/piece/gi, "").trim();

  // Split into pieces around the first hyphen
  const parts = cleaned.split(/[-–—]/).map((p) => p.trim()).filter(Boolean);

  // Detect a shared trailing suffix like "Lakh" or "Cr" applied to the upper
  // bound only (e.g. "₹5-15 Lakh"). Apply it to the lower bound too unless
  // the lower bound already names its own suffix.
  if (parts.length === 2) {
    const [low, high] = parts;
    let lowParsed = parseToken(low);
    const highParsed = parseToken(high);
    const highSuffixMatch = high.match(/(k|lakh|cr|crore)\s*$/i);
    const lowHasSuffix = /(k|lakh|cr|crore)\s*$/i.test(low);
    if (lowParsed !== null && highParsed !== null && highSuffixMatch && !lowHasSuffix) {
      // Re-parse lower with high's suffix
      const inferred = parseToken(`${low}${highSuffixMatch[1]}`);
      if (inferred !== null) lowParsed = inferred;
    }
    if (lowParsed !== null && highParsed !== null) {
      return { min: lowParsed, max: highParsed, perPlate, perPiece };
    }
  }

  if (parts.length === 1) {
    const v = parseToken(parts[0]);
    if (v !== null) return { min: v, max: v, perPlate, perPiece };
  }

  return null;
}

export interface MatchInput {
  priceRange: string;
  categoryId: string;
}

// Estimate the total cost a vendor would represent for a typical wedding
// (assume 200 guests for /plate items, 100 hampers for /piece).
export function estimatedTotalForVendor(band: PriceBand): number {
  const base = (band.min + band.max) / 2;
  if (band.perPlate) return base * 200;
  if (band.perPiece) return base * 100;
  return base;
}

export function vendorFitsTier(
  band: PriceBand | null,
  perCategoryAllowance: number,
): boolean {
  if (!band) return false;
  const est = estimatedTotalForVendor(band);
  return est <= perCategoryAllowance;
}
