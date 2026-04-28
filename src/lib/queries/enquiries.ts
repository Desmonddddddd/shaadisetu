import { db } from "@/lib/db";

export interface CreateEnquiryInput {
  vendorId: string;
  name: string;
  phone: string;
  eventDate: string;
  eventType: string;
  requirements: string;
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
    },
    select: { id: true },
  });
  return { id: row.id };
}
