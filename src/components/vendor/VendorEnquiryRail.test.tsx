import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VendorEnquiryRail } from "./VendorEnquiryRail";
import { sampleVendors } from "@/data/vendors";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ ok: true, id: "abc" }), { status: 200 })
  ));
});

describe("VendorEnquiryRail", () => {
  it("shows inline error for invalid phone", async () => {
    const user = userEvent.setup();
    render(<VendorEnquiryRail vendor={sampleVendors[0]} />);
    await user.type(screen.getByLabelText(/name/i), "Priya");
    await user.type(screen.getByLabelText(/phone/i), "12345");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/valid 10-digit/i)).toBeInTheDocument();
  });

  it("shows thank-you state on success", async () => {
    const user = userEvent.setup();
    render(<VendorEnquiryRail vendor={sampleVendors[0]} />);
    await user.type(screen.getByLabelText(/name/i), "Priya");
    await user.type(screen.getByLabelText(/phone/i), "9876543210");
    await user.type(screen.getByLabelText(/event date/i), "2099-12-31");
    await user.selectOptions(screen.getByLabelText(/event type/i), "wedding");
    await user.type(screen.getByLabelText(/requirements/i), "Need cinematic photography for wedding.");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/we've sent your enquiry/i)).toBeInTheDocument();
  });
});
