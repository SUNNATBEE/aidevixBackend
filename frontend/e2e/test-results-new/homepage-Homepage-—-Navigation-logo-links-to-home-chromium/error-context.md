# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> Homepage — Navigation >> logo links to home
- Location: e2e\homepage.spec.ts:116:7

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
  17  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) }),
  18  |     );
  19  |     await page.route('**/api/**/videos/top*', (route) =>
  20  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) }),
  21  |     );
  22  |     await page.route('**/api/**/auth/me*', (route) =>
  23  |       route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
  24  |     );
  25  |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  26  |       route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false }) }),
  27  |     );
  28  |   });
  29  | 
  30  |   test('homepage loads successfully', async ({ page }) => {
  31  |     await page.goto(ROUTES.HOME);
  32  |     await waitForPageReady(page);
  33  | 
  34  |     // Page should not show error state
  35  |     await expect(page).not.toHaveTitle(/error|500|404/i);
  36  |   });
  37  | 
  38  |   test('has correct SEO meta tags', async ({ page }) => {
  39  |     await page.goto(ROUTES.HOME);
  40  |     await waitForPageReady(page);
  41  | 
  42  |     await assertSEOMeta(page, {
  43  |       title: /Aidevix/i,
  44  |       description: /dasturlash|o.*quv|platforma/i,
  45  |       ogTitle: /Aidevix/i,
  46  |     });
  47  |   });
  48  | 
  49  |   test('has proper Open Graph tags', async ({ page }) => {
  50  |     await page.goto(ROUTES.HOME);
  51  | 
  52  |     const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
  53  |     expect(ogType).toBe('website');
  54  | 
  55  |     const ogLocale = await page.locator('meta[property="og:locale"]').getAttribute('content');
  56  |     expect(ogLocale).toBe('uz_UZ');
  57  | 
  58  |     const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
  59  |     expect(ogSiteName).toBe('Aidevix');
  60  |   });
  61  | 
  62  |   test('has Twitter Card meta tags', async ({ page }) => {
  63  |     await page.goto(ROUTES.HOME);
  64  | 
  65  |     const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
  66  |     expect(twitterCard).toBe('summary_large_image');
  67  |   });
  68  | 
  69  |   test('has proper robots meta', async ({ page }) => {
  70  |     await page.goto(ROUTES.HOME);
  71  | 
  72  |     // Should be indexable
  73  |     const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  74  |     expect(robots).toContain('index');
  75  |     expect(robots).toContain('follow');
  76  |   });
  77  | 
  78  |   test('viewport meta is set correctly', async ({ page }) => {
  79  |     await page.goto(ROUTES.HOME);
  80  | 
  81  |     const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  82  |     expect(viewport).toContain('width=device-width');
  83  |   });
  84  | 
  85  |   test('has favicon', async ({ page }) => {
  86  |     await page.goto(ROUTES.HOME);
  87  |     const favicon = page.locator('link[rel="icon"], link[rel="shortcut icon"]');
  88  |     await expect(favicon.first()).toHaveAttribute('href', /favicon/i);
  89  |   });
  90  | });
  91  | 
  92  | test.describe('Homepage — Navigation', () => {
  93  |   test.beforeEach(async ({ page }) => {
  94  |     await page.route('**/api/**/courses/top*', (route) =>
  95  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) }),
  96  |     );
  97  |     await page.route('**/api/**/videos/top*', (route) =>
  98  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) }),
  99  |     );
  100 |     await page.route('**/api/**/auth/me*', (route) =>
  101 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  102 |     );
  103 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  104 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  105 |     );
  106 |   });
  107 | 
  108 |   test('navbar is visible', async ({ page }) => {
  109 |     await page.goto(ROUTES.HOME);
  110 |     await waitForPageReady(page);
  111 | 
  112 |     const nav = page.locator(SELECTORS.NAVBAR).first();
  113 |     await expect(nav).toBeVisible();
  114 |   });
  115 | 
  116 |   test('logo links to home', async ({ page }) => {
> 117 |     await page.goto(ROUTES.HOME);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  118 |     await waitForPageReady(page);
  119 | 
  120 |     const logoLink = page.locator('a[href="/"]').first();
  121 |     await expect(logoLink).toBeVisible();
  122 |   });
  123 | 
  124 |   test('nav links to courses', async ({ page }) => {
  125 |     await page.goto(ROUTES.HOME);
  126 |     await waitForPageReady(page);
  127 | 
  128 |     const coursesLink = page.locator('a[href="/courses"]').first();
  129 |     if (await coursesLink.isVisible()) {
  130 |       await coursesLink.click();
  131 |       await page.waitForURL('**/courses', { timeout: TIMEOUTS.PAGE_LOAD });
  132 |     }
  133 |   });
  134 | 
  135 |   test('nav shows login/register for unauthenticated user', async ({ page }) => {
  136 |     await page.goto(ROUTES.HOME);
  137 |     await waitForPageReady(page);
  138 | 
  139 |     // Should show auth buttons somewhere on page
  140 |     const loginLink = page.locator('a[href="/login"]');
  141 |     const registerLink = page.locator('a[href="/register"]');
  142 | 
  143 |     const hasLogin = await loginLink.count() > 0;
  144 |     const hasRegister = await registerLink.count() > 0;
  145 | 
  146 |     expect(hasLogin || hasRegister).toBeTruthy();
  147 |   });
  148 | 
  149 |   test('footer is visible', async ({ page }) => {
  150 |     await page.goto(ROUTES.HOME);
  151 |     await waitForPageReady(page);
  152 | 
  153 |     const footer = page.locator(SELECTORS.FOOTER).first();
  154 |     await expect(footer).toBeVisible();
  155 |   });
  156 | 
  157 |   test('footer contains social links', async ({ page }) => {
  158 |     await page.goto(ROUTES.HOME);
  159 |     await waitForPageReady(page);
  160 | 
  161 |     // Footer should have telegram and instagram links
  162 |     const telegramLink = page.locator('a[href*="t.me"]').first();
  163 |     const instagramLink = page.locator('a[href*="instagram"]').first();
  164 | 
  165 |     const hasTelegram = await telegramLink.count() > 0;
  166 |     const hasInstagram = await instagramLink.count() > 0;
  167 | 
  168 |     expect(hasTelegram || hasInstagram).toBeTruthy();
  169 |   });
  170 | });
  171 | 
  172 | test.describe('Homepage — Content', () => {
  173 |   test.beforeEach(async ({ page }) => {
  174 |     await page.route('**/api/**/courses/top*', (route) =>
  175 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) }),
  176 |     );
  177 |     await page.route('**/api/**/videos/top*', (route) =>
  178 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) }),
  179 |     );
  180 |     await page.route('**/api/**/auth/me*', (route) =>
  181 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  182 |     );
  183 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  184 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  185 |     );
  186 |   });
  187 | 
  188 |   test('displays hero section', async ({ page }) => {
  189 |     await page.goto(ROUTES.HOME);
  190 |     await waitForPageReady(page);
  191 | 
  192 |     // Hero should have heading with Aidevix or relevant text
  193 |     const heading = page.locator('h1, h2').first();
  194 |     await expect(heading).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  195 |   });
  196 | 
  197 |   test('displays course cards', async ({ page }) => {
  198 |     await page.goto(ROUTES.HOME);
  199 |     await waitForPageReady(page);
  200 | 
  201 |     // Wait for content to load
  202 |     await page.waitForTimeout(2000);
  203 | 
  204 |     // Should show course-related content
  205 |     const courseSection = page.locator('text=/kurs/i').first();
  206 |     if (await courseSection.isVisible()) {
  207 |       expect(true).toBeTruthy();
  208 |     }
  209 |   });
  210 | 
  211 |   test('CTA buttons are clickable', async ({ page }) => {
  212 |     await page.goto(ROUTES.HOME);
  213 |     await waitForPageReady(page);
  214 | 
  215 |     // Find primary CTA buttons
  216 |     const ctaButtons = page.locator('a.btn, button.btn').filter({ hasText: /boshlash|kurslar|ro.*yxat/i });
  217 |     const count = await ctaButtons.count();
```