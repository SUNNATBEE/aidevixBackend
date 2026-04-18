# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication — Login >> shows validation errors for empty fields
- Location: e2e\auth.spec.ts:43:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/login", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from './fixtures/test-fixtures';
  2   | import { ROUTES, SELECTORS, TEST_USER, TIMEOUTS } from './helpers/constants';
  3   | import { MOCK_AUTH_LOGIN_SUCCESS, MOCK_AUTH_LOGIN_FAIL, MOCK_AUTH_REGISTER_SUCCESS } from './fixtures/mock-data';
  4   | import { waitForPageReady, collectConsoleErrors } from './helpers/test-utils';
  5   | 
  6   | test.describe('Authentication — Login', () => {
  7   |   test.beforeEach(async ({ page }) => {
  8   |     // Mock login API
  9   |     await page.route('**/api/**/auth/login', async (route) => {
  10  |       const body = route.request().postDataJSON();
  11  |       if (body?.email === TEST_USER.email && body?.password === TEST_USER.password) {
  12  |         await route.fulfill({
  13  |           status: 200,
  14  |           contentType: 'application/json',
  15  |           body: JSON.stringify(MOCK_AUTH_LOGIN_SUCCESS),
  16  |         });
  17  |       } else {
  18  |         await route.fulfill({
  19  |           status: 401,
  20  |           contentType: 'application/json',
  21  |           body: JSON.stringify(MOCK_AUTH_LOGIN_FAIL),
  22  |         });
  23  |       }
  24  |     });
  25  |   });
  26  | 
  27  |   test('login page renders correctly', async ({ page }) => {
  28  |     await page.goto(ROUTES.LOGIN);
  29  |     await waitForPageReady(page);
  30  | 
  31  |     // Email & password fields present
  32  |     await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
  33  |     await expect(page.locator(SELECTORS.PASSWORD_INPUT)).toBeVisible();
  34  |     await expect(page.locator(SELECTORS.SUBMIT_BTN)).toBeVisible();
  35  | 
  36  |     // Register link present
  37  |     await expect(page.locator('a[href="/register"]')).toBeVisible();
  38  | 
  39  |     // Forgot password link present
  40  |     await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
  41  |   });
  42  | 
  43  |   test('shows validation errors for empty fields', async ({ page }) => {
> 44  |     await page.goto(ROUTES.LOGIN);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  45  |     await waitForPageReady(page);
  46  | 
  47  |     await page.locator(SELECTORS.SUBMIT_BTN).click();
  48  | 
  49  |     // Should show required field errors
  50  |     await expect(page.locator('text=majburiy').first()).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  51  |   });
  52  | 
  53  |   test('shows validation error for invalid email', async ({ page }) => {
  54  |     await page.goto(ROUTES.LOGIN);
  55  |     await waitForPageReady(page);
  56  | 
  57  |     await page.locator(SELECTORS.EMAIL_INPUT).fill('notanemail');
  58  |     await page.locator(SELECTORS.PASSWORD_INPUT).fill('123456');
  59  |     await page.locator(SELECTORS.SUBMIT_BTN).click();
  60  | 
  61  |     await expect(page.locator('text=/noto.*g.*ri.*email/i').first()).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  62  |   });
  63  | 
  64  |   test('shows error for short password', async ({ page }) => {
  65  |     await page.goto(ROUTES.LOGIN);
  66  |     await waitForPageReady(page);
  67  | 
  68  |     await page.locator(SELECTORS.EMAIL_INPUT).fill('test@test.com');
  69  |     await page.locator(SELECTORS.PASSWORD_INPUT).fill('123');
  70  |     await page.locator(SELECTORS.SUBMIT_BTN).click();
  71  | 
  72  |     await expect(page.locator('text=/6.*belgi/i').first()).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  73  |   });
  74  | 
  75  |   test('successful login redirects to home', async ({ page }) => {
  76  |     await page.route('**/api/**/auth/me*', (route) =>
  77  |       route.fulfill({
  78  |         status: 200,
  79  |         contentType: 'application/json',
  80  |         body: JSON.stringify({ success: true, data: { user: MOCK_AUTH_LOGIN_SUCCESS.data.user } }),
  81  |       }),
  82  |     );
  83  |     await page.route('**/api/**/xp/stats*', (route) =>
  84  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  85  |     );
  86  |     await page.route('**/api/**/subscriptions/status*', (route) =>
  87  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  88  |     );
  89  |     await page.route('**/api/**/courses/top*', (route) =>
  90  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { courses: [] } }) }),
  91  |     );
  92  |     await page.route('**/api/**/videos/top*', (route) =>
  93  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { videos: [] } }) }),
  94  |     );
  95  | 
  96  |     await page.goto(ROUTES.LOGIN);
  97  |     await waitForPageReady(page);
  98  | 
  99  |     await page.locator(SELECTORS.EMAIL_INPUT).fill(TEST_USER.email);
  100 |     await page.locator(SELECTORS.PASSWORD_INPUT).fill(TEST_USER.password);
  101 |     await page.locator(SELECTORS.SUBMIT_BTN).click();
  102 | 
  103 |     // Should redirect to home after successful login
  104 |     await page.waitForURL('**/', { timeout: TIMEOUTS.PAGE_LOAD });
  105 |   });
  106 | 
  107 |   test('failed login shows error message', async ({ page }) => {
  108 |     await page.goto(ROUTES.LOGIN);
  109 |     await waitForPageReady(page);
  110 | 
  111 |     await page.locator(SELECTORS.EMAIL_INPUT).fill('wrong@email.com');
  112 |     await page.locator(SELECTORS.PASSWORD_INPUT).fill('wrongpass123');
  113 |     await page.locator(SELECTORS.SUBMIT_BTN).click();
  114 | 
  115 |     // Error alert should appear
  116 |     await expect(page.locator('.alert-error, .text-red-500, [class*="error"]').first())
  117 |       .toBeVisible({ timeout: TIMEOUTS.API_RESPONSE });
  118 |   });
  119 | 
  120 |   test('password toggle shows/hides password', async ({ page }) => {
  121 |     await page.goto(ROUTES.LOGIN);
  122 |     await waitForPageReady(page);
  123 | 
  124 |     const passInput = page.locator(SELECTORS.PASSWORD_INPUT);
  125 |     await passInput.fill('testpassword');
  126 | 
  127 |     // Initially type=password
  128 |     await expect(passInput).toHaveAttribute('type', 'password');
  129 | 
  130 |     // Click eye icon to reveal
  131 |     const toggleBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
  132 |     await toggleBtn.click();
  133 |     await expect(passInput).toHaveAttribute('type', 'text');
  134 | 
  135 |     // Click again to hide
  136 |     await toggleBtn.click();
  137 |     await expect(passInput).toHaveAttribute('type', 'password');
  138 |   });
  139 | 
  140 |   test('navigate to register from login', async ({ page }) => {
  141 |     await page.goto(ROUTES.LOGIN);
  142 |     await waitForPageReady(page);
  143 | 
  144 |     await page.locator('a[href="/register"]').click();
```