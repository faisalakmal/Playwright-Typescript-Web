import { test, expect } from '../../src/fixtures/base.fixture';
import data from '../../src/test-data/checkout.json';
import { env } from '../../src/utils/env.config';

test(
  'cancel checkout and retain the product in the cart',
  { tag: '@regression' },
  async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
    const product = data.products[0];

    await test.step('Login and start checkout with one product', async () => {
      await loginPage.open('/');
      await loginPage.login(env.username, env.password);
      await expect(inventoryPage.title).toHaveText('Products');
      await inventoryPage.addProduct(product.name);
      await inventoryPage.openCart();
      await expect(cartPage.itemNames).toHaveText([product.name]);
      await cartPage.checkout();
      await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    });

    await test.step('Cancel and verify the cart contents are retained', async () => {
      await checkoutPage.cancel();
      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.items).toHaveCount(1);
      await expect(cartPage.itemNames).toHaveText([product.name]);
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    await test.step('Resume checkout from the retained cart', async () => {
      await cartPage.checkout();
      await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    });
  },
);
