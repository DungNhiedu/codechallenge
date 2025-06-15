import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async click(locator: Locator | string) {
    if (typeof locator === 'string') {
      await this.page.click(locator);
    } else {
      await locator.click();
    }
  }

  async fill(locator: Locator | string, text: string) {
    if (typeof locator === 'string') {
      await this.page.fill(locator, text);
    } else {
      await locator.fill(text);
    }
  }

  async getText(locator: Locator | string): Promise<string> {
    if (typeof locator === 'string') {
      return (await this.page.textContent(locator)) ?? '';
    } else {
      return (await locator.textContent()) ?? '';
    }
  }

  async expectURL(urlOrRegex: string | RegExp) {
    await expect(this.page).toHaveURL(urlOrRegex);
  }

  async expectText(locator: Locator | string, text: string) {
    if (typeof locator === 'string') {
      await expect(this.page.locator(locator)).toContainText(text);
    } else {
      await expect(locator).toContainText(text);
    }
  }
}
