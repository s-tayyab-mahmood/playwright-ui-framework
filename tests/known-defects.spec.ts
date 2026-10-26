import { test, expect } from '@fixtures/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { users } from '@data/users';
import { products } from '@data/products';

// Deliberate bugs in the demo accounts. test.fail() keeps CI green until they're fixed.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Known defects @regression', () => {
  test('problem_user: every product should have its own image', async ({ page }) => {
    test.fail(true, 'DEFECT: problem_user sees the same image for every product');

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.problem);
    const sources = await new InventoryPage(page).imageSources();

    expect(new Set(sources).size).toBe(sources.length);
  });

  test('performance_glitch_user: login should complete within 2 seconds', async ({ page }) => {
    test.fail(true, 'DEFECT: performance_glitch_user login is consistently slow');

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const start = Date.now();
    await loginPage.login(users.performanceGlitch);
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 15_000 });
    const elapsed = Date.now() - start;

    expect(elapsed, `login took ${elapsed}ms`).toBeLessThan(2_000);
  });

  test('Reset App State should also reset the Add/Remove buttons', async ({ page }) => {
    test.fail(true, 'DEFECT: after Reset App State the buttons still say Remove until the page is reloaded');

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard);
    const inventory = new InventoryPage(page);
    await inventory.addToCart(products.backpack);

    await inventory.header.resetAppState();

    await expect(inventory.addToCartButton(products.backpack)).toBeVisible({ timeout: 2_000 });
  });
});
