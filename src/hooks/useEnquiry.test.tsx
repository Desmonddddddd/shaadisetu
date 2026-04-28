import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useEnquiry } from "./useEnquiry";

const validInput = {
  vendorId: "v5",
  name: "Priya",
  phone: "9876543210",
  eventDate: "2099-12-31",
  eventType: "wedding" as const,
  requirements: "Need cinematic photography for 2-day wedding.",
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("useEnquiry", () => {
  it("posts and saves on success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, id: "abc" }), { status: 200 })
    ));
    const { result } = renderHook(() => useEnquiry());
    await act(async () => { await result.current.submit(validInput); });
    await waitFor(() => expect(result.current.status).toBe("success"));
    const saved = JSON.parse(localStorage.getItem("shaadisetu.enquiries") ?? "[]");
    expect(saved).toHaveLength(1);
    expect(saved[0].vendorId).toBe("v5");
  });

  it("surfaces error on POST failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("oops", { status: 500 })));
    const { result } = renderHook(() => useEnquiry());
    await act(async () => { await result.current.submit(validInput); });
    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
