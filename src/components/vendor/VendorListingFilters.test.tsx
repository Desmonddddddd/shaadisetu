import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { VendorListingFilters } from "./VendorListingFilters";

const noop = () => {};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: noop }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/vendors/mumbai/photography",
}));

describe("VendorListingFilters", () => {
  it("renders city, category, sort chips", () => {
    render(<VendorListingFilters cityName="Mumbai" categoryName="Photography" />);
    expect(screen.getByText(/Mumbai/)).toBeInTheDocument();
    expect(screen.getByText(/Photography/)).toBeInTheDocument();
    expect(screen.getByText(/Sort/)).toBeInTheDocument();
  });

  it("Clear all hidden when no filters set (default sort=popularity)", () => {
    render(<VendorListingFilters cityName="Mumbai" categoryName="Photography" />);
    expect(screen.queryByRole("button", { name: /clear all/i })).not.toBeInTheDocument();
  });
});
