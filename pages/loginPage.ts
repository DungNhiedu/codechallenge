import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.locator('input[name="username"]');
    this.passwordInput = this.page.locator('input[name="password"]');
    this.loginButton = this.page.locator('button[type="submit"]');
    this.errorMessage = this.page.locator('.oxd-alert-content');
    this.usernameError = this.page.locator('div.oxd-input-group span.oxd-input-field-error-message').first();
    this.passwordError = this.page.locator('div.oxd-input-group').nth(1).locator('span.oxd-input-field-error-message');
    this.forgotPasswordLink = this.page.locator('text=Forgot your password?');
  }

  async open() {
    await this.goto('https://opensource-demo.orangehrmlive.com/');
  }

  async login(username: string, password: string): Promise<boolean> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);

    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.loginButton.click(),
    ]);

    if (this.page.url().includes('/dashboard')) {
      await expect(this.page.locator('h6:has-text("Dashboard")')).toBeVisible();
      return true;
    } else {
      return false;
    }
  }

  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }

  async expectErrorMessage(text: string) {
    await this.expectText(this.errorMessage, text);
  }

  async expectUsernameRequiredError() {
    await this.expectText(this.usernameError, 'Required');
  }

  async expectPasswordRequiredError() {
    await this.passwordError.waitFor({ state: 'visible', timeout: 5000 });
    await this.expectText(this.passwordError, 'Required');
  }
}