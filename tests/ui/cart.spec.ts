import users from '../../src/test-data/users.json';
import { test, expect } from '../../src/fixtures/base.fixture';
import data from '../../src/test-data/checkout.json';

test(
  'add a product then remove it and continue shopping',
  { tag: ['@smoke', '@regression'] },
  async ({ account, loginPage, inventoryPage, cartPage }) => {
    const product = data.products[0];

    await test.step('Login and add a product', async () => {
      await loginPage.open('/');
      await loginPage.login(account.username, account.password);
      await expect(inventoryPage.title).toHaveText(
        users.standard.expectedInventoryTitle,
      );
      await inventoryPage.addProduct(product.name);
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    await test.step('Verify the cart and remove the product', async () => {
      await inventoryPage.openCart();
      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.itemNames).toHaveText([product.name]);
      await cartPage.removeProduct(product.name);
      await expect(cartPage.items).toHaveCount(0);
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });

    await test.step('Return to the catalog with an empty cart', async () => {
      await cartPage.continueShopping();
      await expect(inventoryPage.title).toHaveText(
        users.standard.expectedInventoryTitle,
      );
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });
  },
);
