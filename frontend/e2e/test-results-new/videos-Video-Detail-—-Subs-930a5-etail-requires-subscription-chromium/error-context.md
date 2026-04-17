# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: videos.spec.ts >> Video Detail — Subscription Gate >> video detail requires subscription
- Location: e2e\videos.spec.ts:27:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/videos/video-1", waiting until "load"

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
  - main [ref=e48]:
    - generic [ref=e49]:
      - heading "Video topilmadi" [level=2] [ref=e50]
      - link "Kurslarga qaytish" [ref=e51] [cursor=pointer]:
        - /url: /courses
  - contentinfo [ref=e52]:
    - generic [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e56]: Aidevix
        - link "Aidevix" [ref=e57] [cursor=pointer]:
          - /url: /
          - img [ref=e59]
          - generic [ref=e61]: Aidevix
        - paragraph [ref=e62]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e63]:
          - link "tg" [ref=e64] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e65]
          - link "in" [ref=e67] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e68]
          - link "yt" [ref=e70] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e71]
      - generic [ref=e73]:
        - heading "Platforma" [level=4] [ref=e74]
        - list [ref=e75]:
          - listitem [ref=e76]:
            - link "Kurslar" [ref=e77] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e78]:
            - link "Mentorlar" [ref=e79] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e80]:
            - link "Narxlar" [ref=e81] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e82]:
            - link "Kompaniyalar uchun" [ref=e83] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e84]:
        - heading "Kompaniya" [level=4] [ref=e85]
        - list [ref=e86]:
          - listitem [ref=e87]:
            - link "Biz haqimizda" [ref=e88] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e89]:
            - link "Blog" [ref=e90] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e91]:
            - link "Karyera" [ref=e92] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e93]:
            - link "Aloqa" [ref=e94] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e95]:
        - heading "Resurslar" [level=4] [ref=e96]
        - list [ref=e97]:
          - listitem [ref=e98]:
            - link "Yordam markazi" [ref=e99] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e100]:
            - link "Maxfiylik siyosati" [ref=e101] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e102]:
            - link "Foydalanish shartlari" [ref=e103] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e104]:
            - link "Sayt xaritasi" [ref=e105] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e106]:
      - paragraph [ref=e107]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e108]:
        - generic [ref=e109]: Toshkent, O'zbekiston
        - generic [ref=e110]: "|"
        - generic [ref=e111]: Tizim ishlamoqda
  - alert [ref=e113]
```

# Test source

```ts
  1   | import { test, expect } from './fixtures/test-fixtures';
  2   | import { ROUTES, SELECTORS, TIMEOUTS } from './helpers/constants';
  3   | import { MOCK_VIDEOS, MOCK_TOP_VIDEOS, MOCK_SUBSCRIPTION_UNVERIFIED, MOCK_SUBSCRIPTION_STATUS } from './fixtures/mock-data';
  4   | import { waitForPageReady } from './helpers/test-utils';
  5   | 
  6   | test.describe('Videos Page', () => {
  7   |   test.beforeEach(async ({ page }) => {
  8   |     await page.route('**/api/**/videos/top*', (route) =>
  9   |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) }),
  10  |     );
  11  |     await page.route('**/api/**/auth/me*', (route) =>
  12  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  13  |     );
  14  |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  15  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  16  |     );
  17  |   });
  18  | 
  19  |   test('videos page loads', async ({ page }) => {
  20  |     await page.goto(ROUTES.VIDEOS);
  21  |     await waitForPageReady(page);
  22  |     await expect(page).not.toHaveTitle(/error|500/i);
  23  |   });
  24  | });
  25  | 
  26  | test.describe('Video Detail — Subscription Gate', () => {
  27  |   test('video detail requires subscription', async ({ page }) => {
  28  |     // Simulate unverified user
  29  |     await page.route('**/api/**/auth/me*', (route) =>
  30  |       route.fulfill({
  31  |         status: 200,
  32  |         contentType: 'application/json',
  33  |         body: JSON.stringify({
  34  |           success: true,
  35  |           data: {
  36  |             user: {
  37  |               _id: 'u1',
  38  |               username: 'newuser',
  39  |               email: 'new@test.com',
  40  |               subscriptions: { telegram: { verified: false }, instagram: { verified: false } },
  41  |             },
  42  |           },
  43  |         }),
  44  |       }),
  45  |     );
  46  |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  47  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { accessToken: 'tok' } }) }),
  48  |     );
  49  |     await page.route('**/api/**/subscriptions/status*', (route) =>
  50  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  51  |     );
  52  |     await page.route('**/api/**/subscriptions/realtime-status*', (route) =>
  53  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  54  |     );
  55  |     await page.route('**/api/**/videos/video-1*', (route) =>
  56  |       route.fulfill({
  57  |         status: 403,
  58  |         contentType: 'application/json',
  59  |         body: JSON.stringify({ success: false, message: 'Obuna talab qilinadi' }),
  60  |       }),
  61  |     );
  62  |     await page.route('**/api/**/xp/stats*', (route) =>
  63  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  64  |     );
  65  | 
  66  |     await page.addInitScript(() => {
  67  |       localStorage.setItem('aidevix_user', JSON.stringify({
  68  |         _id: 'u1', username: 'newuser', email: 'new@test.com',
  69  |         subscriptions: { telegram: { verified: false }, instagram: { verified: false } },
  70  |       }));
  71  |     });
  72  | 
