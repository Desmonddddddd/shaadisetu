import { describe, it, expect, afterAll } from "vitest";
import { db } from "@/lib/db";
import { createEnquiry } from "./enquiries";

const created: string[] = [];
afterAll(async () => {
  if (created.length) await db.enquiry.deleteMany({ where: { id: { in: created } } });
});

describe("createEnquiry", () => {
  it("inserts a row and returns the id", async () => {
    const out = await createEnquiry({
      vendorId: "v5",
      name: "Priya",
      phone: "9876543210",
      eventDate: "2099-12-31",
      eventType: "wedding",
      requirements: "Need cinematic photography for our 2-day wedding.",
    });
    expect(typeof out.id).toBe("string");
    created.push(out.id);

    const row = await db.enquiry.findUnique({ where: { id: out.id } });
    expect(row).not.toBeNull();
    expect(row!.name).toBe("Priya");
    expect(row!.status).toBe("new");
  });

  it("rejects unknown vendorId with FK error", async () => {
    await expect(
      createEnquiry({
        vendorId: "vendor-does-not-exist",
        name: "X",
        phone: "9876543210",
        eventDate: "2099-12-31",
        eventType: "wedding",
        requirements: "x",
      }),
    ).rejects.toThrow();
  });
});
