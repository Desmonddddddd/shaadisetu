import { describe, it, expect, afterAll } from "vitest";
import { POST } from "./route";
import { db } from "@/lib/db";

const cleanup: string[] = [];

afterAll(async () => {
  if (cleanup.length > 0) {
    await db.enquiry.deleteMany({ where: { id: { in: cleanup } } });
  }
});

function makeReq(body: unknown): Request {
  return new Request("http://test/api/enquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/enquiries", () => {
  it("returns 201 for a valid payload and persists", async () => {
    const someVendor = await db.vendor.findFirst();
    if (!someVendor) throw new Error("seed expected");

    const res = await POST(
      makeReq({
        vendorId: someVendor.id,
        name: "Priya",
        phone: "9876543210",
        eventDate: "2099-12-31",
        eventType: "wedding",
        requirements: "Need cinematic photography for 3-day wedding.",
      }),
    );
    expect(res.status).toBe(201);
    const json = (await res.json()) as { ok: boolean; id: string };
    expect(json.ok).toBe(true);
    cleanup.push(json.id);
    const persisted = await db.enquiry.findUnique({ where: { id: json.id } });
    expect(persisted?.vendorId).toBe(someVendor.id);
    expect(persisted?.status).toBe("new");
  });

  it("returns 400 for zod validation failure (bad phone)", async () => {
    const res = await POST(
      makeReq({
        vendorId: "anything",
        name: "Priya",
        phone: "12345",
        eventDate: "2099-12-31",
        eventType: "wedding",
        requirements: "x".repeat(20),
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for unknown vendorId (FK violation)", async () => {
    const res = await POST(
      makeReq({
        vendorId: "does-not-exist-xyz",
        name: "Priya",
        phone: "9876543210",
        eventDate: "2099-12-31",
        eventType: "wedding",
        requirements: "x".repeat(20),
      }),
    );
    expect(res.status).toBe(400);
    const json = (await res.json()) as { error: string };
    expect(json.error).toMatch(/vendor/i);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://test/api/enquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
