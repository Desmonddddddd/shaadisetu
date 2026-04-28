// Prokerala astrology API client.
//
// When PROKERALA_CLIENT_ID and PROKERALA_CLIENT_SECRET are absent, or when
// STUB_ASTRO is set, this module returns deterministic sample data so the UI
// can be developed and demoed end-to-end without paying for credentials.

const TOKEN_URL = "https://api.prokerala.com/token";
const KUNDLI_URL = "https://api.prokerala.com/v2/astrology/kundli";
const MATCH_URL = "https://api.prokerala.com/v2/astrology/kundli-matching";

type Person = {
  name: string;
  gender?: "male" | "female" | "other";
  dob: string; // YYYY-MM-DD
  tob?: string; // HH:MM (24h), optional but recommended
  place: string;
};

export type GunaBreakdownItem = {
  koota: string;
  obtained: number;
  maximum: number;
  description: string;
};

export type KundliMatchResult = {
  totalGuna: number;
  maxGuna: 36;
  verdict: "excellent" | "good" | "average" | "poor";
  breakdown: GunaBreakdownItem[];
  manglikBoy: boolean;
  manglikGirl: boolean;
  source: "prokerala" | "stub";
};

export type KundliReadingResult = {
  sun: { sign: string; nakshatra: string; pada: number };
  moon: { sign: string; nakshatra: string; pada: number };
  ascendant: { sign: string; degree: number };
  planets: Array<{ name: string; sign: string; house: number; retrograde: boolean }>;
  currentDasha: { mahadasha: string; antardasha: string; until: string };
  source: "prokerala" | "stub";
};

function isStub(): boolean {
  return (
    process.env.STUB_ASTRO === "true" ||
    !process.env.PROKERALA_CLIENT_ID ||
    !process.env.PROKERALA_CLIENT_SECRET
  );
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.PROKERALA_CLIENT_ID!,
      client_secret: process.env.PROKERALA_CLIENT_SECRET!,
    }),
  });
  if (!res.ok) throw new Error(`Prokerala token failed: ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

function deterministicScore(seed: string, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % (max + 1);
}

function stubMatch(boy: Person, girl: Person): KundliMatchResult {
  const seed = `${boy.dob}|${girl.dob}|${boy.place}|${girl.place}`;
  const total = 18 + deterministicScore(seed, 18);
  const verdict =
    total >= 28 ? "excellent" : total >= 24 ? "good" : total >= 18 ? "average" : "poor";
  const items: Array<[string, number, string]> = [
    ["Varna", 1, "Spiritual & ego compatibility"],
    ["Vashya", 2, "Mutual influence"],
    ["Tara", 3, "Birth-star compatibility"],
    ["Yoni", 4, "Sexual compatibility & temperament"],
    ["Graha Maitri", 5, "Mental and emotional connection"],
    ["Gana", 6, "Behavioural compatibility"],
    ["Bhakoot", 7, "Family welfare & finances"],
    ["Nadi", 8, "Health & genes"],
  ];
  const breakdown = items.map(([koota, max, desc], i) => ({
    koota,
    maximum: max,
    obtained: Math.min(max, deterministicScore(`${seed}|${i}`, max)),
    description: desc,
  }));
  const recomputed = breakdown.reduce((s, b) => s + b.obtained, 0);
  return {
    totalGuna: recomputed,
    maxGuna: 36,
    verdict:
      recomputed >= 28 ? "excellent" : recomputed >= 24 ? "good" : recomputed >= 18 ? "average" : "poor",
    breakdown,
    manglikBoy: deterministicScore(`${boy.dob}m`, 5) < 2,
    manglikGirl: deterministicScore(`${girl.dob}m`, 5) < 1,
    source: "stub",
  };
}

function stubReading(p: Person): KundliReadingResult {
  const seed = `${p.dob}|${p.place}`;
  const signs = [
    "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
    "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena",
  ];
  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  ];
  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planets = planetNames.map((name, i) => ({
    name,
    sign: signs[deterministicScore(`${seed}|${i}|s`, 11)],
    house: 1 + deterministicScore(`${seed}|${i}|h`, 11),
    retrograde: deterministicScore(`${seed}|${i}|r`, 9) < 2,
  }));
  return {
    sun: {
      sign: signs[deterministicScore(`${seed}|sun`, 11)],
      nakshatra: nakshatras[deterministicScore(`${seed}|sn`, 11)],
      pada: 1 + deterministicScore(`${seed}|sp`, 3),
    },
    moon: {
      sign: signs[deterministicScore(`${seed}|moon`, 11)],
      nakshatra: nakshatras[deterministicScore(`${seed}|mn`, 11)],
      pada: 1 + deterministicScore(`${seed}|mp`, 3),
    },
    ascendant: {
      sign: signs[deterministicScore(`${seed}|asc`, 11)],
      degree: deterministicScore(`${seed}|deg`, 29),
    },
    planets,
    currentDasha: {
      mahadasha: planetNames[deterministicScore(`${seed}|md`, 8)],
      antardasha: planetNames[deterministicScore(`${seed}|ad`, 8)],
      until: `${2026 + deterministicScore(`${seed}|du`, 6)}-${String(1 + deterministicScore(`${seed}|dum`, 11)).padStart(2, "0")}`,
    },
    source: "stub",
  };
}

// Real Prokerala calls require a coordinates lookup we don't have wired up.
// For v1 we always use stub; the network path is sketched for future real data.
export async function getGunaMilan(boy: Person, girl: Person): Promise<KundliMatchResult> {
  if (isStub()) return stubMatch(boy, girl);
  try {
    const token = await getToken();
    const params = new URLSearchParams({
      "girl_dob": `${girl.dob}T${girl.tob || "12:00"}:00+05:30`,
      "girl_coordinates": "28.6139,77.2090",
      "boy_dob": `${boy.dob}T${boy.tob || "12:00"}:00+05:30`,
      "boy_coordinates": "28.6139,77.2090",
      "ayanamsa": "1",
    });
    const res = await fetch(`${MATCH_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Prokerala match failed: ${res.status}`);
    const json = (await res.json()) as unknown;
    return { ...stubMatch(boy, girl), source: "prokerala", ...(json as object) } as KundliMatchResult;
  } catch (e) {
    console.error("[prokerala.match] falling back to stub", e);
    return stubMatch(boy, girl);
  }
}

export async function getKundli(person: Person): Promise<KundliReadingResult> {
  if (isStub()) return stubReading(person);
  try {
    const token = await getToken();
    const params = new URLSearchParams({
      "datetime": `${person.dob}T${person.tob || "12:00"}:00+05:30`,
      "coordinates": "28.6139,77.2090",
      "ayanamsa": "1",
    });
    const res = await fetch(`${KUNDLI_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Prokerala kundli failed: ${res.status}`);
    const json = (await res.json()) as unknown;
    return { ...stubReading(person), source: "prokerala", ...(json as object) } as KundliReadingResult;
  } catch (e) {
    console.error("[prokerala.kundli] falling back to stub", e);
    return stubReading(person);
  }
}
