import { db } from "@/lib/db";
import type { Enquiry } from "@/generated/prisma";

export type EnquiryListItem = Enquiry & { unread: boolean };

export async function getInboxForVendor(vendorId: string): Promise<EnquiryListItem[]> {
  const rows = await db.enquiry.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({ ...r, unread: r.readAt === null }));
}

export async function getEnquiryForVendor(
  enquiryId: string,
  vendorId: string,
): Promise<Enquiry | null> {
  return db.enquiry.findFirst({ where: { id: enquiryId, vendorId } });
}

export async function getUnreadCountForVendor(vendorId: string): Promise<number> {
  return db.enquiry.count({ where: { vendorId, readAt: null } });
}

export interface CreateEnquiryInput {
  vendorId: string;
  name: string;
  phone: string;
  eventDate: string;
  eventType: string;
  requirements: string;
  userId?: string | null;
}

export async function createEnquiry(input: CreateEnquiryInput): Promise<{ id: string }> {
  const row = await db.enquiry.create({
    data: {
      vendorId: input.vendorId,
      name: input.name,
      phone: input.phone,
      eventDate: input.eventDate,
      eventType: input.eventType,
      requirements: input.requirements,
      userId: input.userId ?? null,
    },
    select: { id: true },
  });
  return { id: row.id };
}
