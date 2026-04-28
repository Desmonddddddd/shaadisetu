"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireVendorSession } from "@/lib/auth/session";

const profileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  description: z.string().min(20, "Tell couples more about your work"),
  priceRange: z.string().min(1),
  tags: z.array(z.string()).max(10, "Max 10 tags"),
  cityId: z.string().min(1),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export type ProfileResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateVendorProfile(input: ProfileInput): Promise<ProfileResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { vendorId } = await requireVendorSession();
  await db.vendor.update({
    where: { id: vendorId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      priceRange: parsed.data.priceRange,
      tags: JSON.stringify(parsed.data.tags),
      cityId: parsed.data.cityId,
    },
  });
  revalidatePath(`/vendors/v/${vendorId}`);
  revalidatePath("/vendor/dashboard/profile");
  return { ok: true };
}
