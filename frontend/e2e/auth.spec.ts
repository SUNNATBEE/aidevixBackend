import { test, expect } from './fixtures/test-fixtures';
import { ROUTES, SELECTORS, TEST_USER, TIMEOUTS } from './helpers/constants';
import { MOCK_AUTH_LOGIN_SUCCESS, MOCK_AUTH_LOGIN_FAIL, MOCK_AUTH_REGISTER_SUCCESS } from './fixtures/mock-data';
import { waitForPageReady, collectConsoleErrors } from './helpers/test-utils';

test.describe('Authentication — Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**/auth/me*', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
    );
    await page.route('**/api/**/auth/refresh-token*', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
    );

    // Mock login API
    await page.route('**/api/**/auth/login', async (route) => {
      const body = route.request().postDataJSON();
      if (body?.email === TEST_USER.email && body?.password === TEST_USER.password) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_AUTH_LOGIN_SUCCESS),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_AUTH_LOGIN_FAIL),
        });
      }
    });
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    // Email & password fields present
    await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
    await expect(page.locator(SELECTORS.PASSWORD_INPUT)).toBeVisible();
    await expect(page.locator(SELECTORS.SUBMIT_BTN)).toBeVisible();

    // Register link present
    await expect(page.locator('a[href="/register"]')).toBeVisible();

    // Forgot password link present
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    await page.locator(SELECTORS.SUBMIT_BTN).click();

    // Should show required field errors
    await expect(page.locator('text=majburiy').first()).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  });

  test('shows validation error for invalid email', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    await page.locator(SELECTORS.EMAIL_INPUT).fill('notanemail');
    await page.locator(SELECTORS.PASSWORD_INPUT).fill('123456');
    await page.locator(SELECTORS.SUBMIT_BTN).click();

    await expect(page.locator('text=/email|noto.*g.*ri|invalid/i').first()).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  });

  test('shows error for short password', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    await page.locator(SELECTORS.EMAIL_INPUT).fill('test@test.com');
    await page.locator(SELECTORS.PASSWORD_INPUT).fill('123');
    await page.locator(SELECTORS.SUBMIT_BTN).click();

    await expect(page.locator('text=/6.*belgi/i').first()).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  });

  test('successful login redirects to home', async ({ page }) => {
    await page.route('**/api/**/auth/me*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: MOCK_AUTH_LOGIN_SUCCESS.data.user } }),
      }),
    );
    await page.route('**/api/**/xp/stats*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
    );
    await page.route('**/api/**/subscriptions/status*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
    );
    await page.route('**/api/**/courses/top*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { courses: [] } }) }),
    );
    await page.route('**/api/**/videos/top*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { videos: [] } }) }),
    );

    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    await page.locator(SELECTORS.EMAIL_INPUT).fill(TEST_USER.email);
    await page.locator(SELECTORS.PASSWORD_INPUT).fill(TEST_USER.password);
    await page.locator(SELECTORS.SUBMIT_BTN).click();

    // Should redirect to home after successful login
    await page.waitForURL('**/', { timeout: TIMEOUTS.PAGE_LOAD });
  });

  test('failed login shows error message', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    await page.locator(SELECTORS.EMAIL_INPUT).fill('wrong@email.com');
    await page.locator(SELECTORS.PASSWORD_INPUT).fill('wrongpass123');
    await page.locator(SELECTORS.SUBMIT_BTN).click();

    // Error alert should appear
    await expect(page.locator('.alert-error, .text-red-500, [class*="error"]').first())
      .toBeVisible({ timeout: TIMEOUTS.API_RESPONSE });
  });

  test('password toggle shows/hides password', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    const passInput = page.locator('input[name="password"], input[placeholder*="••••"], input[placeholder*="parol" i]').first();
    await expect(passInput).toBeVisible();
    await passInput.fill('testpassword');

    // Initially type=password
    await expect(passInput).toHaveAttribute('type', 'password');

    // Click eye icon to reveal
    const toggleBtn = passInput.locator('xpath=following-sibling::button').first();
    await toggleBtn.click();
    await expect(passInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await toggleBtn.click();
    await expect(passInput).toHaveAttribute('type', 'password');
  });

  test('navigate to register from login', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    await page.locator('a[href="/register"]').click();
    await page.waitForURL('**/register', { timeout: TIMEOUTS.PAGE_LOAD });
  });

  test('navigate to forgot password from login', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    await page.locator('a[href="/forgot-password"]').click();
    await page.waitForURL('**/forgot-password', { timeout: TIMEOUTS.PAGE_LOAD });
  });

  test('theme toggle works on login page', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    // Find theme toggle button (☀ or ☾)
    const themeBtn = page.locator('button').filter({ hasText: /☀|☾/ }).first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      // Page should still be functional
      await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
    }
  });

  test('language switcher works on login page', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    // Switch to Russian
    const ruBtn = page.locator('button').filter({ hasText: 'RU' }).first();
    if (await ruBtn.isVisible()) {
      await ruBtn.click();
      // Wait for re-render
      await page.waitForTimeout(500);
      // Page should still function
      await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
    }
  });
});

