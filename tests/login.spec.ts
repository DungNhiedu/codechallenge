import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('OrangeHRM Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('TC_LOGIN_01 - Login with valid credentials', async ({ page }) => {
    const success = await loginPage.login('Admin', 'admin123');
    expect(success).toBe(true);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('TC_LOGIN_02 - Login with invalid username', async () => {
    const success = await loginPage.login('InvalidUser', 'admin123');
    expect(success).toBe(false);
    await loginPage.expectErrorMessage('Invalid credentials');
  });

  test('TC_LOGIN_03 - Login with invalid password', async () => {
    const success = await loginPage.login('Admin', 'wrongpass');
    expect(success).toBe(false);
    await loginPage.expectErrorMessage('Invalid credentials');
  });

  test('TC_LOGIN_04 - Login with both fields empty', async () => {
    const success = await loginPage.login('', '');
    expect(success).toBe(false);
    await loginPage.expectUsernameRequiredError();
    await loginPage.expectPasswordRequiredError();
  });

  test('TC_LOGIN_05 - Login with username empty', async () => {
    const success = await loginPage.login('', 'admin123');
    expect(success).toBe(false);
    await loginPage.expectUsernameRequiredError();
  });

  test('TC_LOGIN_06 - Login with password empty', async () => {
    const success = await loginPage.login('Admin', '');
    expect(success).toBe(false);
    await loginPage.expectPasswordRequiredError();
  });

  test('TC_LOGIN_07 - Forgot your password link', async ({ page }) => {
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/requestPasswordResetCode/);
  });

  test('TC_LOGIN_10 - SQL Injection in username field', async () => {
    const success = await loginPage.login(`' OR 1=1; -- `, 'admin123');
    expect(success).toBe(false);
    await loginPage.expectErrorMessage('Invalid credentials');
  });
});
