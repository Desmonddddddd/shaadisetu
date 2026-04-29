import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  DISCOVER_SYSTEM_PROMPT,
  formatVendorsForPrompt,
  parseTopPicks,
} from "@/lib/discover";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const inputSchema = z.object({
  description: z.string().trim().min(10, "Tell us a bit more").max(800),
});

interface RawTagRow {
  id: string;
  name: string;
  description: string;
  rating: number;
  priceRange: string;
  tags: string;
  cityName: string | null;
  categoryName: string | null;
}

export async function POST(request: Request) {
  const limit = rateLimit(`${getClientIp(request)}:discover`, 10, 5 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Slow down. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Discovery is not configured yet." },
      { status: 503 },
    );
  }

  // Fetch a representative slice of vendors. Cap at ~40 to keep prompt cost down.
  const vendors = await db.vendor.findMany({
    where: { moderationState: "live" },
    select: {
      id: true,
      name: true,
      description: true,
      rating: true,
      priceRange: true,
      tags: true,
      city: { select: { name: true } },
      category: { select: { name: true } },
    },
    orderBy: { rating: "desc" },
    take: 40,
  });
  if (vendors.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No vendors in catalogue yet." },
      { status: 503 },
    );
  }

  const formatted = vendors.map((v) => ({
    id: v.id,
    name: v.name,
    description: v.description,
    rating: v.rating,
    priceRange: v.priceRange,
    tags: parseTags(v.tags),
    cityName: v.city?.name,
    categoryName: v.category?.name,
  }));

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: DISCOVER_SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" },
    },
  ];
  const userMessage = `User's described vibe:\n\n"${parsed.data.description}"\n\nCatalogue (40 vendors):\n\n${formatVendorsForPrompt(formatted)}`;

  let assistantText = "";
  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userMessage }],
    });
    const block = response.content[0];
    if (block && block.type === "text") assistantText = block.text;
  } catch (e) {
    console.error("[discover] anthropic error", e);
    return NextResponse.json(
      { ok: false, error: "Discovery is busy. Try again." },
      { status: 503 },
    );
  }

  const pickIds = parseTopPicks(assistantText);
  const idToVendor = new Map(formatted.map((v) => [v.id, v]));
  const picks = pickIds
    .map((id) => idToVendor.get(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  // Strip the TOP_PICKS line from the rationale
  const rationale = assistantText.replace(/TOP_PICKS:[^\n]*\n*/, "").trim();

  return NextResponse.json({
    ok: true,
    picks: picks.map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description,
      rating: v.rating,
      priceRange: v.priceRange,
      tags: v.tags,
      cityName: v.cityName,
      categoryName: v.categoryName,
    })),
    rationale,
  });
}

function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
