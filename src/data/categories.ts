export interface Filter {
  id: string;
  label: string;
  type: "select" | "range" | "toggle";
  options?: string[];
  min?: number;
  max?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  group?: string; // e.g. "Bride" or "Groom" for grouped display
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  subcategories: Subcategory[];
  filters: Filter[];
  highlight?: string;
}

export const categories: Category[] = [
  // 1. Venues & Locations
  {
    id: "venues",
    name: "Venues & Locations",
    emoji: "\u{1F3DB}\u{FE0F}",
    description: "Banquet halls, farmhouses, resorts, and destination wedding spots",
    subcategories: [
      { id: "banquet-halls", name: "Banquet Halls" },
      { id: "farmhouses", name: "Farmhouses" },
      { id: "hotels-resorts", name: "Hotels & Resorts" },
      { id: "destination-venues", name: "Destination Wedding Venues" },
      { id: "marriage-gardens", name: "Marriage Gardens" },
      { id: "community-halls", name: "Community Halls" },
    ],
    filters: [
      { id: "capacity", label: "Capacity", type: "range", min: 50, max: 5000 },
      { id: "venue-type", label: "Indoor / Outdoor", type: "select", options: ["Indoor", "Outdoor", "Both"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹1 Lakh", "₹1-5 Lakh", "₹5-15 Lakh", "₹15-50 Lakh", "₹50 Lakh+"] },
      { id: "rooms", label: "Rooms Available", type: "range", min: 0, max: 500 },
    ],
  },

  // 2. Decor & Setup
  {
    id: "decor",
    name: "Decor & Setup",
    emoji: "\u{1F3A8}",
    description: "Beautiful wedding, mehendi, haldi, and theme decorations",
    subcategories: [
      { id: "wedding-decor", name: "Wedding Decor" },
      { id: "haldi-decor", name: "Haldi Decor" },
      { id: "mehendi-decor", name: "Mehendi Decor" },
      { id: "engagement-setup", name: "Engagement Setup" },
      { id: "theme-decor", name: "Theme Decor" },
      { id: "floral-decor", name: "Floral Decor" },
      { id: "lighting-stage", name: "Lighting & Stage Setup" },
    ],
    filters: [
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹50K", "₹50K-2 Lakh", "₹2-5 Lakh", "₹5 Lakh+"] },
      { id: "style", label: "Style", type: "select", options: ["Traditional", "Modern", "Royal", "Minimalist", "Rustic"] },
    ],
  },

  // 3. Catering & Food
  {
    id: "catering",
    name: "Catering & Food",
    emoji: "\u{1F37D}\u{FE0F}",
    description: "Multi-cuisine caterers, live counters, and wedding cakes",
    subcategories: [
      { id: "caterers", name: "Caterers" },
      { id: "live-food-counters", name: "Live Food Counters" },
      { id: "sweet-shops", name: "Sweet Shops / Mithai" },
      { id: "wedding-cakes", name: "Wedding Cakes" },
      { id: "beverage-bartending", name: "Beverage & Bartending" },
    ],
    filters: [
      { id: "food-type", label: "Food Type", type: "select", options: ["Vegetarian", "Non-Vegetarian", "Both"] },
      { id: "cuisine", label: "Cuisine", type: "select", options: ["North Indian", "South Indian", "Mughlai", "Chinese", "Continental", "Multi-cuisine"] },
      { id: "min-plates", label: "Minimum Plates", type: "range", min: 50, max: 5000 },
      { id: "budget", label: "Budget per Plate", type: "select", options: ["Under ₹500", "₹500-1000", "₹1000-2000", "₹2000+"] },
    ],
  },

  // 4. Photography & Media
  {
    id: "photography",
    name: "Photography & Media",
    emoji: "\u{1F4F8}",
    description: "Photographers, videographers, drone shoots, and cinematic films",
    subcategories: [
      { id: "photographers", name: "Photographers" },
      { id: "videographers", name: "Videographers" },
      { id: "cinematic-films", name: "Cinematic Wedding Films" },
      { id: "drone-shoots", name: "Drone Shoots" },
      { id: "pre-wedding-shoots", name: "Pre-Wedding Shoots" },
      { id: "live-streaming", name: "Live Streaming" },
    ],
    filters: [
      { id: "style", label: "Style", type: "select", options: ["Candid", "Traditional", "Cinematic", "Documentary"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹25K", "₹25K-75K", "₹75K-2 Lakh", "₹2 Lakh+"] },
    ],
  },

  // 5. Entertainment
  {
    id: "entertainment",
    name: "Entertainment",
    emoji: "\u{1F3B6}",
    description: "DJs, live bands, singers, dhol, and celebrity bookings",
    subcategories: [
      { id: "djs", name: "DJs" },
      { id: "live-bands", name: "Live Bands" },
      { id: "singers", name: "Singers" },
      { id: "dhol-baraat", name: "Dhol / Baraat Bands" },
      { id: "anchors-emcees", name: "Anchors / Emcees" },
      { id: "celebrity-bookings", name: "Celebrity Bookings" },
      { id: "live-artists", name: "Live Artists" },
    ],
    filters: [
      { id: "event-type", label: "Event Type", type: "select", options: ["Sangeet", "Baraat", "Reception", "Mehendi", "Cocktail"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹25K", "₹25K-1 Lakh", "₹1-5 Lakh", "₹5 Lakh+"] },
    ],
  },

  // 6. Groom & Bride Essentials
  {
    id: "essentials",
    name: "Groom & Bride Essentials",
    emoji: "\u{1F470}",
    description: "Bridal wear, groom outfits, jewellery, and styling",
    subcategories: [
      { id: "lehengas-bridal-wear", name: "Lehengas / Bridal Wear", group: "Bride" },
      { id: "bride-makeup", name: "Makeup Artists", group: "Bride" },
      { id: "jewellery", name: "Jewellery", group: "Bride" },
      { id: "bride-footwear", name: "Footwear", group: "Bride" },
      { id: "sherwanis-suits", name: "Sherwanis / Suits", group: "Groom" },
      { id: "groom-styling", name: "Groom Styling", group: "Groom" },
      { id: "groom-shoes-accessories", name: "Shoes & Accessories", group: "Groom" },
    ],
    filters: [
      { id: "for", label: "For", type: "select", options: ["Bride", "Groom"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹25K", "₹25K-75K", "₹75K-2 Lakh", "₹2 Lakh+"] },
    ],
  },

  // 7. Beauty & Wellness
  {
    id: "beauty",
    name: "Beauty & Wellness",
    emoji: "\u{1F484}",
    description: "Makeup, hair styling, pre-bridal packages, and spa services",
    subcategories: [
      { id: "makeup-artists", name: "Makeup Artists" },
      { id: "hair-stylists", name: "Hair Stylists" },
      { id: "pre-bridal-packages", name: "Pre-bridal Packages" },
      { id: "groom-grooming", name: "Groom Grooming" },
      { id: "spa-salon", name: "Spa & Salon" },
    ],
    filters: [
      { id: "gender", label: "For", type: "select", options: ["Bride", "Groom", "Both"] },
      { id: "service-type", label: "Service Type", type: "select", options: ["At Home", "At Salon", "At Venue"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹10K", "₹10K-30K", "₹30K-75K", "₹75K+"] },
    ],
  },

  // 8. Rituals & Religious Services
  {
    id: "rituals",
    name: "Rituals & Religious Services",
    emoji: "\u{1FA94}",
    description: "Pandits, ritual kits, astrology, and pooja essentials",
    subcategories: [
      { id: "pandit-priest", name: "Pandit / Priest" },
      { id: "ritual-kits", name: "Wedding Ritual Kits" },
      { id: "astrology-kundli", name: "Astrology / Kundli Matching" },
      { id: "pooja-samagri", name: "Pooja Samagri" },
    ],
    filters: [
      { id: "religion", label: "Religion", type: "select", options: ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist", "Other"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹5K", "₹5K-15K", "₹15K-50K", "₹50K+"] },
    ],
  },

  // 9. Logistics & Transport
  {
    id: "logistics",
    name: "Logistics & Transport",
    emoji: "\u{1F697}",
    description: "Luxury cars, baraat ghodi, guest transport, and drivers",
    subcategories: [
      { id: "luxury-cars", name: "Luxury Cars" },
      { id: "baraat-ghodi", name: "Baraat Ghodi / Baggi" },
      { id: "guest-transport", name: "Buses / Guest Transport" },
      { id: "driver-services", name: "Driver Services" },
    ],
    filters: [
      { id: "vehicle-type", label: "Vehicle Type", type: "select", options: ["Sedan", "SUV", "Vintage", "Horse / Baggi", "Bus", "Tempo Traveller"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹10K", "₹10K-30K", "₹30K-1 Lakh", "₹1 Lakh+"] },
    ],
  },

  // 10. Gifts & Packaging
  {
    id: "gifts",
    name: "Gifts & Packaging",
    emoji: "\u{1F381}",
    description: "Wedding hampers, return gifts, and custom packaging",
    subcategories: [
      { id: "wedding-hampers", name: "Wedding Hampers" },
      { id: "return-gifts", name: "Return Gifts" },
      { id: "packaging-designers", name: "Packaging Designers" },
      { id: "customized-gifts", name: "Customized Gifts" },
    ],
    filters: [
      { id: "budget", label: "Budget per Piece", type: "select", options: ["Under ₹200", "₹200-500", "₹500-1500", "₹1500+"] },
      { id: "quantity", label: "Minimum Order", type: "range", min: 10, max: 1000 },
    ],
  },

  // 11. Rentals & Supplies
  {
    id: "rentals",
    name: "Rentals & Supplies",
    emoji: "\u{1FA91}",
    description: "Furniture, crockery, tents, generators, and more",
    subcategories: [
      { id: "furniture-rental", name: "Furniture Rental" },
      { id: "crockery-cutlery", name: "Crockery & Cutlery" },
      { id: "tents-canopies", name: "Tents & Canopies" },
      { id: "generators", name: "Generators" },
      { id: "coolers-heaters", name: "Coolers / Heaters" },
    ],
    filters: [
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹10K", "₹10K-30K", "₹30K-1 Lakh", "₹1 Lakh+"] },
    ],
  },

  // 12. Planning & Management
  {
    id: "planning",
    name: "Planning & Management",
    emoji: "\u{1F4CB}",
    description: "Wedding planners, coordinators, and invitation designers",
    subcategories: [
      { id: "wedding-planners", name: "Wedding Planners" },
      { id: "event-coordinators", name: "Event Coordinators" },
      { id: "budget-planners", name: "Budget Planners" },
      { id: "invitation-designers", name: "Invitation Designers" },
    ],
    filters: [
      { id: "service-type", label: "Service Type", type: "select", options: ["Full Planning", "Day-of Coordination", "Partial Planning", "Invitations Only"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹50K", "₹50K-2 Lakh", "₹2-5 Lakh", "₹5 Lakh+"] },
    ],
  },

  // 13. Guest Management
  {
    id: "guests",
    name: "Guest Management",
    emoji: "\u{1F3E8}",
    description: "Hotel bookings, welcome kits, RSVP, and travel planning",
    subcategories: [
      { id: "hotel-bookings", name: "Hotel Bookings" },
      { id: "welcome-kits", name: "Guest Welcome Kits" },
      { id: "rsvp-management", name: "RSVP Management" },
      { id: "travel-planning", name: "Travel Planning" },
    ],
    filters: [
      { id: "guest-count", label: "Guest Count", type: "range", min: 10, max: 5000 },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹1 Lakh", "₹1-5 Lakh", "₹5-15 Lakh", "₹15 Lakh+"] },
    ],
  },

  // 14. Legal & Documentation
  {
    id: "legal",
    name: "Legal & Documentation",
    emoji: "\u{1F9FE}",
    description: "Marriage registration and legal documentation services",
    subcategories: [
      { id: "marriage-registration", name: "Marriage Registration Services" },
      { id: "legal-documentation", name: "Legal Documentation" },
    ],
    filters: [
      { id: "service-type", label: "Service Type", type: "select", options: ["Court Marriage", "Registration Only", "Full Documentation"] },
    ],
  },

  // 15. Last-Minute Services (PREMIUM)
  {
    id: "last-minute",
    name: "Last-Minute Services",
    emoji: "⚡",
    description: "Emergency vendors available on short notice when you need them most",
    highlight: "PREMIUM",
    subcategories: [
      { id: "emergency-makeup", name: "Emergency Makeup Artist" },
      { id: "backup-photographer", name: "Backup Photographer" },
      { id: "urgent-decor", name: "Urgent Decor" },
      { id: "same-day-mehendi", name: "Same-day Mehendi" },
      { id: "last-minute-pandit", name: "Last-minute Pandit" },
    ],
    filters: [
      { id: "availability", label: "Available Within", type: "select", options: ["2 Hours", "6 Hours", "12 Hours", "24 Hours"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹10K", "₹10K-30K", "₹30K-75K", "₹75K+"] },
    ],
  },

  // 16. Digital Wedding Services
  {
    id: "digital",
    name: "Digital Wedding Services",
    emoji: "\u{1F310}",
    description: "Wedding websites, e-invites, RSVP tracking, and apps",
    subcategories: [
      { id: "wedding-websites", name: "Wedding Websites" },
      { id: "e-invites", name: "E-Invites" },
      { id: "rsvp-tracking", name: "RSVP Tracking" },
      { id: "digital-live-streaming", name: "Live Streaming" },
      { id: "wedding-apps", name: "Wedding Apps" },
    ],
    filters: [
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹5K", "₹5K-15K", "₹15K-50K", "₹50K+"] },
    ],
  },

  // 17. Pre-Wedding Functions
  {
    id: "pre-wedding",
    name: "Pre-Wedding Functions",
    emoji: "\u{1F389}",
    description: "Roka, engagement, mehendi, haldi, sangeet, and bachelor parties",
    subcategories: [
      { id: "roka", name: "Roka" },
      { id: "engagement", name: "Engagement" },
      { id: "mehendi-function", name: "Mehendi" },
      { id: "haldi-function", name: "Haldi" },
      { id: "sangeet-cocktail", name: "Sangeet / Cocktail" },
      { id: "bachelor-bachelorette", name: "Bachelor / Bachelorette" },
    ],
    filters: [
      { id: "event-type", label: "Event", type: "select", options: ["Roka", "Engagement", "Mehendi", "Haldi", "Sangeet / Cocktail", "Bachelor / Bachelorette"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹50K", "₹50K-2 Lakh", "₹2-5 Lakh", "₹5 Lakh+"] },
    ],
  },

  // 18. Honeymoon & Post-Wedding
  {
    id: "honeymoon",
    name: "Honeymoon & Post-Wedding",
    emoji: "\u{1F48D}",
    description: "Honeymoon packages, travel agencies, and couple experiences",
    subcategories: [
      { id: "honeymoon-packages", name: "Honeymoon Packages" },
      { id: "travel-agencies", name: "Travel Agencies" },
      { id: "couple-experiences", name: "Couple Experiences" },
    ],
    filters: [
      { id: "destination", label: "Destination", type: "select", options: ["Domestic", "International", "Beach", "Mountains", "Heritage"] },
      { id: "budget", label: "Budget", type: "select", options: ["Under ₹50K", "₹50K-1.5 Lakh", "₹1.5-5 Lakh", "₹5 Lakh+"] },
    ],
  },
];

// Helpers
export function getCategoryById(id: string): Category | undefined {
  return categories.find((cat) => cat.id === id);
}

export function getAllSubcategories(): { categoryId: string; categoryName: string; subcategory: Subcategory }[] {
  return categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      categoryId: cat.id,
      categoryName: cat.name,
      subcategory: sub,
    }))
  );
}
