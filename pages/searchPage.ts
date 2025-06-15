import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly dropdownItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search');
    this.dropdownItems = page.locator('a.oxd-main-menu-item');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(500);
  }

  async pressEnter() {
    await this.searchInput.press('Enter');
  }

  async pressSpace() {
    await this.searchInput.press('Space');
  }

  async pressArrowDown() {
    await this.searchInput.press('ArrowDown');
  }

  async clearSearch() {
    await this.searchInput.fill('');
  }

  async clickFirstResult() {
    await expect(this.dropdownItems.first()).toBeVisible({ timeout: 10000 });
    await this.dropdownItems.first().click();
  }

  async getDropdownCount(): Promise<number> {
    return await this.dropdownItems.count();
  }

  async getDropdownTexts(): Promise<string[]> {
    const count = await this.getDropdownCount();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const item = this.dropdownItems.nth(i);
      const text = await item.locator('span.oxd-main-menu-item--name').textContent();
      texts.push(text?.trim() ?? '');
    }
    return texts;
  }
}
