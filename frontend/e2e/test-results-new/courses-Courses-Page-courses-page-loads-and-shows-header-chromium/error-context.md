# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: courses.spec.ts >> Courses Page >> courses page loads and shows header
- Location: e2e\courses.spec.ts:34:7

# Error details

```
TimeoutError: page.goto: Timeout 15000ms exceeded.
Call log:
  - navigating to "http://localhost:3001/courses", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from './fixtures/test-fixtures';
  2   | import { ROUTES, SELECTORS, TIMEOUTS } from './helpers/constants';
  3   | import { MOCK_COURSES, MOCK_CATEGORIES, MOCK_TOP_COURSES } from './fixtures/mock-data';
  4   | import { waitForPageReady, mockAPI } from './helpers/test-utils';
  5   | 
  6   | test.describe('Courses Page', () => {
  7   |   test.beforeEach(async ({ page }) => {
  8   |     await page.route('**/api/**/courses?*', (route) =>
  9   |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_COURSES) }),
  10  |     );
  11  |     await page.route('**/api/**/courses', (route) => {
  12  |       if (route.request().method() === 'GET') {
  13  |         return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_COURSES) });
  14  |       }
  15  |       return route.continue();
  16  |     });
  17  |     await page.route('**/api/**/courses/categories*', (route) =>
  18  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_CATEGORIES) }),
  19  |     );
  20  |     await page.route('**/api/**/courses/top*', (route) =>
  21  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_TOP_COURSES) }),
  22  |     );
  23  |     await page.route('**/api/**/courses/filter-counts*', (route) =>
  24  |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
  25  |     );
  26  |     await page.route('**/api/**/auth/me*', (route) =>
  27  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  28  |     );
  29  |     await page.route('**/api/**/auth/refresh-token*', (route) =>
  30  |       route.fulfill({ status: 401, body: JSON.stringify({ success: false }) }),
  31  |     );
  32  |   });
  33  | 
  34  |   test('courses page loads and shows header', async ({ page }) => {
> 35  |     await page.goto(ROUTES.COURSES);
      |                ^ TimeoutError: page.goto: Timeout 15000ms exceeded.
  36  |     await waitForPageReady(page);
  37  | 
  38  |     // Should have "Kurslar" heading
  39  |     await expect(page.locator('h1').first()).toBeVisible({ timeout: TIMEOUTS.SKELETON });
  40  |   });
  41  | 
  42  |   test('shows course count badge', async ({ page }) => {
  43  |     await page.goto(ROUTES.COURSES);
  44  |     await waitForPageReady(page);
  45  | 
  46  |     // Should show total count
  47  |     const countBadge = page.locator('text=/\\d+\\s*kurs/i').first();
  48  |     if (await countBadge.isVisible({ timeout: 3000 }).catch(() => false)) {
  49  |       const text = await countBadge.textContent();
  50  |       expect(text).toMatch(/\d+/);
  51  |     }
  52  |   });
  53  | 
  54  |   test('search input is functional', async ({ page }) => {
  55  |     await page.goto(ROUTES.COURSES);
  56  |     await waitForPageReady(page);
  57  | 
  58  |     const searchInput = page.locator('input[placeholder*="qidirish"], input[placeholder*="Kurs"]').first();
  59  |     await expect(searchInput).toBeVisible({ timeout: TIMEOUTS.SKELETON });
  60  | 
  61  |     await searchInput.fill('React');
  62  | 
  63  |     // Should trigger a search (debounced)
  64  |     await page.waitForTimeout(600);
  65  | 
  66  |     // Clear button should appear
  67  |     const clearBtn = page.locator('button').filter({ has: page.locator('svg') });
  68  |     const count = await clearBtn.count();
  69  |     expect(count).toBeGreaterThan(0);
  70  |   });
  71  | 
  72  |   test('search with no results shows empty state', async ({ page }) => {
  73  |     // Override mock for empty results
  74  |     await page.route('**/api/**/courses?*', (route) => {
  75  |       const url = route.request().url();
  76  |       if (url.includes('search=nonexistent')) {
  77  |         return route.fulfill({
  78  |           status: 200,
  79  |           contentType: 'application/json',
  80  |           body: JSON.stringify({ success: true, data: { courses: [], total: 0, page: 1, pages: 0 } }),
  81  |         });
  82  |       }
  83  |       return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_COURSES) });
  84  |     });
  85  | 
  86  |     await page.goto(ROUTES.COURSES);
  87  |     await waitForPageReady(page);
  88  | 
  89  |     const searchInput = page.locator('input[placeholder*="qidirish"], input[placeholder*="Kurs"]').first();
  90  |     await searchInput.fill('nonexistent');
  91  |     await page.waitForTimeout(600);
  92  | 
  93  |     // Should show "topilmadi" message
  94  |     const emptyMsg = page.locator('text=/topilmadi|mavjud emas/i').first();
  95  |     await expect(emptyMsg).toBeVisible({ timeout: TIMEOUTS.API_RESPONSE }).catch(() => {
  96  |       // OK — component may handle empty differently
  97  |     });
  98  |   });
  99  | 
  100 |   test('course cards are displayed', async ({ page }) => {
  101 |     await page.goto(ROUTES.COURSES);
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
```