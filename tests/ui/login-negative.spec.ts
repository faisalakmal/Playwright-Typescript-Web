import { test, expect } from '../../src/fixtures/base.fixture';
import data from '../../src/test-data/negative.json';
import { env } from '../../src/utils/env.config';

for (const scenario of data.login) {
  test(
    `reject login with ${scenario.name}`,
    { tag: ['@regression', '@negative'] },
    async ({ loginPage, inventoryPage }) => {
      const username = scenario.username === 'empty' ? '' : env.username;
      // Derive a deliberately incorrect value without storing credentials in fixtures.
      const password =
        scenario.password === 'empty'
          ? ''
          : scenario.password === 'invalid'
            ? `${env.password}-invalid`
            : env.password;

      await loginPage.open('/');
      await loginPage.login(username, password);
      await expect(loginPage.error).toHaveText(scenario.error);
      await expect(loginPage.loginButton).toBeVisible();
      await expect(inventoryPage.title).toHaveCount(0);

      await test.step('Recover with valid credentials', async () => {
        await loginPage.login(env.username, env.password);
        await expect(inventoryPage.title).toHaveText('Products');
      });
    },
  );
}
