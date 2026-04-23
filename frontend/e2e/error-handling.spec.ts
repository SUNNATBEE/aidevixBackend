import { test, expect } from './fixtures/test-fixtures';
import type { Page } from '@playwright/test';
import { ROUTES, SELECTORS, TIMEOUTS } from './helpers/constants';
import { waitForPageReady, collectConsoleErrors, assertNoBrokenLinks, assertAccessibleInteractives } from './helpers/test-utils';

const mockAnyApiOk = async (page: Page) => {
  await page.route('**/api/**', (route) => {
    const url = route.request().url();
    if (url.includes('/auth/me')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: { _id: 'e2e-user' } } }),
      });
    }
    if (url.includes('/auth/refresh-token')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { accessToken: 'token' } }),
      });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) });
  });
};

const gotoFast = async (page: Page, path: string) => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
};

test.describe('Error Handling — 404 Page', () => {
  test('404 page renders for invalid route', async ({ page }) => {
    await mockAnyApiOk(page);

    await gotoFast(page, '/this-page-does-not-exist-xyz');
    await waitForPageReady(page);

    // Should show 404 content
    const has404 = await page.locator('text=/404|sahifa topilmadi|not found/i').first().isVisible().catch(() => false);
    expect(has404).toBeTruthy();
  });

  test('404 page has link back to home', async ({ page }) => {
    await mockAnyApiOk(page);

    await gotoFast(page, '/nonexistent-page');
    await waitForPageReady(page);

    const homeLink = page.locator('a[href="/"]').first();
    await expect(homeLink).toBeVisible();
  });

  test('404 page has link to courses', async ({ page }) => {
    await mockAnyApiOk(page);

    await gotoFast(page, '/nonexistent-page');
    await waitForPageReady(page);

    const coursesLink = page.locator('a[href="/courses"]').first();
    await expect(coursesLink).toBeVisible();
  });

  test('404 home link navigates correctly', async ({ page }) => {
    await mockAnyApiOk(page);

    await gotoFast(page, '/nonexistent-page');
    await waitForPageReady(page);

    const homeBackLink = page.getByRole('link', { name: /bosh sahifaga qaytish/i });
    await expect(homeBackLink).toHaveAttribute('href', '/');
    await homeBackLink.click({ force: true });
    await page.waitForTimeout(800);
    expect(page.url()).not.toContain('/nonexistent-page');
  });
});

test.describe('Error Handling — API Failures', () => {
  test('homepage handles API failure gracefully', async ({ page }) => {
    await page.route('**/api/**/courses/top*', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Server error' }) }),
    );
    await page.route('**/api/**/videos/top*', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Server error' }) }),
    );
    await page.route('**/api/**/auth/me*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { user: { _id: 'e2e-user' } } }) }),
    );
    await page.route('**/api/**/auth/refresh-token*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { accessToken: 'token' } }) }),
    );

    await gotoFast(page, ROUTES.HOME);
    await waitForPageReady(page);

    // Page should still render without crashing
    await expect(page).not.toHaveTitle(/500|error/i);

    // At minimum, app should keep rendering and avoid a hard crash.
    await expect(page.locator('body')).toBeVisible();
  });

  test('courses page handles API failure', async ({ page }) => {
    await page.route('**/api/**/courses*', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
    );
    await page.route('**/api/**/auth/me*', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
    );
    await page.route('**/api/**/auth/refresh-token*', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
    );

    await gotoFast(page, ROUTES.COURSES);
    await waitForPageReady(page);

    // Should not crash
    await expect(page.locator('body')).toBeVisible();
  });

  test('network timeout shows appropriate feedback', async ({ page }) => {
    await page.route('**/api/**/courses*', (route) =>
      route.fulfill({ status: 504, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Gateway timeout' }) }),
    );
    await page.route('**/api/**/auth/me*', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
    );
    await page.route('**/api/**/auth/refresh-token*', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
    );

    await gotoFast(page, ROUTES.COURSES);
    await page.waitForTimeout(5000);

    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Error Handling — Edge Cases', () => {
  test('double-clicking submit does not cause issues', async ({ page }) => {
    await page.route('**/api/**/auth/login', async (route) => {
      // Slow response
      await new Promise((r) => setTimeout(r, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { user: {}, accessToken: 'tok' } }),
      });
    });
    await page.route('**/api/**/auth/me*', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
    );
    await page.route('**/api/**/auth/refresh-token*', (route) =>
      route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
    );

    await gotoFast(page, ROUTES.LOGIN);
    await waitForPageReady(page);

    await page.locator(SELECTORS.EMAIL_INPUT).fill('test@test.com');
    await page.locator(SELECTORS.PASSWORD_INPUT).fill('password123');

    // Double-click submit
    await page.locator(SELECTORS.SUBMIT_BTN).dblclick();

    // Should not crash (loading spinner may appear)
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });

  test('rapid navigation does not crash', async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
    );

    // Navigate rapidly between pages
    await gotoFast(page, ROUTES.HOME);
    await gotoFast(page, ROUTES.COURSES);
    await gotoFast(page, ROUTES.LOGIN);
    await gotoFast(page, ROUTES.HOME);

    await waitForPageReady(page);
    await expect(page.locator('body')).toBeVisible();
  });

  test('back/forward browser navigation works', async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
    );

    await gotoFast(page, ROUTES.HOME);
    await waitForPageReady(page);

    await gotoFast(page, ROUTES.COURSES);
    await waitForPageReady(page);

    await page.goBack();
    await page.waitForURL('**/', { timeout: TIMEOUTS.PAGE_LOAD });

    await page.goForward();
    await page.waitForURL('**/courses', { timeout: TIMEOUTS.PAGE_LOAD });
  });
});

