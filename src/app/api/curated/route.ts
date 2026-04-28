import { NextResponse } from "next/server";
import { curatedRequestSchema } from "@/lib/validators";
import { sendCuratedRequestEmail } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const limit = rateLimit(`${getClientIp(request)}:curated`, 3, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again in a few minutes." },
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

  const parsed = curatedRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    await sendCuratedRequestEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      message: parsed.data.message,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[curated] send failed", e);
    return NextResponse.json(
      { ok: false, error: "Could not send request. Try again later." },
      { status: 500 },
    );
  }
}
