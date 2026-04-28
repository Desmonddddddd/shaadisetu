import { sampleVendors } from "./vendors";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  eventType: string;
}

const AUTHORS = [
  "Priya S.", "Arjun M.", "Aanya R.", "Rohan K.", "Ishita P.",
  "Karan V.", "Neha G.", "Vivaan T.", "Sara D.", "Aditya N.",
  "Meera J.", "Kabir B.", "Diya L.", "Yash C.", "Tanvi H.",
];

const TEMPLATES = [
  { title: "Made our day magical", body: "Truly professional and warm. Captured every emotion beautifully — would recommend in a heartbeat." },
  { title: "Worth every rupee", body: "Stunning quality, on-time delivery, and the team handled every last-minute change calmly. Thank you so much!" },
  { title: "Family fell in love", body: "Even the elders couldn't stop praising the work. The album is now a family heirloom." },
  { title: "Beyond expectations", body: "We had high hopes after the consultation and they exceeded every one. Beautifully crafted experience." },
  { title: "Highly recommend", body: "Smooth coordination, fair pricing, and a genuinely lovely team to work with. 10/10." },
  { title: "Absolutely flawless", body: "From initial enquiry to final delivery, everything was seamless. They understood our brief perfectly." },
  { title: "Made us feel special", body: "It felt like a friend was helping with our wedding rather than a paid service. Heartfelt experience." },
  { title: "Punctual and creative", body: "Showed up early, stayed late, and captured frames we didn't even realize were happening." },
];

const EVENT_NAMES = ["Wedding", "Reception", "Engagement", "Haldi", "Mehendi"];

function eventLabel(name: string, monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  const m = d.toLocaleString("en-US", { month: "short" });
  return `${name} · ${m} ${d.getFullYear()}`;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildReviews(vendorId: string, vendorRating: number): Review[] {
  const seed = hash(vendorId);
  const count = 5 + (seed % 6); // 5–10
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    const t = TEMPLATES[(seed + i * 3) % TEMPLATES.length];
    const author = AUTHORS[(seed + i * 5) % AUTHORS.length];
    const name = EVENT_NAMES[(seed + i * 7) % EVENT_NAMES.length];
    const event = eventLabel(name, i + 1);
    // Cluster ratings around the vendor's overall rating: ±1, clamped 1..5
    const drift = ((seed + i * 11) % 3) - 1; // -1, 0, +1
    const rating = Math.max(1, Math.min(5, Math.round(vendorRating + drift)));
    const d = new Date();
    d.setMonth(d.getMonth() - (i + 1));
    out.push({
      id: `${vendorId}-r${i}`,
      author,
      rating,
      date: d.toISOString().slice(0, 10),
      title: t.title,
      body: t.body,
      eventType: event,
    });
  }
  return out;
}

export const reviewsByVendor: Record<string, Review[]> = Object.fromEntries(
  sampleVendors.map((v) => [v.id, buildReviews(v.id, v.rating)]),
);
