import type { Page } from "@playwright/test";

interface BasePageFeatures {
  goto(path: string): Promise<void>;
  waitForNavigation(): Promise<void>;
}

export class BasePage implements BasePageFeatures {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
    await this.waitForNavigation();
  }

  async waitForNavigation() {
    await this.page.waitForLoadState("domcontentloaded");
  }
}
