import { cities, City } from "@/data/cities";
import { categories, Category } from "@/data/categories";

/** Convert a string to a kebab-case slug (ASCII-only by design). */
export function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Display-only; not safe for round-tripping to data. */
export function fromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Pre-compute a count of cities per name slug to detect collisions.
const NAME_SLUG_COUNT: Map<string, number> = (() => {
  const counts = new Map<string, number>();
  for (const c of cities) {
    const ns = toSlug(c.name);
    counts.set(ns, (counts.get(ns) ?? 0) + 1);
  }
  return counts;
})();

/** Canonical URL slug for a city — disambiguates collisions with state suffix. */
export function cityToSlug(city: City): string {
  const ns = toSlug(city.name);
  if ((NAME_SLUG_COUNT.get(ns) ?? 0) > 1) {
    return `${ns}-${toSlug(city.state)}`;
  }
  return ns;
}

export function findCityBySlug(slug: string): City | undefined {
  // Direct match on canonical slug
  for (const c of cities) {
    if (cityToSlug(c) === slug) return c;
  }
  // Backward-compatible fallback: bare name slug for non-colliding cities
  for (const c of cities) {
    if (toSlug(c.name) === slug && (NAME_SLUG_COUNT.get(toSlug(c.name)) ?? 0) === 1) {
      return c;
    }
  }
  return undefined;
}

export function findCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.id === slug);
}
