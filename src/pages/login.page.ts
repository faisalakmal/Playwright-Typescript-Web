import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly error = this.page.getByTestId('error');
  readonly usernameInput = this.page.getByTestId('username');
  readonly passwordInput = this.page.getByTestId('password');
  readonly loginButton = this.page.getByRole('button', {
    name: 'Login',
    exact: true,
  });

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
