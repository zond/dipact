import { expect, test } from "@playwright/test";

test("Login page renders", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(5000);
  expect(await page.isVisible("button")).toBeTruthy();
});
