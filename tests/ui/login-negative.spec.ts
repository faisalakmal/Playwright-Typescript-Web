import { test, expect } from '../../src/fixtures/base.fixture';
import users from '../../src/test-data/users.json';

for (const scenario of users.negativeCases) {
  test(
    `reject login with ${scenario.name}`,
    { tag: ['@regression', '@negative'] },
    async ({ account, loginPage, inventoryPage }) => {
      const username = scenario.username === 'empty' ? '' : account.username;
      // Derive a deliberately incorrect value without storing credentials in fixtures.
      const password =
        scenario.password === 'empty'
          ? ''
          : scenario.password === 'invalid'
            ? `${account.password}-invalid`
            : account.password;

      await loginPage.open('/');
      await loginPage.login(username, password);
      await expect(loginPage.error).toHaveText(scenario.error);
      await expect(loginPage.loginButton).toBeVisible();
      await expect(inventoryPage.title).toHaveCount(0);

      await test.step('Recover with valid credentials', async () => {
        await loginPage.login(account.username, account.password);
        await expect(inventoryPage.title).toHaveText(
          users.standard.expectedInventoryTitle,
        );
      });
    },
  );
}
