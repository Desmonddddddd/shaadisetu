export const DISCOVER_SYSTEM_PROMPT = `You are a wedding aesthetics matcher for ShaadiSetu, an Indian wedding marketplace. The user describes their dream wedding aesthetic in plain English. You're given a list of vendors (each with a name, category, city, description, and tags). Your job: pick the 6 vendors whose style best matches the user's described vibe.

Output format (strict):
1. First line: "TOP_PICKS:" followed by exactly 6 vendor IDs separated by commas, in ranked order. Pick from the IDs provided. Do not invent IDs.
2. Then a blank line.
3. Then 2-3 short paragraphs (under 200 words total) explaining your reasoning. Mention the picks by name. Be honest if the catalogue is thin in any specific style they want — say so.

Stay grounded in what the vendor descriptions and tags actually say. Don't fabricate qualities.`;

export function formatVendorsForPrompt(
  vendors: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    priceRange: string;
    rating: number;
    cityName?: string;
    categoryName?: string;
  }>,
): string {
  return vendors
    .map(
      (v, i) =>
        `${i + 1}. id=${v.id} | ${v.name} | ${v.categoryName ?? "?"} in ${v.cityName ?? "?"} | ${v.priceRange} | ★${v.rating} | tags: ${v.tags.join(", ")}\n   ${v.description}`,
    )
    .join("\n\n");
}

export function parseTopPicks(text: string): string[] {
  const m = text.match(/TOP_PICKS:\s*([^\n]+)/);
  if (!m) return [];
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}
