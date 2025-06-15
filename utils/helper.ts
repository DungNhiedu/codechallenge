import { SearchPage } from '../pages/searchPage';
import { Page, expect } from '@playwright/test';

export async function performSearchAndVerify(
  searchPage: SearchPage,
  searchTerm: string,
  expectedDropdownText?: string | string[],
  expectedUrlRegex?: RegExp,
  clickFirstResult: boolean = true
) {
  await searchPage.search(searchTerm);

  if (!expectedDropdownText) {
    const count = await searchPage.getDropdownCount();
    expect(count).toBe(0);
    return;
  }

  const texts = await searchPage.getDropdownTexts();

  if (typeof expectedDropdownText === 'string') {
    expect(texts.some(t => t.toLowerCase().includes(expectedDropdownText.toLowerCase().trim()))).toBeTruthy();
  } else if (Array.isArray(expectedDropdownText)) {
    for (const expectedText of expectedDropdownText) {
      expect(texts.some(t => t.toLowerCase().includes(expectedText.toLowerCase().trim()))).toBeTruthy();
    }
  }

  if (clickFirstResult) {
    await searchPage.clickFirstResult();
    if (expectedUrlRegex) {
      await expect(searchPage.page).toHaveURL(expectedUrlRegex);
    }
  }
}
