import { NextResponse } from "next/server";
import { requireUserSession, UnauthorizedError } from "@/lib/auth/session";
import { budgetItemUpdateSchema } from "@/lib/validators";
import { deleteBudgetItem, updateBudgetItem } from "@/lib/queries/budget";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await requireUserSession();
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = budgetItemUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }
    const item = await updateBudgetItem(userId, id, parsed.data);
    return NextResponse.json({ ok: true, item });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (e instanceof Error && e.message === "Not found") {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    console.error("[budget.update]", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await requireUserSession();
    const { id } = await params;
    await deleteBudgetItem(userId, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof UnauthorizedError) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (e instanceof Error && e.message === "Not found") {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    console.error("[budget.delete]", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