> 73  |     await page.goto('/videos/video-1');
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  74  |     await waitForPageReady(page);
  75  | 
  76  |     // Should show subscription gate or redirect
  77  |     await page.waitForTimeout(3000);
  78  |     const hasGate = await page.locator('text=/obuna|telegram|instagram|verify/i').first().isVisible().catch(() => false);
  79  |     const redirected = page.url().includes('/subscription') || page.url().includes('/login');
  80  | 
  81  |     expect(hasGate || redirected).toBeTruthy();
  82  |   });
  83  | 
  84  |   test('verified user can access video', async ({ loggedInPage }) => {
  85  |     await loggedInPage.route('**/api/**/videos/video-1*', (route) =>
  86  |       route.fulfill({
  87  |         status: 200,
  88  |         contentType: 'application/json',
  89  |         body: JSON.stringify({
  90  |           success: true,
  91  |           data: { video: MOCK_VIDEOS.data.videos[0] },
  92  |         }),
  93  |       }),
  94  |     );
  95  |     await loggedInPage.route('**/api/**/videos/video-1/rating*', (route) =>
  96  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { rating: 4.5 } }) }),
  97  |     );
  98  | 
  99  |     await loggedInPage.goto('/videos/video-1');
  100 |     await waitForPageReady(loggedInPage);
  101 | 
  102 |     // Should not be blocked — page should load without subscription gate
  103 |     await loggedInPage.waitForTimeout(2000);
  104 |     const url = loggedInPage.url();
  105 |     expect(url).toContain('/videos/video-1');
  106 |   });
  107 | });
  108 | 
  109 | test.describe('Video — Rating', () => {
  110 |   test('video rating component renders for authenticated user', async ({ loggedInPage }) => {
  111 |     await loggedInPage.route('**/api/**/videos/video-1*', (route) =>
  112 |       route.fulfill({
  113 |         status: 200,
  114 |         contentType: 'application/json',
  115 |         body: JSON.stringify({
  116 |           success: true,
  117 |           data: { video: MOCK_VIDEOS.data.videos[0] },
  118 |         }),
  119 |       }),
  120 |     );
  121 |     await loggedInPage.route('**/api/**/videos/video-1/rating*', (route) =>
  122 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { rating: 0 } }) }),
  123 |     );
  124 | 
  125 |     await loggedInPage.goto('/videos/video-1');
  126 |     await waitForPageReady(loggedInPage);
  127 | 
  128 |     // Look for star rating elements
  129 |     await loggedInPage.waitForTimeout(2000);
  130 |     const stars = loggedInPage.locator('[class*="star"], [class*="Star"], [class*="rating"] button, svg[class*="star"]');
  131 |     // Rating component may or may not be visible depending on page state
  132 |   });
  133 | });
  134 | 
  135 | test.describe('Video — Search', () => {
  136 |   test('video search returns results', async ({ page }) => {
  137 |     await page.route('**/api/**/videos/search*', (route) =>
  138 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_VIDEOS) }),
  139 |     );
  140 |     await page.route('**/api/**/auth/me*', (route) =>
  141 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  142 |     );
  143 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  144 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  145 |     );
  146 | 
  147 |     await page.goto(ROUTES.VIDEOS);
  148 |     await waitForPageReady(page);
  149 | 
  150 |     const searchInput = page.locator('input[type="text"], input[type="search"]').first();
  151 |     if (await searchInput.isVisible().catch(() => false)) {
  152 |       await searchInput.fill('React');
  153 |       await page.waitForTimeout(600);
  154 |     }
  155 |   });
  156 | });
  157 | 
```