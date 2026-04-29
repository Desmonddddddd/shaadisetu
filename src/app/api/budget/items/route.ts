import { NextResponse } from "next/server";
import { requireUserSession, UnauthorizedError } from "@/lib/auth/session";
import { budgetItemSchema } from "@/lib/validators";
import { createBudgetItem, getOrCreateProfile } from "@/lib/queries/budget";

export async function GET() {
  try {
    const { userId } = await requireUserSession();
    const profile = await getOrCreateProfile(userId);
    return NextResponse.json({ ok: true, profile });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("[budget.list]", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireUserSession();
    const body = await request.json().catch(() => null);
    const parsed = budgetItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const item = await createBudgetItem(userId, parsed.data);
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    console.error("[budget.create]", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
