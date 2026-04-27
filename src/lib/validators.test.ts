import { describe, it, expect } from "vitest";
import { phoneSchema, enquirySchema } from "./validators";

describe("phoneSchema", () => {
  it.each([["6123456789"], ["7123456789"], ["8123456789"], ["9123456789"]])(
    "accepts valid Indian mobile %s",
    (n) => expect(phoneSchema.safeParse(n).success).toBe(true),
  );
  it.each([["5123456789"], ["91234"], ["91234567890"], ["abc1234567"]])(
    "rejects invalid %s",
    (n) => expect(phoneSchema.safeParse(n).success).toBe(false),
  );
});

describe("enquirySchema", () => {
  const valid = {
    vendorId: "v5",
    name: "Priya",
    phone: "9876543210",
    eventDate: "2099-12-31",
    eventType: "wedding",
    requirements: "Need cinematic photography for 2-day wedding.",
  };
  it("accepts valid payload", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });
  it("rejects past dates", () => {
    expect(enquirySchema.safeParse({ ...valid, eventDate: "2000-01-01" }).success).toBe(false);
  });
  it("rejects short requirements", () => {
    expect(enquirySchema.safeParse({ ...valid, requirements: "hi" }).success).toBe(false);
  });
});
