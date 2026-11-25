import users from '../../src/test-data/users.json';
import { test, expect } from '../../src/fixtures/base.fixture';
import checkout from '../../src/test-data/checkout.json';
import scenarios from '../../src/test-data/checkout-negative.json';

for (const scenario of scenarios) {
  test(
    `reject checkout without ${scenario.field}`,
    { tag: ['@regression', '@negative'] },
    async ({ account, loginPage, inventoryPage, cartPage, checkoutPage }) => {
      await loginPage.open('/');
      await loginPage.login(account.username, account.password);
      await expect(inventoryPage.title).toHaveText(
        users.standard.expectedInventoryTitle,
      );
      await inventoryPage.addProduct(checkout.products[0].name);
      await inventoryPage.openCart();
      await expect(cartPage.itemNames).toHaveText([checkout.products[0].name]);
      await cartPage.checkout();

      await test.step('Submit with only the selected field empty', async () => {
        await checkoutPage.fillCustomer({
          ...checkout.customer,
          [scenario.field]: '',
        });
        await checkoutPage.continue();
        await expect(checkoutPage.error).toHaveText(scenario.error);
        await expect(checkoutPage.title).toHaveText(
          'Checkout: Your Information',
        );
      });

      await test.step('Correct the field and proceed to overview', async () => {
        await checkoutPage.fillCustomer(checkout.customer);
        await checkoutPage.continue();
        await expect(checkoutPage.title).toHaveText('Checkout: Overview');
        await expect(checkoutPage.itemNames).toHaveText([
          checkout.products[0].name,
        ]);
      });
    },
  );
}
