import { test, expect } from '@fixtures/test';
import { products } from '@data/products';

test.describe('Side menu', () => {
  test('All Items goes back to the inventory from the cart @regression', async ({ page, cartPage, inventoryPage }) => {
    await cartPage.goto();
    await cartPage.header.openMenu();
    await cartPage.header.allItemsLink.click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('About links to the Sauce Labs site @regression', async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.header.openMenu();

    // Check the link target rather than leaving the app under test
    await expect(inventoryPage.header.aboutLink).toHaveAttribute('href', /saucelabs\.com/);
  });

  test('menu can be closed again @regression', async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.header.openMenu();
    await expect(inventoryPage.header.logoutLink).toBeVisible();

    await inventoryPage.header.closeMenuButton.click();
    await expect(inventoryPage.header.logoutLink).toBeHidden();
  });

  test('Reset App State empties the cart @regression', async ({ page, inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack, products.bikeLight);
    await expect(inventoryPage.header.cartBadge).toHaveText('2');

    await inventoryPage.header.resetAppState();
    await expect(inventoryPage.header.cartBadge).toBeHidden();

    // Cart is stored in localStorage - a reload proves it was really cleared
    await page.reload();
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });
});
