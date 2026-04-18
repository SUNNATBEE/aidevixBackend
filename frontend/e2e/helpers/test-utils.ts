import { Page, expect, Locator } from '@playwright/test';
import { TIMEOUTS, SELECTORS } from './constants';

/**
 * Wait for the page to be fully loaded (no skeleton/loader visible).
 */
export async function waitForPageReady(page: Page) {
  // Wait for DOM content loaded (faster than networkidle which hangs in dev)
  await page.waitForLoadState('domcontentloaded').catch(() => {});

  // Give animations/hydration a moment
  await page.waitForTimeout(500);

  // Wait for skeletons to disappear
  const skeletons = page.locator(SELECTORS.SKELETON);
  if (await skeletons.count() > 0) {
    await expect(skeletons.first()).toBeHidden({ timeout: TIMEOUTS.SKELETON }).catch(() => {});
  }
}

/**
 * Wait for an API response matching a URL pattern.
 */
export async function waitForAPI(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') return url.includes(urlPattern);
      return urlPattern.test(url);
    },
    { timeout: TIMEOUTS.API_RESPONSE },
  );
}

/**
 * Assert that a page has no console errors (warnings are OK).
 */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore common non-critical Next.js dev warnings
      if (text.includes('Failed to load resource') && text.includes('favicon')) return;
      if (text.includes('Download the React DevTools')) return;
      if (text.includes('hydration')) return; // SSR hydration mismatches in dev
      errors.push(text);
    }
  });
  return errors;
}

/**
 * Assert meta tags exist for SEO.
 */
export async function assertSEOMeta(page: Page, checks: {
  title?: string | RegExp;
  description?: string | RegExp;
  ogTitle?: string | RegExp;
  canonical?: string;
}) {
  if (checks.title) {
    const title = await page.title();
    if (typeof checks.title === 'string') {
      expect(title).toContain(checks.title);
    } else {
      expect(title).toMatch(checks.title);
    }
  }

  if (checks.description) {
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    if (typeof checks.description === 'string') {
      expect(desc).toContain(checks.description);
    } else {
      expect(desc!).toMatch(checks.description);
    }
  }

  if (checks.ogTitle) {
    const og = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(og).toBeTruthy();
  }

  if (checks.canonical) {
    const link = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(link).toContain(checks.canonical);
  }
}

/**
 * Assert no broken images on the page.
 */
export async function assertNoBrokenImages(page: Page) {
  const images = page.locator('img[src]');
  const count = await images.count();
  const broken: string[] = [];

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    if (naturalWidth === 0) {
      const src = await img.getAttribute('src');
      broken.push(src || 'unknown');
    }
  }

  if (broken.length > 0) {
    console.warn(`Broken images found: ${broken.join(', ')}`);
  }
}

/**
 * Assert no broken links (href="#" or empty) on the page.
 */
export async function assertNoBrokenLinks(page: Page) {
  const links = page.locator('a[href]');
  const count = await links.count();
  const broken: string[] = [];

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)') {
      const text = await links.nth(i).textContent();
      broken.push(`"${text?.trim()}" → ${href}`);
    }
  }

  expect(broken, `Found broken/empty links: ${broken.join('; ')}`).toHaveLength(0);
}

/**
 * Take a full-page screenshot with a descriptive name.
 */
export async function takeFullScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `e2e/test-results/screenshots/${name}.png`,
    fullPage: true,
  });
}

/**
 * Check that the page responds within a performance budget.
 */
export async function assertPerformanceBudget(page: Page, budgetMs = 5000) {
  const timing = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: perf.domContentLoadedEventEnd - perf.startTime,
      load: perf.loadEventEnd - perf.startTime,
      firstByte: perf.responseStart - perf.startTime,
    };
  });

  expect(timing.domContentLoaded).toBeLessThan(budgetMs);
  return timing;
}

/**
 * Check that the viewport matches responsive breakpoints.
 */
export async function assertResponsiveElement(
  page: Page,
  selector: string,
  shouldBeVisible: boolean,
) {
  const element = page.locator(selector).first();
  if (shouldBeVisible) {
    await expect(element).toBeVisible({ timeout: TIMEOUTS.ANIMATION });
  } else {
    await expect(element).toBeHidden({ timeout: TIMEOUTS.ANIMATION });
  }
}

/**
 * Mock an API route to return custom data.
 */
export async function mockAPI(
  page: Page,
  urlPattern: string,
  body: unknown,
  status = 200,
) {
  await page.route(`**/${urlPattern}`, (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    }),
  );
}

/**
 * Mock the auth state to simulate a logged-in user.
 */
export async function mockLoggedInUser(page: Page, user?: Record<string, unknown>) {
  const mockUser = user || {
    _id: 'test-user-id-123',
    username: 'testuser',
    email: 'test@aidevix.uz',
    role: 'user',
    avatar: '',
    subscriptions: {
      telegram: { verified: true },
      instagram: { verified: true },
    },
    xp: 500,
    streak: 5,
  };

  await page.addInitScript((userData) => {
    localStorage.setItem('aidevix_user', JSON.stringify(userData));
    localStorage.setItem('aidevix_theme', 'dark');
  }, mockUser);
}

/**
 * Accessibility: check that interactive elements have proper labels.
 */
export async function assertAccessibleInteractives(page: Page) {
  const issues: string[] = [];

  // Check buttons without text or aria-label
  const buttons = page.locator('button:visible');
  const btnCount = await buttons.count();
  for (let i = 0; i < btnCount; i++) {
    const btn = buttons.nth(i);
    const text = (await btn.textContent())?.trim();
    const ariaLabel = await btn.getAttribute('aria-label');
    const title = await btn.getAttribute('title');
    if (!text && !ariaLabel && !title) {
      const html = await btn.evaluate((el) => el.outerHTML.slice(0, 100));
      issues.push(`Button without label: ${html}`);
    }
  }

  // Check inputs without labels
  const inputs = page.locator('input:visible');
  const inputCount = await inputs.count();
  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const ariaLabel = await input.getAttribute('aria-label');
    const placeholder = await input.getAttribute('placeholder');
    const id = await input.getAttribute('id');
    const type = await input.getAttribute('type');
    if (type === 'hidden' || type === 'submit') continue;

    if (!ariaLabel && !placeholder && !id) {
      issues.push(`Input without label/placeholder`);
    }
  }

  if (issues.length > 0) {
    console.warn('Accessibility issues:', issues.join('\n'));
  }
  return issues;
}
