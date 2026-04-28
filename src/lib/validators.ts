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
  vendorId: z.string().min(1).max(80),
  name: z.string().trim().min(2, "Name is too short").max(80),
  phone: phoneSchema,
  eventDate: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)) && new Date(d) > new Date(), {
      message: "Pick a future date",
    }),
  eventType: eventTypeSchema,
  requirements: z
    .string()
    .trim()
    .min(10, "Tell us a bit more (min 10 chars)")
    .max(2000, "Keep it under 2000 characters"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const curatedRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more (min 10 chars)")
    .max(2000, "Keep it under 2000 characters"),
});

export type CuratedRequestInput = z.infer<typeof curatedRequestSchema>;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .refine((d) => !Number.isNaN(Date.parse(d)), "Invalid date");

const timeOfDay = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Use HH:MM (24h)")
  .optional()
  .or(z.literal(""));

const placeName = z.string().trim().min(2, "Place is too short").max(80);

const personSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  gender: z.enum(["male", "female", "other"]).optional(),
  dob: isoDate,
  tob: timeOfDay,
  place: placeName,
});

export const kundliMatchInputSchema = z.object({
  boy: personSchema,
  girl: personSchema,
  narrative: z.boolean().optional(),
});
export type KundliMatchInput = z.infer<typeof kundliMatchInputSchema>;

export const astroReadingInputSchema = z.object({
  person: personSchema,
  focus: z.enum(["general", "career", "relationships"]).default("general"),
  narrative: z.boolean().optional(),
});
export type AstroReadingInput = z.infer<typeof astroReadingInputSchema>;

export const astroLeadSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(120),
  name: z.string().trim().min(2, "Name is too short").max(80),
  source: z.enum(["kundli-match", "astro-reading"]),
  dob1: isoDate,
  place1: placeName,
  tob1: timeOfDay,
  gender1: z.enum(["male", "female", "other"]).optional(),
  dob2: isoDate.optional(),
  place2: placeName.optional(),
  tob2: timeOfDay,
  gender2: z.enum(["male", "female", "other"]).optional(),
});
export type AstroLeadInput = z.infer<typeof astroLeadSchema>;
