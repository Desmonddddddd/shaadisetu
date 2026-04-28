import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validators";
import { createEnquiry } from "@/lib/queries/enquiries";
import { Prisma } from "@/generated/prisma";
import { db } from "@/lib/db";
import { sendNewEnquiryEmail } from "@/lib/email";
import { getOptionalUserSession } from "@/lib/auth/session";

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
  try {
    const userSess = await getOptionalUserSession();
    const { id } = await createEnquiry({
      ...parsed.data,
      userId: userSess?.userId ?? null,
    });
    db.vendor
      .findUnique({
        where: { id: parsed.data.vendorId },
        select: { email: true, name: true },
      })
      .then((vendor) => {
        if (vendor) return sendNewEnquiryEmail(vendor, parsed.data);
      })
      .catch((e) => console.error("[enquiries.email]", e));
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return NextResponse.json(
        { ok: false, error: "Vendor not found" },
        { status: 400 },
      );
    }
    console.error("[enquiries] persist failed", e);
    return NextResponse.json(
      { ok: false, error: "Could not save enquiry" },
      { status: 500 },
    );
  }
}
