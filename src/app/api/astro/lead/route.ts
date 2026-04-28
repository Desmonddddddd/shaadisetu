import { NextResponse } from "next/server";
import { astroLeadSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { getOptionalUserSession } from "@/lib/auth/session";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const limit = rateLimit(`${getClientIp(request)}:astro-lead`, 5, 5 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Try again in a few minutes." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = astroLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  try {
    const userSess = await getOptionalUserSession();
    const lead = await db.astroLead.create({
      data: {
        ...parsed.data,
        userId: userSess?.userId ?? null,
      },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (e) {
    console.error("[astro.lead] persist failed", e);
    return NextResponse.json(
      { ok: false, error: "Could not save submission" },
      { status: 500 },
    );
  }
}
