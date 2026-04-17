/** Test constants — keep in sync with src/utils/constants.ts */

export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SUBSCRIPTION: '/subscription',
  LEADERBOARD: '/leaderboard',
  CHALLENGES: '/challenges',
  CAREERS: '/careers',
  PRICING: '/pricing',
  REFERRAL: '/referral',
  FORGOT_PASSWORD: '/forgot-password',
  ABOUT: '/about',
  CONTACT: '/contact',
  HELP: '/help',
  BLOG: '/blog',
  VIDEOS: '/videos',
} as const;

export const TEST_USER = {
  email: 'test@aidevix.uz',
  password: 'Test123456',
  username: 'testuser',
};

export const TEST_ADMIN = {
  email: 'admin@aidevix.uz',
  password: 'Admin123456',
};

export const TIMEOUTS = {
  PAGE_LOAD: 30_000,
  ANIMATION: 5_000,
  API_RESPONSE: 15_000,
  SKELETON: 10_000,
} as const;

export const SELECTORS = {
  // Navbar
  NAVBAR: 'nav, header, [class*="navbar"], [class*="Navbar"]',
  NAV_LOGO: 'a[href="/"]',
  NAV_COURSES_LINK: 'a[href="/courses"]',
  NAV_LEADERBOARD_LINK: 'a[href="/leaderboard"]',
  NAV_LOGIN_BTN: 'a[href="/login"]',
  NAV_REGISTER_BTN: 'a[href="/register"]',
  MOBILE_MENU_BTN: 'button:has(svg)',

  // Auth
  EMAIL_INPUT: 'input[type="email"]',
  PASSWORD_INPUT: 'input[type="password"]',
  SUBMIT_BTN: 'button[type="submit"]',
  AUTH_ERROR: '.alert-error, [class*="error"]',

  // Courses
  COURSE_CARD: '[class*="CourseCard"], [class*="course-card"], a[href^="/courses/"]',
  COURSE_SEARCH: 'input[placeholder*="qidirish"], input[placeholder*="search"]',
  COURSE_FILTER: '[class*="CourseFilter"], [class*="filter"]',

  // Videos
  VIDEO_CARD: '[class*="VideoCard"], [class*="video-card"], a[href^="/videos/"]',

  // Common
  SKELETON: '.skeleton, [class*="skeleton"], .animate-pulse',
  LOADER: '.loading, [class*="loader"], [class*="Loader"]',
  TOAST: '[class*="toast"], [class*="Toaster"]',
  MODAL: '[class*="modal"], [role="dialog"]',
  FOOTER: 'footer, [class*="footer"], [class*="Footer"]',
} as const;
