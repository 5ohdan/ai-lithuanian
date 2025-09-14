import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/main.page";

test.describe("Happy path", () => {
  test("authenticated user can generate a pack", async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
  });
});
