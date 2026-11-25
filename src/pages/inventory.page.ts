import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  readonly title = this.page.getByTestId('title');
  readonly sortSelect = this.page.getByTestId('product-sort-container');
  readonly cartLink = this.page.getByTestId('shopping-cart-link');
  readonly cartBadge = this.page.getByTestId('shopping-cart-badge');

  product(name: string) {
    return this.page.getByTestId('inventory-item').filter({
      has: this.page
        .getByTestId('inventory-item-name')
        .filter({ hasText: name }),
    });
  }

  async sortByPriceLowToHigh(): Promise<void> {
    await this.sortSelect.selectOption('lohi');
  }

  async addProduct(name: string): Promise<void> {
    await this.product(name)
      .getByRole('button', { name: 'Add to cart', exact: true })
      .click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
