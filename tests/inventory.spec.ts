import { test, expect } from '@fixtures/test';
import { products } from '@data/products';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('lists the full catalogue with correct prices @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(Object.keys(products).length);

    for (const product of Object.values(products)) {
      const card = inventoryPage.items.filter({ hasText: product.name });
      await expect(card.getByTestId('inventory-item-price')).toHaveText(`$${product.price}`);
    }
  });

  test('sorts by name A to Z and Z to A @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const az = await inventoryPage.names();
    expect(az).toEqual([...az].sort((a, b) => a.localeCompare(b)));

    await inventoryPage.sortBy('za');
    const za = await inventoryPage.names();
    expect(za).toEqual([...az].reverse());
  });

  test('sorts by price low to high and high to low @regression', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const ascending = await inventoryPage.prices();
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b));

    await inventoryPage.sortBy('hilo');
    const descending = await inventoryPage.prices();
    expect(descending).toEqual([...descending].sort((a, b) => b - a));
  });

  test('add and remove toggles the button and cart badge @regression', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack, products.onesie);
    await expect(inventoryPage.header.cartBadge).toHaveText('2');
    await expect(inventoryPage.removeButton(products.backpack)).toBeVisible();

    await inventoryPage.removeButton(products.backpack).click();
    await expect(inventoryPage.header.cartBadge).toHaveText('1');
    await expect(inventoryPage.addToCartButton(products.backpack)).toBeVisible();
  });

  test('cart survives a page reload @regression', async ({ page, inventoryPage }) => {
    await inventoryPage.addToCart(products.bikeLight);
    await page.reload();
    await expect(inventoryPage.header.cartBadge).toHaveText('1');
  });
});
