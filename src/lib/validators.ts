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

export const CEREMONY_OPTIONS = [
  "haldi",
  "mehendi",
  "sangeet",
  "wedding",
  "reception",
  "engagement",
  "general",
] as const;

export const budgetItemSchema = z.object({
  ceremony: z.enum(CEREMONY_OPTIONS),
  category: z.string().trim().min(2).max(60),
  label: z.string().trim().min(2).max(120),
  plannedAmount: z.number().int().min(0).max(100_000_000),
  actualAmount: z.number().int().min(0).max(100_000_000).optional().nullable(),
  vendorId: z.string().trim().max(80).optional().nullable(),
  paid: z.boolean().optional(),
  notes: z.string().trim().max(500).optional().nullable(),
});
export type BudgetItemInput = z.infer<typeof budgetItemSchema>;

export const budgetItemUpdateSchema = budgetItemSchema.partial();
export type BudgetItemUpdate = z.infer<typeof budgetItemUpdateSchema>;

export const weddingProfileSchema = z.object({
  weddingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .optional()
    .nullable(),
  totalBudget: z.number().int().min(0).max(1_000_000_000).optional().nullable(),
});
export type WeddingProfileInput = z.infer<typeof weddingProfileSchema>;

export const weddingEventSchema = z.object({
  name: z.string().trim().min(2).max(60),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  venue: z.string().trim().min(2).max(160),
  dressCode: z.string().trim().max(60).optional(),
});

export const weddingSiteSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Letters, numbers, hyphens only"),
  headline: z.string().trim().min(2).max(160),
  coupleNames: z.string().trim().min(2).max(80),
  heroImage: z.string().trim().url().optional().nullable(),
  events: z.array(weddingEventSchema).max(8),
  isPublic: z.boolean(),
});
export type WeddingSiteInput = z.infer<typeof weddingSiteSchema>;

export const rsvpSchema = z.object({
  rsvpToken: z.string().trim().min(8).max(40),
  status: z.enum(["yes", "no", "maybe"]),
  plusOnes: z.number().int().min(0).max(8).optional(),
  dietary: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(500).optional(),
});
export type RsvpInput = z.infer<typeof rsvpSchema>;
