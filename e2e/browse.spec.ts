import { test, expect } from "@playwright/test";

test("browse listing then open vendor profile", async ({ page }) => {
  await page.goto("/vendors/mumbai/photography");
  await expect(page.getByRole("heading", { name: /Photography/i })).toBeVisible();

  // Apply rating filter
  await page.getByRole("button", { name: /Rating/i }).click();
  await page.getByRole("menuitem", { name: /4\.5\+ stars/i }).click();
  await expect(page).toHaveURL(/rating=4\.5/);

  // Open first vendor
  const firstVendor = page.locator("article").first();
  await firstVendor.getByRole("link").first().click();
  await expect(page.getByRole("heading", { name: /Portfolio/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Packages/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Availability/i })).toBeVisible();
});
