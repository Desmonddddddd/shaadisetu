import { test, expect } from "@playwright/test";

test("submit an enquiry and persist to localStorage", async ({ page }) => {
  await page.goto("/vendors/v5");

  await page.getByLabel(/Name/).fill("Priya");
  await page.getByLabel(/Phone/).fill("9876543210");
  await page.getByLabel(/Event date/).fill("2099-12-31");
  await page.getByLabel(/Event type/).selectOption("wedding");
  await page.getByLabel(/Requirements/).fill("Need cinematic photography for our 2-day wedding.");
  await page.getByRole("button", { name: /Send Enquiry/i }).click();

  await expect(page.getByText(/We've sent your enquiry/i)).toBeVisible();

  const stored = await page.evaluate(() => localStorage.getItem("shaadisetu.enquiries"));
  expect(stored).toContain("v5");
});
