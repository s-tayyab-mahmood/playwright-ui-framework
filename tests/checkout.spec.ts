import { test, expect } from '@fixtures/test';
import { products, TAX_RATE } from '@data/products';
import { checkoutErrors } from '@data/messages';
import { roundMoney } from '@utils/money';

const customer = { firstName: 'Tayyab', lastName: 'Mahmood', postalCode: '54000' };

test.describe('Checkout', () => {
  test('end-to-end purchase with correct totals @smoke', async ({ page, inventoryPage, cartPage, checkoutPage }) => {
    const basket = [products.backpack, products.fleeceJacket, products.onesie];

    await test.step('add items to the cart', async () => {
      await inventoryPage.goto();
      await inventoryPage.addToCart(...basket);
      await expect(inventoryPage.header.cartBadge).toHaveText(String(basket.length));
    });

    await test.step('review the cart', async () => {
      await inventoryPage.header.openCart();
      expect((await cartPage.names()).sort()).toEqual(basket.map((p) => p.name).sort());
      await cartPage.checkoutButton.click();
    });

    await test.step('enter customer details', async () => {
      await checkoutPage.fillDetails(customer);
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    });

    await test.step('verify subtotal, 8% tax and total', async () => {
      const expectedSubtotal = roundMoney(basket.reduce((sum, p) => sum + p.price, 0));
      const expectedTax = roundMoney(expectedSubtotal * TAX_RATE);
      const summary = await checkoutPage.summary();

      expect(summary.subtotal).toBe(expectedSubtotal);
      expect(summary.tax).toBe(expectedTax);
      expect(summary.total).toBe(roundMoney(expectedSubtotal + expectedTax));
    });

    await test.step('complete the order', async () => {
      await checkoutPage.finishButton.click();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      await expect(inventoryPage.header.cartBadge).toBeHidden();
    });
  });

  const missingFields = [
    { name: 'first name', details: { lastName: 'Mahmood', postalCode: '54000' }, error: checkoutErrors.firstNameRequired },
    { name: 'last name', details: { firstName: 'Tayyab', postalCode: '54000' }, error: checkoutErrors.lastNameRequired },
    { name: 'postal code', details: { firstName: 'Tayyab', lastName: 'Mahmood' }, error: checkoutErrors.postalCodeRequired },
  ];

  for (const { name, details, error } of missingFields) {
    test(`requires ${name} @regression`, async ({ inventoryPage, checkoutPage }) => {
      await inventoryPage.goto();
      await inventoryPage.addToCart(products.bikeLight);
      await checkoutPage.goto();
      await checkoutPage.fillDetails(details);
      await expect(checkoutPage.error).toHaveText(error);
    });
  }
});
