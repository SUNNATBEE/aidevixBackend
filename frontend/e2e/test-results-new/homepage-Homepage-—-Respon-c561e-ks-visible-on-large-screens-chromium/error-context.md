# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> Homepage — Responsive >> desktop: nav links visible on large screens
- Location: e2e\homepage.spec.ts:251:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

```

# Page snapshot

```yaml
- main [ref=e2]
```

# Test source

```ts
  153 |     const footer = page.locator(SELECTORS.FOOTER).first();
  154 |     await expect(footer).toBeVisible();
  155 |   });
  156 | 
  157 |   test('footer contains social links', async ({ page }) => {
  158 |     await page.goto(ROUTES.HOME);
  159 |     await waitForPageReady(page);
  160 | 
  161 |     // Footer should have telegram and instagram links
  162 |     const telegramLink = page.locator('a[href*="t.me"]').first();
  163 |     const instagramLink = page.locator('a[href*="instagram"]').first();
  164 | 
  165 |     const hasTelegram = await telegramLink.count() > 0;
  166 |     const hasInstagram = await instagramLink.count() > 0;
  167 | 
  168 |     expect(hasTelegram || hasInstagram).toBeTruthy();
  169 |   });
  170 | });
  171 | 
  172 | test.describe('Homepage — Content', () => {
  173 |   test.beforeEach(async ({ page }) => {
  174 |     await page.route('**/api/**/courses/top*', (route) =>
  175 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) }),
  176 |     );
  177 |     await page.route('**/api/**/videos/top*', (route) =>
  178 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) }),
  179 |     );
  180 |     await page.route('**/api/**/auth/me*', (route) =>
  181 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  182 |     );
  183 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  184 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  185 |     );
  186 |   });
  187 | 
  188 |   test('displays hero section', async ({ page }) => {
  189 |     await page.goto(ROUTES.HOME);
  190 |     await waitForPageReady(page);
  191 | 
  192 |     // Hero should have heading with Aidevix or relevant text
  193 |     const heading = page.locator('h1, h2').first();
  194 |     await expect(heading).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  195 |   });
  196 | 
  197 |   test('displays course cards', async ({ page }) => {
  198 |     await page.goto(ROUTES.HOME);
  199 |     await waitForPageReady(page);
  200 | 
  201 |     // Wait for content to load
  202 |     await page.waitForTimeout(2000);
  203 | 
  204 |     // Should show course-related content
  205 |     const courseSection = page.locator('text=/kurs/i').first();
  206 |     if (await courseSection.isVisible()) {
  207 |       expect(true).toBeTruthy();
  208 |     }
  209 |   });
  210 | 
  211 |   test('CTA buttons are clickable', async ({ page }) => {
  212 |     await page.goto(ROUTES.HOME);
  213 |     await waitForPageReady(page);
  214 | 
  215 |     // Find primary CTA buttons
  216 |     const ctaButtons = page.locator('a.btn, button.btn').filter({ hasText: /boshlash|kurslar|ro.*yxat/i });
  217 |     const count = await ctaButtons.count();
  218 | 
  219 |     if (count > 0) {
  220 |       // First CTA should be clickable
  221 |       await expect(ctaButtons.first()).toBeEnabled();
  222 |     }
  223 |   });
  224 | });
  225 | 
  226 | test.describe('Homepage — Responsive', () => {
  227 |   test.beforeEach(async ({ page }) => {
  228 |     await page.route('**/api/**', (route) => {
  229 |       const url = route.request().url();
  230 |       if (url.includes('courses/top')) {
  231 |         return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) });
  232 |       }
  233 |       if (url.includes('videos/top')) {
  234 |         return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) });
  235 |       }
  236 |       return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) });
  237 |     });
  238 |   });
  239 | 
  240 |   test('mobile: hamburger menu appears on small screens', async ({ page }) => {
  241 |     await page.setViewportSize({ width: 375, height: 812 });
  242 |     await page.goto(ROUTES.HOME);
  243 |     await waitForPageReady(page);
  244 | 
  245 |     // Should see hamburger menu button on mobile
  246 |     const menuBtns = page.locator('button').filter({ has: page.locator('svg') });
  247 |     const count = await menuBtns.count();
  248 |     expect(count).toBeGreaterThan(0);
  249 |   });
  250 | 
  251 |   test('desktop: nav links visible on large screens', async ({ page }) => {
  252 |     await page.setViewportSize({ width: 1440, height: 900 });
> 253 |     await page.goto(ROUTES.HOME);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  254 |     await waitForPageReady(page);
  255 | 
  256 |     const nav = page.locator(SELECTORS.NAVBAR).first();
  257 |     await expect(nav).toBeVisible();
  258 |   });
  259 | });
  260 | 
  261 | test.describe('Homepage — Performance', () => {
  262 |   test('page loads within performance budget', async ({ page }) => {
  263 |     await page.route('**/api/**', (route) =>
  264 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  265 |     );
  266 | 
  267 |     await page.goto(ROUTES.HOME);
  268 |     await waitForPageReady(page);
  269 | 
  270 |     const timing = await assertPerformanceBudget(page, 8000); // 8s budget for dev
  271 |     expect(timing.firstByte).toBeLessThan(3000);
  272 |   });
  273 | 
  274 |   test('no critical console errors', async ({ page }) => {
  275 |     const errors = collectConsoleErrors(page);
  276 | 
  277 |     await page.route('**/api/**', (route) =>
  278 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  279 |     );
  280 | 
  281 |     await page.goto(ROUTES.HOME);
  282 |     await waitForPageReady(page);
  283 | 
  284 |     // Filter out expected dev-mode warnings
  285 |     const criticalErrors = errors.filter(
  286 |       (e) => !e.includes('favicon') && !e.includes('DevTools') && !e.includes('hydration'),
  287 |     );
  288 | 
  289 |     if (criticalErrors.length > 0) {
  290 |       console.warn('Console errors:', criticalErrors);
  291 |     }
  292 |   });
  293 | });
  294 | 
```