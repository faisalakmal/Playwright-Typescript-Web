import { BasePage } from './base.page';

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  readonly title = this.page.getByTestId('title');
  readonly error = this.page.getByTestId('error');
  readonly itemNames = this.page.getByTestId('inventory-item-name');
  readonly subtotal = this.page.getByTestId('subtotal-label');
  readonly tax = this.page.getByTestId('tax-label');
  readonly total = this.page.getByTestId('total-label');
  readonly confirmation = this.page.getByRole('heading', {
    name: 'Thank you for your order!',
    exact: true,
  });
  readonly confirmationText = this.page.getByTestId('complete-text');

  async fillCustomer(customer: CheckoutCustomer): Promise<void> {
    await this.page.getByTestId('firstName').fill(customer.firstName);
    await this.page.getByTestId('lastName').fill(customer.lastName);
    await this.page.getByTestId('postalCode').fill(customer.postalCode);
  }

  async continue(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Continue', exact: true })
      .click();
  }

  async cancel(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Cancel', exact: true })
      .click();
  }

  async finish(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Finish', exact: true })
      .click();
  }

  async backToProducts(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Back Home', exact: true })
      .click();
  }
}
