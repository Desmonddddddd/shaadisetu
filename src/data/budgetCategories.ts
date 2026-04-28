export interface BudgetCategory {
  id: string;
  label: string;
  defaultPercent: number;
  color: string;
  vendorCategoryId?: string;
  description: string;
}

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: "venue",         label: "Venue",                 defaultPercent: 25, color: "#6b1f2a", vendorCategoryId: "venues",       description: "Main hall, lawns, hotel block" },
  { id: "catering",      label: "Catering",              defaultPercent: 20, color: "#8a2a36", vendorCategoryId: "catering",     description: "Menu, live counters, bar" },
  { id: "decor",         label: "Decor & Floral",        defaultPercent: 12, color: "#c9a86a", vendorCategoryId: "decor",        description: "Mandap, stage, florals, lighting" },
  { id: "photography",   label: "Photography & Film",    defaultPercent: 10, color: "#1a1a1a", vendorCategoryId: "photography",  description: "Stills + video + albums" },
  { id: "attire",        label: "Attire & Jewellery",    defaultPercent:  8, color: "#d9bf8a", vendorCategoryId: "attire",       description: "Lehenga, sherwani, jewellery" },
  { id: "beauty",        label: "Beauty & Mehendi",      defaultPercent:  4, color: "#e8d5d0", vendorCategoryId: "beauty",       description: "Makeup, hair, mehendi, salon" },
  { id: "entertainment", label: "Music & Entertainment", defaultPercent:  5, color: "#3a3a3a", vendorCategoryId: "entertainment", description: "DJ, dhol, live bands, MC" },
  { id: "rituals",       label: "Rituals & Pooja",       defaultPercent:  3, color: "#4a1620", vendorCategoryId: "rituals",      description: "Priest, samagri, ritual goods" },
  { id: "invitations",   label: "Invitations & Stationery", defaultPercent: 2, color: "#efeae0", vendorCategoryId: "invitations", description: "Cards, envelopes, signage" },
  { id: "logistics",     label: "Logistics & Transport", defaultPercent:  4, color: "#3a3a3a", vendorCategoryId: "logistics",    description: "Cars, shuttles, baraat, flights" },
  { id: "gifts",         label: "Gifts & Hampers",       defaultPercent:  3, color: "#c9a86a", vendorCategoryId: "gifts",        description: "Trousseau, return gifts" },
  { id: "honeymoon",     label: "Honeymoon",             defaultPercent:  2, color: "#1a1a1a", vendorCategoryId: "honeymoon",    description: "Flights, stay, experiences" },
  { id: "buffer",        label: "Contingency Buffer",    defaultPercent:  2, color: "#6b1f2a",                                   description: "Last-minute everything" },
];
