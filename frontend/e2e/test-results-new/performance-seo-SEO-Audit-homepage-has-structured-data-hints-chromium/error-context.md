# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance-seo.spec.ts >> SEO Audit >> homepage has structured data hints
- Location: e2e\performance-seo.spec.ts:154:7

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
  55  | 
  56  |   test('JavaScript bundle size check', async ({ page }) => {
  57  |     const jsSizes: { url: string; size: number }[] = [];
  58  | 
  59  |     page.on('response', async (response) => {
  60  |       const url = response.url();
  61  |       if (url.endsWith('.js') || url.includes('.js?')) {
  62  |         const headers = response.headers();
  63  |         const size = parseInt(headers['content-length'] || '0', 10);
  64  |         if (size > 0) {
  65  |           jsSizes.push({ url: url.split('/').pop() || url, size });
  66  |         }
  67  |       }
  68  |     });
  69  | 
  70  |     await page.goto(ROUTES.HOME);
  71  |     await waitForPageReady(page);
  72  | 
  73  |     const totalJS = jsSizes.reduce((sum, { size }) => sum + size, 0);
  74  |     console.log(`Total JS transferred: ${(totalJS / 1024).toFixed(1)} KB`);
  75  |     console.log(`JS bundles: ${jsSizes.length}`);
  76  | 
  77  |     // Log large bundles
  78  |     const largeBundles = jsSizes.filter(({ size }) => size > 200_000);
  79  |     if (largeBundles.length > 0) {
  80  |       console.warn('Large JS bundles (>200KB):', largeBundles.map(({ url, size }) => `${url}: ${(size / 1024).toFixed(1)}KB`));
  81  |     }
  82  |   });
  83  | 
  84  |   test('CSS is not excessively large', async ({ page }) => {
  85  |     const cssSizes: number[] = [];
  86  | 
  87  |     page.on('response', async (response) => {
  88  |       const url = response.url();
  89  |       if (url.endsWith('.css') || url.includes('.css?')) {
  90  |         const headers = response.headers();
  91  |         const size = parseInt(headers['content-length'] || '0', 10);
  92  |         if (size > 0) cssSizes.push(size);
  93  |       }
  94  |     });
  95  | 
  96  |     await page.goto(ROUTES.HOME);
  97  |     await waitForPageReady(page);
  98  | 
  99  |     const totalCSS = cssSizes.reduce((sum, s) => sum + s, 0);
  100 |     console.log(`Total CSS transferred: ${(totalCSS / 1024).toFixed(1)} KB`);
  101 |   });
  102 | 
  103 |   test('no memory leaks on navigation', async ({ page }) => {
  104 |     await page.goto(ROUTES.HOME);
  105 |     await waitForPageReady(page);
  106 | 
  107 |     const initialMemory = await page.evaluate(() => {
  108 |       if ('memory' in performance) {
  109 |         return (performance as any).memory.usedJSHeapSize;
  110 |       }
  111 |       return 0;
  112 |     });
  113 | 
  114 |     // Navigate through pages
  115 |     for (const route of [ROUTES.COURSES, ROUTES.LOGIN, ROUTES.HOME, ROUTES.COURSES]) {
  116 |       await page.goto(route);
  117 |       await waitForPageReady(page);
  118 |     }
  119 | 
  120 |     const finalMemory = await page.evaluate(() => {
  121 |       if ('memory' in performance) {
  122 |         return (performance as any).memory.usedJSHeapSize;
  123 |       }
  124 |       return 0;
  125 |     });
  126 | 
  127 |     if (initialMemory > 0 && finalMemory > 0) {
  128 |       const growth = ((finalMemory - initialMemory) / initialMemory) * 100;
  129 |       console.log(`Memory growth after navigation: ${growth.toFixed(1)}%`);
  130 |       // Allow some growth, but flag excessive (>200%)
  131 |       expect(growth).toBeLessThan(200);
  132 |     }
  133 |   });
  134 | });
  135 | 
  136 | test.describe('SEO Audit', () => {
  137 |   test.beforeEach(async ({ page }) => {
  138 |     await page.route('**/api/**', (route) =>
  139 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  140 |     );
  141 |   });
  142 | 
  143 |   test('homepage has all required meta tags', async ({ page }) => {
  144 |     await page.goto(ROUTES.HOME);
  145 | 
  146 |     await assertSEOMeta(page, {
  147 |       title: /Aidevix/i,
  148 |       description: /dasturlash|platforma/i,
  149 |       ogTitle: /Aidevix/i,
  150 |       canonical: 'aidevix.uz',
  151 |     });
  152 |   });
  153 | 
  154 |   test('homepage has structured data hints', async ({ page }) => {
> 155 |     await page.goto(ROUTES.HOME);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  156 | 
  157 |     // Check for charset
  158 |     const charset = await page.locator('meta[charset]').getAttribute('charset');
  159 |     expect(charset?.toLowerCase()).toBe('utf-8');
  160 |   });
  161 | 
  162 |   test('html lang attribute is set', async ({ page }) => {
  163 |     await page.goto(ROUTES.HOME);
  164 | 
  165 |     const lang = await page.locator('html').getAttribute('lang');
  166 |     expect(lang).toBe('uz');
  167 |   });
  168 | 
  169 |   test('all pages have unique titles', async ({ page }) => {
  170 |     const titles: Record<string, string> = {};
  171 | 
  172 |     for (const [name, path] of Object.entries({
  173 |       home: ROUTES.HOME,
  174 |       courses: ROUTES.COURSES,
  175 |       login: ROUTES.LOGIN,
  176 |       register: ROUTES.REGISTER,
  177 |     })) {
  178 |       await page.goto(path);
  179 |       await waitForPageReady(page);
  180 |       titles[name] = await page.title();
  181 |     }
  182 | 
  183 |     // Titles should not all be identical
  184 |     const uniqueTitles = new Set(Object.values(titles));
  185 |     console.log('Page titles:', titles);
  186 |     // At minimum, homepage should have a title
  187 |     expect(titles.home).toBeTruthy();
  188 |   });
  189 | 
  190 |   test('no duplicate meta descriptions', async ({ page }) => {
  191 |     const descriptions: Record<string, string | null> = {};
  192 | 
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
```