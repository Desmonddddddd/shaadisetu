"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireVendorSession } from "@/lib/auth/session";

const ALLOWED = new Set(["new", "contacted", "booked", "declined"]);

export async function markEnquiryStatus(enquiryId: string, status: string): Promise<void> {
  if (!ALLOWED.has(status)) throw new Error("INVALID_STATUS");
  const { vendorId } = await requireVendorSession();
  const updated = await db.enquiry.updateMany({
    where: { id: enquiryId, vendorId },
    data: { status, readAt: new Date() },
  });
  if (updated.count === 0) throw new Error("NOT_FOUND");
  revalidatePath("/vendor/dashboard/enquiries");
  revalidatePath(`/vendor/dashboard/enquiries/${enquiryId}`);
}

export async function markEnquiryRead(enquiryId: string): Promise<void> {
  const { vendorId } = await requireVendorSession();
  await db.enquiry.updateMany({
    where: { id: enquiryId, vendorId, readAt: null },
    data: { readAt: new Date() },
  });
  revalidatePath("/vendor/dashboard/enquiries");
}
