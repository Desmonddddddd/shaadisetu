export interface ChoiceOption {
  value: string;
  label: string;
  hint?: string;
  emoji?: string;
}

export interface ConciergeQuestion {
  id: string;
  prompt: string;
  subtitle: string;
  // Planner-style preface line shown above the question
  plannerLine: string;
  type: "choice" | "multi" | "city" | "date";
  options?: ChoiceOption[];
  // Maximum picks for "multi"
  maxPicks?: number;
}

export const CONCIERGE_QUESTIONS: ConciergeQuestion[] = [
  {
    id: "guests",
    prompt: "How many people are you expecting?",
    subtitle: "Round number is fine. We'll match the vendors who handle that scale.",
    plannerLine: "Let's start with the room.",
    type: "choice",
    options: [
      { value: "intimate", label: "Under 100", hint: "Intimate, family-only", emoji: "🌿" },
      { value: "midsized", label: "100 to 250", hint: "Classic Indian wedding", emoji: "🪔" },
      { value: "large", label: "250 to 500", hint: "Big-fat-wedding territory", emoji: "🎉" },
      { value: "huge", label: "500+", hint: "A whole hotel takeover", emoji: "👑" },
    ],
  },
  {
    id: "budget",
    prompt: "What's the all-in budget you have in mind?",
    subtitle: "Honest numbers help us pick the right vendors. We don't share this with anyone.",
    plannerLine: "Now, the part nobody likes to talk about.",
    type: "choice",
    options: [
      { value: "intimate", label: "Under ₹20 Lakh", hint: "Considered, calm", emoji: "🌿" },
      { value: "classic", label: "₹20–50 Lakh", hint: "Full Indian wedding", emoji: "🪔" },
      { value: "grand", label: "₹50 Lakh – ₹1 Cr", hint: "Premium, multi-day", emoji: "👑" },
      { value: "royal", label: "Above ₹1 Cr", hint: "No ceiling", emoji: "💎" },
    ],
  },
  {
    id: "city",
    prompt: "Which city are you planning in?",
    subtitle: "We'll surface vendors who actually work in your region — not generic listings.",
    plannerLine: "Where is everyone coming?",
    type: "city",
  },
  {
    id: "events",
    prompt: "Which functions are you planning?",
    subtitle: "Pick all that apply. We'll build a vendor mix for each.",
    plannerLine: "Tell me about the days.",
    type: "multi",
    options: [
      { value: "haldi", label: "Haldi", emoji: "🌻" },
      { value: "mehendi", label: "Mehendi", emoji: "✋" },
      { value: "sangeet", label: "Sangeet", emoji: "🎶" },
      { value: "cocktail", label: "Cocktail", emoji: "🥂" },
      { value: "engagement", label: "Engagement", emoji: "💍" },
      { value: "wedding-day", label: "Wedding Day", emoji: "💒" },
      { value: "reception", label: "Reception", emoji: "🎉" },
    ],
  },
  {
    id: "priority",
    prompt: "What matters most to you?",
    subtitle: "Pick up to two. We'll weight those vendors first.",
    plannerLine: "Every couple has a thing.",
    type: "multi",
    maxPicks: 2,
    options: [
      { value: "photography", label: "Photographs that age beautifully", emoji: "📸" },
      { value: "decor",       label: "Stunning decor & florals",          emoji: "🌸" },
      { value: "catering",    label: "Food people remember",              emoji: "🍛" },
      { value: "venues",      label: "A venue with character",            emoji: "🏛️" },
      { value: "entertainment", label: "Music & a dance floor that moves", emoji: "🎶" },
      { value: "rituals",     label: "Rituals done with care",            emoji: "🪔" },
    ],
  },
  {
    id: "date",
    prompt: "When are you thinking?",
    subtitle: "Even a rough month helps. You can change this later.",
    plannerLine: "Last one — when?",
    type: "date",
  },
];
