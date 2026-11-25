import { test, expect } from '../../src/fixtures/base.fixture';
import data from '../../src/test-data/checkout.json';
import { env } from '../../src/utils/env.config';

test(
  'add a product then remove it and continue shopping',
  { tag: ['@smoke', '@regression'] },
  async ({ loginPage, inventoryPage, cartPage }) => {
    const product = data.products[0];

    await test.step('Login and add a product', async () => {
      await loginPage.open('/');
      await loginPage.login(env.username, env.password);
      await expect(inventoryPage.title).toHaveText('Products');
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
      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });
  },
);
