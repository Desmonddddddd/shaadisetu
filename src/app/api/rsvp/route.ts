import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { rsvpSchema } from "@/lib/validators";
import { recordRSVP } from "@/lib/queries/wedding-site";

export async function POST(request: Request) {
  const limit = rateLimit(`${getClientIp(request)}:rsvp`, 8, 5 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Slow down — try again in a few minutes." },
      { status: 429 },
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = rsvpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  try {
    const guest = await recordRSVP(parsed.data);
    if (!guest) {
      return NextResponse.json({ ok: false, error: "Invitation not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, status: guest.rsvpStatus });
  } catch (e) {
    console.error("[rsvp]", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
