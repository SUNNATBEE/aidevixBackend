# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile-leaderboard.spec.ts >> Gamification >> XP and level display on profile
- Location: e2e\profile-leaderboard.spec.ts:113:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/profile", waiting until "load"

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
  - main [ref=e48]:
    - generic [ref=e50]:
      - generic [ref=e54]:
        - generic [ref=e55]:
          - img "Profile" [ref=e58]
          - button [ref=e59] [cursor=pointer]:
            - img [ref=e60]
        - generic [ref=e63]:
          - generic [ref=e64]:
            - heading [level=1]
            - generic [ref=e65]:
              - img [ref=e66]
              - text: Faol
          - paragraph [ref=e69]: Dasturchi
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]: Daraja
              - generic [ref=e73]:
                - img [ref=e74]
                - text: "1"
            - generic [ref=e77]:
              - generic [ref=e78]: Tajriba (XP)
              - generic [ref=e79]: "0"
            - generic [ref=e81]:
              - generic [ref=e82]: Videolar
              - generic [ref=e83]: "0"
        - button "Tahrirlash" [ref=e84] [cursor=pointer]:
          - img [ref=e85]
          - text: Tahrirlash
      - generic [ref=e87]:
        - button "Ma'lumotlar" [ref=e88] [cursor=pointer]
        - button "Obunalar" [ref=e89] [cursor=pointer]
        - button "Yutuqlar" [ref=e90] [cursor=pointer]
      - generic [ref=e91]:
        - generic [ref=e92]:
          - generic [ref=e93]:
            - heading "Profil Ma'lumotlari" [level=3] [ref=e94]:
              - img [ref=e95]
              - text: Profil Ma'lumotlari
            - generic [ref=e98]:
              - generic [ref=e99]:
                - text: Ism
                - paragraph [ref=e100]: Belgilanmagan
              - generic [ref=e101]:
                - text: Familiya
                - paragraph [ref=e102]: Belgilanmagan
            - generic [ref=e103]:
              - text: Kasbi
              - paragraph [ref=e104]: Dasturchi
            - generic [ref=e105]:
              - text: Biografiya
              - paragraph [ref=e106]: "\"Hali biografiya qo'shilmagan.\""
          - generic [ref=e107]:
            - heading "Ko'nikmalar" [level=3] [ref=e108]:
              - img [ref=e109]
              - text: Ko'nikmalar
            - paragraph [ref=e113]: Hech qanday ko'nikma qo'shilmagan.
        - generic [ref=e114]:
          - generic [ref=e115]:
            - heading "Aloqa" [level=3] [ref=e116]
            - generic [ref=e117]:
              - generic [ref=e118]:
                - img [ref=e120]
                - generic [ref=e123]:
                  - paragraph [ref=e124]: Email
                  - paragraph
              - generic [ref=e125]:
                - img [ref=e127]
                - generic [ref=e130]:
                  - paragraph [ref=e131]: Instagram
                  - paragraph [ref=e132]: "@ulanish kerak"
          - generic [ref=e134]:
            - heading "Aidevix Pro" [level=4] [ref=e135]
            - paragraph [ref=e136]: Barcha kurslar va yopiq darslarga cheksiz kirish huquqiga ega bo'ling.
            - button "Upgrade Now" [ref=e137] [cursor=pointer]
  - contentinfo [ref=e139]:
    - generic [ref=e141]:
      - generic [ref=e142]:
        - generic [ref=e143]: Aidevix
        - link "Aidevix" [ref=e144] [cursor=pointer]:
          - /url: /
          - img [ref=e146]
          - generic [ref=e148]: Aidevix
        - paragraph [ref=e149]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e150]:
          - link "tg" [ref=e151] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e152]
          - link "in" [ref=e154] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e155]
          - link "yt" [ref=e157] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e158]
      - generic [ref=e160]:
        - heading "Platforma" [level=4] [ref=e161]
        - list [ref=e162]:
          - listitem [ref=e163]:
            - link "Kurslar" [ref=e164] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e165]:
            - link "Mentorlar" [ref=e166] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e167]:
            - link "Narxlar" [ref=e168] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e169]:
            - link "Kompaniyalar uchun" [ref=e170] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e171]:
        - heading "Kompaniya" [level=4] [ref=e172]
        - list [ref=e173]:
          - listitem [ref=e174]:
            - link "Biz haqimizda" [ref=e175] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e176]:
            - link "Blog" [ref=e177] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e178]:
            - link "Karyera" [ref=e179] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e180]:
            - link "Aloqa" [ref=e181] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e182]:
        - heading "Resurslar" [level=4] [ref=e183]
        - list [ref=e184]:
          - listitem [ref=e185]:
            - link "Yordam markazi" [ref=e186] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e187]:
            - link "Maxfiylik siyosati" [ref=e188] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e189]:
            - link "Foydalanish shartlari" [ref=e190] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e191]:
            - link "Sayt xaritasi" [ref=e192] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e193]:
      - paragraph [ref=e194]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e195]:
        - generic [ref=e196]: Toshkent, O'zbekiston
        - generic [ref=e197]: "|"
        - generic [ref=e198]: Tizim ishlamoqda
  - alert [ref=e200]
```

# Test source

```ts
  14  | 
  15  |     await loggedInPage.goto(ROUTES.PROFILE);
  16  |     await waitForPageReady(loggedInPage);
  17  |     await loggedInPage.waitForTimeout(2000);
  18  | 
  19  |     const url = loggedInPage.url();
  20  |     if (url.includes('/profile')) {
  21  |       // Should display username or email
  22  |       const hasUserInfo = await loggedInPage.locator('text=/testuser|test@aidevix/i').first().isVisible().catch(() => false);
  23  |       // May have XP display
  24  |       const hasXP = await loggedInPage.locator('text=/XP|xp|level|daraja/i').first().isVisible().catch(() => false);
  25  | 
  26  |       expect(hasUserInfo || hasXP || true).toBeTruthy(); // Profile loaded
  27  |     }
  28  |   });
  29  | 
  30  |   test('profile page has tabs', async ({ loggedInPage }) => {
  31  |     await loggedInPage.route('**/api/**/courses/top*', (route) =>
  32  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { courses: [] } }) }),
  33  |     );
  34  | 
  35  |     await loggedInPage.goto(ROUTES.PROFILE);
  36  |     await waitForPageReady(loggedInPage);
  37  |     await loggedInPage.waitForTimeout(2000);
  38  | 
  39  |     if (loggedInPage.url().includes('/profile')) {
  40  |       // Profile has tabs like "Ma'lumotlar"
  41  |       const tabs = loggedInPage.locator('button, [role="tab"]').filter({ hasText: /ma.*lumot|badge|statistika/i });
  42  |       const count = await tabs.count();
  43  |       // May have 0 if profile design is different
  44  |     }
  45  |   });
  46  | 
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
> 114 |     await loggedInPage.goto(ROUTES.PROFILE);
      |                        ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
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
  154 |     await loggedInPage.goto('/level-up');
  155 |     await waitForPageReady(loggedInPage);
  156 | 
  157 |     await expect(loggedInPage).not.toHaveTitle(/500|error/i);
  158 |   });
  159 | });
  160 | 
```