import type { Vendor } from "@/types/vendor";

export function makeVendor(overrides: Partial<Vendor> = {}): Vendor {
  const now = new Date("2026-01-01T00:00:00Z");
  return {
    id: "v1",
    name: "Test Vendor",
    description: "Sample description",
    cityId: "city-1",
    city: { name: "Mumbai" },
    categoryId: "photography",
    rating: 4.8,
    reviewCount: 120,
    priceRange: "₹50K-₹1L",
    yearsExperience: 5,
    verified: true,
    tags: ["candid", "cinematic"],
    email: null,
    moderationState: "live",
    coverImage: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}
