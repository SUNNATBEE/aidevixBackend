# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile-leaderboard.spec.ts >> Gamification >> challenges page loads
- Location: e2e\profile-leaderboard.spec.ts:136:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/challenges", waiting until "load"

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
    - generic [ref=e38]:
      - img [ref=e40]
      - heading "Daily Challenges" [level=1] [ref=e47]
      - paragraph [ref=e48]: Tez orada! Har kuni yangi dasturlash topshiriqlarini bajaring va qo'shimcha XP ballarini qo'lga kiriting.
      - generic [ref=e49]:
        - img [ref=e50]
        - text: Yaqin kunlarda ishga tushadi
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
  47  |   test('profile edit modal can open', async ({ loggedInPage }) => {
  48  |     await loggedInPage.goto(ROUTES.PROFILE);
  49  |     await waitForPageReady(loggedInPage);
  50  |     await loggedInPage.waitForTimeout(2000);
  51  | 
  52  |     if (loggedInPage.url().includes('/profile')) {
  53  |       const editBtn = loggedInPage.locator('button').filter({ has: loggedInPage.locator('svg') }).filter({ hasText: /tahrir|edit/i }).first();
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
> 147 |     await page.goto(ROUTES.CHALLENGES);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  148 |     await waitForPageReady(page);
  149 | 
  150 |     await expect(page).not.toHaveTitle(/500|error/i);
  151 |   });
  152 | 
  153 |   test('level-up page loads', async ({ loggedInPage }) => {
  154 |     await loggedInPage.goto('/level-up');
  155 |     await waitForPageReady(loggedInPage);
  156 | 
  157 |     await expect(loggedInPage).not.toHaveTitle(/500|error/i);
  158 |   });
  159 | });
  160 | 
```