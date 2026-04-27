export interface WeddingFunction {
  id: string;
  name: string;
  emoji: string;
  description: string;
  categoryIds: string[]; // maps to category.id from categories.ts
}

export const weddingFunctions: WeddingFunction[] = [
  {
    id: "roka",
    name: "Roka",
    emoji: "\u{1F91D}",
    description: "The formal agreement ceremony with close family, sweets, and gifts",
    categoryIds: ["venues", "catering", "photography", "gifts", "decor"],
  },
  {
    id: "haldi",
    name: "Haldi",
    emoji: "\u{1F33B}",
    description: "Turmeric ceremony with beautiful decor, food, and memories",
    categoryIds: ["decor", "catering", "photography", "beauty"],
  },
  {
    id: "mehendi",
    name: "Mehendi",
    emoji: "\u{270B}",
    description: "Bridal mehendi with stunning setup, food counters, and music",
    categoryIds: ["decor", "beauty", "catering", "photography", "entertainment"],
  },
  {
    id: "sangeet-cocktail",
    name: "Sangeet / Cocktail",
    emoji: "\u{1F3B6}",
    description: "Dance, music, cocktails, and celebration with the perfect entertainment",
    categoryIds: ["entertainment", "decor", "catering", "photography", "venues"],
  },
  {
    id: "engagement",
    name: "Engagement",
    emoji: "\u{1F48D}",
    description: "Ring ceremony with elegant venue, decor, and celebrations",
    categoryIds: ["venues", "decor", "catering", "photography", "beauty", "essentials"],
  },
  {
    id: "wedding-day",
    name: "Wedding Day",
    emoji: "\u{1F492}",
    description: "The big day — every vendor you need from start to finish",
    categoryIds: [
      "venues",
      "decor",
      "catering",
      "photography",
      "entertainment",
      "rituals",
      "logistics",
      "beauty",
      "essentials",
      "rentals",
    ],
  },
  {
    id: "reception",
    name: "Reception",
    emoji: "\u{1F389}",
    description: "Grand celebration with venue, food, entertainment, and more",
    categoryIds: ["venues", "decor", "catering", "photography", "entertainment", "gifts"],
  },
];

export function getFunctionById(id: string): WeddingFunction | undefined {
  return weddingFunctions.find((f) => f.id === id);
}
