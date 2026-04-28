"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUserSession } from "@/lib/auth/session";

export async function saveVendor(vendorId: string): Promise<void> {
  const { userId } = await requireUserSession();
  await db.savedVendor.upsert({
    where: { userId_vendorId: { userId, vendorId } },
    update: {},
    create: { userId, vendorId },
  });
  revalidatePath("/account/saved");
  revalidatePath(`/vendors/v/${vendorId}`);
}

export async function unsaveVendor(vendorId: string): Promise<void> {
  const { userId } = await requireUserSession();
  await db.savedVendor.deleteMany({ where: { userId, vendorId } });
  revalidatePath("/account/saved");
  revalidatePath(`/vendors/v/${vendorId}`);
}

export async function toggleSaveVendor(
  vendorId: string,
): Promise<{ saved: boolean }> {
  const { userId } = await requireUserSession();
  if (typeof vendorId !== "string" || vendorId.length === 0 || vendorId.length > 80) {
    throw new Error("INVALID_VENDOR_ID");
  }
  const existing = await db.savedVendor.findUnique({
    where: { userId_vendorId: { userId, vendorId } },
  });
  if (existing) {
    await db.savedVendor.delete({
      where: { userId_vendorId: { userId, vendorId } },
    });
    revalidatePath("/account/saved");
    revalidatePath(`/vendors/v/${vendorId}`);
    return { saved: false };
  }
  // Validate the vendor exists before insert — clean error instead of FK fail.
  const vendor = await db.vendor.findUnique({
    where: { id: vendorId },
    select: { id: true },
  });
  if (!vendor) throw new Error("VENDOR_NOT_FOUND");
  await db.savedVendor.create({ data: { userId, vendorId } });
  revalidatePath("/account/saved");
  revalidatePath(`/vendors/v/${vendorId}`);
  return { saved: true };
}
