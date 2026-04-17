# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> Homepage — Performance >> page loads within performance budget
- Location: e2e\homepage.spec.ts:262:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/", waiting until "load"

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
  218 | 
  219 |     if (count > 0) {
  220 |       // First CTA should be clickable
  221 |       await expect(ctaButtons.first()).toBeEnabled();
  222 |     }
  223 |   });
  224 | });
  225 | 
  226 | test.describe('Homepage — Responsive', () => {
  227 |   test.beforeEach(async ({ page }) => {
  228 |     await page.route('**/api/**', (route) => {
  229 |       const url = route.request().url();
  230 |       if (url.includes('courses/top')) {
  231 |         return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) });
  232 |       }
  233 |       if (url.includes('videos/top')) {
  234 |         return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_VIDEOS) });
  235 |       }
  236 |       return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) });
  237 |     });
  238 |   });
  239 | 
  240 |   test('mobile: hamburger menu appears on small screens', async ({ page }) => {
  241 |     await page.setViewportSize({ width: 375, height: 812 });
  242 |     await page.goto(ROUTES.HOME);
  243 |     await waitForPageReady(page);
  244 | 
  245 |     // Should see hamburger menu button on mobile
  246 |     const menuBtns = page.locator('button').filter({ has: page.locator('svg') });
  247 |     const count = await menuBtns.count();
  248 |     expect(count).toBeGreaterThan(0);
  249 |   });
  250 | 
  251 |   test('desktop: nav links visible on large screens', async ({ page }) => {
  252 |     await page.setViewportSize({ width: 1440, height: 900 });
  253 |     await page.goto(ROUTES.HOME);
  254 |     await waitForPageReady(page);
  255 | 
  256 |     const nav = page.locator(SELECTORS.NAVBAR).first();
  257 |     await expect(nav).toBeVisible();
  258 |   });
  259 | });
  260 | 
  261 | test.describe('Homepage — Performance', () => {
  262 |   test('page loads within performance budget', async ({ page }) => {
  263 |     await page.route('**/api/**', (route) =>
  264 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  265 |     );
  266 | 
> 267 |     await page.goto(ROUTES.HOME);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  268 |     await waitForPageReady(page);
  269 | 
  270 |     const timing = await assertPerformanceBudget(page, 8000); // 8s budget for dev
  271 |     expect(timing.firstByte).toBeLessThan(3000);
  272 |   });
  273 | 
  274 |   test('no critical console errors', async ({ page }) => {
  275 |     const errors = collectConsoleErrors(page);
  276 | 
  277 |     await page.route('**/api/**', (route) =>
  278 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  279 |     );
  280 | 
  281 |     await page.goto(ROUTES.HOME);
  282 |     await waitForPageReady(page);
  283 | 
  284 |     // Filter out expected dev-mode warnings
  285 |     const criticalErrors = errors.filter(
  286 |       (e) => !e.includes('favicon') && !e.includes('DevTools') && !e.includes('hydration'),
  287 |     );
  288 | 
  289 |     if (criticalErrors.length > 0) {
  290 |       console.warn('Console errors:', criticalErrors);
  291 |     }
  292 |   });
  293 | });
  294 | 
```