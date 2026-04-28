import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

import { PrismaClient } from "../src/generated/prisma";
import { cities } from "../src/data/cities";
import { categories } from "../src/data/categories";
import { sampleVendors } from "../src/data/vendors";
import { packagesByVendor } from "../src/data/packages";
import { portfolioByVendor } from "../src/data/portfolio";
import { reviewsByVendor } from "../src/data/reviews";
import { bookedDatesByVendor } from "../src/data/availability";
import { statsByVendor } from "../src/data/stats";
import { toSlug } from "../src/lib/slugs";

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

async function seedCities(slugs: Map<string, string>) {
  console.log(`[seed] cities: ${cities.length}`);
  for (const c of cities) {
    const slug = slugs.get(`${c.name}|${c.state}`)!;
    await prisma.city.upsert({
      where: { slug },
      update: { name: c.name, state: c.state },
      create: { slug, name: c.name, state: c.state },
    });
  }
}

async function seedCategories() {
  console.log(`[seed] categories: ${categories.length}`);
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, emoji: cat.emoji, description: cat.description },
      create: { id: cat.id, name: cat.name, emoji: cat.emoji, description: cat.description },
    });
    for (const sub of cat.subcategories) {
      await prisma.subcategory.upsert({
        where: { id: sub.id },
        update: { name: sub.name, group: sub.group ?? null, categoryId: cat.id },
        create: { id: sub.id, name: sub.name, group: sub.group ?? null, categoryId: cat.id },
      });
    }
  }
}

async function seedVendors() {
  console.log(`[seed] vendors: ${sampleVendors.length}`);
  let skipped = 0;
  for (const v of sampleVendors) {
    let cityRow = await prisma.city.findFirst({
      where: { name: v.city, state: v.state },
    });
    if (!cityRow) {
      // Auto-create a city row for vendor-only references (e.g. "Goa, Goa"
      // where the mock city list only has individual Goan cities).
      const fallbackSlug = `${toSlug(v.city)}-${toSlug(v.state)}`;
      cityRow = await prisma.city.upsert({
        where: { slug: fallbackSlug },
        update: { name: v.city, state: v.state },
        create: { slug: fallbackSlug, name: v.city, state: v.state },
      });
      console.log(`[seed] auto-created city for vendor ${v.id}: ${v.city}, ${v.state}`);
    }
    const tagsJson = JSON.stringify(v.tags);
    await prisma.vendor.upsert({
      where: { id: v.id },
      update: {
        name: v.name,
        description: v.description,
        cityId: cityRow.id,
        categoryId: v.categoryId,
        rating: v.rating,
        reviewCount: v.reviewCount,
        priceRange: v.priceRange,
        yearsExperience: v.yearsExperience,
        verified: v.verified,
        tags: tagsJson,
      },
      create: {
        id: v.id,
        name: v.name,
        description: v.description,
        cityId: cityRow.id,
        categoryId: v.categoryId,
        rating: v.rating,
        reviewCount: v.reviewCount,
        priceRange: v.priceRange,
        yearsExperience: v.yearsExperience,
        verified: v.verified,
        tags: tagsJson,
      },
    });
  }
  if (skipped > 0) console.warn(`[seed] vendors skipped: ${skipped}`);
}

async function seedPackages(seededVendorIds: Set<string>) {
  let total = 0;
  for (const vendorId of Object.keys(packagesByVendor)) {
    if (!seededVendorIds.has(vendorId)) continue;
    const pkgs = packagesByVendor[vendorId];
    await prisma.package.deleteMany({ where: { vendorId } });
    for (const p of pkgs) {
      await prisma.package.create({
        data: {
          vendorId,
          tier: p.tier,
          name: p.name,
          price: p.price,
          features: JSON.stringify(p.features),
          popular: p.popular ?? false,
        },
      });
      total++;
    }
  }
  console.log(`[seed] packages: ${total}`);
}

async function seedPortfolio(seededVendorIds: Set<string>) {
  let total = 0;
  for (const vendorId of Object.keys(portfolioByVendor)) {
    if (!seededVendorIds.has(vendorId)) continue;
    const imgs = portfolioByVendor[vendorId];
    await prisma.portfolioImage.deleteMany({ where: { vendorId } });
    for (const img of imgs) {
      await prisma.portfolioImage.create({
        data: {
          id: img.id,
          vendorId,
          url: img.url,
          caption: img.caption,
          eventType: img.eventType,
        },
      });
      total++;
    }
  }
  console.log(`[seed] portfolio images: ${total}`);
}

async function seedReviews(seededVendorIds: Set<string>) {
  let total = 0;
  for (const vendorId of Object.keys(reviewsByVendor)) {
    if (!seededVendorIds.has(vendorId)) continue;
    const reviews = reviewsByVendor[vendorId];
    await prisma.review.deleteMany({ where: { vendorId } });
    for (const r of reviews) {
      await prisma.review.create({
        data: {
          id: r.id,
          vendorId,
          author: r.author,
          rating: r.rating,
          date: r.date,
          title: r.title,
          body: r.body,
          eventType: r.eventType,
        },
      });
      total++;
    }
  }
  console.log(`[seed] reviews: ${total}`);
}

async function seedBookedDates(seededVendorIds: Set<string>) {
  let total = 0;
  for (const vendorId of Object.keys(bookedDatesByVendor)) {
    if (!seededVendorIds.has(vendorId)) continue;
    const dates = bookedDatesByVendor[vendorId];
    await prisma.bookedDate.deleteMany({ where: { vendorId } });
    for (const date of dates) {
      await prisma.bookedDate.create({ data: { vendorId, date } });
      total++;
    }
  }
  console.log(`[seed] booked dates: ${total}`);
}

async function seedVendorStats(seededVendorIds: Set<string>) {
  let total = 0;
  for (const vendorId of Object.keys(statsByVendor)) {
    if (!seededVendorIds.has(vendorId)) continue;
    const s = statsByVendor[vendorId];
    await prisma.vendorStats.upsert({
      where: { vendorId },
      update: {
        weddingsCompleted: s.weddingsCompleted,
        customersServed: s.customersServed,
        responseTime: s.responseTime,
        yearsExperience: s.yearsExperience,
      },
      create: {
        vendorId,
        weddingsCompleted: s.weddingsCompleted,
        customersServed: s.customersServed,
        responseTime: s.responseTime,
        yearsExperience: s.yearsExperience,
      },
    });
    total++;
  }
  console.log(`[seed] vendor stats: ${total}`);
}

async function main() {
  const slugs = buildCitySlugs();
  await seedCities(slugs);
  await seedCategories();
  await seedVendors();
  // Only seed children for vendors that actually exist in the DB.
  const seededVendorIds = new Set(
    (await prisma.vendor.findMany({ select: { id: true } })).map((v) => v.id),
  );
  await seedPackages(seededVendorIds);
  await seedPortfolio(seededVendorIds);
  await seedReviews(seededVendorIds);
  await seedBookedDates(seededVendorIds);
  await seedVendorStats(seededVendorIds);
  console.log("[seed] complete");
}

main()
  .catch((e) => {
    console.error("[seed] failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
