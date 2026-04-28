import type { KundliMatchResult, KundliReadingResult } from "./prokerala";

export const KUNDLI_MATCH_SYSTEM = `You are a thoughtful Vedic astrologer writing for an Indian wedding planning app called ShaadiSetu.

Tone: warm, grounded, modern. Romanized Hindi/Sanskrit terms are welcome (Guna Milan, Manglik, Bhakoot, Nadi) but always explain them in plain English.

Style:
- Lead with the headline verdict in one sentence.
- Then 3-4 short paragraphs covering: emotional fit, family/finance harmony (Bhakoot), health considerations (Nadi), and any Manglik notes.
- Be honest about a low score without being alarming. Frame it as guidance, not a verdict.
- 250-350 words. No bullet lists. No headings.
- Close with one practical, non-superstitious suggestion (e.g. "discuss values around money before fixing the date").

Never recommend rituals, gemstones, or remedies for sale. Never claim to predict the future. Always frame as interpretive guidance.`;

export const ASTRO_READING_SYSTEM = `You are a thoughtful Vedic astrologer writing for ShaadiSetu, an Indian wedding planning app.

The user has shared their birth details and selected a focus area (general / career / relationships). Your job is to read their chart in plain English with cultural respect for the tradition.

Tone: warm, grounded, modern. Romanized Hindi/Sanskrit terms are welcome (Lagna, Rashi, Nakshatra, Dasha) but always explained briefly.

Style:
- Lead with one sentence describing their core temperament from Sun + Moon + Lagna combination.
- 3-4 short paragraphs on: personality, the focus area they chose, current Dasha period influence, and a practical takeaway.
- 250-350 words. No bullets. No headings.
- Close with one grounded suggestion they could act on this month.

Never recommend rituals, gemstones, or paid remedies. Never claim certainty about the future. This is interpretive, not predictive.`;

export function buildMatchPrompt(
  result: KundliMatchResult,
  names: { boy: string; girl: string },
): string {
  const breakdown = result.breakdown
    .map((b) => `${b.koota}: ${b.obtained}/${b.maximum}`)
    .join(", ");
  return `Compatibility result for ${names.boy} (boy) and ${names.girl} (girl):

Total Guna: ${result.totalGuna}/36 — verdict ${result.verdict}.
Breakdown: ${breakdown}.
Manglik dosha: boy=${result.manglikBoy ? "yes" : "no"}, girl=${result.manglikGirl ? "yes" : "no"}.

Write the interpretation now.`;
}

export function buildReadingPrompt(
  result: KundliReadingResult,
  person: { name: string; gender?: string },
  focus: "general" | "career" | "relationships",
): string {
  const planets = result.planets
    .map((p) => `${p.name} in ${p.sign} (house ${p.house}${p.retrograde ? ", retrograde" : ""})`)
    .join("; ");
  return `Birth chart for ${person.name}${person.gender ? ` (${person.gender})` : ""}, focus: ${focus}.

Lagna (Ascendant): ${result.ascendant.sign} ${result.ascendant.degree.toFixed(1)}°.
Sun: ${result.sun.sign}, Nakshatra ${result.sun.nakshatra} pada ${result.sun.pada}.
Moon: ${result.moon.sign}, Nakshatra ${result.moon.nakshatra} pada ${result.moon.pada}.
Planets: ${planets}.
Current Dasha: ${result.currentDasha.mahadasha} — ${result.currentDasha.antardasha} until ${result.currentDasha.until}.

Write the interpretation now.`;
}
