import { test, expect } from '../../src/fixtures/base.fixture';
import users from '../../src/test-data/users.json';
import { env } from '../../src/utils/env.config';

test(
  'reject the locked-out demo profile',
  { tag: ['@regression', '@negative', '@demo'] },
  async ({ loginPage, inventoryPage, account }) => {
    test.skip(
      env.accountMode !== 'demo',
      'Only the public demo has the locked-out profile.',
    );
    await loginPage.open('/');
    await loginPage.login(users.lockedOut.username, account.password);
    await expect(loginPage.error).toHaveText(users.lockedOut.expectedError);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(inventoryPage.title).toHaveCount(0);

    await test.step('Verify the standard demo profile can still login', async () => {
      await loginPage.login(account.username, account.password);
      await expect(inventoryPage.title).toHaveText(
        users.standard.expectedInventoryTitle,
      );
    });
  },
);
