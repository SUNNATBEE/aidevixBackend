# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile-leaderboard.spec.ts >> Gamification >> level-up page loads
- Location: e2e\profile-leaderboard.spec.ts:153:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/level-up", waiting until "load"

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
        - button "Yorug'" [ref=e20] [cursor=pointer]:
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
  - contentinfo [ref=e164]:
    - generic [ref=e166]:
      - generic [ref=e167]:
        - generic [ref=e168]: Aidevix
        - link "Aidevix" [ref=e169] [cursor=pointer]:
          - /url: /
          - img [ref=e171]
          - generic [ref=e173]: Aidevix
        - paragraph [ref=e174]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e175]:
          - link "tg" [ref=e176] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e177]
          - link "in" [ref=e179] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e180]
          - link "yt" [ref=e182] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e183]
      - generic [ref=e185]:
        - heading "Platforma" [level=4] [ref=e186]
        - list [ref=e187]:
          - listitem [ref=e188]:
            - link "Kurslar" [ref=e189] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e190]:
            - link "Mentorlar" [ref=e191] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e192]:
            - link "Narxlar" [ref=e193] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e194]:
            - link "Kompaniyalar uchun" [ref=e195] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e196]:
        - heading "Kompaniya" [level=4] [ref=e197]
        - list [ref=e198]:
          - listitem [ref=e199]:
            - link "Biz haqimizda" [ref=e200] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e201]:
            - link "Blog" [ref=e202] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e203]:
            - link "Karyera" [ref=e204] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e205]:
            - link "Aloqa" [ref=e206] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e207]:
        - heading "Resurslar" [level=4] [ref=e208]
        - list [ref=e209]:
          - listitem [ref=e210]:
            - link "Yordam markazi" [ref=e211] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e212]:
            - link "Maxfiylik siyosati" [ref=e213] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e214]:
            - link "Foydalanish shartlari" [ref=e215] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e216]:
            - link "Sayt xaritasi" [ref=e217] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e218]:
      - paragraph [ref=e219]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e220]:
        - generic [ref=e221]: Toshkent, O'zbekiston
        - generic [ref=e222]: "|"
        - generic [ref=e223]: Tizim ishlamoqda
  - alert [ref=e225]
```

# Test source

```ts
  54  |       if (await editBtn.isVisible().catch(() => false)) {
  55  |         await editBtn.click();
  56  |         await loggedInPage.waitForTimeout(500);
  57  | 
  58  |         // Modal should appear
  59  |         const modal = loggedInPage.locator('[class*="modal"], [role="dialog"]').first();
  60  |         if (await modal.isVisible().catch(() => false)) {
  61  |           await expect(modal).toBeVisible();
  62  |         }
  63  |       }
  64  |     }
  65  |   });
  66  | });
  67  | 
  68  | test.describe('Leaderboard Page', () => {
  69  |   test.beforeEach(async ({ page }) => {
  70  |     await page.route('**/api/**/ranking*', (route) =>
  71  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_LEADERBOARD) }),
  72  |     );
  73  |     await page.route('**/api/**/auth/me*', (route) =>
  74  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  75  |     );
  76  |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  77  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  78  |     );
  79  |   });
  80  | 
  81  |   test('leaderboard page loads', async ({ page }) => {
  82  |     await page.goto(ROUTES.LEADERBOARD);
  83  |     await waitForPageReady(page);
  84  | 
  85  |     await expect(page).not.toHaveTitle(/404|error/i);
  86  |   });
  87  | 
  88  |   test('leaderboard shows ranking data', async ({ page }) => {
  89  |     await page.goto(ROUTES.LEADERBOARD);
  90  |     await waitForPageReady(page);
  91  |     await page.waitForTimeout(2000);
  92  | 
  93  |     // Should show ranking-related content
  94  |     const hasRanking = await page.locator('text=/leaderboard|reyting|champion|#1|XP/i').first().isVisible().catch(() => false);
  95  |     const hasTable = await page.locator('table, [class*="leaderboard"], [class*="ranking"]').first().isVisible().catch(() => false);
  96  | 
  97  |     // Page loaded successfully even if no data is rendered
  98  |     expect(true).toBeTruthy();
  99  |   });
  100 | 
  101 |   test('leaderboard displays usernames', async ({ page }) => {
  102 |     await page.goto(ROUTES.LEADERBOARD);
  103 |     await waitForPageReady(page);
  104 |     await page.waitForTimeout(3000);
  105 | 
  106 |     // Check if any mock usernames are displayed
  107 |     const hasUser = await page.locator('text=/champion|pro_coder/').first().isVisible().catch(() => false);
  108 |     // Mock data may or may not render depending on component implementation
  109 |   });
  110 | });
  111 | 
  112 | test.describe('Gamification', () => {
  113 |   test('XP and level display on profile', async ({ loggedInPage }) => {
  114 |     await loggedInPage.goto(ROUTES.PROFILE);
  115 |     await waitForPageReady(loggedInPage);
  116 |     await loggedInPage.waitForTimeout(2000);
  117 | 
  118 |     if (loggedInPage.url().includes('/profile')) {
  119 |       // Look for XP/level indicators
  120 |       const xpElements = loggedInPage.locator('text=/\\d+.*XP|Level.*\\d|daraja/i');
  121 |       const count = await xpElements.count();
  122 |       // XP should be displayed somewhere on profile
  123 |     }
  124 |   });
  125 | 
  126 |   test('referral page loads', async ({ loggedInPage }) => {
  127 |     await loggedInPage.goto(ROUTES.REFERRAL);
  128 |     await waitForPageReady(loggedInPage);
  129 | 
  130 |     await expect(loggedInPage).not.toHaveTitle(/404|error/i);
  131 | 
  132 |     // Should show referral code or link
  133 |     const hasReferral = await loggedInPage.locator('text=/referral|tavsiya|havola|kod/i').first().isVisible().catch(() => false);
  134 |   });
  135 | 
  136 |   test('challenges page loads', async ({ page }) => {
  137 |     await page.route('**/api/**/challenges*', (route) =>
  138 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { challenges: [] } }) }),
  139 |     );
  140 |     await page.route('**/api/**/auth/me*', (route) =>
  141 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  142 |     );
  143 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  144 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  145 |     );
  146 | 
  147 |     await page.goto(ROUTES.CHALLENGES);
  148 |     await waitForPageReady(page);
  149 | 
  150 |     await expect(page).not.toHaveTitle(/500|error/i);
  151 |   });
  152 | 
  153 |   test('level-up page loads', async ({ loggedInPage }) => {
> 154 |     await loggedInPage.goto('/level-up');
      |                        ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  155 |     await waitForPageReady(loggedInPage);
  156 | 
  157 |     await expect(loggedInPage).not.toHaveTitle(/500|error/i);
  158 |   });
  159 | });
  160 | 
```