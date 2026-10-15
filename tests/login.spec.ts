import { test, expect } from '@fixtures/test';
import { users } from '@data/users';
import { loginErrors } from '@data/messages';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and out @smoke', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');

    await inventoryPage.header.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });

  const invalidLogins = [
    { name: 'empty username', user: { username: '', password: 'secret_sauce' }, error: loginErrors.usernameRequired },
    { name: 'empty password', user: { username: 'standard_user', password: '' }, error: loginErrors.passwordRequired },
    { name: 'wrong password', user: { username: 'standard_user', password: 'nope' }, error: loginErrors.invalidCredentials },
    { name: 'unknown user', user: { username: 'ghost_user', password: 'secret_sauce' }, error: loginErrors.invalidCredentials },
    { name: 'locked-out user', user: users.lockedOut, error: loginErrors.lockedOut },
  ];

  for (const { name, user, error } of invalidLogins) {
    test(`rejects ${name} @regression`, async ({ page, loginPage }) => {
      await loginPage.login(user);
      await expect(loginPage.error).toHaveText(error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('protected pages redirect to login when not authenticated @regression', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
