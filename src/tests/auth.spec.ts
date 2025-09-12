import { test, expect } from "@playwright/test";

test("unautorized redirected to login", async ({ page }) => {
  await page.goto("/");

  expect(page.url()).toContain("/login");
});
