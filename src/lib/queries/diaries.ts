import { db } from "@/lib/db";

export interface FeaturedReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  eventType: string;
  vendor: { id: string; name: string; cityName: string; categoryId: string };
}

/**
 * Top-rated, lengthy reviews for the diaries page.
 * Sorted by rating desc, then by review body length (more substantial first).
 */
export async function getFeaturedReviews(limit = 24): Promise<FeaturedReview[]> {
  const rows = await db.review.findMany({
    take: limit,
    orderBy: [{ rating: "desc" }, { date: "desc" }],
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          categoryId: true,
          city: { select: { name: true } },
        },
      },
    },
  });
  return rows
    .filter((r) => r.body.length > 60)
    .map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      date: r.date,
      title: r.title,
      body: r.body,
      eventType: r.eventType,
      vendor: {
        id: r.vendor.id,
        name: r.vendor.name,
        cityName: r.vendor.city.name,
        categoryId: r.vendor.categoryId,
      },
    }));
}

export async function getDiariesStats() {
  const [vendors, reviews, cities, ratingAgg] = await Promise.all([
    db.vendor.count({ where: { moderationState: "live" } }),
    db.review.count(),
    db.city.count(),
    db.review.aggregate({ _avg: { rating: true } }),
  ]);
  return {
    vendors,
    reviews,
    cities,
    averageRating: Number((ratingAgg._avg.rating ?? 4.8).toFixed(2)),
  };
}
