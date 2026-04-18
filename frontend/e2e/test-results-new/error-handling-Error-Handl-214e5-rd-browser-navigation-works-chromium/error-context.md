# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: error-handling.spec.ts >> Error Handling — Edge Cases >> back/forward browser navigation works
- Location: e2e\error-handling.spec.ts:166:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

```

# Test source

```ts
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
  112 |     await page.waitForTimeout(5000);
  113 | 
  114 |     // Page should still be functional
  115 |     await expect(page.locator('body')).toBeVisible();
  116 |   });
  117 | });
  118 | 
  119 | test.describe('Error Handling — Edge Cases', () => {
  120 |   test('double-clicking submit does not cause issues', async ({ page }) => {
  121 |     await page.route('**/api/**/auth/login', async (route) => {
  122 |       // Slow response
  123 |       await new Promise((r) => setTimeout(r, 1000));
  124 |       await route.fulfill({
  125 |         status: 200,
  126 |         contentType: 'application/json',
  127 |         body: JSON.stringify({ success: true, data: { user: {}, accessToken: 'tok' } }),
  128 |       });
  129 |     });
  130 |     await page.route('**/api/**/auth/me*', (route) =>
  131 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  132 |     );
  133 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  134 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  135 |     );
  136 | 
  137 |     await page.goto(ROUTES.LOGIN);
  138 |     await waitForPageReady(page);
  139 | 
  140 |     await page.locator(SELECTORS.EMAIL_INPUT).fill('test@test.com');
  141 |     await page.locator(SELECTORS.PASSWORD_INPUT).fill('password123');
  142 | 
  143 |     // Double-click submit
  144 |     await page.locator(SELECTORS.SUBMIT_BTN).dblclick();
  145 | 
  146 |     // Should not crash (loading spinner may appear)
  147 |     await page.waitForTimeout(2000);
  148 |     await expect(page.locator('body')).toBeVisible();
  149 |   });
  150 | 
  151 |   test('rapid navigation does not crash', async ({ page }) => {
  152 |     await page.route('**/api/**', (route) =>
  153 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  154 |     );
  155 | 
  156 |     // Navigate rapidly between pages
  157 |     await page.goto(ROUTES.HOME);
  158 |     await page.goto(ROUTES.COURSES);
  159 |     await page.goto(ROUTES.LOGIN);
  160 |     await page.goto(ROUTES.HOME);
  161 | 
  162 |     await waitForPageReady(page);
  163 |     await expect(page.locator('body')).toBeVisible();
  164 |   });
  165 | 
  166 |   test('back/forward browser navigation works', async ({ page }) => {
  167 |     await page.route('**/api/**', (route) =>
  168 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  169 |     );
  170 | 
> 171 |     await page.goto(ROUTES.HOME);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  172 |     await waitForPageReady(page);
  173 | 
  174 |     await page.goto(ROUTES.COURSES);
  175 |     await waitForPageReady(page);
  176 | 
  177 |     await page.goBack();
  178 |     await page.waitForURL('**/', { timeout: TIMEOUTS.PAGE_LOAD });
  179 | 
  180 |     await page.goForward();
  181 |     await page.waitForURL('**/courses', { timeout: TIMEOUTS.PAGE_LOAD });
  182 |   });
  183 | });
  184 | 
  185 | test.describe('Accessibility Basics', () => {
  186 |   test.beforeEach(async ({ page }) => {
  187 |     await page.route('**/api/**', (route) =>
  188 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  189 |     );
  190 |   });
  191 | 
  192 |   test('homepage has proper heading hierarchy', async ({ page }) => {
  193 |     await page.goto(ROUTES.HOME);
  194 |     await waitForPageReady(page);
  195 | 
  196 |     // Should have at least one h1
  197 |     const h1Count = await page.locator('h1').count();
  198 |     expect(h1Count).toBeGreaterThanOrEqual(1);
  199 |   });
  200 | 
  201 |   test('login form has associated labels', async ({ page }) => {
  202 |     await page.goto(ROUTES.LOGIN);
  203 |     await waitForPageReady(page);
  204 | 
  205 |     // Email input should have label or placeholder
  206 |     const emailInput = page.locator(SELECTORS.EMAIL_INPUT);
  207 |     const placeholder = await emailInput.getAttribute('placeholder');
  208 |     expect(placeholder).toBeTruthy();
  209 | 
  210 |     // Password input should have label or placeholder
  211 |     const passInput = page.locator(SELECTORS.PASSWORD_INPUT);
  212 |     const passPlaceholder = await passInput.getAttribute('placeholder');
  213 |     expect(passPlaceholder).toBeTruthy();
  214 |   });
  215 | 
  216 |   test('images have alt text', async ({ page }) => {
  217 |     await page.goto(ROUTES.HOME);
  218 |     await waitForPageReady(page);
  219 | 
  220 |     const images = page.locator('img');
  221 |     const count = await images.count();
  222 |     const missingAlt: string[] = [];
  223 | 
  224 |     for (let i = 0; i < Math.min(count, 20); i++) {
  225 |       const alt = await images.nth(i).getAttribute('alt');
  226 |       if (alt === null) {
  227 |         const src = await images.nth(i).getAttribute('src');
  228 |         missingAlt.push(src || 'unknown');
  229 |       }
  230 |     }
  231 | 
  232 |     if (missingAlt.length > 0) {
  233 |       console.warn(`Images missing alt: ${missingAlt.join(', ')}`);
  234 |     }
  235 |   });
  236 | 
  237 |   test('interactive elements are keyboard accessible', async ({ page }) => {
  238 |     await page.goto(ROUTES.LOGIN);
  239 |     await waitForPageReady(page);
  240 | 
  241 |     // Tab through form elements
  242 |     await page.keyboard.press('Tab');
  243 |     await page.keyboard.press('Tab');
  244 |     await page.keyboard.press('Tab');
  245 | 
  246 |     // Focused element should be visible
  247 |     const focused = page.locator(':focus');
  248 |     const count = await focused.count();
  249 |     expect(count).toBeGreaterThanOrEqual(0);
  250 |   });
  251 | 
  252 |   test('color contrast: text is readable', async ({ page }) => {
  253 |     await page.goto(ROUTES.HOME);
  254 |     await waitForPageReady(page);
  255 | 
  256 |     // Basic check: main content text is not transparent
  257 |     const bodyColor = await page.evaluate(() => {
  258 |       const body = document.body;
  259 |       const style = getComputedStyle(body);
  260 |       return {
  261 |         color: style.color,
  262 |         bg: style.backgroundColor,
  263 |       };
  264 |     });
  265 | 
  266 |     expect(bodyColor.color).toBeTruthy();
  267 |   });
  268 | });
  269 | 
  270 | test.describe('Static Pages Load', () => {
  271 |   test.beforeEach(async ({ page }) => {
```