"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireVendorSession } from "@/lib/auth/session";

const packageSchema = z.object({
  tier: z.string().trim().min(1).max(40),
  name: z.string().trim().min(2).max(120),
  price: z.coerce.number().int().positive().max(1_000_000_000),
  features: z.array(z.string().trim().min(1).max(200)).max(20),
  popular: z.boolean().optional(),
});

export type PackageInput = z.infer<typeof packageSchema>;

export type PackageResult = { ok: true } | { ok: false; error: string };

export async function createPackage(input: PackageInput): Promise<PackageResult> {
  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { vendorId } = await requireVendorSession();
  await db.package.create({
    data: {
      vendorId,
      tier: parsed.data.tier,
      name: parsed.data.name,
      price: parsed.data.price,
      features: JSON.stringify(parsed.data.features),
      popular: parsed.data.popular ?? false,
    },
  });
  revalidatePath(`/vendors/v/${vendorId}`);
  revalidatePath("/vendor/dashboard/packages");
  return { ok: true };
}

export async function updatePackage(id: string, input: PackageInput): Promise<PackageResult> {
  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { vendorId } = await requireVendorSession();
  const updated = await db.package.updateMany({
    where: { id, vendorId },
    data: {
      tier: parsed.data.tier,
      name: parsed.data.name,
      price: parsed.data.price,
      features: JSON.stringify(parsed.data.features),
      popular: parsed.data.popular ?? false,
    },
  });
  if (updated.count === 0) return { ok: false, error: "Package not found" };
  revalidatePath(`/vendors/v/${vendorId}`);
  revalidatePath("/vendor/dashboard/packages");
  return { ok: true };
}

export async function deletePackage(id: string): Promise<PackageResult> {
  const { vendorId } = await requireVendorSession();
  const deleted = await db.package.deleteMany({ where: { id, vendorId } });
  if (deleted.count === 0) return { ok: false, error: "Package not found" };
  revalidatePath(`/vendors/v/${vendorId}`);
  revalidatePath("/vendor/dashboard/packages");
  return { ok: true };
}
