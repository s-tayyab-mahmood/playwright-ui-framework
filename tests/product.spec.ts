import { test, expect } from '@fixtures/test';
import { products } from '@data/products';

test.describe('Product details', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  // Same data on the list and the details page, for every product
  for (const product of Object.values(products)) {
    test(`${product.name} details match the inventory list @regression`, async ({ page, inventoryPage, productPage }) => {
      await inventoryPage.openProduct(product);

      await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
      await expect(productPage.name).toHaveText(product.name);
      expect(await productPage.priceValue()).toBe(product.price);
      await expect(productPage.description).not.toBeEmpty();
      await expect(productPage.image).toBeVisible();
    });
  }

  test('add and remove from the details page updates the cart @smoke', async ({ inventoryPage, productPage }) => {
    await inventoryPage.openProduct(products.fleeceJacket);

    await productPage.addToCartButton.click();
    await expect(productPage.header.cartBadge).toHaveText('1');
    await expect(productPage.removeButton).toBeVisible();

    await productPage.removeButton.click();
    await expect(productPage.header.cartBadge).toBeHidden();
    await expect(productPage.addToCartButton).toBeVisible();
  });

  test('item added on the details page shows in the list and cart @regression', async ({ inventoryPage, productPage, cartPage }) => {
    await inventoryPage.openProduct(products.onesie);
    await productPage.addToCartButton.click();

    await productPage.backButton.click();
    await expect(inventoryPage.removeButton(products.onesie)).toBeVisible();

    await inventoryPage.header.openCart();
    expect(await cartPage.names()).toEqual([products.onesie.name]);
  });
});
