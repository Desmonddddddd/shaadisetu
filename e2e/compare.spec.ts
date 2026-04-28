import { test, expect } from "@playwright/test";

test("add two vendors, compare, then remove one", async ({ page }) => {
  await page.goto("/vendors/mumbai/photography");

  const cards = page.locator("article");
  await cards.nth(0).getByRole("button", { name: /Compare/i }).click();
  await cards.nth(1).getByRole("button", { name: /Compare/i }).click();

  await expect(page.getByText(/Compare \(2\/3\)/)).toBeVisible();

  await page.getByRole("link", { name: /Compare/i }).click();
  await expect(page).toHaveURL(/\/compare/);

  const headers = page.locator("h3");
  await expect(headers.nth(0)).toBeVisible();
  await expect(headers.nth(1)).toBeVisible();

  await page.getByRole("button", { name: /^Remove$/ }).first().click();
  await expect(page.getByText(/Compare \(1\/3\)/)).toBeVisible();
});
