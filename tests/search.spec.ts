import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/searchPage';
import { LoginPage } from '../pages/loginPage';
import { performSearchAndVerify } from '../utils/helper';

test.describe('Search Tests', () => {
  let searchPage: SearchPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('Admin', 'admin123');

    searchPage = new SearchPage(page);
    await searchPage.page.goto('/web/index.php/dashboard/index');
    await expect(searchPage.searchInput).toBeVisible();
  });

  // Functional Scenarios
  test('TC_SRCH_01 - Search full module name "Admin"', async () => {
    await performSearchAndVerify(searchPage, 'Admin', 'Admin', /\/admin\/viewSystemUsers/);
  });

  test('TC_SRCH_02 - Search full module name "PIM"', async () => {
    await performSearchAndVerify(searchPage, 'PIM', 'PIM', /\/pim\/viewEmployeeList/);
  });

  test('TC_SRCH_03 - Case-insensitive search: { timeout: number; } search', async () => {
    await performSearchAndVerify(searchPage, 'leave', 'leave', /\/leave\/viewLeaveList/);
  });

  test('TC_SRCH_04 - Prefix search', async () => {
    await performSearchAndVerify(searchPage, 'Ti', 'Time', undefined, false);
  });

  test('TC_SRCH_05 - Infix search', async () => {
    await performSearchAndVerify(searchPage, 'for', 'Performance', undefined, false);
  });

  // Edge Cases
  test('TC_SRCH_08 - Leading/trailing spaces (no results)', async () => {
    await performSearchAndVerify(searchPage, '  Time  ');
  });

  test('TC_SRCH_09 - Press Enter on empty search box', async ({ page }) => {
    await searchPage.clearSearch();
    await searchPage.pressEnter();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('TC_SRCH_12 - Dropdown performance (< 1500 ms)', async () => {
    const start = Date.now();
    await searchPage.search('Admin');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1500);
  });

  test('TC_SRCH_13 - Input exceeding max length (65 chars)', async () => {
    const longInput = 'a'.repeat(65);
    await performSearchAndVerify(searchPage, longInput);
  });

  // Negative Cases
  test('TC_SRCH_06 - Search with special characters', async () => {
    await performSearchAndVerify(searchPage, '@#$');
  });

  test('TC_SRCH_07 - Search non-existing module', async () => {
    await performSearchAndVerify(searchPage, 'Payroll');
  });

  test('TC_SRCH_10 - Show "My Info" on Space key', async ({ page }) => {
    await searchPage.searchInput.focus();
    await searchPage.pressSpace();
    await page.waitForTimeout(500);

    const texts = await searchPage.getDropdownTexts();
    expect(texts.some(t => t.includes('My Info'))).toBeTruthy();

    await page.locator('a.oxd-main-menu-item:has-text("My Info")').first().click();
    await expect(page).toHaveURL(/\/pim\/viewPersonalDetails/);
  });

  test('TC_SRCH_11 - No navigation with arrow keys + Enter', async ({ page }) => {
    await searchPage.search('a');
    await searchPage.pressArrowDown();
    await searchPage.pressEnter();
    await expect(page).toHaveURL(/dashboard/);
  });

  test('TC_SRCH_14 - SQL injection pattern', async () => {
    await performSearchAndVerify(searchPage, `' OR 1=1 --`);
  });

  test('TC_SRCH_15 - Repeated backspace delete', async ({ page }) => {
    await searchPage.search('Admin');
    for (let i = 0; i < 5; i++) {
      await searchPage.searchInput.press('Backspace');
      await page.waitForTimeout(200);
    }
    const count = await searchPage.getDropdownCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_SRCH_16 - Search with mixed case "AdMiN"', async ({ page }) => {
    await performSearchAndVerify(searchPage, 'AdMiN', 'Admin', /\/admin\/viewSystemUsers/);
  });
  
  test('TC_SRCH_17 - Search with numbers "123"', async () => {
    await performSearchAndVerify(searchPage, '123');
  });
});
