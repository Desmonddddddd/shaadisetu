import { db } from "@/lib/db";
import type { Vendor } from "@/types/vendor";
import { BUDGET_CATEGORIES } from "@/data/budgetCategories";
import { parsePriceBand, estimatedTotalForVendor } from "@/lib/pricing";
import type { BudgetTier } from "@/data/budgetTiers";
import type { WeddingEvent } from "@/data/weddingEvents";

interface RawVendorRow {
  id: string;
  name: string;
  description: string;
  cityId: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  yearsExperience: number;
  verified: boolean;
  tags: string;
  email: string | null;
  moderationState: string;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  cityName: string;
}

function decodeTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function rowToVendor(r: RawVendorRow): Vendor {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    cityId: r.cityId,
    categoryId: r.categoryId,
    rating: r.rating,
    reviewCount: r.reviewCount,
    priceRange: r.priceRange,
    yearsExperience: r.yearsExperience,
    verified: r.verified,
    tags: decodeTags(r.tags),
    email: r.email,
    moderationState: r.moderationState,
    coverImage: r.coverImage,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    city: { name: r.cityName },
  };
}

async function fetchLiveVendors(): Promise<Vendor[]> {
  const rows = await db.$queryRawUnsafe<RawVendorRow[]>(`
    SELECT
      v."id", v."name", v."description", v."cityId", v."categoryId",
      v."rating", v."reviewCount", v."priceRange", v."yearsExperience",
      v."verified", v."tags", v."email", v."moderationState", v."coverImage",
      v."createdAt", v."updatedAt",
      c."name" AS "cityName"
    FROM "Vendor" v
    JOIN "City" c ON c."id" = v."cityId"
    WHERE v."moderationState" = 'live'
    ORDER BY v."rating" DESC, v."reviewCount" DESC
  `);
  return rows.map(rowToVendor);
}

export interface BudgetTierBucket {
  category: typeof BUDGET_CATEGORIES[number];
  perCategoryBudget: number;
  vendors: Vendor[];
}

/**
 * For a budget tier, compute the per-category rupee allowance and return
 * vendors whose estimated total fits within that allowance, grouped per
 * category. Sorted by rating, capped per category.
 */
export async function getVendorsForBudgetTier(
  tier: BudgetTier,
  perCategoryLimit = 6,
): Promise<BudgetTierBucket[]> {
  const all = await fetchLiveVendors();

  const buckets: BudgetTierBucket[] = [];
  for (const cat of BUDGET_CATEGORIES) {
    const allowance = (cat.defaultPercent / 100) * tier.allocationTotal;
    const vendorCategoryId = cat.vendorCategoryId;
    if (!vendorCategoryId) continue;

    const matching = all
      .filter((v) => v.categoryId === vendorCategoryId)
      .filter((v) => {
        const band = parsePriceBand(v.priceRange);
        if (!band) return false;
        const est = estimatedTotalForVendor(band);
        // Royal tier has no upper bound — keep everything for the top category.
        if (!Number.isFinite(tier.totalMax)) return est >= tier.totalMin / 50;
        return est <= allowance * 1.15; // 15% headroom for borderline matches
      })
      .slice(0, perCategoryLimit);

    if (matching.length > 0) {
      buckets.push({ category: cat, perCategoryBudget: allowance, vendors: matching });
    }
  }
  return buckets;
}

export interface EventCategoryBucket {
  categoryId: string;
  vendors: Vendor[];
}

/**
 * For a wedding event, return vendors grouped by category, in the order the
 * event lists its categoryIds. Capped per category.
 */
export async function getVendorsForEvent(
  event: WeddingEvent,
  perCategoryLimit = 8,
): Promise<EventCategoryBucket[]> {
  const all = await fetchLiveVendors();

  const buckets: EventCategoryBucket[] = [];
  for (const categoryId of event.categoryIds) {
    const vendors = all
      .filter((v) => v.categoryId === categoryId)
      .slice(0, perCategoryLimit);
    if (vendors.length > 0) {
      buckets.push({ categoryId, vendors });
    }
  }
  return buckets;
}
