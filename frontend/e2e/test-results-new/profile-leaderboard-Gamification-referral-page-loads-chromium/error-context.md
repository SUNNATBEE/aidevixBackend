# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile-leaderboard.spec.ts >> Gamification >> referral page loads
- Location: e2e\profile-leaderboard.spec.ts:126:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/referral", waiting until "load"

```

# Page snapshot

```yaml
- main [ref=e2]
```

# Test source

```ts
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
> 127 |     await loggedInPage.goto(ROUTES.REFERRAL);
      |                        ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
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