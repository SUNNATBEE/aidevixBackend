# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication — Login >> theme toggle works on login page
- Location: e2e\auth.spec.ts:156:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/login", waiting until "load"

```

# Test source

```ts
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
  145 |     await page.waitForURL('**/register', { timeout: TIMEOUTS.PAGE_LOAD });
  146 |   });
  147 | 
  148 |   test('navigate to forgot password from login', async ({ page }) => {
  149 |     await page.goto(ROUTES.LOGIN);
  150 |     await waitForPageReady(page);
  151 | 
  152 |     await page.locator('a[href="/forgot-password"]').click();
  153 |     await page.waitForURL('**/forgot-password', { timeout: TIMEOUTS.PAGE_LOAD });
  154 |   });
  155 | 
  156 |   test('theme toggle works on login page', async ({ page }) => {
> 157 |     await page.goto(ROUTES.LOGIN);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  158 |     await waitForPageReady(page);
  159 | 
  160 |     // Find theme toggle button (☀ or ☾)
  161 |     const themeBtn = page.locator('button').filter({ hasText: /☀|☾/ }).first();
  162 |     if (await themeBtn.isVisible()) {
  163 |       await themeBtn.click();
  164 |       // Page should still be functional
  165 |       await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
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
```