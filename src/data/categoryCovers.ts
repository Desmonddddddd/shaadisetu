// Per-category cover image URLs. Verified to be reachable on Unsplash CDN.
// Update via the same audit script if any 404. Keys must match
// `categories[].id` from `src/data/categories.ts`.

export const CATEGORY_COVERS: Record<string, string> = {
  venues:        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  decor:         "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&q=80",
  catering:      "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1200&q=80",
  photography:   "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80",
  entertainment: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
  essentials:    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80",
  beauty:        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
  rituals:       "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
  logistics:     "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1200&q=80",
  gifts:         "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
  rentals:       "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1200&q=80",
  planning:      "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=1200&q=80",
  guests:        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  legal:         "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
  "last-minute": "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1200&q=80",
  digital:       "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80",
  "pre-wedding": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
  honeymoon:     "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80",
};

export function getCategoryCover(id: string): string {
  return (
    CATEGORY_COVERS[id] ??
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"
  );
}
