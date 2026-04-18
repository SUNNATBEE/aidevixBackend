# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: videos.spec.ts >> Videos Page >> videos page loads
- Location: e2e\videos.spec.ts:19:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/videos", waiting until "load"

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
        - link "Kirish" [ref=e33] [cursor=pointer]:
          - /url: /login
        - link "Boshlash →" [ref=e34] [cursor=pointer]:
          - /url: /register
  - main [ref=e36]:
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - heading "404" [level=1] [ref=e40]
          - generic [ref=e41]:
            - img [ref=e43]
            - heading "Sahifa topilmadi" [level=2] [ref=e46]
            - paragraph [ref=e47]: Siz qidirayotgan sahifa o'chirilgan, nomi o'zgartirilgan yoki vaqtincha mavjud emas.
        - generic [ref=e48]:
          - link "Bosh sahifaga qaytish" [ref=e49] [cursor=pointer]:
            - /url: /
            - img [ref=e50]
            - text: Bosh sahifaga qaytish
          - link "Kurslarni ko'rish" [ref=e53] [cursor=pointer]:
            - /url: /courses
      - paragraph [ref=e55]: Aidevix Professional Learning Platform
  - contentinfo [ref=e56]:
    - generic [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e60]: Aidevix
        - link "Aidevix" [ref=e61] [cursor=pointer]:
          - /url: /
          - img [ref=e63]
          - generic [ref=e65]: Aidevix
        - paragraph [ref=e66]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e67]:
          - link "tg" [ref=e68] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e69]
          - link "in" [ref=e71] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e72]
          - link "yt" [ref=e74] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e75]
      - generic [ref=e77]:
        - heading "Platforma" [level=4] [ref=e78]
        - list [ref=e79]:
          - listitem [ref=e80]:
            - link "Kurslar" [ref=e81] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e82]:
            - link "Mentorlar" [ref=e83] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e84]:
            - link "Narxlar" [ref=e85] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e86]:
            - link "Kompaniyalar uchun" [ref=e87] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e88]:
        - heading "Kompaniya" [level=4] [ref=e89]
        - list [ref=e90]:
          - listitem [ref=e91]:
            - link "Biz haqimizda" [ref=e92] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e93]:
            - link "Blog" [ref=e94] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e95]:
            - link "Karyera" [ref=e96] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e97]:
            - link "Aloqa" [ref=e98] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e99]:
        - heading "Resurslar" [level=4] [ref=e100]
        - list [ref=e101]:
          - listitem [ref=e102]:
            - link "Yordam markazi" [ref=e103] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e104]:
            - link "Maxfiylik siyosati" [ref=e105] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e106]:
            - link "Foydalanish shartlari" [ref=e107] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e108]:
            - link "Sayt xaritasi" [ref=e109] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e110]:
      - paragraph [ref=e111]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e112]:
        - generic [ref=e113]: Toshkent, O'zbekiston
        - generic [ref=e114]: "|"
        - generic [ref=e115]: Tizim ishlamoqda
  - alert [ref=e117]
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
> 20  |     await page.goto(ROUTES.VIDEOS);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
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
  73  |     await page.goto('/videos/video-1');
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
```