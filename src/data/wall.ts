// ShaadiWall — curated visual editorial. Static for v1; later we can pull
// items from a CMS or from `Vendor.featuredShots`. Keep image counts per
// section between 5 and 9 so the masonry stays balanced.

export type WallStyle = "big-fat" | "minimalist" | "photography" | "must-haves";

export interface WallShot {
  id: string;
  title: string;
  caption: string;
  image: string;
  // Vendor credit, when sourced from a partner. Omit for editorial picks.
  vendor?: { name: string; href: string };
  // Used by the masonry: tall items span 2 rows.
  span?: "tall" | "wide";
}

export interface WallSection {
  slug: WallStyle;
  eyebrow: string;
  title: string;
  blurb: string;
  cover: string;
  shots: WallShot[];
}

export const WALL_SECTIONS: WallSection[] = [
  {
    slug: "big-fat",
    eyebrow: "01 · Big Fat",
    title: "The big fat wedding, done with restraint",
    blurb:
      "Marigold ceilings, mirror-work mandaps, multi-cuisine buffets and a 400-strong baraat — the maximalist canon, edited for taste.",
    cover:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80",
    shots: [
      {
        id: "bf-1",
        title: "Marigold ceiling",
        caption: "12,000 stems, suspended over a 200-cover mandap.",
        image:
          "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80",
        vendor: { name: "Studio Lotus Decor", href: "/vendors" },
        span: "tall",
      },
      {
        id: "bf-2",
        title: "Heritage haveli",
        caption: "An 18th-century courtyard in Udaipur, lit by 800 diyas.",
        image:
          "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80",
      },
      {
        id: "bf-3",
        title: "Bridal entry",
        caption: "Phoolon ki chaadar, four cousins, no mehendi shortcuts.",
        image:
          "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&q=80",
        vendor: { name: "House of Tara", href: "/vendors" },
      },
      {
        id: "bf-4",
        title: "Sangeet stage",
        caption: "Brass-and-velvet stage, choreographer's own playlist.",
        image:
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
        span: "wide",
      },
      {
        id: "bf-5",
        title: "Crystal centerpieces",
        caption: "Tablescape with 200 votives — a wedding-planner cliché done right.",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
      },
      {
        id: "bf-6",
        title: "Pheras at dusk",
        caption: "Last light, fire, and a quiet pandit ji who didn't rush.",
        image:
          "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1200&q=80",
        vendor: { name: "Stories By Joseph", href: "/vendors" },
        span: "tall",
      },
    ],
  },
  {
    slug: "minimalist",
    eyebrow: "02 · Minimalist",
    title: "Minimalist weddings, maximum intent",
    blurb:
      "Forty guests, neutral palettes, a single statement floral, and food the bride actually wants to eat. Less is rarely cheaper, but it is calmer.",
    cover:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80",
    shots: [
      {
        id: "mn-1",
        title: "White on white",
        caption: "Cotton drapes, white anthuriums, no other colour in the room.",
        image:
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
        span: "wide",
      },
      {
        id: "mn-2",
        title: "Single-stem mandap",
        caption: "Pampas grass, ivory linen, four pillars. Nothing else.",
        image:
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80",
      },
      {
        id: "mn-3",
        title: "Linen suit, no sherwani",
        caption: "Groom in cream linen — a quiet refusal to perform tradition.",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
        vendor: { name: "Karnik Tailors", href: "/vendors" },
        span: "tall",
      },
      {
        id: "mn-4",
        title: "Roof-top vows",
        caption: "Six guests, a string quartet, twelve minutes flat.",
        image:
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
      },
      {
        id: "mn-5",
        title: "Ivory tablescape",
        caption: "Stoneware, tapered candles, no centerpiece taller than a fist.",
        image:
          "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&q=80",
      },
      {
        id: "mn-6",
        title: "Bridal hair, undone",
        caption: "Loose waves, a single jasmine string. Five minutes of styling.",
        image:
          "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1200&q=80",
        vendor: { name: "Florence Studio", href: "/vendors" },
      },
    ],
  },
  {
    slug: "photography",
    eyebrow: "03 · Photography",
    title: "Photographs we keep coming back to",
    blurb:
      "Your wedding lasts a week. The pictures last forever. A few frames our editors have not stopped looking at.",
    cover:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80",
    shots: [
      {
        id: "ph-1",
        title: "First look",
        caption: "Behind a curtain, before the family knew.",
        image:
          "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80",
        vendor: { name: "Stories By Joseph", href: "/vendors" },
        span: "tall",
      },
      {
        id: "ph-2",
        title: "Mother, untying the dupatta",
        caption: "A frame the couple paid extra for. Worth every rupee.",
        image:
          "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&q=80",
      },
      {
        id: "ph-3",
        title: "Baraat, mid-bhangra",
        caption: "Shutter at 1/2000s. Dust, dholki, dadi laughing.",
        image:
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
        vendor: { name: "Memorabilia by Gautam", href: "/vendors" },
      },
      {
        id: "ph-4",
        title: "Hands, just before the pheras",
        caption: "Henna, kalire, a wedding ring not yet his.",
        image:
          "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1200&q=80",
      },
      {
        id: "ph-5",
        title: "Vidaai",
        caption: "Both fathers crying. The photographer kept shooting.",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
        vendor: { name: "House of Tara", href: "/vendors" },
        span: "wide",
      },
      {
        id: "ph-6",
        title: "After everyone left",
        caption: "Bride, kicking off her heels, sitting on the mandap steps.",
        image:
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80",
      },
    ],
  },
  {
    slug: "must-haves",
    eyebrow: "04 · Must-haves",
    title: "Things every wedding actually needs",
    blurb:
      "We get asked this monthly. Forget the Pinterest boards — these are the boring, expensive, non-negotiable things planners keep forgetting.",
    cover:
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1600&q=80",
    shots: [
      {
        id: "mh-1",
        title: "A rain plan",
        caption: "A tent, an indoor backup, a phone number for the AC vendor.",
        image:
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80",
      },
      {
        id: "mh-2",
        title: "A bride's emergency kit",
        caption: "Safety pins, paracetamol, glucose, a second pair of juttis.",
        image:
          "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80",
        span: "tall",
      },
      {
        id: "mh-3",
        title: "Vendor meal & break room",
        caption: "Decor, makeup, and band crew need to eat. Plan it.",
        image:
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
      },
      {
        id: "mh-4",
        title: "Power & generator",
        caption: "An on-site genset and a fuel buffer. Not optional in monsoon.",
        image:
          "https://images.unsplash.com/photo-1604881991720-f91add269bed?w=1200&q=80",
      },
      {
        id: "mh-5",
        title: "A quiet corner",
        caption: "One room, locked, where the bride can sit alone for ten minutes.",
        image:
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80",
        span: "wide",
      },
    ],
  },
];

export function getWallSection(slug: WallStyle): WallSection | undefined {
  return WALL_SECTIONS.find((s) => s.slug === slug);
}
