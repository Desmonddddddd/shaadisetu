export interface DiaryStory {
  id: string;
  couple: string;
  city: string;
  month: string;
  emoji: string;
  cover: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
}

export const diaryStories: DiaryStory[] = [
  {
    id: "priya-rahul",
    couple: "Priya & Rahul",
    city: "Jaipur",
    month: "March 2026",
    emoji: "🏛️",
    cover:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    title: "A pink-city palace, a 200-year-old courtyard, and one quiet vow.",
    excerpt:
      "We didn't want a wedding that made the news. We wanted one that made our grandparents cry.",
    body:
      "Priya found the venue first — a Rajput haveli her family had passed by for decades but never stepped inside. Rahul found the vendors second, all six of them on ShaadiSetu within a single weekend. Three weeks before the date, they walked through the courtyard at dusk and decided the marigold trail should end at the chaupar table where her grandfather had taught her chess. The ceremony was 80 minutes. Nobody clapped. Everybody cried.",
    tags: ["Destination", "Heritage Venue", "Traditional Pheras"],
  },
  {
    id: "ananya-vikram",
    couple: "Ananya & Vikram",
    city: "Mumbai → Goa",
    month: "February 2026",
    emoji: "🌊",
    cover:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1600&q=80",
    title: "She planned it from San Francisco. He wore sneakers under the sherwani.",
    excerpt:
      "Twelve time zones, six WhatsApp groups, and not a single shouting match.",
    body:
      "Ananya hadn't been to India in three years when she started planning. Every vendor she shortlisted was on ShaadiSetu. Every video call was at 9 p.m. her time, 9:30 a.m. Mumbai's. Vikram hated decisions, so she made them. She hated logistics, so he handled them. The night before the wedding, the decor team rebuilt a mandap from scratch when the original wouldn't fit through a door. Nobody in the family ever found out.",
    tags: ["NRI", "Beach Wedding", "Hybrid Functions"],
  },
  {
    id: "meera-arjun",
    couple: "Meera & Arjun",
    city: "Delhi",
    month: "January 2026",
    emoji: "🪔",
    cover:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
    title: "An intimate registry wedding — and a sangeet that lasted past sunrise.",
    excerpt:
      "Forty-eight people on the registry list. Three hundred at the sangeet.",
    body:
      "Meera, a journalist, hated weddings. Arjun, a chef, loved every chaotic part. Their compromise was a courthouse ceremony in the morning and a thirty-vendor sangeet at night. The catering brief was longer than the registry paperwork. The decor team built a chandni-print canopy that took every photograph and made it look like a film still. Meera went to bed at 5 a.m. saying she'd never do it again. She would.",
    tags: ["Court Wedding", "Sangeet Forward", "Food First"],
  },
  {
    id: "sanya-karan",
    couple: "Sanya & Karan",
    city: "Udaipur",
    month: "December 2025",
    emoji: "👑",
    cover:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=80",
    title: "Three days, eight ceremonies, and a lake that became a mandap.",
    excerpt:
      "It rained on day two. The vendor team had a Plan B by 4:47 a.m.",
    body:
      "When the family said royal, they meant logistics for 380 guests across four properties. ShaadiSetu's planner handled the parallel rehearsals; the photography team brought four crews. Sanya's haldi happened on a step-well, her sangeet on a houseboat, her pheras on a floating mandap that had been built and rebuilt twice. Karan, who is genuinely afraid of water, walked across it.",
    tags: ["Royal", "Multi-Day", "Lake Venue"],
  },
];
