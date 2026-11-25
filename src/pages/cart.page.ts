import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly title = this.page.getByTestId('title');
  readonly items = this.page.getByTestId('inventory-item');
  readonly itemNames = this.page.getByTestId('inventory-item-name');

  async removeProduct(name: string): Promise<void> {
    await this.items
      .filter({
        has: this.page
          .getByTestId('inventory-item-name')
          .filter({ hasText: name }),
      })
      .getByRole('button', { name: 'Remove', exact: true })
      .click();
  }

  async continueShopping(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Continue Shopping', exact: true })
      .click();
  }

  async checkout(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Checkout', exact: true })
      .click();
  }
}
