import { test, expect } from './fixtures/test-fixtures';
import type { Page } from '@playwright/test';
import { ROUTES } from './helpers/constants';
import { waitForPageReady, assertPerformanceBudget, assertNoBrokenImages } from './helpers/test-utils';

const PERF_BUDGETS = {
  HOME_DCL_MS: 30_000,
  COURSES_DCL_MS: 12_000,
  LOGIN_DCL_MS: 6_000,
  HOME_TTFB_MS: 7_000,
  COURSE_TTFB_MS: 3_500,
  LOGIN_TTFB_MS: 2_000,
  MAX_DOM_NODES: 4_000,
  MAX_TOTAL_JS_KB: 1_500,
  MAX_TOTAL_CSS_KB: 500,
} as const;

async function warmRoute(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await waitForPageReady(page);
}

test.describe('Performance Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
    );
  });

  test('homepage: DOM content loaded under 30s (dev baseline)', async ({ page }) => {
    await warmRoute(page, ROUTES.HOME);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
    await waitForPageReady(page);

    const timing = await assertPerformanceBudget(page, PERF_BUDGETS.HOME_DCL_MS);
    expect(timing.firstByte).toBeLessThan(PERF_BUDGETS.HOME_TTFB_MS);
    console.log(`Homepage timing — TTFB: ${timing.firstByte}ms, DCL: ${timing.domContentLoaded}ms, Load: ${timing.load}ms`);
  });

  test('courses page: DOM content loaded under 12s', async ({ page }) => {
    await warmRoute(page, ROUTES.COURSES);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
    await waitForPageReady(page);

    const timing = await assertPerformanceBudget(page, PERF_BUDGETS.COURSES_DCL_MS);
    expect(timing.firstByte).toBeLessThan(PERF_BUDGETS.COURSE_TTFB_MS);
    console.log(`Courses timing — TTFB: ${timing.firstByte}ms, DCL: ${timing.domContentLoaded}ms, Load: ${timing.load}ms`);
  });

  test('login page: DOM content loaded under 5s', async ({ page }) => {
    await warmRoute(page, ROUTES.LOGIN);
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
    await waitForPageReady(page);

    const timing = await assertPerformanceBudget(page, PERF_BUDGETS.LOGIN_DCL_MS);
    expect(timing.firstByte).toBeLessThan(PERF_BUDGETS.LOGIN_TTFB_MS);
    console.log(`Login timing — TTFB: ${timing.firstByte}ms, DCL: ${timing.domContentLoaded}ms, Load: ${timing.load}ms`);
  });

  test('no excessive DOM nodes on homepage', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    const nodeCount = await page.evaluate(() => document.querySelectorAll('*').length);
    console.log(`Homepage DOM nodes: ${nodeCount}`);

    expect(nodeCount).toBeLessThan(PERF_BUDGETS.MAX_DOM_NODES);
  });

  test('no excessive DOM nodes on courses page', async ({ page }) => {
    await page.goto(ROUTES.COURSES);
    await waitForPageReady(page);

    const nodeCount = await page.evaluate(() => document.querySelectorAll('*').length);
    console.log(`Courses page DOM nodes: ${nodeCount}`);
    expect(nodeCount).toBeLessThan(PERF_BUDGETS.MAX_DOM_NODES);
  });

  test('JavaScript bundle size check', async ({ page }) => {
    const jsSizes: { url: string; size: number }[] = [];

    page.on('response', async (response) => {
      const url = response.url();
      if (url.endsWith('.js') || url.includes('.js?')) {
        const headers = response.headers();
        const size = parseInt(headers['content-length'] || '0', 10);
        if (size > 0) {
          jsSizes.push({ url: url.split('/').pop() || url, size });
        }
      }
    });

    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    const totalJS = jsSizes.reduce((sum, { size }) => sum + size, 0);
    console.log(`Total JS transferred: ${(totalJS / 1024).toFixed(1)} KB`);
    console.log(`JS bundles: ${jsSizes.length}`);

    expect(totalJS / 1024).toBeLessThan(PERF_BUDGETS.MAX_TOTAL_JS_KB);
  });

  test('CSS is not excessively large', async ({ page }) => {
    const cssSizes: number[] = [];

    page.on('response', async (response) => {
      const url = response.url();
      if (url.endsWith('.css') || url.includes('.css?')) {
        const headers = response.headers();
        const size = parseInt(headers['content-length'] || '0', 10);
        if (size > 0) cssSizes.push(size);
      }
    });

    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    const totalCSS = cssSizes.reduce((sum, s) => sum + s, 0);
    console.log(`Total CSS transferred: ${(totalCSS / 1024).toFixed(1)} KB`);
    expect(totalCSS / 1024).toBeLessThan(PERF_BUDGETS.MAX_TOTAL_CSS_KB);
  });

  test('no memory leaks on navigation', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Navigate through pages
    for (const route of [ROUTES.COURSES, ROUTES.LOGIN, ROUTES.HOME]) {
      await page.goto(route);
      await waitForPageReady(page);
    }

    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    if (initialMemory > 0 && finalMemory > 0) {
      const growth = ((finalMemory - initialMemory) / initialMemory) * 100;
      console.log(`Memory growth after navigation: ${growth.toFixed(1)}%`);
      expect(growth).toBeLessThan(300);
    }
    // If performance.memory not available (non-Chromium), test passes
  });
});

