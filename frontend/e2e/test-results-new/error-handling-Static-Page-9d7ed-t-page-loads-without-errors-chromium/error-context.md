# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: error-handling.spec.ts >> Static Pages Load >> About page loads without errors
- Location: e2e\error-handling.spec.ts:287:9

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/about", waiting until "load"

```

# Page snapshot

```yaml
- main [ref=e2]:
  - generic [ref=e4]:
    - heading "Biz haqimizda" [level=1] [ref=e5]
    - paragraph [ref=e6]: Aidevix platformasi va jamoamiz haqida to'liq ma'lumot yaqin orada e'lon qilinadi.
```

# Test source

```ts
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
  272 |     await page.route('**/api/**', (route) =>
  273 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  274 |     );
  275 |   });
  276 | 
  277 |   const staticPages = [
  278 |     { name: 'About', path: ROUTES.ABOUT },
  279 |     { name: 'Contact', path: ROUTES.CONTACT },
  280 |     { name: 'Help', path: ROUTES.HELP },
  281 |     { name: 'Blog', path: ROUTES.BLOG },
  282 |     { name: 'Careers', path: ROUTES.CAREERS },
  283 |     { name: 'Pricing', path: ROUTES.PRICING },
  284 |   ];
  285 | 
  286 |   for (const { name, path } of staticPages) {
  287 |     test(`${name} page loads without errors`, async ({ page }) => {
> 288 |       await page.goto(path);
      |                  ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  289 |       await waitForPageReady(page);
  290 | 
  291 |       // Page should not be a 500 error
  292 |       await expect(page).not.toHaveTitle(/500|internal.*error/i);
  293 |       await expect(page.locator('body')).toBeVisible();
  294 |     });
  295 |   }
  296 | });
  297 | 
```