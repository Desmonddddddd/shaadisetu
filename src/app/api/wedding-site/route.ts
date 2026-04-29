import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import { requireUserSession, UnauthorizedError } from "@/lib/auth/session";
import { weddingSiteSchema } from "@/lib/validators";
import { getSiteByUserId, upsertSite } from "@/lib/queries/wedding-site";

export async function GET() {
  try {
    const { userId } = await requireUserSession();
    const site = await getSiteByUserId(userId);
    return NextResponse.json({ ok: true, site });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("[wedding-site.get]", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUserSession();
    const body = await request.json().catch(() => null);
    const parsed = weddingSiteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const site = await upsertSite(userId, parsed.data);
    return NextResponse.json({ ok: true, site });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "That URL is taken — try another." },
        { status: 409 },
      );
    }
    console.error("[wedding-site.upsert]", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
