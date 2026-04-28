export interface BudgetTier {
  id: string;
  label: string;
  totalMin: number;
  totalMax: number;
  totalLabel: string;
  tagline: string;
  description: string;
  cover: string;
  emoji: string;
  // The "ideal" total to use when allocating per-category rupees.
  // Picks midpoint, or for the open-ended top tier, picks totalMin.
  allocationTotal: number;
}

const LAKH = 100_000;
const CRORE = 10_000_000;

export const BUDGET_TIERS: BudgetTier[] = [
  {
    id: "intimate",
    label: "Intimate",
    totalMin: 0,
    totalMax: 20 * LAKH,
    totalLabel: "Under ₹20 Lakh",
    tagline: "Quiet, considered, perfectly enough.",
    description:
      "For 100–200 guests, one or two functions, vendors who do beautiful work without the gold-plated overhead.",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
    emoji: "🌿",
    allocationTotal: 15 * LAKH,
  },
  {
    id: "classic",
    label: "Classic",
    totalMin: 20 * LAKH,
    totalMax: 50 * LAKH,
    totalLabel: "₹20–50 Lakh",
    tagline: "The full Indian wedding, done thoughtfully.",
    description:
      "Three to five functions, 250–400 guests, photography that you'll still love in twenty years, decor that doesn't look like a template.",
    cover: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1600&q=80",
    emoji: "🪔",
    allocationTotal: 35 * LAKH,
  },
  {
    id: "grand",
    label: "Grand",
    totalMin: 50 * LAKH,
    totalMax: 1 * CRORE,
    totalLabel: "₹50 Lakh – ₹1 Cr",
    tagline: "The wedding the whole family will talk about.",
    description:
      "Multi-day, multi-venue, premium vendors across every category. Photography teams, live bands, palace lawns, full hospitality.",
    cover: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=80",
    emoji: "👑",
    allocationTotal: 75 * LAKH,
  },
  {
    id: "royal",
    label: "Royal",
    totalMin: 1 * CRORE,
    totalMax: Number.POSITIVE_INFINITY,
    totalLabel: "Above ₹1 Crore",
    tagline: "Heritage venues. Couture wardrobes. No ceiling.",
    description:
      "Destination weddings, palace bookings, designer lehengas, international guest logistics. Every category goes to the top vendors on the platform.",
    cover: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
    emoji: "💎",
    allocationTotal: 1.5 * CRORE,
  },
];

export function getBudgetTierById(id: string): BudgetTier | undefined {
  return BUDGET_TIERS.find((t) => t.id === id);
}
