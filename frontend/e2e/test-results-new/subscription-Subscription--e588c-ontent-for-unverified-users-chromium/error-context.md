# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: subscription.spec.ts >> Subscription Gate Component >> gate blocks content for unverified users
- Location: e2e\subscription.spec.ts:120:7

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
  - main [ref=e48]
  - contentinfo [ref=e50]:
    - generic [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e54]: Aidevix
        - link "Aidevix" [ref=e55] [cursor=pointer]:
          - /url: /
          - img [ref=e57]
          - generic [ref=e59]: Aidevix
        - paragraph [ref=e60]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e61]:
          - link "tg" [ref=e62] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e63]
          - link "in" [ref=e65] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e66]
          - link "yt" [ref=e68] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e69]
      - generic [ref=e71]:
        - heading "Platforma" [level=4] [ref=e72]
        - list [ref=e73]:
          - listitem [ref=e74]:
            - link "Kurslar" [ref=e75] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e76]:
            - link "Mentorlar" [ref=e77] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e78]:
            - link "Narxlar" [ref=e79] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e80]:
            - link "Kompaniyalar uchun" [ref=e81] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e82]:
        - heading "Kompaniya" [level=4] [ref=e83]
        - list [ref=e84]:
          - listitem [ref=e85]:
            - link "Biz haqimizda" [ref=e86] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e87]:
            - link "Blog" [ref=e88] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e89]:
            - link "Karyera" [ref=e90] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e91]:
            - link "Aloqa" [ref=e92] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e93]:
        - heading "Resurslar" [level=4] [ref=e94]
        - list [ref=e95]:
          - listitem [ref=e96]:
            - link "Yordam markazi" [ref=e97] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e98]:
            - link "Maxfiylik siyosati" [ref=e99] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e100]:
            - link "Foydalanish shartlari" [ref=e101] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e102]:
            - link "Sayt xaritasi" [ref=e103] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e104]:
      - paragraph [ref=e105]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e106]:
        - generic [ref=e107]: Toshkent, O'zbekiston
        - generic [ref=e108]: "|"
        - generic [ref=e109]: Tizim ishlamoqda
  - alert [ref=e111]
```

# Test source

```ts
  56  |     await loggedInPage.route('**/api/**/subscriptions/verify-telegram', async (route) => {
  57  |       telegramVerifyCalled = true;
  58  |       await route.fulfill({
  59  |         status: 200,
  60  |         contentType: 'application/json',
  61  |         body: JSON.stringify({
  62  |           success: true,
  63  |           data: { telegram: { verified: true, username: 'testuser_tg' } },
  64  |         }),
  65  |       });
  66  |     });
  67  | 
  68  |     await loggedInPage.goto(ROUTES.SUBSCRIPTION);
  69  |     await waitForPageReady(loggedInPage);
  70  | 
  71  |     // Find Telegram input and fill it
  72  |     const tgInput = loggedInPage.locator('input[placeholder*="telegram" i], input[placeholder*="username" i]').first();
  73  |     if (await tgInput.isVisible().catch(() => false)) {
  74  |       await tgInput.fill('testuser_tg');
  75  | 
  76  |       // Find and click verify/submit button near the telegram section
  77  |       const verifyBtn = loggedInPage.locator('button').filter({ hasText: /tekshirish|verify|tasdiqlash/i }).first();
  78  |       if (await verifyBtn.isVisible().catch(() => false)) {
  79  |         await verifyBtn.click();
  80  |         await loggedInPage.waitForTimeout(1000);
  81  |       }
  82  |     }
  83  |   });
  84  | 
  85  |   test('Instagram verify button submits username', async ({ loggedInPage }) => {
  86  |     await loggedInPage.route('**/api/**/subscriptions/status*', (route) =>
  87  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  88  |     );
  89  |     await loggedInPage.route('**/api/**/subscriptions/realtime-status*', (route) =>
  90  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  91  |     );
  92  |     await loggedInPage.route('**/api/**/subscriptions/verify-instagram', (route) =>
  93  |       route.fulfill({
  94  |         status: 200,
  95  |         contentType: 'application/json',
  96  |         body: JSON.stringify({
  97  |           success: true,
  98  |           data: { instagram: { verified: true, username: 'testuser_ig' } },
  99  |         }),
  100 |       }),
  101 |     );
  102 | 
  103 |     await loggedInPage.goto(ROUTES.SUBSCRIPTION);
  104 |     await waitForPageReady(loggedInPage);
  105 | 
  106 |     const igInput = loggedInPage.locator('input[placeholder*="instagram" i], input[placeholder*="username" i]').last();
  107 |     if (await igInput.isVisible().catch(() => false)) {
  108 |       await igInput.fill('testuser_ig');
  109 | 
  110 |       const verifyBtn = loggedInPage.locator('button').filter({ hasText: /tekshirish|verify|tasdiqlash/i }).last();
  111 |       if (await verifyBtn.isVisible().catch(() => false)) {
  112 |         await verifyBtn.click();
  113 |         await loggedInPage.waitForTimeout(1000);
  114 |       }
  115 |     }
  116 |   });
  117 | });
  118 | 
  119 | test.describe('Subscription Gate Component', () => {
  120 |   test('gate blocks content for unverified users', async ({ page }) => {
  121 |     await page.addInitScript(() => {
  122 |       localStorage.setItem('aidevix_user', JSON.stringify({
  123 |         _id: 'u1', username: 'newuser', email: 'new@test.com',
  124 |         subscriptions: { telegram: { verified: false }, instagram: { verified: false } },
  125 |       }));
  126 |     });
  127 | 
  128 |     await page.route('**/api/**/auth/me*', (route) =>
  129 |       route.fulfill({
  130 |         status: 200,
  131 |         contentType: 'application/json',
  132 |         body: JSON.stringify({
  133 |           success: true,
  134 |           data: {
  135 |             user: {
  136 |               _id: 'u1', username: 'newuser', email: 'new@test.com',
  137 |               subscriptions: { telegram: { verified: false }, instagram: { verified: false } },
  138 |             },
  139 |           },
  140 |         }),
  141 |       }),
  142 |     );
  143 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  144 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { accessToken: 'tok' } }) }),
  145 |     );
  146 |     await page.route('**/api/**/subscriptions/status*', (route) =>
  147 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_SUBSCRIPTION_UNVERIFIED) }),
  148 |     );
  149 |     await page.route('**/api/**/xp/stats*', (route) =>
  150 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  151 |     );
  152 |     await page.route('**/api/**/videos/**', (route) =>
  153 |       route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ success: false, message: 'Obuna talab qilinadi' }) }),
  154 |     );
  155 | 
> 156 |     await page.goto('/videos/video-1');
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  157 |     await waitForPageReady(page);
  158 |     await page.waitForTimeout(3000);
  159 | 
  160 |     // Should show gate or redirect
  161 |     const gateVisible = await page.locator('text=/obuna|telegram|instagram|subscribe/i').first().isVisible().catch(() => false);
  162 |     const redirected = page.url().includes('/subscription') || page.url().includes('/login');
  163 | 
  164 |     expect(gateVisible || redirected).toBeTruthy();
  165 |   });
  166 | });
  167 | 
```