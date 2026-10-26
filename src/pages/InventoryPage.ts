import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { type Product } from '@data/products';
import { parsePrice } from '@utils/money';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page, '/inventory.html');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  addToCartButton(product: Product): Locator {
    return this.page.getByTestId(`add-to-cart-${product.id}`);
  }

  removeButton(product: Product): Locator {
    return this.page.getByTestId(`remove-${product.id}`);
  }

  async addToCart(...productsToAdd: Product[]): Promise<void> {
    for (const product of productsToAdd) {
      await this.addToCartButton(product).click();
    }
  }

  async openProduct(product: Product): Promise<void> {
    await this.itemNames.filter({ hasText: product.name }).click();
    // The URL changes before the details page renders, so wait for something only that page has
    await this.page.getByTestId('back-to-products').waitFor();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async names(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async prices(): Promise<number[]> {
    return (await this.itemPrices.allTextContents()).map(parsePrice);
  }

  async imageSources(): Promise<string[]> {
    // evaluateAll doesn't wait, so make sure the list has rendered first
    await this.items.first().waitFor();
    return this.items.locator('img').evaluateAll((imgs) =>
      imgs.map((img) => (img as HTMLImageElement).getAttribute('src') ?? ''),
    );
  }
}
