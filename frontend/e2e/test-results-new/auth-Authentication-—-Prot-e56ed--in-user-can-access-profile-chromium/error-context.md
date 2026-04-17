# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication — Protected Routes >> logged-in user can access profile
- Location: e2e\auth.spec.ts:258:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/profile", waiting until "load"

```

# Test source

```ts
  166 |     }
  167 |   });
  168 | 
  169 |   test('language switcher works on login page', async ({ page }) => {
  170 |     await page.goto(ROUTES.LOGIN);
  171 |     await waitForPageReady(page);
  172 | 
  173 |     // Switch to Russian
  174 |     const ruBtn = page.locator('button').filter({ hasText: 'RU' }).first();
  175 |     if (await ruBtn.isVisible()) {
  176 |       await ruBtn.click();
  177 |       // Wait for re-render
  178 |       await page.waitForTimeout(500);
  179 |       // Page should still function
  180 |       await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
  181 |     }
  182 |   });
  183 | });
  184 | 
  185 | test.describe('Authentication — Register', () => {
  186 |   test.beforeEach(async ({ page }) => {
  187 |     await page.route('**/api/**/auth/register', async (route) => {
  188 |       await route.fulfill({
  189 |         status: 201,
  190 |         contentType: 'application/json',
  191 |         body: JSON.stringify(MOCK_AUTH_REGISTER_SUCCESS),
  192 |       });
  193 |     });
  194 |   });
  195 | 
  196 |   test('register page renders correctly', async ({ page }) => {
  197 |     await page.goto(ROUTES.REGISTER);
  198 |     await waitForPageReady(page);
  199 | 
  200 |     // Should have registration form elements
  201 |     await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
  202 |     await expect(page.locator(SELECTORS.PASSWORD_INPUT).first()).toBeVisible();
  203 | 
  204 |     // Should have login link
  205 |     await expect(page.locator('a[href="/login"]')).toBeVisible();
  206 |   });
  207 | 
  208 |   test('register form shows validation for empty fields', async ({ page }) => {
  209 |     await page.goto(ROUTES.REGISTER);
  210 |     await waitForPageReady(page);
  211 | 
  212 |     await page.locator(SELECTORS.SUBMIT_BTN).click();
  213 | 
  214 |     // Should show validation errors
  215 |     await expect(page.locator('text=/majburiy/i').first()).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  216 |   });
  217 | 
  218 |   test('navigate to login from register', async ({ page }) => {
  219 |     await page.goto(ROUTES.REGISTER);
  220 |     await waitForPageReady(page);
  221 | 
  222 |     await page.locator('a[href="/login"]').click();
  223 |     await page.waitForURL('**/login', { timeout: TIMEOUTS.PAGE_LOAD });
  224 |   });
  225 | });
  226 | 
  227 | test.describe('Authentication — Forgot Password', () => {
  228 |   test('forgot password page renders', async ({ page }) => {
  229 |     await page.goto(ROUTES.FORGOT_PASSWORD);
  230 |     await waitForPageReady(page);
  231 | 
  232 |     // Should have email input
  233 |     await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
  234 |   });
  235 | });
  236 | 
  237 | test.describe('Authentication — Protected Routes', () => {
  238 |   test('profile page redirects unauthenticated user', async ({ page }) => {
  239 |     // Mock auth/me to return 401
  240 |     await page.route('**/api/**/auth/me*', (route) =>
  241 |       route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
  242 |     );
  243 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  244 |       route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
  245 |     );
  246 | 
  247 |     await page.goto(ROUTES.PROFILE);
  248 | 
  249 |     // Should either redirect to login or show login prompt
  250 |     await page.waitForTimeout(3000);
  251 |     const url = page.url();
  252 |     const hasLoginPrompt = await page.locator('a[href="/login"]').isVisible().catch(() => false);
  253 |     const redirectedToLogin = url.includes('/login');
  254 | 
  255 |     expect(redirectedToLogin || hasLoginPrompt).toBeTruthy();
  256 |   });
  257 | 
  258 |   test('logged-in user can access profile', async ({ loggedInPage }) => {
  259 |     await loggedInPage.route('**/api/**/courses/top*', (route) =>
  260 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { courses: [] } }) }),
  261 |     );
  262 |     await loggedInPage.route('**/api/**/videos/top*', (route) =>
  263 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { videos: [] } }) }),
  264 |     );
  265 | 
> 266 |     await loggedInPage.goto(ROUTES.PROFILE);
      |                        ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  267 |     await waitForPageReady(loggedInPage);
  268 | 
  269 |     // Should see profile content (not redirected)
  270 |     const url = loggedInPage.url();
  271 |     expect(url).toContain('/profile');
  272 |   });
  273 | });
  274 | 
```