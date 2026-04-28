import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

import { PrismaClient } from "../src/generated/prisma";
import { cities } from "../src/data/cities";
import { categories } from "../src/data/categories";
import { sampleVendors } from "./seed-data/vendors";
import { packagesByVendor } from "./seed-data/packages";
import { portfolioByVendor } from "./seed-data/portfolio";
import { reviewsByVendor } from "./seed-data/reviews";
import { bookedDatesByVendor } from "./seed-data/availability";
import { statsByVendor } from "./seed-data/stats";
import { toSlug } from "./seed-data/slugs";

const prisma = new PrismaClient();

function buildCitySlugs(): Map<string, string> {
  const counts = new Map<string, number>();
  for (const c of cities) {
    const ns = toSlug(c.name);
    counts.set(ns, (counts.get(ns) ?? 0) + 1);
  }
  const out = new Map<string, string>();
  for (const c of cities) {
    const ns = toSlug(c.name);
    const slug = (counts.get(ns) ?? 0) > 1 ? `${ns}-${toSlug(c.state)}` : ns;
    out.set(`${c.name}|${c.state}`, slug);
  }
  return out;
}

async function wipe() {
  // Order matters: children first.
  await prisma.enquiry.deleteMany();
  await prisma.bookedDate.deleteMany();
  await prisma.vendorStats.deleteMany();
  await prisma.review.deleteMany();
  await prisma.portfolioImage.deleteMany();
  await prisma.package.deleteMany();
  await prisma.vendorAccount.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.city.deleteMany();
}

async function main() {
  console.time("[seed] total");
  await wipe();

  const slugs = buildCitySlugs();

  // Cities — bulk
  const cityRows = cities.map((c) => ({
    name: c.name,
    state: c.state,
    slug: slugs.get(`${c.name}|${c.state}`)!,
  }));
  await prisma.city.createMany({ data: cityRows });
  const cityByKey = new Map(
    (await prisma.city.findMany({ select: { id: true, name: true, state: true } })).map(
      (c) => [`${c.name}|${c.state}`, c.id],
    ),
  );
  console.log(`[seed] cities: ${cityRows.length}`);

  // Categories + subcategories — bulk
  await prisma.category.createMany({
    data: categories.map((c) => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji,
      description: c.description,
    })),
  });
  const subRows = categories.flatMap((cat) =>
    cat.subcategories.map((s) => ({
      id: s.id,
      name: s.name,
      group: s.group ?? null,
      categoryId: cat.id,
    })),
  );
  await prisma.subcategory.createMany({ data: subRows });
  console.log(`[seed] categories: ${categories.length}, subcategories: ${subRows.length}`);

  // Vendors — need to ensure each vendor's city exists. Auto-create
  // fallback rows for vendors whose city isn't in the master cities list
  // (e.g. "Goa, Goa").
  const missingCities = new Map<string, { name: string; state: string; slug: string }>();
  for (const v of sampleVendors) {
    const key = `${v.city}|${v.state}`;
    if (!cityByKey.has(key) && !missingCities.has(key)) {
      missingCities.set(key, {
        name: v.city,
        state: v.state,
        slug: `${toSlug(v.city)}-${toSlug(v.state)}`,
      });
    }
  }
  if (missingCities.size > 0) {
    await prisma.city.createMany({ data: [...missingCities.values()] });
    const refreshed = await prisma.city.findMany({
      where: { slug: { in: [...missingCities.values()].map((c) => c.slug) } },
      select: { id: true, name: true, state: true },
    });
    for (const c of refreshed) cityByKey.set(`${c.name}|${c.state}`, c.id);
    console.log(`[seed] auto-created cities: ${missingCities.size}`);
  }

  await prisma.vendor.createMany({
    data: sampleVendors.map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      cityId: cityByKey.get(`${v.city}|${v.state}`)!,
      categoryId: v.categoryId,
      rating: v.rating,
      reviewCount: v.reviewCount,
      priceRange: v.priceRange,
      yearsExperience: v.yearsExperience,
      verified: v.verified,
      tags: JSON.stringify(v.tags),
      email: `${v.id}@vendors.shaadisetu.test`,
      moderationState: "live",
    })),
  });
  console.log(`[seed] vendors: ${sampleVendors.length}`);

  const seededVendorIds = new Set(sampleVendors.map((v) => v.id));

  // Packages — bulk (no client-side id; default cuid())
  const packageRows = Object.entries(packagesByVendor).flatMap(([vendorId, pkgs]) =>
    seededVendorIds.has(vendorId)
      ? pkgs.map((p) => ({
          vendorId,
          tier: p.tier,
          name: p.name,
          price: p.price,
          features: JSON.stringify(p.features),
          popular: p.popular ?? false,
        }))
      : [],
  );
  await prisma.package.createMany({ data: packageRows });
  console.log(`[seed] packages: ${packageRows.length}`);

  // Portfolio — bulk
  const portfolioRows = Object.entries(portfolioByVendor).flatMap(([vendorId, imgs]) =>
    seededVendorIds.has(vendorId)
      ? imgs.map((img) => ({
          id: img.id,
          vendorId,
          url: img.url,
          caption: img.caption,
          eventType: img.eventType,
        }))
      : [],
  );
  await prisma.portfolioImage.createMany({ data: portfolioRows });
  console.log(`[seed] portfolio images: ${portfolioRows.length}`);

  // Reviews — bulk
  const reviewRows = Object.entries(reviewsByVendor).flatMap(([vendorId, rs]) =>
    seededVendorIds.has(vendorId)
      ? rs.map((r) => ({
          id: r.id,
          vendorId,
          author: r.author,
          rating: r.rating,
          date: r.date,
          title: r.title,
          body: r.body,
          eventType: r.eventType,
        }))
      : [],
  );
  await prisma.review.createMany({ data: reviewRows });
  console.log(`[seed] reviews: ${reviewRows.length}`);

  // Booked dates — bulk
  const bookedRows = Object.entries(bookedDatesByVendor).flatMap(([vendorId, dates]) =>
    seededVendorIds.has(vendorId) ? dates.map((date) => ({ vendorId, date })) : [],
  );
  await prisma.bookedDate.createMany({ data: bookedRows });
  console.log(`[seed] booked dates: ${bookedRows.length}`);

  // Vendor stats — bulk
  const statsRows = Object.entries(statsByVendor).flatMap(([vendorId, s]) =>
    seededVendorIds.has(vendorId)
      ? [
          {
            vendorId,
            weddingsCompleted: s.weddingsCompleted,
            customersServed: s.customersServed,
            responseTime: s.responseTime,
            yearsExperience: s.yearsExperience,
          },
        ]
      : [],
  );
  await prisma.vendorStats.createMany({ data: statsRows });
  console.log(`[seed] vendor stats: ${statsRows.length}`);

  console.timeEnd("[seed] total");
}

main()
  .catch((e) => {
    console.error("[seed] failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
