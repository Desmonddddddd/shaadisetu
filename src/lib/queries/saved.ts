import { db } from "@/lib/db";

export async function getSavedVendors(userId: string) {
  const rows = await db.savedVendor.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      vendor: {
        include: { city: true, category: true },
      },
    },
  });
  return rows.map((r) => ({
    savedAt: r.createdAt,
    vendor: r.vendor,
  }));
}

export async function isVendorSaved(userId: string, vendorId: string): Promise<boolean> {
  const row = await db.savedVendor.findUnique({
    where: { userId_vendorId: { userId, vendorId } },
  });
  return !!row;
}

export async function getUserEnquiries(userId: string) {
  return db.enquiry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      vendor: {
        select: { id: true, name: true, city: { select: { name: true } } },
      },
    },
  });
}
