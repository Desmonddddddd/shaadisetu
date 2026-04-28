import { db } from "@/lib/db";
import type { Vendor } from "@/types/vendor";

export interface SearchParams {
  q?: string;
  cityId?: string;
  categoryId?: string;
  minRating?: number;
  priceRange?: string;
  limit?: number;
}

interface RawRow {
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
  rank: number;
}

function decodeTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Search vendors with optional full-text query + filters.
 * - When `q` is given: ranks by tsvector match, then rating.
 * - When `q` is empty: filters only, sorts by rating desc.
 *
 * Uses parameterised raw SQL via Prisma.$queryRaw to leverage the GIN
 * tsvector index (Prisma's typed query builder doesn't expose tsvector
 * operators).
 */
export async function searchVendors(params: SearchParams): Promise<Vendor[]> {
  const limit = Math.min(params.limit ?? 50, 100);
  const q = params.q?.trim() ?? "";

  // Build a list of conditions; raw SQL with $N placeholders.
  const conds: string[] = [`v."moderationState" = 'live'`];
  const args: unknown[] = [];

  function bind(value: unknown): string {
    args.push(value);
    return `$${args.length}`;
  }

  if (params.cityId) conds.push(`v."cityId" = ${bind(params.cityId)}`);
  if (params.categoryId) conds.push(`v."categoryId" = ${bind(params.categoryId)}`);
  if (typeof params.minRating === "number") conds.push(`v."rating" >= ${bind(params.minRating)}`);
  if (params.priceRange) conds.push(`v."priceRange" = ${bind(params.priceRange)}`);

  let rankExpr = `1.0`;
  if (q.length > 0) {
    // plainto_tsquery handles user input safely; AND-of-words semantics.
    const queryParam = bind(q);
    conds.push(`v."searchVector" @@ plainto_tsquery('simple', ${queryParam})`);
    rankExpr = `ts_rank(v."searchVector", plainto_tsquery('simple', ${queryParam}))`;
  }

  const where = conds.join(" AND ");
  const limitParam = bind(limit);

  const sql = `
    SELECT
      v."id", v."name", v."description", v."cityId", v."categoryId",
      v."rating", v."reviewCount", v."priceRange", v."yearsExperience",
      v."verified", v."tags", v."email", v."moderationState", v."coverImage",
      v."createdAt", v."updatedAt",
      c."name" AS "cityName",
      ${rankExpr} AS "rank"
    FROM "Vendor" v
    JOIN "City" c ON c."id" = v."cityId"
    WHERE ${where}
    ORDER BY "rank" DESC, v."rating" DESC, v."reviewCount" DESC
    LIMIT ${limitParam}
  `;

  const rows = await db.$queryRawUnsafe<RawRow[]>(sql, ...args);
  return rows.map((r) => ({
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
  }));
}

export async function getDistinctPriceRanges(): Promise<string[]> {
  const rows = await db.vendor.findMany({
    distinct: ["priceRange"],
    select: { priceRange: true },
    orderBy: { priceRange: "asc" },
  });
  return rows.map((r) => r.priceRange);
}
