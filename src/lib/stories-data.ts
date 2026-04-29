// Curated real wedding stories. Hardcoded for v0 — moves to DB in v1.

export interface VendorCredit {
  role: string;        // "Photography" | "Decor" | "Venue" | etc.
  vendorId?: string;   // optional — if matches a Vendor.id, link to /vendors/v/[id]
  vendorName: string;  // always shown
}

export interface Story {
  slug: string;
  coupleNames: string;
  location: string;
  ceremonyTypes: string[];
  coverImage: string;
  summary: string;
  publishedAt: string;
  body: string;        // simple markdown-ish, paragraph-separated
  gallery: string[];   // additional cover images
  vendorCredits: VendorCredit[];
}

export const STORIES: Story[] = [
  {
    slug: "riya-arjun-udaipur",
    coupleNames: "Riya & Arjun",
    location: "Udaipur, Rajasthan",
    ceremonyTypes: ["mehendi", "sangeet", "wedding"],
    coverImage:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=2400&q=80",
    summary:
      "A lakeside Udaipur wedding with marigold mandaps, an intimate sangeet on the City Palace terrace, and a vidaai at sunrise.",
    publishedAt: "2026-03-12",
    body: `Riya and Arjun wanted Udaipur to feel like a love letter, not a postcard. Three days, three ceremonies, and a guest list that fit on the City Palace terrace.

The mehendi was the loosest — afternoon sun, marigold strung between pillars, a dholki playing while the bride's cousins corrected the henna artist's English. The sangeet upgraded the room: chandeliers, a small stage, choreographed numbers that mostly worked. Arjun's groomsmen did a Bhangra-Beyoncé mashup that nobody had rehearsed enough but everyone clapped through.

The wedding itself was at dawn — pheras at first light, with a brass band waiting in the courtyard for the baraat that had arrived the night before. Riya wore her mother's lehenga, taken in twice and re-embroidered with new gota patti. The phera fire stayed lit longer than the priest had planned because the wind from the lake kept feeding it.

By the vidaai, half the guests were crying and half were eating jalebis. That felt right.`,
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80",
      "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1600&q=80",
    ],
    vendorCredits: [
      { role: "Photography", vendorName: "Studio Mira" },
      { role: "Venue", vendorName: "City Palace, Udaipur" },
      { role: "Decor", vendorName: "Marigold & Mango" },
      { role: "Bridal Makeup", vendorName: "Aarti Singh Studio" },
      { role: "Catering", vendorName: "Heritage Kitchens" },
    ],
  },
  {
    slug: "kavya-rohan-bangalore",
    coupleNames: "Kavya & Rohan",
    location: "Bangalore, Karnataka",
    ceremonyTypes: ["haldi", "wedding", "reception"],
    coverImage:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=2400&q=80",
    summary:
      "An intercaste Tamil-Punjabi wedding in a Bangalore farmhouse — two priests, two languages, and a single very long lunch.",
    publishedAt: "2026-02-20",
    body: `Kavya is Tamil. Rohan is Punjabi. The compromise: do both ceremonies, end-to-end, on the same day, with two priests who had met for the first time over WhatsApp the week before.

Haldi was at 8am — a small group, raw turmeric, a steel kalash, and Rohan's mother weeping happily through most of it. The wedding mandap had two parallel scripts: pheras with one priest, then anand karaj-style verses from the other. The guests learned to clap on cue.

The reception was the easy part. Banana leaves, a brass band, and a cocktail menu that included both filter coffee and Old Monk. Kavya changed into her grandmother's kanjeevaram, then into a Punjabi suit, then into sneakers around 11pm.

It was the first time most of either family had been to the other's kind of wedding. Nobody got everything right. Everybody got fed.`,
    gallery: [
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    ],
    vendorCredits: [
      { role: "Photography", vendorName: "Frame Forty Two" },
      { role: "Venue", vendorName: "Kanva Farms" },
      { role: "Catering (Tamil)", vendorName: "Adyar Anand Bhavan Catering" },
      { role: "Catering (Punjabi)", vendorName: "Punjab Grill Banquets" },
      { role: "Decor", vendorName: "Folk & Foliage" },
    ],
  },
  {
    slug: "neha-vikram-goa",
    coupleNames: "Neha & Vikram",
    location: "Goa",
    ceremonyTypes: ["sundowner", "wedding"],
    coverImage:
      "https://images.unsplash.com/photo-1519227355453-8f982e425321?w=2400&q=80",
    summary:
      "A two-day Goa wedding with no DJ, a six-piece live band, and a beach vidaai that ran into the tide.",
    publishedAt: "2026-01-08",
    body: `Neha wanted a small wedding. Vikram wanted live music. They got both — a 90-person beach affair with a six-piece live band that played until the high tide cut them off.

The sundowner was on Friday — a single long table, fairy lights, a bartender who knew everyone's name by the second drink. Vikram's college friends brought a guitar. Someone tried to sing Yellow and forgot the second verse.

Saturday's wedding was a sunset ceremony. The mandap was driftwood and white flowers. The pandit had flown in from Pune and was handling sand for the first time in his career. Neha walked in barefoot. Vikram's brother officiated the in-between bits in English so the band's drummer (who had also flown in from Pune) could keep up.

The vidaai was symbolic — Neha walked toward the water, then turned around and came back. The tide had taken everyone's shoes by then.`,
    gallery: [
      "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1600&q=80",
    ],
    vendorCredits: [
      { role: "Photography", vendorName: "Salt & Sand Studio" },
      { role: "Venue", vendorName: "Vivanta Goa Coastal" },
      { role: "Live Band", vendorName: "The Local Train Project" },
      { role: "Decor", vendorName: "Driftwood Co." },
      { role: "Catering", vendorName: "Cohibas Catering" },
    ],
  },
  {
    slug: "anjali-sameer-jaipur",
    coupleNames: "Anjali & Sameer",
    location: "Jaipur, Rajasthan",
    ceremonyTypes: ["mehendi", "sangeet", "wedding", "reception"],
    coverImage:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=2400&q=80",
    summary:
      "A four-day Jaipur wedding at a converted haveli — heirloom jewellery, hand-pulled rickshaws for the baraat, and a thali menu that took six months to plan.",
    publishedAt: "2025-12-04",
    body: `Anjali had been planning her wedding menu since law school. Sameer had been planning his baraat since the engagement. They merged the two spreadsheets in October.

Day one was mehendi — pink and gold, three artists working in shifts, a bar that served only kachi lassi and rose sherbet. Day two was sangeet — full choreography, Sameer's family came in second to a number put together by Anjali's nine-year-old niece who has, the family agrees, a future in this.

Day three was the wedding. Sameer's baraat came in on hand-pulled rickshaws because the haveli's gates wouldn't admit horses. The pheras took longer than planned because the priest paused after each one to explain the verse to the guests, who thanked him in a standing ovation that paused everything for another six minutes.

Day four was reception. Six-course Rajasthani thali — gatte ki sabzi, dal baati churma, ker sangri, three kinds of churma — served on silver thalis that Anjali's grandmother had been polishing for a month.`,
    gallery: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600&q=80",
      "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1600&q=80",
    ],
    vendorCredits: [
      { role: "Photography", vendorName: "Heritage Lens Co." },
      { role: "Venue", vendorName: "Samode Haveli, Jaipur" },
      { role: "Decor", vendorName: "Royal Rajasthan Decor" },
      { role: "Catering", vendorName: "Khazana Royal Thali" },
      { role: "Bridal Wear", vendorName: "Sabyasachi Atelier (loaned)" },
      { role: "Mehendi Artist", vendorName: "Veena Nagda Studio" },
    ],
  },
];

export function getStoryBySlug(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}
