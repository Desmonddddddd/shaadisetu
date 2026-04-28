import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VendorAvailabilityCalendar } from "./VendorAvailabilityCalendar";

describe("VendorAvailabilityCalendar", () => {
  it("renders the current month name", () => {
    render(<VendorAvailabilityCalendar bookedDates={[]} />);
    const m = new Date().toLocaleString("en-US", { month: "long" });
    expect(screen.getByText(new RegExp(m))).toBeInTheDocument();
  });

  it("marks booked dates with aria-label 'Booked'", () => {
    const today = new Date();
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    render(<VendorAvailabilityCalendar bookedDates={[iso]} />);
    expect(screen.getByLabelText(/Booked/)).toBeInTheDocument();
  });
});
