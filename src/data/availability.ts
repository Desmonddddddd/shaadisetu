import { sampleVendors } from "./vendors";

// Deterministic seeded RNG (mulberry32) so booked dates are stable across reloads
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function buildDates(id: string, count = 5): string[] {
  const rand = mulberry32(hashId(id));
  const today = new Date();
  const dates = new Set<string>();
  while (dates.size < count) {
    const offsetDays = Math.floor(rand() * 180) + 1; // next 6 months
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    dates.add(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }
  return Array.from(dates).sort();
}

export const bookedDatesByVendor: Record<string, string[]> = Object.fromEntries(
  sampleVendors.map((v) => [v.id, buildDates(v.id)]),
);

export function isBooked(vendorId: string, isoDate: string): boolean {
  return bookedDatesByVendor[vendorId]?.includes(isoDate) ?? false;
}
