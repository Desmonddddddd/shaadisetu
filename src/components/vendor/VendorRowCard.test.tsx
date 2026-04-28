import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VendorRowCard } from "./VendorRowCard";
import { makeVendor } from "@/test/fixtures";
import { CompareProvider } from "@/context/CompareContext";

const v = makeVendor();

function renderCard() {
  return render(
    <CompareProvider>
      <VendorRowCard vendor={v} />
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

  it("toggles compare on button click", async () => {
    const user = userEvent.setup();
    renderCard();
    const btn = screen.getByRole("button", { name: /compare/i });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });
});
