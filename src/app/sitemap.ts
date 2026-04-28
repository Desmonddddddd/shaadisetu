import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { BUDGET_TIERS } from "@/data/budgetTiers";
import { WEDDING_EVENTS } from "@/data/weddingEvents";

const BASE = "https://shaadisetu.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/categories",
    "/wall",
    "/finance",
    "/finance/insurance",
    "/finance/loan",
    "/privacy",
    "/terms",
    "/cookies",
    "/refund",
    "/compare",
    "/functions",
    "/membership",
    "/plan",
    "/plan/budget",
    "/plan/checklist",
    "/plan-with-me",
    "/vendors",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));

  const tierRoutes = BUDGET_TIERS.map((t) => ({
    url: `${BASE}/functions/budget/${t.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const eventRoutes = WEDDING_EVENTS.map((e) => ({
    url: `${BASE}/functions/event/${e.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Live vendors and category pages — capped to keep the sitemap reasonable.
  let vendorRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const [vendors, categories] = await Promise.all([
      db.vendor.findMany({
        where: { moderationState: "live" },
        select: { id: true, updatedAt: true },
        take: 500,
      }),
      db.category.findMany({ select: { id: true } }),
    ]);
    vendorRoutes = vendors.map((v) => ({
      url: `${BASE}/vendors/v/${v.id}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
    categoryRoutes = categories.map((c) => ({
      url: `${BASE}/categories/${c.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // If DB is unreachable at build time, fall back to static-only sitemap.
  }

  return [...staticRoutes, ...tierRoutes, ...eventRoutes, ...categoryRoutes, ...vendorRoutes];
}