test.describe('Authentication — Register', () => {
  test.beforeEach(async ({ page }) => {
    // Global withMockedAPIs logs users in; register flows must stay guest.
    await page.route('**/api/**/auth/me*', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
    );
    await page.route('**/api/**/auth/refresh-token*', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { accessToken: 'e2e-guest' } }),
      }),
    );
    await page.route('**/api/**/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_AUTH_REGISTER_SUCCESS),
      });
    });
  });

  test('register page renders correctly', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    await waitForPageReady(page);

    // Should have registration form elements
    await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
    await expect(page.locator(SELECTORS.PASSWORD_INPUT).first()).toBeVisible();

    // Should have login link
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });

  test('register form shows validation for empty fields', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    await waitForPageReady(page);

    await page.locator(SELECTORS.SUBMIT_BTN).click();

    // Should show validation errors
    await expect(page.locator('text=/majburiy/i').first()).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  });

  test('navigate to login from register', async ({ page }) => {
    await page.goto(ROUTES.REGISTER);
    await waitForPageReady(page);

    await page.locator('a[href="/login"]').click();
    await page.waitForURL('**/login', { timeout: TIMEOUTS.PAGE_LOAD });
  });
});

test.describe('Authentication — Forgot Password', () => {
  test('forgot password page renders', async ({ page }) => {
    await page.goto(ROUTES.FORGOT_PASSWORD);
    await waitForPageReady(page);

    // Should have email input
    await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
  });
});

test.describe('Authentication — Protected Routes', () => {
  test('profile page redirects unauthenticated user', async ({ page }) => {
    // Mock auth/me to return 401
    await page.route('**/api/**/auth/me*', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
    );
    await page.route('**/api/**/auth/refresh-token*', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
    );

    await page.goto(ROUTES.PROFILE);

    // Should either redirect to login or show login prompt
    await page.waitForTimeout(3000);
    const url = page.url();
    const hasLoginPrompt = await page.locator('a[href="/login"]').isVisible().catch(() => false);
    const redirectedToLogin = url.includes('/login');

    expect(redirectedToLogin || hasLoginPrompt).toBeTruthy();
  });

  test('logged-in user can access profile', async ({ loggedInPage }) => {
    await loggedInPage.route('**/api/**/courses/top*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { courses: [] } }) }),
    );
    await loggedInPage.route('**/api/**/videos/top*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { videos: [] } }) }),
    );

    await loggedInPage.goto(ROUTES.PROFILE);
    await waitForPageReady(loggedInPage);

    // Should see profile content (not redirected)
    const url = loggedInPage.url();
    expect(url).toContain('/profile');
  });
});
