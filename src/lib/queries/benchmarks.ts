import { db } from "@/lib/db";

export interface CategoryBenchmark {
  categoryId: string;
  vendorCount: number;
  modePriceRange: string | null;
  distribution: Record<string, number>;
}

export async function getVendorBenchmarks(): Promise<CategoryBenchmark[]> {
  const rows = await db.vendor.findMany({
    select: { categoryId: true, priceRange: true },
  });

  const byCategory = new Map<string, Map<string, number>>();
  for (const r of rows) {
    if (!r.priceRange) continue;
    const inner = byCategory.get(r.categoryId) ?? new Map<string, number>();
    inner.set(r.priceRange, (inner.get(r.priceRange) ?? 0) + 1);
    byCategory.set(r.categoryId, inner);
  }

  const result: CategoryBenchmark[] = [];
  for (const [categoryId, dist] of byCategory) {
    let mode: string | null = null;
    let modeCount = 0;
    let total = 0;
    const distribution: Record<string, number> = {};
    for (const [price, count] of dist) {
      distribution[price] = count;
      total += count;
      if (count > modeCount) {
        modeCount = count;
        mode = price;
      }
    }
    result.push({
      categoryId,
      vendorCount: total,
      modePriceRange: mode,
      distribution,
    });
  }

  return result;
}
