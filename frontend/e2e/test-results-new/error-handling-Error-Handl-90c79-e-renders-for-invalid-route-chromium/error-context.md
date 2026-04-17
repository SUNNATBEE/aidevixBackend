# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: error-handling.spec.ts >> Error Handling — 404 Page >> 404 page renders for invalid route
- Location: e2e\error-handling.spec.ts:6:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/this-page-does-not-exist-xyz", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from './fixtures/test-fixtures';
  2   | import { ROUTES, SELECTORS, TIMEOUTS } from './helpers/constants';
  3   | import { waitForPageReady, collectConsoleErrors, assertNoBrokenLinks, assertAccessibleInteractives } from './helpers/test-utils';
  4   | 
  5   | test.describe('Error Handling — 404 Page', () => {
  6   |   test('404 page renders for invalid route', async ({ page }) => {
  7   |     await page.route('**/api/**', (route) =>
  8   |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  9   |     );
  10  | 
> 11  |     await page.goto('/this-page-does-not-exist-xyz');
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  12  |     await waitForPageReady(page);
  13  | 
  14  |     // Should show 404 content
  15  |     const has404 = await page.locator('text=/404|sahifa topilmadi|not found/i').first().isVisible().catch(() => false);
  16  |     expect(has404).toBeTruthy();
  17  |   });
  18  | 
  19  |   test('404 page has link back to home', async ({ page }) => {
  20  |     await page.route('**/api/**', (route) =>
  21  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  22  |     );
  23  | 
  24  |     await page.goto('/nonexistent-page');
  25  |     await waitForPageReady(page);
  26  | 
  27  |     const homeLink = page.locator('a[href="/"]').first();
  28  |     await expect(homeLink).toBeVisible();
  29  |   });
  30  | 
  31  |   test('404 page has link to courses', async ({ page }) => {
  32  |     await page.route('**/api/**', (route) =>
  33  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  34  |     );
  35  | 
  36  |     await page.goto('/nonexistent-page');
  37  |     await waitForPageReady(page);
  38  | 
  39  |     const coursesLink = page.locator('a[href="/courses"]').first();
  40  |     await expect(coursesLink).toBeVisible();
  41  |   });
  42  | 
  43  |   test('404 home link navigates correctly', async ({ page }) => {
  44  |     await page.route('**/api/**', (route) =>
  45  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  46  |     );
  47  | 
  48  |     await page.goto('/nonexistent-page');
  49  |     await waitForPageReady(page);
  50  | 
  51  |     await page.locator('a[href="/"]').first().click();
  52  |     await page.waitForURL('**/', { timeout: TIMEOUTS.PAGE_LOAD });
  53  |   });
  54  | });
  55  | 
  56  | test.describe('Error Handling — API Failures', () => {
  57  |   test('homepage handles API failure gracefully', async ({ page }) => {
  58  |     await page.route('**/api/**/courses/top*', (route) =>
  59  |       route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Server error' }) }),
  60  |     );
  61  |     await page.route('**/api/**/videos/top*', (route) =>
  62  |       route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Server error' }) }),
  63  |     );
  64  |     await page.route('**/api/**/auth/me*', (route) =>
  65  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  66  |     );
  67  |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  68  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  69  |     );
  70  | 
  71  |     await page.goto(ROUTES.HOME);
  72  |     await waitForPageReady(page);
  73  | 
  74  |     // Page should still render without crashing
  75  |     await expect(page).not.toHaveTitle(/500|error/i);
  76  | 
  77  |     // Navbar should still be visible
  78  |     const nav = page.locator(SELECTORS.NAVBAR).first();
  79  |     await expect(nav).toBeVisible();
  80  |   });
  81  | 
  82  |   test('courses page handles API failure', async ({ page }) => {
  83  |     await page.route('**/api/**/courses*', (route) =>
  84  |       route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
  85  |     );
  86  |     await page.route('**/api/**/auth/me*', (route) =>
  87  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  88  |     );
  89  |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  90  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  91  |     );
  92  | 
  93  |     await page.goto(ROUTES.COURSES);
  94  |     await waitForPageReady(page);
  95  | 
  96  |     // Should not crash
  97  |     await expect(page.locator('body')).toBeVisible();
  98  |   });
  99  | 
  100 |   test('network timeout shows appropriate feedback', async ({ page }) => {
  101 |     await page.route('**/api/**/courses*', (route) =>
  102 |       route.abort('timedout'),
  103 |     );
  104 |     await page.route('**/api/**/auth/me*', (route) =>
  105 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  106 |     );
  107 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  108 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  109 |     );
  110 | 
  111 |     await page.goto(ROUTES.COURSES);
```