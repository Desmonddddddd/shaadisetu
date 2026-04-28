export interface WeddingEvent {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  longDescription: string;
  cover: string;
  categoryIds: string[];
  primaryCategoryIds: string[];
}

export const WEDDING_EVENTS: WeddingEvent[] = [
  {
    id: "roka",
    name: "Roka",
    emoji: "🤝",
    tagline: "The first yes.",
    description:
      "Formal agreement ceremony with close family, sweets, and gifts.",
    longDescription:
      "An intimate gathering — typically 30 to 60 people from both sides. The vendors that matter: a small venue or a tasteful home setup, a curated thali menu, a discreet photographer, and gift hampers that don't try too hard.",
    cover: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80",
    categoryIds: ["venues", "catering", "photography", "gifts", "decor"],
    primaryCategoryIds: ["venues", "catering", "photography"],
  },
  {
    id: "haldi",
    name: "Haldi",
    emoji: "🌻",
    tagline: "Yellow everything.",
    description: "Turmeric ceremony with marigold-soaked decor and home-style food.",
    longDescription:
      "Outdoor mornings, family-only, marigold drapes, the messiest photographs of the entire wedding. Decor and photography do most of the heavy lifting; catering is usually home-style or a single live counter.",
    cover: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80",
    categoryIds: ["decor", "catering", "photography", "beauty", "rituals"],
    primaryCategoryIds: ["decor", "photography", "catering"],
  },
  {
    id: "mehendi",
    name: "Mehendi",
    emoji: "✋",
    tagline: "Henna, music, an afternoon of laughter.",
    description: "Bridal mehendi with stunning setup and food counters.",
    longDescription:
      "Half-day function, 80–150 guests, mehendi artists at the centre and a curated brunch around them. Look for floral hanging installations, swing setups, and a photographer who knows when to be invisible.",
    cover: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1600&q=80",
    categoryIds: ["decor", "beauty", "catering", "photography", "entertainment"],
    primaryCategoryIds: ["beauty", "decor", "photography"],
  },
  {
    id: "sangeet",
    name: "Sangeet",
    emoji: "🎶",
    tagline: "Choreographed chaos. The good kind.",
    description: "Performances, DJ sets, the cousins finally remembering their dance steps.",
    longDescription:
      "Stage, lighting rig, AV, choreographers if you've planned it well. The vendors that matter most: entertainment, decor for the stage, and a photographer who can shoot in low light.",
    cover: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    categoryIds: ["entertainment", "decor", "catering", "photography", "venues"],
    primaryCategoryIds: ["entertainment", "decor", "photography"],
  },
  {
    id: "cocktail",
    name: "Cocktail",
    emoji: "🥂",
    tagline: "The English-language wedding.",
    description: "Lounge-style evening with cocktails, finger food, and live music.",
    longDescription:
      "Smaller than the sangeet, sharper aesthetic, usually held at a hotel or a private bar. Catering and entertainment matter more than decor here; lighting design carries the room.",
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
    categoryIds: ["catering", "entertainment", "venues", "photography", "decor"],
    primaryCategoryIds: ["catering", "entertainment", "venues"],
  },
  {
    id: "engagement",
    name: "Engagement",
    emoji: "💍",
    tagline: "Rings, families, the big public yes.",
    description: "Ring ceremony with elegant venue and intimate decor.",
    longDescription:
      "Larger than the roka, smaller than the wedding. The bride's outfit and the rings carry more visual weight than the venue. Photographers earn their fee here — these portraits go on the website.",
    cover: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1600&q=80",
    categoryIds: ["venues", "decor", "catering", "photography", "beauty", "essentials"],
    primaryCategoryIds: ["venues", "photography", "essentials"],
  },
  {
    id: "baraat",
    name: "Baraat",
    emoji: "🥁",
    tagline: "Dhol, ghodi, the groom's slow walk in.",
    description: "Procession with dhol, baraat band, and the groom on a horse.",
    longDescription:
      "A street-level production. Logistics, dhol players, baraat bands, sometimes a vintage car or a ghodi handler. Photography needs a second crew specifically for this 30-minute window.",
    cover: "https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?w=1600&q=80",
    categoryIds: ["entertainment", "logistics", "photography", "rituals"],
    primaryCategoryIds: ["entertainment", "logistics"],
  },
  {
    id: "wedding-day",
    name: "Wedding Day",
    emoji: "💒",
    tagline: "Pheras. The vow that everyone shows up for.",
    description: "The main event — every category, every vendor, all aligned.",
    longDescription:
      "The largest production day of the wedding. Mandap, pandit, photo + film teams, makeup early, catering across multiple meal services, decor refreshes between functions. Every category in your list is on the floor.",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    categoryIds: [
      "venues", "decor", "catering", "photography", "entertainment",
      "rituals", "logistics", "beauty", "essentials", "rentals",
    ],
    primaryCategoryIds: ["venues", "decor", "rituals", "photography"],
  },
  {
    id: "reception",
    name: "Reception",
    emoji: "🎉",
    tagline: "The grand hello, post-wedding.",
    description: "Hotel ballroom, second outfit, the family meets the city.",
    longDescription:
      "Usually the largest guest count of the entire wedding. Banquet halls, plated dinners or buffets, live band or DJ, formal photographs. The bride and groom finally get to sit down.",
    cover: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1600&q=80",
    categoryIds: ["venues", "decor", "catering", "photography", "entertainment", "gifts"],
    primaryCategoryIds: ["venues", "catering", "entertainment"],
  },
];

export function getWeddingEventById(id: string): WeddingEvent | undefined {
  return WEDDING_EVENTS.find((e) => e.id === id);
}
