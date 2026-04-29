import { db } from "@/lib/db";

export interface WeddingEvent {
  name: string;
  date: string;
  venue: string;
  dressCode?: string;
}

export interface SitePayload {
  slug: string;
  headline: string;
  coupleNames: string;
  heroImage?: string | null;
  events: WeddingEvent[];
  isPublic: boolean;
}

function safeParseEvents(json: string): WeddingEvent[] {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is WeddingEvent =>
        x && typeof x === "object" &&
        typeof x.name === "string" &&
        typeof x.date === "string" &&
        typeof x.venue === "string",
    );
  } catch {
    return [];
  }
}

export async function getSiteByUserId(userId: string) {
  const site = await db.weddingSite.findUnique({ where: { userId } });
  if (!site) return null;
  return { ...site, events: safeParseEvents(site.events) };
}

export async function getPublicSiteBySlug(slug: string) {
  const site = await db.weddingSite.findUnique({ where: { slug } });
  if (!site || !site.isPublic) return null;
  return { ...site, events: safeParseEvents(site.events) };
}

export async function upsertSite(userId: string, data: SitePayload) {
  const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const eventsJson = JSON.stringify(data.events);
  return db.weddingSite.upsert({
    where: { userId },
    create: {
      userId,
      slug,
      headline: data.headline,
      coupleNames: data.coupleNames,
      heroImage: data.heroImage ?? null,
      events: eventsJson,
      isPublic: data.isPublic,
    },
    update: {
      slug,
      headline: data.headline,
      coupleNames: data.coupleNames,
      heroImage: data.heroImage ?? null,
      events: eventsJson,
      isPublic: data.isPublic,
    },
  });
}

export async function recordRSVP(input: {
  rsvpToken: string;
  status: "yes" | "no" | "maybe";
  plusOnes?: number;
  dietary?: string;
  notes?: string;
}) {
  const guest = await db.guest.findUnique({ where: { rsvpToken: input.rsvpToken } });
  if (!guest) return null;
  return db.guest.update({
    where: { id: guest.id },
    data: {
      rsvpStatus: input.status,
      plusOnes: input.plusOnes ?? guest.plusOnes,
      dietary: input.dietary ?? guest.dietary,
      notes: input.notes ?? guest.notes,
    },
  });
}
