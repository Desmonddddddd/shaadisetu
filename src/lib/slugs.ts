import { cities, City } from "@/data/cities";
import { categories, Category } from "@/data/categories";

export function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function fromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function findCityBySlug(slug: string): City | undefined {
  return cities.find((c) => toSlug(c.name) === slug);
}

export function findCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.id === slug);
}
