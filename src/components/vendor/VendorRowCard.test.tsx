import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VendorRowCard } from "./VendorRowCard";
import { sampleVendors } from "@/data/vendors";
import { CompareProvider } from "@/context/CompareContext";

const v = sampleVendors[0];

function renderCard(props: Partial<React.ComponentProps<typeof VendorRowCard>> = {}) {
  return render(
    <CompareProvider>
      <VendorRowCard vendor={v} {...props} />
    </CompareProvider>,
  );
}

describe("VendorRowCard", () => {
  it("shows name, rating, and price", () => {
    renderCard();
    expect(screen.getByText(v.name)).toBeInTheDocument();
    expect(screen.getByText(v.priceRange)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(v.rating.toString()))).toBeInTheDocument();
  });

  it("shows Available when filterDate is far in the past", () => {
    const { container } = renderCard({ filterDate: "1900-01-01" });
    expect(container.textContent).toContain("Available");
  });

  it("toggles compare on button click", async () => {
    const user = userEvent.setup();
    renderCard();
    const btn = screen.getByRole("button", { name: /compare/i });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });
});
