export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "bridal-wear",
    name: "Bridal Wear",
    emoji: "👗",
    description: "Lehengas, sarees, and designer bridal outfits",
  },
  {
    id: "groom-wear",
    name: "Groom Wear",
    emoji: "🤵",
    description: "Sherwanis, suits, and wedding day outfits for grooms",
  },
  {
    id: "venues",
    name: "Venues",
    emoji: "🏰",
    description: "Banquet halls, resorts, and destination wedding spots",
  },
  {
    id: "catering",
    name: "Catering",
    emoji: "🍽️",
    description: "Multi-cuisine caterers and wedding food specialists",
  },
  {
    id: "mehendi",
    name: "Mehendi Artists",
    emoji: "✋",
    description: "Professional henna artists for bridal and guest mehendi",
  },
  {
    id: "photography",
    name: "Photography",
    emoji: "📷",
    description: "Wedding photographers, pre-wedding shoots, and albums",
  },
  {
    id: "makeup",
    name: "Makeup Artists",
    emoji: "💄",
    description: "Bridal makeup, hair styling, and beauty packages",
  },
  {
    id: "decorators",
    name: "Decorators",
    emoji: "💐",
    description: "Mandap decoration, floral arrangements, and lighting",
  },
  {
    id: "invitations",
    name: "Wedding Invitations",
    emoji: "💌",
    description: "Designer cards, digital invites, and custom stationery",
  },
  {
    id: "music",
    name: "Music & DJ",
    emoji: "🎶",
    description: "DJs, live bands, dhol players, and sangeet choreographers",
  },
  {
    id: "pandits",
    name: "Wedding Pandits",
    emoji: "🙏",
    description:
      "Experienced pandits for all wedding rituals and ceremonies",
  },
  {
    id: "jewellery",
    name: "Jewellery",
    emoji: "💍",
    description:
      "Bridal jewellery sets, gold, diamond, and artificial options",
  },
];
