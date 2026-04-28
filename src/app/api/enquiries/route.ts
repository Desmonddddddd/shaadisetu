import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { enquirySchema } from "@/lib/validators";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const id = randomUUID();
  console.log("[enquiries] received", { id, ...parsed.data });
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