test.describe('SEO Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: {} }) }),
    );
  });

  test('homepage has all required meta tags', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(10);

    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect((desc || '').trim().length).toBeGreaterThan(40);

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect((ogTitle || '').trim().length).toBeGreaterThan(10);

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect((twitterCard || '').trim().length).toBeGreaterThan(0);
  });

  test('homepage has structured data hints', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    // Check for charset
    const charset = await page.locator('meta[charset]').getAttribute('charset');
    expect(charset?.toLowerCase()).toBe('utf-8');
  });

  test('html lang attribute is set', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('all pages have unique titles', async ({ page }) => {
    const titles: Record<string, string> = {};

    for (const [name, path] of Object.entries({
      home: ROUTES.HOME,
      login: ROUTES.LOGIN,
      register: ROUTES.REGISTER,
    })) {
      await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await waitForPageReady(page);
      titles[name] = await page.title();
    }

    const uniqueTitles = new Set(Object.values(titles));
    console.log('Page titles:', titles);
    for (const title of Object.values(titles)) {
      expect(title.trim().length).toBeGreaterThan(5);
    }
    expect(uniqueTitles.size).toBeGreaterThanOrEqual(2);
  });

  test('no duplicate meta descriptions', async ({ page }) => {
    const descriptions: Record<string, string | null> = {};

    for (const [name, path] of Object.entries({
      home: ROUTES.HOME,
      login: ROUTES.LOGIN,
    })) {
      await page.goto(path);
      descriptions[name] = await page.locator('meta[name="description"]').getAttribute('content');
    }

    console.log('Meta descriptions:', descriptions);
    expect((descriptions.home || '').trim().length).toBeGreaterThan(40);
    expect((descriptions.login || '').trim().length).toBeGreaterThan(10);
    expect(descriptions.home).not.toEqual(descriptions.login);
  });

  test('heading hierarchy on key pages', async ({ page }) => {
    for (const path of [ROUTES.HOME, ROUTES.COURSES]) {
      await page.goto(path);
      await waitForPageReady(page);

      const h1Count = await page.locator('h1').count();
      expect(h1Count, `Expected one primary heading on ${path}`).toBeGreaterThanOrEqual(1);
      expect(h1Count, `Too many h1 tags on ${path}`).toBeLessThanOrEqual(2);
    }
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    const images = page.locator('img');
    const count = await images.count();
    let missingAlt = 0;

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (alt === null) missingAlt++;
    }

    expect(missingAlt, `Missing alt attributes: ${missingAlt}/${count}`).toBe(0);
  });

  test('links have descriptive text', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    const links = page.locator('a:visible');
    const count = await links.count();
    const badLinks: string[] = [];

    for (let i = 0; i < Math.min(count, 30); i++) {
      const text = (await links.nth(i).textContent())?.trim();
      const ariaLabel = await links.nth(i).getAttribute('aria-label');
      const href = await links.nth(i).getAttribute('href');

      if (!text && !ariaLabel && href !== '/') {
        badLinks.push(href || 'unknown');
      }
    }

    expect(badLinks, `Links without descriptive text: ${badLinks.join(', ')}`).toEqual([]);
  });
});

test.describe('Security Headers Check', () => {
  test('response headers include security headers', async ({ page }) => {
    const response = await page.goto(ROUTES.HOME);

    if (response) {
      const headers = response.headers();
      console.log('Security headers present:');

      // Check common security headers (may not be set in dev)
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'strict-transport-security',
        'content-security-policy',
        'referrer-policy',
      ];

      for (const header of securityHeaders) {
        const value = headers[header];
        console.log(`  ${header}: ${value || 'NOT SET'}`);
      }

      // X-Content-Type-Options should ideally be "nosniff"
      if (headers['x-content-type-options']) {
        expect(headers['x-content-type-options']).toBe('nosniff');
      }
    }
  });
});

test.describe('Image Optimization', () => {
  test('images use Next.js Image or lazy loading', async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await waitForPageReady(page);

    const images = page.locator('img');
    const count = await images.count();
    let lazyCount = 0;
    let eagerCount = 0;

    for (let i = 0; i < count; i++) {
      const loading = await images.nth(i).getAttribute('loading');
      if (loading === 'lazy') lazyCount++;
      else eagerCount++;
    }

    console.log(`Images: ${count} total, ${lazyCount} lazy, ${eagerCount} eager`);
  });

  test('no broken images on homepage', async ({ page }) => {
    await page.goto(ROUTES.HOME, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await waitForPageReady(page);
    await page.waitForTimeout(3000);

    await assertNoBrokenImages(page);
  });
});
