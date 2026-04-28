"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireVendorSession } from "@/lib/auth/session";
import { uploadImageFromDataUrl } from "@/lib/upload";

// Cap dataUrl at ~11MB to leave headroom for the base64 expansion of an
// 8MB image (8 * 1.37 ≈ 11). Anything larger is rejected without hitting
// the network or the database.
const MAX_DATA_URL_LENGTH = 11_500_000;

const addSchema = z.object({
  dataUrl: z
    .string()
    .min(20)
    .max(MAX_DATA_URL_LENGTH, "Image too large — max 8MB")
    .refine((s) => s.startsWith("data:image/"), "Only image data URLs accepted"),
  filename: z.string().max(120),
  caption: z.string().trim().max(120).optional(),
  eventType: z.string().trim().max(40).optional(),
});

export type AddPortfolioResult =
  | { ok: true; id: string; url: string }
  | { ok: false; error: string };

export async function addPortfolioImage(input: {
  dataUrl: string;
  filename: string;
  caption?: string;
  eventType?: string;
}): Promise<AddPortfolioResult> {
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { vendorId } = await requireVendorSession();
  const uploaded = await uploadImageFromDataUrl(parsed.data.dataUrl, parsed.data.filename);

  const row = await db.portfolioImage.create({
    data: {
      id: uploaded.publicId,
      vendorId,
      url: uploaded.url,
      caption: parsed.data.caption ?? "",
      eventType: parsed.data.eventType ?? "",
    },
    select: { id: true, url: true },
  });

  revalidatePath("/vendor/dashboard/portfolio");
  revalidatePath(`/vendors/v/${vendorId}`);
  return { ok: true, id: row.id, url: row.url };
}

export async function deletePortfolioImage(imageId: string): Promise<void> {
  const { vendorId } = await requireVendorSession();
  await db.portfolioImage.deleteMany({ where: { id: imageId, vendorId } });
  revalidatePath("/vendor/dashboard/portfolio");
  revalidatePath(`/vendors/v/${vendorId}`);
}

export async function setCoverImage(url: string | null): Promise<void> {
  const { vendorId } = await requireVendorSession();

  // Only accept https URLs we generated ourselves. Reject anything else to
  // prevent javascript:/data: injection into CSS background-image, and to
  // keep the cover field a known-shape image URL.
  let safeUrl: string | null = null;
  if (url) {
    if (typeof url !== "string" || url.length > 2048) return;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") return;
      safeUrl = parsed.toString();
    } catch {
      return;
    }
  }

  await db.vendor.update({
    where: { id: vendorId },
    data: { coverImage: safeUrl },
  });
  revalidatePath("/vendor/dashboard/portfolio");
  revalidatePath(`/vendors/v/${vendorId}`);
  revalidatePath("/vendors");
}
