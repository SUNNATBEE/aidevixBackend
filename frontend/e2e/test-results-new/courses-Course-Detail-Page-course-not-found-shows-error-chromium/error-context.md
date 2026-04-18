# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: courses.spec.ts >> Course Detail Page >> course not found shows error
- Location: e2e\courses.spec.ts:193:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/courses/nonexistent", waiting until "load"

```

# Test source

```ts
  102 |     await waitForPageReady(page);
  103 | 
  104 |     // Wait for skeleton to finish
  105 |     await page.waitForTimeout(2000);
  106 | 
  107 |     // Should show course cards or links to courses
  108 |     const cards = page.locator('a[href^="/courses/"]');
  109 |     const count = await cards.count();
  110 |     expect(count).toBeGreaterThanOrEqual(0); // May have mock data or not
  111 |   });
  112 | 
  113 |   test('filter toggle works on mobile', async ({ page }) => {
  114 |     await page.setViewportSize({ width: 375, height: 812 });
  115 |     await page.goto(ROUTES.COURSES);
  116 |     await waitForPageReady(page);
  117 | 
  118 |     // Filter button should be visible on mobile
  119 |     const filterBtn = page.locator('button').filter({ hasText: /filter/i }).first();
  120 |     if (await filterBtn.isVisible().catch(() => false)) {
  121 |       await filterBtn.click();
  122 |       await page.waitForTimeout(500);
  123 |       // Filter panel should appear
  124 |     }
  125 |   });
  126 | 
  127 |   test('pagination: "Yana yuklash" button works', async ({ page }) => {
  128 |     // Mock with multiple pages
  129 |     await page.route('**/api/**/courses?*', (route) =>
  130 |       route.fulfill({
  131 |         status: 200,
  132 |         contentType: 'application/json',
  133 |         body: JSON.stringify({
  134 |           ...MOCK_COURSES,
  135 |           data: { ...MOCK_COURSES.data, pages: 3, page: 1 },
  136 |         }),
  137 |       }),
  138 |     );
  139 | 
  140 |     await page.goto(ROUTES.COURSES);
  141 |     await waitForPageReady(page);
  142 | 
  143 |     const loadMoreBtn = page.locator('button').filter({ hasText: /yana yuklash/i }).first();
  144 |     if (await loadMoreBtn.isVisible({ timeout: TIMEOUTS.SKELETON }).catch(() => false)) {
  145 |       await loadMoreBtn.click();
  146 |       // Should trigger next page load
  147 |     }
  148 |   });
  149 | });
  150 | 
  151 | test.describe('Course Detail Page', () => {
  152 |   test.beforeEach(async ({ page }) => {
  153 |     await page.route('**/api/**/courses/course-1*', (route) =>
  154 |       route.fulfill({
  155 |         status: 200,
  156 |         contentType: 'application/json',
  157 |         body: JSON.stringify({
  158 |           success: true,
  159 |           data: { course: MOCK_COURSES.data.courses[0] },
  160 |         }),
  161 |       }),
  162 |     );
  163 |     await page.route('**/api/**/courses/course-1/recommended*', (route) =>
  164 |       route.fulfill({
  165 |         status: 200,
  166 |         contentType: 'application/json',
  167 |         body: JSON.stringify({ success: true, data: { courses: MOCK_COURSES.data.courses.slice(1) } }),
  168 |       }),
  169 |     );
  170 |     await page.route('**/api/**/videos/course/course-1*', (route) =>
  171 |       route.fulfill({
  172 |         status: 200,
  173 |         contentType: 'application/json',
  174 |         body: JSON.stringify({ success: true, data: { videos: [] } }),
  175 |       }),
  176 |     );
  177 |     await page.route('**/api/**/auth/me*', (route) =>
  178 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  179 |     );
  180 |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  181 |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  182 |     );
  183 |   });
  184 | 
  185 |   test('course detail page loads', async ({ page }) => {
  186 |     await page.goto('/courses/course-1');
  187 |     await waitForPageReady(page);
  188 | 
  189 |     // Should not be a 404
  190 |     await expect(page).not.toHaveTitle(/404/i);
  191 |   });
  192 | 
  193 |   test('course not found shows error', async ({ page }) => {
  194 |     await page.route('**/api/**/courses/nonexistent*', (route) =>
  195 |       route.fulfill({
  196 |         status: 404,
  197 |         contentType: 'application/json',
  198 |         body: JSON.stringify({ success: false, message: 'Kurs topilmadi' }),
  199 |       }),
  200 |     );
  201 | 
> 202 |     await page.goto('/courses/nonexistent');
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  203 |     await waitForPageReady(page);
  204 | 
  205 |     // Should show some error state or 404
  206 |     await page.waitForTimeout(2000);
  207 |   });
  208 | });
  209 | 
```