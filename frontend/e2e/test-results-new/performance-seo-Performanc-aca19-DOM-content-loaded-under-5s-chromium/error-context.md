# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance-seo.spec.ts >> Performance Audit >> courses page: DOM content loaded under 5s
- Location: e2e\performance-seo.spec.ts:20:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/courses", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "Aidevix" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e7]
        - generic [ref=e9]: Aidevix
      - list [ref=e10]:
        - listitem [ref=e11]:
          - link "Kurslar" [ref=e12] [cursor=pointer]:
            - /url: /courses
        - listitem [ref=e13]:
          - link "Musobaqalar" [ref=e14] [cursor=pointer]:
            - /url: /challenges
        - listitem [ref=e15]:
          - link "Qahramonlar" [ref=e16] [cursor=pointer]:
            - /url: /leaderboard
        - listitem [ref=e17]:
          - link "Vakansiyalar" [ref=e18] [cursor=pointer]:
            - /url: /careers
      - generic [ref=e19]:
        - button "Qorong'u" [ref=e20] [cursor=pointer]:
          - img [ref=e21]
        - button "Ovozni o'chirish" [ref=e24] [cursor=pointer]:
          - img [ref=e25]
        - button "Til" [ref=e28] [cursor=pointer]:
          - generic [ref=e30]: Til
          - img [ref=e31]
        - generic [ref=e33]:
          - generic [ref=e34]:
            - generic "XP" [ref=e35]:
              - generic [ref=e36]: XP
              - generic [ref=e37]: 0 XP
            - generic [ref=e39]:
              - generic [ref=e40]: Hot
              - generic [ref=e41]: "0"
          - generic [ref=e43] [cursor=pointer]:
            - generic [ref=e44]: U
            - generic [ref=e46]: AMATEUR
  - main [ref=e48]
  - contentinfo [ref=e63]:
    - generic [ref=e65]:
      - generic [ref=e66]:
        - generic [ref=e67]: Aidevix
        - link "Aidevix" [ref=e68] [cursor=pointer]:
          - /url: /
          - img [ref=e70]
          - generic [ref=e72]: Aidevix
        - paragraph [ref=e73]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e74]:
          - link "tg" [ref=e75] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e76]
          - link "in" [ref=e78] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e79]
          - link "yt" [ref=e81] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e82]
      - generic [ref=e84]:
        - heading "Platforma" [level=4] [ref=e85]
        - list [ref=e86]:
          - listitem [ref=e87]:
            - link "Kurslar" [ref=e88] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e89]:
            - link "Mentorlar" [ref=e90] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e91]:
            - link "Narxlar" [ref=e92] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e93]:
            - link "Kompaniyalar uchun" [ref=e94] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e95]:
        - heading "Kompaniya" [level=4] [ref=e96]
        - list [ref=e97]:
          - listitem [ref=e98]:
            - link "Biz haqimizda" [ref=e99] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e100]:
            - link "Blog" [ref=e101] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e102]:
            - link "Karyera" [ref=e103] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e104]:
            - link "Aloqa" [ref=e105] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e106]:
        - heading "Resurslar" [level=4] [ref=e107]
        - list [ref=e108]:
          - listitem [ref=e109]:
            - link "Yordam markazi" [ref=e110] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e111]:
            - link "Maxfiylik siyosati" [ref=e112] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e113]:
            - link "Foydalanish shartlari" [ref=e114] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e115]:
            - link "Sayt xaritasi" [ref=e116] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e117]:
      - paragraph [ref=e118]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e119]:
        - generic [ref=e120]: Toshkent, O'zbekiston
        - generic [ref=e121]: "|"
        - generic [ref=e122]: Tizim ishlamoqda
  - alert [ref=e124]
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
  13  |     await page.goto(ROUTES.HOME);
  14  |     await waitForPageReady(page);
  15  | 
  16  |     const timing = await assertPerformanceBudget(page, 5000);
  17  |     console.log(`Homepage timing — TTFB: ${timing.firstByte}ms, DCL: ${timing.domContentLoaded}ms, Load: ${timing.load}ms`);
  18  |   });
  19  | 
  20  |   test('courses page: DOM content loaded under 5s', async ({ page }) => {
> 21  |     await page.goto(ROUTES.COURSES);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
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
  114 |     // Navigate through pages
  115 |     for (const route of [ROUTES.COURSES, ROUTES.LOGIN, ROUTES.HOME, ROUTES.COURSES]) {
  116 |       await page.goto(route);
  117 |       await waitForPageReady(page);
  118 |     }
  119 | 
  120 |     const finalMemory = await page.evaluate(() => {
  121 |       if ('memory' in performance) {
```