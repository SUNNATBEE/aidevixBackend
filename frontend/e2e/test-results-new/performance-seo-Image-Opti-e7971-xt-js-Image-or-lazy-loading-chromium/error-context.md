# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance-seo.spec.ts >> Image Optimization >> images use Next.js Image or lazy loading
- Location: e2e\performance-seo.spec.ts:292:7

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
  193 |     for (const [name, path] of Object.entries({
  194 |       home: ROUTES.HOME,
  195 |       login: ROUTES.LOGIN,
  196 |     })) {
  197 |       await page.goto(path);
  198 |       descriptions[name] = await page.locator('meta[name="description"]').getAttribute('content').catch(() => null);
  199 |     }
  200 | 
  201 |     console.log('Meta descriptions:', descriptions);
  202 |   });
  203 | 
  204 |   test('heading hierarchy on key pages', async ({ page }) => {
  205 |     for (const path of [ROUTES.HOME, ROUTES.COURSES, ROUTES.LOGIN]) {
  206 |       await page.goto(path);
  207 |       await waitForPageReady(page);
  208 | 
  209 |       const h1Count = await page.locator('h1').count();
  210 |       if (h1Count === 0) {
  211 |         console.warn(`No h1 on ${path}`);
  212 |       }
  213 |       if (h1Count > 2) {
  214 |         console.warn(`Multiple h1 tags (${h1Count}) on ${path}`);
  215 |       }
  216 |     }
  217 |   });
  218 | 
  219 |   test('images have alt attributes', async ({ page }) => {
  220 |     await page.goto(ROUTES.HOME);
  221 |     await waitForPageReady(page);
  222 | 
  223 |     const images = page.locator('img');
  224 |     const count = await images.count();
  225 |     let missingAlt = 0;
  226 | 
  227 |     for (let i = 0; i < count; i++) {
  228 |       const alt = await images.nth(i).getAttribute('alt');
  229 |       if (alt === null) missingAlt++;
  230 |     }
  231 | 
  232 |     if (missingAlt > 0) {
  233 |       console.warn(`${missingAlt}/${count} images missing alt attribute on homepage`);
  234 |     }
  235 |   });
  236 | 
  237 |   test('links have descriptive text', async ({ page }) => {
  238 |     await page.goto(ROUTES.HOME);
  239 |     await waitForPageReady(page);
  240 | 
  241 |     const links = page.locator('a:visible');
  242 |     const count = await links.count();
  243 |     const badLinks: string[] = [];
  244 | 
  245 |     for (let i = 0; i < Math.min(count, 30); i++) {
  246 |       const text = (await links.nth(i).textContent())?.trim();
  247 |       const ariaLabel = await links.nth(i).getAttribute('aria-label');
  248 |       const href = await links.nth(i).getAttribute('href');
  249 | 
  250 |       if (!text && !ariaLabel && href !== '/') {
  251 |         badLinks.push(href || 'unknown');
  252 |       }
  253 |     }
  254 | 
  255 |     if (badLinks.length > 0) {
  256 |       console.warn('Links without descriptive text:', badLinks);
  257 |     }
  258 |   });
  259 | });
  260 | 
  261 | test.describe('Security Headers Check', () => {
  262 |   test('response headers include security headers', async ({ page }) => {
  263 |     const response = await page.goto(ROUTES.HOME);
  264 | 
  265 |     if (response) {
  266 |       const headers = response.headers();
  267 |       console.log('Security headers present:');
  268 | 
  269 |       // Check common security headers (may not be set in dev)
  270 |       const securityHeaders = [
  271 |         'x-frame-options',
  272 |         'x-content-type-options',
  273 |         'strict-transport-security',
  274 |         'content-security-policy',
  275 |         'referrer-policy',
  276 |       ];
  277 | 
  278 |       for (const header of securityHeaders) {
  279 |         const value = headers[header];
  280 |         console.log(`  ${header}: ${value || 'NOT SET'}`);
  281 |       }
  282 | 
  283 |       // X-Content-Type-Options should ideally be "nosniff"
  284 |       if (headers['x-content-type-options']) {
  285 |         expect(headers['x-content-type-options']).toBe('nosniff');
  286 |       }
  287 |     }
  288 |   });
  289 | });
  290 | 
  291 | test.describe('Image Optimization', () => {
  292 |   test('images use Next.js Image or lazy loading', async ({ page }) => {
> 293 |     await page.goto(ROUTES.HOME);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  294 |     await waitForPageReady(page);
  295 | 
  296 |     const images = page.locator('img');
  297 |     const count = await images.count();
  298 |     let lazyCount = 0;
  299 |     let eagerCount = 0;
  300 | 
  301 |     for (let i = 0; i < count; i++) {
  302 |       const loading = await images.nth(i).getAttribute('loading');
  303 |       if (loading === 'lazy') lazyCount++;
  304 |       else eagerCount++;
  305 |     }
  306 | 
  307 |     console.log(`Images: ${count} total, ${lazyCount} lazy, ${eagerCount} eager`);
  308 |   });
  309 | 
  310 |   test('no broken images on homepage', async ({ page }) => {
  311 |     await page.goto(ROUTES.HOME);
  312 |     await waitForPageReady(page);
  313 |     await page.waitForTimeout(3000);
  314 | 
  315 |     await assertNoBrokenImages(page);
  316 |   });
  317 | });
  318 | 
```