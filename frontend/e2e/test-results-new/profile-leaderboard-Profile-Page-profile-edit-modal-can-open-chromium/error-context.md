# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile-leaderboard.spec.ts >> Profile Page >> profile edit modal can open
- Location: e2e\profile-leaderboard.spec.ts:47:7

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button').filter({ has: locator('svg') }).filter({ hasText: /tahrir|edit/i }).first()
    - locator resolved to <button class="self-center md:self-start mt-4 py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-200 font-bold text-sm transition-all flex items-center gap-2 group">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c14]/80 px-4 backdrop-blur-sm">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c14]/80 px-4 backdrop-blur-sm">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  14 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0c14]/80 px-4 backdrop-blur-sm">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms

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
  - generic [ref=e49]:
    - button [ref=e50] [cursor=pointer]:
      - img [ref=e51]
    - img [ref=e55]
    - heading "Kunlik Sovg'a!" [level=2] [ref=e60]
    - paragraph [ref=e61]: Siz qatorasiga tizimga kirdingiz. O'z sovg'angizni qabul qilib oling!
    - button "Yig'ib olish (+50 XP)" [ref=e62] [cursor=pointer]
  - main [ref=e63]:
    - generic [ref=e65]:
      - generic [ref=e69]:
        - generic [ref=e70]:
          - img "Profile" [ref=e73]
          - button [ref=e74] [cursor=pointer]:
            - img [ref=e75]
        - generic [ref=e78]:
          - generic [ref=e79]:
            - heading [level=1]
            - generic [ref=e80]:
              - img [ref=e81]
              - text: Faol
          - paragraph [ref=e84]: Dasturchi
          - generic [ref=e85]:
            - generic [ref=e86]:
              - generic [ref=e87]: Daraja
              - generic [ref=e88]:
                - img [ref=e89]
                - text: "5"
            - generic [ref=e92]:
              - generic [ref=e93]: Tajriba (XP)
              - generic [ref=e94]: "1250"
            - generic [ref=e96]:
              - generic [ref=e97]: Videolar
              - generic [ref=e98]: "42"
        - button "Tahrirlash" [ref=e99] [cursor=pointer]:
          - img [ref=e100]
          - text: Tahrirlash
      - generic [ref=e102]:
        - button "Ma'lumotlar" [ref=e103] [cursor=pointer]
        - button "Obunalar" [ref=e104] [cursor=pointer]
        - button "Yutuqlar" [ref=e105] [cursor=pointer]
      - generic [ref=e106]:
        - generic [ref=e107]:
          - generic [ref=e108]:
            - heading "Profil Ma'lumotlari" [level=3] [ref=e109]:
              - img [ref=e110]
              - text: Profil Ma'lumotlari
            - generic [ref=e113]:
              - generic [ref=e114]:
                - text: Ism
                - paragraph [ref=e115]: Belgilanmagan
              - generic [ref=e116]:
                - text: Familiya
                - paragraph [ref=e117]: Belgilanmagan
            - generic [ref=e118]:
              - text: Kasbi
              - paragraph [ref=e119]: Dasturchi
            - generic [ref=e120]:
              - text: Biografiya
              - paragraph [ref=e121]: "\"Dasturlashni sevaman\""
          - generic [ref=e122]:
            - heading "Ko'nikmalar" [level=3] [ref=e123]:
              - img [ref=e124]
              - text: Ko'nikmalar
            - generic [ref=e127]:
              - generic [ref=e128]: React
              - generic [ref=e129]: JavaScript
              - generic [ref=e130]: Node.js
        - generic [ref=e131]:
          - generic [ref=e132]:
            - heading "Aloqa" [level=3] [ref=e133]
            - generic [ref=e134]:
              - generic [ref=e135]:
                - img [ref=e137]
                - generic [ref=e140]:
                  - paragraph [ref=e141]: Email
                  - paragraph
              - generic [ref=e142]:
                - img [ref=e144]
                - generic [ref=e147]:
                  - paragraph [ref=e148]: Instagram
                  - paragraph [ref=e149]: "@testuser_ig"
          - generic [ref=e151]:
            - heading "Aidevix Pro" [level=4] [ref=e152]
            - paragraph [ref=e153]: Barcha kurslar va yopiq darslarga cheksiz kirish huquqiga ega bo'ling.
            - button "Upgrade Now" [ref=e154] [cursor=pointer]
  - contentinfo [ref=e156]:
    - generic [ref=e158]:
      - generic [ref=e159]:
        - generic [ref=e160]: Aidevix
        - link "Aidevix" [ref=e161] [cursor=pointer]:
          - /url: /
          - img [ref=e163]
          - generic [ref=e165]: Aidevix
        - paragraph [ref=e166]: O'zbek tilidagi eng yirik va zamonaviy dasturlash o'quv platformasi. Biz bilan kelajak kasbini o'rganing.
        - generic [ref=e167]:
          - link "tg" [ref=e168] [cursor=pointer]:
            - /url: https://t.me/aidevix
            - img [ref=e169]
          - link "in" [ref=e171] [cursor=pointer]:
            - /url: https://instagram.com/aidevix
            - img [ref=e172]
          - link "yt" [ref=e174] [cursor=pointer]:
            - /url: https://youtube.com/@aidevix
            - img [ref=e175]
      - generic [ref=e177]:
        - heading "Platforma" [level=4] [ref=e178]
        - list [ref=e179]:
          - listitem [ref=e180]:
            - link "Kurslar" [ref=e181] [cursor=pointer]:
              - /url: /courses
          - listitem [ref=e182]:
            - link "Mentorlar" [ref=e183] [cursor=pointer]:
              - /url: /mentors
          - listitem [ref=e184]:
            - link "Narxlar" [ref=e185] [cursor=pointer]:
              - /url: /pricing
          - listitem [ref=e186]:
            - link "Kompaniyalar uchun" [ref=e187] [cursor=pointer]:
              - /url: /enterprise
      - generic [ref=e188]:
        - heading "Kompaniya" [level=4] [ref=e189]
        - list [ref=e190]:
          - listitem [ref=e191]:
            - link "Biz haqimizda" [ref=e192] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e193]:
            - link "Blog" [ref=e194] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e195]:
            - link "Karyera" [ref=e196] [cursor=pointer]:
              - /url: /careers
          - listitem [ref=e197]:
            - link "Aloqa" [ref=e198] [cursor=pointer]:
              - /url: /contact
      - generic [ref=e199]:
        - heading "Resurslar" [level=4] [ref=e200]
        - list [ref=e201]:
          - listitem [ref=e202]:
            - link "Yordam markazi" [ref=e203] [cursor=pointer]:
              - /url: /help
          - listitem [ref=e204]:
            - link "Maxfiylik siyosati" [ref=e205] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e206]:
            - link "Foydalanish shartlari" [ref=e207] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e208]:
            - link "Sayt xaritasi" [ref=e209] [cursor=pointer]:
              - /url: /sitemap
    - generic [ref=e210]:
      - paragraph [ref=e211]: © 2024 Aidevix Inc. Barcha huquqlar himoyalangan.
      - generic [ref=e212]:
        - generic [ref=e213]: Toshkent, O'zbekiston
        - generic [ref=e214]: "|"
        - generic [ref=e215]: Tizim ishlamoqda
  - alert [ref=e217]
```

# Test source

```ts
  1   | import { test, expect } from './fixtures/test-fixtures';
  2   | import { ROUTES, TIMEOUTS } from './helpers/constants';
  3   | import { MOCK_USER_STATS, MOCK_LEADERBOARD, MOCK_SUBSCRIPTION_STATUS } from './fixtures/mock-data';
  4   | import { waitForPageReady } from './helpers/test-utils';
  5   | 
  6   | test.describe('Profile Page', () => {
  7   |   test('profile page shows user info', async ({ loggedInPage }) => {
  8   |     await loggedInPage.route('**/api/**/courses/top*', (route) =>
  9   |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { courses: [] } }) }),
  10  |     );
  11  |     await loggedInPage.route('**/api/**/videos/top*', (route) =>
  12  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: { videos: [] } }) }),
  13  |     );
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
> 55  |         await editBtn.click();
      |                       ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
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
  154 |     await loggedInPage.goto('/level-up');
  155 |     await waitForPageReady(loggedInPage);
```