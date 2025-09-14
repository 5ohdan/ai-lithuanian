import { BasePage } from "./base.page";

export class MainPage extends BasePage {
  async goto() {
    await this.page.goto("/new-pack");
  }
}