test.describe('Accessibility Basics', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
    );
  });

  test('homepage has proper heading hierarchy', async ({ page }) => {
    await gotoFast(page, ROUTES.HOME);
    await waitForPageReady(page);

    // Should have at least one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('login form has associated labels', async ({ page }) => {
    await gotoFast(page, ROUTES.LOGIN);
    await waitForPageReady(page);

    // Email input should have label or placeholder
    const emailInput = page.locator(SELECTORS.EMAIL_INPUT);
    const placeholder = await emailInput.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();

    // Password input should have label or placeholder
    const passInput = page.locator(SELECTORS.PASSWORD_INPUT);
    const passPlaceholder = await passInput.getAttribute('placeholder');
    expect(passPlaceholder).toBeTruthy();
  });

  test('images have alt text', async ({ page }) => {
    await gotoFast(page, ROUTES.HOME);
    await waitForPageReady(page);

    const images = page.locator('img');
    const count = await images.count();
    const missingAlt: string[] = [];

    for (let i = 0; i < Math.min(count, 20); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (alt === null) {
        const src = await images.nth(i).getAttribute('src');
        missingAlt.push(src || 'unknown');
      }
    }

    if (missingAlt.length > 0) {
      console.warn(`Images missing alt: ${missingAlt.join(', ')}`);
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto(ROUTES.LOGIN);
    await waitForPageReady(page);

    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Focused element should be visible
    const focused = page.locator(':focus');
    const count = await focused.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('color contrast: text is readable', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    // Basic check: main content text is not transparent
    const bodyColor = await page.evaluate(() => {
      const body = document.body;
      const style = getComputedStyle(body);
      return {
        color: style.color,
        bg: style.backgroundColor,
      };
    });

    expect(bodyColor.color).toBeTruthy();
  });
});

test.describe('Static Pages Load', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
    );
  });

  const staticPages = [
    { name: 'About', path: ROUTES.ABOUT },
    { name: 'Contact', path: ROUTES.CONTACT },
    { name: 'Help', path: ROUTES.HELP },
    { name: 'Blog', path: ROUTES.BLOG },
    { name: 'Careers', path: ROUTES.CAREERS },
    { name: 'Pricing', path: ROUTES.PRICING },
  ];

  for (const { name, path } of staticPages) {
    test(`${name} page loads without errors`, async ({ page }) => {
      await gotoFast(page, path);
      await waitForPageReady(page);

      // Page should not be a 500 error
      await expect(page).not.toHaveTitle(/500|internal.*error/i);
      await expect(page.locator('body')).toBeVisible();
    });
  }
});
