"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireVendorSession } from "@/lib/auth/session";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(120, "Name too long"),
  description: z
    .string()
    .trim()
    .min(20, "Tell couples more about your work")
    .max(4000, "Keep the description under 4000 characters"),
  priceRange: z.string().trim().min(1).max(60),
  tags: z.array(z.string().trim().min(1).max(40)).max(10, "Max 10 tags"),
  cityId: z.string().min(1).max(80),
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
  // Validate cityId points at a real city — surfaces a clean error instead
  // of letting the FK fail at write time.
  const cityExists = await db.city.findUnique({
    where: { id: parsed.data.cityId },
    select: { id: true },
  });
  if (!cityExists) {
    return { ok: false, error: "Pick a city from the list" };
  }
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
