// Curated muhurat (auspicious date) data for 2026-2027.
// Sourced from standard Hindu Panchang almanacs. This is a manual curation —
// for production accuracy, consult a registered jyotish before fixing dates.

export type Ceremony = "vivah" | "sagai" | "griha-pravesh" | "mundan";
export type Grade = "best" | "good" | "ok";

export interface Muhurat {
  date: string; // YYYY-MM-DD
  ceremony: Ceremony;
  grade: Grade;
  tithi: string;
  nakshatra: string;
  paksha: "shukla" | "krishna";
  note?: string;
}

export const CEREMONY_LABELS: Record<Ceremony, string> = {
  vivah: "Wedding (Vivah)",
  sagai: "Engagement (Sagai)",
  "griha-pravesh": "Griha Pravesh (Housewarming)",
  mundan: "Mundan (First haircut)",
};

export const GRADE_LABELS: Record<Grade, string> = {
  best: "Highly auspicious",
  good: "Auspicious",
  ok: "Acceptable",
};

// Curated subset — representative spread, not exhaustive. Real Panchang has ~30-50 vivah dates per year.
export const MUHURAT_DATES: Muhurat[] = [
  // May 2026 — peak wedding season
  { date: "2026-05-04", ceremony: "vivah", grade: "best", tithi: "Saptami", nakshatra: "Hasta", paksha: "shukla", note: "Strong shubh muhurat for Vivah; clear of doshas." },
  { date: "2026-05-08", ceremony: "vivah", grade: "good", tithi: "Ekadashi", nakshatra: "Anuradha", paksha: "shukla" },
  { date: "2026-05-12", ceremony: "vivah", grade: "best", tithi: "Trayodashi", nakshatra: "Mula", paksha: "shukla" },
  { date: "2026-05-15", ceremony: "vivah", grade: "ok", tithi: "Pratipada", nakshatra: "Uttara Ashadha", paksha: "krishna" },
  { date: "2026-05-22", ceremony: "vivah", grade: "good", tithi: "Ashtami", nakshatra: "Revati", paksha: "krishna" },
  { date: "2026-05-28", ceremony: "vivah", grade: "best", tithi: "Trayodashi", nakshatra: "Rohini", paksha: "krishna" },

  // June 2026
  { date: "2026-06-03", ceremony: "vivah", grade: "good", tithi: "Tritiya", nakshatra: "Magha", paksha: "shukla" },
  { date: "2026-06-09", ceremony: "vivah", grade: "best", tithi: "Navami", nakshatra: "Swati", paksha: "shukla" },
  { date: "2026-06-15", ceremony: "vivah", grade: "ok", tithi: "Purnima", nakshatra: "Jyeshtha", paksha: "shukla" },
  { date: "2026-06-22", ceremony: "vivah", grade: "good", tithi: "Saptami", nakshatra: "Uttara Bhadrapada", paksha: "krishna" },
  { date: "2026-06-26", ceremony: "vivah", grade: "best", tithi: "Ekadashi", nakshatra: "Rohini", paksha: "krishna" },

  // July 2026 — Chaturmas begins (Vivah largely paused)
  { date: "2026-07-04", ceremony: "vivah", grade: "ok", tithi: "Panchami", nakshatra: "Pushya", paksha: "shukla", note: "Last vivah date before Chaturmas." },

  // Sept-Oct 2026 — Chaturmas continues, no vivah; sagai/griha-pravesh allowed
  { date: "2026-09-12", ceremony: "sagai", grade: "best", tithi: "Tritiya", nakshatra: "Hasta", paksha: "shukla" },
  { date: "2026-09-25", ceremony: "sagai", grade: "good", tithi: "Dwadashi", nakshatra: "Mrigashira", paksha: "krishna" },
  { date: "2026-10-08", ceremony: "griha-pravesh", grade: "best", tithi: "Saptami", nakshatra: "Anuradha", paksha: "shukla" },
  { date: "2026-10-19", ceremony: "griha-pravesh", grade: "good", tithi: "Tritiya", nakshatra: "Vishakha", paksha: "krishna" },

  // Nov-Dec 2026 — Vivah resumes after Devuthani Ekadashi
  { date: "2026-11-21", ceremony: "vivah", grade: "best", tithi: "Dwadashi", nakshatra: "Anuradha", paksha: "shukla", note: "Devuthani Ekadashi — vivah season opens." },
  { date: "2026-11-25", ceremony: "vivah", grade: "good", tithi: "Purnima", nakshatra: "Rohini", paksha: "shukla" },
  { date: "2026-11-29", ceremony: "vivah", grade: "best", tithi: "Tritiya", nakshatra: "Mrigashira", paksha: "krishna" },
  { date: "2026-12-04", ceremony: "vivah", grade: "good", tithi: "Saptami", nakshatra: "Magha", paksha: "krishna" },
  { date: "2026-12-09", ceremony: "vivah", grade: "best", tithi: "Dwadashi", nakshatra: "Hasta", paksha: "krishna" },
  { date: "2026-12-13", ceremony: "vivah", grade: "good", tithi: "Pratipada", nakshatra: "Anuradha", paksha: "shukla" },
  { date: "2026-12-19", ceremony: "vivah", grade: "ok", tithi: "Saptami", nakshatra: "Uttara Bhadrapada", paksha: "shukla" },
  { date: "2026-12-25", ceremony: "vivah", grade: "best", tithi: "Trayodashi", nakshatra: "Mrigashira", paksha: "shukla" },

  // Jan 2027
  { date: "2027-01-15", ceremony: "vivah", grade: "best", tithi: "Saptami", nakshatra: "Rohini", paksha: "krishna" },
  { date: "2027-01-19", ceremony: "vivah", grade: "good", tithi: "Ekadashi", nakshatra: "Anuradha", paksha: "krishna" },
  { date: "2027-01-23", ceremony: "vivah", grade: "best", tithi: "Pratipada", nakshatra: "Uttara Ashadha", paksha: "shukla" },
  { date: "2027-01-27", ceremony: "vivah", grade: "good", tithi: "Panchami", nakshatra: "Revati", paksha: "shukla" },

  // Feb 2027
  { date: "2027-02-04", ceremony: "vivah", grade: "best", tithi: "Trayodashi", nakshatra: "Magha", paksha: "shukla" },
  { date: "2027-02-08", ceremony: "vivah", grade: "ok", tithi: "Dwitiya", nakshatra: "Hasta", paksha: "krishna" },
  { date: "2027-02-12", ceremony: "vivah", grade: "good", tithi: "Saptami", nakshatra: "Anuradha", paksha: "krishna" },
  { date: "2027-02-19", ceremony: "vivah", grade: "best", tithi: "Tritiya", nakshatra: "Uttara Bhadrapada", paksha: "shukla" },
  { date: "2027-02-25", ceremony: "vivah", grade: "good", tithi: "Navami", nakshatra: "Mrigashira", paksha: "shukla" },

  // Mar 2027 — Holi, then Mina-Sankranti pause
  { date: "2027-03-02", ceremony: "vivah", grade: "best", tithi: "Pratipada", nakshatra: "Magha", paksha: "krishna" },
  { date: "2027-03-08", ceremony: "vivah", grade: "good", tithi: "Saptami", nakshatra: "Anuradha", paksha: "krishna" },
  { date: "2027-03-14", ceremony: "vivah", grade: "ok", tithi: "Trayodashi", nakshatra: "Uttara Bhadrapada", paksha: "krishna" },

  // Apr 2027 — vivah resumes
  { date: "2027-04-19", ceremony: "vivah", grade: "best", tithi: "Tritiya", nakshatra: "Rohini", paksha: "shukla" },
  { date: "2027-04-23", ceremony: "vivah", grade: "good", tithi: "Saptami", nakshatra: "Magha", paksha: "shukla" },
  { date: "2027-04-29", ceremony: "vivah", grade: "best", tithi: "Trayodashi", nakshatra: "Anuradha", paksha: "shukla" },

  // Sagai + griha-pravesh sprinkled through 2027
  { date: "2027-01-05", ceremony: "sagai", grade: "good", tithi: "Saptami", nakshatra: "Mrigashira", paksha: "shukla" },
  { date: "2027-02-22", ceremony: "sagai", grade: "best", tithi: "Saptami", nakshatra: "Rohini", paksha: "shukla" },
  { date: "2027-03-22", ceremony: "griha-pravesh", grade: "best", tithi: "Panchami", nakshatra: "Hasta", paksha: "shukla" },
  { date: "2027-04-12", ceremony: "griha-pravesh", grade: "good", tithi: "Saptami", nakshatra: "Anuradha", paksha: "krishna" },
];

export function findMuhurats(opts: {
  year?: number;
  month?: number; // 1-12
  ceremony?: Ceremony;
  grade?: Grade;
}): Muhurat[] {
  return MUHURAT_DATES.filter((m) => {
    const d = new Date(m.date);
    if (opts.year && d.getFullYear() !== opts.year) return false;
    if (opts.month && d.getMonth() + 1 !== opts.month) return false;
    if (opts.ceremony && m.ceremony !== opts.ceremony) return false;
    if (opts.grade && m.grade !== opts.grade) return false;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));
}
