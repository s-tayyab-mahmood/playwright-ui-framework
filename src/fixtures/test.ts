import { test as base, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { ProductPage } from '@pages/ProductPage';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  productPage: ProductPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
});

export { expect };
