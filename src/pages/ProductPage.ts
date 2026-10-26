import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from '@utils/money';

// Single product page (inventory-item.html?id=N)
export class ProductPage extends BasePage {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page, '/inventory-item.html');
    this.name = page.getByTestId('inventory-item-name');
    this.description = page.getByTestId('inventory-item-desc');
    this.price = page.getByTestId('inventory-item-price');
    this.image = page.locator('.inventory_details_img');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeButton = page.getByTestId('remove');
    this.backButton = page.getByTestId('back-to-products');
  }

  async priceValue(): Promise<number> {
    return parsePrice(await this.price.innerText());
  }
}
