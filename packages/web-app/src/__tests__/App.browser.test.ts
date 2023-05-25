import { expect, test } from "@playwright/test";

test("Page has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Diplicity/);
});
