import { test, expect } from '../../src/fixtures/base.fixture';
import data from '../../src/test-data/checkout.json';
import { env } from '../../src/utils/env.config';

test(
  'complete checkout with two products and required customer validation',
  { tag: '@regression' },
  async ({ page, loginPage, inventoryPage, cartPage, checkoutPage }) => {
    await test.step('Login through the UI', async () => {
      await loginPage.open('/');
      await loginPage.login(env.username, env.password);
      await expect(inventoryPage.title).toHaveText('Products');
    });

    await test.step('Sort products and add the selected products', async () => {
      await inventoryPage.sortByPriceLowToHigh();
      await expect(inventoryPage.sortSelect).toHaveValue('lohi');
      for (const product of data.products) {
        await expect(inventoryPage.product(product.name)).toContainText(
          `$${product.price.toFixed(2)}`,
        );
        await inventoryPage.addProduct(product.name);
      }
      await expect(inventoryPage.cartBadge).toHaveText(
        String(data.products.length),
      );
    });

    await test.step('Check the cart and start checkout', async () => {
      await inventoryPage.openCart();
      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.items).toHaveCount(data.products.length);
      await expect(cartPage.itemNames).toHaveText(
        data.products.map((product) => product.name),
      );
      await cartPage.checkout();
      await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    });

    await test.step('Validate required input then enter customer details', async () => {
      await checkoutPage.continue();
      await expect(checkoutPage.error).toHaveText(
        data.expected.requiredFirstName,
      );
      await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
      await checkoutPage.fillCustomer(data.customer);
      await checkoutPage.continue();
    });

    await test.step('Verify order details and complete payment', async () => {
      await expect(checkoutPage.title).toHaveText('Checkout: Overview');
      await expect(checkoutPage.itemNames).toHaveText(
        data.products.map((product) => product.name),
      );
      await expect(checkoutPage.subtotal).toHaveText(data.expected.subtotal);
      await expect(checkoutPage.tax).toHaveText(data.expected.tax);
      await expect(checkoutPage.total).toHaveText(data.expected.total);
      await checkoutPage.finish();
      await expect(page).toHaveURL(/\/checkout-complete\.html$/);
      await expect(checkoutPage.confirmation).toBeVisible();
      await expect(checkoutPage.confirmationText).toHaveText(
        data.expected.confirmationText,
      );
      await expect(inventoryPage.cartBadge).toHaveCount(0);
      await checkoutPage.backToProducts();
      await expect(inventoryPage.title).toHaveText('Products');
    });
  },
);
