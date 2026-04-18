# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance-seo.spec.ts >> Performance Audit >> homepage: DOM content loaded under 5s
- Location: e2e\performance-seo.spec.ts:12:7

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
  1   | import { test, expect } from './fixtures/test-fixtures';
  2   | import { ROUTES, TIMEOUTS } from './helpers/constants';
  3   | import { waitForPageReady, assertSEOMeta, assertPerformanceBudget, assertNoBrokenImages } from './helpers/test-utils';
  4   | 
  5   | test.describe('Performance Audit', () => {
  6   |   test.beforeEach(async ({ page }) => {
  7   |     await page.route('**/api/**', (route) =>
  8   |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  9   |     );
  10  |   });
  11  | 
  12  |   test('homepage: DOM content loaded under 5s', async ({ page }) => {
> 13  |     await page.goto(ROUTES.HOME);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  14  |     await waitForPageReady(page);
  15  | 
  16  |     const timing = await assertPerformanceBudget(page, 5000);
  17  |     console.log(`Homepage timing — TTFB: ${timing.firstByte}ms, DCL: ${timing.domContentLoaded}ms, Load: ${timing.load}ms`);
  18  |   });
  19  | 
  20  |   test('courses page: DOM content loaded under 5s', async ({ page }) => {
  21  |     await page.goto(ROUTES.COURSES);
  22  |     await waitForPageReady(page);
  23  | 
  24  |     const timing = await assertPerformanceBudget(page, 5000);
  25  |     console.log(`Courses timing — TTFB: ${timing.firstByte}ms, DCL: ${timing.domContentLoaded}ms, Load: ${timing.load}ms`);
  26  |   });
  27  | 
  28  |   test('login page: DOM content loaded under 3s', async ({ page }) => {
  29  |     await page.goto(ROUTES.LOGIN);
  30  |     await waitForPageReady(page);
  31  | 
  32  |     const timing = await assertPerformanceBudget(page, 3000);
  33  |     console.log(`Login timing — TTFB: ${timing.firstByte}ms, DCL: ${timing.domContentLoaded}ms, Load: ${timing.load}ms`);
  34  |   });
  35  | 
  36  |   test('no excessive DOM nodes on homepage', async ({ page }) => {
  37  |     await page.goto(ROUTES.HOME);
  38  |     await waitForPageReady(page);
  39  | 
  40  |     const nodeCount = await page.evaluate(() => document.querySelectorAll('*').length);
  41  |     console.log(`Homepage DOM nodes: ${nodeCount}`);
  42  | 
  43  |     // Best practice: < 1500 DOM nodes, warning at 800+
  44  |     expect(nodeCount).toBeLessThan(5000); // Generous for dev
  45  |   });
  46  | 
  47  |   test('no excessive DOM nodes on courses page', async ({ page }) => {
  48  |     await page.goto(ROUTES.COURSES);
  49  |     await waitForPageReady(page);
  50  | 
  51  |     const nodeCount = await page.evaluate(() => document.querySelectorAll('*').length);
  52  |     console.log(`Courses page DOM nodes: ${nodeCount}`);
  53  |     expect(nodeCount).toBeLessThan(5000);
  54  |   });
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
```