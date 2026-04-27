import { z } from "zod";

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const eventTypeSchema = z.enum([
  "haldi",
  "mehendi",
  "wedding",
  "reception",
  "engagement",
  "sangeet",
]);

export const enquirySchema = z.object({
  vendorId: z.string().min(1),
  name: z.string().min(2, "Name is too short"),
  phone: phoneSchema,
  eventDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)) && new Date(d) > new Date(), {
      message: "Pick a future date",
    }),
  eventType: eventTypeSchema,
  requirements: z.string().min(10, "Tell us a bit more (min 10 chars)"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
