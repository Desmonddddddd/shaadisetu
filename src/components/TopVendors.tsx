import { db } from "@/lib/db";
import type { Vendor } from "@/types/vendor";
import { TopVendorsClient } from "./TopVendorsClient";

function decodeTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export default async function TopVendors() {
  const rows = await db.vendor.findMany({
    where: { verified: true, rating: { gte: 4.7 } },
    orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
    take: 6,
    include: {
      city: { select: { name: true } },
      category: { select: { name: true } },
    },
  });
  const vendors = rows.map((r) => ({
    vendor: { ...r, tags: decodeTags(r.tags) } as Vendor,
    categoryName: r.category.name,
  }));
  return <TopVendorsClient vendors={vendors} />;
}
