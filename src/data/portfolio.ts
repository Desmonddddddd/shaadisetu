import { sampleVendors } from "./vendors";

export interface PortfolioImage {
  id: string;
  url: string;
  caption: string;
  eventType: "haldi" | "mehendi" | "wedding" | "reception" | "engagement";
}

// Curated Unsplash photo IDs (wedding-themed)
const POOL: { id: string; eventType: PortfolioImage["eventType"]; caption: string }[] = [
  { id: "1519741497674-611481863552", eventType: "wedding", caption: "Mandap moments" },
  { id: "1511285560929-80b456fea0bc", eventType: "wedding", caption: "Bridal entry" },
  { id: "1606800052052-a08af7148866", eventType: "wedding", caption: "Vows under flowers" },
  { id: "1583939003579-730e3918a45a", eventType: "haldi", caption: "Golden haldi" },
  { id: "1604017011826-d3b4c23f8914", eventType: "mehendi", caption: "Intricate mehendi" },
  { id: "1519225421980-715cb0215aed", eventType: "reception", caption: "Reception lights" },
  { id: "1597157639073-69284dc0fdaf", eventType: "engagement", caption: "Ring exchange" },
  { id: "1494774157365-9e04c6720e47", eventType: "wedding", caption: "Pheras around fire" },
  { id: "1525772764200-be829a350797", eventType: "wedding", caption: "Couple portrait" },
  { id: "1530023367847-a683933f4172", eventType: "wedding", caption: "Bride's gaze" },
  { id: "1583939003579-730e3918a45a", eventType: "haldi", caption: "Haldi smiles" },
  { id: "1612831455540-49b5e4ea14c3", eventType: "mehendi", caption: "Mehendi hands" },
  { id: "1605025010570-1d4c2bbab8e2", eventType: "wedding", caption: "Sangeet night" },
  { id: "1604498612436-f0d2f5d5c1df", eventType: "reception", caption: "Reception decor" },
  { id: "1583939003579-730e3918a45a", eventType: "haldi", caption: "Haldi joy" },
  { id: "1591604466107-ec97de577aff", eventType: "wedding", caption: "Bridal jewelry" },
  { id: "1517649763962-0c623066013b", eventType: "engagement", caption: "Engagement glow" },
  { id: "1520854221256-17451cc331bf", eventType: "wedding", caption: "Floral mandap" },
  { id: "1538333965834-90c89c3a3c81", eventType: "reception", caption: "Reception toast" },
  { id: "1564625683533-9bcd3a0090c1", eventType: "wedding", caption: "Wedding rings" },
  { id: "1542303494-edcd2d99e09d", eventType: "wedding", caption: "Bouquet detail" },
  { id: "1553915632-175f60dd8e36", eventType: "mehendi", caption: "Mehendi closeup" },
  { id: "1469371670807-013ccf25f16a", eventType: "wedding", caption: "Sunset vows" },
  { id: "1532712938310-34cb3982ef74", eventType: "engagement", caption: "Pre-wedding shoot" },
  { id: "1514888285-fbb1a9b6bdc7", eventType: "reception", caption: "Reception dance" },
  { id: "1519741497-43a4d5b3196a", eventType: "wedding", caption: "Mandap detail" },
  { id: "1474552226712-ac0f0961a954", eventType: "wedding", caption: "Bride's smile" },
  { id: "1519225421980-715cb0215aed", eventType: "reception", caption: "Stage decor" },
  { id: "1485797036-eda88b2ba18d", eventType: "haldi", caption: "Haldi ritual" },
  { id: "1591604466107-ec97de577aff", eventType: "wedding", caption: "Bridal poise" },
];

function url(id: string): string {
  return `https://images.unsplash.com/photo-${id}?w=1200&q=80`;
}

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickFor(vendorId: string): PortfolioImage[] {
  const seed = hashId(vendorId);
  const count = 5 + (seed % 4); // 5–8
  const out: PortfolioImage[] = [];
  for (let i = 0; i < count; i++) {
    const p = POOL[(seed + i * 7) % POOL.length];
    out.push({
      id: `${vendorId}-${i}`,
      url: url(p.id),
      caption: p.caption,
      eventType: p.eventType,
    });
  }
  return out;
}

export const portfolioByVendor: Record<string, PortfolioImage[]> = Object.fromEntries(
  sampleVendors.map((v) => [v.id, pickFor(v.id)]),
);
