import { db } from "@/lib/db";
import type { Vendor, VendorWithProfile, Package } from "@/types/vendor";

function decodeTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function decodeFeatures(featuresJson: string): string[] {
  return decodeTags(featuresJson);
}

function rowToVendor<T extends { tags: string }>(row: T): Omit<T, "tags"> & { tags: string[] } {
  return { ...row, tags: decodeTags(row.tags) };
}

function rowToPackage<T extends { features: string }>(
  row: T,
): Omit<T, "features"> & { features: string[] } {
  return { ...row, features: decodeFeatures(row.features) };
}

export async function getVendorsForListing(params: {
  cityId: string;
  categoryId: string;
}): Promise<Vendor[]> {
  const rows = await db.vendor.findMany({
    where: { cityId: params.cityId, categoryId: params.categoryId },
    orderBy: { reviewCount: "desc" },
    include: { city: { select: { name: true } } },
  });
  return rows.map(rowToVendor);
}

export async function getVendorProfile(id: string): Promise<VendorWithProfile | null> {
  const row = await db.vendor.findUnique({
    where: { id },
    include: {
      city: { select: { name: true } },
      packages: { orderBy: { price: "asc" } },
      portfolio: true,
      reviews: { orderBy: { date: "desc" } },
      bookedDates: { select: { date: true } },
      stats: true,
    },
  });
  if (!row) return null;
  return {
    ...rowToVendor(row),
    packages: row.packages.map(rowToPackage) as Package[],
    portfolio: row.portfolio,
    reviews: row.reviews,
    bookedDates: row.bookedDates,
    stats: row.stats,
  };
}

export async function getVendorsByIds(ids: string[]): Promise<Vendor[]> {
  if (ids.length === 0) return [];
  const rows = await db.vendor.findMany({
    where: { id: { in: ids } },
    include: { city: { select: { name: true } } },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids
    .map((id) => byId.get(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v))
    .map(rowToVendor);
}

export async function getCategoryVendorCounts(): Promise<Record<string, number>> {
  const grouped = await db.vendor.groupBy({
    by: ["categoryId"],
    _count: { _all: true },
  });
  const out: Record<string, number> = {};
  for (const g of grouped) out[g.categoryId] = g._count._all;
  return out;
}
