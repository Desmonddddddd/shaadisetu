export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "ambani-style-wedding",
    title:
      "Inside the 500 Crore Ambani-Style Wedding That Broke the Internet",
    excerpt:
      "From Beyonce performing at the sangeet to a guest list that read like a who's who of global power — we break down what made this wedding the most talked-about celebration of the decade and what it means for Indian wedding culture.",
    date: "April 20, 2026",
    category: "Big Fat Weddings",
    readTime: "8 min read",
  },
  {
    id: "pastel-lehengas-out",
    title: "Pastel Lehengas Are Out: What Brides Are Choosing in 2026",
    excerpt:
      "The reign of millennial pink and powder blue is over. This season, brides are going bold with deep maroons, emerald greens, and classic reds. We spoke to 15 top designers to find out what's flying off the racks.",
    date: "April 15, 2026",
    category: "Trending",
    readTime: "6 min read",
  },
  {
    id: "rajasthan-palace-venues",
    title:
      "10 Palace Venues in Rajasthan That Will Make Your Wedding Royal",
    excerpt:
      "Imagine exchanging vows in a 400-year-old haveli with the Aravalli hills as your backdrop. From Udaipur's Lake Palace to Jodhpur's Umaid Bhawan, here are the most stunning royal wedding venues in Rajasthan.",
    date: "April 10, 2026",
    category: "Venue Ideas",
    readTime: "10 min read",
  },
  {
    id: "priya-arjun-udaipur",
    title:
      "Real Wedding: Priya & Arjun's Intimate Ceremony in Udaipur",
    excerpt:
      "With just 80 guests, zero stress, and a budget that didn't require a second mortgage — Priya and Arjun proved that intimate weddings can be just as magical. Here's their complete wedding story with all the details.",
    date: "April 5, 2026",
    category: "Real Weddings",
    readTime: "12 min read",
  },
  {
    id: "bridal-mehendi-guide",
    title:
      "The Ultimate Bridal Mehendi Guide: 50+ Designs That Are Trending",
    excerpt:
      "Arabic, Rajasthani, minimal, or full-hand — we've curated the most stunning bridal mehendi designs trending this wedding season. Plus, expert tips on making your mehendi darker and last longer.",
    date: "March 28, 2026",
    category: "Bridal Tips",
    readTime: "7 min read",
  },
  {
    id: "goa-destination-weddings",
    title:
      "Why Destination Weddings in Goa Are Surging This Season",
    excerpt:
      "Beach mandaps, sunset pheras, and three-day celebrations by the sea — Goa has become India's hottest wedding destination. We explore the best beach venues, costs, and logistics for planning your Goan dream wedding.",
    date: "March 20, 2026",
    category: "Trending",
    readTime: "9 min read",
  },
  {
    id: "north-indian-rituals",
    title:
      "From Haldi to Vidaai: A Complete Guide to North Indian Wedding Rituals",
    excerpt:
      "Every turmeric smear, every phera, every tear at the vidaai — North Indian weddings are a beautiful tapestry of rituals. Whether you're a bride-to-be or a curious guest, here's your complete guide to every ceremony.",
    date: "March 15, 2026",
    category: "Bridal Tips",
    readTime: "11 min read",
  },
  {
    id: "budget-vs-luxury",
    title:
      "Budget vs Luxury: What Indian Couples Are Really Spending on Weddings",
    excerpt:
      "The average Indian wedding costs between 10 lakhs to 2 crores — but where exactly does all that money go? We surveyed 500 couples across metros and tier-2 cities to bring you the real numbers behind Indian weddings.",
    date: "March 8, 2026",
    category: "Big Fat Weddings",
    readTime: "8 min read",
  },
];

export const blogCategories = [
  "All",
  "Big Fat Weddings",
  "Trending",
  "Bridal Tips",
  "Venue Ideas",
  "Real Weddings",
] as const;
export type BlogCategory = (typeof blogCategories)[number];
